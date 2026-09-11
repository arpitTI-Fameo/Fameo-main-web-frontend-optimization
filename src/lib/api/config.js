// lib/api/config.js
// Single source of truth for API origin, cookie name and BFF base.
//
// Adapted from the TypeScript reference in CLAUDE.md — this codebase is
// JavaScript, so validation is runtime-only (no compile-time guarantees).

/**
 * Upstream API origin.
 *
 * The guide is explicit that the origin must NOT be NEXT_PUBLIC_: once it is,
 * the upstream ships inside the client bundle and the BFF stops being a trust
 * boundary. `API_ORIGIN` is the server-only name this layer wants.
 *
 * NEXT_PUBLIC_API_URL is kept as a fallback ONLY so this migration does not
 * break the ~20 legacy call sites that still read it directly. Once those are
 * migrated, set API_ORIGIN in the environment and delete the fallback.
 */
export const API_ORIGIN = (
  process.env.API_ORIGIN ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000'
).replace(/\/$/, '');

/**
 * Name of the httpOnly session cookie for the CREATOR app.
 *
 * Deliberately NOT 'fameo_token'. The admin panel (store/adminAuthStore.js)
 * still writes 'fameo_token' via document.cookie, and a browser silently
 * IGNORES a script write to a name that is already httpOnly — so reusing the
 * name would make admin login fail with no error for anyone who had signed in
 * as a creator first.
 */
export const SESSION_COOKIE = 'fameo_session';

/**
 * Pre-migration cookie, still written by the admin store and by any creator
 * session issued before this change. Read-only fallback. Delete once admin
 * auth moves to SESSION_COOKIE.
 */
export const LEGACY_SESSION_COOKIE = 'fameo_token';

/**
 * Products backend origin. Shares JWT_SECRET with the main API, so one session
 * is valid for both. Same NEXT_PUBLIC_ caveat as API_ORIGIN applies.
 */
export const PRODUCTS_ORIGIN = (
  process.env.PRODUCTS_ORIGIN ||
  process.env.NEXT_PUBLIC_PRODUCTS_API_URL ||
  'http://localhost:5001/api'
).replace(/\/$/, '');

/**
 * The "app" backend (uat-api.fameo.info) that the registration flow talks to.
 *
 * This was hardcoded as a literal inside modules/Auth/Register/api.js — so the
 * upstream origin shipped in the client bundle and could not be changed per
 * environment without editing source. APP_BACKEND_URL already exists in .env
 * and is server-only; it is the right home for it.
 */
export const APP_ORIGIN = (
  process.env.APP_ORIGIN ||
  process.env.APP_BACKEND_URL ||
  'https://uat-api.fameo.info'
).replace(/\/$/, '');

/** Browser-side calls go here, never straight to an upstream origin. */
export const BFF_BASE = '/api/bff';
export const BFF_PRODUCTS_BASE = '/api/bff-products';
export const BFF_APP_BASE = '/api/bff-app';

/** Default request timeout (ms). */
export const REQUEST_TIMEOUT = 15_000;

/**
 * Fail loudly in production rather than silently pointing at localhost.
 * Mirrors the guard jwtEdge.js already does for JWT_SECRET.
 */
if (
  process.env.NODE_ENV === 'production' &&
  !process.env.API_ORIGIN &&
  !process.env.NEXT_PUBLIC_API_URL
) {
  throw new Error(
    'API_ORIGIN is not set. Every upstream request would fall back to ' +
    'http://localhost:5000. Refusing to start.'
  );
}
