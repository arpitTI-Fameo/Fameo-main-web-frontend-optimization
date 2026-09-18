'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useAuthCta } from '@/lib/hooks/custome/useAuthCta';
import { CSS } from './styles';

/* ═══════════════════════════════════════════════════════════════════════════
   FAMEO SCROLL HERO — Telescope-style scroll-driven intro
   ─────────────────────────────────────────────────────────────────────────
   Sequence (scrubbed by scroll across a 500vh pinned section):
 
   Phase 0  (rest)        Scattered images float around the centered headline
                          "Real recommendations / by real people".
   Phase 1  (0 → .18)     Scattered images fly radially outward, headline
                          line 1 fades up, a small inline image seeds itself
                          between "by real" and "people".
   Phase 2  (.18 → .52)   The inline image expands to fullscreen, pushing
                          the two words apart and off-screen.
   Phase 3  (.52 → .74)   Caption "Featuring curators from around the world"
                          fades in over the fullscreen image, then out.
   Phase 4  (.74 → 1)     Curator UI: name + angled annotation lines (left),
                          bio (top-right), category list (right), cycling
                          thumbnail strip (bottom-right), pagination dots,
                          rose prev/next button.
 
   Fixed chrome the whole time: bottom pill navbar, CURRENTLY IN BETA,
   SCROLL + chevron button.
 
   Usage:  render <FameoScrollHero /> as the FIRST child of your homepage,
   then your existing sections continue after it (they'll appear once the
   500vh scroll region is consumed).
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Scattered hero images (positions mirror the reference layout) ────────
   x / y  : rest position, % of viewport
   w      : width px  (h optional)
   dx / dy: exit direction multipliers (radially outward)                  */
