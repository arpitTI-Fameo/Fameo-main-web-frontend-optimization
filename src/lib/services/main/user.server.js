import { createServerAction } from '@/lib/api/action';
import 'server-only';
import { privateFetch, appPrivateFetch } from '@/lib/api/server/fetcher';
import { userEndpoints, userConfigEndpoints } from '@/lib/api/endpoints';

// ── Actions (Server-side) ───────────────────────────────────────────────────

export const getProfileServerAction = () =>
  privateFetch(userEndpoints.profile());

export const getFavoritesServerAction = () =>
  privateFetch(userEndpoints.favorites());

export const getAddressesServerAction = () =>
  privateFetch(userEndpoints.addresses());

/**
 * SSR counterpart of getWebProfileAction. Returns the SAME unwrapped payload
 * the client hook produces, so `initialData` and a later refetch agree.
 */
export const getWebProfileServerAction = () =>
  appPrivateFetch(userConfigEndpoints.webProfile());
