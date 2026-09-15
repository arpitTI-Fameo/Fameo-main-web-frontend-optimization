import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import {
  getMeAction,
  loginAction,
  logoutAction
} from '@/lib/services/auth/auth.api.js';

// ── Keys ───────────────────────────────────────────────────────────────────
// services/auth/auth.keys.js
// The single source of query keys for this resource.
//
// Defect #6: a prefetch keyed ['users'] and a hook keyed ['users', params] are
// different cache entries. Hydration silently does nothing, the crawler gets a
// spinner, and nobody notices because there is no error. Both sides import
// from here so they cannot drift.
//
// Rule worth enforcing in review: never pass an array literal as a queryKey.

export const authKeys = {
  all: () => ['auth'],
  me: () => [...authKeys.all(), 'me'],
  session: () => [...authKeys.all(), 'session'],
};

// ── Hooks ──────────────────────────────────────────────────────────────────
// 2. Define the React Query Hooks wrapping the actions

export const meQueryOptions = () => ({
  queryKey: authKeys.me(),
  queryFn: async () => {
    const response = await getMeAction();
    if (!response.code) throw response;
    return response.result;
  },
  staleTime: 60_000,
});

export function useMe(options = {}) {
  return useQuery({
    ...meQueryOptions(),
    ...options,
  });
}

export function useLoginMutation(options = {}) {
  return useApiMutation({
    mutationFn: async (credentials) => {
      const response = await loginAction(credentials);
      if (!response.code) throw response;
      return response.result;
    },
    invalidate: [authKeys.all()],
    ...options,
  });
}

export function useLogoutMutation(options = {}) {
  return useApiMutation({
    mutationFn: async () => {
      const response = await logoutAction();
      if (!response.code) throw response;
      return response.result;
    },
    invalidate: [authKeys.all()],
    ...options,
  });
}
