'use client';

import { useEffect, useRef, useState } from 'react';
import useAuthCta from '@/hooks/useAuthCta';
import { TASTE_DOODLES, O_MEDIA } from '../constants';
import { clamp01, lerp } from '../utils';

export default function Outro() {
  const ref = useRef(null);
  const wordRef = useRef(null);
  const raf = useRef(0);
  const [mIdx, setMIdx] = useState(0);

  /* who is signed in, and what this panel's closing button should offer them */
  const auth = useAuthCta();

  /* cycle the O content every 2s */
  useEffect(() => {
    const t = setInterval(() => setMIdx(i => (i + 1) % O_MEDIA.length), 2000);
    return () => clearInterval(t);
  }, []);

  /* settle-in scale + hide the hero's fixed chrome while visible */
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
        /* 0 → panel entering, 1 → settled at top */
        const ent = clamp01((vh - r.top) / (vh * 0.92));
        const e = 1 - Math.pow(1 - ent, 3);            // ease-out settle
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
    <section className="tss-outro" ref={ref}>
      {/* top row: legal · socials · auth */}
      <div className="tss-outro-top">
        <div className="tss-outro-links">
          <a href="https://uat.fameo.info/terms-and-conditions.html" target="_blank" rel="noopener noreferrer">TERMS OF SERVICE</a>
          <a href="https://uat.fameo.info/privacy-policy.html" target="_blank" rel="noopener noreferrer">PRIVACY POLICY</a>
          <a href="https://uat.fameo.info/cookie-policy.html" target="_blank" rel="noopener noreferrer">COOKIE POLICY</a>
          <a href="/refund-policy">REFUND POLICY</a>
        </div>
        <div className="tss-outro-social">
          <a href="#" aria-label="Instagram">
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" /></svg>
          </a>
          <a href="#" aria-label="YouTube">
            <svg viewBox="0 0 24 24"><rect x="2.5" y="6" width="19" height="13" rx="3.5" /><path d="M10.2 9.6l4.8 2.9-4.8 2.9z" /></svg>
          </a>
          <a href="#" aria-label="X">
            <svg viewBox="0 0 24 24"><path d="M4 4l16 16M20 4L4 20" /></svg>
          </a>
        </div>
        <div className="tss-outro-right">
          {!auth.hydrated ? (
            /* hold the space rather than flash LOGIN / SIGN UP at a signed-in
               visitor while the persisted auth store is being read */
            <span className="tss-outro-skel" aria-hidden="true" />
          ) : auth.isLoggedIn ? (
            <>
              <a className="tss-outro-me" href={auth.profileHref}>
                <span className="tss-outro-av">
                  {auth.photo ? <img src={auth.photo} alt="" /> : auth.initials}
                </span>
                <span className="tss-outro-name">{auth.firstName}</span>
              </a>
              <a className="tss-outro-signup" href={auth.cta.href}>{auth.cta.label}</a>
            </>
          ) : (
            <>
              <a className="tss-outro-login" href={auth.loginHref}>LOGIN</a>
              <a className="tss-outro-signup" href={auth.cta.href}>{auth.cta.label}</a>
            </>
          )}
        </div>
      </div>

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
    </section>
  );
}

/* ════ export ════════════════════════════════════════════════════════════ */
