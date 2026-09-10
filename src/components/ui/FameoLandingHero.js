'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   FAMEO LANDING HERO — React port of fameo-landing_3.html's hero
   ─────────────────────────────────────────────────────────────────────────
   Systems ported 1:1 from the reference file:

   • Fullscreen video slideshow — 5 slides, dark shade, giant two-row
     staggered headline (row 2 right-aligned) rising in per slide,
     creator caption, "01 / 05" counter, bobbing down arrow,
     auto-advance every 7s with crossfade (tap/click resets the clock).
   • Star peek — a fixed, star-shaped clip-path window follows the
     pointer (mouse OR finger) showing the NEXT slide, with a living
     wobble + breathing radius, plus arrow glyph. Native cursor hidden
     over the hero on desktop.
   • Click/tap star reveal — blooms the next slide from a star at the
     pointer that grows past every corner, then commits the slide.
     On touch the star is shown first, then the bloom fires.
   • Patreon-layout nav — links · centered FAMEO brand + gold tick ·
     action pills. Pointer stays normal over nav & the down arrow.

   Media uses fallback chains (Pexels → Google samples, Unsplash →
   Picsum) exactly like the source file, so something always loads.
   ═══════════════════════════════════════════════════════════════════════ */

/* ── media fallback chains ─────────────────────────────────────────────── */
const VIDEOS = [
  ['https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'],
  ['https://videos.pexels.com/video-files/3184291/3184291-hd_1920_1080_25fps.mp4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'],
  ['https://videos.pexels.com/video-files/3184338/3184338-hd_1920_1080_25fps.mp4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'],
  ['https://videos.pexels.com/video-files/3184465/3184465-hd_1920_1080_25fps.mp4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'],
  ['https://videos.pexels.com/video-files/4434246/4434246-hd_1920_1080_24fps.mp4', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'],
];
const SLIDE_IMGS = [
  ['https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1920&q=80&auto=format&fit=crop', 'https://picsum.photos/seed/fslide0/1920/1080'],
  ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1920&q=80&auto=format&fit=crop', 'https://picsum.photos/seed/fslide1/1920/1080'],
  ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80&auto=format&fit=crop', 'https://picsum.photos/seed/fslide2/1920/1080'],
  ['https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&q=80&auto=format&fit=crop', 'https://picsum.photos/seed/fslide3/1920/1080'],
  ['https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=1920&q=80&auto=format&fit=crop', 'https://picsum.photos/seed/fslide4/1920/1080'],
];
const AVATARS = [
  ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop', 'https://picsum.photos/seed/fav0/200/200'],
  ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80&auto=format&fit=crop', 'https://picsum.photos/seed/fav1/200/200'],
  ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80&auto=format&fit=crop', 'https://picsum.photos/seed/fav2/200/200'],
  ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80&auto=format&fit=crop', 'https://picsum.photos/seed/fav3/200/200'],
  ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80&auto=format&fit=crop', 'https://picsum.photos/seed/fav4/200/200'],
];
const SLIDES = [
  { rows: ['Your realest', 'creator circle'], cap: "Riya is filming India's boldest wedding stories" },
  { rows: ['From one reel', 'to real reach'], cap: 'Arjun is turning street photography into a movement' },
  { rows: ['Verified faces', 'real collabs'], cap: 'Meera is styling the next wave of Indian fashion' },
  { rows: ['Your fame', 'your terms'],        cap: 'Dev is plating stories from his Bengaluru kitchen' },
  { rows: ['Double the reach', 'zero fakes'], cap: "Zara is choreographing Chennai's street-dance scene" },
];
const N = SLIDES.length;
const AUTO_MS = 7000;
const TOUCH_PEEK_DELAY = 200;   // let the star register before the bloom on touch
const TOUCH_PEEK_LINGER = 260;  // keep the star up briefly after a finger lifts

/* 5-point star polygon around (cx,cy) — same 10 points everywhere so the
   clip-path can interpolate smoothly between any two stars */
function starPoly(cx, cy, rOut, rot) {
  const rIn = rOut * 0.45, pts = [];
  for (let i = 0; i < 10; i++) {
    const a = rot + (i * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 === 0 ? rOut : rIn;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)}px ${(cy + r * Math.sin(a)).toFixed(1)}px`);
  }
  return `polygon(${pts.join(',')})`;
}

/* image with a fallback chain */
function ChainImg({ chain, className, alt = '' }) {
  const [i, setI] = useState(0);
  return (
    <img
      className={className}
      alt={alt}
      src={chain[Math.min(i, chain.length - 1)]}
      onError={() => setI(v => Math.min(v + 1, chain.length - 1))}
      draggable={false}
    />
  );
}

/* ── CSS ────────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700;800&family=Archivo+Black&display=swap');

.flh, .flh *, .flh *::before, .flh *::after { box-sizing: border-box; margin: 0; padding: 0; }
.flh {
  --ink:#151515; --gold:#E8A33D;
  --ease:cubic-bezier(.22,.8,.24,1);
  font-family:'Archivo',system-ui,sans-serif;
}

/* ── nav (links · logo · actions) ─────────────────────────────── */
.flh .nav{position:absolute;inset:0 0 auto;z-index:100;color:#fff;padding:1.4rem 0;cursor:auto}
.flh .nav-in{width:min(1440px,95vw);margin-inline:auto;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:1rem}
.flh .nav-left{display:flex;align-items:center;gap:1.9rem;font-size:.95rem;font-weight:500}
.flh .nav-left a{opacity:.92;transition:opacity .25s;color:inherit;text-decoration:none}
.flh .nav-left a:hover{opacity:1;text-decoration:underline;text-underline-offset:5px}
.flh .pill{border:1.5px solid rgba(255,255,255,.85);border-radius:100px;padding:.62rem 1.35rem;display:inline-flex;align-items:center;gap:.5rem;font-weight:500;font-size:.93rem;transition:.3s;background:transparent;color:#fff;cursor:pointer;text-decoration:none}
.flh .pill:hover{background:rgba(255,255,255,.14)}
.flh .pill.solid{background:#fff;color:var(--ink);border-color:#fff;font-weight:600}
.flh .pill.solid:hover{transform:scale(1.04)}
.flh .brand{font-family:'Archivo Black','Archivo',sans-serif;font-size:1.45rem;letter-spacing:.14em;display:flex;align-items:center;gap:.5rem;justify-self:center;color:inherit;text-decoration:none}
.flh .brand .tick{width:22px;height:22px;border-radius:50%;background:var(--gold);display:inline-grid;place-items:center;flex:none}
.flh .brand .tick svg{width:12px;height:12px;stroke:#fff;stroke-width:3.6;fill:none}
.flh .nav-right{display:flex;align-items:center;gap:.7rem;justify-self:end}
.flh .s-ico{width:15px;height:15px;stroke:currentColor;stroke-width:2.2;fill:none}

/* ── hero slideshow ───────────────────────────────────────────── */
.flh .hero{
  position:relative;height:100svh;overflow:hidden;background:#111;cursor:none;
  touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none;
}
.flh .slide{position:absolute;inset:0;opacity:0;pointer-events:none;transition:opacity .9s var(--ease)}
.flh .slide.active{opacity:1;pointer-events:auto}
.flh .slide .media{position:absolute;inset:0}
.flh .slide .media .bgimg,
.flh .slide .media video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.flh .slide .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.34),rgba(0,0,0,.1) 40%,rgba(0,0,0,.38))}
/* giant staggered headline */
.flh .slide h1{
  position:absolute;left:0;right:0;bottom:4.5rem;z-index:5;color:#fff;
  font-weight:400;letter-spacing:-.03em;line-height:.96;
  font-size:clamp(3.2rem,10.5vw,9.2rem);pointer-events:none;
}
.flh .slide h1 .row{display:block;overflow:hidden;padding:0 3vw}
.flh .slide h1 .row:nth-child(2){text-align:right;padding-right:2.5vw}
.flh .slide h1 .row i{display:block;font-style:normal;transform:translateY(115%)}
.flh .slide.active h1 .row i{animation:flhRise 1s var(--ease) forwards}
.flh .slide.active h1 .row:nth-child(2) i{animation-delay:.14s}
@keyframes flhRise{to{transform:translateY(0)}}
/* creator caption */
.flh .cap{
  position:absolute;right:4vw;top:58%;z-index:5;display:flex;gap:1rem;align-items:center;
  color:#fff;max-width:330px;pointer-events:none;opacity:0;transform:translateY(14px);
}
.flh .slide.active .cap{animation:flhCapIn .8s var(--ease) .45s forwards}
@keyframes flhCapIn{to{opacity:1;transform:none}}
.flh .cap img{width:64px;height:64px;border-radius:50%;object-fit:cover;flex:none}
.flh .cap p{font-size:.98rem;font-weight:500;line-height:1.45}
.flh .cap p span{opacity:.95}
/* down arrow */
.flh .down{
  position:absolute;left:3vw;bottom:2.6rem;z-index:6;color:#fff;font-size:3.4rem;line-height:1;
  animation:flhBob 2.6s ease-in-out infinite;pointer-events:auto;cursor:pointer;background:none;border:none;
}
@keyframes flhBob{50%{transform:translateY(9px)}}
/* slide counter */
.flh .count{position:absolute;right:4vw;bottom:2.8rem;z-index:6;color:#fff;font-weight:600;letter-spacing:.22em;font-size:.8rem;opacity:.85}

/* ── star peek ────────────────────────────────────────────────── */
.flh .peek{
  position:fixed;inset:0;z-index:60;
  pointer-events:none;opacity:0;transition:opacity .25s;will-change:clip-path;
  clip-path:polygon(0 0,0 0,0 0,0 0,0 0,0 0,0 0,0 0,0 0,0 0);
}
.flh .peek.show{opacity:1}
.flh .peek .win{position:absolute;inset:0}
.flh .peek .win img,.flh .peek .win video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.flh .peek-arrow{
  position:fixed;z-index:61;width:34px;height:34px;left:0;top:0;color:#fff;
  pointer-events:none;opacity:0;transition:opacity .25s;filter:drop-shadow(0 1px 6px rgba(0,0,0,.5));
}
.flh .peek-arrow.show{opacity:1}
.flh .peek-arrow svg{width:100%;height:100%;stroke:currentColor;stroke-width:2.4;fill:none}
/* click reveal overlay */
.flh .reveal{position:absolute;inset:0;z-index:40;pointer-events:none;visibility:hidden;will-change:clip-path}
.flh .reveal.go{visibility:visible}
.flh .reveal .media{position:absolute;inset:0}
.flh .reveal .media img,.flh .reveal .media video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}

@media (max-width: 900px){
  .flh .nav-left{display:none}
  .flh .nav-in{grid-template-columns:auto 1fr}
  .flh .nav-right{gap:.5rem}
  .flh .cap{display:none}
  .flh .peek-arrow{width:26px;height:26px}
}
/* no native cursor to hide on touch devices */
@media (pointer: coarse){
  .flh .hero{cursor:auto}
}
@media (prefers-reduced-motion: reduce){
  .flh .down{animation:none}
}
`;

/* ═══════════════════════════════════════════════════════════════════════ */
export default function FameoLandingHero() {
  const [cur, setCur] = useState(0);
  const [vidIdx, setVidIdx] = useState(() => VIDEOS.map(() => 0)); // fallback chains
  const [env, setEnv] = useState({ rm: false, isTouch: false });

  const heroRef = useRef(null);
  const slideVids = useRef([]);
  const peekRef = useRef(null);
  const peekArrowRef = useRef(null);
  const peekVidRef = useRef(null);
  const revealRef = useRef(null);
  const revealVidRef = useRef(null);

  const animating = useRef(false);
  const autoTimer = useRef(null);
  const lingerTimer = useRef(null);
  const bloomTimer = useRef(null);
  const rafOn = useRef(false);
  const pos = useRef({ px: 0, py: 0, tx: 0, ty: 0 });
  const baseR = useRef(118);
  const envRef = useRef({ rm: false, isTouch: false });

  const next = (cur + 1) % N;

  /* environment (reduced motion / touch) + viewport-scaled star radius */
  useEffect(() => {
    const e = {
      rm: matchMedia('(prefers-reduced-motion: reduce)').matches,
      isTouch: matchMedia('(pointer: coarse)').matches,
    };
    setEnv(e);
    envRef.current = e;

    pos.current.px = pos.current.tx = window.innerWidth / 2;
    pos.current.py = pos.current.ty = window.innerHeight / 2;

    const sizeStar = () => { baseR.current = Math.max(64, Math.min(118, window.innerWidth * 0.24)); };
    sizeStar();
    window.addEventListener('resize', sizeStar);
    return () => window.removeEventListener('resize', sizeStar);
  }, []);

  /* play the active slide's video, pause the rest */
  useEffect(() => {
    slideVids.current.forEach((v, k) => {
      if (!v) return;
      if (k === cur && !env.rm) v.play().catch(() => {});
      else v.pause();
    });
  }, [cur, env.rm]);

  /* keep the peek video playing (it previews the NEXT slide) */
  useEffect(() => {
    if (!env.rm) peekVidRef.current?.play().catch(() => {});
  }, [next, env.rm]);

  /* ── timed auto-advance (tap/click resets the clock) ────────── */
  const schedule = useCallback(() => {
    clearTimeout(autoTimer.current);
    autoTimer.current = setTimeout(function tick() {
      if (!animating.current) setCur(c => (c + 1) % N);
      autoTimer.current = setTimeout(tick, AUTO_MS);
    }, AUTO_MS);
  }, []);

  useEffect(() => {
    schedule();
    const vis = () => (document.hidden ? clearTimeout(autoTimer.current) : schedule());
    document.addEventListener('visibilitychange', vis);
    return () => {
      clearTimeout(autoTimer.current);
      clearTimeout(lingerTimer.current);
      clearTimeout(bloomTimer.current);
      document.removeEventListener('visibilitychange', vis);
    };
  }, [schedule]);

  /* ── star peek follow loop (lerp + living wobble) ───────────── */
  const raf = useCallback(t => {
    const p = pos.current;
    p.px += (p.tx - p.px) * 0.18;
    p.py += (p.ty - p.py) * 0.18;
    const time = (t || 0) / 1000;
    const rot = Math.sin(time * 1.3) * 0.16;                              // gentle wobble
    const rad = baseR.current + Math.sin(time * 2.1) * (baseR.current * 0.06); // breathing size
    if (peekRef.current) peekRef.current.style.clipPath = starPoly(p.px, p.py, rad, rot);
    if (peekArrowRef.current) {
      const half = envRef.current.isTouch ? 13 : 17;
      peekArrowRef.current.style.transform = `translate(${p.px - half}px,${p.py - half}px)`;
    }
    if (rafOn.current) requestAnimationFrame(raf);
  }, []);

  const peekOn = useCallback(() => {
    clearTimeout(lingerTimer.current);
    if (!rafOn.current) { rafOn.current = true; requestAnimationFrame(raf); }
    peekRef.current?.classList.add('show');
    peekArrowRef.current?.classList.add('show');
  }, [raf]);

  const peekOff = useCallback(() => {
    clearTimeout(lingerTimer.current);
    peekRef.current?.classList.remove('show');
    peekArrowRef.current?.classList.remove('show');
    rafOn.current = false;
  }, []);

  /* snap the star straight to the finger — no lerp lag on the first tap */
  const onDown = e => {
    if (e.target.closest('.nav,.down') || animating.current) return;
    if (env.isTouch) {
      const p = pos.current;
      p.tx = p.px = e.clientX;
      p.ty = p.py = e.clientY;
      peekOn();
    }
  };

  const onMove = e => {
    pos.current.tx = e.clientX;
    pos.current.ty = e.clientY;
    /* normal pointer over nav & the down arrow */
    if (e.target.closest('.nav,.down')) {
      peekOff();
      if (heroRef.current && !env.isTouch) heroRef.current.style.cursor = 'auto';
    } else {
      if (heroRef.current && !env.isTouch) heroRef.current.style.cursor = 'none';
      /* on touch, only follow while a finger is actually down */
      if (!env.isTouch || e.pressure > 0 || e.buttons > 0) peekOn();
    }
  };

  /* ── pointer up/leave ───────────────────────────────────────── */
  const onUp = () => {
    if (!env.isTouch) return;
    clearTimeout(lingerTimer.current);
    lingerTimer.current = setTimeout(peekOff, TOUCH_PEEK_LINGER);
  };

  /* ── click/tap → bloom the next slide from the pointer ───────── */
  const bloom = (x, y, rect) => {
    const reveal = revealRef.current;
    if (!reveal) return;
    if (!env.rm) revealVidRef.current?.play().catch(() => {});

    /* the inner star radius must clear the farthest corner */
    const maxDist = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y));
    const R = (maxDist / 0.45) * 1.08;

    peekOff();
    reveal.classList.add('go');
    reveal.style.transition = 'none';
    reveal.style.clipPath = starPoly(x, y, baseR.current, 0);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      reveal.style.transition = 'clip-path .85s cubic-bezier(.3,.7,.2,1)';
      reveal.style.clipPath = starPoly(x, y, R, 0.45);
      bloomTimer.current = setTimeout(() => {
        setCur(c => (c + 1) % N);
        reveal.classList.remove('go');
        revealVidRef.current?.pause();
        animating.current = false;
        schedule();                              // restart the clock after the bloom
      }, 880);
    }));
  };

  const onClick = e => {
    if (e.target.closest('.nav,.down') || animating.current) return;
    clearTimeout(autoTimer.current);            // manual advance resets the clock
    animating.current = true;

    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;

    /* on touch, let the star show for a beat before it blooms */
    if (env.isTouch) {
      clearTimeout(bloomTimer.current);
      bloomTimer.current = setTimeout(() => bloom(x, y, rect), TOUCH_PEEK_DELAY);
    } else {
      bloom(x, y, rect);
    }
  };

  const vidSrc = i => VIDEOS[i][Math.min(vidIdx[i], VIDEOS[i].length - 1)];
  const bumpVid = i => setVidIdx(a => a.map((v, k) => (k === i ? Math.min(v + 1, VIDEOS[i].length - 1) : v)));

  return (
    <div className="flh">
      <style>{CSS}</style>

      <header
        className="hero"
        ref={heroRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={peekOff}
        onPointerLeave={peekOff}
        onClick={onClick}
      >
        {/* NAV — links · logo · actions */}
        {/* <nav className="nav">
          <div className="nav-in">
            <div className="nav-left">
              <a href="#creators">Creators</a>
              <a href="#why">Features</a>
              <a href="#categories">Pricing</a>
              <a href="#">Resources</a>
              <a className="pill" href="#">Updates</a>
            </div>
            <a className="brand" href="#hero">
              <span className="tick" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M4.5 12.5l5 5 10-11" /></svg>
              </span>
              FAMEO
            </a>
            <div className="nav-right">
              <a className="pill" href="/search">
                <svg className="s-ico" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
                Find a Creator
              </a>
              <a className="pill" href="/login">Log in</a>
              <a className="pill solid" href="/register">Get Started</a>
            </div>
          </div>
        </nav> */}

        {/* SLIDES */}
        {SLIDES.map((s, i) => (
          <div key={i} className={`slide${i === cur ? ' active' : ''}`}>
            <div className="media">
              <ChainImg className="bgimg" chain={SLIDE_IMGS[i]} />
              <video
                ref={el => { slideVids.current[i] = el; }}
                src={vidSrc(i)}
                onError={() => bumpVid(i)}
                muted loop playsInline preload="metadata"
              />
            </div>
            <div className="shade" />
            <h1>
              <span className="row"><i>{s.rows[0]}</i></span>
              <span className="row"><i>{s.rows[1]}</i></span>
            </h1>
            <div className="cap">
              <ChainImg chain={AVATARS[i]} alt="Creator avatar" />
              <p><span>{s.cap}</span> →</p>
            </div>
          </div>
        ))}

        {/* click reveal overlay — always primed with the NEXT slide */}
        <div className="reveal" ref={revealRef}>
          <div className="media">
            <ChainImg chain={SLIDE_IMGS[next]} />
            <video ref={revealVidRef} src={vidSrc(next)} muted loop playsInline preload="metadata" />
          </div>
        </div>

        <button
          className="down"
          aria-label="Scroll down"
          onClick={e => {
            e.stopPropagation();
            window.scrollTo({ top: window.innerHeight, behavior: env.rm ? 'auto' : 'smooth' });
          }}
        >
          ↓
        </button>
        <span className="count">{String(cur + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</span>
      </header>

      {/* star peek — fixed window into the NEXT slide */}
      <div className="peek" ref={peekRef} aria-hidden="true">
        <div className="win">
          <ChainImg chain={SLIDE_IMGS[next]} />
          <video ref={peekVidRef} src={vidSrc(next)} muted loop playsInline preload="metadata" />
        </div>
      </div>
      <div className="peek-arrow" ref={peekArrowRef} aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
      </div>
    </div>
  );
}