// lib/api/config.js
// Client-SAFE shared API constants.
//
// Everything in this file is inlined into the client bundle, because client
// components import it. That is fine for BFF paths and cookie names — it must
// never be true of an upstream origin.
//
// The three upstream origins therefore live in lib/api/server/origins.js,
// which is marked `server-only` so importing it from a client component is a
// build error rather than a silent leak.

/**
 * Name of the httpOnly session cookie.
 *
 * Deliberately NOT 'fameo_token'. A browser silently IGNORES a script write to
 * a name that is already httpOnly, so reusing the legacy name would make login
 * fail with no error for anyone holding an older cookie.
 */
export const SESSION_COOKIE = 'fameo_session';

/**
 * Pre-migration cookie, still present for sessions issued before this change.
 * Read-only fallback.
 */
export const LEGACY_SESSION_COOKIE = 'fameo_token';

/**
 * Pre-migration membership cookie. Cleared aggressively to prevent stale reads
 * and security bypasses since membership tier is now in the JWT.
 */
export const LEGACY_MEMBERSHIP_COOKIE = 'fameo_membership';

/**
 * httpOnly cookie holding the "app" backend's token (the one that used to live
 * in localStorage as `fameo_app_token`). It is a DIFFERENT credential from the
 * main session token, issued by a different upstream, so it gets its own
 * cookie and its own BFF attachment rather than being conflated with the
 * session.
 */
export const APP_SESSION_COOKIE = 'fameo_app_session';

/** Browser-side calls go here, never straight to an upstream origin. */
export const BFF_BASE = '/api/bff';
export const BFF_PRODUCTS_BASE = '/api/bff-products';
export const BFF_APP_BASE = '/api/bff-app';

/**
 * Our OWN Next route handlers (src/app/api/**) are already same-origin, so they
 * take no prefix. Named rather than written as a bare '' at call sites, because
 * an empty string there reads like an oversight.
 */
export const LOCAL_BASE = '';

/** Default request timeout (ms). */
export const REQUEST_TIMEOUT = 15_000;

/**
 * Page size for product listings.
 *
 * Written out as a bare `limit: 50` in three places: the authenticated
 * catalogue call, the public storefront call, and — the one that matters — the
 * SERVER prefetch of that same storefront listing. The prefetch and the client
 * hook have to ask for the identical page, or the dehydrated cache entry never
 * matches the query that reads it: no error, just a spinner and a second
 * request for data the server already fetched.
 */
export const PRODUCTS_PAGE_SIZE = 50;

/**
 * Realtime origin for socket.io.
 *
 * This one IS client-visible, and that is unavoidable: a WebSocket upgrade
 * cannot be proxied through a Next route handler, so the browser must dial the
 * realtime server directly. It is a separate variable from API_ORIGIN on
 * purpose — exposing the realtime endpoint does not expose the REST upstream,
 * and the socket still authenticates with its own token handshake.
 */
export const SOCKET_ORIGIN =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
