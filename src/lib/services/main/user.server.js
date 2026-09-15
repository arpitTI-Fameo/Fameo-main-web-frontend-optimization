import { createServerAction } from '@/lib/api/action';
import 'server-only';
import { privateFetch } from '@/lib/api/server/fetcher';
import { userEndpoints } from '@/lib/api/endpoints';

// ── Actions (Server-side) ───────────────────────────────────────────────────

export const getProfileServerAction = () =>
  privateFetch(userEndpoints.profile());

export const getFavoritesServerAction = () =>
  privateFetch(userEndpoints.favorites());

export const getAddressesServerAction = () =>
  privateFetch(userEndpoints.addresses());
