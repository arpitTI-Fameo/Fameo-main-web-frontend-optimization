'use client';
// lib/query/mutation.js
// Replacement for useGenericMutation.
//
// Three things the old one got wrong:
//   - it threw inside onSuccess, which in v5 does NOT route to onError (#8)
//   - it invalidated with string[] instead of QueryKey[], matching nothing (#9)
//   - it tested `if (response.code)`, so code: 0 read as failure (#10)
//
// Here failure is detected in mutationFn — the only place a throw reliably
// becomes an error — and invalidation takes real query keys.

import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * @param {object} opts
 * @param {(vars:any)=>Promise<any>} opts.mutationFn
 * @param {import('@tanstack/react-query').QueryKey[]} [opts.invalidate]
 *        Array of QUERY KEYS (arrays), e.g. [authKeys.me()] — not ['me'].
 * @param {Function} [opts.onSuccess]
 * @param {Function} [opts.onError]
 */
export function useApiMutation({ mutationFn, invalidate = [], ...options }) {
  const queryClient = useQueryClient();

  return useMutation({
    // The service layer already throws ApiError on a failed envelope, so
    // reaching here means success. No success test in onSuccess.
    mutationFn,
    ...options,
    onSuccess: async (data, variables, context) => {
      await Promise.all(
        invalidate.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey })
        )
      );
      return options.onSuccess?.(data, variables, context);
    },
  });
}
