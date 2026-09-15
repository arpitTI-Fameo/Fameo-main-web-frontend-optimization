import 'server-only';
// lib/auth/session.js
// Async cookie helpers. In Next 15+ `cookies()` returns a Promise — calling it
// synchronously throws, which is defect #1 in the migration guide.
//
// This is the ONLY place the session cookie is read or written on the server.

import { cookies } from 'next/headers';

import {
  SESSION_COOKIE,
  LEGACY_SESSION_COOKIE,
  APP_SESSION_COOKIE,
} from '@/lib/api/config';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

/**
 * Prefers the httpOnly cookie this layer issues, falling back to the legacy
 * script-written one so sessions created before the migration keep working.
 * @returns {Promise<string | null>}
 */
export async function getSessionToken() {
  const store = await cookies();
  return (
    store.get(SESSION_COOKIE)?.value ??
    store.get(LEGACY_SESSION_COOKIE)?.value ??
    null
  );
}

/** @returns {Promise<boolean>} */
export async function hasSession() {
  return (await getSessionToken()) !== null;
}

export async function setSessionToken(token, { maxAge } = {}) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    ...COOKIE_OPTIONS,
    ...(maxAge ? { maxAge } : {}),
  });
}

/**
 * The "app" backend's token. Separate credential, separate cookie — see
 * APP_SESSION_COOKIE. Read by the bff-app proxy so the browser never holds it.
 * @returns {Promise<string | null>}
 */
export async function getAppToken() {
  const store = await cookies();
  return store.get(APP_SESSION_COOKIE)?.value ?? null;
}

export async function setAppToken(token, { maxAge } = {}) {
  const store = await cookies();
  store.set(APP_SESSION_COOKIE, token, {
    ...COOKIE_OPTIONS,
    ...(maxAge ? { maxAge } : {}),
  });
}

export async function clearSessionToken() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  // Also drop the pre-migration cookie, or a stale one keeps the user signed in.
  store.delete(LEGACY_SESSION_COOKIE);
  // Legacy cookie from the pre-migration client-side auth store. Cleared so a
  // stale value cannot be read by anything still looking for it.
  store.delete('fameo_membership');
  store.delete(APP_SESSION_COOKIE);
}

export { COOKIE_OPTIONS };
