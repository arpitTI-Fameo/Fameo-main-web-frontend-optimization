// // middleware.js
// // /products          → login required (any plan)
// // /community         → login + paid plan (pro/popular/elite)
// // /talent-hire       → login + paid plan (pro/popular/elite)
// // /account /checkout → login required

// import { NextResponse } from 'next/server';

// const AUTH_ONLY_ROUTES = [
//   '/products',
//   '/account',
//   '/checkout',
//   '/resources',
//   '/resources/my-learnings',
//   '/resources/saved',
// ];

// const PAID_ROUTES = [
//   '/community',
//   '/talent-hire',
// ];

// const PAID_PLANS = ['pro', 'popular', 'elite'];

// export function middleware(request) {
//   const { pathname } = request.nextUrl;

//   const token      = request.cookies.get('fameo_token')?.value;
//   const membership = request.cookies.get('fameo_membership')?.value || 'free';
//   const isPaid     = PAID_PLANS.includes(membership);

//   // ── Login required only ───────────────────────────────────────────────────
//   const isAuthOnly = AUTH_ONLY_ROUTES.some(
//     r => pathname === r || pathname.startsWith(r + '/')
//   );
//   if (isAuthOnly && !token) {
//     const url = new URL('/login', request.url);
//     url.searchParams.set('redirect', pathname);
//     return NextResponse.redirect(url);
//   }

//   // ── Login + paid plan required ────────────────────────────────────────────
//   const isPaidRoute = PAID_ROUTES.some(
//     r => pathname === r || pathname.startsWith(r + '/')
//   );
//   if (isPaidRoute) {
//     if (!token) {
//       const url = new URL('/login', request.url);
//       url.searchParams.set('redirect', pathname);
//       return NextResponse.redirect(url);
//     }
//     if (!isPaid) {
//       const url = new URL('/plans', request.url);
//       url.searchParams.set('upgrade', 'true');
//       url.searchParams.set('from', pathname);
//       return NextResponse.redirect(url);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/products/:path*',
//     '/community/:path*',
//     '/talent-hire/:path*',
//     '/account/:path*',
//     '/checkout',
//     '/resources',
//     '/resources/:path*',
//   ],
// };


// // // import { NextResponse } from "next/server";

// // // export function middleware(request) {
// // //   return NextResponse.next();
// // // }


// // // // middleware.js
// // // // Protects routes that require authentication
// // // // Next.js middleware runs on the edge before page renders

// // // import { NextResponse } from 'next/server';
// // // import { PROTECTED_ROUTES } from './constants/routes';

// // // export function middleware(request) {
// // //   const { pathname } = request.nextUrl;

// // //   // Check if route needs protection
// // //   const isProtected = PROTECTED_ROUTES.some(
// // //     (route) => pathname === route || pathname.startsWith(route + '/')
// // //   );

// // //   if (!isProtected) return NextResponse.next();

// // //   // Read token from cookie (set during login)
// // //   // Note: Zustand localStorage is not available in middleware
// // //   // So we use a cookie mirror of the token
// // //   const token = request.cookies.get('fameo_token')?.value;

// // //   if (!token) {
// // //     const loginUrl = new URL('/login', request.url);
// // //     loginUrl.searchParams.set('redirect', pathname);
// // //     return NextResponse.redirect(loginUrl);
// // //   }

// // //   return NextResponse.next();
// // // }

// // // export const config = {
// // //   matcher: [
// // //     '/account/:path*',
// // //     '/checkout',
// // //     '/resources/my-learnings',
// // //     '/resources/saved',
// // //   ],
// // // };


// // // middleware.js
// // // FREE users cannot access: products, community, talent-hire
// // // PRO, POPULAR, ELITE users have full access
// // // All logged-in users can access: account, checkout, saved, learnings

// // import { NextResponse } from 'next/server';

// // const AUTH_ROUTES = [
// //   '/account',
// //   '/checkout',
// //   '/resources/my-learnings',
// //   '/resources/saved',
// // ];

// // // Only FREE users are blocked from these
// // const PAID_ROUTES = [
// //   '/products',
// //   '/community',
// //   '/talent-hire',
// // ];

// // // Plans that have full access
// // const PAID_PLANS = ['pro', 'popular', 'elite'];

