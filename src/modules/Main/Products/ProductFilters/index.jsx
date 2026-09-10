'use client';
// modules/Products/ProductFilters/index.jsx
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

import Section from './Section';
import { S } from './styles';
import { PRICE_RANGES, SORT_OPTIONS } from './constants';

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
