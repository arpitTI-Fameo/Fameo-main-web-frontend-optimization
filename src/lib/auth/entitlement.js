import 'server-only';
// lib/auth/entitlement.js
// Server-side page gates for what a SIGNED-IN member may open: paid-tier pages
// and the admin panel.
//
// Middleware used to decide both from `plan` / `role` claims in a token the
// main API minted. The session token is now Fameoinfo-Backend's access token —
// it proves WHO you are and nothing about your web plan or web role — so these
// are read from the main API (/api/auth/entitlements, MongoDB-only there) by
// the Server Component that renders the page. Middleware still decides
// signed-in vs not.
//
// Like middleware, these are GATES, not the last line of defence: every API
// the pages call authorises the request itself.

import { redirect } from 'next/navigation';

import { ADMIN_ROLES } from '@/constants/roles';
import { ADMIN_ROUTES, ROUTES, withQuery } from '@/constants/routes';
import { getRequestContext } from '@/lib/api/server/context';
import { getEntitlementsServerAction } from '@/lib/services/auth/auth.server';

/**
 * Tiers that unlock paid areas (community, talent-hire).
 *
 * `pro` is a dead legacy tier but still grants ACCESS (it was a paid tier) even
 * though it carries no product discount — matching lib/planPricing.js, where
 * pro maps to a 0% rate rather than to no entitlement.
 */
export const PAID_PLANS = new Set(['pro', 'popular', 'elite', 'premium']);

export const hasPaidPlan = (entitlements) =>
  PAID_PLANS.has(String(entitlements?.plan ?? '').trim().toLowerCase());

export const isAdminRole = (role) => ADMIN_ROLES.includes(role);

/**
 * The member's entitlements, or null when they are not signed in. Any other
 * failure (main API down) is thrown to the nearest error.js rather than being
 * mistaken for "signed out".
 */
async function loadEntitlements() {
  try {
    return await getEntitlementsServerAction();
  } catch (err) {
    if (err?.status === 401) return null;
    throw err;
  }
}

/** Gate a paid-tier page. Redirects; returns the entitlements when allowed. */
export async function requirePaidPlan() {
  const { path } = await getRequestContext();
  const from = path || ROUTES.HOME;
  const entitlements = await loadEntitlements();
  if (!entitlements) redirect(withQuery(ROUTES.LOGIN, { redirect: from }));
  if (!hasPaidPlan(entitlements)) redirect(withQuery(ROUTES.PLANS, { upgrade: 'true', from }));
  return entitlements;
}

/**
 * Gate the admin panel. A valid CREATOR session must not open it.
 * The admin login page itself is never gated.
 */
export async function requireAdminRole() {
  const { path } = await getRequestContext();
  if (path === ADMIN_ROUTES.LOGIN) return null;

  const entitlements = await loadEntitlements();
  if (!entitlements) redirect(withQuery(ADMIN_ROUTES.LOGIN, { redirect: path || ADMIN_ROUTES.ROOT }));
  if (!isAdminRole(entitlements.role)) redirect(withQuery(ROUTES.HOME, { denied: 'admin' }));
  return entitlements;
}
