// app/api/bff-app/[...path]/route.js
// BFF for the "app" backend that the registration flow uses.
//
// Two kinds of traffic share this route:
//
//   - Registration, which is unauthenticated. getAppToken() returns null then
//     and no Authorization header is attached, exactly as before.
//   - Signed-in reads (profile photo, referral/portal data), which authenticate
//     with the APP backend's own token. That token used to sit in localStorage
//     as `fameo_app_token`; it is now an httpOnly cookie attached here.
//
// The app token is a DIFFERENT credential from the main session — different
// upstream, different issuer — so it gets its own cookie rather than being
// conflated with the session.

import { APP_ORIGIN } from '@/lib/api/server/origins';
import { createProxy } from '@/lib/api/server/proxy';

const proxy = createProxy(APP_ORIGIN, { credential: 'app' });

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;

export const dynamic = 'force-dynamic';
