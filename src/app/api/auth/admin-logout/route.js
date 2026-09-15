// app/api/auth/admin-logout/route.js
// Tells the upstream to invalidate the session, then clears the cookie.
//
// The browser cannot do this any more — it has no token — so it happens here.

import { NextResponse } from 'next/server';

import { API_ORIGIN } from '@/lib/api/server/origins';
import { authEndpoints } from '@/lib/api/endpoints';
import { getSessionToken, clearSessionToken } from '@/lib/auth/session';

export async function POST() {
  const token = await getSessionToken();

  if (token) {
    try {
      await fetch(`${API_ORIGIN}${authEndpoints.logout()}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
    } catch {
      // An upstream that is down must not trap the admin in a signed-in UI.
      // The cookie is cleared regardless, below.
    }
  }

  await clearSessionToken();
  return NextResponse.json({ success: true });
}
