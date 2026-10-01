#!/usr/bin/env bash
# Boots a built image and checks it serves: GET /health, the home page, and a
# static asset (proves .next/static and public/ made it into the image).
#
#   deploy/smoke-test.sh <image>          e.g. deploy/smoke-test.sh fameo-web:local
#
# Used by CI on pull requests and by the production workflow before it pushes
# the image to ECR. Needs only Docker. All values below are dummies; no
# upstream API is reachable, so only pages that render without one are checked.
set -euo pipefail

IMAGE="${1:?usage: smoke-test.sh <image>}"
APP="smoke-web-$$"
TIMEOUT_SECONDS=90

cleanup() { docker rm -f "$APP" >/dev/null 2>&1 || true; }
trap cleanup EXIT

docker run -d --name "$APP" \
  --init --cap-drop ALL --security-opt no-new-privileges \
  -e JWT_SECRET=smoke-test-not-a-secret \
  -e API_ORIGIN=https://api.invalid \
  -e APP_ORIGIN=https://app.invalid \
  "$IMAGE" >/dev/null

# Requests run inside the container, so no host port is needed.
get() { docker exec "$APP" wget -qO- "http://127.0.0.1:3000$1"; }

echo "Waiting up to ${TIMEOUT_SECONDS}s for $IMAGE to report healthy..."
deadline=$((SECONDS + TIMEOUT_SECONDS))
while ((SECONDS < deadline)); do
  state=$(docker inspect -f '{{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{end}}' "$APP")
  case "$state" in
    "running healthy")
      get /health
      echo
      # Fetched once into a variable: piping wget into `grep -q` would fail
      # the pipeline (SIGPIPE under pipefail) whenever grep matched early.
      home=$(get /) || home=""
      [[ "$home" == *"<html"* ]] || {
        echo "Smoke test FAILED: / did not return an HTML page." >&2
        exit 1
      }
      asset=$(grep -oE '/_next/static/[^"]+\.(js|css)' <<<"$home" | head -1 || true)
      [[ -n "$asset" ]] && get "$asset" >/dev/null || {
        echo "Smoke test FAILED: static asset ${asset:-<none found>} is not served." >&2
        exit 1
      }
      echo "Smoke test passed: /health, / and $asset are served."
      exit 0
      ;;
    running*) sleep 2 ;;
    *)
      echo "Container stopped (state: $state)." >&2
      break
      ;;
  esac
done

echo "Smoke test FAILED. Last container logs:" >&2
docker logs --tail 50 "$APP" >&2 || true
exit 1
