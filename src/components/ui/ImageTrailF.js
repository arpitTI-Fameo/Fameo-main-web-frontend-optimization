'use client';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  <ImageTrailF />  —  F-shaped image cluster that follows the cursor
 *
 *  Exact mechanic from the reference recording / screenshot:
 *
 *  • The cluster keeps a PERMANENT F SHAPE — every slot is ALWAYS occupied.
 *    The structure is never disturbed: when an image's turn ends, a NEW image
 *    GROWS OVER IT (small → big) in the same slot, covering the old one.
 *    The old image is removed only after it's fully covered — so there is
 *    never a gap, never a hole in the shape.
 *  • This replacement churn runs non-stop at a FAST PACE, staggered across
 *    slots, so several new images are always growing somewhere in the F.
 *  • The WHOLE intact F follows the cursor (left ↔ right, anywhere) as one
 *    unit with a smooth eased lag — the shape moves, it doesn't scatter.
 *
 *  Zero dependencies — pure React + CSS + requestAnimationFrame.
 *
 *  Usage:  import ImageTrailF from '@/components/ui/ImageTrailF';
 *          <ImageTrailF />
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  PERFORMANCE NOTES (this revision — the look is byte-for-byte unchanged):
 *
 *  • The churn used to run forever from mount. 15 slots × a new remote image
 *    every 450–1050ms is ~20 image loads a second, continuing while the
 *    section is far off screen and while the tab is in the background. It now
 *    pauses when the section leaves the viewport and when the tab is hidden,
 *    and resumes exactly where it was. On screen, nothing about the timing,
 *    the stagger or the animation changes.
 *  • The cursor-follow rAF loop ran on every device, but only `mousemove` was
 *    ever bound — on a phone it burned a frame callback forever to move
 *    nothing. It's skipped entirely on coarse pointers, where the cluster now
 *    simply sits at its centred resting position (the same place it sat
 *    before, since the target never moved).
 *  • `min-height` gains an `svh` companion so the section doesn't resize as
 *    mobile browsers show and hide the address bar.
 */

import React, { useState, useEffect, useRef } from 'react';

// ─── Image pool — editorial mix (people, products, food, art) ────────────────
const POOL = [
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=520&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=520&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=520&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=520&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=520&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=520&q=80',
  'https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?w=520&q=80',
  'https://images.unsplash.com/photo-1495805442109-bf1cf975750b?w=520&q=80',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=520&q=80',
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=520&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=520&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=520&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=520&q=80',
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=520&q=80',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=520&q=80',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=520&q=80',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=520&q=80',
  'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=520&q=80',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=520&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=520&q=80',
];

// ─── Fixed F-shaped slot map (offsets from cluster center = cursor) ──────────
// Big tiles form the F (spine + two arms, overlapping like the screenshot),
// tiny satellites blink at the fringes. rate = [min,max] ms between the
// arrival of each NEW covering image in that slot (lower = faster churn).
const F_SLOTS = [
  // spine (top → bottom) — large overlapping tiles
  { dx: -110, dy: -165, w: 150, h: 175, z: 5, rate: [600, 1000] },
  { dx: -125, dy:  -45, w: 160, h: 170, z: 6, rate: [650, 1050] },
  { dx: -112, dy:   75, w: 148, h: 178, z: 5, rate: [600, 1000] },
  { dx: -122, dy:  190, w: 152, h: 165, z: 4, rate: [650, 1050] },
  // top arm (left → right)
  { dx:    5, dy: -175, w: 132, h: 115, z: 4, rate: [550,  900] },
  { dx:  115, dy: -168, w: 112, h: 130, z: 3, rate: [550,  900] },
  { dx:  205, dy: -175, w:  90, h:  80, z: 2, rate: [520,  850] },
  // middle arm (left → right)
  { dx:    0, dy:  -50, w: 122, h: 138, z: 4, rate: [550,  900] },
  { dx:  100, dy:  -58, w: 100, h:  86, z: 3, rate: [520,  850] },
  // tiny satellites — quick blinking thumbs at the fringes
  { dx: -230, dy: -230, w: 40, h: 32, z: 1, rate: [450,  750] },
  { dx:  260, dy: -110, w: 34, h: 40, z: 1, rate: [450,  750] },
  { dx:  -55, dy:  120, w: 36, h: 44, z: 1, rate: [450,  750] },
  { dx:  -70, dy:  285, w: 38, h: 30, z: 1, rate: [450,  750] },
  { dx:   55, dy:  110, w: 32, h: 38, z: 1, rate: [450,  750] },
  { dx: -245, dy:  120, w: 36, h: 28, z: 1, rate: [450,  750] },
];

