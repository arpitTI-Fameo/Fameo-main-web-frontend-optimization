// lib/security/jwtEdge.js
// Cryptographic JWT verification for the Edge runtime (middleware).
//
// SAST C-3. The middleware previously did this:
//
//     const token = request.cookies.get('fameo_token')?.value;
//     if (!token) redirect('/login');
//     // ...and then treated the user as authenticated
//
// It checked that a cookie EXISTED. It never checked that the cookie contained
// a token this system issued. `document.cookie = 'fameo_token=x'` in any
// browser console satisfied it, granting every auth-gated route.
//
// `jsonwebtoken` cannot run in the Edge runtime (it needs Node crypto), which
// is why this uses `jose`. Install it:  npm i jose
//
// JWT_SECRET must be the same value the Express backend signs with — the two
// already share it for cross-backend SSO. It is a SERVER-ONLY variable: never
// rename it to NEXT_PUBLIC_*, or the signing key ships to the browser and every
// token in the system becomes forgeable.

import { jwtVerify } from 'jose';

const secretRaw = process.env.JWT_SECRET;
const secret = secretRaw ? new TextEncoder().encode(secretRaw) : null;

if (!secretRaw && process.env.NODE_ENV === 'production') {
  // Fail loudly at boot rather than silently letting everyone through.
  throw new Error(
    'JWT_SECRET is not set. Middleware cannot verify sessions and every ' +
    'protected route would be open. Refusing to start.'
  );
}

/**
 * Verify a token and return its claims, or null.
 *
 * Returns null — never throws — so callers can treat "invalid" and "absent"
 * identically. Anything that fails signature, expiry or algorithm checks is
 * simply not a session.
 *
 * @returns {Promise<{id:string, role?:string, plan?:string} | null>}
 */
export async function verifyToken(token) {
  if (!token || !secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret, {
      // Pin the algorithm. Without this, a token with `alg: none` — or one
      // signed with a different family — can be accepted by permissive
      // verifiers. The backend signs HS256.
      algorithms: ['HS256'],
    });
    if (!payload?.id) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Roles allowed into /admin. Mirrors ADMIN_ROLES in store/adminAuthStore.js. */
export const ADMIN_ROLES = new Set([
  'superAdmin',
  'contentManager',
  'moduleMaster',
  'supportAgent',
]);

export const isAdminRole = (role) => ADMIN_ROLES.has(role);

/**
 * Tiers that unlock paid areas (community, talent-hire).
 *
 * SAST C-4. This used to be read from the `fameo_membership` cookie, which the
 * client wrote itself without HttpOnly — so `document.cookie =
 * 'fameo_membership=elite'` bought a free upgrade. The tier now comes from the
 * `plan` claim inside the signed token, which the browser cannot forge without
 * JWT_SECRET.
 *
 * `pro` is a dead legacy tier but still grants ACCESS (it was a paid tier) even
 * though it carries no product discount — matching lib/planPricing.js, where
 * pro maps to a 0% rate rather than to no entitlement.
 */
export const PAID_PLANS = new Set(['pro', 'popular', 'elite', 'premium']);

export const hasPaidPlan = (claims) =>
  PAID_PLANS.has(String(claims?.plan ?? '').trim().toLowerCase());

export default { verifyToken, isAdminRole, hasPaidPlan, ADMIN_ROLES, PAID_PLANS };
