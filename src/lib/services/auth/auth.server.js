import 'server-only';
// services/auth/auth.server.js
// Server-side auth reads. Always private, never cached.

import { privateFetch } from '@/lib/api/server/fetcher';
import { authEndpoints } from '@/lib/api/endpoints';
import { getSessionToken } from '@/lib/auth/session';

/**
 * Current user, for RSC prefetch. Returns null when signed out rather than
 * throwing — "no session" is a normal state, not an error.
 *
 * @returns {Promise<import('./auth.types').AuthUser | null>}
 */
export async function getMe() {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    return await privateFetch(authEndpoints.me());
  } catch (error) {
    // A 401 here means the cookie is stale. Signed out is the correct answer.
    if (error?.status === 401) return null;
    throw error;
  }
}
