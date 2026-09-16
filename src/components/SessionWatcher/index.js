'use client';
// components/SessionWatcher.js
// Checks session every 10 minutes
// Only forces logout on explicit SESSION_EXPIRED — never on network errors

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authEndpoints } from '@/lib/api/endpoints';
import { BFF_BASE } from '@/lib/api/config';

const CHECK_INTERVAL = 10 * 60 * 1000; // 10 minutes

export default function SessionWatcher() {
  // `user` replaces `token` as the signed-in signal: the session token is
  // httpOnly now and unreadable from here. The BFF attaches it server-side,
  // so no Authorization header is built in the browser any more.
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const checkSession = async () => {
      try {
        const res = await fetch(`${BFF_BASE}${authEndpoints.me()}`, {
          credentials: 'same-origin',
          cache: 'no-store',
        });

        if (res.status === 401) {
          const data = await res.json().catch(() => ({}));
          if (data.message === 'SESSION_EXPIRED') {
            await logout();
            router.push('/login?reason=session_expired');
          }
        }
      } catch (_) {
        // Network error — never logout on this
      }
    };

    // First check after 2 minutes (avoids noise on page load)
    const initial = setTimeout(checkSession, 2 * 60 * 1000);
    const interval = setInterval(checkSession, CHECK_INTERVAL);

    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [user]);

  return null;
}