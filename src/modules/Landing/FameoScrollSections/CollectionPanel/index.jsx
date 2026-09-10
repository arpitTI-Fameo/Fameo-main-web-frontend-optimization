'use client';

import { GRID_PRODUCTS } from '../constants';
import ProductCard from '../ProductCard';

export default function CollectionPanel({ sharedImgRef, sharedHidden }) {
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
