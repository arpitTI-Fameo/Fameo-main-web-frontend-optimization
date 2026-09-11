'use client';

import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { authKeys } from '@/lib/services/auth/auth.keys';
import { getMe, loginRequest, logoutRequest } from '@/lib/services/auth/auth.client';

// Re-exported so callers keep a single import point for anything auth-related.
export { loginRequest, logoutRequest };

// Shared so an RSC prefetch and this hook cannot disagree about the key.
export const meQueryOptions = () => ({
  queryKey: authKeys.me(),
  queryFn: getMe,
  staleTime: 60_000,
});

export function useMe(options = {}) {
  return useQuery({ ...meQueryOptions(), ...options });
}

export function useLoginMutation(options = {}) {
  return useApiMutation({
    mutationFn: loginRequest,
    invalidate: [authKeys.all()],
    ...options,
  });
}

export function useLogoutMutation(options = {}) {
  return useApiMutation({
    mutationFn: logoutRequest,
    invalidate: [authKeys.all()],
    ...options,
  });
}
