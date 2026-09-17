// store/adminAuthStore.js
//
// The admin session token is NOT in this file, and that is the point.
//
// It used to be. `localStorage.setItem("fameo_token", token)` plus a
// script-written `document.cookie` meant any XSS on the admin panel read a
// full superAdmin session with one line — and a client-written cookie is not a
// credential the server can trust anyway.
//
// Now: POST /api/auth/admin-login does the upstream call server-side and the
// token comes back only as an httpOnly Set-Cookie. This store holds the `user`
// object for rendering and nothing else. Every admin API call goes through
// /api/bff, which attaches the cookie server-side.
//
// The `user.role` kept here is COSMETIC — it decides which nav items render.
// Authorisation is the `role` claim in the signed token, checked by middleware
// and re-checked by the backend on every privileged call. A tampered store
// value gets a 403 from the API, not access.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { clientFetch } from '@/lib/api/client/fetcher';
import { LOCAL_BASE } from '@/lib/api/config';
import { localAuthRoutes } from '@/lib/api/endpoints';

export const useAdminAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const data = await clientFetch(localAuthRoutes.adminLogin(), {
            method: "POST",
            body: JSON.stringify({ email, password }),
            base: LOCAL_BASE,
          });

          const user = data?.user;

          if (!user) {
            set({
              loading: false,
              error: "Login failed — no user returned",
            });
            return { success: false };
          }

          set({ user, loading: false, error: null });
          return { success: true, user };
        } catch (e) {
          set({ loading: false, error: e.message || "Login failed" });
          return { success: false };
        }
      },

      logout: async () => {
        try {
          await clientFetch(localAuthRoutes.adminLogout(), {
            method: "POST",
            base: LOCAL_BASE,
          });
        } catch {
          // Network failure must not trap the admin in a signed-in UI. The
          // local state is cleared below either way; the cookie is httpOnly
          // and short-lived, so the worst case is a stale server session.
        }
        // Sweep pre-migration keys so an upgrade cannot leave a readable token
        // behind for anything still looking for one.
        try {
          localStorage.removeItem(STORAGE_KEYS.LEGACY_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.LEGACY_REFRESH);
          sessionStorage.removeItem(STORAGE_KEYS.USER);
        } catch {
          // Private mode / disabled storage — nothing to clean up.
        }
        set({ user: null });
      },

      clearError: () => set({ error: null }),
    }),
    { name: "fameo-admin", partialize: s => ({ user: s.user }) }
  )
);
