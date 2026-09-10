'use client';

import { useEffect, useRef, useState } from 'react';
import { useRunwayProgress, useViewport, useIsMobile } from '../hooks';
import { COLLECTIONS } from '../constants';
import { clamp01, lerp, easeInOut, seg } from '../utils';

export default function ZoomDiscover() {
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
