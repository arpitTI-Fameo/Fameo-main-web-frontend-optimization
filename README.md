# fameo-web

Fameo's website and admin panel (Next.js 16, plain JavaScript). The browser talks only to this
app's BFF (`/api/bff/*`); the BFF calls the backend APIs server-side with the session from an
httpOnly cookie. Engineering rules are in [CLAUDE.md](CLAUDE.md); production deployment is in
[DEPLOYMENT.md](DEPLOYMENT.md).

## Requirements

- **Node.js 24** (LTS; the version CI and the Docker image use) and npm
- The backend API running somewhere you can reach (locally: the `products-server` repo on
  port 8000; see its README)
- **Docker**, only for the Docker steps below (Docker Desktop, or `colima start` on macOS)

## 1. Install

```bash
git clone <this repository>
cd <repository folder>
npm install
cp .env.example .env        # then fill in the values (ask the team for dev credentials)
```

`.env` is git-ignored; never commit it. What each variable means is in `src/env.js`:

- `NEXT_PUBLIC_*` variables are **public**: they are compiled into the browser JavaScript. Never
  put a secret in one, and never an API origin (the architecture test rejects it).
- Everything else (`API_ORIGIN`, `APP_ORIGIN`, `JWT_SECRET`, `SMARTAUTH_KEY`, …) stays on the
  server. `JWT_SECRET` must be the same value the backends use.

## 2. Start the app

```bash
npm run dev      # development server with hot reload → http://localhost:3000
```

Production mode on your machine:

```bash
npm run build
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
node .next/standalone/server.js     # serves on PORT (default 3000)
```

The build is `output: 'standalone'`, so the server lives in `.next/standalone/`; the two `cp`
commands give it the images, CSS and JS (the Docker image does this for you). `npm start` also
works, but prints a warning that standalone builds should use `node .next/standalone/server.js`.

Check it is up:

```bash
curl http://localhost:3000/health
# {"status":"ok","service":"fameo-web"}
```

## 3. Checks before a pull request

CI runs the same commands; all must pass.

```bash
npm run lint:ci     # lint with zero warnings allowed
npm test            # vitest: architecture/security rules, codemap, units
npm run build       # production build
npm run verify      # all of the above, plus `npm run codemap`
```

If you add, remove or rename an export or a route, run `npm run codemap` and commit
`docs/CODEMAP.md`; `npm test` fails while it is out of date.

## 4. Testing with Docker locally

Use this to check the **production image** on your machine: the same image CI builds and
production runs.

### Build the image

`NEXT_PUBLIC_*` values are baked in at build time, so pass them as build arguments. This line
takes them from your `.env`:

```bash
docker build $(grep '^NEXT_PUBLIC_' .env | sed 's/^/--build-arg /') -t fameo-web:local .
docker images fameo-web:local      # shows the image size
```

### Quick check: does the image boot?

Starts the image with dummy settings, checks `/health`, the home page and a CSS/JS file, then
removes it. This is the same check CI runs on every pull request.

```bash
deploy/smoke-test.sh fameo-web:local
# Smoke test passed: /health, / and /_next/static/... are served.
```

### Run the site in Docker with your `.env`

Inside a container, `localhost` is the container itself, so the server-side origins must point
somewhere else. Pick the command that matches where the backend runs.

**Backend also in Docker** (started from the `products-server` README, on the `fameo-local`
network):

```bash
docker network create fameo-local 2>/dev/null || true
docker run -d --name fameo-web --network fameo-local -p 3000:3000 \
  --env-file .env \
  -e API_ORIGIN=http://fameo-backend:8000 \
  -e APP_ORIGIN=http://fameo-backend:8000 \
  fameo-web:local
```

**Backend running on your Mac with `npm run dev`**:

```bash
docker run -d --name fameo-web -p 3000:3000 \
  --env-file .env \
  -e API_ORIGIN=http://host.docker.internal:8000 \
  -e APP_ORIGIN=http://host.docker.internal:8000 \
  fameo-web:local
```

(If your `.env` points `APP_ORIGIN` at a different port or service, use that instead of 8000.)

Then open http://localhost:3000, or:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/bff/api/health     # through the BFF to the backend
```

### Useful commands

```bash
docker ps                          # running containers + health (healthy/unhealthy)
docker logs -f fameo-web           # follow the logs (Ctrl+C to stop following)
docker exec -it fameo-web sh       # shell inside the container
```

### Rebuild after a code change

```bash
docker rm -f fameo-web
docker build $(grep '^NEXT_PUBLIC_' .env | sed 's/^/--build-arg /') -t fameo-web:local .
# then the `docker run` command above again
```

### Stop and clean up

```bash
docker rm -f fameo-web
docker rmi fameo-web:local          # optional: remove the image
```

## 5. Deployment

Merging into `main` deploys to production automatically (CI → Docker image → AWS ECR → EC2, with
a health check and automatic rollback). `dev` and pull requests never deploy. Setup, rollback and
troubleshooting: [DEPLOYMENT.md](DEPLOYMENT.md).

## Project layout

```
src/
  app/            routes (thin): pages, layouts, route handlers, /health
  modules/        features: Main/ (creator app), Admin/ (admin panel), Auth/
  components/     shared UI
  lib/            API transport + BFF, auth/session, security, services, hooks, SEO
  constants/ utils/ store/ providers/
  env.js          every environment variable, validated
  middleware.js   route gating (login, admin)
tests/            vitest suites
deploy/           deploy.sh, smoke-test.sh, AWS template, nginx config
docs/             CODEMAP.md (generated), API architecture
```
