'use client';
// providers/query-provider.jsx

import { QueryClientProvider } from '@tanstack/react-query';

import { getQueryClient } from '@/lib/query/query-client';

export default function QueryProvider({ children }) {
  // Not useState — getQueryClient already returns a per-request client on the
  // server and a stable singleton in the browser.
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
