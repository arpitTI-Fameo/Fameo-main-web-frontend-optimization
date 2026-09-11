'use client';
// hooks/useAuthHydrated.js
// The auth store is persisted to localStorage, so on the server (and on the
// very first client render) `user` is always null. Rendering the nav straight
// from `user` therefore ships "Login / Register" in the HTML and swaps it for
// the avatar a tick later — a visible flash for every logged-in visitor, plus
// a React hydration mismatch warning.
//
// This hook reports whether zustand has finished reading localStorage, so the
// nav can render a neutral placeholder until it knows who the user is.
//
// It always starts false (never reads localStorage during render) so the
// server HTML and the first client render agree.

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export function useAuthHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const p = useAuthStore.persist;
    if (!p) { setHydrated(true); return; }

    if (p.hasHydrated()) setHydrated(true);

    const unsubFinish = p.onFinishHydration(() => setHydrated(true));
    return () => { unsubFinish?.(); };
  }, []);

  return hydrated;
}

export default useAuthHydrated;