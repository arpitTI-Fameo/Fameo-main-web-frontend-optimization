// app/api/auth/admin-login/route.js
// Admin login lands the token in the SAME httpOnly cookie the creator app uses.
//
// Before this, store/adminAuthStore.js did the login call from the browser and
// wrote the JWT to localStorage plus a script-readable document.cookie. Any XSS
// on /admin read a full superAdmin session with one line — the exact hole that
// was already closed on the creator side and left open here.
//
// Admins sign in with their Fameo account at Fameoinfo-Backend, like everyone
// else; being an admin is a ROLE on their web profile (main API), granted by a
// super admin. The role check below is ADVISORY: it keeps a non-admin out of
// an admin-shaped UI. The authoritative checks are the server-side admin gate
// (app/admin/layout.js) and the backend on every privileged call.

import { NextResponse } from 'next/server';

import { hit, clientKey, limitHeaders, LIMITS } from '@/lib/api/server/rate-limit';
import { setSessionTokens } from '@/lib/auth/session';
import { ADMIN_ROLES } from '@/constants/roles';
import { API_ORIGIN } from '@/lib/api/server/origins';

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

  let loginRes, body;
  try {
    loginRes = await fetch(`${API_ORIGIN}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials?.email,
        password: credentials?.password,
      }),
      cache: 'no-store',
    });
    body = await loginRes.json().catch(() => ({}));
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Cannot reach the authentication server' },
      { status: 502 }
    );
  }

  if (!loginRes.ok || !body?.success) {
    return NextResponse.json(
      { success: false, message: body?.error?.message || body?.message || 'Login failed' },
      { status: loginRes.ok ? 401 : loginRes.status }
    );
  }

  // The backend's success envelope carries the payload in `data`; the older
  // flat body carried it at the top level.
  const { user, tokens } = body.data ?? body;

  if (!tokens || !tokens.access_token) {
    return NextResponse.json(
      { success: false, message: 'Login succeeded but no token was returned' },
      { status: 502 }
    );
  }

  const roleMap = {
    super_admin: 'superAdmin',
    content_manager: 'contentManager',
    module_master: 'moduleMaster',
    support_agent: 'supportAgent',
  };

  const rawRole = user?.primary_role_id || user?.role;
  const normalizedRole = roleMap[rawRole] || rawRole;

  if (!user || !ADMIN_ROLES.includes(normalizedRole)) {
    return NextResponse.json(
      { success: false, message: 'No admin access for this account.' },
      { status: 403 }
    );
  }

  // Ensure the user object has the normalized role for the frontend to use
  user.role = normalizedRole;

  await setSessionTokens({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresIn: tokens.expires_in,
  });

  return NextResponse.json({ success: true, data: { user } });
}
