# syntax=docker/dockerfile:1.7
#
# Production image for fameo-web (Next.js 16, `output: 'standalone'`).
#
#   node     the official node:alpine image (source of the node binary)
#   deps     npm ci against the lockfile — build needs devDependencies too
#   build    next build → .next/standalone (server + traced node_modules)
#   runtime  bare Alpine + node + standalone server + static assets, as `node`
#
# NEXT_PUBLIC_* values are inlined into the JavaScript by `next build`, so
# they are build arguments (public by definition — never put a secret in one).
# Server-only settings and secrets (JWT_SECRET, API_ORIGIN, …) are read at
# runtime from the environment given to `docker run` (deploy/deploy.sh).

# Node LTS line and the Alpine release its official image is built on. The
# runtime copies the node binary onto that same Alpine, so bump them together.
ARG NODE_VERSION=24
ARG ALPINE_VERSION=3.24

# ── node ─────────────────────────────────────────────────────────────────────
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS node

# ── deps ─────────────────────────────────────────────────────────────────────
FROM node AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# ── build ────────────────────────────────────────────────────────────────────
FROM node AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Public, build-time configuration (src/env.js). Left empty, a value takes the
# default from src/env.js: empty ones are unset before the build, because an
# empty string is not "missing" to zod and would fail its URL checks.
ARG NEXT_PUBLIC_SITE_URL=""
ARG NEXT_PUBLIC_APP_ORIGIN=""
ARG NEXT_PUBLIC_SOCKET_URL=""
ARG NEXT_PUBLIC_APP_NAME=""
ARG NEXT_PUBLIC_RAZORPAY_KEY_ID=""
ARG NEXT_PUBLIC_MAX_ORDER_INR=""
ARG NEXT_PUBLIC_LIVEKIT_URL=""
ARG NEXT_PUBLIC_PORTAL_MOCK=""

# JWT_SECRET: src/lib/security/jwtEdge.js refuses to load without it when
# NODE_ENV=production, and `next build` loads route modules to collect page
# data. The build gets a placeholder for this one command only (not an ENV,
# not in the runtime stage); the server reads the real secret from its
# environment at runtime. CI checks the placeholder never reaches the output.
RUN --mount=type=cache,target=/app/.next/cache \
    for v in NEXT_PUBLIC_SITE_URL NEXT_PUBLIC_APP_ORIGIN NEXT_PUBLIC_SOCKET_URL \
             NEXT_PUBLIC_APP_NAME NEXT_PUBLIC_RAZORPAY_KEY_ID NEXT_PUBLIC_MAX_ORDER_INR \
             NEXT_PUBLIC_LIVEKIT_URL NEXT_PUBLIC_PORTAL_MOCK; do \
      eval "[ -n \"\${$v}\" ] || unset $v"; \
    done \
 && JWT_SECRET=build-time-placeholder-not-a-secret npm run build \
 && if grep -rlF build-time-placeholder-not-a-secret .next/standalone .next/static; then \
      echo "JWT_SECRET placeholder was inlined into the build output" >&2; exit 1; \
    fi \
 # sharp (next/image) ships glibc and musl builds; the Alpine runtime can only
 # load musl, so the glibc ones (~17 MB) are dropped from the server bundle.
 && rm -rf .next/standalone/node_modules/@img/sharp-linux-* \
           .next/standalone/node_modules/@img/sharp-libvips-linux-*

# ── runtime ──────────────────────────────────────────────────────────────────
# Bare Alpine + the node binary and the two libraries it links (libstdc++,
# libgcc): no npm, corepack, yarn or C headers in the container.
FROM alpine:${ALPINE_VERSION} AS runtime
RUN apk add --no-cache libstdc++ libgcc \
 && addgroup -g 1000 node \
 && adduser -u 1000 -G node -s /sbin/nologin -D node
COPY --from=node /usr/local/bin/node /usr/local/bin/node
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
WORKDIR /app

# The standalone server and its traced node_modules, read-only to the app.
# .next is owned by `node`: Next.js writes its image-optimisation and
# incremental (ISR) caches there at runtime.
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
RUN chown node:node .next

USER node
EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=3s --start-period=60s --start-interval=2s --retries=3 \
  CMD wget -qO /dev/null "http://127.0.0.1:${PORT}/health" || exit 1

# Run under `docker run --init`; Next's standalone server exits on SIGTERM.
CMD ["node", "server.js"]
