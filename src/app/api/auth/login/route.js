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
//
// Upstream is Fameoinfo-Backend, the single authentication authority. Its
// access token is THE session for every Fameo backend; its refresh token goes
// in a second httpOnly cookie for the BFF and middleware to renew it. The
// main API contributes only the member's web profile (role, membership).

import { NextResponse } from 'next/server';

import { identityLogin } from '@/lib/api/server/identity';
import { setSessionTokens } from '@/lib/auth/session';
import { getMeServerAction } from '@/lib/services/auth/auth.server';

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

  // The form collects a USERNAME; Fameoinfo also accepts an email here.
  const login = await identityLogin({
    username: credentials?.username,
    password: credentials?.password,
  });
  if (!login.ok) {
    return NextResponse.json(
      { success: false, message: login.message },
      { status: login.status }
    );
  }

  // Fetch the web profile (role, membership, etc.) from the main server.
  // Falls back to the user object Fameoinfo already returned if the main
  // server is unreachable or rejects the token.
  let user;
  try {
    user = await getMeServerAction({ token: login.tokens.accessToken });
  } catch {
    user = login.user ?? null;
  }

  await setSessionTokens(login.tokens);

  // The tokens are deliberately NOT in this response. The client gets the user
  // object only — everything it legitimately needs to render.
  return NextResponse.json({
    success: true,
    data: { user: user ?? null },
  });
}
