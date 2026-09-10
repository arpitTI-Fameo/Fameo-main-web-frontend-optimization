'use client';
// store/authStore.js
import { create }  from 'zustand';
import { persist } from 'zustand/middleware';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// SAST H-2 / M-3.
//
// Two changes to how the session cookie is written:
//
//   SameSite=Strict (was Lax). Lax still attaches the cookie to top-level
//   cross-site GET navigations, so a link from an external page carried the
//   session — the CSRF surface M-3 describes.
//
//   Secure in production. Without it the cookie is transmitted over plain HTTP
//   and anyone on the network path can read the session token.
//
// HttpOnly is deliberately NOT set here, and cannot be: a cookie written by
// document.cookie is by definition script-readable. Closing H-1/H-2 properly
// means the Express login endpoint issuing Set-Cookie itself. That is a
// separate change — this file at least stops the cookie leaking sideways and
// over plaintext in the meantime.
const isSecure = () =>
  typeof window !== 'undefined' && window.location.protocol === 'https:';

const setCookie = (name, value, days = 7) => {
  if (typeof document === 'undefined') return;
  document.cookie =
    `${name}=${value}; path=/; max-age=${days * 24 * 60 * 60}; SameSite=Strict` +
    (isSecure() ? '; Secure' : '');
};

const clearCookie = (name) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Strict`;
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:    null,
      token:   null,
      loading: false,

      // Called after successful login
      login: (userData, token) => {
        set({ user: userData, token });
        setCookie('fameo_token', token);
        // NOTE: fameo_membership is no longer written. SAST C-4 — the
        // middleware used to read it for paid-route gating, and it was
        // client-writable, so one console line bought premium access. Tier now
        // rides in the signed JWT (`plan` claim). Any cookie left over from a
        // previous session is actively cleared below so nothing reads a stale
        // one by accident.
        clearCookie('fameo_membership');
      },

      // Logout — clear state instantly, then notify backenda
      logout: async () => {
        const currentToken = get().token;
        set({ user: null, token: null });
        clearCookie('fameo_token');
        clearCookie('fameo_membership');
        if (currentToken) {
          fetch(`${API}/api/auth/logout`, {
            method:  'POST',
            headers: { Authorization: `Bearer ${currentToken}` },
          }).catch(() => {});
        }
      },

      // Update profile fields locally
      updateUser: (updatedFields) => {
        set((s) => ({ user: { ...s.user, ...updatedFields } }));
      },

      /**
       * Update membership tier after a subscription purchase.
       *
       * Because entitlement now lives in the token, changing local state is not
       * enough — the middleware reads the `plan` claim, which still says 'free'
       * until the token is replaced. So this re-mints the session server-side.
       * Without it a creator pays for Popular and still gets bounced off
       * /community.
       */
      updateMembership: async (type) => {
        set((s) => ({
          user: { ...s.user, membership: { ...s.user?.membership, type } },
        }));

        const currentToken = get().token;
        if (!currentToken) return;
        try {
          const res = await fetch(`${API}/api/auth/refresh-session`, {
            method:  'POST',
            headers: { Authorization: `Bearer ${currentToken}` },
          });
          const json = await res.json();
          const next = json?.data?.token;
          if (res.ok && next) {
            set({ token: next, user: json.data.user ?? get().user });
            setCookie('fameo_token', next);
          }
        } catch {
          // Non-fatal: the next login picks up the new plan. Paid areas may
          // stay locked until then, which is the safe direction to fail.
        }
      },

      setUser: (userData) => set({ user: userData }),

      isLoggedIn: () => !!get().token,
    }),
    {
      name:       'fameo-auth',
      partialize: (s) => ({ user: s.user, token: s.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) setCookie('fameo_token', state.token);
        else clearCookie('fameo_token');
        clearCookie('fameo_membership');
      },
    }
  )
);
