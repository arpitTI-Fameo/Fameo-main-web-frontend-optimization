'use client';
// store/authStore.js
import { create }  from 'zustand';
import { persist } from 'zustand/middleware';

// SAST H-1 / H-2 are now CLOSED.
//
// This file used to mirror the session token into a cookie with
// document.cookie, which is script-readable by definition — so "httpOnly" was
// never achievable here. The session cookie is now issued by
// app/api/auth/login/route.js with httpOnly + SameSite=Strict + Secure, and
// this store never sees the token at all.
//
// What remains is UI state (`user`) plus a clear-only helper for the legacy
// fameo_membership cookie.
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

      // Called after successful login.
      //
      // The session cookie is NO LONGER written here. /api/auth/login sets it
      // httpOnly, server-side, and this code cannot (and must not) see it.
      // `token` is kept in the signature for the legacy admin/register flows
      // that still pass one; when it is null the store simply holds no token,
      // which is the correct post-migration state for the creator app.
      login: (userData, token) => {
        set({ user: userData, token: token ?? null });
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
        set({ user: null, token: null });
        clearCookie('fameo_membership');
        // Hits our own route, which clears the httpOnly cookie server-side and
        // notifies upstream. The browser has no token to send any more.
        fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'same-origin',
        }).catch(() => {});
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

        try {
          const res = await fetch('/api/auth/refresh-session', {
            method: 'POST',
            credentials: 'same-origin',
          });
          const json = await res.json();
          if (res.ok && json?.data?.user) {
            set({ user: json.data.user });
          }
        } catch {
          // Non-fatal: the next login picks up the new plan. Paid areas may
          // stay locked until then, which is the safe direction to fail.
        }
      },

      setUser: (userData) => set({ user: userData }),

      // Derived from `user`, not from a token: the token is httpOnly now and
      // this code cannot read it. `user` is the client-visible proof of session.
      isLoggedIn: () => !!get().user,
    }),
    {
      name:       'fameo-auth',
      partialize: (s) => ({ user: s.user, token: s.token }),
      onRehydrateStorage: () => () => {
        // Previously this mirrored the token into a script-readable cookie on
        // every rehydrate. The session cookie is httpOnly and server-owned now,
        // so rehydrate must not touch it — a document.cookie write here would
        // be ignored for the new cookie and would clobber the legacy one the
        // admin panel still uses.
        clearCookie('fameo_membership');
      },
    }
  )
);
