
// lib/services/admin/core.js
// The admin panel's single transport.
//
// It holds no token. The session lives in an httpOnly cookie that /api/bff
// attaches server-side, so there is nothing here for an XSS to read — see
// store/adminAuthStore.js for why the localStorage version was removed.

import { clientFetch } from '@/lib/api/client/fetcher';

/**
 * Clears whatever a pre-migration build may have left in web storage.
 * The session itself is a server-side cookie and is cleared by
 * POST /api/auth/admin-logout.
 */
export function clearTokens() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('fameo_token');
    localStorage.removeItem('fameo_refresh');
    sessionStorage.removeItem('fameo_user');
  } catch {
    // Private mode / disabled storage — nothing to clean up.
  }
}

/**
 * @param {string} path  upstream path WITHOUT the /api prefix, e.g. '/admin/users'
 * @returns {Promise<{ data: unknown }>}
 */
export const adminFetch = async (path, opts = {}) => {
  try {
    const data = await clientFetch(`/api${path}`, opts);
    return { data };
  } catch (error) {
    if (error.status === 401) {
      clearTokens();
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    throw error;
  }
};

/**
 * Wraps adminFetch in the ubantu { code, status, error, result } envelope.
 * Preserves the 401 interceptor of adminFetch.
 */
export async function createAdminAction({ url, method = 'GET', body = null, params = null, ...rest }) {
  try {
    const config = { method, ...rest };
    if (["PUT", "PATCH", "POST", "DELETE"].includes(method.toUpperCase())) {
      if (body) {
        config.body = body instanceof FormData ? body : JSON.stringify(body);
      }
    }

    let finalUrl = url;
    if (params) {
      const { qs } = require('@/lib/api/core');
      finalUrl += qs(params);
    } else if (method.toUpperCase() === "GET" && body) {
      const { qs } = require('@/lib/api/core');
      finalUrl += qs(body);
    }

    // adminFetch already wraps the result in { data }
    const response = await adminFetch(finalUrl, config);

    return {
      code: true,
      status: 200,
      error: null,
      data: response.data,
    };
  } catch (error) {
    return {
      code: false,
      status: error?.status || 500,
      error: error?.message || "Internal server error",
      result: null,
      data: null,
    };
  }
}