// // export function middleware(request) {
// //   const { pathname } = request.nextUrl;

// //   const token      = request.cookies.get('fameo_token')?.value;
// //   const membership = request.cookies.get('fameo_membership')?.value || 'free';
// //   const isPaid     = PAID_PLANS.includes(membership);

// //   // ── Auth routes — require login ─────────────────────────────────────────────
// //   const isAuthRoute = AUTH_ROUTES.some(
// //     r => pathname === r || pathname.startsWith(r + '/')
// //   );
// //   if (isAuthRoute && !token) {
// //     const url = new URL('/login', request.url);
// //     url.searchParams.set('redirect', pathname);
// //     return NextResponse.redirect(url);
// //   }

// //   // ── Paid routes — require Pro / Popular / Elite ───────────────────────────
// //   const isPaidRoute = PAID_ROUTES.some(
// //     r => pathname === r || pathname.startsWith(r + '/')
// //   );
// //   if (isPaidRoute) {
// //     if (!token) {
// //       const url = new URL('/login', request.url);
// //       url.searchParams.set('redirect', pathname);
// //       return NextResponse.redirect(url);
// //     }
// //     if (!isPaid) {
// //       const url = new URL('/plans', request.url);
// //       url.searchParams.set('upgrade', 'true');
// //       url.searchParams.set('from', pathname);
// //       return NextResponse.redirect(url);
// //     }
// //   }

// //   return NextResponse.next();
// // }

// // export const config = {
// //   matcher: [
// //     '/products/:path*',
// //     '/community/:path*',
// //     '/talent-hire/:path*',
// //     '/account/:path*',
// //     '/checkout',
// //     '/resources/my-learnings',
// //     '/resources/saved',
// //   ],
// // };


// // middleware.js
// // /products          → login required (any plan)
// // /community         → login + paid plan (pro/popular/elite)
// // /talent-hire       → login + paid plan (pro/popular/elite)
// // /account /checkout → login required

// import { NextResponse } from 'next/server';

// const AUTH_ONLY_ROUTES = [
//   '/products',
//   '/account',
//   '/checkout',
//   '/resources',
//   '/resources/my-learnings',
//   '/resources/saved',
// ];

// const PAID_ROUTES = [
//   '/community',
//   '/talent-hire',
// ];

// const PAID_PLANS = ['pro', 'popular', 'elite'];

// export function middleware(request) {
//   const { pathname } = request.nextUrl;

//   const token      = request.cookies.get('fameo_token')?.value;
//   const membership = request.cookies.get('fameo_membership')?.value || 'free';
//   const isPaid     = PAID_PLANS.includes(membership);

//   // ── Login required only ───────────────────────────────────────────────────
//   const isAuthOnly = AUTH_ONLY_ROUTES.some(
//     r => pathname === r || pathname.startsWith(r + '/')
//   );
//   if (isAuthOnly && !token) {
//     const url = new URL('/login', request.url);
//     url.searchParams.set('redirect', pathname);
//     return NextResponse.redirect(url);
//   }

//   // ── Login + paid plan required ────────────────────────────────────────────
//   const isPaidRoute = PAID_ROUTES.some(
//     r => pathname === r || pathname.startsWith(r + '/')
//   );
//   if (isPaidRoute) {
//     if (!token) {
//       const url = new URL('/login', request.url);
//       url.searchParams.set('redirect', pathname);
//       return NextResponse.redirect(url);
//     }
//     if (!isPaid) {
//       const url = new URL('/plans', request.url);
//       url.searchParams.set('upgrade', 'true');
//       url.searchParams.set('from', pathname);
//       return NextResponse.redirect(url);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/products/:path*',
//     '/community/:path*',
//     '/talent-hire/:path*',
//     '/account/:path*',
//     '/checkout',
//     '/resources/my-learnings',
//     '/resources/saved',
//   ],
// };
// // import { NextResponse } from "next/server";

// // export function middleware(request) {
// //   return NextResponse.next();
// // }


// // // middleware.js
// // // Protects routes that require authentication
// // // Next.js middleware runs on the edge before page renders

// // import { NextResponse } from 'next/server';
// // import { PROTECTED_ROUTES } from './constants/routes';

// // export function middleware(request) {
// //   const { pathname } = request.nextUrl;

