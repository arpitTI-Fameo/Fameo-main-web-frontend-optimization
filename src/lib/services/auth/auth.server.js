import 'server-only';
// services/auth/auth.server.js
// The signed-in member's WEB profile and entitlements, from the main API.
//
// Identity (sign-in, tokens) is Fameoinfo-Backend's — see
// lib/api/server/identity.js. The main API holds what the web platform owns
// about a member: role, membership, addresses.

import { privateFetch } from '@/lib/api/server/fetcher';
import { authEndpoints } from '@/lib/api/endpoints';
import { PRODUCTS_ORIGIN } from '@/lib/api/server/origins';

/**
 * GET /api/auth/me. Pass `token` straight after sign-in, before the new
 * cookie is readable; otherwise the session cookie is used.
 */
export const getMeServerAction = ({ token, isAdmin } = {}) => {
  const url = isAdmin ? `${PRODUCTS_ORIGIN}/api/users/me` : authEndpoints.me();
  return privateFetch(url, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
};

/** GET /api/auth/entitlements → { userId, role, plan, expiresAt }. */
export const getEntitlementsServerAction = () =>
  privateFetch(authEndpoints.entitlements());
