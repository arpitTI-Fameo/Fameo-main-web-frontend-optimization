// app/api/revalidate/route.js
// The backend's publish flow calls this to drop a cache tag.
//
// Without it, everything publicFetch caches is stale until its revalidate
// window expires on its own — master data sits for an hour. That made the tag
// registry in lib/api/endpoints.js decorative: tags were attached to fetches
// and nothing ever invalidated one.
//
//   curl -X POST https://<host>/api/revalidate \
//     -H "x-revalidate-secret: $REVALIDATE_SECRET" \
//     -H "content-type: application/json" \
//     -d '{"tags":["master:states"]}'
//
// Paths work too: {"paths":["/products"]}.

import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

import { hit, clientKey, limitHeaders, LIMITS } from '@/lib/api/server/rate-limit';

const SECRET = process.env.REVALIDATE_SECRET;

/**
 * Constant-time compare. A plain `===` on a secret leaks its length and a
 * little of its content through timing; this endpoint is public, so that is a
 * real (if slow) oracle.
 */
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function POST(request) {
  const gate = hit(`revalidate:${clientKey(request)}`, LIMITS.auth.limit, LIMITS.auth.windowMs);
  if (!gate.ok) {
    return NextResponse.json(
      { success: false, message: 'Too many requests.' },
      { status: 429, headers: limitHeaders(gate, LIMITS.auth.limit) }
    );
  }

  // No secret configured means no one can prove they are allowed to purge the
  // cache. Fail closed rather than leaving an open invalidation endpoint.
  if (!SECRET) {
    return NextResponse.json(
      { success: false, message: 'Revalidation is not configured.' },
      { status: 503 }
    );
  }

  if (!safeEqual(request.headers.get('x-revalidate-secret') ?? '', SECRET)) {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body' },
      { status: 400 }
    );
  }

  const tags = Array.isArray(body?.tags) ? body.tags.filter((t) => typeof t === 'string') : [];
  const paths = Array.isArray(body?.paths) ? body.paths.filter((p) => typeof p === 'string') : [];

  if (!tags.length && !paths.length) {
    return NextResponse.json(
      { success: false, message: 'Provide at least one of `tags` or `paths`.' },
      { status: 400 }
    );
  }

  tags.forEach((tag) => revalidateTag(tag));
  paths.forEach((path) => revalidatePath(path));

  return NextResponse.json({
    success: true,
    data: { revalidated: { tags, paths }, at: Date.now() },
  });
}

export const dynamic = 'force-dynamic';
