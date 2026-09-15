// lib/api/client/fetcher.js
// The browser's ONLY route to any API: same-origin → a BFF route → upstream.
//
// The browser never sees an upstream origin and never holds a token. The BFF
// attaches the credential server-side from an httpOnly cookie.
//
// One function, three bases. Three near-identical copies of this used to exist
// (here, register.client.appFetch, fameoProducts.client.call), which meant
// three places to fix a header or an error path and three chances to drift.

import { BFF_BASE } from '../config';
import { request, qs } from '../core';

/**
 * @param {string} path      upstream path, e.g. '/api/auth/me'
 * @param {object} [opts]
 * @param {object} [opts.params]  serialised to a query string
 * @param {string} [opts.base]    BFF_BASE | BFF_PRODUCTS_BASE | BFF_APP_BASE
 */
export function clientFetch(path, { params, base = BFF_BASE, ...init } = {}) {
  const isServer = typeof window === 'undefined';
  const serverPrefix = isServer ? (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000') : '';
  
  let extraHeaders = {};
  if (isServer) {
    const { cookies } = require('next/headers');
    extraHeaders['cookie'] = cookies().toString();
  }

  return request(`${serverPrefix}${base}${path}${qs(params)}`, {
    ...init,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...init.headers, ...extraHeaders },
  });
}

/** FormData variant — must not set Content-Type, the browser sets the boundary. */
export function clientUpload(path, formData, { base = BFF_BASE, ...init } = {}) {
  const isServer = typeof window === 'undefined';
  const serverPrefix = isServer ? (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000') : '';

  let extraHeaders = {};
  if (isServer) {
    const { cookies } = require('next/headers');
    extraHeaders['cookie'] = cookies().toString();
  }

  return request(`${serverPrefix}${base}${path}`, {
    method: 'POST',
    ...init,
    credentials: 'same-origin',
    headers: { ...init.headers, ...extraHeaders },
    body: formData,
  });
}