const GROW_MS = 340; // enter-from-right grow duration (matches CSS .34s)
const EXIT_MS = 380; // exit-to-left shrink duration (matches CSS .38s)
const EASE    = 0.09; // cursor-follow lag (lower = lazier)

// How long to wait before re-checking whether the section came back on screen.
const IDLE_POLL_MS = 700;

const CSS = `
.ftrail-section{
  position:relative;min-height:92vh;overflow:hidden;
  background:var(--ivory,#FAF6F0);
  display:flex;align-items:center;justify-content:center;
  cursor:default;
}
/* stable on mobile while the address bar shows/hides — ignored by browsers
   that don't support svh, which keep the 92vh above */
@supports (height: 100svh){
  .ftrail-section{min-height:92svh;}
}

/* ── Fixed centered headline (cluster floats over it) ─────────── */
.ftrail-copy{
  position:relative;z-index:1;text-align:center;
  padding:0 24px;pointer-events:none;
}
.ftrail-h2{
  font-family:'Outfit','DM Sans',sans-serif;
  font-size:clamp(28px,3.4vw,52px);font-weight:500;
  color:var(--ink,#1a0a1e);line-height:1.3;letter-spacing:-.01em;
}
.ftrail-pill{
  display:inline-block;padding:0 22px 4px;
  border:2px solid var(--ink,#1a0a1e);border-radius:60px;
  line-height:1.25;
}

/* ── Cluster anchor — JS moves it toward the cursor ───────────── */
.ftrail-cluster{
  position:absolute;top:0;left:0;z-index:2;
  width:0;height:0;pointer-events:none;
  will-change:transform;
}

/* ── Slot — permanent, never empty, holds stacked image layers ── */
.ftrail-slot{
  position:absolute;overflow:hidden;border-radius:3px;
  transform:translate(-50%,-50%);
  background:#e9e2d8;
  box-shadow:0 10px 28px rgba(21,5,32,.10);
}
.ftrail-layer{
  position:absolute;inset:0;
  will-change:transform,opacity;
}
.ftrail-layer img{width:100%;height:100%;object-fit:cover;display:block;}
/* NEW image: starts at the RIGHT, small → grows while moving LEFT to center.
   The layer below stays full-size until covered, so the F never breaks. */
.ftrail-layer.grow{
  animation:ftrailGrowRL .34s cubic-bezier(.25,.9,.4,1) both;
}
/* OLD image: continues the journey — shrinks while sliding out to the LEFT.
   Together: every image visibly travels right → left, growing then shrinking. */
.ftrail-layer.exit{
  animation:ftrailExitL .38s cubic-bezier(.5,0,.75,.4) both;
}
@keyframes ftrailGrowRL{
  0%   {opacity:0;transform:translateX(42%) scale(.18);}
  16%  {opacity:1;}
  100% {opacity:1;transform:translateX(0) scale(1);}
}
@keyframes ftrailExitL{
  0%   {opacity:1;transform:translateX(0) scale(1);}
  100% {opacity:0;transform:translateX(-48%) scale(.15);}
}

@media(prefers-reduced-motion:reduce){
  .ftrail-layer.grow,.ftrail-layer.exit{animation-duration:.01s;}
}
/* smaller F — global shape scale */
.ftrail-scale{transform:scale(.68);}
@media(max-width:1024px){
  .ftrail-scale{transform:scale(.55);}
}
@media(max-width:600px){
  .ftrail-scale{transform:scale(.42);}
}
`;

let uid = 0;

