import 'server-only';
// lib/services/admin/admin.server.js
// Server-side reads for the admin pages that prefetch and hydrate.
//
// These exist so a Server Component never has to go through the browser
// transport. The client path is component → hook → adminFetch → /api/bff →
// upstream; calling that from the server would mean the server making an HTTP
// request to itself before the real one. privateFetch goes straight to the
// upstream with the session token from the httpOnly cookie.
//
// The return shape deliberately MATCHES createAdminAction's envelope. The
// prefetched cache entry and the client's own refetch must be the same shape,
// or hydration hands the component data it does not recognise.

import { privateFetch } from '@/lib/api/server/fetcher';
import { adminEndpoints } from '@/lib/api/endpoints';

/** Mirrors the { code, status, error, data } envelope createAdminAction returns. */
async function serverAction(path) {
  try {
    const data = await privateFetch(`/api${path}`);
    return { code: true, status: 200, error: null, data };
  } catch (error) {
    // A failed prefetch must not take the page down — the client will retry on
    // mount and render its own error state. Mirrors createAdminAction.
    return {
      code: false,
      status: error?.status || 500,
      error: error?.message || 'Internal server error',
      result: null,
      data: null,
    };
  }
}

export const getAdminContentServer = (params) =>
  serverAction(adminEndpoints.contentList(params));

export const getAdminCoursesServer = () =>
  serverAction(adminEndpoints.coursesList());
