// 'use client';

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import Link from 'next/link';

// import useAuthCta from '@/hooks/useAuthCta';   // no braces

// /* ═══════════════════════════════════════════════════════════════════════════
//    FAMEO SCROLL HERO — Telescope-style scroll-driven intro
//    ─────────────────────────────────────────────────────────────────────────
//    Sequence (scrubbed by scroll across a 500vh pinned section):

//    Phase 0  (rest)        Scattered images float around the centered headline
//                           "Real recommendations / by real people".
//    Phase 1  (0 → .18)     Scattered images fly radially outward, headline
//                           line 1 fades up, a small inline image seeds itself
//                           between "by real" and "people".
//    Phase 2  (.18 → .52)   The inline image expands to fullscreen, pushing
//                           the two words apart and off-screen.
//    Phase 3  (.52 → .74)   Caption "Featuring curators from around the world"
//                           fades in over the fullscreen image, then out.
//    Phase 4  (.74 → 1)     Curator UI: name + angled annotation lines (left),
//                           bio (top-right), category list (right), cycling
//                           thumbnail strip (bottom-right), pagination dots,
//                           rose prev/next button.

//    Fixed chrome the whole time: bottom pill navbar, CURRENTLY IN BETA,
//    SCROLL + chevron button.

//    Usage:  render <FameoScrollHero /> as the FIRST child of your homepage,
//    then your existing sections continue after it (they'll appear once the
//    500vh scroll region is consumed).
//    ═══════════════════════════════════════════════════════════════════════ */

// /* ── Scattered hero images (positions mirror the reference layout) ────────
//    x / y  : rest position, % of viewport
//    w      : width px  (h optional)
//    dx / dy: exit direction multipliers (radially outward)                  */
// const SCATTER = [
//   { src: 'https://res.cloudinary.com/dsvqdtg2t/image/upload/v1783112756/zarah-back_dszkkw.webp', x: -1.5, y: 21, w: 130, h: 220, dx: -1.4, dy: -0.2 },
//   { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80', x: 7.5, y: 44, w: 100, h: 92,  dx: -1.6, dy:  0.1 },
//   { src: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=400&q=80', x: 29,  y: 15, w: 180, h: 132, dx: -0.6, dy: -1.3 },
//   { src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80', x: 36,  y: 2.5,w: 220, h: 210, dx:  0.1, dy: -1.6 },
//   { src: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80',   x: 62.5,y: 10.5,w: 150, h: 168, dx:  0.8, dy: -1.3 },
//   { src: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&q=80', x: 89.5,y: 4.5, w: 125, h: 85,  dx:  1.5, dy: -0.9 },
//   { src: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80', x: 80,  y: 28,  w: 265, h: 285, dx:  1.6, dy:  0   },
//   { src: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=300&q=80', x: 96.5,y: 59,  w: 90,  h: 100, dx:  1.7, dy:  0.3 },
//   { src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',   x: 70,  y: 72,  w: 300, h: 235, dx:  1.1, dy:  1.2 },
//   { src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80', x: 29,  y: 65.5,w: 118, h: 105, dx: -0.4, dy:  1.5 },
//   { src: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&q=80', x: 16,  y: 66.5,w: 210, h: 195, dx: -1.2, dy:  1.1 },
//   { src: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=300&q=80', x: 54,  y: 87,  w: 165, h: 130, dx:  0.2, dy:  1.7 },
// ];

// /* ── Curators (curator UI state — dots / arrow cycle these) ─────────────── */
// const CURATORS = [
//   {
//     name: 'Zarah Khan',
//     image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
//     bio: 'Culinary innovator, former executive chef at London Plane, Botanica and Rustic Canyon, student of Ayurvedic healthcare, and chef to everyone\u2019s favorite Hawaiian-born American.',
//     categories: ['Food', 'Health', 'Music'],
//     thumbs: [
//       'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80',
//       'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&q=80',
//       'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80',
//       'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&q=80',
//       'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=300&q=80',
//       'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=300&q=80',
//     ],
//   },
//   {
//     name: 'Maya Chen',
//     image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=2000&q=85',
//     bio: 'Fashion editor turned independent stylist. A decade dressing runway shows in Paris and Milan, now curating slow-fashion labels and the vintage archives no one else can find.',
//     categories: ['Fashion', 'Design', 'Travel'],
//     thumbs: [
//       'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80',
//       'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80',
//       'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80',
//       'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&q=80',
//       'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&q=80',
//       'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=300&q=80',
//     ],
//   },
//   {
//     name: 'Andr\u00e9 Okafor',
//     image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=2000&q=85',
//     bio: 'Record collector, radio host and founder of a Lagos listening bar. Twenty years digging through crates on four continents \u2014 he only recommends what he actually plays.',
//     categories: ['Music', 'Culture', 'Nightlife'],
//     thumbs: [
//       'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=300&q=80',
//       'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&q=80',
//       'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80',
//       'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80',
//       'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80',
//       'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&q=80',
//     ],
//   },
//   {
//     name: 'Sofia Lindqvist',
//     image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=2000&q=85',
//     bio: 'Interior architect and ceramicist based in Copenhagen. Believes a home should be collected, not decorated \u2014 her studio tours have a two-year waiting list.',
//     categories: ['Interiors', 'Craft', 'Books'],
//     thumbs: [
//       'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300&q=80',
//       'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300&q=80',
//       'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=300&q=80',
//       'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&q=80',
//       'https://images.unsplash.com/photo-1554080353-a576cf803bda?w=300&q=80',
//       'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=300&q=80',
//     ],
//   },
// ];

