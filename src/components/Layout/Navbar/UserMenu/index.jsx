'use client';
// components/Layout/Navbar/UserMenu/index.jsx
// The whole right-hand auth cluster of MainNav in one place:
//
//   not hydrated yet  →  neutral skeleton (no Login/avatar flash)
//   signed out        →  Login + Register (unchanged classes from MainNav)
//   signed in         →  avatar + first name pill + account dropdown
//
// It lives inside `.mn-bar`, so it reuses MainNav's `.mn-dropdown` / `.mn-dd-*`
// styles and only adds the `um-` classes it needs for the pill itself.

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { useProfilePhoto, clearProfilePhoto } from '@/hooks/useProfilePhoto';
import { ACCOUNT_MENU_ITEMS } from '@/constants/megaMenu';
import { ROUTES } from '@/constants/routes';

/* ── helpers ──────────────────────────────────────────────────────────────── */
const firstNameOf = (name = '') => (name.trim().split(/\s+/)[0] || 'there');

const initialsOf = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'F';
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
};

const TIER_LABEL = { free: 'Free', elite: 'Elite', premium: 'Premium' };

/* ── styles ───────────────────────────────────────────────────────────────── */
const S = `
  /* pill: avatar + name + chevron. Name collapses away on small screens. */
  .um-root { position: relative; display: flex; align-items: center; }

  .um-pill {
    display: inline-flex; align-items: center; gap: 9px;
    height: 40px; padding: 0 12px 0 3px;
    background: rgba(255,255,255,0.08);
    border: 1.5px solid rgba(255,255,255,0.28);
    border-radius: 999px; cursor: pointer;
    font-family: 'Schibsted Grotesk', sans-serif;
    color: rgba(255,255,255,0.92);
    transition: border-color .25s, background .25s, transform .12s var(--mn-ease, cubic-bezier(.22,1,.36,1));
    max-width: 190px;
  }
  .um-pill:hover, .um-pill.open {
    border-color: var(--mn-accent, #D45A79);
    background: rgba(255,255,255,0.14);
  }
  .um-pill:active { transform: scale(.97); }
  .um-pill:focus-visible { outline: 2px solid var(--mn-accent, #D45A79); outline-offset: 3px; }

  /* on white/solid bar the pill flips to ink */
  .mn-bar.solid .um-pill,
  .mn-bar.light .um-pill {
    background: rgba(20,15,10,0.04);
    border-color: var(--mn-line, rgba(20,15,10,0.12));
    color: var(--mn-ink, #16130F);
  }
  .mn-bar.solid .um-pill:hover, .mn-bar.solid .um-pill.open,
  .mn-bar.light .um-pill:hover, .mn-bar.light .um-pill.open {
    border-color: var(--mn-accent, #D45A79);
    background: rgba(20,15,10,0.07);
  }

  .um-av {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; overflow: hidden;
    background: linear-gradient(135deg, #FFC98F 0%, #DD8164 52%, #D45A79 100%);
    color: #fff; font-size: 13px; font-weight: 700; letter-spacing: .02em;
  }
  .um-av img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .um-name {
    font-size: 13px; font-weight: 600; letter-spacing: -.01em;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-width: 96px;
  }

  .um-chev {
    flex-shrink: 0; opacity: .6;
    transition: transform .25s var(--mn-ease, cubic-bezier(.22,1,.36,1));
  }
  .um-pill.open .um-chev { transform: rotate(180deg); }

  /* membership chip inside the dropdown header */
  .um-tier {
    display: inline-block; margin-top: 5px; padding: 2px 8px; border-radius: 999px;
    font-family: 'Space Mono', monospace; font-size: 9px; font-weight: 700;
    letter-spacing: .14em; text-transform: uppercase;
    background: rgba(212,90,121,.12); color: #B0446A;
    border: 1px solid rgba(212,90,121,.25);
  }
  .um-tier.paid {
    background: linear-gradient(135deg,#FFC98F,#D45A79); color:#fff; border-color: transparent;
  }

  /* skeleton shown until the persisted store has rehydrated */
  .um-skel {
    width: 96px; height: 40px; border-radius: 999px;
    background: rgba(255,255,255,0.12);
  }
  .mn-bar.solid .um-skel,
  .mn-bar.light .um-skel { background: rgba(20,15,10,0.06); }

  .um-dd-head-text { min-width: 0; }
  .um-dd-head-text .mn-dd-name,
  .um-dd-head-text .mn-dd-email {
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 160px;
  }

  /* ── small screens: avatar only, no name, bigger tap target ── */
  @media (max-width: 640px) {
    .um-pill { padding: 0; gap: 0; width: 42px; height: 42px; justify-content: center; border-radius: 50%; }
    .um-av   { width: 36px; height: 36px; }
    .um-name, .um-chev { display: none; }
    .um-dropdown-fix { right: -6px; }
  }
  @media (max-width: 380px) {
    .um-pill { width: 38px; height: 38px; }
    .um-av   { width: 32px; height: 32px; font-size: 12px; }
  }
`;

/* ── component ────────────────────────────────────────────────────────────── */
export default function UserMenu({ onNavigate }) {
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
      <style>{S}</style>

      {/* 1 — store not read yet: neutral placeholder, no flash either way */}
      {!hydrated && <div className="um-skel" aria-hidden="true" />}

      {/* 2 — signed out */}
      {hydrated && !user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href={ROUTES.LOGIN} className="mn-login">Login</Link>
          <Link href={ROUTES.REGISTER} className="mn-register">Register</Link>
        </div>
      )}

      {/* 3 — signed in */}
      {hydrated && user && (
        <div className="um-root" ref={rootRef}>
          <button
            type="button"
            className={`um-pill${open ? ' open' : ''}`}
            onClick={() => setOpen((o) => !o)}
            aria-label={`Account menu for ${user.name || 'your account'}`}
            aria-expanded={open}
            aria-haspopup="menu"
          >
            <span className="um-av">
              {showPhoto
                ? <img src={photo} alt="" onError={() => setImgBroken(true)} />
                : initialsOf(user.name)}
            </span>
            <span className="um-name">{firstNameOf(user.name)}</span>
            <svg className="um-chev" width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {open && (
            <div className="mn-dropdown um-dropdown-fix" role="menu">
              <div className="mn-dd-head">
                <div className="mn-dd-av">
                  {showPhoto
                    ? <img src={photo} alt="" className="mn-dd-av-img" onError={() => setImgBroken(true)} />
                    : initialsOf(user.name)}
                </div>
                <div className="um-dd-head-text">
                  <div className="mn-dd-name">{user.name}</div>
                  <div className="mn-dd-email">{user.email}</div>
                  {(() => {
                    const tier = user.membership?.type || 'free';
                    return (
                      <span className={`um-tier${tier !== 'free' ? ' paid' : ''}`}>
                        {TIER_LABEL[tier] || tier}
                      </span>
                    );
                  })()}
                </div>
              </div>

              <div className="mn-dd-items">
                {ACCOUNT_MENU_ITEMS.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="mn-dd-item"
                    role="menuitem"
                    onClick={() => { setOpen(false); onNavigate?.(); }}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mn-dd-divider" />
              <button type="button" className="mn-dd-signout" onClick={handleLogout} role="menuitem">
                <span>⎋</span> Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}