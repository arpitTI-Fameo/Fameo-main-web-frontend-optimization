'use client';
// components/products/ProductGrid.js
// Filtered product grid — combines ProductFilters sidebar + ProductCard grid.
// Used on /products/[category] pages and the main /products page shop section.
//
// Props:
//   products      — full product array
//   onProductClick — opens ProductDetail overlay
//   addToCart     — adds to cart
//   initialCategory — pre-select a category (from URL param)

import { useState, useEffect, useMemo } from 'react';
import ProductCard    from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import { useWishlistStore } from '@/store/wishlistStore';

const PRICE_RANGES = [
  { min: 0,    max: Infinity },
  { min: 0,    max: 200      },
  { min: 200,  max: 500      },
  { min: 500,  max: 1000     },
  { min: 1000, max: Infinity },
];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@200;300;400;500&display=swap');

  :root {
    --pg-rose:#E8405A; --pg-ink:#111118;
    --pg-muted:#888898; --pg-line:#EEEEF2;
    --pg-surf:#F7F7FA; --pg-white:#ffffff;
  }

  /* ── shell ── */
  .pg-wrap { display: flex; align-items: flex-start; min-height: 60vh; }

  /* ── toolbar ── */
  .pg-toolbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 28px; border-bottom: 1px solid var(--pg-line);
    background: var(--pg-white); gap: 16px; flex-wrap: wrap;
  }
  .pg-toolbar-left {
    display: flex; align-items: center; gap: 16px;
  }
  .pg-toolbar-title {
    font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300;
    color: var(--pg-ink);
  }
  .pg-toolbar-title em { font-style: italic; color: var(--pg-rose); }
  .pg-filter-toggle {
    display: none; /* shown on mobile */
    font-family: 'Jost', sans-serif; font-size: 9px; font-weight: 400;
    letter-spacing: .18em; text-transform: uppercase;
    padding: 7px 14px; border: 1.5px solid var(--pg-line);
    background: transparent; color: var(--pg-muted); cursor: pointer;
    border-radius: 3px; transition: border-color .2s, color .2s;
  }
  .pg-filter-toggle:hover { border-color: var(--pg-rose); color: var(--pg-rose); }

  /* view mode + result count */
  .pg-toolbar-right { display: flex; align-items: center; gap: 14px; }
  .pg-result-count {
    font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 300;
    letter-spacing: .1em; color: var(--pg-muted);
  }
  .pg-view-btns { display: flex; gap: 3px; }
  .pg-vbtn {
    width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
    border: 1.5px solid var(--pg-line); background: transparent; cursor: pointer;
    color: var(--pg-muted); border-radius: 3px; transition: all .18s;
  }
  .pg-vbtn:hover { border-color: var(--pg-rose); color: var(--pg-rose); }
  .pg-vbtn.on { border-color: var(--pg-ink); color: var(--pg-ink); background: var(--pg-surf); }

  /* ── main area ── */
  .pg-main { flex: 1; min-width: 0; }

  /* active filters chips */
  .pg-chips {
    display: flex; gap: 8px; flex-wrap: wrap;
    padding: 12px 28px; border-bottom: 1px solid var(--pg-line);
  }
  .pg-chip {
    display: flex; align-items: center; gap: 6px;
    padding: 4px 12px; border-radius: 20px;
    border: 1px solid var(--pg-rose); background: #fff5f7;
    font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 400;
    letter-spacing: .08em; color: var(--pg-rose);
  }
  .pg-chip-x {
    background: none; border: none; cursor: pointer;
    color: var(--pg-rose); font-size: 12px; line-height: 1;
    padding: 0; transition: opacity .15s;
  }
  .pg-chip-x:hover { opacity: .6; }

  /* grid */
  .pg-grid {
    display: grid; padding: 24px 28px; gap: 1px;
    background: var(--pg-line);
    grid-template-columns: repeat(3, 1fr);
  }
  .pg-grid.cols-2 { grid-template-columns: repeat(2, 1fr); }
  .pg-grid.cols-1 { grid-template-columns: 1fr; background: transparent; gap: 1px; }

  /* empty */
  .pg-empty {
    padding: 80px 28px; text-align: center;
  }
  .pg-empty-title {
    font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300;
    color: var(--pg-ink); margin-bottom: 10px;
  }
  .pg-empty-sub { font-size: 13px; font-weight: 300; color: var(--pg-muted); margin-bottom: 20px; }
  .pg-empty-clear {
    font-family: 'Jost', sans-serif; font-size: 9px; font-weight: 400;
    letter-spacing: .18em; text-transform: uppercase;
    padding: 10px 24px; border: 1.5px solid var(--pg-rose);
    background: transparent; color: var(--pg-rose); cursor: pointer;
    border-radius: 3px; transition: all .2s;
  }
  .pg-empty-clear:hover { background: var(--pg-rose); color: #fff; }

  /* load more */
  .pg-load-more {
    display: flex; justify-content: center; padding: 32px;
    border-top: 1px solid var(--pg-line);
  }
  .pg-load-btn {
    font-family: 'Jost', sans-serif; font-size: 9px; font-weight: 400;
    letter-spacing: .2em; text-transform: uppercase;
    padding: 13px 40px; border: 1.5px solid var(--pg-ink);
    background: transparent; color: var(--pg-ink); cursor: pointer;
    border-radius: 3px; transition: all .22s;
  }
  .pg-load-btn:hover { background: var(--pg-ink); color: #fff; }

  @media (max-width: 900px) {
    .pg-wrap { flex-direction: column; }
    .pg-filter-toggle { display: flex; }
    .pg-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .pg-grid { grid-template-columns: 1fr; }
    .pg-toolbar { padding: 14px 16px; }
    .pg-grid { padding: 16px; }
  }
`;

const DEFAULT_FILTERS = {
  category:    'all',
  brand:       null,
  priceRange:  0,
  inStockOnly: false,
  sort:        'featured',
};

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