// /* ── helpers ─────────────────────────────────────────────────────────────── */
// const clamp01 = v => Math.min(1, Math.max(0, v));
// const lerp = (a, b, t) => a + (b - a) * t;
// /* ease used on the expansion so it feels weighted, like the reference */
// const easeInOut = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
// /* sub-progress inside [a,b] of the master progress */
// const seg = (p, a, b) => clamp01((p - a) / (b - a));

// /* ── CSS ─────────────────────────────────────────────────────────────────── */
// const CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Fraunces:opsz,wght@9..144,300;9..144,400&display=swap');

// .tsc-wrap *, .tsc-wrap *::before, .tsc-wrap *::after { box-sizing: border-box; margin: 0; padding: 0; }
// .tsc-wrap {
//   /* brand rose tokens (matches the navbar + scroll sections palette) */
//   --mn-rose:   #C24E74;
//   --mn-rose-l: #D96A8E;
//   --mn-rose-d: #9E3357;
//   --mn-rose-grad: linear-gradient(135deg, var(--mn-rose-l) 30%, var(--mn-rose) 50%, var(--mn-rose-d) 76%);
// }

// /* ── scroll runway + pinned stage ─────────────────────────────── */
// .tsc-runway { position: relative; height: 500vh; background: #F2EFE9; }
// .tsc-stage  {
//   position: sticky; top: 0; height: 100vh; width: 100%;
//   overflow: hidden; background: #F2EFE9;
// }
// /* Small-viewport unit: stays put while the mobile address bar shows/hides,
//    so the pinned stage no longer drifts against the scroll progress.
//    Browsers without svh support keep the 100vh above. Desktop is identical. */
// @supports (height: 100svh){
//   .tsc-stage { height: 100svh; }
// }

// /* ── scattered images ─────────────────────────────────────────── */
// .tsc-scatter-img {
//   position: absolute; overflow: hidden;
//   will-change: transform, opacity;
// }
// .tsc-scatter-img img {
//   width: 100%; height: 100%; object-fit: cover; display: block;
// }
// /* gentle idle float (only at rest — killed once scroll starts via JS opacity) */
// @keyframes tscFloat {
//   0%, 100% { translate: 0 0; }
//   50%       { translate: 0 -8px; }
// }
// .tsc-scatter-img .tsc-float { animation: tscFloat 6s ease-in-out infinite; width:100%; height:100%; }

// /* ── headline ─────────────────────────────────────────────────── */
// .tsc-headline {
//   position: absolute; inset: 0; z-index: 5;
//   display: flex; flex-direction: column;
//   align-items: center; justify-content: center;
//   pointer-events: none;
// }
// .tsc-line {
//   font-family: 'Schibsted Grotesk', sans-serif;
//   font-weight: 500;
//   font-size: clamp(42px, 5.6vw, 92px);
//   letter-spacing: -0.025em;
//   line-height: 1.12;
//   color: #1A1A1A;
//   white-space: nowrap;
//   will-change: transform, opacity;
// }
// .tsc-line2 {
//   display: flex; align-items: center; justify-content: center;
//   width: 100vw;
// }
// .tsc-line2 .tsc-word { will-change: transform; }

// /* the seed that grows into the fullscreen image */
// .tsc-grow {
//   position: relative; overflow: hidden; flex-shrink: 0;
//   will-change: width, height;
//   margin: 0 0.18em;
// }
// .tsc-grow img {
//   position: absolute; inset: 0;
//   width: 100%; height: 100%; object-fit: cover; display: block;
//   transition: opacity .6s ease;
// }
// .tsc-grow-shade {
//   position: absolute; inset: 0; pointer-events: none;
//   background:
//     linear-gradient(to top, rgba(10,8,6,.55) 0%, transparent 40%),
//     linear-gradient(to bottom, rgba(10,8,6,.35) 0%, transparent 30%),
//     radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(10,8,6,.35) 100%);
//   will-change: opacity;
//   z-index: 3;
// }

// /* trailing echo copies — each is a smaller, centered crop of the same
//    image; the subject stays centered so the back layers' edges show as
//    repeated bands during motion */
// .tsc-echo {
//   position: absolute; left: 50%; top: 50%;
//   transform: translate(-50%, -50%);
//   overflow: hidden;
//   will-change: width, height;
//   z-index: 2;
// }
// .tsc-echo img {
//   position: absolute; inset: 0;
//   width: 100%; height: 100%; object-fit: cover; display: block;
// }

// /* ── fullscreen caption ───────────────────────────────────────── */
// .tsc-caption {
//   position: absolute; inset: 0; z-index: 8;
//   display: flex; align-items: center; justify-content: center;
//   pointer-events: none;
//   font-family: 'Schibsted Grotesk', sans-serif;
//   font-weight: 400;
//   font-size: clamp(26px, 3.4vw, 52px);
//   letter-spacing: -0.015em;
//   color: #fff; text-align: center; padding: 0 24px;
//   will-change: opacity, transform;
// }

// /* ── curator UI layer ─────────────────────────────────────────── */
// .tsc-curator { position: absolute; inset: 0; z-index: 9; will-change: opacity; }
// .tsc-curator.off { pointer-events: none; }

// .tsc-cur-name {
//   position: absolute; left: 16.5%; top: 50%; transform: translateY(-50%);
//   font-family: 'Schibsted Grotesk', sans-serif;
//   font-weight: 400; font-size: clamp(15px, 1.15vw, 20px);
//   letter-spacing: .01em; color: rgba(255,255,255,.92);
// }
// .tsc-cur-lines { position: absolute; inset: 0; pointer-events: none; }
// .tsc-cur-lines line {
//   stroke: rgba(255,255,255,.85); stroke-width: 1;
//   vector-effect: non-scaling-stroke;
// }

