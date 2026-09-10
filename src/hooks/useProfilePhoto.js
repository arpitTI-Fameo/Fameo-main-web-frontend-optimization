// "use client";
// // hooks/useProfilePhoto.js
// // Fetches the logged-in user's profile photo from the UAT web-profile endpoint
// // and caches the resolved URL in localStorage so it isn't refetched on every
// // page load. Returns a browser-usable https URL (or null), with the app's
// // local-device profile_picture path skipped in favour of the selfie URL.

// import { useState, useEffect } from "react";

// const PROFILE_URL  = "https://uat-api.fameo.info/api/v1/user-config/web-profile";
// const CACHE_KEY    = "fameo_profile_photo";

// const isWebUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u);

// export function useProfilePhoto(enabled = true) {
//   const [photo, setPhoto] = useState(() => {
//     if (typeof window === "undefined") return null;
//     return localStorage.getItem(CACHE_KEY) || null;
//   });

//   useEffect(() => {
//     if (!enabled || typeof window === "undefined") return;

//     const token = localStorage.getItem("fameo_app_token");
//     if (!token) return;

//     let cancelled = false;
//     (async () => {
//       try {
//         const res  = await fetch(PROFILE_URL, {
//           headers: { accept: "application/json", Authorization: `Bearer ${token}` },
//         });
//         const json = await res.json().catch(() => ({}));
//         if (!res.ok || json?.success === false) {
//           console.warn("[useProfilePhoto] profile fetch failed:", res.status, json?.message);
//           return;
//         }

//         const entry = Array.isArray(json?.data) ? json.data[0] : json?.data;
//         const up    = entry?.user_profile || entry || {};
//         const reg   = entry?.registration || {};
//         const url =
//           [up.profile_picture, entry?.profile_picture, reg.selfie_image_url]
//             .find(isWebUrl) || null;

//         if (!cancelled && url) {
//           setPhoto(url);
//           localStorage.setItem(CACHE_KEY, url);
//         }
//       } catch (e) {
//         console.warn("[useProfilePhoto] profile fetch error:", e?.message);
//         /* keep cached/none on failure */
//       }
//     })();
//     return () => { cancelled = true; };
//   }, [enabled]);

//   return photo;
// }

// // Clear the cached photo (call on logout).
// export function clearProfilePhoto() {
//   if (typeof window !== "undefined") localStorage.removeItem("fameo_profile_photo");
// }


"use client";
// hooks/useProfilePhoto.js
//
// Fetches the logged-in user's profile photo from the UAT web-profile endpoint
// and caches the resolved URL in localStorage so it isn't refetched on every
// page load. Returns a browser-usable https URL (or null), with the app's
// local-device profile_picture path skipped in favour of the selfie URL.
//
// What changed from the previous version (behaviour is otherwise identical):
//   1. The cache is keyed per user. It used to be one global key, so if two
//      accounts shared a browser the second one briefly rendered the first
//      one's face.
//   2. It no longer gives up forever when `fameo_app_token` isn't in
//      localStorage yet. Right after login the token and the auth store land
//      in different ticks, so the very first run often found no token and the
//      photo never loaded until a full reload. It now retries a few times and
//      also listens for the token being written in another tab.
//   3. The request is aborted on unmount instead of setting state after the
//      component is gone.
//   4. `clearProfilePhoto()` clears every cached user, so it still does the
//      right thing when called on logout.
//
// Call it with the user object so it can key the cache:
//     const photo = useProfilePhoto(user);
// The old boolean form still works and falls back to the shared key:
//     const photo = useProfilePhoto(Boolean(user));

import { useState, useEffect } from "react";

const PROFILE_URL = "https://uat-api.fameo.info/api/v1/user-config/web-profile";
const CACHE_PREFIX = "fameo_profile_photo";
const TOKEN_KEY = "fameo_app_token";

// Retry schedule for the case where the app token hasn't been written yet.
const TOKEN_RETRY_MS = [400, 1200, 3000];

const isWebUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u);

// `arg` may be a user object, a user id, or a plain boolean (legacy call sites).
const resolveKey = (arg) => {
  if (!arg || arg === true) return CACHE_PREFIX;              // legacy / unknown user
  if (typeof arg === "string") return `${CACHE_PREFIX}:${arg}`;
  const id = arg._id || arg.id || arg.appUserId || arg.email;
  return id ? `${CACHE_PREFIX}:${id}` : CACHE_PREFIX;
};

const readCache = (key) => {
  if (typeof window === "undefined") return null;
  try { return localStorage.getItem(key) || null; } catch { return null; }
};

export function useProfilePhoto(userOrEnabled = true) {
  const enabled = Boolean(userOrEnabled);
  const cacheKey = resolveKey(userOrEnabled);

  // Never read localStorage during render — that would differ between the
  // server HTML and the first client render and trip a hydration mismatch.
  const [photo, setPhoto] = useState(null);

  // Load whatever is cached for THIS user as soon as we're on the client.
  useEffect(() => {
    if (!enabled) { setPhoto(null); return; }
    setPhoto(readCache(cacheKey));
  }, [enabled, cacheKey]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    let cancelled = false;
    const timers = [];
    const controller = new AbortController();

    const fetchPhoto = async (token) => {
      try {
        const res = await fetch(PROFILE_URL, {
          headers: { accept: "application/json", Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const json = await res.json().catch(() => ({}));

        if (!res.ok || json?.success === false) {
          console.warn("[useProfilePhoto] profile fetch failed:", res.status, json?.message);
          return;
        }

        const entry = Array.isArray(json?.data) ? json.data[0] : json?.data;
        const up = entry?.user_profile || entry || {};
        const reg = entry?.registration || {};
        const url =
          [up.profile_picture, entry?.profile_picture, reg.selfie_image_url]
            .find(isWebUrl) || null;

        if (!cancelled && url) {
          setPhoto(url);
          try { localStorage.setItem(cacheKey, url); } catch { /* quota / private mode */ }
        }
      } catch (e) {
        if (e?.name === "AbortError") return;
        console.warn("[useProfilePhoto] profile fetch error:", e?.message);
        /* keep cached/none on failure */
      }
    };

    // The app token can be written a tick after the auth store rehydrates,
    // so don't treat a missing token on the first pass as final.
    const attempt = (i = 0) => {
      if (cancelled) return;

      let token = null;
      try { token = localStorage.getItem(TOKEN_KEY); } catch { /* ignore */ }

      if (token) { fetchPhoto(token); return; }

      if (i < TOKEN_RETRY_MS.length) {
        timers.push(setTimeout(() => attempt(i + 1), TOKEN_RETRY_MS[i]));
      }
    };

    attempt();

    // Token written in another tab (or by a parallel login flow).
    const onStorage = (e) => {
      if (e.key === TOKEN_KEY && e.newValue) fetchPhoto(e.newValue);
    };
    window.addEventListener("storage", onStorage);

    return () => {
      cancelled = true;
      controller.abort();
      timers.forEach(clearTimeout);
      window.removeEventListener("storage", onStorage);
    };
  }, [enabled, cacheKey]);

  return photo;
}

// Clear cached photos (call on logout). Clears every user's entry plus the
// legacy shared key, so nothing leaks to the next account on this device.
export function clearProfilePhoto() {
  if (typeof window === "undefined") return;
  try {
    const doomed = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(CACHE_PREFIX)) doomed.push(k);
    }
    doomed.forEach((k) => localStorage.removeItem(k));
  } catch { /* ignore */ }
}

export default useProfilePhoto;