import 'server-only';
// lib/api/server/proxy.js
// Shared BFF proxy factory.
//
// Fameo has four upstreams. Each gets its own BFF route built from this
// factory, so the token is attached server-side in exactly one place no matter
// which upstream a call is bound for, and the browser never learns an origin.
//
// Responsibilities, in order:
//   1. rate limit          — /api/bff is otherwise an open authenticated proxy
//   2. strip hop-by-hop    — and the caller's Cookie header, which must not leak
//   3. attach credential   — from an httpOnly cookie, never from the request
//   4. refresh on 401      — the BFF is the only code holding the cookie, so
//                            per CLAUDE.md this is the only correct place for it.
//                            The refresh happens at Fameoinfo-Backend, the one
//                            authentication authority, for every upstream.
//   5. no-store the reply  — a per-user response must never be shared-cached

import { NextResponse } from 'next/server';

import { hit, clientKey, limitHeaders, LIMITS } from './rate-limit';
import { identityRefresh } from './identity';
import {
  getSessionToken,
  getRefreshToken,
  setSessionTokens,
} from '@/lib/auth/session';

// Hop-by-hop and body-framing headers must not be forwarded. `cookie` is on the
// list deliberately: the upstream has no business seeing this app's session
// cookie, and forwarding it would defeat the point of terminating it here.
const STRIP = new Set([
  'host', 'connection', 'keep-alive', 'transfer-encoding', 'upgrade',
  'proxy-authorization', 'proxy-authenticate', 'te', 'trailer',
  'content-length', 'accept-encoding', 'cookie',
]);

// A body must be buffered to be replayable after a token refresh. Buffering a
// large upload would hold it entirely in memory, so above this size the request
// streams and simply forgoes the retry. 1 MB covers every JSON call.
const REPLAYABLE_BODY_LIMIT = 1024 * 1024;

/**
 * Credential sources. A route picks the one its upstream authenticates with.
 *
 * Every backend now accepts the same Fameoinfo access token, so `app` — once a
 * separate credential for the app backend — is the session under its old name,
 * kept so /api/bff-app did not have to change.
 */
export const CREDENTIALS = {
  session: { read: getSessionToken, refreshable: true },
  app: { read: getSessionToken, refreshable: true },
  none: { read: async () => null, refreshable: false },
};

/**
 * Exchange this user's refresh token (httpOnly cookie) for a new pair at
 * Fameoinfo-Backend and persist it.
 *
 * Concurrent refreshes are shared per refresh token inside identityRefresh(),
 * never across users — so a page that fires ten calls at once refreshes once,
 * and nobody can be handed somebody else's new token.
 *
 * @returns {Promise<string | null>} the new access token
 */
async function refreshSession() {
  const pair = await identityRefresh(await getRefreshToken());
  if (!pair) return null;
  await setSessionTokens(pair);
  return pair.accessToken;
}

/**
 * @param {string} origin   upstream origin, server-only
 * @param {object} [options]
 * @param {keyof typeof CREDENTIALS} [options.credential]  default 'session'
 * @param {{limit:number,windowMs:number}} [options.rateLimit]
 * @param {string} [options.bucket]  default 'proxy'
 *        Name of the rate-limit counter this route spends from. The counter is
 *        keyed by bucket + client, so two routes sharing a name share a budget.
 *        The default keeps every existing BFF route on the one shared 'proxy'
 *        budget it has always used. A route passes its own name only when it
 *        needs a DIFFERENT limit — a tighter limit on the shared counter would
 *        not tighten that route, it would impose itself on every other one,
 *        because whoever calls hit() last decides what the shared count is
 *        compared against.
 * @param {Record<string,string>} [options.headers]
 *        Static headers forced onto every upstream request. For upstream
 *        quirks that are a property of the BACKEND, not of the caller — an
 *        API key, a tunnel's interstitial opt-out. They belong here, beside
 *        the origin and server-side, rather than being sent from the browser
 *        where they would be both visible and forgeable.
 * @returns {(request: Request, ctx: { params: Promise<{path: string[]}> }) => Promise<Response>}
 */