// .tsc-cur-bio {
//   position: absolute; top: 24px; right: 32px;
//   width: min(250px, 26vw);
//   font-family: 'Schibsted Grotesk', sans-serif;
//   font-weight: 400; font-size: 13.5px; line-height: 1.45;
//   color: rgba(255,255,255,.95);
// }
// .tsc-cur-cats {
//   position: absolute; right: 15%; top: 43%;
//   font-family: 'Fraunces', serif;
//   font-weight: 300; font-size: clamp(22px, 1.9vw, 30px);
//   line-height: 1.28; color: rgba(255,255,255,.96);
//   letter-spacing: .01em;
// }

// /* pagination dots */
// .tsc-cur-dots {
//   position: absolute; left: 14px; top: 42%;
//   display: flex; flex-direction: column; gap: 14px;
// }
// .tsc-cur-dot {
//   width: 7px; height: 7px; border-radius: 50%;
//   background: rgba(255,255,255,.35);
//   border: none; cursor: pointer; padding: 0;
//   transition: background .25s, transform .25s;
// }
// .tsc-cur-dot.on { background: #fff; transform: scale(1.25); }

// /* prev / next rose button */
// .tsc-cur-btn {
//   position: absolute; left: 46.5%; top: 47.5%;
//   width: 46px; height: 46px; border-radius: 50%;
//   background: linear-gradient(135deg, var(--mn-rose-l) 30%, var(--mn-rose) 50%, var(--mn-rose-d) 76%);
//   border: none; cursor: pointer;
//   display: flex; align-items: center; justify-content: center;
//   color: #fff; font-size: 18px;
//   transition: transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s;
//   box-shadow: 0 6px 24px rgba(0,0,0,.28);
// }
// .tsc-cur-btn:hover { transform: scale(1.1); }

// /* thumbnail strip */
// .tsc-cur-thumbs {
//   position: absolute; right: 10px; bottom: 10px;
//   display: flex; gap: 4px;
// }
// .tsc-cur-thumb {
//   width: 56px; height: 104px; overflow: hidden; position: relative;
//   cursor: pointer;
// }
// .tsc-cur-thumb img {
//   position: absolute; inset: 0; width: 100%; height: 100%;
//   object-fit: cover; display: block;
//   transition: opacity .7s ease;
// }

// /* ── fixed chrome ─────────────────────────────────────────────── */
// .tsc-navbar {
//   position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%);
//   z-index: 60; display: flex; align-items: stretch;
//   background: #fff; height: 56px;
//   box-shadow: 0 8px 32px rgba(20,15,10,.10);
// }
// .tsc-navbar-brand {
//   display: flex; align-items: center; padding: 0 26px 0 24px;
//   font-family: 'Schibsted Grotesk', sans-serif;
//   font-weight: 700; font-size: 24px; letter-spacing: -0.03em;
//   color: #1A1A1A; text-decoration: none;
// }
// .tsc-navbar-login {
//   display: flex; align-items: center; padding: 0 22px;
//   font-family: 'Space Mono', monospace; font-size: 12px;
//   letter-spacing: .08em; color: var(--mn-rose); text-decoration: none;
//   transition: opacity .2s;
// }
// .tsc-navbar-login:hover { opacity: .65; }
// .tsc-navbar-signup {
//   display: flex; align-items: center; align-self: center;
//   margin-right: 8px; padding: 0 26px; height: 44px; border-radius: 3px;
//   font-family: 'Space Mono', monospace; font-size: 12px;
//   letter-spacing: .08em; color: #fff; text-decoration: none;
//   background: linear-gradient(135deg, var(--mn-rose-l) 30%, var(--mn-rose) 50%, var(--mn-rose-d) 76%);
//   transition: filter .2s;
// }
// .tsc-navbar-signup:hover { filter: brightness(1.08); }

// /* ── signed-in pill: identity chip replaces LOGIN, the button keeps the
//       SIGN UP slot but carries the next real step for this account ── */
// .tsc-navbar-me {
//   display: flex; align-items: center; gap: 10px; padding: 0 20px;
//   color: #1A1A1A; text-decoration: none; transition: opacity .2s;
// }
// .tsc-navbar-me:hover { opacity: .65; }
// .tsc-navbar-av {
//   width: 30px; height: 30px; border-radius: 50%; flex: none; overflow: hidden;
//   display: flex; align-items: center; justify-content: center;
//   background: linear-gradient(135deg, var(--mn-rose-l) 30%, var(--mn-rose) 52%, var(--mn-rose-d) 100%);
//   color: #fff; font-family: 'Schibsted Grotesk', sans-serif;
//   font-size: 12px; font-weight: 700; letter-spacing: .01em;
// }
// .tsc-navbar-av img { width: 100%; height: 100%; object-fit: cover; display: block; }
// .tsc-navbar-name {
//   font-family: 'Schibsted Grotesk', sans-serif;
//   font-size: 14px; font-weight: 600; letter-spacing: -0.01em;
//   max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
// }
// /* holds the pill's width steady while the persisted store is read, so it
//    doesn't visibly resize a beat after load */
// .tsc-navbar-skel { width: 168px; }

