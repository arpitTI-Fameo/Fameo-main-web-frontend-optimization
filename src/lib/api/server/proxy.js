import 'server-only';
// lib/api/server/proxy.js
// Shared BFF proxy factory.
//
// Fameo has three upstreams. Each gets its own BFF route built from this
// factory, so the token is attached server-side in exactly one place no matter
// which upstream a call is bound for, and the browser never learns an origin.
//
// Responsibilities, in order:
//   1. rate limit          — /api/bff is otherwise an open authenticated proxy
//   2. strip hop-by-hop    — and the caller's Cookie header, which must not leak
//   3. attach credential   — from an httpOnly cookie, never from the request
//   4. refresh on 401      — the BFF is the only code holding the cookie, so
//                            per CLAUDE.md this is the only correct place for it
//   5. no-store the reply  — a per-user response must never be shared-cached

import { NextResponse } from 'next/server';

import { API_ORIGIN } from './origins';
import { hit, clientKey, limitHeaders, LIMITS } from './rate-limit';
import { authEndpoints } from '../endpoints';
import {
  getSessionToken,
  setSessionToken,
  getAppToken,
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

/** Credential sources. A route picks the one its upstream authenticates with. */
export const CREDENTIALS = {
  session: { read: getSessionToken, refreshable: true },
  app: { read: getAppToken, refreshable: false },
  none: { read: async () => null, refreshable: false },
};

/**
 * Exchange the current session token for a fresh one.
 *
 * Single-flighted: a page that fires ten calls at once will see ten 401s, and
 * without this they would all race to refresh and nine would be issued against
 * a token that was just rotated.
 *
 * @returns {Promise<string | null>}
 */
let inflightRefresh = null;

async function refreshSession(currentToken) {
  if (inflightRefresh) return inflightRefresh;

  inflightRefresh = (async () => {
    try {
      const res = await fetch(`${API_ORIGIN}${authEndpoints.refreshSession()}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${currentToken}` },
        cache: 'no-store',
      });
      if (!res.ok) return null;

      const body = await res.json().catch(() => null);
      const next = body?.data?.token;
      if (!next) return null;

      await setSessionToken(next);
      return next;
    } catch {
      return null;
    } finally {
      // Clear on the next tick so callers already awaiting this promise get the
      // same result, but a later 401 starts a new attempt.
      setTimeout(() => { inflightRefresh = null; }, 0);
    }
  })();

  return inflightRefresh;
}

/**
 * @param {string} origin   upstream origin, server-only
 * @param {object} [options]
 * @param {keyof typeof CREDENTIALS} [options.credential]  default 'session'
 * @param {{limit:number,windowMs:number}} [options.rateLimit]
 * @returns {(request: Request, ctx: { params: Promise<{path: string[]}> }) => Promise<Response>}
 */
export function createProxy(origin, options = {}) {
  const { credential = 'session', rateLimit = LIMITS.proxy } = options;
  const source = CREDENTIALS[credential] ?? CREDENTIALS.session;

  return async function proxy(request, ctx) {
    const { path = [] } = await ctx.params;
    const search = new URL(request.url).search;
    const target = `${origin}/${path.join('/')}${search}`;

    // ── 1. Rate limit ────────────────────────────────────────────────────────
    const gate = hit(`proxy:${clientKey(request)}`, rateLimit.limit, rateLimit.windowMs);
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
      const next = await refreshSession(token);
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
