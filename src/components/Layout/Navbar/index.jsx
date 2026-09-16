"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useAuthHydrated } from '@/lib/hooks/custome/useAuthHydrated';
import { clearProfilePhoto } from '@/lib/hooks/custome/useProfilePhoto';
import { MAIN_NAV_LINKS, ACCOUNT_MENU_ITEMS } from '@/constants/megaMenu';
import { ROUTES } from '@/constants/routes';
import AppLogo from '@/components/Common/AppLogo';
import UserMenu from './UserMenu';
import { S } from './style';

/* Routes that render a dark hero behind the transparent bar.
   Everything else starts in "light" mode so text stays legible. */
const DARK_HERO_ROUTES = ['/'];

const initialsOf = (name = '') => {
  const p = name.trim().split(/\s+/).filter(Boolean);
  return p.length ? (p[0][0] + (p[1]?.[0] || '')).toUpperCase() : 'F';
};

// ─── Component ────────────────────────────────────────────────────────────────
// Navbar automatically hides when scrolling down, reappears when scrolling up.
// It remains transparent over hero sections until the user scrolls past 24px.
export default function MainNav() {
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const hydrated = useAuthHydrated();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const isLightPage = !DARK_HERO_ROUTES.includes(pathname);

  // Refs for scroll direction detection
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // ── Scroll handler: hides on scroll down, shows on scroll up ──────────────
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }

      if (currentScrollY < 10) {
        setIsVisible(true);
      }

      setScrolled(currentScrollY > 24);

      lastScrollY.current = currentScrollY;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(handleScroll);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll(); // run once on mount

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Close the drawer on route change ─────────────────────────
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

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
  }, [mobileOpen]);

  // ── Keep the bar visible while the drawer is open ─────────────
  useEffect(() => {
    if (mobileOpen) setIsVisible(true);
  }, [mobileOpen]);

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    clearProfilePhoto();
    router.push(ROUTES.HOME);
    router.refresh(); // invalidate Router Cache so middleware re-runs and protected routes lock again
  };

  const barClass = [
    'mn-bar',
    scrolled ? 'solid' : '',
    !scrolled && isLightPage ? 'light' : '',
  ].filter(Boolean).join(' ');

  return (
    <>
      <style>{S}</style>

      <div className={`mn-wrap ${!isVisible ? 'hide' : ''}`} role="banner">
        <div className={barClass}>
          <div className="mn-topbar" aria-hidden="true" />
          <div className="mn-bottomline" aria-hidden="true" />

          {/* ── Logo ────────────────────────────────────────────── */}
          <Link href={ROUTES.HOME} className="mn-logo" aria-label="Fameo home">
            <AppLogo className="mn-logo-img" darkClassName="mn-logo-dark" />
            <span className="mn-logo-rule" aria-hidden="true" />
            <span className="mn-logo-sub">Creator Network</span>
          </Link>

          {/* ── Center links ────────────────────────────────────── */}
          <nav className="mn-links" aria-label="Main navigation">
            {MAIN_NAV_LINKS.map(({ href, label }, i) => (
              <React.Fragment key={href}>
                {i > 0 && <div className="mn-dot" aria-hidden="true" />}
                <Link
                  href={href}
                  prefetch={href === '/' ? undefined : false}
                  className={`mn-link${pathname === href ||
                    (pathname.startsWith(href + '/') && href !== '/')
                    ? ' active' : ''
                    }`}
                  aria-current={pathname === href ? 'page' : undefined}
                >
                  {label}
                </Link>
              </React.Fragment>
            ))}
          </nav>

          {/* ── Right cluster ───────────────────────────────────── */}
          <div className="mn-right">
            <div className="mn-vdiv" aria-hidden="true" />

            {/* skeleton → Login/Register → avatar + name pill, all inside */}
            <UserMenu />

            <div className="mn-vdiv" aria-hidden="true" />

            <button
              type="button"
              className="mn-hbg"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
              aria-controls="mn-drawer"
            >
              <Menu size={15} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Backdrop ──────────────────────────────────────────────── */}
      <div
        className={`mn-backdrop${mobileOpen ? ' open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Drawer ────────────────────────────────────────────────── */}
      <div
        id="mn-drawer"
        className={`mn-drawer${mobileOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        inert={!mobileOpen}
      >
        <div className="mn-dr-head">
          <Link href={ROUTES.HOME} onClick={() => setMobileOpen(false)} aria-label="Fameo home">
            <AppLogo className="mn-dr-logo-img" darkClassName="mn-dr-logo-dark" />
          </Link>
          <button
            type="button"
            className="mn-dr-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>

        <div className="mn-dr-links">
          {MAIN_NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              prefetch={href === '/' ? undefined : false}
              className={`mn-dr-link${pathname === href ? ' active' : ''}`}
              onClick={() => setMobileOpen(false)}
              aria-current={pathname === href ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}

          <div className="mn-dr-divider" />

          {/* nothing auth-related renders until the store has rehydrated,
              so the drawer never flashes "Login" at a signed-in user */}
          {hydrated && (user ? (
            ACCOUNT_MENU_ITEMS.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="mn-dr-link"
                onClick={() => setMobileOpen(false)}
              >
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                {item.label}
              </Link>
            ))
          ) : (
            <>
              <Link href={ROUTES.LOGIN} className="mn-dr-link" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link href={ROUTES.REGISTER} className="mn-dr-link" onClick={() => setMobileOpen(false)}>Join Fameo</Link>
            </>
          ))}
        </div>

        {hydrated && user && (
          <div className="mn-dr-foot">
            <div className="mn-dr-foot-id">
              <span className="mn-dr-foot-av" aria-hidden="true">{initialsOf(user.name)}</span>
              <div style={{ minWidth: 0 }}>
                <div className="mn-dr-foot-name">{user.name}</div>
                <div className="mn-dr-foot-email">{user.email}</div>
              </div>
            </div>
            <button type="button" className="mn-dr-signout" onClick={handleLogout}>Sign out</button>
          </div>
        )}
      </div>
    </>
  );
}