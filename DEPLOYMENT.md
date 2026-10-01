# Deployment — fameo-web (production)

The site runs as one Docker container on the **shared production EC2 host**, next to the
backend (`fameo-backend`), behind nginx. Every merge to `main` builds an image tagged with the
commit SHA, pushes it to ECR, and deploys it through AWS Systems Manager. Nothing deploys from
`dev`, from a pull request, or from any other branch. There is no staging pipeline.

The host itself (instance, security group, Elastic IP, Docker, nginx, the host IAM role, the
GitHub OIDC provider) is set up once, as described in the backend repository's `DEPLOYMENT.md`.
This document covers what the frontend adds.

| File | Purpose |
|---|---|
| `Dockerfile`, `.dockerignore` | Production image: `next build` → standalone server, non-root, allowlisted build context |
| `.github/workflows/ci.yml` | `lint:ci`, tests, dependency audit; on PRs also builds and boots the image |
| `.github/workflows/production.yml` | `main` → CI → image → ECR → SSM → EC2 → health check; manual redeploy |
| `deploy/deploy.sh` | Runs on EC2: check secrets, pull SHA, swap container, health-check, auto-rollback |
| `deploy/smoke-test.sh` | Boots an image and checks `/health`, `/` and a static asset |
| `deploy/aws/production.cfn.yml` | ECR repository `fameo-web`, GitHub OIDC roles, host permissions |
| `deploy/nginx/fameo-web.conf` | nginx site: TLS, proxy headers, upload size |
| `src/app/health/route.js` | `GET /health` liveness probe |

---

## 1. Architecture

```
feature/* ──PR──▶ dev ──PR──▶ main
                                │ push (merge)
                                ▼
           GitHub Actions: production.yml   (one run at a time)
            ├─ ci      npm ci · lint:ci · test · npm audit (critical)
            ├─ image   OIDC → push role → docker build (next build, NEXT_PUBLIC_* from
            │          repository variables) → smoke test → push fameo-web:<sha> to ECR
            └─ deploy  environment "production" · OIDC → deploy role
                       → ssm:SendCommand (AWS-RunShellScript) → shared EC2 host
                                │
                                ▼
   /opt/fameo-web/deploy.sh <sha>: pull → env from Parameter Store (refuses if JWT_SECRET,
   API_ORIGIN or APP_ORIGIN is missing) → stop old → start new → healthy? → done / roll back

   Internet ─443─▶ nginx ─┬─ site domain ─▶ 127.0.0.1:3000  fameo-web     (this repo)
                          └─ API domain  ─▶ 127.0.0.1:8000  fameo-backend
```

- **Image identity.** The tag is the full 40-character commit SHA. ECR tags are immutable;
  `latest` is never used.
- **Tested artifact = deployed artifact.** The image is built, booted by
  `deploy/smoke-test.sh`, and only then pushed.
- **Two kinds of configuration.**
  - **Build time:** `NEXT_PUBLIC_*` values are compiled into the JavaScript by `next build`. They
    are public by definition and come from GitHub repository variables (§5). Changing one needs
    a new build (a new merge, or a re-run on `main`), not just a redeploy.
  - **Runtime:** server-only values and secrets (`JWT_SECRET`, `API_ORIGIN`, …) come from SSM
    Parameter Store when the container starts. Changing one needs only a redeploy (§7).
- **Downtime.** The old container stops before the new one starts, so expect a few seconds of
  502s per deploy (measured locally, the new container is healthy about 3–6 s after start).
  Next.js exits immediately on SIGTERM, so requests in flight at that moment are cut.

## 2. AWS resources

Created by `deploy/aws/production.cfn.yml`, after the backend stack (which owns the host role and
the OIDC provider):

| Resource | Name | Notes |
|---|---|---|
| ECR repository | `fameo-web` | Immutable tags, scan on push, keeps the last 30 images |
| IAM role (GitHub, build) | `fameo-web-github-image-push` | Trusted only for `repo:<org>/<repo>:ref:refs/heads/main` |
| IAM role (GitHub, deploy) | `fameo-web-github-deploy` | Trusted only for `repo:<org>/<repo>:environment:production` |
| IAM managed policy | `fameo-web-production-host` | Attached to the host role: pull `fameo-web`, read `/fameo-web/production` |
| SSM parameters | `/fameo-web/production/<VAR>` | Created by you (§4) |

```bash
aws cloudformation deploy \
  --region ap-south-1 \
  --stack-name fameo-web-production \
  --template-file deploy/aws/production.cfn.yml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides GitHubRepo=<repository-name>     # name only; org defaults to Trendlance-Innovations

aws cloudformation describe-stacks --region ap-south-1 \
  --stack-name fameo-web-production --query 'Stacks[0].Outputs'
```

### IAM — what each principal can do