// ─── One slot: always occupied; new images keep growing over old ────────
// `activeRef` is a shared { current: boolean } owned by the section. When it
// flips false (section off screen or tab hidden) the slot stops pulling new
// images and just re-checks periodically. The rendered stack is left exactly
// as it is, so resuming looks like the churn never stopped.
function SlotStack({ slot, index, activeRef }) {
  // stack bottom→top; bottom = current full-size image, top = incoming grower
  const [stack, setStack] = useState(() => [
    { id: ++uid, src: POOL[(index * 3) % POOL.length], phase: 'still' },
  ]);

  useEffect(() => {
    let alive = true;
    const timers = new Set();
    const t = (fn, ms) => {
      const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
      timers.add(id);
      return id;
    };
    const [min, max] = slot.rate;
    let poolCursor = index * 3;

    const cycle = () => {
      if (!alive) return;

      // Paused: don't fetch anything, just check back shortly.
      if (activeRef && !activeRef.current) {
        t(cycle, IDLE_POLL_MS);
        return;
      }

      poolCursor = (poolCursor + 7 + Math.floor(Math.random() * 5)) % POOL.length;
      const layer = { id: ++uid, src: POOL[poolCursor], phase: 'grow' };

      // new image enters from the RIGHT (growing) while the current one
      // starts its EXIT to the LEFT (shrinking) — right→left travel feel,
      // and the slot is never empty so the F shape holds.
      setStack(s => [
        ...s.map(l => (l.phase !== 'exit' ? { ...l, phase: 'exit' } : l)),
        layer,
      ].slice(-3));

      // remove exited layers once their slide-out finishes
      t(() => {
        if (!alive) return;
        setStack(s => {
          const kept = s.filter(l => l.phase !== 'exit');
          return kept.length ? kept : s.slice(-1);
        });
      }, EXIT_MS + 60);

      // schedule the next image — fast, randomized, non-stop
      t(cycle, min + Math.random() * (max - min));
    };

    // staggered start so slots churn out of sync (organic, like the video)
    t(cycle, 200 + index * 130 + Math.random() * 400);

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, [index, slot.rate, activeRef]);

  return (
    <div
      className="ftrail-slot"
      style={{
        left: slot.dx,
        top: slot.dy,
        width: slot.w,
        height: slot.h,
        zIndex: slot.z,
      }}
    >
      {stack.map(layer => (
        <div key={layer.id} className={`ftrail-layer ${layer.phase === 'grow' ? 'grow' : layer.phase === 'exit' ? 'exit' : ''}`}>
          <img src={layer.src} alt="" loading="lazy" decoding="async" draggable={false} />
        </div>
      ))}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function ImageTrailF() {
  const sectionRef = useRef(null);
  const clusterRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const pos    = useRef({ x: 0, y: 0 });
  const raf    = useRef(0);

  // Shared on/off switch for the image churn. Starts true so the very first
  // paint behaves exactly as before if IntersectionObserver is unavailable.
  const activeRef = useRef(true);

  // ── Pause the churn when off screen or in a background tab ────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let onScreen = true;
    const sync = () => {
      activeRef.current = onScreen && !document.hidden;
    };

    let io;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        ([entry]) => { onScreen = entry.isIntersecting; sync(); },
        { rootMargin: '300px 0px' }   // wake up just before it scrolls in
      );
      io.observe(section);
    }

    const onVisibility = () => sync();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      activeRef.current = true;
    };
  }, []);

  // ── Cursor follow — desktop pointers only ─────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const cluster = clusterRef.current;
    if (!section || !cluster) return;

    const r0 = section.getBoundingClientRect();
    pos.current    = { x: r0.width / 2, y: r0.height / 2 };
    target.current = { ...pos.current };

    // Park the cluster at its resting position straight away. On touch this
    // is where it always sat anyway, since nothing ever moved the target.
    cluster.style.transform =
      `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;

    // No pointer to follow → no listeners, no animation frame loop at all.
    const coarse = typeof matchMedia === 'function'
      && matchMedia('(pointer: coarse)').matches;
    if (coarse) return;

    const onMove = (e) => {
      const r = section.getBoundingClientRect();
      target.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => {
      const r = section.getBoundingClientRect();
      target.current = { x: r.width / 2, y: r.height / 2 };
    };

    // the WHOLE intact F follows the cursor — eased, structure preserved
    const tick = () => {
      // off screen: skip the maths, keep the loop cheap
      if (activeRef.current) {
        pos.current.x += (target.current.x - pos.current.x) * EASE;
        pos.current.y += (target.current.y - pos.current.y) * EASE;
        cluster.style.transform =
          `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      raf.current = requestAnimationFrame(tick);
    };

    section.addEventListener('mousemove', onMove, { passive: true });
    section.addEventListener('mouseleave', onLeave);
    raf.current = requestAnimationFrame(tick);

    return () => {
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <section className="ftrail-section" ref={sectionRef}>
      <style>{CSS}</style>

      {/* Fixed headline — the F floats over it */}
      <div className="ftrail-copy">
        <h2 className="ftrail-h2">
          No algorithms. No ads. No overwhelm.<br />
          Just great curation by{' '}
          <span className="ftrail-pill">real people.</span>
        </h2>
      </div>

      {/* Intact F cluster — follows cursor; slots never empty */}
      <div className="ftrail-cluster" ref={clusterRef} aria-hidden="true">
        <div className="ftrail-scale" style={{ position: 'absolute' }}>
          {F_SLOTS.map((slot, i) => (
            <SlotStack key={i} slot={slot} index={i} activeRef={activeRef} />
          ))}
        </div>
      </div>
    </section>
  );
}