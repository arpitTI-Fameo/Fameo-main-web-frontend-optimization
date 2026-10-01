#!/usr/bin/env bash
# Deploys one immutable image of fameo-web (Next.js) on the production EC2 host.
#
#   sudo /opt/fameo-web/deploy.sh <git-sha>      (40-character commit SHA)
#
# Delivered and run by the production workflow through AWS SSM Run Command;
# the same file can be run by hand to roll back or redeploy any SHA still in
# ECR. Steps:
#
#   1. pull <ecr>/<repo>:<sha>               nothing changes if this fails
#   2. render runtime env from SSM Parameter Store (SecureString) and check
#      the variables the server cannot run without are present
#   3. stop the running container, keep it as <name>-previous
#   4. start the new container, wait for Docker health + GET /health
#   5. healthy   → remove the previous container, record the release
#      unhealthy → remove the new one, restart the previous one, exit 1
#
# Host settings come from /opt/fameo-web/deploy.conf (DEPLOYMENT.md §4).
# Never prints environment values.
set -euo pipefail

APP=fameo-web
APP_DIR=/opt/$APP
CONF="$APP_DIR/deploy.conf"
CONTAINER_PORT=3000
HEALTH_TIMEOUT_SECONDS=${HEALTH_TIMEOUT_SECONDS:-120}
STOP_TIMEOUT_SECONDS=30
# Next.js boots without these and only fails on the first request that needs
# them, after /health has already passed — so they are checked here instead.
REQUIRED_VARS=(JWT_SECRET API_ORIGIN APP_ORIGIN)

log() { printf '[deploy %s] %s\n' "$(date -u +%H:%M:%S)" "$*"; }
die() {
  log "FAILED: $*"
  exit 1
}

IMAGE_TAG="${1:-}"
[[ "$IMAGE_TAG" =~ ^[0-9a-f]{40}$ ]] || die "usage: deploy.sh <40-character git sha> (got '${IMAGE_TAG}')"
[[ $EUID -eq 0 ]] || die "run as root (sudo)"

# SSM Run Command starts scripts without HOME; docker and the AWS CLI need it.
export HOME="${HOME:-/root}"

[[ -r "$CONF" ]] || die "$CONF is missing (see DEPLOYMENT.md)"
# shellcheck source=/dev/null
source "$CONF"
: "${AWS_REGION:?deploy.conf: AWS_REGION is not set}"
: "${ECR_REGISTRY:?deploy.conf: ECR_REGISTRY is not set}"
: "${ECR_REPOSITORY:?deploy.conf: ECR_REPOSITORY is not set}"
: "${SSM_PARAMETER_PATH:?deploy.conf: SSM_PARAMETER_PATH is not set}"
HOST_PORT="${HOST_PORT:-3000}"

IMAGE="$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"
PREVIOUS="$APP-previous"
ENV_FILE=""

# One deployment at a time on this host (automated and manual alike).
exec 9>"/var/lock/$APP-deploy.lock"
flock -n 9 || die "another deployment is already running on this host"

cleanup() { if [[ -n "$ENV_FILE" ]]; then rm -f "$ENV_FILE"; fi; }
trap cleanup EXIT

# ── 1. pull ──────────────────────────────────────────────────────────────────
log "Pulling $IMAGE"
aws ecr get-login-password --region "$AWS_REGION" |
  docker login --username AWS --password-stdin "$ECR_REGISTRY" >/dev/null 2>&1 ||
  die "could not log in to $ECR_REGISTRY (instance role needs ecr:GetAuthorizationToken)"
docker pull --quiet "$IMAGE" >/dev/null || die "could not pull $IMAGE (not in ECR, or no pull permission)"
docker logout "$ECR_REGISTRY" >/dev/null

