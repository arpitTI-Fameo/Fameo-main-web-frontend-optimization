'use client';

import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '../hooks';
import { SHARED_PRODUCT } from '../constants';
import CollectionPanel from '../CollectionPanel';
import IntroRail from '../IntroRail';
import { clamp01, lerp, easeInOut } from '../utils';

export default function IntroToGrid() {
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
