'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { clamp01 } from './utils';

export function useRunwayProgress(ref) {
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

export function useViewport() {
  const [v, setV] = useState({ vw: 1440, vh: 800 });
  useEffect(() => {
    const size = () => setV({ vw: window.innerWidth, vh: window.innerHeight });
    size();
    window.addEventListener('resize', size);
    return () => window.removeEventListener('resize', size);
  }, []);
  return v;
}

export function useIsMobile(bp = 900) {
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
