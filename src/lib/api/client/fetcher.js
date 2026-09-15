'use client';
// lib/api/client/fetcher.js
// The BROWSER's only route to any API: same-origin → a BFF route → upstream.
//
// The browser never sees an upstream origin and never holds a token. The BFF
// attaches the credential server-side from an httpOnly cookie.
//
// This module is browser-only, on purpose. A previous version tried to also
// serve Server Components by prefixing an absolute origin and forwarding
// `cookies().toString()`. That did two bad things:
//
//   1. `cookies()` returns a Promise in Next 16, so the header was literally
//      the string "[object Promise]" — the forwarding silently did nothing.
//   2. It made the server call its OWN BFF over HTTP (localhost → /api/bff →
//      upstream). That is a wasted round trip, it breaks when the public URL
//      is wrong, and every SSR request shares the server's own IP so the BFF
//      rate limiter sees them all as one client.
//
// Server Components use lib/api/server/fetcher.js (publicFetch/privateFetch),
// which talks to the upstream directly.

import { BFF_BASE } from '../config';
import { request, qs } from '../core';

/**
 * @param {string} path      upstream path, e.g. '/api/auth/me'
 * @param {object} [opts]
 * @param {object} [opts.params]  serialised to a query string
 * @param {string} [opts.base]    BFF_BASE | BFF_PRODUCTS_BASE | BFF_APP_BASE
 */
export function clientFetch(path, { params, base = BFF_BASE, ...init } = {}) {
  return request(`${base}${path}${qs(params)}`, {
    ...init,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });
}

/** FormData variant — must not set Content-Type, the browser sets the boundary. */
export function clientUpload(path, formData, { base = BFF_BASE, ...init } = {}) {
  return request(`${base}${path}`, {
    method: 'POST',
    ...init,
    credentials: 'same-origin',
    body: formData,
  });
}
