// lib/apiClient.js
// Global API client — auto-handles SESSION_EXPIRED errors
// Intercepts all API calls — if 401 received, logs out + redirects to login

import { useAuthStore } from '@/store/authStore';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getToken = () => {
  try {
    const raw = localStorage.getItem('fameo-auth');
    return raw ? JSON.parse(raw)?.state?.token : null;
  } catch { return null; }
};

export const apiCall = async (path, options = {}) => {
  const token = getToken();

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Read the body ONCE. The previous version called res.json() inside the 401
  // branch and again below; when the substring test missed, the second call
  // threw "body stream already read" and masked the real error.
  const data = await res.json().catch(() => ({}));

  // ── SAST L-2 ──────────────────────────────────────────────────────────────
  // Logout used to fire only when the response body happened to contain
  // 'SESSION_EXPIRED', 'expired', 'Invalid token' or 'session'. Any other 401
  // — a differently worded backend message, a proxy's generic 401, an empty
  // body — left the user sitting in a dead session, re-sending an invalid
  // token on every subsequent request.
  //
  // The HTTP status IS the signal. 401 means the credential was rejected;
  // what the body says about it is irrelevant.
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      const { logout } = useAuthStore.getState();
      await logout();
      window.location.href = '/login?reason=session_expired';
    }
    throw new Error('SESSION_EXPIRED');
  }

  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const get    = (path, opts = {})       => apiCall(path, { method: 'GET', ...opts });
export const post   = (path, body, opts = {}) => apiCall(path, { method: 'POST',  body: JSON.stringify(body), ...opts });
export const patch  = (path, body, opts = {}) => apiCall(path, { method: 'PATCH', body: JSON.stringify(body), ...opts });
export const del    = (path, opts = {})       => apiCall(path, { method: 'DELETE', ...opts });