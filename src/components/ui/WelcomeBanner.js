'use client';
// components/ui/WelcomeBanner.js
//
// Shows a welcome card once, right after a real sign-in — not on every page
// load, not on refresh.
//
//   first sign-in ever  →  "Welcome to Fameo, <name>"  + one setup action
//   later sign-ins      →  "Welcome back, <name>"      + one contextual action
//
// How the "once" works
//   • The login page sets sessionStorage `fameo_just_logged_in` = '1'.
//     This component consumes and clears it, so a refresh never re-triggers it.
//   • localStorage `fameo_welcomed:<userId>` records that the account has
//     already seen the first-run version, so "Welcome to Fameo" appears once
//     per account, on the device it signed up from.
//
// Mount it once in app/(main)/layout.js. It renders nothing when there is
// nothing to say.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { useProfilePhoto } from '@/hooks/useProfilePhoto';
import { ROUTES } from '@/constants/routes';

export const LOGIN_FLAG = 'fameo_just_logged_in';
const SEEN_PREFIX = 'fameo_welcomed:';

const FIRST_MS = 10000; // first-run card stays a little longer
const BACK_MS = 5500;

const firstNameOf = (name = '') => (name.trim().split(/\s+/)[0] || 'there');
const initialsOf = (name = '') => {
  const p = name.trim().split(/\s+/).filter(Boolean);
  return p.length ? (p[0][0] + (p[1]?.[0] || '')).toUpperCase() : 'F';
};

const S = `
  .wb {
    position: fixed; z-index: 990;
    top: 88px; right: 20px; width: min(370px, calc(100vw - 32px));
    background: #fff;
    border: 1px solid rgba(20,15,10,0.10);
    border-radius: 14px;
    box-shadow: 0 24px 60px rgba(20,15,10,.18), 0 6px 18px rgba(0,0,0,.06);
    overflow: hidden;
    font-family: 'Schibsted Grotesk', system-ui, sans-serif;
    animation: wbIn .45s cubic-bezier(.22,1,.36,1) both;
  }
  .wb.leaving { animation: wbOut .28s ease-in both; }
  @keyframes wbIn  { from { opacity:0; transform: translateY(-14px) scale(.97); } to { opacity:1; transform:none; } }
  @keyframes wbOut { to   { opacity:0; transform: translateY(-10px) scale(.98); } }

  /* warm hairline that reads as Fameo rather than a generic toast stripe */
  .wb-edge { height: 3px; background: linear-gradient(90deg,#FFC98F,#DD8164 52%,#D45A79); }

  .wb-body { padding: 16px 18px 14px; display: flex; gap: 13px; align-items: flex-start; }

  .wb-av {
    width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg,#FFC98F,#DD8164 52%,#D45A79);
    color: #fff; font-weight: 700; font-size: 15px;
  }
  .wb-av img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .wb-text { min-width: 0; flex: 1; }
  .wb-title {
    font-size: 15px; font-weight: 700; color: #16130F; line-height: 1.3;
    letter-spacing: -.01em;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .wb-msg { margin-top: 4px; font-size: 12.5px; line-height: 1.5; color: #6C665E; }

  .wb-actions { display: flex; align-items: center; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
  .wb-cta {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 15px; border-radius: 999px; border: none; cursor: pointer;
    background: linear-gradient(135deg,#DD8164,#D45A79);
    color: #fff; font-size: 12px; font-weight: 700; letter-spacing: .01em;
    text-decoration: none;
    transition: transform .15s, box-shadow .2s;
    box-shadow: 0 6px 16px rgba(212,90,121,.35);
  }
  .wb-cta:hover { transform: translateY(-1px); box-shadow: 0 10px 22px rgba(212,90,121,.45); }
  .wb-ghost {
    padding: 8px 12px; border-radius: 999px; border: none; background: none; cursor: pointer;
    font-family: inherit; font-size: 12px; font-weight: 600; color: #8B8781;
  }
  .wb-ghost:hover { color: #16130F; background: rgba(20,15,10,.05); }

  .wb-close {
    flex-shrink: 0; width: 26px; height: 26px; margin: -3px -4px 0 0;
    display: flex; align-items: center; justify-content: center;
    border: none; background: none; cursor: pointer; border-radius: 50%;
    color: #A9A49C; line-height: 0;
  }
  .wb-close:hover { color: #16130F; background: rgba(20,15,10,.06); }

  /* time-remaining hairline; pauses while the card is hovered or focused */
  .wb-timer { height: 2px; background: rgba(20,15,10,.07); }
  .wb-timer i {
    display: block; height: 100%; width: 100%; transform-origin: 0 50%;
    background: linear-gradient(90deg,#DD8164,#D45A79);
    animation: wbCount linear forwards;
  }
  @keyframes wbCount { from { transform: scaleX(1); } to { transform: scaleX(0); } }
  .wb:hover .wb-timer i, .wb:focus-within .wb-timer i { animation-play-state: paused; }

  .wb-cta:focus-visible, .wb-ghost:focus-visible, .wb-close:focus-visible {
    outline: 2px solid #D45A79; outline-offset: 2px;
  }

  @media (max-width: 640px) {
    .wb { top: auto; bottom: 14px; left: 12px; right: 12px; width: auto; border-radius: 16px; }
    .wb { animation: wbInUp .4s cubic-bezier(.22,1,.36,1) both; }
    .wb.leaving { animation: wbOutDown .26s ease-in both; }
    @keyframes wbInUp    { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform:none; } }
    @keyframes wbOutDown { to   { opacity:0; transform: translateY(16px); } }
    .wb-title { white-space: normal; }
  }

  @media (prefers-reduced-motion: reduce) {
    .wb, .wb.leaving { animation: none; }
    .wb-timer i { animation: none; }
  }
`;