// .tsc-beta {
//   position: fixed; left: 32px; bottom: 30px; z-index: 60;
//   font-family: 'Space Mono', monospace; font-size: 11px;
//   letter-spacing: .12em; color: #fff;
//   mix-blend-mode: difference;
// }
// .tsc-scroll-cue {
//   position: fixed; right: 32px; bottom: 22px; z-index: 60;
//   display: flex; align-items: center; gap: 18px;
// }
// .tsc-scroll-cue span {
//   font-family: 'Space Mono', monospace; font-size: 11px;
//   letter-spacing: .12em; color: #fff;
//   mix-blend-mode: difference;
// }
// .tsc-scroll-btn {
//   width: 52px; height: 52px; border-radius: 50%;
//   background: #fff; border: none; cursor: pointer;
//   display: flex; align-items: center; justify-content: center;
//   box-shadow: 0 8px 32px rgba(20,15,10,.10);
//   transition: transform .25s;
// }
// .tsc-scroll-btn:hover { transform: translateY(2px); }
// @keyframes tscNudge { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(3px);} }
// .tsc-scroll-btn svg { animation: tscNudge 1.8s ease-in-out infinite; }

// /* on dark (fullscreen) phase, flip fixed labels to light */
// .tsc-stage.dark ~ .tsc-fixed .tsc-beta,
// .tsc-fixed.dark .tsc-beta,
// .tsc-fixed.dark .tsc-scroll-cue span { color: rgba(255,255,255,.85); }

// /* ── responsive ───────────────────────────────────────────────── */
// @media (max-width: 860px) {
//   .tsc-cur-name  { left: 8%; }
//   .tsc-cur-cats  { right: 8%; }
//   .tsc-cur-bio   { right: 16px; width: 200px; font-size: 12px; }
//   .tsc-cur-btn   { left: auto; right: 18%; }
//   .tsc-navbar-brand { font-size: 20px; padding: 0 18px; }
//   .tsc-navbar-me   { padding: 0 14px; gap: 8px; }
//   .tsc-navbar-name { max-width: 84px; font-size: 13px; }
//   .tsc-navbar-av   { width: 26px; height: 26px; font-size: 11px; }
//   .tsc-navbar-skel { width: 130px; }
// }
// @media (prefers-reduced-motion: reduce) {
//   .tsc-scatter-img .tsc-float, .tsc-scroll-btn svg { animation: none; }
// }
// `;

// /* ═══════════════════════════════════════════════════════════════════════ */
// export default function FameoScrollHero() {
//   const runwayRef = useRef(null);
//   const [p, setP] = useState(0);            // master scroll progress 0..1
//   const [vw, setVw] = useState(1440);
//   const [vh, setVh] = useState(800);
//   const [cur, setCur] = useState(0);        // active curator index
//   const [thumbTick, setThumbTick] = useState(0); // auto-cycling thumbs

//   /* who is signed in, and what the pill's button should say to them */
//   const auth = useAuthCta();

//   /* viewport size */
//   useEffect(() => {
//     const size = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
//     size();
//     window.addEventListener('resize', size);
//     return () => window.removeEventListener('resize', size);
//   }, []);

//   /* scroll progress across the runway — direct rAF-throttled scrub,
//      identical to the ZoomDiscover section (tracks the wheel 1:1) */
//   const raf = useRef(0);
//   useEffect(() => {
//     const onScroll = () => {
//       cancelAnimationFrame(raf.current);
//       raf.current = requestAnimationFrame(() => {
//         const el = runwayRef.current;
//         if (!el) return;
//         const rect = el.getBoundingClientRect();
//         const total = el.offsetHeight - window.innerHeight;
//         setP(clamp01(-rect.top / Math.max(1, total)));
//       });
//     };
//     onScroll();
//     window.addEventListener('scroll', onScroll, { passive: true });
//     window.addEventListener('resize', onScroll);
//     return () => {
//       window.removeEventListener('scroll', onScroll);
//       window.removeEventListener('resize', onScroll);
//       cancelAnimationFrame(raf.current);
//     };
//   }, []);

//   /* auto-cycle thumbnails while curator UI is visible */
//   useEffect(() => {
//     const t = setInterval(() => setThumbTick(k => k + 1), 2200);
//     return () => clearInterval(t);
//   }, []);

//   /* ── phase sub-progress ─────────────────────────────────────── */
//   const p1 = seg(p, 0.00, 0.18);                 // scatter out + seed grow
//   const p2raw = seg(p, 0.18, 0.52);              // seed → fullscreen (raw)
//   const p2 = easeInOut(p2raw);                   // eased leader progress
//   const capIn  = seg(p, 0.52, 0.58);             // caption fade in
//   const capOut = seg(p, 0.66, 0.74);             // caption fade out
//   const p4 = seg(p, 0.76, 0.90);                 // curator UI in
//   const dark = p2 > 0.55;                        // flip fixed labels

//   /* seed geometry — identical to the ZoomDiscover section: the seed sits
//      inline between the words at its full seed size and only expands */
//   const seedW = Math.min(200, vw * 0.14);
//   const seedH = Math.min(80,  vh * 0.11);
//   const gw = lerp(seedW, vw, p2);
//   const gh = lerp(seedH, vh, p2);
//   /* words pushed fully off-screen by end of expansion */
//   const wordShift = p2 * vw * 0.55;

//   /* ── echo / fan-out — temporal trail ──────────────────────────
//      Echo sizes are NOT derived from scroll position (that leaves
//      frozen bands if you stop mid-scroll). Instead, each copy eases
//      toward the copy in front of it over TIME, with the first copy
//      chasing the leader. While the leader is growing/shrinking the
//      chain lags behind → visible concertina bands; the moment
//      scrolling pauses, the chain catches up and the bands dissolve
//      on their own, like the reference footage. */
//   const ECHOES = 7;
//   const leadRef = useRef({ w: 0, h: 0 });
//   leadRef.current = { w: gw, h: gh };
//   const echoSizes = useRef(null);
//   if (echoSizes.current === null) {
//     echoSizes.current = Array.from({ length: ECHOES }, () => ({ w: gw, h: gh }));
//   }
//   const [, setEchoTick] = useState(0);

