'use client';
// components/Layout/Navbar/UserMenu/index.jsx
// The whole right-hand auth cluster of MainNav in one place:
//
//   not hydrated yet  →  neutral skeleton (no Login/avatar flash)
//   signed out        →  Login + Register (unchanged classes from MainNav)
//   signed in         →  avatar + first name pill + account dropdown
//
// `ink` comes from MainNav: true on a light page at rest, which flips everything
// here from white-on-hero to ink-on-white. `solid` (scrolled) turns the pill
// into the same dark glass capsule as the logo and links.

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useAuthHydrated } from '@/lib/hooks/custome/useAuthHydrated';
import { useProfilePhoto, clearProfilePhoto } from '@/lib/hooks/custome/useProfilePhoto';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

import { FOCUS_RING, GROTESK, MONO, PILL, PILL_SOLID } from '../classes';

/* ── helpers ──────────────────────────────────────────────────────────────── */
const firstNameOf = (name = '') => (name.trim().split(/\s+/)[0] || 'You');

const initialsOf = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'F';
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
};

const TIER_LABEL = { free: 'Free', elite: 'Elite', premium: 'Premium' };

const EASE = '[--ease:cubic-bezier(.22,1,.36,1)]';

const LOGIN = cn(
  `inline-flex cursor-pointer items-center rounded-[4px] border-[1.5px] bg-none px-[18px] py-[9px] ${MONO} text-[11px] font-normal tracking-[.1em] whitespace-nowrap uppercase no-underline`,
  '[transition:border-color_.25s,color_.25s,background-color_.25s,scale_.12s_var(--ease)] active:scale-95 motion-reduce:transition-none',
  FOCUS_RING,
  'max-[480px]:px-3 max-[480px]:py-2 max-[480px]:text-[10px] max-[480px]:tracking-[.06em]'
);

const REGISTER = cn(
  `relative inline-flex cursor-pointer items-center overflow-hidden border-none px-[22px] py-[11px] ${MONO} text-[11px] font-bold tracking-[.1em] whitespace-nowrap text-white uppercase no-underline`,
  // organic blob
  'rounded-[46%_54%_52%_48%/58%_52%_48%_42%] bg-[linear-gradient(135deg,#FFC98F_30%,#DD8164_50%,#D45A79_76%)] shadow-[0_6px_20px_rgba(212,90,121,0.45)]',
  '[transition:translate_.18s_var(--ease),scale_.18s_var(--ease),box-shadow_.25s,border-radius_.5s_var(--ease)] motion-reduce:transition-none',
  'hover:-translate-y-px hover:scale-103 hover:rounded-[52%_48%_46%_54%/48%_58%_42%_52%] hover:shadow-[0_10px_30px_rgba(212,90,121,0.65)]',
  'active:translate-y-0 active:scale-96',
  'focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white',
  // sheen sweep on hover
  "after:absolute after:inset-0 after:-translate-x-[160%] after:bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.45)_50%,transparent_70%)] after:[transition:translate_.7s_var(--ease)] after:content-[''] hover:after:translate-x-[160%]",
  'max-[480px]:px-[15px] max-[480px]:py-[9px] max-[480px]:text-[10px] max-[480px]:tracking-[.06em]'
);

const TRUNCATE = 'max-w-40 overflow-hidden text-ellipsis whitespace-nowrap';

