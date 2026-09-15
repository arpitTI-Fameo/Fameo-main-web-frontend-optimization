import 'server-only';
// lib/api/server/fetcher.js
// The trust-boundary split, and the single most important file here.
//
//   publicFetch  — no cookies, cacheable, taggable. Crawlers and everyone.
//   privateFetch — forwards the session cookie, NEVER cached.
//
// Touching a cookie on a public page makes the route dynamic: static
// generation is lost, TTFB rises and crawl budget suffers. Keep them apart.

import { API_ORIGIN } from './origins';
import { request, qs } from '../core';
import { getSessionToken } from '@/lib/auth/session';

// A path starting with http(s) is treated as an absolute override, so a caller
// bound for a different upstream (the products or app backend) can reuse these
// helpers instead of hand-rolling fetch.
const url = (path, params) =>
  (/^https?:\/\//.test(path) ? path : `${API_ORIGIN}${path}`) + qs(params);

/**
 * Public, cacheable read. No credentials are attached — by design.
 *
 * @param {string} path
 * @param {object} [opts]
 * @param {object} [opts.params]      query params
 * @param {number} [opts.revalidate]  ISR window in seconds
 * @param {string[]} [opts.tags]      cache tags for revalidateTag()
 */
export function publicFetch(path, { params, revalidate, tags, ...init } = {}) {
  return request(url(path, params), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
    next: {
      ...(revalidate !== undefined ? { revalidate } : {}),
      ...(tags ? { tags } : {}),
    },
  });
}

/**
 * Authenticated read/write. Always `no-store`.
 *
 * Caching a private response would share one user's data with every other
 * user — a breach, not a bug. There is deliberately no cache option here.
 *
 * @param {string} path
 * @param {object} [opts]
 * @param {object} [opts.params]
 */
export async function privateFetch(path, { params, ...init } = {}) {
  const token = await getSessionToken();
  return request(url(path, params), {
    ...init,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
}
