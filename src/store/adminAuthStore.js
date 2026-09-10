
// store/adminAuthStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const ADMIN_ROLES = ["superAdmin","contentManager","moduleMaster","supportAgent"];
const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// SAST H-1 / H-8, and the wiring C-2 needs.
//
// Three problems here:
//
//   H-1  The admin JWT went into localStorage, where any XSS on the admin panel
//        reads it with one line.
//   H-8  The admin ROLE went into sessionStorage, where any XSS overwrites it
//        with "superAdmin". Client-stored roles are cosmetic; they must never
//        be the thing that decides what an admin can do.
//   C-2  The token was never written to a COOKIE at all — so once /admin is in
//        the middleware matcher, Edge middleware has nothing to verify and
//        every admin gets bounced to the login page.
//
// Fixed here: the token is written as a cookie (SameSite=Strict, Secure in
// production) so middleware can verify it, and sessionStorage is no longer
// used for the role. The role the UI renders from comes back from the server
// on every login and is re-checked server-side on each privileged call.
//
// Still outstanding, and requiring a backend change: the token remains
// script-readable. Only a server-issued HttpOnly Set-Cookie closes H-1
// completely.
const isSecure = () =>
  typeof window !== "undefined" && window.location.protocol === "https:";

const setCookie = (name, value, days = 1) => {
  if (typeof document === "undefined") return;
  document.cookie =
    `${name}=${value}; path=/; max-age=${days * 24 * 60 * 60}; SameSite=Strict` +
    (isSecure() ? "; Secure" : "");
};

const clearCookie = (name) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Strict`;
};

export const useAdminAuthStore = create(
  persist(
    (set) => ({
      user:    null,
      loading: false,
      error:   null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res  = await fetch(`${BASE}/auth/login`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ email, password }),
          });
          const json = await res.json();

          const token = json?.data?.token;
          const user  = json?.data?.user;

          if (!token || !user) {
            set({ loading: false, error: "Login failed — no token returned" });
            return { success: false };
          }

          // Advisory only: keeps a non-admin out of an admin-shaped UI. The
          // authoritative check is the `role` claim inside the signed token,
          // enforced by middleware (C-2/C-3) and by the backend on every
          // privileged call.
          if (!ADMIN_ROLES.includes(user.role)) {
            set({ loading: false, error: "No admin access for this account." });
            return { success: false };
          }

          localStorage.setItem("fameo_token", token);
          setCookie("fameo_token", token);
          set({ user, loading: false, error: null });
          return { success: true, user };
        } catch (e) {
          set({ loading: false, error: e.message || "Login failed" });
          return { success: false };
        }
      },

      logout: async () => {
        try {
          const token = localStorage.getItem("fameo_token");
          await fetch(`${BASE}/auth/logout`, {
            method:  "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch {}
        localStorage.removeItem("fameo_token");
        localStorage.removeItem("fameo_refresh");
        // Clear the legacy key too — H-8's sessionStorage role must not survive
        // an upgrade and get picked up by anything still reading it.
        sessionStorage.removeItem("fameo_user");
        clearCookie("fameo_token");
        set({ user: null });
      },

      clearError: () => set({ error: null }),
    }),
    { name: "fameo-admin", partialize: s => ({ user: s.user }) }
  )
);
