// app/api/bff/[...path]/route.js
// BFF for the main Fameo API.
//
// This is the only code that reads the session cookie for browser-originated
// calls. The token never reaches client JavaScript, which is what makes the
// httpOnly cookie meaningful rather than decorative.
//
// If access tokens become short-lived, the refresh attempt belongs in
// createProxy() — it is the only code that holds the cookie.

import { API_ORIGIN } from '@/lib/api/config';
import { createProxy } from '@/lib/api/server/proxy';

const proxy = createProxy(API_ORIGIN);

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;

export const dynamic = 'force-dynamic';
