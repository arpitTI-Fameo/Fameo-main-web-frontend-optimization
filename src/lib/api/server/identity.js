import 'server-only';
// lib/api/server/identity.js
// Fameoinfo-Backend — the single authentication authority — as seen from our
// server code: our auth route handlers, the BFF proxy and middleware.
//
// Nothing here touches cookies. Callers decide where tokens go (route handlers
// and the proxy through lib/auth/session.js, middleware through the response),
// which is what lets the Edge middleware share this module.
//
// Fameoinfo wraps every payload as { success, data: [ {...} ] }.

import { APP_ORIGIN } from './origins';
import { identityEndpoints } from '../endpoints';
import { identityLoginSchema, identityTokensSchema } from '../schemas';

const first = (body) => (Array.isArray(body?.data) ? body.data[0] : body?.data) ?? null;

/**
 * @typedef {{ accessToken: string, refreshToken: string | null, expiresIn: number | null }} TokenPair
 */

/**
 * Validate the upstream contract before trusting it: a renamed field would
 * otherwise set an undefined cookie and report a session that does not exist.
 * @returns {TokenPair | null}
 */
const toTokenPair = (raw) => {
  const parsed = identityTokensSchema.safeParse(raw);
  if (!parsed.success) return null;
  return {
    accessToken: parsed.data.access_token,
    refreshToken: parsed.data.refresh_token ?? null,
    expiresIn: Number(parsed.data.expires_in) || null,
  };
};

const post = (path, { body, token } = {}) =>
  fetch(`${APP_ORIGIN}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
  });

/**
 * Sign in. `username` may be a username or an email — Fameoinfo accepts both.
 *
 * @returns {Promise<
 *   { ok: true, tokens: TokenPair, user: object | null }
 * | { ok: false, status: number, message: string }
 * >}
 */
export async function identityLogin({ username, password }) {
  let res, body;
  try {
    res = await post(identityEndpoints.login(), {
      // firebase_token is part of Fameoinfo's login contract; 'NULL' is what
      // its own clients send for a non-device sign-in.

      body: { username, password, firebase_token: 'NULL' },
    });
    body = await res.json().catch(() => ({}));
  } catch {
    return { ok: false, status: 502, message: 'Cannot reach the authentication server' };
  }

  if (!res.ok || body?.success === false) {
    return { ok: false, status: res.ok ? 401 : res.status, message: body?.message || 'Login failed' };
  }

  const parsed = identityLoginSchema.safeParse(first(body));
  const tokens = parsed.success ? toTokenPair(parsed.data.tokens) : null;
  if (!tokens) {
    console.error('[identity] login contract mismatch', {
      issues: parsed.success ? [] : parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
    });
    return { ok: false, status: 502, message: 'Login succeeded but no token was returned' };
  }
  return { ok: true, tokens, user: parsed.data.user ?? null };
}

// Fameoinfo rotates the refresh token on every use, revoking the old one. A
// page that fires several requests on an expired token would otherwise send
// several refreshes with the SAME token and all but the first would fail —
// signing the user out. So a refresh is shared by everyone presenting the same
// refresh token for a short window.
//
// Keyed by the refresh token, which is the user's own secret: one user can
// never receive another user's result.
const REUSE_MS = 30_000;
const recent = new Map();

/**
 * Exchange a refresh token for a new pair. Never throws; null means "no longer
 * signed in".
 * @returns {Promise<TokenPair | null>}
 */
export function identityRefresh(refreshToken) {
  if (!refreshToken) return Promise.resolve(null);

  const now = Date.now();
  for (const [key, entry] of recent) {
    if (now - entry.at >= REUSE_MS) recent.delete(key);
  }
  const hit = recent.get(refreshToken);
  if (hit) return hit.promise;

  const promise = (async () => {
    try {
      const res = await post(identityEndpoints.refresh(), { body: { refresh_token: refreshToken } });
      if (!res.ok) return null;
      const body = await res.json().catch(() => null);
      return toTokenPair(first(body));
    } catch {
      return null;
    }
  })();

  recent.set(refreshToken, { promise, at: now });
  // A failure is not worth remembering — the next attempt should really try.
  promise.then((pair) => { if (!pair) recent.delete(refreshToken); });
  return promise;
}

/** Tell Fameoinfo to end the session (revokes the token). Best effort. */
export async function identityLogout(accessToken) {
  if (!accessToken) return;
  try {
    await post(identityEndpoints.logout(), { token: accessToken });
  } catch {
    // Non-fatal — the local cookies are cleared regardless.
  }
}
