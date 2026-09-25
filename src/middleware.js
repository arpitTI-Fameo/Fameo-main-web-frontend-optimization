// middleware.js
// /products          → login required (any plan)
// /community         → login required; paid plan checked server-side
// /talent-hire       → login required; paid plan checked server-side
// /account /checkout → login required
// /admin             → login required; admin role checked server-side

import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/security/jwtEdge';
import { identityRefresh } from '@/lib/api/server/identity';
import { REQUEST_HEADERS } from '@/lib/api/request-headers';
import {
  AUTH_ONLY_ROUTES,
  PAID_ROUTES,
  matchesRoute,
} from '@/lib/auth/gated-routes';
import {
  SESSION_COOKIE,
  REFRESH_COOKIE,
  LEGACY_SESSION_COOKIE,
  APP_SESSION_COOKIE,
  AUTH_COOKIE_OPTIONS,
} from '@/lib/api/config';
import { ADMIN_ROUTES } from '@/constants/routes';

// ─────────────────────────────────────────────────────────────────────────────
// SAST C-2 / C-3 / C-4 — rewritten.
//
// The previous middleware had three holes that compounded:
//
//   C-2  /admin was absent from the matcher, so middleware never ran for ANY
//        admin route. The only guard was a useEffect in app/admin/layout.js —
//        defeated by disabling JavaScript, or by fetching the route directly.
//
//   C-3  Authentication was `if (!token) redirect`. Presence, not validity.
//        Any non-empty string in the fameo_token cookie passed.
//
//   C-4  Paid-tier gating read the fameo_membership cookie, which the client
//        set itself without HttpOnly. One console line granted premium.
//
// Authentication resolves from one cryptographically verified token: the
// access token issued by Fameoinfo-Backend, the single authentication
// authority. It says WHO the member is — not their web plan or web role — so
// the C-2 and C-4 checks now run server-side, against the main API, in the
// Server Components that render those pages (lib/auth/entitlement.js).
//
// This is a GATE, not the last line of defence. Middleware decides what renders;
// every API the pages call must still authorise the request itself. A route that
// is only protected here is protected only against browsers.
// ─────────────────────────────────────────────────────────────────────────────

// The lists themselves live in lib/auth/gated-routes.js so app/sitemap.js and
// app/robots.js can read the same answer instead of keeping a second copy that
// drifts. Enforcement stays here.
const matches = matchesRoute;

/**
 * The verified session for this request, renewing an expired access token
 * with the refresh token when there is one.
 *
 * @returns {Promise<{ claims: object | null, renewed: { accessToken: string, refreshToken: string | null } | null, refreshFailed: boolean }>}
 */
async function resolveSession(request) {
  const claims = await verifyToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (claims) return { claims, renewed: null, refreshFailed: false };

  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return { claims: null, renewed: null, refreshFailed: false };

  const pair = await identityRefresh(refreshToken);
  const renewedClaims = pair ? await verifyToken(pair.accessToken) : null;
  if (!renewedClaims) return { claims: null, renewed: null, refreshFailed: true };
  return { claims: renewedClaims, renewed: pair, refreshFailed: false };
}

/** Persist a renewed token pair on the way out. */
const withRenewed = (res, renewed) => {
  if (renewed) {
    res.cookies.set(SESSION_COOKIE, renewed.accessToken, AUTH_COOKIE_OPTIONS);
    if (renewed.refreshToken) res.cookies.set(REFRESH_COOKIE, renewed.refreshToken, AUTH_COOKIE_OPTIONS);
  }
  return res;
};

const redirectTo = (request, path, params = {}) => {
  const url = new URL(path, request.url);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return NextResponse.redirect(url);
};

/**
 * Clear the auth cookies on the way out. Without this, an expired or tampered
 * token stays in the jar and the user bounces through the login redirect on
 * every navigation.
 *
 * The refresh cookie is kept when a refresh was attempted and failed: with
 * several requests in flight, another one may just have rotated it, and
 * deleting the replacement it set would sign the member out. A genuinely dead
 * refresh token only costs one failed refresh on the next gated navigation.
 */
const redirectAndClear = (request, path, params = {}, { keepRefresh = false } = {}) => {
  const res = redirectTo(request, path, params);
  res.cookies.delete(SESSION_COOKIE);
  if (!keepRefresh) res.cookies.delete(REFRESH_COOKIE);
  res.cookies.delete(LEGACY_SESSION_COOKIE);
  res.cookies.delete(APP_SESSION_COOKIE);
  res.cookies.delete('fameo_membership');
  return res;
};

/**
 * Forward context to Server Components.
 *
 * Defect #2 in CLAUDE.md: `response.headers.set()` puts the value on the way
 * OUT — the browser sees it, Server Components never do. Values have to ride
 * on the REQUEST, which is what NextResponse.next({ request: { headers } })
 * does. lib/api/server/context.js reads them back.
 *
 * A renewed access token rides the same way, so Server Components rendering
 * THIS request already read the new one from their cookie store.
 *
 * Host comes from the request itself, never from a client-supplied
 * x-tenant-id header, which any caller can forge (defect #3).
 */
const nextWithContext = (request, renewed) => {
  if (renewed) request.cookies.set(SESSION_COOKIE, renewed.accessToken);
  const headers = new Headers(request.headers);
  headers.set(REQUEST_HEADERS.host, request.nextUrl.host);
  headers.set(REQUEST_HEADERS.path, request.nextUrl.pathname);
  return withRenewed(NextResponse.next({ request: { headers } }), renewed);
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // null unless the signature checks out (after a refresh, if one was needed)
  const { claims, renewed, refreshFailed } = await resolveSession(request);
  const signIn = (path) =>
    redirectAndClear(request, path, { redirect: pathname }, { keepRefresh: refreshFailed });

  // ── Admin ─────────────────────────────────────────────────────────────────
  if (pathname === ADMIN_ROUTES.LOGIN) return nextWithContext(request, renewed);

  if (pathname.startsWith(ADMIN_ROUTES.ROOT)) {
    if (!claims) return signIn(ADMIN_ROUTES.LOGIN);
    // Admin ROLE is checked server-side by app/admin/layout.js.
    return nextWithContext(request, renewed);
  }

  // ── Signed-in creator routes ──────────────────────────────────────────────
  if (matches(pathname, AUTH_ONLY_ROUTES) && !claims) return signIn('/login');

  // ── Paid-tier routes ──────────────────────────────────────────────────────
  // Plan is checked server-side by the route's layout.js.
  if (matches(pathname, PAID_ROUTES) && !claims) return signIn('/login');

  return nextWithContext(request, renewed);
}

export const config = {
  matcher: [
    // C-2: admin was missing entirely. It is the first entry now so the
    // omission is obvious if anyone edits this list again.
    '/admin/:path*',
    '/products/:path*',
    '/community/:path*',
    '/talent-hire/:path*',
    '/account/:path*',
    '/checkout',
    '/resources',
    '/resources/:path*',
  ],
};