export default function WelcomeBanner({ showReturning = true }) {
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const photo = useProfilePhoto(Boolean(user));

  const [card, setCard] = useState(null); // { kind: 'first' | 'back' }
  const [leaving, setLeaving] = useState(false);
  const timers = useRef([]);

  const dismiss = useCallback(() => {
    setLeaving(true);
    timers.current.push(setTimeout(() => setCard(null), 300));
  }, []);

  // decide once, after rehydration, whether there is anything to show
  useEffect(() => {
    if (!hydrated || !user) return;
    if (typeof window === 'undefined') return;

    let justLoggedIn = false;
    try {
      justLoggedIn = sessionStorage.getItem(LOGIN_FLAG) === '1';
      if (justLoggedIn) sessionStorage.removeItem(LOGIN_FLAG);
    } catch { /* private mode — just skip */ }
    if (!justLoggedIn) return;

    const id = user._id || user.id || user.email;
    if (!id) return;

    let seen = false;
    try {
      const key = SEEN_PREFIX + id;
      seen = Boolean(localStorage.getItem(key));
      localStorage.setItem(key, String(Date.now()));
    } catch { /* ignore */ }

    if (seen && !showReturning) return;
    setCard({ kind: seen ? 'back' : 'first' });
  }, [hydrated, user, showReturning]);

  // auto-dismiss
  useEffect(() => {
    if (!card) return;
    const ms = card.kind === 'first' ? FIRST_MS : BACK_MS;
    const t = setTimeout(dismiss, ms);
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [card, dismiss]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  if (!card || !user) return null;

  const name = firstNameOf(user.name);
  const tier = user.membership?.type || 'free';
  const isFirst = card.kind === 'first';
  const duration = isFirst ? FIRST_MS : BACK_MS;

  // one action, chosen from what we actually know about the account
  let title, message, ctaLabel, ctaHref;
  if (isFirst) {
    title = `Welcome to Fameo, ${name}`;
    message = 'Add a photo and a short bio so brands can find you. It takes about a minute.';
    ctaLabel = 'Set up your profile';
    ctaHref = ROUTES.PROFILE;
  } else if (!photo) {
    title = `Welcome back, ${name}`;
    message = 'Your profile still has no photo — profiles with one get opened far more often.';
    ctaLabel = 'Add a photo';
    ctaHref = ROUTES.PROFILE;
  } else if (tier === 'free') {
    title = `Welcome back, ${name}`;
    message = "You're on the free plan. See what a membership unlocks.";
    ctaLabel = 'See plans';
    ctaHref = ROUTES.PLANS;
  } else {
    title = `Welcome back, ${name}`;
    message = 'Pick up where you left off.';
    ctaLabel = 'Go to your account';
    ctaHref = ROUTES.ACCOUNT;
  }

  return (
    <>
      <style>{S}</style>
      <div className={`wb${leaving ? ' leaving' : ''}`} role="status" aria-live="polite">
        <div className="wb-edge" aria-hidden="true" />

        <div className="wb-body">
          <span className="wb-av" aria-hidden="true">
            {photo ? <img src={photo} alt="" /> : initialsOf(user.name)}
          </span>

          <div className="wb-text">
            <div className="wb-title">{title}</div>
            <p className="wb-msg">{message}</p>

            <div className="wb-actions">
              <Link href={ctaHref} className="wb-cta" onClick={dismiss}>
                {ctaLabel}
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              {isFirst && (
                <button type="button" className="wb-ghost" onClick={dismiss}>Later</button>
              )}
            </div>
          </div>

          <button type="button" className="wb-close" onClick={dismiss} aria-label="Dismiss">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="wb-timer" aria-hidden="true">
          <i style={{ animationDuration: `${duration}ms` }} />
        </div>
      </div>
    </>
  );
}