# ── 2. runtime environment ───────────────────────────────────────────────────
# Every parameter under SSM_PARAMETER_PATH becomes one variable named after the
# last path segment: /fameo-web/production/JWT_SECRET → JWT_SECRET. Values
# must be single-line (Docker env files cannot hold newlines).
render_env_file() {
  local name value count=0
  ENV_FILE=$(mktemp "$APP_DIR/.env.XXXXXX")
  chmod 600 "$ENV_FILE"
  while IFS=$'\t' read -r name value; do
    [[ "$name" == "$SSM_PARAMETER_PATH/"* ]] ||
      die "unexpected line in SSM output (multi-line parameter value under $SSM_PARAMETER_PATH?)"
    printf '%s=%s\n' "${name##*/}" "$value" >>"$ENV_FILE"
    count=$((count + 1))
  done < <(aws ssm get-parameters-by-path --region "$AWS_REGION" \
    --path "$SSM_PARAMETER_PATH" --with-decryption \
    --query 'Parameters[].[Name,Value]' --output text)
  ((count > 0)) || die "no parameters found under $SSM_PARAMETER_PATH"
  local var missing=()
  for var in "${REQUIRED_VARS[@]}"; do
    grep -q "^$var=." "$ENV_FILE" || missing+=("$var")
  done
  ((${#missing[@]} == 0)) || die "missing in $SSM_PARAMETER_PATH: ${missing[*]}"
  log "Loaded $count runtime parameters from $SSM_PARAMETER_PATH"
}
render_env_file

# ── helpers ──────────────────────────────────────────────────────────────────
container_exists() { docker container inspect "$1" >/dev/null 2>&1; }

# Healthy = Docker's HEALTHCHECK says healthy AND /health answers through the
# published port. Fails fast if the container exits (e.g. env validation).
wait_healthy() {
  local name=$1 state deadline=$((SECONDS + HEALTH_TIMEOUT_SECONDS))
  while ((SECONDS < deadline)); do
    state=$(docker inspect -f '{{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{end}}' "$name")
    case "$state" in
      "running healthy")
        if curl -fsS --max-time 5 "http://127.0.0.1:$HOST_PORT/health" >/dev/null; then
          return 0
        fi
        ;;
      running*) ;;
      *)
        log "$name is not running (state: $state)"
        return 1
        ;;
    esac
    sleep 2
  done
  log "$name did not become healthy within ${HEALTH_TIMEOUT_SECONDS}s"
  return 1
}

start_container() {
  docker run -d --name "$APP" \
    --init \
    --restart unless-stopped \
    --stop-timeout "$STOP_TIMEOUT_SECONDS" \
    --env-file "$ENV_FILE" \
    --publish "127.0.0.1:$HOST_PORT:$CONTAINER_PORT" \
    --cap-drop ALL --security-opt no-new-privileges \
    --log-driver json-file --log-opt max-size=10m --log-opt max-file=5 \
    --label "org.opencontainers.image.revision=$IMAGE_TAG" \
    "$IMAGE" >/dev/null
}

# ── 3. stop the running release, keep it for rollback ───────────────────────
previous_image=""
if container_exists "$PREVIOUS"; then
  log "Removing leftover $PREVIOUS container from an earlier run"
  docker rm -f "$PREVIOUS" >/dev/null
fi
if container_exists "$APP"; then
  previous_image=$(docker inspect -f '{{.Config.Image}}' "$APP")
  log "Stopping current release ($previous_image)"
  docker stop -t "$STOP_TIMEOUT_SECONDS" "$APP" >/dev/null
  docker rename "$APP" "$PREVIOUS"
fi

# ── 4. start the new release ─────────────────────────────────────────────────
log "Starting $IMAGE"
if start_container && wait_healthy "$APP"; then
  rm -f "$ENV_FILE"
  ENV_FILE=""
  # ── 5a. success ────────────────────────────────────────────────────────────
  container_exists "$PREVIOUS" && docker rm "$PREVIOUS" >/dev/null
  [[ -f "$APP_DIR/current" ]] && cp "$APP_DIR/current" "$APP_DIR/previous"
  echo "$IMAGE_TAG" >"$APP_DIR/current"
  echo "$(date -u +%FT%TZ) $IMAGE_TAG" >>"$APP_DIR/releases.log"

  # Keep only the current and previous images locally; ECR keeps the rest.
  keep_previous=$(cat "$APP_DIR/previous" 2>/dev/null || true)
  docker images "$ECR_REGISTRY/$ECR_REPOSITORY" --format '{{.Tag}}' |
    while read -r tag; do
      [[ "$tag" == "$IMAGE_TAG" || "$tag" == "$keep_previous" ]] && continue
      docker rmi "$ECR_REGISTRY/$ECR_REPOSITORY:$tag" >/dev/null 2>&1 || true
    done

  log "SUCCESS: $IMAGE_TAG is live and healthy"
  exit 0
fi

# ── 5b. failure → roll back ──────────────────────────────────────────────────
log "New release failed its health check. Last 50 log lines:"
docker logs --tail 50 "$APP" 2>&1 || true
docker rm -f "$APP" >/dev/null 2>&1 || true

if container_exists "$PREVIOUS"; then
  log "Rolling back to $previous_image"
  docker rename "$PREVIOUS" "$APP"
  docker start "$APP" >/dev/null
  if wait_healthy "$APP"; then
    die "deployment of $IMAGE_TAG failed; rolled back to $previous_image (healthy)"
  fi
  die "deployment of $IMAGE_TAG failed AND rollback to $previous_image is unhealthy — production is DOWN"
fi
die "deployment of $IMAGE_TAG failed; there was no previous release to roll back to"
