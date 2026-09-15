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
 * Best-effort client identity.
 *
 * x-forwarded-for is client-controllable, so this is NOT an authentication
 * signal — it is a spreading function. It only has to make the common case
 * (one real client) share a bucket. Take the FIRST hop, which is what every
 * proxy in front of this app appends the real client IP as.
 */
export function clientKey(request) {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  );
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
