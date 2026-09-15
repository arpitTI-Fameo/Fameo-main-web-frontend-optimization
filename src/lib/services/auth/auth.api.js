'use client';

import { authEndpoints, localAuthRoutes } from '@/lib/api/endpoints';
import { LOCAL_BASE } from '@/lib/api/config';
import { createServerAction } from '@/lib/api/action';

// `authToken` was removed from these signatures: the BFF attaches the
// session from an httpOnly cookie and strips any Authorization header a
// caller sends, so the argument authenticated nothing. Callers may still
// pass one — JavaScript ignores extra arguments — and it is now correctly
// ignored instead of silently pretending to work.
export const getMeAction = async () => {
  return createServerAction({
    url: authEndpoints.me(),
    method: 'GET',
  });
};

// Posts to OUR route, which calls the upstream app-login server-side and
// returns only a Set-Cookie. It used to post authEndpoints.login() through the
// BFF, which reached the UPSTREAM /api/auth/login instead: that endpoint
// authenticates by email, so a username login answered "Invalid email or
// password", and even a success would not have set a session cookie.
export const loginAction = async (credentials) => {
  return createServerAction({
    url: localAuthRoutes.login(),
    base: LOCAL_BASE,
    method: 'POST',
    body: credentials,
  });
};

// Same reasoning as loginAction: only our route can clear an httpOnly cookie.
export const logoutAction = async () => {
  return createServerAction({
    url: localAuthRoutes.logout(),
    base: LOCAL_BASE,
    method: 'POST',
  });
};

// Re-exported so callers keep a single import point for anything auth-related.
