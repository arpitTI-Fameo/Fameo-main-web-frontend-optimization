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
// The token is the access token issued by Fameoinfo-Backend's STS — the single
// authentication authority — and follows the same contract every Fameo backend
// verifies (server/products-server: src/config/authContract.js): HS256,
// `sub` = the canonical user id, `exp` required, `iss`/`aud` once configured.
//
// JWT_SECRET must be the same value the STS signs with. It is a SERVER-ONLY
// variable: never rename it to NEXT_PUBLIC_*, or the signing key ships to the
// browser and every token in the system becomes forgeable.

import { jwtVerify } from 'jose';
import { env } from '@/env';

const secretRaw = env.JWT_SECRET;
const secret = secretRaw ? new TextEncoder().encode(secretRaw) : null;

// Enforced when set, exactly as on the backends. Set them only after the STS
// emits them.
const issuer = env.JWT_ISSUER || undefined;
const audience = env.JWT_AUDIENCE || undefined;

if (!secretRaw && env.NODE_ENV === 'production') {
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
 * simply not a session. That includes an EXPIRED access token: middleware
 * then renews it with the refresh token rather than signing the user out.
 *
 * @returns {Promise<{sub:string, roleId?:string} | null>}
 */
export async function verifyToken(token) {
  if (!token || !secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret, {
      // Pin the algorithm. Without this, a token with `alg: none` — or one
      // signed with a different family — can be accepted by permissive
      // verifiers. The backend signs HS256.
      algorithms: ['HS256'],

      // Require an expiry. jose validates `exp` when it is PRESENT but does
      // not insist on it, so a token minted without one verified forever —
      // confirmed by test: an exp-less superAdmin token was accepted. A
      // session that cannot expire also cannot be revoked by waiting.
      requiredClaims: ['exp'],
      ...(issuer ? { issuer } : {}),
      ...(audience ? { audience } : {}),
    });
    // The canonical user id. A legacy main-API token (`{ id }`) has no `sub`
    // and is not a session any more.
    if (!payload?.sub) return null;
    // A refresh token is signed with the same key; it is never a session.
    if (payload.token_use !== undefined && payload.token_use !== 'access') return null;
    return payload;
  } catch (err) {
    // Rejecting a token is normal (expired, forged, absent) and must stay
    // quiet. A MISSING `exp` is different: it means the backend is minting
    // tokens with no expiry, and everyone would be signed out at once with no
    // obvious cause. Name it in the logs so that is a five-second diagnosis
    // rather than an outage hunt.
    if (err?.code === 'ERR_JWT_CLAIM_VALIDATION_FAILED' && err?.claim === 'exp') {
      console.error(
        '[jwtEdge] Rejected a token with no `exp` claim. The backend is issuing ' +
        'non-expiring tokens — fix the signer, or sessions cannot be timed out.'
      );
    }
    return null;
  }
}

export default { verifyToken };
