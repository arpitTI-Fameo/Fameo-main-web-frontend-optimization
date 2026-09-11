"use client";



import { useState, useEffect, useRef, useCallback } from 'react';
import { inr } from '@/utils/formatCurrency';
import PlanPrice from '../PlanPrice';
import AddToBagButton from '@/components/ui/AddToBagButton';
import { useMembership } from '@/lib/hooks/custome/useMembership';

import { CAT_TILES, PRICE_RANGES } from './constants';
import { SHOP_STYLES } from './styles';

// ─── ShopSection component ────────────────────────────────────────────────────
/**
 * Props
 *  products       Product[]   – full unfiltered product array
 *  onProductClick (p) => void – open product detail overlay
 *  addToCart      (p, qty)    – add item to cart
 */
export default function ShopSection({ products = [], onProductClick, addToCart }) {
  // Per-card "Added ✓" state. The Add to Bag buttons used to call addToCart()
  // and return — no state change, no animation, no confirmation. The button
  // looked exactly the same before and after the click, which is why it read as
  // "nothing happened".
  const addTimers = useRef({});

  const { isMember, percent, meta } = useMembership();

  // Hands the card's image to addToCart so lib/flyToCart.js can arc it into the
  // bag icon. Walks up to the card root and lets the flight helper find the img.
  const handleAdd = useCallback((e, p) => {
    e.stopPropagation();
    if (!addToCart) return { ok: false };

    const card =
      e.currentTarget.closest('.ss-pc') ||
      e.currentTarget.closest('.ss-list-row') ||
      e.currentTarget;

    return addToCart(p, 1, card);
  }, [addToCart]);

  useEffect(() => () => {
    Object.values(addTimers.current).forEach(clearTimeout);
  }, []);

  const [shopCat, setShopCat] = useState("all");
  const [shopSub, setShopSub] = useState(null);
  const [shopBrand, setShopBrand] = useState(null);
  const [panelTab, setPanelTab] = useState("sub");
  const [priceRange, setPriceRange] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("featured");
  const [viewMode, setViewMode] = useState("3");
  const [visibleCount, setVisibleCount] = useState(9);
  const [cardVis, setCardVis] = useState(new Set());

  const cardRefs = useRef([]);

  // IntersectionObserver — card fade-in
  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => {
        if (e.isIntersecting) setCardVis(p => new Set([...p, e.target.dataset.ssid]));
      }),
      { threshold: 0.07 }
    );
    cardRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, [shopCat, shopBrand, priceRange, inStockOnly, sort, visibleCount]);

  // Reset page count on filter change
  useEffect(() => { setVisibleCount(9); }, [shopCat, shopBrand, priceRange, inStockOnly, sort]);

  // ── Derived ──
  const activeTile = CAT_TILES.find(c => c.id === shopCat) || CAT_TILES[0];
  const panelOpen = shopCat !== "all" && (activeTile.subs.length > 0 || activeTile.brands.length > 0);

  const filtered = products
    .filter(p => {
      if (shopCat !== "all" && p.category !== shopCat) return false;
      if (shopBrand && !(p.brand === shopBrand || p.name.toLowerCase().includes(shopBrand.toLowerCase()))) return false;
      const pr = PRICE_RANGES[priceRange];
      if (p.price < pr.min || p.price > pr.max) return false;
      if (inStockOnly && p.stock <= 0) return false;
      return true;
    })
    .sort((a, b) =>
      sort === "price-asc" ? a.price - b.price :
        sort === "price-desc" ? b.price - a.price :
          sort === "rating" ? b.rating - a.rating : 0
    );

  const visible = filtered.slice(0, visibleCount);
  const hasFilters = shopCat !== "all" || shopBrand !== null || priceRange !== 0 || inStockOnly;
  const gridClass = viewMode === "list" ? "ss-grid-1" : viewMode === "2" ? "ss-grid-2" : "ss-grid-3";

  const clearFilters = () => {
    setShopCat("all"); setShopSub(null); setShopBrand(null);
    setPriceRange(0); setInStockOnly(false); setSort("featured");
  };

  const selectCat = (catId) => {
    if (shopCat === catId) {
      setShopCat("all"); setShopSub(null); setShopBrand(null);
    } else {
      setShopCat(catId); setShopSub(null); setShopBrand(null);
      setPanelTab("sub");
    }
  };

  const lblClass = t =>
    t === "Sale" ? "ss-pc-lbl sale" : t === "New" ? "ss-pc-lbl new-l" : "ss-pc-lbl";

  return (
    <>
      <style>{SHOP_STYLES}</style>

      {/* ── Section header ── */}
      <div className="ss-header">
        <div>
          <p className="ss-eyebrow">Browse the Store</p>
          <h2>Creator <em>Essentials</em></h2>
        </div>
        <div className="ss-header-right">
          <span className="ss-count">{filtered.length} products</span>
          <div className="ss-view-btns">
            <button className={`ss-vbtn${viewMode === "3" ? " on" : ""}`} onClick={() => setViewMode("3")} title="3-column">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <rect x="0" y="0" width="3.5" height="3.5" fill="currentColor" />
                <rect x="4.75" y="0" width="3.5" height="3.5" fill="currentColor" />
                <rect x="9.5" y="0" width="3.5" height="3.5" fill="currentColor" />
                <rect x="0" y="4.75" width="3.5" height="3.5" fill="currentColor" />
                <rect x="4.75" y="4.75" width="3.5" height="3.5" fill="currentColor" />
                <rect x="9.5" y="4.75" width="3.5" height="3.5" fill="currentColor" />
                <rect x="0" y="9.5" width="3.5" height="3.5" fill="currentColor" />
                <rect x="4.75" y="9.5" width="3.5" height="3.5" fill="currentColor" />
                <rect x="9.5" y="9.5" width="3.5" height="3.5" fill="currentColor" />
              </svg>
            </button>
            <button className={`ss-vbtn${viewMode === "2" ? " on" : ""}`} onClick={() => setViewMode("2")} title="2-column">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <rect x="0" y="0" width="5.5" height="5.5" fill="currentColor" />
                <rect x="7.5" y="0" width="5.5" height="5.5" fill="currentColor" />
                <rect x="0" y="7.5" width="5.5" height="5.5" fill="currentColor" />
                <rect x="7.5" y="7.5" width="5.5" height="5.5" fill="currentColor" />
              </svg>
            </button>
            <button className={`ss-vbtn${viewMode === "list" ? " on" : ""}`} onClick={() => setViewMode("list")} title="List">
              <svg width="13" height="11" viewBox="0 0 13 11" fill="none">
                <rect x="0" y="0" width="13" height="2" fill="currentColor" />
                <rect x="0" y="4.5" width="13" height="2" fill="currentColor" />
                <rect x="0" y="9" width="13" height="2" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Category photo tiles ── */}
      <div className="ss-tiles-wrap">
        <p className="ss-tiles-label">Browse by category</p>
        <div className="ss-tiles">
          {CAT_TILES.map(cat => (
            <button
              key={cat.id}
              className={`ss-tile${shopCat === cat.id ? " active" : ""}`}
              style={{ "--tile-accent": cat.accent }}
              onClick={() => selectCat(cat.id)}
            >
              <img className="ss-tile-img" src={cat.img} alt={cat.label} loading="lazy" />
              <div className="ss-tile-dot" />
              <div className="ss-tile-info">
                <span className="ss-tile-name">{cat.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Expanded panel — subcategories + brands ── */}
      <div className={`ss-panel${panelOpen ? " open" : ""}`}>
        <div className="ss-panel-head">
          <p className="ss-panel-heading">
            <span>Browsing</span>
            {activeTile.label}
          </p>
          <button
            className="ss-panel-close"
            onClick={() => { setShopCat("all"); setShopSub(null); setShopBrand(null); }}
            title="Close"
          >✕</button>
        </div>

        <div className="ss-panel-tabs">
          {activeTile.subs.length > 0 && (
            <button
              className={`ss-panel-tab${panelTab === "sub" ? " on" : ""}`}
              onClick={() => setPanelTab("sub")}
            >
              Subcategories
              <span className="ss-panel-tab-count">{activeTile.subs.length}</span>
            </button>
          )}
          {activeTile.brands.length > 0 && (
            <button
              className={`ss-panel-tab${panelTab === "brand" ? " on" : ""}`}
              onClick={() => setPanelTab("brand")}
            >
              Brands
              <span className="ss-panel-tab-count">{activeTile.brands.length}</span>
            </button>
          )}
        </div>

        <div className="ss-panel-content">
          {panelTab === "sub" && activeTile.subs.length > 0 && (
            <div className="ss-subcat-items">
              {activeTile.subs.map(sub => (
                <button
                  key={sub.label}
                  className={`ss-subcat-card${shopSub === sub.label ? " sel" : ""}`}
                  onClick={() => setShopSub(shopSub === sub.label ? null : sub.label)}
                >
                  <img className="ss-subcat-card-img" src={sub.img} alt={sub.label} loading="lazy" />
                  <span className="ss-subcat-card-name">{sub.label}</span>
                </button>
              ))}
            </div>
          )}

          {panelTab === "brand" && activeTile.brands.length > 0 && (
            <div className="ss-brands-grid">
              {activeTile.brands.map(brand => (
                <button
                  key={brand}
                  className={`ss-brand-pill${shopBrand === brand ? " sel" : ""}`}
                  onClick={() => setShopBrand(shopBrand === brand ? null : brand)}
                >
                  {brand}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky filter + sort bar ── */}
      <div className="ss-filter-bar">
        <div className="ss-filter-left">

          {/* Price range pills */}
          <div className="ss-price-pills">
            {PRICE_RANGES.map((pr, idx) => (
              <button
                key={pr.label}
                className={`ss-price-pill${priceRange === idx ? " on" : ""}`}
                onClick={() => setPriceRange(idx)}
              >{pr.label}</button>
            ))}
          </div>

          {/* In-stock toggle */}
          <button
            className={`ss-stock-btn${inStockOnly ? " on" : ""}`}
            onClick={() => setInStockOnly(s => !s)}
          >
            <span className="ss-stock-dot" />
            In Stock Only
          </button>

          {/* Active filter chips */}
          {hasFilters && (
            <div className="ss-chips">
              {shopCat !== "all" && (
                <button className="ss-chip" onClick={() => { setShopCat("all"); setShopSub(null); setShopBrand(null); }}>
                  {shopCat} <span className="ss-chip-x">×</span>
                </button>
              )}
              {shopBrand && (
                <button className="ss-chip" onClick={() => setShopBrand(null)}>
                  {shopBrand} <span className="ss-chip-x">×</span>
                </button>
              )}
              {priceRange !== 0 && (
                <button className="ss-chip" onClick={() => setPriceRange(0)}>
                  {PRICE_RANGES[priceRange].label} <span className="ss-chip-x">×</span>
                </button>
              )}
              {inStockOnly && (
                <button className="ss-chip" onClick={() => setInStockOnly(false)}>
                  In Stock <span className="ss-chip-x">×</span>
                </button>
              )}
              <button className="ss-chips-clear" onClick={clearFilters}>Clear all</button>
            </div>
          )}
        </div>

        <div className="ss-filter-right">
          <span className="ss-sort-label">Sort</span>
          <select
            className="ss-sort-select"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* ── Product grid / list ── */}
      {/* Member pricing banner — makes it obvious the prices below are already
          discounted. Previously a Popular/Elite member had no on-page signal at
          all that their plan was doing anything. */}
      {isMember && percent > 0 && (
        <div className="ss-plan-banner">
          <span className="ss-plan-dot" style={{ background: meta.color }} />
          <span className="ss-plan-badge" style={{ color: meta.color, borderColor: meta.color }}>
            {meta.icon} {meta.label}
          </span>
          <span className="ss-plan-txt">
            Your {percent}% member price is shown on every product below
          </span>
        </div>
      )}

      <div className="ss-grid-wrap">
        {visible.length === 0 ? (
          <div className="ss-empty">
            <span className="ss-empty-icon">◇</span>
            <h3 className="ss-empty-title">No products found</h3>
            <p className="ss-empty-sub">Try adjusting your filters or browse all categories.</p>
            <button className="ss-empty-btn" onClick={clearFilters}>Clear Filters</button>
          </div>

        ) : viewMode === "list" ? (
          <div className={gridClass}>
            {visible.map((p, i) => (
              <div
                key={p.id}
                ref={el => cardRefs.current[i] = el}
                data-ssid={p.id}
                className={`ss-list${cardVis.has(String(p.id)) ? " vis" : ""}`}
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => onProductClick && onProductClick(p)}
              >
                <div className="ss-list-img">
                  <img src={p.thumb} alt={p.name} loading="lazy" />
                  <span className={lblClass(p.tag)} style={{ fontSize: "8px" }}>{p.tag}</span>
                </div>
                <div className="ss-list-body">
                  <div className="ss-list-left">
                    <p className="ss-list-cat">{p.category}</p>
                    <h3 className="ss-list-name">{p.name}</h3>
                    <p className="ss-list-sub">{p.tagline}</p>
                    <p className="ss-list-desc">{p.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "8px" }}>
                      <span className="ss-pc-stars">{"★".repeat(Math.floor(p.rating ?? 0))}</span>
                      <span className="ss-pc-rnum" style={{ fontSize: "11px" }}>{p.rating}</span>
                      <span className="ss-pc-rcnt">({(p.reviews ?? 0).toLocaleString()})</span>
                    </div>
                  </div>
                  <div className="ss-list-right">
                    <div className="ss-list-price"><PlanPrice price={p.price} /></div>
                    {p.original && <div className="ss-list-was">{inr(p.original)}</div>}
                    <span className={`ss-list-stock${p.stock <= 10 ? " low" : ""}`}>
                      {p.stock <= 10 ? `${p.stock} left` : "In Stock"}
                    </span>
                    <AddToBagButton
                      className="ss-list-btn"
                      onAdd={e => handleAdd(e, p)}
                      disabled={p.stock === 0}
                      label={p.stock === 0 ? 'Sold out' : 'Add to Bag'}
                      addedLabel="Added to Cart"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

        ) : (
          <div className={gridClass}>
            {visible.map((p, i) => (
              <div
                key={p.id}
                ref={el => cardRefs.current[i] = el}
                data-ssid={p.id}
                className={`ss-pc${cardVis.has(String(p.id)) ? " vis" : ""}`}
                style={{ animationDelay: `${(i % 3) * 0.08}s` }}
                onClick={() => onProductClick && onProductClick(p)}
              >
                <div className="ss-pc-img">
                  <img className="ss-pc-photo" src={p.thumb} alt={p.name} loading="lazy" />
                  <span className={lblClass(p.tag)}>{p.tag}</span>
                  <button className="ss-pc-wish" onClick={e => e.stopPropagation()}>♡</button>
                  <AddToBagButton
                    className="ss-pc-quick"
                    onAdd={e => handleAdd(e, p)}
                    disabled={p.stock === 0}
                    label={p.stock === 0 ? 'Sold out' : 'Add to Bag'}
                    addedLabel="Added to Cart"
                  />
                </div>
                <div className="ss-pc-body">
                  <p className="ss-pc-cat">{p.category}</p>
                  <h3 className="ss-pc-name">{p.name}</h3>
                  <p className="ss-pc-sub">{p.tagline}</p>
                  {/* rating/reviews are null on live backend rows — Math.floor(null)
                      is 0 and (null).toLocaleString() throws, so guard both. */}
                  {p.rating != null && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "10px" }}>
                      <span className="ss-pc-stars">{"★".repeat(Math.floor(p.rating))}</span>
                      <span className="ss-pc-rnum">{p.rating}</span>
                      <span className="ss-pc-rcnt">({(p.reviews ?? 0).toLocaleString()})</span>
                    </div>
                  )}
                  <div className="ss-pc-foot">
                    <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                      <span className="ss-pc-price"><PlanPrice price={p.price} /></span>
                      {p.original && <span className="ss-pc-was">{inr(p.original)}</span>}
                    </div>
                    <span className={`ss-pc-stock${p.stock <= 10 ? " low" : ""}`}>
                      {p.stock <= 10 ? `${p.stock} left` : "In Stock"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load more */}
        {visibleCount < filtered.length && (
          <div className="ss-load-more">
            <div className="ss-load-more-line" />
            <button
              className="ss-load-more-btn"
              onClick={() => setVisibleCount(n => n + 9)}
            >
              Load More · {filtered.length - visibleCount} remaining
            </button>
            <div className="ss-load-more-line" />
          </div>
        )}
      </div>
    </>
  );
}
