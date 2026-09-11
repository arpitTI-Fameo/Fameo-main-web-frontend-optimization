// app/api/auth/logout/route.js
// Clears the httpOnly session cookie and tells upstream.
//
// The cookie is cleared FIRST and unconditionally: if the upstream call fails,
// the user must still end up signed out locally. Failing the other way would
// leave a live session behind after the user asked to leave.

import { NextResponse } from 'next/server';

import { API_ORIGIN } from '@/lib/api/config';
import { authEndpoints } from '@/lib/api/endpoints';
import { getSessionToken, clearSessionToken } from '@/lib/auth/session';

export async function POST() {
  const token = await getSessionToken();

  await clearSessionToken();

  if (token) {
    try {
      await fetch(`${API_ORIGIN}${authEndpoints.logout()}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
    } catch {
      // Non-fatal — the local session is already gone.
    }
  }

  return NextResponse.json({ success: true, data: null });
}
