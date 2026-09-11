'use client';
// lib/api/client/fetcher.js
// The browser's only route to the API: same-origin → /api/bff → upstream.
//
// The browser never sees API_ORIGIN and never holds the token. The BFF attaches
// it server-side from the httpOnly cookie.

import { BFF_BASE } from '../config';
import { request, qs } from '../core';

/**
 * @param {string} path   upstream path, e.g. '/api/auth/me'
 * @param {object} [opts]
 * @param {object} [opts.params]
 */
export function clientFetch(path, { params, ...init } = {}) {
  return request(`${BFF_BASE}${path}${qs(params)}`, {
    ...init,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });
}

/** FormData variant — must not set Content-Type, the browser sets the boundary. */
export function clientUpload(path, formData, init = {}) {
  return request(`${BFF_BASE}${path}`, {
    method: 'POST',
    ...init,
    credentials: 'same-origin',
    body: formData,
  });
}