//   useEffect(() => {
//     let rafId;
//     const step = () => {
//       let prev = leadRef.current;
//       let maxDiff = 0;
//       echoSizes.current = echoSizes.current.map((s, i) => {
//         const k = 0.26 - i * 0.022;          // deeper copies lag more
//         const nw = s.w + (prev.w - s.w) * k;
//         const nh = s.h + (prev.h - s.h) * k;
//         maxDiff = Math.max(maxDiff, Math.abs(prev.w - nw), Math.abs(prev.h - nh));
//         prev = { w: nw, h: nh };
//         return prev;
//       });
//       /* re-render only while the chain is actually moving */
//       if (maxDiff > 0.05) setEchoTick(t => t + 1);
//       rafId = requestAnimationFrame(step);
//     };
//     rafId = requestAnimationFrame(step);
//     return () => cancelAnimationFrame(rafId);
//   }, []);

//   const caption = clamp01(capIn) * (1 - clamp01(capOut));
//   const curator = CURATORS[cur];

//   const goTo = useCallback(i => setCur((i + CURATORS.length) % CURATORS.length), []);

//   const scrollNudge = () => window.scrollBy({ top: vh * 0.9, behavior: 'smooth' });

//   return (
//     <div className="tsc-wrap">
//       <style>{CSS}</style>

//       {/* ── 500vh scroll runway with pinned stage ─────────────── */}
//       <div className="tsc-runway" ref={runwayRef}>
//         <div className={`tsc-stage${dark ? ' dark' : ''}`}>

//           {/* scattered floating images */}
//           {SCATTER.map((s, i) => {
//             const tx = s.dx * p1 * vw * 0.9;
//             const ty = s.dy * p1 * vh * 1.1;
//             return (
//               <div
//                 key={i}
//                 className="tsc-scatter-img"
//                 style={{
//                   left: `${s.x}%`, top: `${s.y}%`,
//                   width: s.w, height: s.h,
//                   transform: `translate3d(${tx}px, ${ty}px, 0)`,
//                   opacity: 1 - p1 * 0.25,
//                 }}
//               >
//                 <div className="tsc-float" style={{ animationDelay: `${(i % 5) * -1.2}s` }}>
//                   <img src={s.src} alt="" loading="eager" draggable={false} />
//                 </div>
//               </div>
//             );
//           })}

//           {/* headline */}
//           <div className="tsc-headline">
//             <div
//               className="tsc-line"
//               style={{
//                 opacity: 1 - p1 * 1.6,
//                 transform: `translateY(${-p1 * 60}px)`,
//               }}
//             >
//               Real recommendations
//             </div>

//             <div className="tsc-line tsc-line2">
//               <span className="tsc-word" style={{ transform: `translateX(${-wordShift}px)` }}>
//                 by real
//               </span>

//               {/* the seed → fullscreen image (with echo fan-out) */}
//               <div className="tsc-grow" style={{ width: gw, height: gh }}>
//                 {/* leader (largest, back layer) — crossfades between curators */}
//                 {CURATORS.map((c, i) => (
//                   <img key={i} src={c.image} alt={c.name} style={{ opacity: i === cur ? 1 : 0 }} draggable={false} />
//                 ))}

//                 {/* temporal echo chain — each copy trails the one in front;
//                     all converge onto the leader when scrolling pauses */}
//                 {echoSizes.current.map((s, i) => (
//                   <div
//                     key={i}
//                     className="tsc-echo"
//                     style={{ width: s.w, height: s.h }}
//                   >
//                     <img src={CURATORS[cur].image} alt="" draggable={false} />
//                   </div>
//                 ))}

//                 <div className="tsc-grow-shade" style={{ opacity: p2 }} />
//               </div>

//               <span className="tsc-word" style={{ transform: `translateX(${wordShift}px)` }}>
//                 people
//               </span>
//             </div>
//           </div>

//           {/* fullscreen caption */}
//           <div className="tsc-caption" style={{ opacity: caption, transform: `translateY(${(1 - caption) * 14}px)` }}>
//             Featuring curators from around the world
//           </div>

//           {/* curator UI */}
//           <div className={`tsc-curator${p4 <= 0.02 ? ' off' : ''}`} style={{ opacity: p4 }}>
//             {/* annotation lines: name → face */}
//             <svg className="tsc-cur-lines" viewBox={`0 0 ${vw} ${vh}`} preserveAspectRatio="none">
//               <line
//                 x1={vw * 0.245} y1={vh * 0.485}
//                 x2={vw * 0.40}  y2={vh * 0.21}
//                 style={{ strokeDasharray: 800, strokeDashoffset: 800 * (1 - p4) }}
//               />
//               <line
//                 x1={vw * 0.245} y1={vh * 0.515}
//                 x2={vw * 0.42}  y2={vh * 0.83}
//                 style={{ strokeDasharray: 800, strokeDashoffset: 800 * (1 - p4) }}
//               />
//             </svg>

//             <div className="tsc-cur-name">{curator.name}</div>

//             <div className="tsc-cur-bio">{curator.bio}</div>

//             <div className="tsc-cur-cats">
//               {curator.categories.map(c => <div key={c}>{c}</div>)}
//             </div>

