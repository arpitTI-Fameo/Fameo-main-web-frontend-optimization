// lib/query/query-client.js
// One QueryClient factory, plus a browser singleton.
//
// staleTime defaults to 0 in TanStack, which means every prefetched query
// refetches the moment it mounts — the server work is thrown away and the user
// sees a spinner over data that is already on screen. 60s makes hydration
// actually count (defect #11).

import { QueryClient, isServer } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        retry: (failureCount, error) => {
          // Never retry a real answer from the server — only flaky transport.
          const status = error?.status;
          if (status >= 400 && status < 500) return false;
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient;

/**
 * Server: a fresh client per request, so no data leaks between users.
 * Browser: a singleton, so hydrated data survives re-renders.
 */
export function getQueryClient() {
  if (isServer) return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
