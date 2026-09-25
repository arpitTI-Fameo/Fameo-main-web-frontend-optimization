// app/api/bff-app/[...path]/route.js
// BFF for the "app" backend that the registration flow uses.
//
// Two kinds of traffic share this route:
//
//   - Registration, which is unauthenticated. With no session cookie no
//     Authorization header is attached, exactly as before.
//   - Signed-in reads (profile photo, referral/portal data). The app backend is
//     Fameoinfo-Backend, which issued the session token in the first place, so
//     the `app` credential is simply the session (see CREDENTIALS in proxy.js).

import { APP_ORIGIN } from '@/lib/api/server/origins';
import { createProxy } from '@/lib/api/server/proxy';

const proxy = createProxy(APP_ORIGIN, { credential: 'app' });

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;

export const dynamic = 'force-dynamic';
