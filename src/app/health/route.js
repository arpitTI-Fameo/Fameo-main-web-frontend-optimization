// app/health/route.js
// Liveness probe for the production container: Docker HEALTHCHECK, the deploy
// script and the post-deploy check (DEPLOYMENT.md). Public, no upstream call,
// never cached — a 200 means this Next.js server is up and serving requests.

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json(
    { status: 'ok', service: 'fameo-web' },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