| Principal | Allowed |
|---|---|
| `fameo-web-github-image-push` | `ecr:GetAuthorizationToken`; push to and `DescribeImages` on `fameo-web` only |
| `fameo-web-github-deploy` | `ssm:SendCommand` with `AWS-RunShellScript` **only on instances tagged `FameoHost=production`**; read command results; `ecr:DescribeImages` on `fameo-web` |
| Host role (from the backend stack) + `fameo-web-production-host` | Pull `fameo-web`; `ssm:GetParametersByPath` on `/fameo-web/production`. The backend stack's Deny still blocks every other parameter path |

No principal has `AdministratorAccess` or a long-lived access key. Another repository, a fork,
another branch, or a job outside the `production` environment cannot assume either GitHub role.

## 3. Host setup (once, after the backend's)

In a Session Manager shell on the host:

```bash
sudo install -d -m 700 /opt/fameo-web
sudo tee /opt/fameo-web/deploy.conf >/dev/null <<'EOF'
AWS_REGION=ap-south-1
ECR_REGISTRY=<account-id>.dkr.ecr.ap-south-1.amazonaws.com
ECR_REPOSITORY=fameo-web
SSM_PARAMETER_PATH=/fameo-web/production
HOST_PORT=3000
EOF
sudo chmod 600 /opt/fameo-web/deploy.conf

# nginx site for the website domain (replace fameo.example.com first), then TLS.
sudo cp deploy/nginx/fameo-web.conf /etc/nginx/conf.d/fameo-web.conf
sudo certbot --nginx -d fameo.example.com -d www.fameo.example.com
sudo nginx -t && sudo systemctl reload nginx
```

Point the site's DNS records at the host's Elastic IP. Port 3000 stays closed in the security
group; nginx is the only way in.

## 4. Runtime configuration and secrets (SSM Parameter Store)

One parameter per variable under `/fameo-web/production`, `SecureString` for secrets,
single-line values. `deploy.sh` turns them into the container environment at start and deletes
the temporary file. Nothing secret is in the image, in GitHub, or in logs.

```bash
aws ssm put-parameter --region ap-south-1 --type SecureString \
  --name /fameo-web/production/JWT_SECRET --value '…'
```

| Variable | Required | Notes |
|---|---|---|
| `JWT_SECRET` | **yes** | Same value as Fameoinfo STS and the backend. `deploy.sh` refuses to deploy without it |
| `API_ORIGIN` | **yes** | Main API origin, e.g. `https://api.example.com` (checked by `deploy.sh`) |
| `APP_ORIGIN` | **yes** | Registration backend origin (checked by `deploy.sh`) |
| `REVALIDATE_SECRET` | recommended | Protects `/api/revalidate` |
| `SMARTAUTH_KEY`, `SMARTAUTH_BASE` | for KYC | `SMARTAUTH_BASE` defaults to `https://prod.smartauth.co` |
| `ASSISTANT_ORIGIN` | optional | Support bot; the widget degrades without it |
| `JWT_ISSUER`, `JWT_AUDIENCE` | optional | Only once the STS emits them |
| `TRUSTED_PROXY_HOPS` | leave unset | Default 1 = nginx, the single proxy in front |

The `Dockerfile` sets `NODE_ENV=production`, `PORT=3000` and `HOSTNAME=0.0.0.0`; do not set
them here. Full list with defaults: `src/env.js`.

Next.js starts even when these are missing and only fails on the first request that needs them,
after `/health` has already passed. That is why `deploy.sh` checks the three required ones itself.

## 5. GitHub configuration

**Repository variables** (*Settings → Secrets and variables → Actions → Variables*). The
`NEXT_PUBLIC_*` ones are compiled into the browser code; they are public, never secrets.

| Variable | Example / note |
|---|---|
| `AWS_REGION` | `ap-south-1` |
| `ECR_REPOSITORY` | `fameo-web` |
| `AWS_ECR_PUSH_ROLE_ARN` | stack output `ImagePushRoleArn` |
| `NEXT_PUBLIC_SITE_URL` | `https://fameo.vip` (canonical URL for SEO) |
| `NEXT_PUBLIC_APP_ORIGIN` | the production app origin; **the default is the UAT API** |
| `NEXT_PUBLIC_SOCKET_URL` | the production API origin for socket.io; default is `http://localhost:8000` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | live Razorpay key id (public) |
| `NEXT_PUBLIC_APP_NAME` | optional, default `Fameo` |
| `NEXT_PUBLIC_MAX_ORDER_INR` | optional, default `500000` |
| `NEXT_PUBLIC_LIVEKIT_URL` | optional |
| `NEXT_PUBLIC_PORTAL_MOCK` | **leave unset**: any non-empty value, including `false`, turns into `true` (`z.coerce.boolean`) |

A variable left unset takes its default from `src/env.js`.

**Environment `production`**: deployment branches = `main` only; optional required reviewers.
Variables: `AWS_DEPLOY_ROLE_ARN` (stack output `DeployRoleArn`), `EC2_INSTANCE_ID` (the shared
host), and optionally `PRODUCTION_HEALTH_URL` (`https://<site>/health`) and `PRODUCTION_URL`.

No GitHub **secrets** are needed.

