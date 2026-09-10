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
import { CSS } from './styles';
import { POOL, F_SLOTS, GROW_MS, EXIT_MS, EASE, IDLE_POLL_MS } from './constants';
import SlotStack from './SlotStack';

// ─── Image pool — editorial mix (people, products, food, art) ────────────────
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