//             {/* pagination dots */}
//             <div className="tsc-cur-dots">
//               {CURATORS.map((_, i) => (
//                 <button
//                   key={i}
//                   aria-label={`Curator ${i + 1}`}
//                   className={`tsc-cur-dot${i === cur ? ' on' : ''}`}
//                   onClick={() => goTo(i)}
//                 />
//               ))}
//             </div>

//             {/* prev button */}
//             <button className="tsc-cur-btn" aria-label="Previous curator" onClick={() => goTo(cur - 1)}>
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
//                 <path d="M15 5l-7 7 7 7" />
//               </svg>
//             </button>

//             {/* auto-cycling thumbnail strip */}
//             <div className="tsc-cur-thumbs">
//               {[0, 1, 2, 3].map(slot => {
//                 const imgs = curator.thumbs;
//                 const idx = (thumbTick + slot) % imgs.length;
//                 const nxt = (thumbTick + slot + 1) % imgs.length;
//                 return (
//                   <div key={slot} className="tsc-cur-thumb" onClick={() => goTo(cur + 1)}>
//                     <img src={imgs[nxt]} alt="" draggable={false} />
//                     <img key={`${slot}-${idx}`} src={imgs[idx]} alt="" draggable={false} />
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── fixed chrome ──────────────────────────────────────── */}
//       <div className="tsc-fixed">
//         <span className="tsc-beta">CURRENTLY IN BETA</span>

//         <nav className="tsc-navbar">
//           <Link href="/" className="tsc-navbar-brand">Fameo</Link>

//           {!auth.hydrated ? (
//             /* store not read yet — reserve the space instead of flashing
//                LOGIN / SIGN UP at someone who is already signed in */
//             <span className="tsc-navbar-skel" aria-hidden="true" />
//           ) : auth.isLoggedIn ? (
//             <>
//               <Link href={auth.profileHref} className="tsc-navbar-me">
//                 <span className="tsc-navbar-av">
//                   {auth.photo
//                     ? <img src={auth.photo} alt="" />
//                     : auth.initials}
//                 </span>
//                 <span className="tsc-navbar-name">{auth.firstName}</span>
//               </Link>
//               <Link href={auth.cta.href} className="tsc-navbar-signup">
//                 {auth.cta.label}
//               </Link>
//             </>
//           ) : (
//             <>
//               <Link href={auth.loginHref} className="tsc-navbar-login">LOGIN</Link>
//               <Link href={auth.cta.href} className="tsc-navbar-signup">{auth.cta.label}</Link>
//             </>
//           )}
//         </nav>

