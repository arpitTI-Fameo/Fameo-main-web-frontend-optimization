// middleware.js
// /products          → login required (any plan)
// /community         → login + paid plan (pro/popular/elite)
// /talent-hire       → login + paid plan (pro/popular/elite)
// /account /checkout → login required

import { NextResponse } from 'next/server';
import { verifyToken, isAdminRole, hasPaidPlan } from '@/lib/security/jwtEdge';
import { REQUEST_HEADERS } from '@/lib/api/request-headers';

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
// All three now resolve from one cryptographically verified token.
//
// This is a GATE, not the last line of defence. Middleware decides what renders;
// every API the pages call must still authorise the request itself. A route that
// is only protected here is protected only against browsers.
// ─────────────────────────────────────────────────────────────────────────────

// Signed-in creators only.
const AUTH_ONLY_ROUTES = [
  '/products',
  '/account',
  '/checkout',
  '/resources',
  '/resources/my-learnings',
  '/resources/saved',
];

// Signed in AND on a paid tier.
const PAID_ROUTES = [
  '/community',
  '/talent-hire',
];

const matches = (pathname, routes) =>
  routes.some((r) => pathname === r || pathname.startsWith(r + '/'));

const redirectTo = (request, path, params = {}) => {
  const url = new URL(path, request.url);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return NextResponse.redirect(url);
};

/**
 * Clear the auth cookies on the way out. Without this, an expired or tampered
 * token stays in the jar and the user bounces through the login redirect on
 * every navigation.
 */
const redirectAndClear = (request, path, params = {}) => {
  const res = redirectTo(request, path, params);
  res.cookies.delete('fameo_session');
  res.cookies.delete('fameo_token');
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
 * Host comes from the request itself, never from a client-supplied
 * x-tenant-id header, which any caller can forge (defect #3).
 */
const nextWithContext = (request) => {
  const headers = new Headers(request.headers);
  headers.set(REQUEST_HEADERS.host, request.nextUrl.host);
  headers.set(REQUEST_HEADERS.path, request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Prefer the httpOnly creator-session cookie; fall back to the legacy
  // 'fameo_token' still written by the admin store and by pre-migration
  // sessions. See lib/api/config.js for why the names differ.
  const token = request.cookies.get('fameo_session')?.value
    ?? request.cookies.get('fameo_token')?.value;
  const claims = await verifyToken(token);   // null unless the signature checks out

  // ── Admin ─────────────────────────────────────────────────────────────────
  if (pathname === '/admin/login') {
    // Already a valid admin? Skip the login screen.
    if (claims && isAdminRole(claims.role)) return redirectTo(request, '/admin');
    return nextWithContext(request);
  }

  if (pathname.startsWith('/admin')) {
    if (!claims) return redirectAndClear(request, '/admin/login', { redirect: pathname });
    // A valid CREATOR token must not open the admin panel. Role comes from the
    // signed claim, not from sessionStorage (SAST H-8).
    if (!isAdminRole(claims.role)) return redirectTo(request, '/', { denied: 'admin' });
    return nextWithContext(request);
  }

  // ── Signed-in creator routes ──────────────────────────────────────────────
  if (matches(pathname, AUTH_ONLY_ROUTES) && !claims) {
    return redirectAndClear(request, '/login', { redirect: pathname });
  }

  // ── Paid-tier routes ──────────────────────────────────────────────────────
  if (matches(pathname, PAID_ROUTES)) {
    if (!claims) return redirectAndClear(request, '/login', { redirect: pathname });
    if (!hasPaidPlan(claims)) {
      return redirectTo(request, '/plans', { upgrade: 'true', from: pathname });
    }
  }

  return nextWithContext(request);
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
