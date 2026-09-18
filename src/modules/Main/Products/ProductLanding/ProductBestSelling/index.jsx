'use client';
// modules/Main/Products/ProductLanding/ProductBestSelling/index.jsx
// Landing best-seller strip — a fanned carousel.
// Five cards in an arc: the pair either side of the centre stands tallest and
// tilts outward, the centre card is pushed down in front with the price + bag
// button, and the outer pair is shortest. Nothing is dimmed. Category tabs
// filter the strip, arrows / drag / arrow-keys move it, and the ring is circular.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ArrowIcon, BagIcon } from './icons';
import {
  BEST_SELLING_ALL_TAB,
  BEST_SELLING_FALLBACK_IMAGE,
  BEST_SELLING_HEADER,
  BEST_SELLING_LIMIT,
  BEST_SELLING_NARROW_BP,
  BEST_SELLING_SPAN,
  BEST_SELLING_SPAN_NARROW,
  BEST_SELLING_SWIPE,
} from './constants';
import { S } from './styles';
import ProductHeading from '../ProductHeading';

// Signed shortest distance from the active index to index i, on a ring of n.
const offsetOf = (i, active, n) => {
  let d = (((i - active) % n) + n) % n;
  if (d > n / 2) d -= n;
  return d;
};

const priceLabel = (v) =>
  v == null || v === '' ? null : `${Number(v).toLocaleString('en-US')}$`;

const imageOf = (p) =>
  p.thumb || p.image || p.images?.[0] || BEST_SELLING_FALLBACK_IMAGE;

/**
 * Props
 *  products      Product[]        – already-ranked list; trimmed to the limit
 *  header        { title }
 *  onProductClick (p) => void     – open the product detail overlay
 *  onAddToCart    (p, el) => void – el is handed to flyToCart for the arc
 */
