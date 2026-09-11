import 'server-only';
// lib/api/server/proxy.js
// Shared BFF proxy factory.
//
// Fameo has two upstreams (the main API and the products API) that share a
// JWT_SECRET, so one session is valid for both. Each gets its own BFF route
// built from this factory — the token is attached server-side in exactly one
// place regardless of which upstream a call is bound for.

import { NextResponse } from 'next/server';

import { getSessionToken } from '@/lib/auth/session';

// Hop-by-hop and body-framing headers must not be forwarded.
const STRIP = new Set([
  'host', 'connection', 'keep-alive', 'transfer-encoding', 'upgrade',
  'proxy-authorization', 'proxy-authenticate', 'te', 'trailer',
  'content-length', 'accept-encoding', 'cookie',
]);

/**
 * @param {string} origin  upstream origin, server-only
 * @returns {(request: Request, ctx: { params: Promise<{path: string[]}> }) => Promise<Response>}
 */
export function createProxy(origin) {
  return async function proxy(request, ctx) {
    const { path = [] } = await ctx.params;
    const search = new URL(request.url).search;
    const target = `${origin}/${path.join('/')}${search}`;

    const headers = new Headers();
    for (const [k, v] of request.headers) {
      if (!STRIP.has(k.toLowerCase())) headers.set(k, v);
    }

    // The whole point: the token is attached here, server-side.
    const token = await getSessionToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const hasBody = !['GET', 'HEAD'].includes(request.method);

    let upstream;
    try {
      upstream = await fetch(target, {
        method: request.method,
        headers,
        body: hasBody ? request.body : undefined,
        // Required by undici whenever a streaming body is forwarded.
        ...(hasBody ? { duplex: 'half' } : {}),
        redirect: 'manual',
        cache: 'no-store',
      });
    } catch {
      return NextResponse.json(
        { success: false, message: 'Upstream unreachable' },
        { status: 502 }
      );
    }

    const resHeaders = new Headers(upstream.headers);
    // Never let an upstream cache directive make a per-user response cacheable.
    resHeaders.delete('content-encoding');
    resHeaders.delete('content-length');
    resHeaders.set('cache-control', 'no-store');

    return new NextResponse(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: resHeaders,
    });
  };
}
