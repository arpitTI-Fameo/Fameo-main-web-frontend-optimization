// app/api/auth/login/route.js
// Login lands the token in an httpOnly cookie.
//
// Before this, the browser did the login call itself and wrote the token to
// localStorage plus a document.cookie — meaning the "session cookie" was
// readable by any script on the page. That is defect #4: httpOnly and
// getCookie() in JS cannot both be true, so one of them was a lie.
//
// Now the credentials go to this route, the route calls upstream, and only the
// Set-Cookie comes back. The token never touches client JavaScript.

import { NextResponse } from 'next/server';

import { API_ORIGIN } from '@/lib/api/config';
import { authEndpoints } from '@/lib/api/endpoints';
import { setSessionToken } from '@/lib/auth/session';

export async function POST(request) {
  let credentials;
  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body' },
      { status: 400 }
    );
  }

  let upstream, body;
  try {
    upstream = await fetch(`${API_ORIGIN}${authEndpoints.appLogin()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      cache: 'no-store',
    });
    body = await upstream.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Cannot reach the authentication server' },
      { status: 502 }
    );
  }

  if (!upstream.ok || body?.success === false) {
    return NextResponse.json(
      { success: false, message: body?.message || 'Login failed' },
      { status: upstream.status === 200 ? 401 : upstream.status }
    );
  }

  const token = body?.data?.token;
  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Login succeeded but no token was returned' },
      { status: 502 }
    );
  }

  await setSessionToken(token);

  // The token is deliberately NOT in this response. The client gets the user
  // object only — everything it legitimately needs to render.
  //
  // `appToken` is returned to the caller during migration because the Register
  // and Community flows still read it from localStorage. It is not a session
  // credential for this app. Remove it once those migrate.
  return NextResponse.json({
    success: true,
    data: {
      user: body?.data?.user ?? null,
      appToken: body?.data?.appToken ?? null,
    },
  });
}
