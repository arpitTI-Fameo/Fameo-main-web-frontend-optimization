'use client';
// components/products/ProductFilters.js
// Sidebar / panel filters for the product grid.
// Props:
//   filters       — current filter state object
//   onChange      — (key, value) => void
//   onClear       — clears all filters
//   productCount  — number of results after filtering
//   categories    — array of category strings
//   brands        — array of brand strings

import { useState } from 'react';
import { PRODUCT_CATEGORIES, PRODUCT_BRANDS } from '@/constants/megaMenu';

const PRICE_RANGES = [
  { label: 'All Prices',        min: 0,    max: Infinity },
  { label: 'Under ₹16,800',    min: 0,    max: 200      },
  { label: '₹16,800 – ₹42,000',min: 200,  max: 500      },
  { label: '₹42,000 – ₹84,000',min: 500,  max: 1000     },
  { label: '₹84,000+',         min: 1000, max: Infinity  },
];

const SORT_OPTIONS = [
  { value: 'featured',    label: 'Featured'      },
  { value: 'price-asc',   label: 'Price: Low–High'},
  { value: 'price-desc',  label: 'Price: High–Low'},
  { value: 'rating',      label: 'Top Rated'     },
  { value: 'newest',      label: 'Newest'        },
];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  :root {
    --pf-rose:  #E8405A; --pf-ink: #111118;
    --pf-muted: #888898; --pf-line: #EEEEF2;
    --pf-surf:  #F7F7FA; --pf-white: #ffffff;
  }

  /* ── shell ── */
  .pf-wrap {
    width: 240px; flex-shrink: 0;
    border-right: 1px solid var(--pf-line);
    background: var(--pf-white);
    display: flex; flex-direction: column;
  }

  /* header */
  .pf-head {
    padding: 20px 22px 16px;
    border-bottom: 1px solid var(--pf-line);
    display: flex; align-items: center; justify-content: space-between;
  }
  .pf-head-title {
    font-family: 'Jost', sans-serif; font-size: 9px; font-weight: 500;
    letter-spacing: .28em; text-transform: uppercase; color: var(--pf-ink);
  }
  .pf-clear {
    font-family: 'Jost', sans-serif; font-size: 9px; font-weight: 300;
    letter-spacing: .12em; text-transform: uppercase;
    color: var(--pf-rose); background: none; border: none; cursor: pointer;
    padding: 0; transition: opacity .18s;
  }
  .pf-clear:hover { opacity: .7; }
  .pf-count {
    font-family: 'Cormorant Garamond', serif; font-size: 13px;
    font-weight: 300; color: var(--pf-muted);
    padding: 8px 22px 14px;
    border-bottom: 1px solid var(--pf-line);
  }
  .pf-count em { color: var(--pf-rose); font-style: normal; font-weight: 400; }

  /* section */
  .pf-section { border-bottom: 1px solid var(--pf-line); }
  .pf-section-head {
    width: 100%; padding: 14px 22px; display: flex; align-items: center;
    justify-content: space-between; background: none; border: none; cursor: pointer;
    font-family: 'Jost', sans-serif; font-size: 9px; font-weight: 500;
    letter-spacing: .22em; text-transform: uppercase; color: var(--pf-ink);
    transition: background .18s;
  }
  .pf-section-head:hover { background: var(--pf-surf); }
  .pf-chev {
    font-size: 8px; color: var(--pf-muted);
    transition: transform .22s; display: inline-block;
  }
  .pf-chev.open { transform: rotate(180deg); }
  .pf-section-body { padding: 4px 0 14px; }

  /* option rows */
  .pf-option {
    display: flex; align-items: center; gap: 10px;
    padding: 6px 22px; cursor: pointer;
    transition: background .15s;
  }
  .pf-option:hover { background: var(--pf-surf); }
  .pf-check {
    width: 14px; height: 14px; border: 1.5px solid var(--pf-line);
    border-radius: 2px; flex-shrink: 0; display: flex; align-items: center;
    justify-content: center; transition: border-color .15s, background .15s;
  }
  .pf-check.on { border-color: var(--pf-rose); background: var(--pf-rose); }
  .pf-check.on::after {
    content: '✓'; color: #fff; font-size: 8px; line-height: 1;
  }
  .pf-radio {
    width: 14px; height: 14px; border-radius: 50%;
    border: 1.5px solid var(--pf-line); flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: border-color .15s;
  }
  .pf-radio.on { border-color: var(--pf-rose); }
  .pf-radio.on::after {
    content: ''; width: 6px; height: 6px; border-radius: 50%;
    background: var(--pf-rose);
  }
  .pf-opt-label {
    font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 300;
    color: var(--pf-ink); letter-spacing: .03em; flex: 1;
  }

  /* sort select */
  .pf-select {
    width: calc(100% - 44px); margin: 6px 22px;
    padding: 8px 12px;
    font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 300;
    color: var(--pf-ink); background: var(--pf-surf);
    border: 1px solid var(--pf-line); border-radius: 3px; cursor: pointer;
    outline: none; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888898' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    transition: border-color .18s;
  }
  .pf-select:focus { border-color: var(--pf-rose); }

  /* toggle (in stock only) */
  .pf-toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 22px;
  }
  .pf-toggle-label {
    font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 300;
    color: var(--pf-ink);
  }
  .pf-toggle {
    width: 32px; height: 18px; border-radius: 9px;
    background: var(--pf-line); border: none; cursor: pointer; position: relative;
    transition: background .22s; flex-shrink: 0;
  }
  .pf-toggle.on { background: var(--pf-rose); }
  .pf-toggle::after {
    content: ''; position: absolute; top: 2px; left: 2px;
    width: 14px; height: 14px; border-radius: 50%; background: #fff;
    transition: transform .22s cubic-bezier(.22,1,.36,1);
  }
  .pf-toggle.on::after { transform: translateX(14px); }

  /* brands — show more/less */
  .pf-show-more {
    display: block; margin: 6px 22px 0;
    font-family: 'Jost', sans-serif; font-size: 9px; font-weight: 400;
    letter-spacing: .14em; text-transform: uppercase;
    color: var(--pf-rose); background: none; border: none; cursor: pointer; padding: 0;
    transition: opacity .18s;
  }
  .pf-show-more:hover { opacity: .7; }

  /* mobile collapsed */
  .pf-wrap.mobile-hidden { display: none; }
  @media (max-width: 900px) {
    .pf-wrap { width: 100%; border-right: none; border-bottom: 1px solid var(--pf-line); }
  }
