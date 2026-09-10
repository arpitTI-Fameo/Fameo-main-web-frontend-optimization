// lib/security/apiGuard.js
// Authentication + rate limiting for Next.js route handlers.
//
// SAST C-5 / H-7. The three SmartAuth KYC proxies had no authentication of any
// kind. Anyone who found the URL could:
//   • burn the paid KYC quota, billed to Fameo
//   • submit real PAN numbers through Fameo's provider key
//   • probe the provider API from Fameo's IP and reputation
// and the raw request body was forwarded verbatim, so the caller chose which
// provider fields were set.
//
// requireUser() is the fix for the first problem. allowFields() is the fix for
// the second. rateLimit() is the fix for the third.

import { NextResponse } from 'next/server';
import { verifyToken } from './jwtEdge';

/**
 * Require a valid session. Returns `{ user }` or `{ error }` — never throws.
 *
 * Accepts the token from the cookie or an Authorization header. The header
 * matters because the KYC flow runs inside components that already hold a
 * bearer token for the Express backend.
 *
 *   const { user, error } = await requireUser(req);
 *   if (error) return error;
 */
export async function requireUser(req) {
  const bearer = req.headers.get('authorization') || '';
  const token =
    req.cookies?.get?.('fameo_token')?.value ||
    (bearer.toLowerCase().startsWith('bearer ') ? bearer.slice(7).trim() : null);

  const claims = await verifyToken(token);
  if (!claims) {
    return {
      error: NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      ),
    };
  }
  return { user: claims };
}

// ─── Rate limiting ───────────────────────────────────────────────────────────
//
// In-memory fixed window. Honest about its limits: this is per-instance, so on
// a multi-instance or serverless deployment the effective limit is
// (limit × instances) and cold starts reset it. That is still a large
// improvement over no limit at all, and it has no infrastructure cost.
//
// For a real ceiling, swap the body of rateLimit() for @upstash/ratelimit —
// the signature is designed to make that a drop-in.

const buckets = new Map();
const SWEEP_AFTER = 10 * 60 * 1000;
let lastSweep = Date.now();

const sweep = (now) => {
  if (now - lastSweep < SWEEP_AFTER) return;
  lastSweep = now;
  for (const [k, v] of buckets) if (v.resetAt < now) buckets.delete(k);
};

/**
 * @param {string} key      identity to limit on (user id, or IP for anonymous)
 * @param {number} limit    requests allowed per window
 * @param {number} windowMs window length
 * @returns {{ ok: boolean, remaining: number, retryAfter: number }}
 */
export function rateLimit(key, { limit = 5, windowMs = 60_000 } = {}) {
  const now = Date.now();
  sweep(now);

  const hit = buckets.get(key);
  if (!hit || hit.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  hit.count += 1;
  if (hit.count > limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((hit.resetAt - now) / 1000) };
  }
  return { ok: true, remaining: limit - hit.count, retryAfter: 0 };
}

/** Best-effort client IP, for limiting requests that have no user yet. */
export const clientIp = (req) =>
  req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  req.headers.get('x-real-ip') ||
  'unknown';

/** 429 response with the standard header. */
export const tooManyRequests = (retryAfter) =>
  NextResponse.json(
    { message: 'Too many requests. Please slow down and try again shortly.' },
    { status: 429, headers: { 'Retry-After': String(retryAfter || 60) } }
  );

/**
 * Copy only the fields we intend to send upstream.
 *
 * The proxies used to do `body: JSON.stringify(await req.json())` — forwarding
 * whatever arrived. An allowlist means a caller cannot smuggle extra provider
 * parameters (callback URLs, mode switches, account overrides) through our
 * authenticated key. Anything not named here is dropped silently.
 */
export function allowFields(body, fields) {
  const out = {};
  if (!body || typeof body !== 'object') return out;
  for (const f of fields) {
    if (body[f] !== undefined && body[f] !== null) out[f] = body[f];
  }
  return out;
}

export default { requireUser, rateLimit, clientIp, tooManyRequests, allowFields };
