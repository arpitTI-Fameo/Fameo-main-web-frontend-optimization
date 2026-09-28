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

  const auth = useAuthCta();

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
      <section className="tss-outro" ref={ref}>

        {/* top area: main navigation links from old footer */}
        <div className="tss-outro-grid">
          {COLS.map((col, i) => (
            <div key={i} className="tss-outro-col">
              <h4 className="tss-outro-col-head">{col.heading}</h4>
              <div className="tss-outro-col-links">
                {col.links.map((link) => (
                  <a key={link.label} href={link.href} className="tss-outro-col-link">
                    {link.label}
                    {link.badge && <span className={`tss-badge ${link.badgeClass}`}>{link.badge}</span>}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Curved separator 1 */}
        <Separator className="tss-outro-curve" />

        {/* giant wordmark — "Fame" + living O */}
        <div className="tss-outro-stage">
          <h2 className="tss-outro-word" ref={wordRef} aria-label="Fameo">
            Fame
            <span className="tss-outro-o" aria-hidden="true">
              {m.t === 'i' ? (
                <img key={mIdx} src={m.src} alt="" draggable={false} />
              ) : (
                <svg key={mIdx} viewBox={doodle.viewBox} preserveAspectRatio="xMidYMid meet">
                  {doodle.paths.map((d, pi) => (
                    <path key={pi} d={d} pathLength={1} style={{ animationDelay: `${pi * 0.2}s` }} />
                  ))}
                </svg>
              )}
            </span>
          </h2>
        </div>


        {/* bottom row: legal · socials */}
        <div className="tss-outro-bottom">
          <div className="tss-outro-legal">
            {LEGAL_LINKS.map(link => (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            ))}
          </div>
          <div className="tss-outro-social">
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
