"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAuthHydrated } from '@/lib/hooks/custome/useAuthHydrated';
import { clearProfilePhoto } from '@/lib/hooks/custome/useProfilePhoto';
import { MAIN_NAV_LINKS, ACCOUNT_MENU_ITEMS } from '@/constants/megaMenu';
import { ROUTES } from '@/constants/routes';
import AppLogo from '@/components/Common/AppLogo';
import { cn } from '@/utils/cn';
import { MONO, GROTESK } from '../classes';

const drawerLink = (active) => cn(
  `flex items-center gap-3 border-l-2 px-6 py-3.5 ${MONO} text-[11px] font-normal tracking-[.12em] uppercase no-underline`,
  '[transition:color_.18s,border-color_.18s,background-color_.18s,padding-left_.2s_var(--ease)] hover:bg-[rgba(20,15,10,0.05)] hover:pl-7 hover:text-[#16130F]',
  active ? 'border-l-[#D45A79] bg-[rgba(20,15,10,0.05)] text-[#16130F]' : 'border-l-transparent text-[#8B8781]'
);

const initialsOf = (name = '') => {
  const p = name.trim().split(/\s+/).filter(Boolean);
  return p.length ? (p[0][0] + (p[1]?.[0] || '')).toUpperCase() : 'F';
};

export default function MobileDrawer({ mobileOpen, setMobileOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const hydrated = useAuthHydrated();

  // ── Close the drawer on route change ─────────────────────────
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  // ── Lock body scroll when mobile drawer is open ───────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // ── Escape closes the drawer ──────────────────────────────────
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen, setMobileOpen]);

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    clearProfilePhoto();
    router.push(ROUTES.HOME);
    router.refresh();
  };

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────────────── */}
      <div
        className={cn(
          'fixed inset-0 z-[1001] bg-[rgba(20,15,10,0.5)] backdrop-blur-[6px]',
          mobileOpen ? 'block animate-[mnFadeIn_.25s_ease]' : 'hidden'
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Drawer ────────────────────────────────────────────────── */}
      <div
        id="mn-drawer"
        className={cn(
          'fixed inset-y-0 right-0 z-[1002] flex w-[min(330px,88vw)] flex-col border-l border-[rgba(20,15,10,0.12)] bg-white shadow-[-24px_0_80px_rgba(20,15,10,0.16)] [--ease:cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none',
          mobileOpen
            ? 'visible translate-x-0 [transition:translate_.4s_var(--ease),visibility_0s]'
            : 'invisible translate-x-full [transition:translate_.4s_var(--ease),visibility_0s_.4s]'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        inert={mobileOpen ? undefined : true}
      >
        <div className="relative flex h-[62px] shrink-0 items-center justify-between border-b border-[rgba(20,15,10,0.12)] px-[22px] after:absolute after:inset-x-0 after:top-0 after:h-0.5 after:bg-[#D45A79] after:content-['']">
          <Link href={ROUTES.HOME} onClick={() => setMobileOpen(false)} aria-label="Fameo home">
            <AppLogo className="block h-[42px] w-auto object-contain" />
          </Link>
          <button
            type="button"
            className="flex size-10 cursor-pointer items-center justify-center rounded-[4px] border-[1.5px] border-[rgba(20,15,10,0.12)] bg-transparent text-[#3a352d] [transition:border-color_.2s,color_.2s,background-color_.2s] hover:border-[#16130F] hover:bg-[rgba(20,15,10,0.05)] hover:text-[#16130F]"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 [-webkit-overflow-scrolling:touch]">
          {MAIN_NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              prefetch={href === ROUTES.HOME ? undefined : false}
              className={drawerLink(pathname === href)}
              onClick={() => setMobileOpen(false)}
              aria-current={pathname === href ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}

          <div className="mx-6 my-2 h-px bg-[rgba(20,15,10,0.12)]" />

          {hydrated && (user ? (
            ACCOUNT_MENU_ITEMS.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={drawerLink(false)}
                onClick={() => setMobileOpen(false)}
              >
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                {item.label}
              </Link>
            ))
          ) : (
            <>
              <Link href={ROUTES.LOGIN} className={drawerLink(false)} onClick={() => setMobileOpen(false)}>Login</Link>
              <Link href={ROUTES.REGISTER} className={drawerLink(false)} onClick={() => setMobileOpen(false)}>Join Fameo</Link>
            </>
          ))}
        </div>

        {hydrated && user && (
          <div className="shrink-0 border-t border-[rgba(20,15,10,0.12)] bg-[#F7F5F0] px-6 pt-5 pb-[max(20px,env(safe-area-inset-bottom))]">
            <div className="mb-3.5 flex items-center gap-[11px]">
              <span
                className={`flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#FFC98F,#DD8164_52%,#D45A79)] ${GROTESK} text-[13px] font-bold text-white`}
                aria-hidden="true"
              >
                {initialsOf(user.name)}
              </span>
              <div style={{ minWidth: 0 }}>
                <div className={`${GROTESK} text-[13px] font-semibold text-[#16130F]`}>{user.name}</div>
                <div className={`max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap ${MONO} text-[11px] text-[#8B8781]`}>
                  {user.email}
                </div>
              </div>
            </div>
            <button
              type="button"
              className={`cursor-pointer border-none bg-transparent p-0 ${MONO} text-[10px] font-bold tracking-[.12em] text-[#c23a3a] uppercase`}
              onClick={handleLogout}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </>
  );
}