const SCATTER = [
  { src: 'https://res.cloudinary.com/dsvqdtg2t/image/upload/v1783112756/zarah-back_dszkkw.webp', x: -1.5, y: 21, w: 130, h: 220, dx: -1.4, dy: -0.2 },
  { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80', x: 7.5, y: 44, w: 100, h: 92, dx: -1.6, dy: 0.1 },
  { src: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=400&q=80', x: 29, y: 15, w: 180, h: 132, dx: -0.6, dy: -1.3 },
  { src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80', x: 36, y: 2.5, w: 220, h: 210, dx: 0.1, dy: -1.6 },
  { src: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80', x: 62.5, y: 10.5, w: 150, h: 168, dx: 0.8, dy: -1.3 },
  { src: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&q=80', x: 89.5, y: 4.5, w: 125, h: 85, dx: 1.5, dy: -0.9 },
  { src: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80', x: 80, y: 28, w: 265, h: 285, dx: 1.6, dy: 0 },
  { src: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=300&q=80', x: 96.5, y: 59, w: 90, h: 100, dx: 1.7, dy: 0.3 },
  { src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80', x: 70, y: 72, w: 300, h: 235, dx: 1.1, dy: 1.2 },
  { src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80', x: 29, y: 65.5, w: 118, h: 105, dx: -0.4, dy: 1.5 },
  { src: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&q=80', x: 16, y: 66.5, w: 210, h: 195, dx: -1.2, dy: 1.1 },
  { src: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=300&q=80', x: 54, y: 87, w: 165, h: 130, dx: 0.2, dy: 1.7 },
];

/* ── Curators (curator UI state — dots / arrow cycle these) ─────────────── */
const CURATORS = [
  {
    name: 'Zarah Khan',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=2000&q=85',
    bio: 'Culinary innovator, former executive chef at London Plane, Botanica and Rustic Canyon, student of Ayurvedic healthcare, and chef to everyone\u2019s favorite Hawaiian-born American.',
    categories: ['Food', 'Health', 'Music'],
    thumbs: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80',
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&q=80',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&q=80',
      'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=300&q=80',
      'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=300&q=80',
    ],
  },
  {
    name: 'Maya Chen',
    image: 'https://images.unsplash.com/photo-1771837602968-625b78cfb48d?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    bio: 'Fashion editor turned independent stylist. A decade dressing runway shows in Paris and Milan, now curating slow-fashion labels and the vintage archives no one else can find.',
    categories: ['Fashion', 'Design', 'Travel'],
    thumbs: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&q=80',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&q=80',
      'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=300&q=80',
    ],
  },
  {
    name: 'Andr\u00e9 Okafor',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=2000&q=85',
    bio: 'Record collector, radio host and founder of a Lagos listening bar. Twenty years digging through crates on four continents \u2014 he only recommends what he actually plays.',
    categories: ['Music', 'Culture', 'Nightlife'],
    thumbs: [
      'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=300&q=80',
      'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80',
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&q=80',
    ],
  },
  {
    name: 'Sofia Lindqvist',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=2000&q=85',
    bio: 'Interior architect and ceramicist based in Copenhagen. Believes a home should be collected, not decorated \u2014 her studio tours have a two-year waiting list.',
    categories: ['Interiors', 'Craft', 'Books'],
    thumbs: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300&q=80',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&q=80',
      'https://images.unsplash.com/photo-1554080353-a576cf803bda?w=300&q=80',
      'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=300&q=80',
    ],
  },
];

/* ── helpers ─────────────────────────────────────────────────────────────── */
const clamp01 = v => Math.min(1, Math.max(0, v));
const lerp = (a, b, t) => a + (b - a) * t;
/* ease used on the expansion so it feels weighted, like the reference */
const easeInOut = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
/* sub-progress inside [a,b] of the master progress */
const seg = (p, a, b) => clamp01((p - a) / (b - a));

/* ── CSS ─────────────────────────────────────────────────────────────────── */
export default function FameoScrollHero() {
  const runwayRef = useRef(null);
  const [p, setP] = useState(0);            // master scroll progress 0..1
  const [vw, setVw] = useState(1440);
  const [vh, setVh] = useState(800);
  const [cur, setCur] = useState(0);        // active curator index
  const [thumbTick, setThumbTick] = useState(0); // auto-cycling thumbs

  /* who is signed in, and what the pill's button should say to them */
  const auth = useAuthCta();

  /* natural width/height ratio of each curator photo, measured on first load
     and cached. Used to size the seed so nothing is ever cropped. */
  const [imgAspect, setImgAspect] = useState({});
  const noteAspect = useCallback((i, el) => {
    if (!el?.naturalWidth) return;
    const a = el.naturalWidth / el.naturalHeight;
    setImgAspect(prev => (prev[i] ? prev : { ...prev, [i]: a }));
  }, []);

  /* viewport size */
  useEffect(() => {
    const size = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
    size();
    window.addEventListener('resize', size);
    return () => window.removeEventListener('resize', size);
  }, []);

  /* scroll progress across the runway — direct rAF-throttled scrub,
     identical to the ZoomDiscover section (tracks the wheel 1:1) */
  const raf = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const el = runwayRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        setP(clamp01(-rect.top / Math.max(1, total)));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  /* auto-cycle thumbnails while curator UI is visible */
  useEffect(() => {
    const t = setInterval(() => setThumbTick(k => k + 1), 2200);
    return () => clearInterval(t);
  }, []);

  /* ── phase sub-progress ─────────────────────────────────────── */
  const p1 = seg(p, 0.00, 0.18);                 // scatter out + seed grow
  const p2raw = seg(p, 0.18, 0.52);              // seed → fullscreen (raw)
  const p2 = easeInOut(p2raw);                   // eased leader progress
  const capIn = seg(p, 0.52, 0.58);             // caption fade in
  const capOut = seg(p, 0.66, 0.74);             // caption fade out
  const p4 = seg(p, 0.76, 0.90);                 // curator UI in
  const dark = p2 > 0.55;                        // flip fixed labels

  /* seed geometry — identical to the ZoomDiscover section: the seed sits
     inline between the words at its full seed size and only expands */
  //
  // The seed used to be a fixed 200x80 slot, which meant a portrait photo was
  // cropped to a 2.5:1 letterbox strip inline — the heaviest crop anywhere in
  // the sequence. Instead the photo's own aspect is fitted INSIDE that same
  // 200x80 budget, so the seed is never larger than before, never crops, and
  // the line layout is unchanged.
  const seedMaxW = Math.min(200, vw * 0.14);
  const seedMaxH = Math.min(80, vh * 0.11);
  const aspect = imgAspect[cur] || seedMaxW / seedMaxH;   // w/h, 1.5 until measured
  const seedW = aspect > seedMaxW / seedMaxH ? seedMaxW : seedMaxH * aspect;
  const seedH = aspect > seedMaxW / seedMaxH ? seedMaxW / aspect : seedMaxH;

  const gw = lerp(seedW, vw, p2);
  const gh = lerp(seedH, vh, p2);
  /* words pushed fully off-screen by end of expansion */
  const wordShift = p2 * vw * 0.55;

  /* ── echo / fan-out — temporal trail ──────────────────────────
     Echo sizes are NOT derived from scroll position (that leaves
     frozen bands if you stop mid-scroll). Instead, each copy eases
     toward the copy in front of it over TIME, with the first copy
     chasing the leader. While the leader is growing/shrinking the
     chain lags behind → visible concertina bands; the moment
     scrolling pauses, the chain catches up and the bands dissolve
     on their own, like the reference footage. */
  const ECHOES = 7;
  const leadRef = useRef({ w: 0, h: 0 });
  leadRef.current = { w: gw, h: gh };
  const echoSizes = useRef(null);
  if (echoSizes.current === null) {
    echoSizes.current = Array.from({ length: ECHOES }, () => ({ w: gw, h: gh }));
  }
  const [, setEchoTick] = useState(0);

  useEffect(() => {
    let rafId;
    const step = () => {
      let prev = leadRef.current;
      let maxDiff = 0;
      echoSizes.current = echoSizes.current.map((s, i) => {
        const k = 0.26 - i * 0.022;          // deeper copies lag more
        const nw = s.w + (prev.w - s.w) * k;
        const nh = s.h + (prev.h - s.h) * k;
        maxDiff = Math.max(maxDiff, Math.abs(prev.w - nw), Math.abs(prev.h - nh));
        prev = { w: nw, h: nh };
        return prev;
      });
      /* re-render only while the chain is actually moving */
      if (maxDiff > 0.05) setEchoTick(t => t + 1);
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const caption = clamp01(capIn) * (1 - clamp01(capOut));
  const curator = CURATORS[cur];

  const goTo = useCallback(i => setCur((i + CURATORS.length) % CURATORS.length), []);

  const scrollNudge = () => window.scrollBy({ top: vh * 0.9, behavior: 'smooth' });

  return (
    <div className="tsc-wrap">
      <style>{CSS}</style>

      {/* ── 500vh scroll runway with pinned stage ─────────────── */}
      <div className="tsc-runway" ref={runwayRef}>
        <div className={`tsc-stage${dark ? ' dark' : ''}`}>

          {/* scattered floating images */}
          {SCATTER.map((s, i) => {
            const tx = s.dx * p1 * vw * 0.9;
            const ty = s.dy * p1 * vh * 1.1;
            return (
              <div
                key={i}
                className="tsc-scatter-img"
                style={{
                  left: `${s.x}%`, top: `${s.y}%`,
                  width: s.w, height: s.h,
                  transform: `translate3d(${tx}px, ${ty}px, 0)`,
                  opacity: 1 - p1 * 0.25,
                }}
              >
                <div className="tsc-float" style={{ animationDelay: `${(i % 5) * -1.2}s` }}>
                  <img src={s.src} alt="" loading="eager" draggable={false} />
                </div>
              </div>
            );
          })}

          {/* headline */}
          <div className="tsc-headline">
            <div
              className="tsc-line"
              style={{
                opacity: 1 - p1 * 1.6,
                transform: `translateY(${-p1 * 60}px)`,
              }}
            >
              Real recommendations
            </div>

            <div className="tsc-line tsc-line2">
              <span className="tsc-word" style={{ transform: `translateX(${-wordShift}px)` }}>
                by real
              </span>

              {/* the seed → fullscreen image (with echo fan-out) */}
              <div className="tsc-grow" style={{ width: gw, height: gh }}>
                {/* leader (largest, back layer) — crossfades between curators */}
                {CURATORS.map((c, i) => (
                  <img
                    key={`bg-${i}`}
                    className="tsc-grow-bg"
                    src={c.image}
                    alt=""
                    aria-hidden="true"
                    style={{ opacity: i === cur ? 1 : 0 }}
                    draggable={false}
                  />
                ))}
                {CURATORS.map((c, i) => (
                  <img
                    key={i}
                    className="tsc-grow-fg"
                    src={c.image}
                    alt={c.name}
                    style={{ opacity: i === cur ? 1 : 0 }}
                    onLoad={e => noteAspect(i, e.currentTarget)}
                    draggable={false}
                  />
                ))}

                {/* temporal echo chain — each copy trails the one in front;
                    all converge onto the leader when scrolling pauses */}
                {echoSizes.current.map((s, i) => (
                  <div
                    key={i}
                    className="tsc-echo"
                    style={{ width: s.w, height: s.h }}
                  >
                    <img src={CURATORS[cur].image} alt="" draggable={false} />
                  </div>
                ))}

                <div className="tsc-grow-shade" style={{ opacity: p2 }} />
              </div>

              <span className="tsc-word" style={{ transform: `translateX(${wordShift}px)` }}>
                people
              </span>
            </div>
          </div>

          {/* fullscreen caption */}
          <div className="tsc-caption" style={{ opacity: caption, transform: `translateY(${(1 - caption) * 14}px)` }}>
            Featuring curators from around the world
          </div>

          {/* curator UI */}
          <div className={`tsc-curator${p4 <= 0.02 ? ' off' : ''}`} style={{ opacity: p4 }}>
            {/* annotation lines: name → face */}
            <svg className="tsc-cur-lines" viewBox={`0 0 ${vw} ${vh}`} preserveAspectRatio="none">
              <line
                x1={vw * 0.245} y1={vh * 0.485}
                x2={vw * 0.40} y2={vh * 0.21}
                style={{ strokeDasharray: 800, strokeDashoffset: 800 * (1 - p4) }}
              />
              <line
                x1={vw * 0.245} y1={vh * 0.515}
                x2={vw * 0.42} y2={vh * 0.83}
                style={{ strokeDasharray: 800, strokeDashoffset: 800 * (1 - p4) }}
              />
            </svg>

            <div className="tsc-cur-name">{curator.name}</div>

            <div className="tsc-cur-bio">{curator.bio}</div>

            <div className="tsc-cur-cats">
              {curator.categories.map(c => <div key={c}>{c}</div>)}
            </div>

            {/* pagination dots */}
            <div className="tsc-cur-dots">
              {CURATORS.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Curator ${i + 1}`}
                  className={`tsc-cur-dot${i === cur ? ' on' : ''}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>

            {/* prev button */}
            <button className="tsc-cur-btn" aria-label="Previous curator" onClick={() => goTo(cur - 1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>

            {/* auto-cycling thumbnail strip */}
            <div className="tsc-cur-thumbs">
              {[0, 1, 2, 3].map(slot => {
                const imgs = curator.thumbs;
                const idx = (thumbTick + slot) % imgs.length;
                const nxt = (thumbTick + slot + 1) % imgs.length;
                return (
                  <div key={slot} className="tsc-cur-thumb" onClick={() => goTo(cur + 1)}>
                    <img src={imgs[nxt]} alt="" draggable={false} />
                    <img key={`${slot}-${idx}`} src={imgs[idx]} alt="" draggable={false} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── fixed chrome ──────────────────────────────────────── */}
      <div className="tsc-fixed">
        {/* <span className="tsc-beta">CURRENTLY IN BETA</span> */}

        <nav className="tsc-navbar">
          <Link href="/" className="tsc-navbar-brand">Fameo</Link>

          {!auth.hydrated ? (
            /* store not read yet — reserve the space instead of flashing
               LOGIN / SIGN UP at someone who is already signed in */
            <span className="tsc-navbar-skel" aria-hidden="true" />
          ) : auth.isLoggedIn ? (
            <>
              <Link href={auth.profileHref} className="tsc-navbar-me">
                <span className="tsc-navbar-av">
                  {auth.photo
                    ? <img src={auth.photo} alt="" />
                    : auth.initials}
                </span>
                <span className="tsc-navbar-name">{auth.firstName}</span>
              </Link>
              <Link href={auth.cta.href} className="tsc-navbar-signup">
                {auth.cta.label}
              </Link>
            </>
          ) : (
            <>
              <Link href={auth.loginHref} className="tsc-navbar-login">LOGIN</Link>
              <Link href={auth.cta.href} className="tsc-navbar-signup">{auth.cta.label}</Link>
            </>
          )}
        </nav>

        <div className="tsc-scroll-cue">
          <span>SCROLL</span>
          <button className="tsc-scroll-btn" aria-label="Scroll down" onClick={scrollNudge}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
