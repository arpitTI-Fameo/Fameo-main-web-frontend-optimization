// lib/auth/gated-routes.js
// Which routes require a session, and which additionally require a paid tier.
//
// These lists used to live inside middleware.js alone. app/sitemap.js and
// app/robots.js need the same answer, and a second hand-maintained copy would
// drift — the first symptom being a sitemap advertising URLs that redirect
// straight to /login, which wastes crawl budget and reads as a soft 404.
//
// middleware.js remains the ENFORCEMENT point. This file is only the data.

import { ADMIN_ROUTES } from '@/constants/routes';

/** Signed-in creators only. */
export const AUTH_ONLY_ROUTES = [
  '/products',
  '/account',
  '/checkout',
  '/resources',
  '/resources/my-learnings',
  '/resources/saved',
];

/** Signed in AND on a paid tier. */
export const PAID_ROUTES = [
  '/community',
  '/talent-hire',
];

/** Admin panel. Never public. */
export const ADMIN_PREFIX = ADMIN_ROUTES.ROOT;

/** Every path prefix a signed-out visitor cannot reach. */
export const GATED_ROUTES = [...AUTH_ONLY_ROUTES, ...PAID_ROUTES, ADMIN_PREFIX];

/** True when `pathname` is inside one of `routes`. */
export const matchesRoute = (pathname, routes) =>
  routes.some((r) => pathname === r || pathname.startsWith(r + '/'));
