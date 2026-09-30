'use client';

import { useEffect, useRef, useState } from 'react';
import useAuthCta from '@/lib/hooks/custome/useAuthCta';
import Separator from '@/components/ui/Separator';
import { TASTE_DOODLES, O_MEDIA } from '../../../modules/Main/Landing/FameoScrollSections/constants';
import { clamp01, lerp } from '../../../modules/Main/Landing/FameoScrollSections/utils';
import { S } from './styles';
import { ROUTES } from '@/constants/routes';

/* ── Link data imported from old MainFooter ── */
const COLS = [
  {
    heading: "Platform",
    links: [
      { label: "Home", href: ROUTES.HOME },
      { label: "Products", href: ROUTES.PRODUCTS },
      { label: "Resources", href: ROUTES.RESOURCES },
      { label: "Community", href: ROUTES.COMMUNITY },
      { label: "Talent Hire", href: ROUTES.TALENT_HIRE },
    ],
  },
  {
    heading: "Creators",
    links: [
      { label: "Creator Hub", href: ROUTES.RESOURCES, badge: "new", badgeClass: "ft-badge-new" },
      { label: "Learning Center", href: ROUTES.RESOURCES, badge: "new", badgeClass: "ft-badge-new" },
      { label: "Brand Deals", href: ROUTES.PRODUCTS },
      { label: "Fameo Community", href: ROUTES.COMMUNITY, badge: "beta", badgeClass: "ft-badge-beta" },
      { label: "Talent Network", href: ROUTES.TALENT_HIRE },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Contact Us", href: ROUTES.SUPPORT },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Login", href: ROUTES.LOGIN },
      { label: "Register", href: ROUTES.REGISTER },
      { label: "My Profile", href: ROUTES.ACCOUNT_PROFILE },
      { label: "My Orders", href: ROUTES.ORDERS },
      { label: "Settings", href: ROUTES.SETTINGS },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com", icon: "📸" },
  { label: "Twitter/X", href: "https://x.com", icon: "𝕏" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "in" },
  { label: "YouTube", href: "https://youtube.com", icon: "▶" },
];
const POLICY_BASE_URL = process.env.NEXT_PUBLIC_APP_ORIGIN || 'https://uat-api.fameo.info';

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: `${POLICY_BASE_URL}/privacy-policy.html` },
  { label: 'Terms of Service', href: `${POLICY_BASE_URL}/terms-and-conditions.html` },
  { label: 'Cookie Policy', href: `${POLICY_BASE_URL}/cookie-policy.html` },
  { label: 'Refund Policy', href: `${POLICY_BASE_URL}/refund-policy.html` },
];

export default function Footer() {
  const ref = useRef(null);
  const wordRef = useRef(null);
  const raf = useRef(0);
  const [mIdx, setMIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setMIdx(i => (i + 1) % O_MEDIA.length), 2000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const chrome = () => [
      document.querySelector('.tsc-navbar'),
      document.querySelector('.tsc-scroll-cue'),
    ];
    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const ent = clamp01((vh - r.top) / (vh * 0.92));
        const e = 1 - Math.pow(1 - ent, 3);
        if (wordRef.current) {
          wordRef.current.style.transform =
            `scale(${lerp(0.86, 1, e).toFixed(4)}) translateY(${((1 - e) * 44).toFixed(1)}px)`;
        }
        const hide = ent > 0.35;
        chrome().forEach(n => {
          if (!n) return;
          n.style.transition = 'opacity .3s';
          n.style.opacity = hide ? '0' : '1';
          n.style.pointerEvents = hide ? 'none' : 'auto';
        });
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf.current);
      chrome().forEach(n => {
        if (!n) return;
        n.style.opacity = '1';
        n.style.pointerEvents = 'auto';
      });
    };
  }, []);

  const m = O_MEDIA[mIdx];
  const doodle = m.t === 'd' ? TASTE_DOODLES[m.i] : null;

  return (
    <>
      <style>{S}</style>
      <section
        className="fameo-theme relative z-[3] flex min-h-[100vh] flex-col bg-background px-[18px] pt-5 pb-6 shadow-[0_-18px_50px_rgba(20,15,10,0.08)] supports-[min-height:100svh]:min-h-svh min-[901px]:px-[34px] min-[901px]:pt-[26px] min-[901px]:pb-[30px]"
        ref={ref}
      >

        {/* top area: main navigation links from old footer */}
        {/* Same 1200px column as the bottom row: the first column lines up with
            the legal links, the last one ends where the social icons end. */}
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-x-5 gap-y-8 pt-10 pb-5 min-[901px]:flex min-[901px]:justify-between min-[901px]:gap-10">
          {COLS.map((col, i) => (
            <div key={i} className="flex flex-col">
              <h4 className="mb-5 font-['Syne',sans-serif] text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
                {col.heading}
              </h4>
              <div className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="inline-flex items-center font-sans text-[13px] text-foreground transition-colors hover:text-muted-foreground"
                  >
                    {link.label}
                    {link.badge && (
                      <span
                        className={`ml-2 rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] ${link.badgeClass === 'ft-badge-new'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-brand-text/10 text-brand-text'
                          }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Curved separator 1 */}
        <Separator className="block flex-none pointer-events-none w-[calc(100%+36px)] -ml-[18px] h-[clamp(30px,6vw,60px)] min-[901px]:w-[calc(100%+68px)] min-[901px]:-ml-[34px]" />

        {/* giant wordmark — "Fame" + living O */}
        <div className="flex-1 grid place-items-center">
          <h2 className="flex items-center whitespace-nowrap font-bold leading-none tracking-[-0.045em] text-foreground will-change-transform text-[clamp(76px,15vw,260px)]" ref={wordRef} aria-label="Fameo">
            Fame
            <span className="relative inline-flex items-center justify-center rounded-full w-[0.64em] h-[0.64em] ml-[0.035em]" aria-hidden="true">
              {m.t === 'i' ? (
                <img key={mIdx} src={m.src} alt="" draggable={false} className="block w-full h-full rounded-full object-cover animate-[tssOPop_.55s_cubic-bezier(.3,1.45,.4,1)]" />
              ) : (
                <svg key={mIdx} viewBox={doodle.viewBox} preserveAspectRatio="xMidYMid meet" className="h-[116%] w-[116%] overflow-visible">
                  {doodle.paths.map((d, pi) => (
                    <path key={pi} d={d} pathLength={1} style={{ animationDelay: `${pi * 0.2}s` }} className="fill-none stroke-foreground stroke-[3px] [stroke-dasharray:1] [stroke-dashoffset:1] [stroke-linecap:round] [stroke-linejoin:round] [vector-effect:non-scaling-stroke] animate-[tssODraw_1.9s_cubic-bezier(.45,0,.2,1)_forwards]" />
                  ))}
                </svg>
              )}
            </span>
          </h2>
        </div>


        {/* bottom row: legal · socials */}
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-5 pt-5 min-[901px]:flex-row min-[901px]:items-center min-[901px]:justify-between">
          <div className="flex flex-wrap gap-4 min-[901px]:gap-6">
            {LEGAL_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Space_Mono',monospace] text-[11px] tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex gap-[22px] justify-start min-[901px]:gap-6">
            {SOCIALS.map(s => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-muted-foreground transition-colors hover:text-foreground text-lg"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
