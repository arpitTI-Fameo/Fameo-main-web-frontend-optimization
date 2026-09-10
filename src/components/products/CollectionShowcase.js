'use client';
// components/products/CollectionShowcase.jsx
// Premium editorial sections shown right after the video hero:
//   1) "Browse the categories" — full-bleed image tiles, cinematic hover zoom
//   2) "Explore the Collection" — airy product grid from live products,
//      scroll-reveal stagger + hover image crossfade
//
// Keeps the site's Cormorant Garamond / Jost / rose identity, elevated with
// whitespace and slow, deliberate motion. Respects prefers-reduced-motion.

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { inr } from '@/lib/formatCurrency';
import { PRODUCT_CATEGORIES } from '@/constants/megaMenu';
import PlanPrice from '@/components/products/PlanPrice';

// Category → representative image (kept consistent with ShopSection's tiles)
const CATEGORY_IMAGES = {
  Cameras:          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&q=80',
  Lenses:           'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=900&q=80',
  'Bags & Tripods': 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=900&q=80',
  Lighting:         'https://images.unsplash.com/photo-1627483262769-04d0a1401487?w=900&q=80',
  Gimbals:          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80',
  Audio:            'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=900&q=80',
  Accessories:      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=900&q=80',
};

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Reveal children on scroll (fade + rise), staggered. Robust: reveals
// in-view items immediately and has a safety fallback so nothing gets stuck.
// Re-runs when `deps` change (e.g. when live products replace the initial set),
// otherwise newly-rendered cards would never be observed and stay hidden.
function useReveal(deps = []) {
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

export default function CollectionShowcase({ products = [], onProductClick, onAddToCart }) {
  // Per-card confirmation — the Add button called onAddToCart and stayed
  // visually identical, so the click read as a no-op.
  const [added, setAdded] = useState({});
  const addTimers = useRef({});

  const handleAdd = (p, e) => {
    const res = onAddToCart?.(p, e?.currentTarget?.closest('.cs-card') || e?.currentTarget);
    if (res?.ok === false) return;
    setAdded((s) => ({ ...s, [p.id]: true }));
    clearTimeout(addTimers.current[p.id]);
    addTimers.current[p.id] = setTimeout(
      () => setAdded((s) => { const n = { ...s }; delete n[p.id]; return n; }),
      1500
    );
  };

  useEffect(() => () => Object.values(addTimers.current).forEach(clearTimeout), []);
  const router = useRouter();

  const categories = PRODUCT_CATEGORIES.filter((c) => c !== 'All');
  const featured = products.slice(0, 8);
  // Re-scan reveal targets whenever the product set changes (mock → live),
  // otherwise the freshly-rendered cards never get observed and stay hidden.
  const rootRef = useReveal([featured.map((p) => p.id).join('|')]);

  return (
    <div className="cs-root" ref={rootRef}>
      <style>{CSS}</style>

      {/* ── Section 1 · Categories ─────────────────────────────── */}
      <section className="cs-cat" aria-labelledby="cs-cat-title">
        <header className="cs-head">
          <p className="cs-eyebrow" data-reveal>The Store</p>
          <h2 id="cs-cat-title" className="cs-title" data-reveal>
            Browse by <em>category</em>
          </h2>
          <p className="cs-lede" data-reveal>
            Every piece a working creator reaches for — grouped the way you shop.
          </p>
        </header>

        <div className="cs-tiles" role="list">
          {categories.map((cat, i) => (
            <button
              key={cat}
              role="listitem"
              className="cs-tile"
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
              onClick={() => router.push(`/products/${slugify(cat)}`)}
              aria-label={`Browse ${cat}`}
            >
              <span className="cs-tile-img-wrap">
                <img
                  className="cs-tile-img"
                  src={CATEGORY_IMAGES[cat] || CATEGORY_IMAGES.Cameras}
                  alt={cat}
                  loading="lazy"
                />
                <span className="cs-tile-scrim" aria-hidden="true" />
                <span className="cs-tile-index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </span>
              <span className="cs-tile-label">
                {cat}
                <span className="cs-tile-rule" aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Section 2 · Collection grid ────────────────────────── */}
      <section className="cs-coll" aria-labelledby="cs-coll-title">
        <header className="cs-head cs-head-center">
          <p className="cs-eyebrow" data-reveal>Curated</p>
          <h2 id="cs-coll-title" className="cs-title" data-reveal>
            Explore the <em>Collection</em>
          </h2>
        </header>

        {featured.length === 0 ? (
          <p className="cs-empty" data-reveal>New pieces are on their way.</p>
        ) : (
          <div
            className="cs-grid"
            style={{
              gridTemplateColumns: `repeat(${Math.min(featured.length, 4)}, minmax(0, 1fr))`,
              maxWidth: featured.length < 4 ? `${featured.length * 340}px` : undefined,
            }}
          >
            {featured.map((p, i) => {
              const alt = p.images?.[1] || p.thumb || p.image;
              const isNew = p.tag === 'New' || p.tag === 'Bestseller';
              const code = (p.brand || p.subcategory || p.category || '').toString().toUpperCase();
              return (
                <article
                  key={p.id || i}
                  className="cs-card"
                  data-reveal
                  style={{ transitionDelay: `${(i % 4) * 80}ms` }}
                >
                  <button
                    className="cs-card-media"
                    onClick={() => onProductClick?.(p)}
                    aria-label={`View ${p.name}`}
                  >
                    {isNew && <span className="cs-badge">New</span>}
                    <img className="cs-card-img base" src={p.thumb || p.image} alt={p.name} loading="lazy" />
                    {alt && alt !== (p.thumb || p.image) && (
                      <img className="cs-card-img alt" src={alt} alt="" aria-hidden="true" loading="lazy" />
                    )}
                    <span className="cs-card-quick" aria-hidden="true">View</span>
                  </button>

                  <div className="cs-card-body">
                    {code && <p className="cs-card-code">{code}</p>}
                    <h3 className="cs-card-name" onClick={() => onProductClick?.(p)}>{p.name}</h3>
                    <div className="cs-card-foot">
                      <span className="cs-card-price"><PlanPrice price={p.price} showUpsell={false} /></span>
                      <button
                        className="cs-card-add"
                        onClick={(e) => handleAdd(p, e)}
                        aria-label={`Add ${p.name} to bag`}
                        style={added[p.id] ? { background: '#2eaa68', borderColor: '#2eaa68', color: '#fff' } : undefined}
                      >
                        {added[p.id] ? 'Added ✓' : 'Add'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

.cs-root{
  --paper:#FBFAF7; --ink:#14131A; --muted:#8B8792; --line:#E9E5DE;
  --rose:#E8405A; --deep:#131218;
  --grad-btn:linear-gradient(135deg,#FFC98F 20%,#DD8164 58%,#D45A79 88%);
  --accent:#DD8164; --accent-deep:#D45A79;
  background:var(--paper); color:var(--ink);
  font-family:'Jost',sans-serif;
}
.cs-root *{box-sizing:border-box;}

/* motion primitive */
[data-reveal]{opacity:0;transform:translateY(22px);transition:opacity .9s cubic-bezier(.22,1,.36,1),transform .9s cubic-bezier(.22,1,.36,1);}
[data-reveal].is-in{opacity:1;transform:none;}
@media (prefers-reduced-motion: reduce){
  [data-reveal]{opacity:1 !important;transform:none !important;transition:none !important;}
}

/* headings */
.cs-head{padding:0 clamp(20px,5vw,64px);margin:0 auto clamp(28px,4vw,48px);max-width:1500px;}
.cs-head-center{text-align:center;}
.cs-eyebrow{font-size:10px;font-weight:500;letter-spacing:.34em;text-transform:uppercase;margin:0 0 14px;background:var(--grad-btn);-webkit-background-clip:text;background-clip:text;color:transparent;}
.cs-title{font-family:'Cormorant Garamond',serif;font-weight:300;font-size:clamp(34px,5.2vw,64px);line-height:1;letter-spacing:-.01em;margin:0;color:var(--ink);}
.cs-title em{font-style:italic;background:var(--grad-btn);-webkit-background-clip:text;background-clip:text;color:transparent;}
.cs-lede{margin:16px 0 0;max-width:34rem;color:var(--muted);font-size:14px;font-weight:300;line-height:1.7;}

/* ── categories ── */
.cs-cat{padding:clamp(56px,8vw,110px) 0 clamp(40px,5vw,64px);}
.cs-tiles{
  display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:2px;padding:0 2px;
}
.cs-tile{
  position:relative;display:flex;flex-direction:column;gap:16px;
  background:none;border:none;padding:0 0 8px;cursor:pointer;text-align:left;
  font-family:inherit;color:inherit;
}
.cs-tile-img-wrap{
  position:relative;overflow:hidden;width:100%;
  aspect-ratio:3/4;background:#e7e2da;
}
.cs-tile-img{
  width:100%;height:100%;object-fit:cover;display:block;
  transform:scale(1.001);
  transition:transform 1.25s cubic-bezier(.19,1,.22,1),filter .6s ease;
  filter:saturate(.96);
}
.cs-tile:hover .cs-tile-img,
.cs-tile:focus-visible .cs-tile-img{transform:scale(1.08);filter:saturate(1.04);}
.cs-tile-scrim{position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(19,18,24,.28));opacity:0;transition:opacity .6s ease;pointer-events:none;}
.cs-tile:hover .cs-tile-scrim{opacity:1;}
.cs-tile-index{
  position:absolute;top:14px;left:16px;z-index:2;
  font-family:'Jost',sans-serif;font-size:10px;font-weight:500;letter-spacing:.2em;
  color:#fff;mix-blend-mode:difference;opacity:.85;
}
.cs-tile-label{
  position:relative;display:inline-flex;flex-direction:column;gap:8px;
  padding:0 16px;font-family:'Cormorant Garamond',serif;font-weight:400;
  font-size:clamp(20px,1.7vw,26px);letter-spacing:.01em;color:var(--ink);
  transition:color .3s ease;
}
.cs-tile:hover .cs-tile-label{color:var(--accent-deep);}
.cs-tile-rule{height:2px;width:22px;background:var(--grad-btn);transition:width .5s cubic-bezier(.19,1,.22,1);}
.cs-tile:hover .cs-tile-rule,
.cs-tile:focus-visible .cs-tile-rule{width:64px;}
.cs-tile:focus-visible{outline:2px solid var(--rose);outline-offset:3px;}

/* ── collection grid ── */
.cs-coll{padding:clamp(48px,7vw,96px) clamp(16px,4vw,56px) clamp(64px,9vw,120px);}
.cs-grid{
  max-width:1500px;margin:0 auto;
  display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(20px,2.4vw,40px);
}
.cs-card{display:flex;flex-direction:column;}
.cs-card-media{
  position:relative;display:block;width:100%;aspect-ratio:4/5;overflow:hidden;
  background:#F3F0EA;border:none;padding:0;cursor:pointer;border-radius:2px;
}
.cs-card-img{
  position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;
  transition:opacity .7s ease,transform 1.1s cubic-bezier(.19,1,.22,1);
}
.cs-card-img.alt{opacity:0;}
.cs-card:hover .cs-card-img.base{transform:scale(1.05);}
.cs-card:hover .cs-card-img.alt{opacity:1;transform:scale(1.05);}
.cs-badge{
  position:absolute;top:12px;left:12px;z-index:3;
  font-family:'Jost',sans-serif;font-size:9px;font-weight:500;letter-spacing:.22em;
  text-transform:uppercase;background:#fff;color:var(--ink);padding:5px 10px;border-radius:2px;
}
.cs-card-quick{
  position:absolute;left:50%;bottom:14px;transform:translate(-50%,14px);z-index:3;
  font-size:9px;font-weight:500;letter-spacing:.24em;text-transform:uppercase;
  background:var(--ink);color:#fff;padding:9px 20px;border-radius:2px;
  opacity:0;transition:opacity .4s ease,transform .4s cubic-bezier(.19,1,.22,1);
  pointer-events:none;
}
.cs-card:hover .cs-card-quick{opacity:1;transform:translate(-50%,0);}
.cs-card-body{padding:16px 2px 0;}
.cs-card-code{font-family:'Jost',sans-serif;font-size:10px;font-weight:500;letter-spacing:.14em;color:var(--muted);margin:0 0 8px;text-transform:uppercase;}
.cs-card-name{
  font-family:'Cormorant Garamond',serif;font-weight:400;font-size:20px;line-height:1.15;
  margin:0 0 12px;color:var(--ink);cursor:pointer;transition:color .25s ease;
}
.cs-card-name:hover{color:var(--accent-deep);}
.cs-card-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-top:12px;border-top:1px solid var(--line);}
.cs-card-price{font-family:'Cormorant Garamond',serif;font-size:19px;color:var(--ink);}
.cs-card-add{
  font-family:'Jost',sans-serif;font-size:9px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
  background:transparent;border:1px solid var(--ink);color:var(--ink);
  padding:8px 16px;border-radius:2px;cursor:pointer;
  transition:background .25s ease,color .25s ease,border-color .25s ease;
}
.cs-card-add:hover{background:var(--grad-btn);border-color:transparent;color:#fff;}
.cs-empty{text-align:center;color:var(--muted);font-size:14px;padding:40px 0;}

/* ── responsive ── */
@media (max-width:1080px){
  .cs-grid{grid-template-columns:repeat(2,1fr);}
}
@media (max-width:560px){
  .cs-tiles{grid-auto-flow:column;grid-auto-columns:74%;grid-template-columns:none;overflow-x:auto;scroll-snap-type:x mandatory;gap:12px;padding:0 16px 8px;}
  .cs-tile{scroll-snap-align:start;}
  .cs-grid{grid-template-columns:repeat(2,1fr);gap:16px;}
  .cs-card-name{font-size:17px;}
}
`;