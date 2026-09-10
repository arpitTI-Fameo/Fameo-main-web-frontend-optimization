'use client';
// modules/Products/ProductGrid/index.jsx
// Filtered product grid — combines ProductFilters sidebar + ProductCard grid.
// Used on /products/[category] pages and the main /products page shop section.
//
// Props:
//   products      — full product array
//   onProductClick — opens ProductDetail overlay
//   addToCart     — adds to cart
//   initialCategory — pre-select a category (from URL param)

import { useState, useEffect, useMemo } from 'react';
import ProductCard    from '../ProductCard';
import ProductFilters from '../ProductFilters';
import { useWishlistStore } from '@/store/wishlistStore';

import { S } from './styles';
import { PRICE_RANGES, DEFAULT_FILTERS } from './constants';

export default function ProductGrid({
  products = [],
  onProductClick,
  addToCart,
  initialCategory = 'all',
}) {
  const [filters,       setFilters]       = useState({ ...DEFAULT_FILTERS, category: initialCategory });
  const [viewMode,      setViewMode]      = useState('3');
  const [visibleCount,  setVisibleCount]  = useState(12);
  const [filtersOpen,   setFiltersOpen]   = useState(true);

  const { toggle, has } = useWishlistStore();

  // Sync category from URL (if parent changes it)
  useEffect(() => {
    setFilters((f) => ({ ...f, category: initialCategory }));
  }, [initialCategory]);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(12);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const handleClear = () => {
    setFilters({ ...DEFAULT_FILTERS });
  };

  // Derived filtered + sorted list
  const filtered = useMemo(() => {
    const pr = PRICE_RANGES[filters.priceRange];
    return products
      .filter((p) => {
        if (filters.category !== 'all' && p.category !== filters.category) return false;
        if (filters.brand && !p.name.toLowerCase().includes(filters.brand.toLowerCase()) && p.brand !== filters.brand) return false;
        if (p.price < pr.min || p.price > pr.max) return false;
        if (filters.inStockOnly && p.stock <= 0) return false;
        return true;
      })
      .sort((a, b) => {
        if (filters.sort === 'price-asc')  return a.price - b.price;
        if (filters.sort === 'price-desc') return b.price - a.price;
        if (filters.sort === 'rating')     return b.rating - a.rating;
        return 0;
      });
  }, [products, filters]);

  const visible = filtered.slice(0, visibleCount);

  // Active filter chips
  const chips = [];
  if (filters.category !== 'all')    chips.push({ key: 'category',    label: filters.category });
  if (filters.brand)                 chips.push({ key: 'brand',        label: filters.brand    });
  if (filters.priceRange !== 0)      chips.push({ key: 'priceRange',   label: ['Under ₹16,800','₹16,800–₹42,000','₹42,000–₹84,000','₹84,000+'][filters.priceRange - 1] });
  if (filters.inStockOnly)           chips.push({ key: 'inStockOnly',  label: 'In Stock'       });

  const gridClass = viewMode === '1' ? 'pg-grid cols-1'
                  : viewMode === '2' ? 'pg-grid cols-2'
                  : 'pg-grid';

  return (
    <>
      <style>{S}</style>

      {/* Toolbar */}
      <div className="pg-toolbar">
        <div className="pg-toolbar-left">
          <h2 className="pg-toolbar-title">
            {filters.category === 'all' ? <>All <em>Products</em></> : <em>{filters.category}</em>}
          </h2>
          <button className="pg-filter-toggle" onClick={() => setFiltersOpen((o) => !o)}>
            {filtersOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        <div className="pg-toolbar-right">
          <span className="pg-result-count">{filtered.length} products</span>
          <div className="pg-view-btns">
            {/* 3-col */}
            <button className={`pg-vbtn${viewMode === '3' ? ' on' : ''}`} onClick={() => setViewMode('3')} title="3 columns">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                {[0,4.75,9.5].map((x) => [0,4.75,9.5].map((y) => (
                  <rect key={`${x}-${y}`} x={x} y={y} width="3.5" height="3.5" fill="currentColor" />
                )))}
              </svg>
            </button>
            {/* 2-col */}
            <button className={`pg-vbtn${viewMode === '2' ? ' on' : ''}`} onClick={() => setViewMode('2')} title="2 columns">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                {[[0,0],[7.5,0],[0,7.5],[7.5,7.5]].map(([x,y]) => (
                  <rect key={`${x}-${y}`} x={x} y={y} width="5.5" height="5.5" fill="currentColor" />
                ))}
              </svg>
            </button>
            {/* list */}
            <button className={`pg-vbtn${viewMode === '1' ? ' on' : ''}`} onClick={() => setViewMode('1')} title="List">
              <svg width="13" height="11" viewBox="0 0 13 11" fill="none">
                <rect x="0" y="0"   width="13" height="2" fill="currentColor"/>
                <rect x="0" y="4.5" width="13" height="2" fill="currentColor"/>
                <rect x="0" y="9"   width="13" height="2" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="pg-wrap">
        {/* Sidebar filters */}
        {filtersOpen && (
          <ProductFilters
            filters={filters}
            onChange={handleFilterChange}
            onClear={handleClear}
            productCount={filtered.length}
          />
        )}

        {/* Main grid area */}
        <div className="pg-main">

          {/* Active filter chips */}
          {chips.length > 0 && (
            <div className="pg-chips">
              {chips.map((chip) => (
                <div key={chip.key} className="pg-chip">
                  {chip.label}
                  <button
                    className="pg-chip-x"
                    onClick={() => handleFilterChange(chip.key, chip.key === 'inStockOnly' ? false : chip.key === 'priceRange' ? 0 : chip.key === 'category' ? 'all' : null)}
                    aria-label={`Remove ${chip.label} filter`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div className="pg-empty">
              <h3 className="pg-empty-title">No products found</h3>
              <p className="pg-empty-sub">Try adjusting your filters or clearing them to see all products.</p>
              <button className="pg-empty-clear" onClick={handleClear}>Clear all filters</button>
            </div>
          ) : (
            <>
              <div className={gridClass}>
                {visible.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onCardClick={onProductClick}
                    onAddToCart={addToCart}
                    onWishlist={toggle}
                    isWished={has(product.id)}
                    variant={viewMode === '1' ? 'list' : 'grid'}
                  />
                ))}
              </div>

              {/* Load more */}
              {visibleCount < filtered.length && (
                <div className="pg-load-more">
                  <button
                    className="pg-load-btn"
                    onClick={() => setVisibleCount((n) => n + 12)}
                  >
                    Load More ({filtered.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