export function createProxy(origin, options = {}) {
  const {
    credential = 'session',
    rateLimit = LIMITS.proxy,
    headers: forced,
    bucket = 'proxy',
  } = options;
  const source = CREDENTIALS[credential] ?? CREDENTIALS.session;

  return async function proxy(request, ctx) {
    const { path = [] } = await ctx.params;
    const search = new URL(request.url).search;
    const target = `${origin}/${path.join('/')}${search}`;

    // ── 1. Rate limit ────────────────────────────────────────────────────────
    const gate = hit(`${bucket}:${clientKey(request)}`, rateLimit.limit, rateLimit.windowMs);
    if (!gate.ok) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please slow down.' },
        { status: 429, headers: limitHeaders(gate, rateLimit.limit) }
      );
    }

    // ── 2. Forwardable headers ───────────────────────────────────────────────
    const headers = new Headers();
    for (const [k, v] of request.headers) {
      if (!STRIP.has(k.toLowerCase())) headers.set(k, v);
    }
    // An Authorization header from the browser is never trusted — the whole
    // point is that the credential comes from the httpOnly cookie below.
    headers.delete('authorization');

    // Upstream-specific headers, applied after the caller's are copied so the
    // caller can never override them.
    if (forced) {
      for (const [k, v] of Object.entries(forced)) headers.set(k, v);
    }

    // ── 3. Attach the credential, server-side ────────────────────────────────
    let token = await source.read();
    if (token) headers.set('Authorization', `Bearer ${token}`);

    // ── Body: buffer small ones so a refresh can replay them ─────────────────
    const hasBody = !['GET', 'HEAD'].includes(request.method);
    const declared = Number(request.headers.get('content-length') || 0);
    const canReplay =
      hasBody && source.refreshable && declared > 0 && declared <= REPLAYABLE_BODY_LIMIT;

    let buffered = null;
    if (canReplay) {
      try {
        buffered = await request.arrayBuffer();
      } catch {
        buffered = null;
      }
    }

    const send = (authHeaders) =>
      fetch(target, {
        method: request.method,
        headers: authHeaders,
        body: hasBody ? (buffered ?? request.body) : undefined,
        // Required by undici whenever a STREAMING body is forwarded. A buffered
        // ArrayBuffer body is not a stream and must not carry duplex.
        ...(hasBody && buffered === null ? { duplex: 'half' } : {}),
        redirect: 'manual',
        cache: 'no-store',
      });

    let upstream;
    try {
      upstream = await send(headers);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Upstream unreachable' },
        { status: 502 }
      );
    }

    // ── 4. Refresh once on 401, then replay ──────────────────────────────────
    const retryable = buffered !== null || !hasBody;
    if (upstream.status === 401 && token && source.refreshable && retryable) {
      const next = await refreshSession();
      if (next && next !== token) {
        token = next;
        const retryHeaders = new Headers(headers);
        retryHeaders.set('Authorization', `Bearer ${next}`);
        try {
          upstream = await send(retryHeaders);
        } catch {
          return NextResponse.json(
            { success: false, message: 'Upstream unreachable' },
            { status: 502 }
          );
        }
      }
    }

    // ── 5. Response ──────────────────────────────────────────────────────────
    const resHeaders = new Headers(upstream.headers);
    resHeaders.delete('content-encoding');
    resHeaders.delete('content-length');

    // The upstream must NOT be able to set cookies on this app's domain.
    // Anything it sends here would land scoped to our origin, which is a
    // session-fixation primitive if the upstream is ever compromised or
    // misconfigured. This app's session is issued only by /api/auth/*.
    resHeaders.delete('set-cookie');

    // Never let an upstream cache directive make a per-user response cacheable.
    resHeaders.set('cache-control', 'no-store');
    for (const [k, v] of Object.entries(limitHeaders(gate, rateLimit.limit))) {
      resHeaders.set(k, v);
    }

    // A 5xx body is the upstream's internals — stack traces, driver errors,
    // query fragments. Useful in a log, never in a browser. 4xx bodies ARE
    // passed through: they carry the validation messages the UI renders.
    if (upstream.status >= 500) {
      const detail = await upstream.text().catch(() => '');
      console.error('[bff] upstream error', {
        target,
        status: upstream.status,
        detail: detail.slice(0, 2000),
      });

      resHeaders.delete('content-type');
      return NextResponse.json(
        { success: false, message: 'The server had a problem. Please try again shortly.' },
        { status: upstream.status, headers: resHeaders },
      );
    }

    return new NextResponse(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: resHeaders,
    });
  };
}
