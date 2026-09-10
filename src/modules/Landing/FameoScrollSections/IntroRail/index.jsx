'use client';

import { useRef } from 'react';
import { useRunwayProgress, useIsMobile } from '../hooks';
import { RAIL_CARDS, INTRO_WORDS } from '../constants';
import ProductCard from '../ProductCard';
import { clamp01, lerp, easeInOut, seg } from '../utils';

export default function IntroRail({ sharedImgRef, sharedHidden }) {
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
