// app/api/auth/logout/route.js
// Clears the httpOnly session cookies and tells Fameoinfo-Backend.
//
// The cookies are cleared FIRST and unconditionally: if the upstream call
// fails, the user must still end up signed out locally. Failing the other way
// would leave a live session behind after the user asked to leave.

import { NextResponse } from 'next/server';

import { identityLogout } from '@/lib/api/server/identity';
import { getSessionToken, clearSessionToken } from '@/lib/auth/session';

export async function POST() {
  const token = await getSessionToken();

  await clearSessionToken();

  // Revokes the token and ends the session for every Fameo backend at once.
  await identityLogout(token);

  return NextResponse.json({ success: true, data: null });
}