//         <div className="tsc-scroll-cue">
//           <span>SCROLL</span>
//           <button className="tsc-scroll-btn" aria-label="Scroll down" onClick={scrollNudge}>
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2">
//               <path d="M6 9l6 6 6-6" />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


 
'use client';
 
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useAuthCta } from '@/hooks/useAuthCta';
 
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
  { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80', x: 7.5, y: 44, w: 100, h: 92,  dx: -1.6, dy:  0.1 },
  { src: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=400&q=80', x: 29,  y: 15, w: 180, h: 132, dx: -0.6, dy: -1.3 },
  { src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80', x: 36,  y: 2.5,w: 220, h: 210, dx:  0.1, dy: -1.6 },
  { src: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80',   x: 62.5,y: 10.5,w: 150, h: 168, dx:  0.8, dy: -1.3 },
  { src: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&q=80', x: 89.5,y: 4.5, w: 125, h: 85,  dx:  1.5, dy: -0.9 },
  { src: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80', x: 80,  y: 28,  w: 265, h: 285, dx:  1.6, dy:  0   },
  { src: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=300&q=80', x: 96.5,y: 59,  w: 90,  h: 100, dx:  1.7, dy:  0.3 },
  { src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',   x: 70,  y: 72,  w: 300, h: 235, dx:  1.1, dy:  1.2 },
  { src: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80', x: 29,  y: 65.5,w: 118, h: 105, dx: -0.4, dy:  1.5 },
  { src: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&q=80', x: 16,  y: 66.5,w: 210, h: 195, dx: -1.2, dy:  1.1 },
  { src: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=300&q=80', x: 54,  y: 87,  w: 165, h: 130, dx:  0.2, dy:  1.7 },
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
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Fraunces:opsz,wght@9..144,300;9..144,400&display=swap');
 
.tsc-wrap *, .tsc-wrap *::before, .tsc-wrap *::after { box-sizing: border-box; margin: 0; padding: 0; }
.tsc-wrap {
  /* brand rose tokens (matches the navbar + scroll sections palette) */
  --mn-rose:   #C24E74;
  --mn-rose-l: #D96A8E;
  --mn-rose-d: #9E3357;
  --mn-rose-grad: linear-gradient(135deg, var(--mn-rose-l) 30%, var(--mn-rose) 50%, var(--mn-rose-d) 76%);
}
 
/* ── scroll runway + pinned stage ─────────────────────────────── */
.tsc-runway { position: relative; height: 500vh; background: #F2EFE9; }
.tsc-stage  {
  position: sticky; top: 0; height: 100vh; width: 100%;
  overflow: hidden; background: #F2EFE9;
}
/* Small-viewport unit: stays put while the mobile address bar shows/hides,
   so the pinned stage no longer drifts against the scroll progress.
   Browsers without svh support keep the 100vh above. Desktop is identical. */
@supports (height: 100svh){
  .tsc-stage { height: 100svh; }
}
 
/* ── scattered images ─────────────────────────────────────────── */
.tsc-scatter-img {
  position: absolute; overflow: hidden;
  will-change: transform, opacity;
}
.tsc-scatter-img img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}
/* gentle idle float (only at rest — killed once scroll starts via JS opacity) */
@keyframes tscFloat {
  0%, 100% { translate: 0 0; }
  50%       { translate: 0 -8px; }
}
.tsc-scatter-img .tsc-float { animation: tscFloat 6s ease-in-out infinite; width:100%; height:100%; }
 
/* ── headline ─────────────────────────────────────────────────── */
.tsc-headline {
  position: absolute; inset: 0; z-index: 5;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  pointer-events: none;
}
.tsc-line {
  font-family: 'Schibsted Grotesk', sans-serif;
  font-weight: 500;
  font-size: clamp(42px, 5.6vw, 92px);
  letter-spacing: -0.025em;
  line-height: 1.12;
  color: #1A1A1A;
  white-space: nowrap;
  will-change: transform, opacity;
}
.tsc-line2 {
  display: flex; align-items: center; justify-content: center;
  width: 100vw;
}
.tsc-line2 .tsc-word { will-change: transform; }
 
/* the seed that grows into the fullscreen image */
.tsc-grow {
  position: relative; overflow: hidden; flex-shrink: 0;
  will-change: width, height;
  margin: 0 0.18em;
  background: #0E0C0A;               /* shows for the instant before load */
}
.tsc-grow img {
  position: absolute; inset: 0;
  width: 100%; height: 100%; display: block;
  transition: opacity .6s ease;
}
/* The whole photo, never cropped. Contain on its own would letterbox, so a
   blurred, darkened copy fills the frame edge to edge behind it. The frame
   still reads full-bleed; the subject is never cut. */
.tsc-grow-fg { object-fit: contain; z-index: 1; }
.tsc-grow-bg {
  object-fit: cover; z-index: 0;
  filter: blur(26px) brightness(.5) saturate(1.15);
  transform: scale(1.12);            /* hides the blur's soft edge */
}
.tsc-grow-shade {
  position: absolute; inset: 0; pointer-events: none;
  background:
    linear-gradient(to top, rgba(10,8,6,.55) 0%, transparent 40%),
    linear-gradient(to bottom, rgba(10,8,6,.35) 0%, transparent 30%),
    radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(10,8,6,.35) 100%);
  will-change: opacity;
  z-index: 3;
}
 
/* trailing echo copies — each is a smaller, centered crop of the same
   image; the subject stays centered so the back layers' edges show as
   repeated bands during motion */
.tsc-echo {
  position: absolute; left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  will-change: width, height;
  z-index: 2;
}
.tsc-echo img {
  position: absolute; inset: 0;
  width: 100%; height: 100%; object-fit: contain; display: block;
}
 
/* ── fullscreen caption ───────────────────────────────────────── */
.tsc-caption {
  position: absolute; inset: 0; z-index: 8;
  display: flex; align-items: center; justify-content: center;
  pointer-events: none;
  font-family: 'Schibsted Grotesk', sans-serif;
  font-weight: 400;
  font-size: clamp(26px, 3.4vw, 52px);
  letter-spacing: -0.015em;
  color: #fff; text-align: center; padding: 0 24px;
  will-change: opacity, transform;
}
 
/* ── curator UI layer ─────────────────────────────────────────── */
.tsc-curator { position: absolute; inset: 0; z-index: 9; will-change: opacity; }
.tsc-curator.off { pointer-events: none; }
 
.tsc-cur-name {
  position: absolute; left: 16.5%; top: 50%; transform: translateY(-50%);
  font-family: 'Schibsted Grotesk', sans-serif;
  font-weight: 400; font-size: clamp(15px, 1.15vw, 20px);
  letter-spacing: .01em; color: rgba(255,255,255,.92);
}
.tsc-cur-lines { position: absolute; inset: 0; pointer-events: none; }
.tsc-cur-lines line {
  stroke: rgba(255,255,255,.85); stroke-width: 1;
  vector-effect: non-scaling-stroke;
}
 
.tsc-cur-bio {
  position: absolute; top: 24px; right: 32px;
  width: min(250px, 26vw);
  font-family: 'Schibsted Grotesk', sans-serif;
  font-weight: 400; font-size: 13.5px; line-height: 1.45;
  color: rgba(255,255,255,.95);
}
.tsc-cur-cats {
  position: absolute; right: 15%; top: 43%;
  font-family: 'Fraunces', serif;
  font-weight: 300; font-size: clamp(22px, 1.9vw, 30px);
  line-height: 1.28; color: rgba(255,255,255,.96);
  letter-spacing: .01em;
}
 
/* pagination dots */
.tsc-cur-dots {
  position: absolute; left: 14px; top: 42%;
  display: flex; flex-direction: column; gap: 14px;
}
.tsc-cur-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: rgba(255,255,255,.35);
  border: none; cursor: pointer; padding: 0;
  transition: background .25s, transform .25s;
}
.tsc-cur-dot.on { background: #fff; transform: scale(1.25); }
 
/* prev / next rose button */
.tsc-cur-btn {
  position: absolute; left: 46.5%; top: 47.5%;
  width: 46px; height: 46px; border-radius: 50%;
  background: linear-gradient(135deg, var(--mn-rose-l) 30%, var(--mn-rose) 50%, var(--mn-rose-d) 76%);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 18px;
  transition: transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s;
  box-shadow: 0 6px 24px rgba(0,0,0,.28);
}
.tsc-cur-btn:hover { transform: scale(1.1); }
 
/* thumbnail strip */
.tsc-cur-thumbs {
  position: absolute; right: 10px; bottom: 10px;
  display: flex; gap: 4px;
}
.tsc-cur-thumb {
  width: 56px; height: 104px; overflow: hidden; position: relative;
  cursor: pointer;
}
.tsc-cur-thumb img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; display: block;
  transition: opacity .7s ease;
}
 
/* ── fixed chrome ─────────────────────────────────────────────── */
.tsc-navbar {
  position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%);
  z-index: 60; display: flex; align-items: stretch;
  background: #fff; height: 56px;
  box-shadow: 0 8px 32px rgba(20,15,10,.10);
}
.tsc-navbar-brand {
  display: flex; align-items: center; padding: 0 26px 0 24px;
  font-family: 'Schibsted Grotesk', sans-serif;
  font-weight: 700; font-size: 24px; letter-spacing: -0.03em;
  color: #1A1A1A; text-decoration: none;
}
.tsc-navbar-login {
  display: flex; align-items: center; padding: 0 22px;
  font-family: 'Space Mono', monospace; font-size: 12px;
  letter-spacing: .08em; color: var(--mn-rose); text-decoration: none;
  transition: opacity .2s;
}
.tsc-navbar-login:hover { opacity: .65; }
.tsc-navbar-signup {
  display: flex; align-items: center; align-self: center;
  margin-right: 8px; padding: 0 26px; height: 44px; border-radius: 3px;
  font-family: 'Space Mono', monospace; font-size: 12px;
  letter-spacing: .08em; color: #fff; text-decoration: none;
  background: linear-gradient(135deg, var(--mn-rose-l) 30%, var(--mn-rose) 50%, var(--mn-rose-d) 76%);
  transition: filter .2s;
}
.tsc-navbar-signup:hover { filter: brightness(1.08); }
 
/* ── signed-in pill: identity chip replaces LOGIN, the button keeps the
      SIGN UP slot but carries the next real step for this account ── */
.tsc-navbar-me {
  display: flex; align-items: center; gap: 10px; padding: 0 20px;
  color: #1A1A1A; text-decoration: none; transition: opacity .2s;
}
.tsc-navbar-me:hover { opacity: .65; }
.tsc-navbar-av {
  width: 30px; height: 30px; border-radius: 50%; flex: none; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--mn-rose-l) 30%, var(--mn-rose) 52%, var(--mn-rose-d) 100%);
  color: #fff; font-family: 'Schibsted Grotesk', sans-serif;
  font-size: 12px; font-weight: 700; letter-spacing: .01em;
}
.tsc-navbar-av img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tsc-navbar-name {
  font-family: 'Schibsted Grotesk', sans-serif;
  font-size: 14px; font-weight: 600; letter-spacing: -0.01em;
  max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
/* holds the pill's width steady while the persisted store is read, so it
   doesn't visibly resize a beat after load */
.tsc-navbar-skel { width: 168px; }
 
.tsc-beta {
  position: fixed; left: 32px; bottom: 30px; z-index: 60;
  font-family: 'Space Mono', monospace; font-size: 11px;
  letter-spacing: .12em; color: #fff;
  mix-blend-mode: difference;
}
.tsc-scroll-cue {
  position: fixed; right: 32px; bottom: 22px; z-index: 60;
  display: flex; align-items: center; gap: 18px;
}
.tsc-scroll-cue span {
  font-family: 'Space Mono', monospace; font-size: 11px;
  letter-spacing: .12em; color: #fff;
  mix-blend-mode: difference;
}
.tsc-scroll-btn {
  width: 52px; height: 52px; border-radius: 50%;
  background: #fff; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 32px rgba(20,15,10,.10);
  transition: transform .25s;
}
.tsc-scroll-btn:hover { transform: translateY(2px); }
@keyframes tscNudge { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(3px);} }
.tsc-scroll-btn svg { animation: tscNudge 1.8s ease-in-out infinite; }
 
/* on dark (fullscreen) phase, flip fixed labels to light */
.tsc-stage.dark ~ .tsc-fixed .tsc-beta,
.tsc-fixed.dark .tsc-beta,
.tsc-fixed.dark .tsc-scroll-cue span { color: rgba(255,255,255,.85); }
 
/* ── responsive ───────────────────────────────────────────────── */
@media (max-width: 860px) {
  .tsc-cur-name  { left: 8%; }
  .tsc-cur-cats  { right: 8%; }
  .tsc-cur-bio   { right: 16px; width: 200px; font-size: 12px; }
  .tsc-cur-btn   { left: auto; right: 18%; }
  .tsc-navbar-brand { font-size: 20px; padding: 0 18px; }
  .tsc-navbar-me   { padding: 0 14px; gap: 8px; }
  .tsc-navbar-name { max-width: 84px; font-size: 13px; }
  .tsc-navbar-av   { width: 26px; height: 26px; font-size: 11px; }
  .tsc-navbar-skel { width: 130px; }
}
@media (prefers-reduced-motion: reduce) {
  .tsc-scatter-img .tsc-float, .tsc-scroll-btn svg { animation: none; }
}
`;
 
/* ═══════════════════════════════════════════════════════════════════════ */
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
  const capIn  = seg(p, 0.52, 0.58);             // caption fade in
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
  const seedMaxH = Math.min(80,  vh * 0.11);
  const aspect   = imgAspect[cur] || seedMaxW / seedMaxH;   // w/h, 1.5 until measured
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
                x2={vw * 0.40}  y2={vh * 0.21}
                style={{ strokeDasharray: 800, strokeDashoffset: 800 * (1 - p4) }}
              />
              <line
                x1={vw * 0.245} y1={vh * 0.515}
                x2={vw * 0.42}  y2={vh * 0.83}
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
        <span className="tsc-beta">CURRENTLY IN BETA</span>
 
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