/* ── component ────────────────────────────────────────────────────────────── */
export default function UserMenu({ ink = false, solid = false }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const photo = useProfilePhoto(Boolean(user));
  const [imgBroken, setImgBroken] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => { setImgBroken(false); }, [photo]);

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    clearProfilePhoto();
    router.push(ROUTES.HOME);
    router.refresh(); // drop the Router Cache so middleware re-locks protected routes
  };

  const showPhoto = photo && !imgBroken;

  return (
    <>
      {/* 1 — store not read yet: neutral placeholder, no flash either way */}
      {!hydrated && (
        <div
          className={cn('h-[46px] w-[120px] rounded-full', solid ? PILL_SOLID : ink ? 'bg-[rgba(20,15,10,0.06)]' : 'bg-white/12')}
          aria-hidden="true"
        />
      )}

      {/* 2 — signed out */}
      {hydrated && !user && (
        <div className="flex items-center gap-2.5">
          <Link
            href={ROUTES.LOGIN}
            className={cn(
              LOGIN,
              solid
                ? cn(PILL_SOLID, 'text-white/85 hover:border-white/60 hover:text-white')
                : ink
                  ? `border-[rgba(20,15,10,0.12)] text-[#3a352d] hover:border-[#16130F] hover:bg-[rgba(20,15,10,0.05)] hover:text-[#16130F]`
                  : 'border-white/32 text-white/85 hover:border-white/85 hover:bg-white/10 hover:text-white'
            )}
          >
            Login
          </Link>
          <Link href={ROUTES.REGISTER} className={REGISTER}>Register</Link>
        </div>
      )}

      {/* 3 — signed in */}
      {hydrated && user && (
        <div className={cn('relative flex items-center', EASE)} ref={rootRef}>
          {/* pill: avatar + name + chevron. Name collapses away on small screens. */}
          <button
            type="button"
            className={cn(
              PILL,
              'inline-flex h-[46px] max-w-[190px] cursor-pointer items-center gap-2.5 pr-[14px] pl-[3px] font-sans active:scale-97',
              FOCUS_RING,
              'max-[640px]:size-[46px] max-[640px]:justify-center max-[640px]:gap-0 max-[640px]:p-0 max-[380px]:size-[42px]',
              solid
                ? `${PILL_SOLID} text-white hover:border-[#D45A79]`
                : ink
                  ? `border-[rgba(20,15,10,0.12)] bg-[rgba(20,15,10,0.04)] text-[#16130F] hover:border-[#D45A79] hover:bg-[rgba(20,15,10,0.07)]`
                  : 'border-white/30 bg-white/8 text-white hover:border-[#D45A79] hover:bg-white/14',
              open && (solid ? 'border-[#D45A79]' : ink ? 'border-[#D45A79] bg-[rgba(20,15,10,0.07)]' : 'border-[#D45A79] bg-white/14')
            )}
            onClick={() => setOpen((o) => !o)}
            aria-label={`Account menu for ${user.name || 'your account'}`}
            aria-expanded={open}
            aria-haspopup="menu"
          >
            <span className="flex size-[38px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#FFC98F_0%,#DD8164_52%,#D45A79_100%)] text-[14px] font-bold tracking-[.02em] text-white max-[640px]:size-[38px] max-[380px]:size-[34px] max-[380px]:text-[12px]">
              {showPhoto
                ? <img src={photo} alt="" className="block size-full object-cover" onError={() => setImgBroken(true)} />
                : initialsOf(user.name)}
            </span>
            <span className="max-w-24 overflow-hidden text-[14px] font-medium tracking-[-.01em] text-ellipsis whitespace-nowrap max-[640px]:hidden">
              {firstNameOf(user.name)}
            </span>
            <svg
              className={cn('ml-0.5 shrink-0 opacity-80 [transition:rotate_.25s_var(--ease)] max-[640px]:hidden', open && 'rotate-180')}
              width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"
            >
              <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {open && (
            <div
              className={`absolute top-[calc(100%+12px)] right-0 z-[1000] w-[252px] animate-[mnDrop_.22s_var(--ease)] overflow-hidden rounded-[10px] border border-[rgba(20,15,10,0.12)] bg-white shadow-[0_24px_60px_rgba(20,15,10,0.18),0_8px_24px_rgba(0,0,0,0.06)] motion-reduce:animate-none max-[640px]:-right-1.5 max-[480px]:w-[min(268px,calc(100vw-24px))]`}
              role="menu"
            >
              <div className={`flex items-start gap-[11px] border-b border-[rgba(20,15,10,0.12)] bg-[#F7F5F0] px-[18px] py-[15px]`}>
                <div className={`flex size-[38px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#D45A79] ${GROTESK} text-[15px] font-bold text-white`}>
                  {showPhoto
                    ? <img src={photo} alt="" className="block size-full rounded-full object-cover" onError={() => setImgBroken(true)} />
                    : initialsOf(user.name)}
                </div>
                <div className="min-w-0">
                  <div className={`${TRUNCATE} ${GROTESK} text-[13px] leading-[1.3] font-semibold text-[#16130F]`}>{user.name}</div>
                  <div className={`mt-0.5 ${TRUNCATE} ${MONO} text-[11px] tracking-[.02em] text-[#8B8781]`}>{user.email}</div>
                  {(() => {
                    const tier = user.membership?.type || 'free';
                    return (
                      <span
                        className={cn(
                          `mt-[5px] inline-block rounded-full border px-2 py-0.5 ${MONO} text-[9px] font-bold tracking-[.14em] uppercase`,
                          tier !== 'free'
                            ? 'border-transparent bg-[linear-gradient(135deg,#FFC98F,#D45A79)] text-white'
                            : 'border-[rgba(212,90,121,.25)] bg-[rgba(212,90,121,.12)] text-[#B0446A]'
                        )}
                      >
                        {TIER_LABEL[tier] || tier}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* account links: re-enable with ACCOUNT_MENU_ITEMS when needed */}
              <button
                type="button"
                className={`flex w-full cursor-pointer items-center gap-[11px] border-none bg-transparent px-[18px] py-2.5 text-left ${GROTESK} text-[12.5px] font-normal text-[#c23a3a] [transition:color_.15s,background-color_.15s,padding-left_.2s_var(--ease)] hover:bg-[rgba(194,58,58,0.06)] hover:pl-[22px] hover:text-[#9c2020] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#c23a3a]`}
                onClick={handleLogout}
                role="menuitem"
              >
                <span>⎋</span> Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}