export default function ProductBestSelling({
  products = [],
  header = BEST_SELLING_HEADER,
  onProductClick,
  onAddToCart,
}) {
  const pool = useMemo(
    () => products.slice(0, BEST_SELLING_LIMIT),
    [products]
  );

  // Tabs come from the products themselves — "All" first so the strip is full.
  const tabs = useMemo(() => {
    const seen = [];
    pool.forEach((p) => {
      if (p.category && !seen.includes(p.category)) seen.push(p.category);
    });
    return seen.length > 1 ? [BEST_SELLING_ALL_TAB, ...seen] : [];
  }, [pool]);

  const [tab, setTab] = useState(BEST_SELLING_ALL_TAB);
  const [active, setActive] = useState(0);
  const [wraps, setWraps] = useState([]);
  const [narrow, setNarrow] = useState(false);
  const stageRef = useRef(null);
  const drag = useRef(null);

  const items = useMemo(
    () =>
      tab === BEST_SELLING_ALL_TAB
        ? pool
        : pool.filter((p) => p.category === tab),
    [pool, tab]
  );

  const n = items.length;
  const span = Math.min(
    narrow ? BEST_SELLING_SPAN_NARROW : BEST_SELLING_SPAN,
    Math.max(0, Math.floor((n - 1) / 2))
  );

  // One card less on phones — three overlapping cards read better than five.
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${BEST_SELLING_NARROW_BP}px)`);
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // A card that crosses the seam would otherwise fly the full width of the
  // strip. Mark it for one frame so it teleports and fades in instead.
  const goTo = useCallback(
    (next) => {
      if (!n) return;
      const target = ((next % n) + n) % n;
      if (target === active) return;
      const shift = offsetOf(target, active, n);
      setWraps(
        items
          .filter(
            (_, i) =>
              offsetOf(i, target, n) - offsetOf(i, active, n) !== -shift
          )
          .map((p) => p.id)
      );
      setActive(target);
    },
    [active, items, n]
  );

  useEffect(() => {
    if (!wraps.length) return undefined;
    const raf = requestAnimationFrame(() => setWraps([]));
    return () => cancelAnimationFrame(raf);
  }, [wraps]);

  const step = useCallback((dir) => goTo(active + dir), [active, goTo]);

  const pickTab = (t) => {
    setTab(t);
    setActive(0);
    setWraps([]);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  };

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag.current = { x: e.clientX, done: false };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d || d.done) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) < BEST_SELLING_SWIPE) return;
    d.done = true;
    step(dx < 0 ? 1 : -1);
  };

  const endDrag = () => { drag.current = null; };

  // Hand the card root to flyToCart so it can find the <img> to arc into the bag.
  const add = (e, p) => {
    e.stopPropagation();
    onAddToCart?.(p, e.currentTarget.closest('.bsp-card') || e.currentTarget);
  };

  if (!n) return null;

  const visible = [];
  for (let o = -span; o <= span; o += 1) {
    visible.push({ offset: o, product: items[(((active + o) % n) + n) % n] });
  }

  return (
    <>
      <style>{S}</style>
      <section className="bsp-wrap" aria-label={header.title}>
        <header className="bsp-head">
          <ProductHeading title={header.title} />

          {!!tabs.length && (
            <div className="bsp-tabs" role="tablist" aria-label="Bestseller categories">
              {tabs.map((t, i) => (
                <span className="bsp-tabcell" key={t}>
                  {i > 0 && <span className="bsp-sep" aria-hidden="true">/</span>}
                  <button
                    type="button"
                    role="tab"
                    aria-selected={t === tab}
                    className={`bsp-tab${t === tab ? ' is-on' : ''}`}
                    onClick={() => pickTab(t)}
                  >
                    {t}
                  </button>
                </span>
              ))}
            </div>
          )}
        </header>

        <div
          className="bsp-stage"
          ref={stageRef}
          role="group"
          tabIndex={0}
          aria-roledescription="carousel"
          aria-label={`${header.title} products`}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
        >
          <div className="bsp-rail" key={tab}>
            {visible.map(({ offset, product: p }) => {
              const centre = offset === 0;
              const now = priceLabel(p.price);
              const was = priceLabel(p.original);
              return (
                <article
                  key={p.id}
                  className={`bsp-card${centre ? ' is-on' : ''}`}
                  data-d={Math.abs(offset)}
                  data-side={offset < 0 ? 'l' : offset > 0 ? 'r' : undefined}
                  data-wrap={wraps.includes(p.id) ? '1' : undefined}
                  role="button"
                  tabIndex={centre ? 0 : -1}
                  aria-hidden={centre ? undefined : 'true'}
                  aria-label={p.name}
                  onClick={() => (centre ? onProductClick?.(p) : goTo(active + offset))}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter' && e.key !== ' ') return;
                    e.preventDefault();
                    e.stopPropagation();
                    if (centre) onProductClick?.(p);
                    else goTo(active + offset);
                  }}
                >
                  <img className="bsp-img" src={imageOf(p)} alt={p.name} loading="lazy" draggable="false" />
                  <span className="bsp-shade" aria-hidden="true" />

                  <div className="bsp-meta">
                    <h3 className="bsp-name">{p.name}</h3>
                    {centre && now && (
                      <p className="bsp-price">
                        {now}
                        {was && <s className="bsp-was">{was}</s>}
                      </p>
                    )}
                  </div>

                  {centre && (
                    <button
                      type="button"
                      className="bsp-bag"
                      onClick={(e) => add(e, p)}
                      aria-label={`Add ${p.name} to bag`}
                    >
                      <BagIcon />
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        <div className="bsp-nav">
          <button
            type="button"
            className="bsp-arrow"
            onClick={() => step(-1)}
            aria-label="Previous product"
          >
            <ArrowIcon dir="left" />
          </button>
          <button
            type="button"
            className="bsp-arrow is-next"
            onClick={() => step(1)}
            aria-label="Next product"
          >
            <ArrowIcon />
          </button>
        </div>
      </section>
    </>
  );
}
