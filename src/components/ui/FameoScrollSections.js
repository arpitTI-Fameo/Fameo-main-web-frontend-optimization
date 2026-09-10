'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import useAuthCta from '@/hooks/useAuthCta';   

/* ═══════════════════════════════════════════════════════════════════════════
   FAMEO SCROLL SECTIONS — continuation after <FameoScrollHero />
   ─────────────────────────────────────────────────────────────────────────
   Renders five sections replicating the reference sequence:

   A. IntroRail        Big left statement whose words light up one by one
                       as you scroll, sticky beside a rail of cards
                       (vertical on desktop, snapping carousel on mobile).
   B. CollectionPanel  White panel: "Collection" label, big title, meta
                       row, then a 4-column offset product grid with
                       + buttons and bookmark badges.
   C. KineticBands     Diagonal rose-gradient wedges sweep through while
                       giant words "Grow / your / reach" scatter and
                       converge, scroll-linked, with cycling doodles.
   D. ZoomDiscover     "Zoom in with ▢ Fameo" — seed image expands
                       fullscreen with the echo/fan-out effect, then
                       becomes the Discover collection browser. Mobile
                       gets its own geometry, spacing, and runway length.
   E. Outro            Giant FAMEO wordmark with a living "O".

   Usage:
     <FameoScrollHero />
     <FameoScrollSections />
   ═══════════════════════════════════════════════════════════════════════ */

/* ── helpers ────────────────────────────────────────────────────────────── */
const clamp01 = v => Math.min(1, Math.max(0, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const seg = (p, a, b) => clamp01((p - a) / (b - a));

/* scroll progress across a runway element (0 at pin start, 1 at pin end) —
   smoothed exactly like the hero: scroll events only set a TARGET, and a
   continuous rAF loop eases the displayed progress toward it (0.14/frame),
   so the zoom seed-grow + echoes, card flight, and word reveal glide
   between scroll ticks instead of stepping with them. */
function useRunwayProgress(ref) {
  const [p, setP] = useState(0);
  const targetP = useRef(0);
  const smoothP = useRef(0);
  const running = useRef(false);

  useEffect(() => {
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const EASE = rm ? 1 : 0.14;

    const step = () => {
      const diff = targetP.current - smoothP.current;
      if (Math.abs(diff) < 0.0004) {
        smoothP.current = targetP.current;
        setP(targetP.current);
        running.current = false;
        return;
      }
      smoothP.current += diff * EASE;
      setP(smoothP.current);
      requestAnimationFrame(step);
    };

    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      targetP.current = clamp01(-rect.top / Math.max(1, total));
      if (!running.current) { running.current = true; requestAnimationFrame(step); }
    };

    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      running.current = false;
    };
  }, [ref]);
  return p;
}

function useViewport() {
  const [v, setV] = useState({ vw: 1440, vh: 800 });
  useEffect(() => {
    const size = () => setV({ vw: window.innerWidth, vh: window.innerHeight });
    size();
    window.addEventListener('resize', size);
    return () => window.removeEventListener('resize', size);
  }, []);
  return v;
}

function useIsMobile(bp = 900) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = matchMedia(`(max-width: ${bp}px)`);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [bp]);
  return m;
}

