// app/api/smartauth/liveness/route.js
// Authenticated proxy to the SmartAuth liveness check endpoint.
//
// SAST C-5 — this route had NO authentication. Any anonymous caller could hit
// it and, using Fameo's paid provider key, exhaust the KYC quota, submit real
// PAN numbers, or probe the provider. The raw request body was forwarded
// verbatim, so the caller also chose which provider fields were set.
//
// Three guards now, in order:
//   1. requireUser  — a valid signed session, or 401.
//   2. rateLimit    — per user, so one account cannot drain the quota (H-7).
//   3. allowFields  — an allowlist; unexpected keys are dropped, not proxied.
//
// The provider key stays server-side, as it always did. That was never the
// problem — the problem was who could make us use it.

import { NextResponse } from 'next/server';
import { requireUser, rateLimit, tooManyRequests, allowFields } from '@/lib/security/apiGuard';

// Fields this endpoint is allowed to forward. Anything else is dropped.
const ALLOWED = ['image', 'imageBase64', 'consent'];

export async function POST(req) {
  const { user, error } = await requireUser(req);
  if (error) return error;

  const { ok, retryAfter } = rateLimit(`smartauth:liveness:${user.id}`, {
    limit: 10,
    windowMs: 60_000,
  });
  if (!ok) return tooManyRequests(retryAfter);

  if (!process.env.SMARTAUTH_KEY) {
    console.error('[smartauth/liveness] SMARTAUTH_KEY is not configured');
    return NextResponse.json(
      { message: 'Verification is temporarily unavailable.' },
      { status: 503 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  const payload = allowFields(body, ALLOWED);
  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const res = await fetch('https://prod.smartauth.co/9UEF', {
      method: 'POST',
      headers: {
        authkey: process.env.SMARTAUTH_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    // Log server-side; do not return err.message to the caller — provider
    // errors can leak endpoint structure and key state.
    console.error('[smartauth/liveness] upstream call failed:', err?.message);
    return NextResponse.json(
      { message: 'Verification service is unavailable. Please try again.' },
      { status: 502 }
    );
  }
}
