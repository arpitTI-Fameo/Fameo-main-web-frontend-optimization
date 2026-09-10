'use client';

import { useEffect, useRef, useState } from 'react';
import { KINETIC_BANDS, GROW_STAR, TASTE_DOODLES } from '../constants';
import { clamp01 } from '../utils';

export default function KineticBands() {
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