// //   // Check if route needs protection
// //   const isProtected = PROTECTED_ROUTES.some(
// //     (route) => pathname === route || pathname.startsWith(route + '/')
// //   );

// //   if (!isProtected) return NextResponse.next();

// //   // Read token from cookie (set during login)
// //   // Note: Zustand localStorage is not available in middleware
// //   // So we use a cookie mirror of the token
// //   const token = request.cookies.get('fameo_token')?.value;

// //   if (!token) {
// //     const loginUrl = new URL('/login', request.url);
// //     loginUrl.searchParams.set('redirect', pathname);
// //     return NextResponse.redirect(loginUrl);
// //   }

// //   return NextResponse.next();
// // }

// // export const config = {
// //   matcher: [
// //     '/account/:path*',
// //     '/checkout',
// //     '/resources/my-learnings',
// //     '/resources/saved',
// //   ],
// // };


// // middleware.js
// // FREE users cannot access: products, community, talent-hire
// // PRO, POPULAR, ELITE users have full access
// // All logged-in users can access: account, checkout, saved, learnings

// import { NextResponse } from 'next/server';

// const AUTH_ROUTES = [
//   '/account',
//   '/checkout',
//   '/resources/my-learnings',
//   '/resources/saved',
// ];

// // Only FREE users are blocked from these
// const PAID_ROUTES = [
//   '/products',
//   '/community',
//   '/talent-hire',
// ];

// // Plans that have full access
// const PAID_PLANS = ['pro', 'popular', 'elite'];

// export function middleware(request) {
//   const { pathname } = request.nextUrl;

//   const token      = request.cookies.get('fameo_token')?.value;
//   const membership = request.cookies.get('fameo_membership')?.value || 'free';
//   const isPaid     = PAID_PLANS.includes(membership);

//   // ── Auth routes — require login ─────────────────────────────────────────────
//   const isAuthRoute = AUTH_ROUTES.some(
//     r => pathname === r || pathname.startsWith(r + '/')
//   );
//   if (isAuthRoute && !token) {
//     const url = new URL('/login', request.url);
//     url.searchParams.set('redirect', pathname);
//     return NextResponse.redirect(url);
//   }

//   // ── Paid routes — require Pro / Popular / Elite ───────────────────────────
//   const isPaidRoute = PAID_ROUTES.some(
//     r => pathname === r || pathname.startsWith(r + '/')
//   );
//   if (isPaidRoute) {
//     if (!token) {
//       const url = new URL('/login', request.url);
//       url.searchParams.set('redirect', pathname);
//       return NextResponse.redirect(url);
//     }
//     if (!isPaid) {
//       const url = new URL('/plans', request.url);
//       url.searchParams.set('upgrade', 'true');
//       url.searchParams.set('from', pathname);
//       return NextResponse.redirect(url);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/products/:path*',
//     '/community/:path*',
//     '/talent-hire/:path*',
//     '/account/:path*',
//     '/checkout',
//     '/resources/my-learnings',
//     '/resources/saved',
//   ],
// };


// middleware.js
// /products          → login required (any plan)
// /community         → login + paid plan (pro/popular/elite)
// /talent-hire       → login + paid plan (pro/popular/elite)
// /account /checkout → login required

import { NextResponse } from 'next/server';
import { verifyToken, isAdminRole, hasPaidPlan } from '@/lib/security/jwtEdge';

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
  res.cookies.delete('fameo_token');
  res.cookies.delete('fameo_membership');
  return res;
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const token  = request.cookies.get('fameo_token')?.value;
  const claims = await verifyToken(token);   // null unless the signature checks out

  // ── Admin ─────────────────────────────────────────────────────────────────
  if (pathname === '/admin/login') {
    // Already a valid admin? Skip the login screen.
    if (claims && isAdminRole(claims.role)) return redirectTo(request, '/admin');
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    if (!claims) return redirectAndClear(request, '/admin/login', { redirect: pathname });
    // A valid CREATOR token must not open the admin panel. Role comes from the
    // signed claim, not from sessionStorage (SAST H-8).
    if (!isAdminRole(claims.role)) return redirectTo(request, '/', { denied: 'admin' });
    return NextResponse.next();
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

  return NextResponse.next();
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
