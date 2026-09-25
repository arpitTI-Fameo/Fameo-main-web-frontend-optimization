// app/api/auth/refresh-session/route.js
// Re-reads the signed-in member's web profile after a plan change.
//
// Entitlement used to ride in a token the main API minted (`plan` claim), so
// buying a plan meant re-minting it here. The session token is now Fameoinfo's
// and carries no plan; the plan is read from the main API wherever it is
// needed (server-side page gates, this route). What callers still need is the
// fresh user object, which is what this returns.

import { NextResponse } from 'next/server';

import { hasSession } from '@/lib/auth/session';
import { getMeServerAction } from '@/lib/services/auth/auth.server';

export async function POST() {
  if (!(await hasSession())) {
    return NextResponse.json(
      { success: false, message: 'Not signed in' },
      { status: 401 }
    );
  }

  try {
    const user = await getMeServerAction();
    return NextResponse.json({ success: true, data: { user: user ?? null } });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Could not refresh session' },
      { status: err?.status || 502 }
    );
  }
}