/* ── data (content ported from fameo-landing_3__1_.html) ────────────────── */
/* the card that flies from the intro rail into the collection grid */
const SHARED_PRODUCT = { img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=700&q=80', title: 'Street Camera Kit', label: 'STEADYONE', saved: true };

const RAIL_CARDS = [
  { img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', title: 'Wedding Reel Preset Pack', label: 'ZOYA F.' },
  { img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&q=80', title: 'Rooftop Light Guide',      label: 'ARMAN S.' },
  { img: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&q=80', title: 'Regional Recipe Zine',     label: 'MEHER K.' },
  SHARED_PRODUCT,
];

const GRID_PRODUCTS = [
  SHARED_PRODUCT,
  { img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=700&q=80',   title: 'Field Hoodie 02',    label: 'HOUSE OF STITCH' },
  { img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&q=80', title: 'Creator Tee',        label: 'PLAIN LABS' },
  { img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80',   title: 'Runner 360',         label: 'STRIDE CO' },
  { img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&q=80',   title: 'Trail Daypack',      label: 'NORTH LOOM' },
  { img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=700&q=80', title: 'Studio Mic Kit',     label: 'WAVEFORM' },
  { img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80', title: 'Monitor Headphones', label: 'LUMEN AUDIO', saved: true },
  { img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700&q=80',   title: 'Monsoon Shell',      label: 'MONSOON LAB' },
];

/* intro statement — split into words so each can light up on scroll */
const INTRO_COPY = [
  { t: 'Fameo is a new network to find and collab with' },
  { t: 'verified creators.', box: true },
  { t: 'Follow the ones you trust, save favourites, plan shoots together and grow your reach — without the DMs into the void.' },
];
const INTRO_WORDS = INTRO_COPY.flatMap(s =>
  s.t.split(' ').map(w => ({ w, box: !!s.box }))
);

/* kinetic word bands — "Grow / your / reach" with per-letter scatter */
const KINETIC_BANDS = [
  { word: 'Grow',  band: 'lime' },
  { word: 'your',  band: '' },
  { word: 'reach', band: 'lime alt' },
];
/* star doodle that draws in when the "Grow" band centers (from the HTML) */
const GROW_STAR = 'M60 10 L70 44 L104 46 L76 64 L88 100 L60 78 L32 100 L44 64 L16 46 L50 44 Z';

/* ── hand-drawn doodles cycling around "reach" ───────────────────────────
   Each: viewBox, one or more stroke paths (drawn in via pathLength), and
   a position relative to the word (em units, so they scale with it).    */
const TASTE_DOODLES = [
  { /* flower / star burst */
    viewBox: '0 0 100 100',
    pos: { top: '-0.62em', left: '0.08em', width: '0.72em', height: '0.72em' },
    paths: [
      'M50 12 C40 30 28 36 14 38 C30 44 38 52 42 68 C50 54 60 46 84 44 C66 38 58 30 50 12 Z',
      'M46 40 a6 6 0 1 0 9 4',
    ],
  },
  { /* tangled scribble — bottom-left */
    viewBox: '0 0 100 100',
    pos: { left: '-0.78em', bottom: '-0.32em', width: '0.82em', height: '0.82em' },
    paths: [
      'M10 60 C20 30 55 30 60 50 C64 66 30 74 22 58 C14 42 44 34 58 44 C74 54 60 78 36 72 C18 68 12 74 30 80',
    ],
  },
  { /* swoosh arc — sweeping off the final letter */
    viewBox: '0 0 100 100',
    pos: { right: '-0.92em', top: '-0.5em', width: '1em', height: '1em' },
    paths: [
      'M8 72 C40 80 78 62 92 22',
      'M92 22 C86 27 80 29 73 29 M92 22 C91 30 92 37 95 43',
    ],
  },
  { /* thread weaving through the letters, with a loop */
    viewBox: '0 0 300 100',
    pos: { left: '0.12em', bottom: '-0.42em', width: '2.6em', height: '0.86em' },
    paths: [
      'M6 30 C60 70 120 20 160 55 C176 70 200 74 208 60 C214 48 196 44 190 56 C184 70 220 78 294 60',
      'M150 90 l7 -12 M167 92 l2 -13',
    ],
  },
  { /* noodle bowl + chopsticks — left of the word */
    viewBox: '0 0 100 120',
    pos: { left: '-1.05em', top: '-0.25em', width: '0.95em', height: '1.15em' },
    paths: [
      'M18 70 C18 94 82 94 82 70 C87 66 88 59 83 57 C60 48 30 50 17 57 C12 60 13 67 18 70 Z',
      'M30 62 C40 52 62 54 68 62 C58 68 40 68 34 60 C44 50 66 50 70 58',
      'M44 8 L52 58 M59 6 L56 56',
    ],
  },
];

const COLLECTIONS = [
  {
    name: 'Wedding Reels',
    by: 'Zoya Fernandes',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1800&q=80',
  },
  {
    name: 'Street Style Delhi',
    by: 'Arman Sheikh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1800&q=80',
  },
  {
    name: 'Home Studio Setups',
    by: 'Kabir Anand',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1800&q=80',
  },
  {
    name: 'Mumbai Food Crawl',
    by: 'Meher Kapoor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1800&q=80',
  },
  {
    name: 'Sunrise Rides',
    by: 'Ishaan Verma',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1800&q=80',
  },
  {
    name: 'Camera Bag Essentials',
    by: 'Priya Nair',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1800&q=80',
  },
  {
    name: 'Monsoon Blooms',
    by: 'Sana Qureshi',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1800&q=80',
  },
  {
    name: 'Festival Fits',
    by: 'Rohan Iyer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1800&q=80',
  },
  {
    name: 'Dream Studios',
    by: 'Tara Menon',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1800&q=80',
  },
];

/* ── outro "O" cycle — doodle art and photos alternate inside the O ─────── */
const O_MEDIA = [
  { t: 'd', i: 4 },  // noodle bowl doodle
  { t: 'i', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { t: 'd', i: 0 },  // flower burst
  { t: 'i', src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
  { t: 'd', i: 1 },  // tangled scribble
  { t: 'i', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' },
  { t: 'd', i: 2 },  // swoosh
  { t: 'i', src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
];

/* ── CSS ─────────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

.tss * , .tss *::before, .tss *::after { box-sizing: border-box; margin: 0; padding: 0; }
.tss {
  font-family: 'Schibsted Grotesk', sans-serif; color: #1A1A1A;
  /* brand rose tokens (matches the navbar palette) */
  --mn-rose:   #C24E74;
  --mn-rose-l: #D96A8E;
  --mn-rose-d: #9E3357;
  --mn-rose-grad: linear-gradient(135deg, var(--mn-rose-l) 30%, var(--mn-rose) 50%, var(--mn-rose-d) 76%);
}

/* ════ A. Intro statement + rail ═════════════════════════════════ */
.tss-intro {
  position: relative; background: #F2EFE9;
  padding: 16vh 40px 0;
}
.tss-intro-grid {
  max-width: 1500px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 340px; gap: 64px;
}
.tss-intro-copy {
  position: sticky; top: 12vh; align-self: start;
  font-size: clamp(30px, 3.55vw, 56px);
  font-weight: 500; line-height: 1.28; letter-spacing: -0.02em;
  padding-bottom: 24vh;
  will-change: opacity;
}
/* per-word scroll reveal */
.tss-word-r {
  display: inline-block;
  margin-right: 0.26em;
  will-change: transform, opacity;
}
.tss-intro-box {
  padding: 0 14px 2px;
  border: 1.5px solid #1A1A1A; border-radius: 12px;
  margin-right: 0.3em;
}
.tss-rail { display: flex; flex-direction: column; gap: 56px; padding-bottom: 30vh; }
.tss-card-img {
  position: relative; background: #E8E4DD; overflow: hidden;
  aspect-ratio: 1 / 1;
}
.tss-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tss-card-plus {
  position: absolute; right: 10px; bottom: 10px;
  width: 30px; height: 30px; border-radius: 3px;
  background: #fff; border: none; cursor: pointer;
  font-size: 15px; line-height: 1; color: #1A1A1A;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 10px rgba(20,15,10,.10);
}
.tss-card-save {
  position: absolute; left: 10px; bottom: 10px;
  width: 30px; height: 30px; border-radius: 3px;
  background: var(--mn-rose-grad); display: flex; align-items: center; justify-content: center;
}
.tss-card-title { font-size: 17px; font-weight: 500; margin-top: 12px; }
.tss-card-label {
  font-family: 'Space Mono', monospace; font-size: 10px;
  letter-spacing: .14em; color: #8B8781; margin-top: 4px;
}
/* the shared card mid-flight (rail → grid) */
.tss-flyer {
  position: fixed; z-index: 40;
  background: #E8E4DD; overflow: hidden;
  pointer-events: none;
  box-shadow: 0 24px 64px rgba(20,15,10,.16);
}
.tss-flyer img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}

/* ════ B. Collection panel ═══════════════════════════════════════ */
.tss-panel {
  position: relative; z-index: 2;
  background: #fff; margin-top: -18vh;
  padding: 10vh 40px 14vh;
  box-shadow: 0 -20px 60px rgba(20,15,10,.07);
}
.tss-panel-head { text-align: center; margin-bottom: 8vh; }
.tss-panel-kicker { font-size: 14px; font-weight: 500; margin-bottom: 18px; }
.tss-panel-title {
  font-size: clamp(36px, 4.6vw, 66px); font-weight: 500;
  letter-spacing: -0.025em; line-height: 1.05;
}
.tss-panel-sub { font-size: 15px; color: #8B8781; margin-top: 18px; }
.tss-panel-meta {
  display: flex; align-items: center; justify-content: center; gap: 26px;
  margin-top: 16px;
  font-family: 'Space Mono', monospace; font-size: 10px;
  letter-spacing: .14em; color: #8B8781;
}
.tss-panel-meta svg { vertical-align: -2px; margin-right: 6px; }
.tss-grid {
  max-width: 1500px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 72px 24px;
}
/* offset alternating columns, like the reference */
.tss-grid > div:nth-child(4n+2) { transform: translateY(44px); }
.tss-grid > div:nth-child(4n+4) { transform: translateY(24px); }

/* ════ C. Kinetic word bands ═════════════════════════════════════ */
.tss-cur { background: #EFEDE7; position: relative; overflow: hidden; }
.tss-cur-band {
  position: relative; min-height: 104vh;
  display: grid; place-items: center; overflow: hidden;
}
/* diagonal rose-gradient wedge backgrounds via clip-path */
.tss-cur-band.lime::before {
  content: ""; position: absolute; inset: -2px;
  background: linear-gradient(135deg, var(--mn-rose-l) 30%, var(--mn-rose) 50%, var(--mn-rose-d) 76%);
  clip-path: polygon(0 16%, 100% 0, 100% 84%, 0 100%);
}
.tss-cur-band.lime.alt::before {
  clip-path: polygon(0 0, 100% 14%, 100% 100%, 0 86%);
}
.tss-cur-w {
  position: relative; z-index: 2;
  font-weight: 500; letter-spacing: -0.03em;
  font-size: clamp(4rem, 11vw, 9.5rem); line-height: 1; color: #141414;
}
/* white type + doodle strokes on the rose wedges for contrast */
.tss-cur-band.lime .tss-cur-w { color: #FFF6F9; }
.tss-cur-band.lime .tss-cur-doodle path,
.tss-cur-band.lime .tss-doodle path { stroke: #FFF6F9; }
/* each letter is its own span — scattered by scroll, converging at center */
.tss-cur-w .cl { display: inline-block; will-change: transform, opacity, filter; }
.tss-cur-doodle {
  position: absolute; z-index: 2; width: 120px; height: 120px;
  pointer-events: none;
  top: calc(50% - 150px); left: calc(50% + 160px);
}
.tss-cur-doodle path {
  fill: none; stroke: #141414; stroke-width: 2.4;
  stroke-linecap: round; stroke-linejoin: round;
}
/* cycling hand-drawn doodles around "reach" — each design draws itself
   in stroke-by-stroke, holds, fades, then the next one appears */
.tss-doodle {
  position: absolute; overflow: visible; pointer-events: none;
  transition: opacity .35s;
}
.tss-doodle path {
  fill: none; stroke: #141414; stroke-width: 2.6;
  stroke-linecap: round; stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 1; stroke-dashoffset: 1;
  animation: tssDoodleDraw 2.2s cubic-bezier(.45,0,.2,1) forwards;
}
@keyframes tssDoodleDraw {
  0%   { stroke-dashoffset: 1; opacity: 1; }
  32%  { stroke-dashoffset: 0; opacity: 1; }
  80%  { stroke-dashoffset: 0; opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 0; }
}

/* ════ D. Zoom + Discover ════════════════════════════════════════ */
.tss-zoom-runway { position: relative; height: 650vh; background: #F2EFE9; }
.tss-zoom-stage {
  position: sticky; top: 0; height: 100svh; overflow: hidden;
  background: #F2EFE9;
}
.tss-zoom-line {
  position: absolute; inset: 0; z-index: 5;
  display: flex; align-items: center; justify-content: center;
  font-size: clamp(34px, 4.2vw, 68px); font-weight: 500;
  letter-spacing: -0.025em; color: #1A1A1A;
  white-space: nowrap; pointer-events: none;
}
.tss-zoom-line .tss-word { will-change: transform; }
.tss-grow {
  position: relative; overflow: hidden; flex-shrink: 0;
  margin: 0 0.22em; will-change: width, height;
}
.tss-grow img,
.tss-echo img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; display: block;
}
.tss-grow > img { transition: opacity .7s ease; }
.tss-echo {
  position: absolute; left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden; z-index: 2; will-change: width, height;
}
.tss-grow-shade {
  position: absolute; inset: 0; z-index: 3; pointer-events: none;
  background:
    linear-gradient(to top, rgba(10,8,6,.5) 0%, transparent 38%),
    radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(10,8,6,.3) 100%);
  will-change: opacity;
}

/* Discover UI */
.tss-disc { position: absolute; inset: 0; z-index: 9; will-change: opacity; }
.tss-disc.off { pointer-events: none; }
.tss-disc-label {
  position: absolute; left: 8.5%; top: 50%; transform: translateY(-50%);
  font-size: 15px; color: rgba(255,255,255,.9);
}
.tss-disc-lines line {
  stroke: rgba(255,255,255,.8); stroke-width: 1;
  vector-effect: non-scaling-stroke;
}
/* collection titles — each anchored to center, traveling bottom → top;
   the active one sits sharp and full-size exactly at center */
.tss-disc-items { position: absolute; inset: 0; pointer-events: none; }
.tss-disc-item {
  position: absolute; left: 50%; top: 50%;
  white-space: nowrap; font-weight: 500;
  font-size: clamp(32px, 4.6vw, 64px);
  letter-spacing: -0.03em; color: #fff;
  will-change: transform, opacity;
}
/* background stack — the incoming image wipes DOWN over the previous one,
   scroll-scrubbed (reverses when scrolling back up) */
.tss-disc-bg {
  position: absolute; inset: 0;
  will-change: clip-path, transform;
}
.tss-disc-bg img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; display: block;
}
.tss-disc-card {
  position: absolute; top: 14px; right: 18px; z-index: 20;
  background: #fff; padding: 10px 20px 10px 12px;
  display: flex; align-items: center; gap: 12px;
  box-shadow: 0 8px 32px rgba(20,15,10,.18);
}
.tss-disc-card img {
  width: 34px; height: 34px; border-radius: 50%; object-fit: cover; display: block;
}
.tss-disc-card-kicker {
  font-family: 'Space Mono', monospace; font-size: 9px;
  letter-spacing: .14em; color: #8B8781;
}
.tss-disc-card-name { font-size: 15px; font-weight: 500; color: #1A1A1A; margin-top: 2px; }
.tss-disc-thumb {
  position: absolute; overflow: hidden; z-index: 20;
  will-change: left, top, opacity;
  box-shadow: 0 10px 34px rgba(10,8,6,.35);
}
.tss-disc-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tss-disc-thumb.on {
  outline: 2px solid rgba(255,255,255,.9);
  outline-offset: 2px;
  transform: scale(1.06);
}

/* ════ E. Outro — giant wordmark with living "O" ═════════════════ */
.tss-outro {
  position: relative; z-index: 3; background: #fff;
  min-height: 100vh; display: flex; flex-direction: column;
  padding: 26px 34px 30px;
  box-shadow: 0 -18px 50px rgba(20,15,10,.08);
}
/* Matches the 100svh already used for .tss-zoom-stage — keeps the outro
   from overshooting the screen on mobile. Desktop is identical. */
@supports (min-height: 100svh){
  .tss-outro { min-height: 100svh; }
}
.tss-outro-top {
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
}
.tss-outro-links { display: flex; gap: 26px; }
.tss-outro-links a, .tss-outro-login {
  font-family: 'Space Mono', monospace; font-size: 12px;
  letter-spacing: .1em; color: #1A1A1A; text-decoration: none;
  transition: opacity .2s;
}
.tss-outro-links a:hover, .tss-outro-login:hover { opacity: .55; }
.tss-outro-social { display: flex; gap: 34px; justify-self: center; }
.tss-outro-social a { color: #1A1A1A; display: inline-flex; transition: opacity .2s; }
.tss-outro-social a:hover { opacity: .55; }
.tss-outro-social svg { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 1.6; }
.tss-outro-right { display: flex; align-items: center; gap: 22px; justify-self: end; }
.tss-outro-signup {
  font-family: 'Space Mono', monospace; font-size: 12px; letter-spacing: .1em;
  color: #fff; text-decoration: none;
  background: linear-gradient(135deg, var(--mn-rose-l) 30%, var(--mn-rose) 50%, var(--mn-rose-d) 76%);
  padding: 15px 26px;
  border-radius: 46% 54% 52% 48% / 58% 52% 48% 42%;   /* organic rose blob */
  transition: filter .2s;
}
.tss-outro-signup:hover { filter: brightness(1.08); }

/* ── signed-in variant of the top-right pair. The blob keeps its shape and
      its slot; only the label changes, so the page still closes on a single
      strong action instead of on a dead SIGN UP. ── */
.tss-outro-me {
  display: flex; align-items: center; gap: 9px;
  color: #1A1A1A; text-decoration: none; transition: opacity .2s;
}
.tss-outro-me:hover { opacity: .55; }
.tss-outro-av {
  width: 28px; height: 28px; border-radius: 50%; flex: none; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--mn-rose-l) 30%, var(--mn-rose) 52%, var(--mn-rose-d) 100%);
  color: #fff; font-family: 'Schibsted Grotesk', sans-serif;
  font-size: 11px; font-weight: 700;
}
.tss-outro-av img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tss-outro-name {
  font-family: 'Schibsted Grotesk', sans-serif;
  font-size: 13px; font-weight: 600; letter-spacing: -0.01em;
  max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
/* keeps the row from resizing once the persisted store is read */
.tss-outro-skel { width: 190px; height: 1px; }

.tss-outro-stage { flex: 1; display: grid; place-items: center; }
.tss-outro-word {
  font-weight: 700; letter-spacing: -0.045em; line-height: 1;
  font-size: clamp(76px, 15vw, 260px); color: #1A1A1A;
  white-space: nowrap; display: flex; align-items: center;
  will-change: transform;
}
/* the living "O" — doodles and photos cycle inside it */
.tss-outro-o {
  position: relative; display: inline-flex;
  width: 0.64em; height: 0.64em; margin-left: 0.035em;
  align-items: center; justify-content: center;
  border-radius: 50%;
}
.tss-outro-o img {
  width: 100%; height: 100%; border-radius: 50%;
  object-fit: cover; display: block;
  animation: tssOPop .55s cubic-bezier(.3,1.45,.4,1);
}
@keyframes tssOPop {
  from { transform: scale(.5); opacity: 0; }
  to   { transform: scale(1);  opacity: 1; }
}
.tss-outro-o svg { width: 116%; height: 116%; overflow: visible; }
.tss-outro-o svg path {
  fill: none; stroke: #141414; stroke-width: 3;
  stroke-linecap: round; stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 1; stroke-dashoffset: 1;
  animation: tssODraw 1.9s cubic-bezier(.45,0,.2,1) forwards;
}
@keyframes tssODraw {
  0%  { stroke-dashoffset: 1; }
  45% { stroke-dashoffset: 0; }
  100%{ stroke-dashoffset: 0; }
}

/* ════ responsive ════════════════════════════════════════════════ */
@media (max-width: 900px) {
  /* ── A. intro ── */
  .tss-intro { padding: 10vh 18px 0; }
  .tss-intro-grid { grid-template-columns: 1fr; gap: 40px; }
  .tss-intro-copy {
    position: static; padding-bottom: 0;
    font-size: clamp(24px, 6.4vw, 34px); line-height: 1.32;
  }
  .tss-intro-box { padding: 0 9px 1px; border-radius: 9px; }

  /* rail becomes a snapping horizontal carousel with real card widths */
  .tss-rail {
    flex-direction: row;
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding: 0 18px 8vh;
    margin: 0 -18px;
    scrollbar-width: none;
  }
  .tss-rail::-webkit-scrollbar { display: none; }
  .tss-rail > div {
    flex: 0 0 68vw;
    max-width: 300px;
    min-width: 0;
    scroll-snap-align: center;
  }
  .tss-rail .tss-card-img { aspect-ratio: 4 / 5; }
  .tss-card-title { font-size: 15px; }

  /* ── B. panel + grid ── */
  .tss-panel { margin-top: 0; padding: 8vh 18px 10vh; }
  .tss-panel-head { margin-bottom: 5vh; }
  .tss-panel-meta { flex-direction: column; gap: 8px; }
  .tss-grid { grid-template-columns: repeat(2, 1fr); gap: 40px 14px; }
  .tss-grid > div:nth-child(4n+2), .tss-grid > div:nth-child(4n+4) { transform: none; }

  /* ── C. kinetic bands ── */
  .tss-cur-band { min-height: 78vh; }
  .tss-cur-doodle { width: 76px; height: 76px; top: calc(50% - 100px); left: calc(50% + 80px); }

  /* ── D. zoom + discover ── */
  .tss-zoom-stage { height: 100svh; }
  .tss-zoom-line {
    font-size: clamp(20px, 6.2vw, 30px);
    padding: 0 12px;
  }
  .tss-grow { margin: 0 0.14em; }
  .tss-disc-label {
    left: 18px; top: 22px; transform: none;
    font-size: 12px; letter-spacing: .12em; opacity: .85;
  }
  .tss-disc-item {
    font-size: clamp(22px, 6.6vw, 32px);
    letter-spacing: -0.02em;
    max-width: 88vw;
    white-space: normal;
    text-align: center;
    line-height: 1.12;
  }
  .tss-disc-card {
    top: auto; bottom: 20px; right: 14px; left: 14px;
    padding: 9px 14px 9px 10px; gap: 10px;
  }
  .tss-disc-card img { width: 30px; height: 30px; }
  .tss-disc-card-name { font-size: 14px; }
  .tss-disc-thumb { display: none; }

  /* ── E. outro ── */
  .tss-outro { padding: 20px 18px 24px; }
  .tss-outro-links { display: none; }
  .tss-outro-top { grid-template-columns: auto 1fr; }
  .tss-outro-social { justify-self: start; gap: 22px; }
  .tss-outro-right { gap: 14px; }
  .tss-outro-name  { max-width: 76px; }
  .tss-outro-skel  { width: 120px; }
}

@media (prefers-reduced-motion: reduce) {
  .tss-intro-copy { position: static; }
  .tss-doodle path { animation: none; stroke-dashoffset: 0; }
  .tss-cur-w .cl { transform: none !important; opacity: 1 !important; filter: none !important; }
  .tss-word-r { opacity: 1 !important; transform: none !important; }
}
`;

/* ── small building blocks ──────────────────────────────────────────────── */
function ProductCard({ p, imgRef, hidden }) {
  return (
    <div style={hidden ? { visibility: 'hidden' } : undefined}>
      <div className="tss-card-img" ref={imgRef}>
        <img src={p.img} alt={p.title} loading="lazy" draggable={false} />
        {p.saved && (
          <span className="tss-card-save" aria-label="Saved">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff">
              <path d="M6 3h12v18l-6-4.5L6 21V3z" />
            </svg>
          </span>
        )}
        <button className="tss-card-plus" aria-label={`Add ${p.title}`}>+</button>
      </div>
      <div className="tss-card-title">{p.title}</div>
      <div className="tss-card-label">{p.label}</div>
    </div>
  );
}

/* ════ A. Intro statement + rail ═════════════════════════════════════════
   Each word owns a slice of the runway and lights up (opacity + rise) as
   the slice passes, so the statement reads itself into being while you
   scroll. Reversible — scroll back up and the words dim again.        */
function IntroRail({ sharedImgRef, sharedHidden }) {
  const ref = useRef(null);
  const pr = useRunwayProgress(ref);
  const isMobile = useIsMobile();
  const last = RAIL_CARDS.length - 1;

  const reveal = seg(pr, 0.02, 0.62);   // words light up across this window
  const fade = seg(pr, 0.78, 1);        // statement dims as the panel arrives
  const n = INTRO_WORDS.length;

  return (
    <section className="tss-intro" ref={ref}>
      <div className="tss-intro-grid">
        <p className="tss-intro-copy" style={{ opacity: 1 - fade * 0.7 }}>
          {INTRO_WORDS.map((o, i) => {
            const start = (i / n) * 0.86;                    // staggered starts
            const e = easeInOut(clamp01((reveal - start) / 0.14));
            return (
              <span
                key={i}
                className={`tss-word-r${o.box ? ' tss-intro-box' : ''}`}
                style={{
                  opacity: lerp(0.16, 1, e),
                  transform: `translateY(${((1 - e) * 0.32).toFixed(3)}em)`,
                  borderColor: o.box ? `rgba(26,26,26,${e.toFixed(2)})` : undefined,
                }}
              >
                {o.w}
              </span>
            );
          })}
        </p>

        <div className="tss-rail">
          {RAIL_CARDS.map((c, i) => (
            <ProductCard
              key={i}
              p={c}
              imgRef={i === last ? sharedImgRef : undefined}
              /* the flight is disabled on mobile, so never hide the card there */
              hidden={!isMobile && i === last && sharedHidden}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════ B. Collection panel + grid ════════════════════════════════════════ */
function CollectionPanel({ sharedImgRef, sharedHidden }) {
  return (
    <section className="tss-panel">
      <div className="tss-panel-head">
        <div className="tss-panel-kicker">Collection</div>
        <h2 className="tss-panel-title">Creator Studio Gear</h2>
        <p className="tss-panel-sub">Everything our verified creators shoot with — studio to street.</p>
        <div className="tss-panel-meta">
          <span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 3h12v18l-6-4-6 4z" />
            </svg>
            38 PICKS
          </span>
          <span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
            </svg>
            UPDATED 17 HOURS AGO
          </span>
        </div>
      </div>
      <div className="tss-grid">
        {GRID_PRODUCTS.map((p, i) => (
          <ProductCard
            key={i}
            p={p}
            imgRef={i === 0 ? sharedImgRef : undefined}
            hidden={i === 0 && sharedHidden}
          />
        ))}
      </div>
    </section>
  );
}

/* ════ C. Kinetic word bands — "Grow / your / reach" ═════════════════════
   Each letter is its own span with a unique amplitude / direction /
   rotation. As a band moves through the viewport, letters scatter by its
   distance from center (d) — flying apart on entry, converging into the
   clean word when centered, scattering again on exit. Fully reversible.
   "Grow" draws a star doodle in as it centers; "reach" hosts the cycling
   hand-drawn doodle set, gated to visible only near center.            */
function KineticBands() {
  const bandRefs = useRef([]);
  const letterRefs = useRef(KINETIC_BANDS.map(() => []));
  const starRef = useRef(null);
  const starLen = useRef(0);
  const cycleWrapRef = useRef(null);
  const raf = useRef(0);
  const [dIdx, setDIdx] = useState(0);

  /* cycle to the next doodle design every 2.2s */
  useEffect(() => {
    const t = setInterval(() => setDIdx(i => (i + 1) % TASTE_DOODLES.length), 2200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (starRef.current) {
      const L = starRef.current.getTotalLength();
      starLen.current = L;
      starRef.current.style.strokeDasharray = L;
      starRef.current.style.strokeDashoffset = L;
    }

    const update = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        bandRefs.current.forEach((band, bi) => {
          if (!band) return;
          const r = band.getBoundingClientRect();
          if (r.bottom < -80 || r.top > window.innerHeight + 80) return;
          const d = Math.max(-1.2, Math.min(1.2,
            (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight));

          letterRefs.current[bi].forEach((el, i) => {
            if (!el) return;
            const amp = 70 + ((i * 53) % 97);
            const dir = i % 2 ? 1 : -1;
            const rot = ((i * 37) % 11) - 5;
            const drift = ((i * 29) % 41) - 20;
            const ad = Math.abs(d);
            el.style.transform =
              `translate(${(d * drift).toFixed(1)}px, ${(d * amp * dir).toFixed(1)}px) ` +
              `rotate(${(d * rot).toFixed(2)}deg) scale(${(1 - ad * 0.12).toFixed(3)})`;
            el.style.opacity = Math.max(0.05, 1 - ad * 0.85).toFixed(2);
            el.style.filter = `blur(${Math.min(7, ad * 6).toFixed(2)}px)`;
          });

          if (bi === 0 && starRef.current) {
            const prog = clamp01(1 - Math.abs(d) * 1.8);
            starRef.current.style.strokeDashoffset = starLen.current * (1 - prog);
          }
          if (bi === 2 && cycleWrapRef.current) {
            cycleWrapRef.current.style.opacity = Math.abs(d) < 0.4 ? 1 : 0;
          }
        });
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const doodle = TASTE_DOODLES[dIdx];

  return (
    <section className="tss-cur">
      {KINETIC_BANDS.map((b, bi) => (
        <div
          key={bi}
          className={`tss-cur-band${b.band ? ` ${b.band}` : ''}`}
          ref={el => { bandRefs.current[bi] = el; }}
        >
          <h2 className="tss-cur-w">
            {b.word.split('').map((ch, i) => (
              <span key={i} className="cl" ref={el => { letterRefs.current[bi][i] = el; }}>
                {ch}
              </span>
            ))}

            {bi === 2 && (
              <span ref={cycleWrapRef} style={{ opacity: 0 }}>
                <svg
                  key={dIdx}
                  className="tss-doodle"
                  style={doodle.pos}
                  viewBox={doodle.viewBox}
                  preserveAspectRatio="xMidYMid meet"
                >
                  {doodle.paths.map((d, pi) => (
                    <path key={pi} d={d} pathLength={1} style={{ animationDelay: `${pi * 0.22}s` }} />
                  ))}
                </svg>
              </span>
            )}
          </h2>

          {bi === 0 && (
            <svg className="tss-cur-doodle" viewBox="0 0 120 120" aria-hidden="true">
              <path ref={starRef} d={GROW_STAR} />
            </svg>
          )}
        </div>
      ))}
    </section>
  );
}

/* ════ D. Zoom-in seed-grow + Discover browser ═══════════════════════════
   Mobile gets its own geometry: a proportionally larger seed, a wider
   word split, fewer echoes, tighter title spacing with a faster falloff
   (so only the active title plus neighbours are on screen), wrapping
   titles, no annotation lines, no thumb ring, and a shorter runway.  */
function ZoomDiscover() {
  const ref = useRef(null);
  const { vw, vh } = useViewport();
  const pr = useRunwayProgress(ref);
  const isMobile = useIsMobile();
  const [active, setActive] = useState(0);

  /* ── phase mapping ──────────────────────────────────────────── */
  const gRaw = seg(pr, 0.04, 0.30);       // seed → fullscreen (raw)
  const g = easeInOut(gRaw);              // eased leader
  const dIn = seg(pr, 0.32, 0.40);        // discover UI fade in

  /* seed geometry */
  const seedW = isMobile ? Math.min(150, vw * 0.34) : Math.min(200, vw * 0.14);
  const seedH = isMobile ? Math.min(96, vh * 0.13)  : Math.min(80, vh * 0.11);
  const gw = lerp(seedW, vw, g);
  const gh = lerp(seedH, vh, g);
  const wordShift = g * vw * (isMobile ? 0.85 : 0.55);

  /* echo fan-out (same construction as the hero) */
  const ECHOES = isMobile ? 4 : 7, LAG = 0.035;
  const echoes = [];
  if (gRaw > 0.005 && gRaw < 0.995) {
    for (let i = 1; i <= ECHOES; i++) {
      const lagged = easeInOut(clamp01((gRaw - i * LAG) / (1 - i * LAG)));
      echoes.push({ w: lerp(seedW, vw, lagged), h: lerp(seedH, vh, lagged) });
    }
  }

  /* ── discover list scrub ────────────────────────────────────── */
  const N = COLLECTIONS.length;
  const listF = seg(pr, 0.42, 0.96) * (N - 1);   // continuous 0 → N-1
  const activeIdx = Math.round(listF);
  useEffect(() => { setActive(activeIdx); }, [activeIdx]);

  const itemH = isMobile ? vh * 0.13 : vh * 0.18;
  const fall = isMobile ? 0.95 : 0.62;
  const col = COLLECTIONS[active];

  return (
    <section
      className="tss-zoom-runway"
      ref={ref}
      style={{ height: isMobile ? '460vh' : '650vh' }}
    >
      <div className="tss-zoom-stage">

        {/* "Zoom in with ▢ Fameo" seed line */}
        <div className="tss-zoom-line">
          <span className="tss-word" style={{ transform: `translateX(${-wordShift}px)` }}>
            Zoom in with
          </span>

          <div className="tss-grow" style={{ width: gw, height: gh }}>
            {/* leader — crossfades between collections once in Discover */}
            {COLLECTIONS.map((c, i) => (
              <img key={i} src={c.image} alt={c.name} style={{ opacity: i === active ? 1 : 0 }} draggable={false} />
            ))}
            {/* trailing echo copies */}
            {echoes.map((e, i) => (
              <div key={i} className="tss-echo" style={{ width: e.w, height: e.h }}>
                <img src={COLLECTIONS[active].image} alt="" draggable={false} />
              </div>
            ))}
            <div className="tss-grow-shade" style={{ opacity: g }} />
          </div>

          <span className="tss-word" style={{ transform: `translateX(${wordShift}px)` }}>
            Fameo
          </span>
        </div>

        {/* ── Discover UI ─────────────────────────────────────── */}
        <div className={`tss-disc${dIn <= 0.02 ? ' off' : ''}`} style={{ opacity: dIn }}>
          {/* background stack — the incoming collection wipes DOWN over the
              current one as the list scrubs; the wipe fraction is the
              fractional part of listF, so it's fully scroll-linked */}
          {COLLECTIONS.map((c, i) => {
            const below = i < activeIdx;
            const isNext = i === activeIdx + 1;
            const frac = listF - activeIdx;
            let clip = 'inset(0 0 0 0)';
            if (i > activeIdx && !isNext) clip = 'inset(0 0 100% 0)';
            else if (isNext) clip = `inset(0 0 ${((1 - frac) * 100).toFixed(2)}% 0)`;
            else if (below) clip = 'inset(0 0 0 0)';
            return (
              <div
                key={i}
                className="tss-disc-bg"
                style={{ clipPath: clip, zIndex: i, opacity: i > activeIdx + 1 ? 0 : 1 }}
              >
                <img src={c.image} alt="" draggable={false} />
                <div className="tss-grow-shade" style={{ opacity: 1 }} />
              </div>
            );
          })}

          {/* annotation lines — desktop only; they cut through titles on a phone */}
          {!isMobile && (
            <svg className="tss-disc-lines" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20 }}
                 viewBox={`0 0 ${vw} ${vh}`} preserveAspectRatio="none">
              <line
                x1={vw * 0.135} y1={vh * 0.48} x2={vw * 0.38} y2={vh * 0.02}
                style={{ strokeDasharray: 900, strokeDashoffset: 900 * (1 - dIn) }}
              />
              <line
                x1={vw * 0.135} y1={vh * 0.52} x2={vw * 0.34} y2={vh * 0.98}
                style={{ strokeDasharray: 900, strokeDashoffset: 900 * (1 - dIn) }}
              />
            </svg>
          )}

          <div className="tss-disc-label" style={{ zIndex: 20 }}>Discover</div>

          {/* collection titles — each travels bottom → top, active one sharp
              at center; text moves UP while the image wipes DOWN */}
          <div className="tss-disc-items" style={{ zIndex: 20 }}>
            {COLLECTIONS.map((c, i) => {
              const rel = i - listF;                  // 0 = centered
              const ad = Math.abs(rel);
              /* skip far-off titles on mobile instead of stacking them blurred */
              if (isMobile && ad > 2.2) return null;
              return (
                <div
                  key={i}
                  className="tss-disc-item"
                  style={{
                    transform: `translate(-50%, calc(-50% + ${(rel * itemH).toFixed(1)}px))`,
                    opacity: clamp01(1 - ad * fall),
                    filter: `blur(${Math.min(5, ad * (isMobile ? 4 : 3)).toFixed(2)}px)`,
                    fontWeight: ad < 0.5 ? 600 : 500,
                  }}
                >
                  {c.name}
                </div>
              );
            })}
          </div>

          {/* COLLECTION BY card */}
          <div className="tss-disc-card">
            <img src={col.avatar} alt={col.by} />
            <div>
              <div className="tss-disc-card-kicker">COLLECTION BY</div>
              <div className="tss-disc-card-name">{col.by}</div>
            </div>
          </div>

          {/* orbital preview thumbnails — one per collection, laid out on a
              circular arc bulging from the right edge; the ring rotates
              with the list scrub so thumbs travel circle-wise, and the
              active collection's preview sits at the arc's midpoint.
              Desktop only — the radius is meaningless at phone widths. */}
          {!isMobile && (() => {
            const cx = vw * 0.40;          // ring center (near screen center)
            const cy = vh * 0.50;
            const R = vw * 0.46;           // ring radius → arc hugs right edge
            const STEP = 0.30;             // radians between thumbs on the ring
            const SIZES = [
              { w: 112, h: 132 }, { w: 150, h: 102 }, { w: 148, h: 104 },
              { w: 142, h: 98 },  { w: 118, h: 138 },
            ];
            return COLLECTIONS.map((c, i) => {
              const a = (i - listF) * STEP;          // active → angle 0 (3 o'clock)
              const s = SIZES[i % SIZES.length];
              return (
                <div
                  key={i}
                  className={`tss-disc-thumb${i === active ? ' on' : ''}`}
                  style={{
                    left: cx + R * Math.cos(a) - s.w / 2,
                    top: cy + R * Math.sin(a) - s.h / 2,
                    width: s.w, height: s.h,
                    opacity: clamp01(1 - Math.abs(i - listF) * 0.22),
                  }}
                >
                  <img src={c.image} alt={c.name} draggable={false} />
                </div>
              );
            });
          })()}
        </div>
      </div>
    </section>
  );
}

/* ════ A+B wrapper — shared-element flight (rail → grid) ═════════════════
   The camera card detaches from the rail as you scroll, travels across
   the page (image only, title left behind), floats above the white
   panel, and lands as the first card of the grid. Scrubbed from scroll,
   so it reverses when scrolling back up.

   Mechanics (FLIP-style): both endpoints render normal cards; while the
   flight progress is between 0 and 1 they turn invisible (layout kept)
   and a fixed-position "flyer" interpolates between their live
   getBoundingClientRect() rects.

   Disabled on mobile — the rail is a horizontal carousel there, so a
   fixed-position flight would fight the user's own swipe.             */
function IntroToGrid() {
  const startRef = useRef(null);   // rail card image wrapper
  const endRef = useRef(null);     // first grid card image wrapper
  const raf = useRef(0);
  const isMobile = useIsMobile();
  const [fly, setFly] = useState({ fp: 0, l: 0, t: 0, w: 0, h: 0 });

  useEffect(() => {
    if (isMobile) { setFly(f => ({ ...f, fp: 0 })); return; }

    const tick = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const a = startRef.current, b = endRef.current;
        if (!a || !b) return;
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        const vh = window.innerHeight;
        /* flight runs while the grid slot travels from 1.15vh → 0.38vh */
        const fp = clamp01((vh * 1.15 - rb.top) / (vh * 0.77));
        const e = easeInOut(fp);
        setFly({
          fp,
          l: lerp(ra.left, rb.left, e),
          t: lerp(ra.top, rb.top, e),
          w: lerp(ra.width, rb.width, e),
          h: lerp(ra.height, rb.height, e),
        });
      });
    };
    tick();
    window.addEventListener('scroll', tick, { passive: true });
    window.addEventListener('resize', tick);
    return () => {
      window.removeEventListener('scroll', tick);
      window.removeEventListener('resize', tick);
      cancelAnimationFrame(raf.current);
    };
  }, [isMobile]);

  const inFlight = !isMobile && fly.fp > 0 && fly.fp < 1;

  return (
    <>
      <IntroRail sharedImgRef={startRef} sharedHidden={!isMobile && fly.fp > 0} />
      <CollectionPanel sharedImgRef={endRef} sharedHidden={!isMobile && fly.fp < 1} />

      {inFlight && (
        <div
          className="tss-flyer"
          style={{ left: fly.l, top: fly.t, width: fly.w, height: fly.h }}
        >
          <img src={SHARED_PRODUCT.img} alt={SHARED_PRODUCT.title} draggable={false} />
          {SHARED_PRODUCT.saved && (
            <span className="tss-card-save" aria-label="Saved">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff">
                <path d="M6 3h12v18l-6-4.5L6 21V3z" />
              </svg>
            </span>
          )}
        </div>
      )}
    </>
  );
}

/* ════ E. Outro — giant FAMEO wordmark with a living "O" ═════════════════
   White closing panel that settles in over the previous section. The
   wordmark scales up slightly as the panel enters and locks at full
   size. The final "O" is alive: hand-drawn doodles (stroke-by-stroke)
   and circular photos keep replacing each other continuously. While
   the outro is on screen, the fixed pill navbar and SCROLL cue from
   the hero fade away (LOGIN / SIGN UP live in the outro's top row).  */
function Outro() {
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
export default function FameoScrollSections() {
  return (
    <div className="tss">
      <style>{CSS}</style>
      <IntroToGrid />
      <KineticBands />
      <ZoomDiscover />
      <Outro />
    </div>
  );
}