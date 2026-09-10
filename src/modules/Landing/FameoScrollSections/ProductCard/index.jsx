'use client';


export default function ProductCard({ p, imgRef, hidden }) {
  return (
    <div style={hidden ? { visibility: 'hidden' } : undefined}>
      <div className="tss-card-img" ref={imgRef}>
        <img src={p.img} alt={p.title} loading="lazy" draggable={false} />
        {p.saved && (
          <span className="tss-card-save" aria-label="Saved">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff">
              <path d="M6 3h12v18l-6-4.5L6 21V3z" />
            </svg>
          </span>
        )}
        <button className="tss-card-plus" aria-label={`Add ${p.title}`}>+</button>
      </div>
      <div className="tss-card-title">{p.title}</div>
      <div className="tss-card-label">{p.label}</div>
    </div>
  );
}

/* ════ A. Intro statement + rail ═════════════════════════════════════════
   Each word owns a slice of the runway and lights up (opacity + rise) as
   the slice passes, so the statement reads itself into being while you
   scroll. Reversible — scroll back up and the words dim again.        */
