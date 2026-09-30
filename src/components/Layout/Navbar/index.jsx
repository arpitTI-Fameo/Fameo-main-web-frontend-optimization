"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import AppLogo from '@/components/Common/AppLogo';
import { cn } from '@/utils/cn';
import UserMenu from './UserMenu';
import MobileDrawer from './MobileDrawer';
import CartButton from './CartButton';
import DesktopNavLinks from './DesktopNavLinks';
import { FOCUS_RING, PILL, PILL_CLEAR, PILL_SOLID } from './classes';

const S = `
  @keyframes mnUnderline { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  @keyframes mnDrop { from { opacity:0; transform:translateY(-8px) scale(.98);} to { opacity:1; transform:translateY(0) scale(1);} }
  @keyframes mnFadeIn { from{opacity:0;} to{opacity:1;} }
  /* the notch drops from above the viewport, then stretches and fades as the
     three capsules pull out of it — and the exact reverse on the way back */
  @keyframes mnNotchOpen {
    0%   { opacity:1; width:44px;  transform:translate(-50%,-84px); }
    28%  { opacity:1; width:64px;  transform:translate(-50%,0); }
    55%  { opacity:1; width:180px; transform:translate(-50%,0); }
    100% { opacity:0; width:360px; transform:translate(-50%,0); }
  }
  @keyframes mnNotchClose {
    0%, 30% { opacity:0; width:140px; transform:translate(-50%,0); }
    50%  { opacity:1; width:110px; transform:translate(-50%,0); }
    70%  { opacity:1; width:64px;  transform:translate(-50%,0); }
    100% { opacity:1; width:44px;  transform:translate(-50%,-84px); }
  }
  @keyframes mnBump {
    0%   { transform: scale(1);   }
    35%  { transform: scale(1.5); }
    100% { transform: scale(1);   }
  }
`;

const DARK_HERO_ROUTES = [ROUTES.HOME];

const VDIV = 'h-[22px] w-px shrink-0 min-[901px]:hidden max-[480px]:hidden';

// Shown: each cluster springs out from the top-center notch to its place.
// Hidden: pinched back to the center line (--fx, measured below) and gone.
// Before the first measure there is no transition, so nothing slides on load.
// Class strings stay literal so Tailwind can see them.
const clusterMotion = (ready, shown) => cn(
  'motion-reduce:transition-none',
  ready ? '[transition-property:translate,scale,opacity]' : 'transition-none',
  shown
    ? 'pointer-events-auto [translate:0_0] scale-100 opacity-100 [transition-duration:.7s,.7s,.35s] [transition-delay:.18s] [transition-timing-function:cubic-bezier(.34,1.25,.64,1),cubic-bezier(.34,1.25,.64,1),ease-out]'
    : 'pointer-events-none [translate:var(--fx,0px)_0] scale-x-[35%] scale-y-[70%] opacity-0 [transition-duration:.42s,.42s,.22s] [transition-delay:0s,0s,.2s] [transition-timing-function:cubic-bezier(.55,0,.7,.2),cubic-bezier(.55,0,.7,.2),ease-in]'
);

