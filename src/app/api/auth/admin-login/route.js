// app/api/auth/admin-login/route.js
// Admin login lands the token in the SAME httpOnly cookie the creator app uses.
//
// Before this, store/adminAuthStore.js did the login call from the browser and
// wrote the JWT to localStorage plus a script-readable document.cookie. Any XSS
// on /admin read a full superAdmin session with one line — the exact hole that
// was already closed on the creator side and left open here.
//
// The role check below is ADVISORY: it keeps a non-admin out of an admin-shaped
// UI. The authoritative check is the `role` claim inside the signed token,
// enforced by middleware and by the backend on every privileged call. Nothing
// here is a substitute for that.

import { NextResponse } from 'next/server';

import { API_ORIGIN } from '@/lib/api/server/origins';
import { hit, clientKey, limitHeaders, LIMITS } from '@/lib/api/server/rate-limit';
import { authEndpoints } from '@/lib/api/endpoints';
import { setSessionToken } from '@/lib/auth/session';

const ADMIN_ROLES = ['superAdmin', 'contentManager', 'moduleMaster', 'supportAgent'];

export async function POST(request) {
  const gate = hit(`admin-login:${clientKey(request)}`, LIMITS.auth.limit, LIMITS.auth.windowMs);
  if (!gate.ok) {
    return NextResponse.json(
      { success: false, message: 'Too many login attempts. Try again shortly.' },
      { status: 429, headers: limitHeaders(gate, LIMITS.auth.limit) }
    );
  }

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
    upstream = await fetch(`${API_ORIGIN}${authEndpoints.login()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials?.email,
        password: credentials?.password,
      }),
      cache: 'no-store',
    });
    body = await upstream.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Cannot reach the authentication server' },
      { status: 502 }
    );
  }

  const token = body?.data?.token;
  const user = body?.data?.user;

  if (!upstream.ok || body?.success === false || !token || !user) {
    return NextResponse.json(
      { success: false, message: body?.message || 'Login failed — no token returned' },
      { status: upstream.ok ? 401 : upstream.status }
    );
  }

  if (!ADMIN_ROLES.includes(user.role)) {
    return NextResponse.json(
      { success: false, message: 'No admin access for this account.' },
      { status: 403 }
    );
  }

  await setSessionToken(token);

  // The token is deliberately NOT in this response. The client gets the user
  // object only — everything it legitimately needs to render.
  return NextResponse.json({ success: true, data: { user } });
}
