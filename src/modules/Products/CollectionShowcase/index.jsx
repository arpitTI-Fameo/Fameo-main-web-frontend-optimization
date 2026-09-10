'use client';
// modules/Products/CollectionShowcase/index.jsx
// Premium editorial sections shown right after the video hero:
//   1) "Browse the categories" — full-bleed image tiles, cinematic hover zoom
//   2) "Explore the Collection" — airy product grid from live products,
//      scroll-reveal stagger + hover image crossfade
//
// Keeps the site's Cormorant Garamond / Jost / rose identity, elevated with
// whitespace and slow, deliberate motion. Respects prefers-reduced-motion.

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PRODUCT_CATEGORIES } from '@/constants/megaMenu';
import PlanPrice from '../PlanPrice';

import { CATEGORY_IMAGES } from './constants';
import { slugify } from './helpers';
import { useReveal } from './hooks';
import { CSS } from './styles';

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