**Branch protection** (ruleset on `main`): require a pull request; require the status checks
`Lint and test` and `Build and boot production image`; block force pushes; restrict deletions.
**Create the `dev` branch** if it does not exist: `git push origin main:dev`.

**Content-Security-Policy.** `next.config.mjs` sets `connect-src` / `frame-src` to a fixed list of
hosts (`api.fameo.vip`, `api.fameo.info`, the Railway backend, …). If the production API or
socket domain is not in that list, browsers will block calls to it. Check it before the first
production deploy.

## 6. Deployment flow

1. Merge a pull request into `main`.
2. **CI**: `npm run lint:ci`, `npm test`, `npm audit --omit=dev --audit-level=critical`.
3. **Build and push image**: OIDC → push role. If `fameo-web:<sha>` already exists (a re-run) the
   build is skipped. Otherwise it runs `docker build` (which runs `next build` with the
   `NEXT_PUBLIC_*` variables), then the smoke test, then the push.
4. **Deploy**: waits for the environment rules, then runs `deploy.sh <sha>` on the host through
   SSM. The job fails unless the command ends in `Success`; it then checks
   `PRODUCTION_HEALTH_URL` if set.

Runs are serialized per repository. The backend and frontend can deploy at the same time; they
use separate containers, ports and host locks.

**Build-time secret placeholder.** `src/lib/security/jwtEdge.js` throws when `JWT_SECRET` is
unset in production, and `next build` loads route modules. The Dockerfile therefore gives the
build command, and only that command, a placeholder `JWT_SECRET`. It then fails the build if the
placeholder appears anywhere in the output, so the running server always reads the real secret
from its environment. (Verified locally: a token signed with the runtime secret is accepted; one
signed with the placeholder is rejected.)

## 7. Rollback and redeploy

Every image is immutable and addressed by its SHA. Rolling back means deploying an older SHA;
nothing is rebuilt.

- **Automatic:** an unhealthy new release is removed, the previous container is restarted, and the
  workflow fails.
- **GitHub (preferred):** *Actions → Production → Run workflow* on `main` with `image_tag` = the
  40-character SHA.
- **AWS CLI:**
  `aws ssm send-command --instance-ids i-… --document-name AWS-RunShellScript --parameters 'commands=["/opt/fameo-web/deploy.sh <sha>"]'`
- **On the host:** `sudo /opt/fameo-web/deploy.sh <sha>`

Find SHAs with `cat /opt/fameo-web/current /opt/fameo-web/previous`,
`tail /opt/fameo-web/releases.log`, or
`aws ecr describe-images --repository-name fameo-web --query 'reverse(sort_by(imageDetails,&imagePushedAt))[:10].[imageTags[0],imagePushedAt]' --output table`.

**After changing a Parameter Store value:** *Run workflow* on `main` with `image_tag` empty
(the existing image is reused). **After changing a `NEXT_PUBLIC_*` variable:** the image must
be rebuilt, which happens only for a new commit; merge a change to `main`.

## 8. Health check

`GET /health` → `{"status":"ok","service":"fameo-web"}`. Public, outside the middleware matcher,
no upstream call, `Cache-Control: no-store`. It is checked by the image `HEALTHCHECK`, `deploy.sh`,
`smoke-test.sh` (together with `/` and a static asset), and optionally the workflow.

## 9. Logs and container

- Logs: `sudo docker logs -f fameo-web` (`json-file`, 5 × 10 MB rotation).
- `--restart unless-stopped`, `--init`, user `node` (uid 1000), all capabilities dropped,
  `no-new-privileges`, port bound to `127.0.0.1:3000` only.
- The root filesystem is **not** read-only, unlike the backend's. Next.js writes its image
  optimisation and ISR caches under `/app/.next`, the only directory owned by `node`; the
  application code itself is owned by root.

## 10. Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| `missing in /fameo-web/production: JWT_SECRET …` | Add the parameter(s) in Parameter Store |
| Build fails: `Invalid client environment variables` | A `NEXT_PUBLIC_*` repository variable is not a valid URL/number |
| Build fails: `JWT_SECRET placeholder was inlined` | A code change made Next.js inline `JWT_SECRET`; find what reads it at build time |
| Pages load but API calls fail in the browser | The API/socket domain is missing from the CSP in `next.config.mjs`, or `NEXT_PUBLIC_SOCKET_URL`/`NEXT_PUBLIC_APP_ORIGIN` points elsewhere |
| Logged-in users bounce to /login | `JWT_SECRET` differs from the STS/backends |
| All visitors share one rate limit | nginx no longer sets `X-Forwarded-For $remote_addr`, or another proxy (CDN/ALB) was added: set `TRUSTED_PROXY_HOPS` |
| `InvalidInstanceId` / `AccessDenied` on send-command | Host not Online in Fleet Manager, or missing the `FameoHost=production` tag |
| 502 from nginx | Container down: `sudo docker ps -a`, `sudo docker logs --tail 100 fameo-web` |

Everything else (OIDC errors, SSM agent, ECR login, `npm audit` failures) is the same as the
backend; see the backend repository's `DEPLOYMENT.md` §12.