`;

// Collapsible section
function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="pf-section">
      <button className="pf-section-head" onClick={() => setOpen((o) => !o)}>
        {title}
        <span className={`pf-chev${open ? ' open' : ''}`}>▾</span>
      </button>
      {open && <div className="pf-section-body">{children}</div>}
    </div>
  );
}

export default function ProductFilters({
  filters = {},
  onChange,
  onClear,
  productCount = 0,
}) {
  const {
    category    = 'all',
    brand       = null,
    priceRange  = 0,
    inStockOnly = false,
    sort        = 'featured',
  } = filters;

  const [showAllBrands, setShowAllBrands] = useState(false);
  const visibleBrands = showAllBrands ? PRODUCT_BRANDS : PRODUCT_BRANDS.slice(0, 8);

  const hasFilters = category !== 'all' || brand !== null || priceRange !== 0 || inStockOnly;

  return (
    <>
      <style>{S}</style>
      <aside className="pf-wrap" aria-label="Product filters">

        {/* Header */}
        <div className="pf-head">
          <span className="pf-head-title">Filters</span>
          {hasFilters && (
            <button className="pf-clear" onClick={onClear}>Clear all</button>
          )}
        </div>
        <p className="pf-count">
          <em>{productCount}</em> products
        </p>

        {/* Sort */}
        <Section title="Sort By">
          <select
            className="pf-select"
            value={sort}
            onChange={(e) => onChange('sort', e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Section>

        {/* Categories */}
        <Section title="Category">
          {['all', ...PRODUCT_CATEGORIES].map((cat) => (
            <div
              key={cat}
              className="pf-option"
              onClick={() => onChange('category', cat)}
              role="option"
              aria-selected={category === cat}
            >
              <div className={`pf-radio${category === cat ? ' on' : ''}`} />
              <span className="pf-opt-label">
                {cat === 'all' ? 'All Products' : cat}
              </span>
            </div>
          ))}
        </Section>

        {/* Price */}
        <Section title="Price Range">
          {PRICE_RANGES.map((pr, i) => (
            <div
              key={i}
              className="pf-option"
              onClick={() => onChange('priceRange', i)}
              role="option"
              aria-selected={priceRange === i}
            >
              <div className={`pf-radio${priceRange === i ? ' on' : ''}`} />
              <span className="pf-opt-label">{pr.label}</span>
            </div>
          ))}
        </Section>

        {/* Brands */}
        <Section title="Brand" defaultOpen={false}>
          {visibleBrands.map((b) => (
            <div
              key={b}
              className="pf-option"
              onClick={() => onChange('brand', brand === b ? null : b)}
              role="option"
              aria-selected={brand === b}
            >
              <div className={`pf-check${brand === b ? ' on' : ''}`} />
              <span className="pf-opt-label">{b}</span>
            </div>
          ))}
          <button
            className="pf-show-more"
            onClick={() => setShowAllBrands((v) => !v)}
          >
            {showAllBrands
              ? 'Show less'
              : `+ ${PRODUCT_BRANDS.length - 8} more brands`}
          </button>
        </Section>

        {/* In Stock toggle */}
        <Section title="Availability">
          <div className="pf-toggle-row">
            <span className="pf-toggle-label">In Stock Only</span>
            <button
              className={`pf-toggle${inStockOnly ? ' on' : ''}`}
              onClick={() => onChange('inStockOnly', !inStockOnly)}
              aria-pressed={inStockOnly}
              aria-label="Show in stock only"
            />
          </div>
        </Section>

      </aside>
    </>
  );
}