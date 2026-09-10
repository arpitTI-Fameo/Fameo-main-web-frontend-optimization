'use client';
// modules/Products/CollectionShowcase/hooks.js

import { useEffect, useRef } from 'react';

// Reveal children on scroll (fade + rise), staggered. Robust: reveals
// in-view items immediately and has a safety fallback so nothing gets stuck.
// Re-runs when `deps` change (e.g. when live products replace the initial set),
// otherwise newly-rendered cards would never be observed and stay hidden.
export function useReveal(deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll('[data-reveal]'));
    const reveal = (el) => el.classList.add('is-in');

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      targets.forEach(reveal);
      return;
    }

    // Reveal anything already within (or near) the viewport right away.
    const vh = window.innerHeight || 800;
    targets.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 1.1) reveal(el);
    });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    targets.forEach((el) => { if (!el.classList.contains('is-in')) io.observe(el); });

    // Safety net: if anything is still hidden shortly after, just show it.
    const t = setTimeout(() => targets.forEach(reveal), 1400);

    return () => { io.disconnect(); clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}