// ─── Component ────────────────────────────────────────────────────────────────
// Navbar pinches into a top-center notch when scrolling down and springs back
// out when scrolling up (and on first load). At rest it is bare text over the
// hero; past 24px each cluster (logo, links, account) becomes its own floating
// dark-glass capsule.
export default function MainNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const isLightPage = !DARK_HERO_ROUTES.includes(pathname);

  // Refs for scroll direction detection
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Refs for the notch animation
  const rowRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef(null);
  const rightRef = useRef(null);
  const [ready, setReady] = useState(false);

  // ── Measure how far each cluster sits from the center line ────────────────
  useLayoutEffect(() => {
    const row = rowRef.current;
    const clusters = [logoRef.current, linksRef.current, rightRef.current];

    const measure = () => {
      const mid = row.clientWidth / 2;
      clusters.forEach((el) => {
        el.style.setProperty('--fx', `${mid - (el.offsetLeft + el.offsetWidth / 2)}px`);
      });
    };

    measure();
    void row.offsetWidth; // commit the pinched pose before the first spring
    const raf = requestAnimationFrame(() => setReady(true));

    const ro = new ResizeObserver(measure);
    [row, ...clusters].forEach((el) => ro.observe(el));

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

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

  // ── Keep the bar visible while the drawer is open ─────────────
  useEffect(() => {
    if (mobileOpen) setIsVisible(true);
  }, [mobileOpen]);

  // Scrolled: dark capsules with white text on any page. At rest, light pages
  // switch the text to ink.
  const solid = scrolled;
  const ink = isLightPage && !solid;
  const shown = ready && isVisible;

  return (
    <>
      <style>{S}</style>

      <div
        className={cn(
          'pointer-events-none fixed inset-x-0 top-0 z-[999] [--ease:cubic-bezier(.22,1,.36,1)]'
        )}
        role="banner"
      >
        {/* 1fr | auto | 1fr keeps the links on the true center line */}
        <div
          ref={rowRef}
          className={cn(
            'relative mx-auto grid max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center pt-5 pr-[max(40px,env(safe-area-inset-right))] pl-[max(40px,env(safe-area-inset-left))]',
            '[transition:translate_.5s_var(--ease)] motion-reduce:transition-none',
            'max-[1100px]:px-5 max-[480px]:px-3 max-[480px]:pt-3',
            solid && '-translate-y-1'
          )}
        >
          {/* ── Notch ───────────────────────────────────────────── */}
          {/* Keyed on direction so each change replays its keyframes. Not
              rendered before the first measure, so a load only plays "open". */}
          {ready && (
            <span
              key={shown ? 'open' : 'close'}
              className={cn(
                'absolute top-5 left-1/2 -z-10 h-12 rounded-full border max-[480px]:top-3 motion-reduce:hidden',
                PILL_SOLID,
                shown
                  ? 'animate-[mnNotchOpen_.75s_var(--ease)_both]'
                  : 'animate-[mnNotchClose_.6s_var(--ease)_both]'
              )}
              aria-hidden="true"
            />
          )}

          {/* ── Logo ────────────────────────────────────────────── */}
          {/* Rests 14px left so the bare logo lines up with the gutter, then
              slides into its capsule as the capsule fills in. */}
          <div ref={logoRef} className={cn('col-start-1 justify-self-start', clusterMotion(ready, shown))}>
            <Link
              href={ROUTES.HOME}
              className={cn(
                PILL,
                'flex h-12 shrink-0 items-center pr-[21px] pl-[11px] no-underline',
                FOCUS_RING,
                solid ? PILL_SOLID : cn(PILL_CLEAR, '-translate-x-3.5')
              )}
              aria-label="Fameo home"
            >
              <AppLogo mark alt="" className="block size-7 shrink-0 object-contain" />
              <span
                className={cn(
                  'ml-[11px] font-sans text-[10px] leading-[20px] font-semibold tracking-[.06em] [transition:color_.45s_var(--ease)]',
                  ink ? 'text-[#16130F]' : 'text-white'
                )}
              >
                FAMEO
              </span>
              <span
                className={cn(
                  'mr-[14px] ml-[15px] h-[18px] w-px shrink-0 [transition:background-color_.45s_var(--ease)] max-[900px]:hidden',
                  ink ? 'bg-[rgba(20,15,10,0.15)]' : 'bg-white/25'
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  'font-mono text-[10px] leading-none font-light tracking-[.3em] whitespace-nowrap uppercase [transition:color_.45s_var(--ease)] max-[900px]:hidden',
                  ink ? 'text-[#8B8781]' : 'text-white/72'
                )}
              >
                Creator Network
              </span>
            </Link>
          </div>

          {/* ── Center links ────────────────────────────────────── */}
          <div ref={linksRef} className={cn('col-start-2', clusterMotion(ready, shown))}>
            <DesktopNavLinks ink={ink} solid={solid} />
          </div>

          {/* ── Right cluster ───────────────────────────────────── */}
          <div
            ref={rightRef}
            className={cn(
              'col-start-3 flex shrink-0 items-center gap-3 justify-self-end max-[480px]:gap-2',
              clusterMotion(ready, shown)
            )}
          >
            {pathname.startsWith(ROUTES.PRODUCTS) && (
              <span className={cn(PILL, 'flex size-12 items-center justify-center', solid ? PILL_SOLID : PILL_CLEAR)}>
                <CartButton ink={ink} />
              </span>
            )}
            {!solid && <div className={cn(VDIV, ink ? 'bg-[rgba(20,15,10,0.12)]' : 'bg-white/20')} aria-hidden="true" />}

            {/* skeleton → Login/Register → avatar + name pill, all inside */}
            <UserMenu ink={ink} solid={solid} />

            {!solid && <div className={cn(VDIV, ink ? 'bg-[rgba(20,15,10,0.12)]' : 'bg-white/20')} aria-hidden="true" />}

            {/* Hamburger — mobile only, but ALWAYS mounted. Below 900px the
                center links are gone, so it is the only route to the pages. */}
            <button
              type="button"
              className={cn(
                'hidden size-[38px] shrink-0 cursor-pointer items-center justify-center rounded-[4px] border-[1.5px] bg-transparent max-[900px]:flex max-[480px]:size-10',
                '[transition:border-color_.25s,background-color_.25s,color_.25s,scale_.12s_var(--ease)] active:scale-92 motion-reduce:transition-none',
                FOCUS_RING,
                solid
                  ? cn(PILL_SOLID, 'text-white hover:border-white/60')
                  : ink
                    ? 'border-[rgba(20,15,10,0.12)] text-[#16130F] hover:border-[#16130F] hover:bg-[rgba(20,15,10,0.05)]'
                    : 'border-white/32 text-white/90 hover:border-white/85 hover:bg-white/10 hover:text-white'
              )}
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

      {/* ── Mobile Drawer ────────────────────────────────────────── */}
      <MobileDrawer mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
    </>
  );
}