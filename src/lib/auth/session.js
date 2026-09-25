import 'server-only';
// lib/auth/session.js
// Async cookie helpers. In Next 15+ `cookies()` returns a Promise — calling it
// synchronously throws, which is defect #1 in the migration guide.
//
// This is the ONLY place the session cookies are read or written on the server
// (middleware, on the Edge, uses request/response cookies directly).
//
// There is one credential: the access token issued by Fameoinfo-Backend, the
// single authentication authority. Every backend — the main API, the products
// API and the app backend — accepts it. Next to it sits the refresh token,
// exchanged at Fameoinfo when the access token expires.

import { cookies } from 'next/headers';

import {
  SESSION_COOKIE,
  REFRESH_COOKIE,
  LEGACY_SESSION_COOKIE,
  APP_SESSION_COOKIE,
  AUTH_COOKIE_OPTIONS,
} from '@/lib/api/config';

const COOKIE_OPTIONS = AUTH_COOKIE_OPTIONS;

/** @returns {Promise<string | null>} */
export async function getSessionToken() {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

/** @returns {Promise<boolean>} */
export async function hasSession() {
  return (await getSessionToken()) !== null;
}

/** @returns {Promise<string | null>} */
export async function getRefreshToken() {
  const store = await cookies();
  return store.get(REFRESH_COOKIE)?.value ?? null;
}

/**
 * Persist a token pair issued by Fameoinfo-Backend (login or refresh).
 * The refresh token rotates on every refresh, so both are always written.
 */
export async function setSessionTokens({ accessToken, refreshToken }) {
  const store = await cookies();
  store.set(SESSION_COOKIE, accessToken, COOKIE_OPTIONS);
  if (refreshToken) store.set(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);
}

export async function clearSessionToken() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(REFRESH_COOKIE);
  // Pre-refactor cookies: a stale one must not linger or be read by anything.
  store.delete(LEGACY_SESSION_COOKIE);
  store.delete('fameo_membership');
  store.delete(APP_SESSION_COOKIE);
}

export { COOKIE_OPTIONS };
