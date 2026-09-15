import 'server-only';
// lib/api/server/rate-limit.js
// A fixed-window limiter for the BFF and auth routes.
//
// Why this exists: createProxy will forward ANY path to the upstream with the
// caller's token attached. Without a limit, /api/bff is an open, authenticated
// amplifier — one stolen session can be replayed as fast as the network allows,
// and /api/auth/login can be brute-forced at the same rate.
//
// Scope and honesty about it: the counters live in module memory, so the limit
// is PER SERVER INSTANCE. On a single container that is a real limit. Behind a
// horizontally-scaled deployment the effective ceiling is (limit x instances) —
// still a bound, but swap `hit()` for Redis/Upstash if you need an exact one.
// The interface is deliberately the shape a Redis INCR+EXPIRE would return, so
// that swap is a one-function change.

/** @type {Map<string, { count: number, resetAt: number }>} */
const buckets = new Map();

// Keep the map from growing without bound on a long-lived server.
const MAX_BUCKETS = 10_000;

function sweep(now) {
  for (const [key, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(key);
  }
}

/**
 * @param {string} key      identity to limit on (ip + route)
 * @param {number} limit    requests allowed per window
 * @param {number} windowMs window length
 * @returns {{ ok: boolean, remaining: number, resetAt: number, retryAfter: number }}
 */
export function hit(key, limit, windowMs) {
  const now = Date.now();

  if (buckets.size > MAX_BUCKETS) sweep(now);

  let b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    b = { count: 0, resetAt: now + windowMs };
    buckets.set(key, b);
  }

  b.count += 1;

  return {
    ok: b.count <= limit,
    remaining: Math.max(0, limit - b.count),
    resetAt: b.resetAt,
    retryAfter: Math.ceil((b.resetAt - now) / 1000),
  };
}

/**
 * Client identity for rate limiting.
 *
 * THE TRAP THIS AVOIDS: the obvious implementation takes the first entry of
 * X-Forwarded-For. That entry is whatever the CLIENT sent, because proxies
 * APPEND the peer address rather than replacing the header. So
 *
 *     curl -H "x-forwarded-for: $RANDOM.1.1.1"
 *
 * lands in a fresh bucket every time and the limit never fires. This was a
 * real, verified bypass of every limit in this app.
 *
 * Order of preference:
 *
 *   1. A platform header the edge sets and does not let a client forge
 *      (Cloudflare, Vercel, common ingress controllers). Always correct when
 *      present, so it wins.
 *   2. X-Forwarded-For counted from the RIGHT, skipping TRUSTED_PROXY_HOPS
 *      appended by our own infrastructure. Everything left of that is
 *      client-supplied and ignored.
 *
 * TRUSTED_PROXY_HOPS must match the deployment. 1 is right for a single
 * managed proxy (Vercel, Railway, a lone nginx). Set TRUSTED_PROXY_HOPS in the
 * environment if traffic passes through more. Too HIGH is the dangerous
 * direction — it starts trusting client-supplied entries again.
 */
const TRUSTED_PROXY_HOPS = Math.max(
  1,
  Number.parseInt(process.env.TRUSTED_PROXY_HOPS ?? '1', 10) || 1,
);

// Set by the edge, stripped from inbound requests by the platform.
const TRUSTED_IP_HEADERS = [
  'cf-connecting-ip',       // Cloudflare
  'true-client-ip',         // Cloudflare Enterprise / Akamai
  'x-vercel-forwarded-for', // Vercel
  'x-real-ip',              // nginx / common ingress
];

export function clientKey(request) {
  for (const header of TRUSTED_IP_HEADERS) {
    const value = request.headers.get(header);
    if (value) return value.trim();
  }

  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const hops = xff.split(',').map((h) => h.trim()).filter(Boolean);
    if (hops.length) {
      // Count from the right: the last entry was appended by the proxy nearest
      // to us and is the only one we can vouch for.
      const index = Math.max(0, hops.length - TRUSTED_PROXY_HOPS);
      return hops[index];
    }
  }

  // No usable header. One shared bucket is the SAFE failure mode: it limits
  // too aggressively rather than not at all.
  return 'unknown';
}

/** Standard headers so a client can back off politely instead of hammering. */
export function limitHeaders(result, limit) {
  return {
    'x-ratelimit-limit': String(limit),
    'x-ratelimit-remaining': String(result.remaining),
    'x-ratelimit-reset': String(Math.ceil(result.resetAt / 1000)),
    ...(result.ok ? {} : { 'retry-after': String(result.retryAfter) }),
  };
}

/** Windows, kept here so every route reads the same numbers. */
export const LIMITS = {
  // Generous: a data-heavy page legitimately fires a dozen calls on mount.
  proxy: { limit: 300, windowMs: 60_000 },
  // Tight: credential endpoints. 10/min per IP stops online brute force while
  // leaving room for a user who genuinely mistypes a password a few times.
  auth: { limit: 10, windowMs: 60_000 },
  // OTP send costs money and is abusable as an SMS bomb.
  otp: { limit: 5, windowMs: 60_000 },
};
