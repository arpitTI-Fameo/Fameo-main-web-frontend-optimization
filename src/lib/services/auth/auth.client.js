'use client';
// services/auth/auth.client.js
// The auth service: every auth HTTP call in one place.
//
// Layering is component -> hook -> service -> request. These functions lived
// in lib/hooks/main/useAuth.js under a "Service Functions" heading, which is
// exactly where they did NOT belong.
//
// Login and logout deliberately post to our OWN routes rather than through the
// BFF: those routes are what set and clear the httpOnly session cookie.

import { clientFetch } from '@/lib/api/client/fetcher';
import { request } from '@/lib/api/core';
import { authEndpoints } from '@/lib/api/endpoints';

export const getMe = () => clientFetch(authEndpoints.me());

export function loginRequest(credentials) {
  return request('/api/auth/login', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
}

export function logoutRequest() {
  return request('/api/auth/logout', {
    method: 'POST',
    credentials: 'same-origin',
  });
}
