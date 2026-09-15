'use client';

import { authEndpoints } from '@/lib/api/endpoints';
import { createServerAction } from '@/lib/api/action';

// 1. Define the Server Actions
export const getMeAction = async (authToken) => {
  return createServerAction({
    url: authEndpoints.me(),
    method: 'GET',
    authToken,
  });
};

export const loginAction = async (credentials) => {
  return createServerAction({
    url: authEndpoints.login(),
    method: 'POST',
    body: credentials,
  });
};

export const logoutAction = async () => {
  return createServerAction({
    url: authEndpoints.logout(),
    method: 'POST',
  });
};

// Re-exported so callers keep a single import point for anything auth-related.
