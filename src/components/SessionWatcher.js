'use client';
// components/SessionWatcher.js
// Checks session every 10 minutes
// Only forces logout on explicit SESSION_EXPIRED — never on network errors

import { useEffect, useRef } from 'react';
import { useRouter }         from 'next/navigation';
import { useAuthStore }      from '@/store/authStore';

const BASE           = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const CHECK_INTERVAL = 10 * 60 * 1000; // 10 minutes

export default function SessionWatcher() {
  const { token, logout } = useAuthStore();
  const router            = useRouter();
  const tokenRef          = useRef(token);

  useEffect(() => { tokenRef.current = token; }, [token]);

  useEffect(() => {
    if (!token) return;

    const checkSession = async () => {
      try {
        const res  = await fetch(`${BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${tokenRef.current}` },
          cache:   'no-store',
        });

        if (res.status === 401) {
          const data = await res.json().catch(() => ({}));
          if (data.message === 'SESSION_EXPIRED') {
            console.log('SessionWatcher: SESSION_EXPIRED — logging out');
            await logout();
            router.push('/login?reason=session_expired');
          }
        }
      } catch (_) {
        // Network error — never logout on this
      }
    };

    // First check after 2 minutes (avoids noise on page load)
    const initial  = setTimeout(checkSession, 2 * 60 * 1000);
    const interval = setInterval(checkSession, CHECK_INTERVAL);

    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [token]);

  return null;
}