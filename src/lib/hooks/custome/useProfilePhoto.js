
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
//   2. It no longer needs a token in localStorage at all. The request goes to
//      /api/bff-app, which attaches the app token from an httpOnly cookie
//      server-side — so the old "token written a tick later" race, the retry
//      schedule and the cross-tab storage listener are all gone with it.
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

import { BFF_APP_BASE } from "@/lib/api/config";
import { userConfigEndpoints } from "@/lib/api/endpoints";

// Same-origin. The upstream host used to be hardcoded here, which shipped it in
// the client bundle and could not be changed per environment.
const PROFILE_URL = `${BFF_APP_BASE}${userConfigEndpoints.webProfile()}`;
const CACHE_PREFIX = "fameo_profile_photo";

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
    const controller = new AbortController();

    const fetchPhoto = async () => {
      try {
        const res = await fetch(PROFILE_URL, {
          headers: { accept: "application/json" },
          credentials: "same-origin",
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

    // The cookie is already set by the time any component mounts, so a single
    // attempt is enough — no token-arrival race left to wait out.
    fetchPhoto();

    return () => {
      cancelled = true;
      controller.abort();
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