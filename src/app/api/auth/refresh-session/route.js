// app/api/auth/refresh-session/route.js
// Re-mints the session after a plan change, and re-sets the httpOnly cookie.
//
// Entitlement rides in the signed JWT (`plan` claim), so buying a plan is not
// enough — middleware keeps reading the old claim until the token is replaced.
// The browser cannot do this any more (it has no token), so it happens here.

import { NextResponse } from 'next/server';

import { API_ORIGIN } from '@/lib/api/config';
import { authEndpoints } from '@/lib/api/endpoints';
import { getSessionToken, setSessionToken } from '@/lib/auth/session';

export async function POST() {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Not signed in' },
      { status: 401 }
    );
  }

  let body;
  try {
    const upstream = await fetch(`${API_ORIGIN}${authEndpoints.refreshSession()}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    body = await upstream.json();
    if (!upstream.ok || body?.success === false) {
      return NextResponse.json(
        { success: false, message: body?.message || 'Could not refresh session' },
        { status: upstream.status }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, message: 'Cannot reach the authentication server' },
      { status: 502 }
    );
  }

  const next = body?.data?.token;
  if (next) await setSessionToken(next);

  return NextResponse.json({
    success: true,
    data: { user: body?.data?.user ?? null },
  });
}
