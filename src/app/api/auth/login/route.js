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

import { API_ORIGIN } from '@/lib/api/server/origins';
import { authEndpoints } from '@/lib/api/endpoints';
import { setSessionToken, setAppToken } from '@/lib/auth/session';
import { upstreamLoginSchema } from '@/lib/api/schemas';

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

  // Validate the upstream contract before trusting it. A rename of `token` or
  // `user` would otherwise set an undefined cookie and hand the browser a
  // "logged in" response for a session that does not exist.
  const parsed = upstreamLoginSchema.safeParse(body?.data);
  if (!parsed.success) {
    console.error('[auth/login] upstream contract mismatch', {
      issues: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`),
    });
    return NextResponse.json(
      { success: false, message: 'Login succeeded but no token was returned' },
      { status: 502 }
    );
  }

  const token = parsed.data.token;

  await setSessionToken(token);

  // The "app" backend's token goes into its own httpOnly cookie so the profile
  // and portal reads can authenticate through /api/bff-app without the browser
  // ever holding it.
  const appToken = parsed.data.appToken ?? null;
  if (appToken) await setAppToken(appToken);

  // The token is deliberately NOT in this response. The client gets the user
  // object only — everything it legitimately needs to render.
  //
  // `appToken` is NOT returned. It now rides in the httpOnly cookie set above
  // and is attached by /api/bff-app server-side, so no client code needs it.
  return NextResponse.json({
    success: true,
    data: { user: parsed.data.user ?? null },
  });
}
