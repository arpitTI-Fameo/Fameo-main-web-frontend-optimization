// app/api/auth/admin-logout/route.js
// Tells Fameoinfo-Backend to end the session, then clears the cookies.
//
// The browser cannot do this any more — it has no token — so it happens here.

import { NextResponse } from 'next/server';

import { identityLogout } from '@/lib/api/server/identity';
import { getSessionToken, clearSessionToken } from '@/lib/auth/session';

export async function POST() {
  const token = await getSessionToken();

  // An upstream that is down must not trap the admin in a signed-in UI —
  // identityLogout never throws, and the cookies are cleared regardless.
  await identityLogout(token);

  await clearSessionToken();
  return NextResponse.json({ success: true });
}
