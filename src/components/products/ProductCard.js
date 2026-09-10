'use client';
// components/products/ProductCard.js
// Reusable product card — used in ProductGrid, ShopSection, and anywhere
// a product needs to be displayed.
//
// Props:
//   product       — product object from mockData / API
//   onCardClick   — opens ProductDetail overlay
//   onAddToCart   — adds to cart
//   onWishlist    — toggles wishlist
//   isWished      — boolean
//   variant       — 'grid' (default) | 'list'

import { useState } from 'react';
import { inr } from '@/lib/formatCurrency';
// Member pricing. ProductCard was the last storefront surface still printing the
// raw listed price — ShopSection / CollectionShowcase / ProductDetail all moved
// to PlanPrice, but the /products/[category] grid renders through this file, so
// a Popular or Elite member browsing a category saw no discount at all.
import PlanPrice from '@/components/products/PlanPrice';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  :root {
    --pc-rose:    #E8405A;
    --pc-rose-dk: #c42d45;
    --pc-ink:     #111118;
    --pc-muted:   #888898;
    --pc-line:    #EEEEF2;
    --pc-surf:    #F7F7FA;
    --pc-white:   #ffffff;
  }

  /* ── GRID CARD ── */
  .pc-card {
    display: flex; flex-direction: column;
    background: var(--pc-white);
    border: 1px solid var(--pc-line);
    cursor: pointer; position: relative;
    transition: border-color .25s, box-shadow .25s, transform .35s cubic-bezier(.22,1,.36,1);
    overflow: hidden;
  }
  .pc-card:hover {
    border-color: rgba(232,64,90,.25);
    box-shadow: 0 12px 40px rgba(17,17,24,.07);
    transform: translateY(-3px);
  }
  .pc-card::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 2px; background: var(--pc-rose);
    transform: scaleX(0); transform-origin: left;
    transition: transform .35s cubic-bezier(.22,1,.36,1);
  }
  .pc-card:hover::after { transform: scaleX(1); }

  /* image */
  .pc-img-wrap {
    position: relative; overflow: hidden;
    background: var(--pc-surf);
    aspect-ratio: 4/3;
  }
  .pc-img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform .7s cubic-bezier(.22,1,.36,1), filter .4s;
  }
  .pc-card:hover .pc-img { transform: scale(1.06); filter: brightness(1.03); }

  /* badges */
  .pc-badge {
    position: absolute; top: 0; left: 0;
    font-family: 'Jost', sans-serif; font-size: 8px; font-weight: 500;
    letter-spacing: .2em; text-transform: uppercase;
    padding: 5px 12px;
    border-bottom: 1px solid var(--pc-line); border-right: 1px solid var(--pc-line);
    background: var(--pc-white); color: var(--pc-ink);
  }
  .pc-badge.sale    { background: var(--pc-rose);    color: #fff; border-color: var(--pc-rose); }
  .pc-badge.new-l   { background: var(--pc-ink);     color: #fff; border-color: var(--pc-ink);  }
  .pc-badge.pro     { background: #111118;            color: #E8405A; border-color: #111118;      }
  .pc-badge.bundle  { background: #F7F7FA;            color: var(--pc-ink); }
  .pc-badge.wireless{ background: var(--pc-rose);    color: #fff; border-color: var(--pc-rose); }

  /* wishlist */
  .pc-wish {
    position: absolute; top: 10px; right: 10px;
    width: 32px; height: 32px; border-radius: 50%;
    background: rgba(255,255,255,.9); border: 1px solid var(--pc-line);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 14px; color: var(--pc-muted);
    transition: all .2s; opacity: 0;
  }
  .pc-card:hover .pc-wish { opacity: 1; }
  .pc-wish:hover, .pc-wish.wished { color: var(--pc-rose); border-color: var(--pc-rose); }

  /* quick add — slides up on hover */
  .pc-quick {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 10px 14px;
    background: rgba(17,17,24,.88); backdrop-filter: blur(8px);
    transform: translateY(100%);
    transition: transform .32s cubic-bezier(.22,1,.36,1);
  }
  .pc-card:hover .pc-quick { transform: translateY(0); }
  .pc-quick-btn {
    width: 100%; padding: 9px;
    font-family: 'Jost', sans-serif; font-size: 9px; font-weight: 400;
    letter-spacing: .18em; text-transform: uppercase;
    background: var(--pc-rose); color: #fff; border: none; cursor: pointer;
    border-radius: 3px; transition: background .2s;
  }
  .pc-quick-btn:hover { background: var(--pc-rose-dk); }

  /* info */
  .pc-info {
    padding: 16px 18px 20px;
    border-top: 1px solid var(--pc-line);
    display: flex; flex-direction: column; flex: 1;
    transition: background .22s;
  }
  .pc-card:hover .pc-info { background: var(--pc-surf); }
  .pc-cat {
    font-family: 'Jost', sans-serif; font-size: 8px; font-weight: 500;
    letter-spacing: .22em; text-transform: uppercase;
    color: var(--pc-rose); margin-bottom: 4px;
  }
  .pc-name {
    font-family: 'Cormorant Garamond', serif; font-size: 19px; font-weight: 500;
    letter-spacing: .06em; text-transform: uppercase;
    color: var(--pc-ink); line-height: 1.1; margin-bottom: 3px;
  }
  .pc-tagline {
    font-size: 11px; font-weight: 300; color: var(--pc-muted);
    margin-bottom: 12px;
  }
  .pc-bottom {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: auto; padding-top: 12px; border-top: 1px solid var(--pc-line);
  }
  .pc-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 400; color: var(--pc-ink);
  }
  .pc-orig {
    font-size: 11px; font-weight: 300; color: var(--pc-muted);
    text-decoration: line-through; margin-left: 5px;
  }
  .pc-rating {
    display: flex; align-items: center; gap: 4px;
  }
  .pc-stars { color: var(--pc-rose); font-size: 9px; letter-spacing: 1px; }
  .pc-rval  { font-size: 11px; font-weight: 500; color: var(--pc-ink); }
  .pc-rcnt  { font-size: 10px; color: var(--pc-muted); }

  /* stock dot */
  .pc-stock { display: flex; align-items: center; gap: 4px; font-size: 10px; color: var(--pc-muted); }
  .pc-sdot  { width: 5px; height: 5px; border-radius: 50%; background: #4caf50; flex-shrink: 0; }
  .pc-sdot.low { background: var(--pc-rose); }

  /* ── LIST VARIANT ── */
  .pc-card.list {
    flex-direction: row; align-items: stretch; transform: none !important;
  }
  .pc-card.list:hover { transform: none !important; }
  .pc-card.list .pc-img-wrap {
    width: 200px; flex-shrink: 0; aspect-ratio: unset;
  }
  .pc-card.list .pc-info {
    flex-direction: row; align-items: center; gap: 24px; padding: 20px 24px;
  }
  .pc-card.list .pc-name { font-size: 22px; }
  .pc-card.list .pc-bottom {
    flex-direction: column; align-items: flex-end;
    border-top: none; padding-top: 0; margin-left: auto; gap: 8px;
  }
  .pc-card.list .pc-tagline { margin-bottom: 6px; }
  .pc-card.list .pc-quick { display: none; }
  .pc-list-add {
    display: none;
    font-family: 'Jost', sans-serif; font-size: 9px; font-weight: 400;
    letter-spacing: .16em; text-transform: uppercase;
    padding: 8px 18px; border: 1.5px solid var(--pc-rose);
    background: transparent; color: var(--pc-rose); cursor: pointer;
    border-radius: 3px; transition: all .2s; white-space: nowrap;
  }
  .pc-card.list .pc-list-add { display: inline-flex; }
  .pc-list-add:hover { background: var(--pc-rose); color: #fff; }
`;

export default function ProductCard({
  product,
  onCardClick,
  onAddToCart,
  onWishlist,
  isWished = false,
  variant  = 'grid',
}) {
  const [adding, setAdding] = useState(false);

  const badgeClass = () => {
    const t = product.tag?.toLowerCase();
    if (t === 'sale')     return 'pc-badge sale';
    if (t === 'new')      return 'pc-badge new-l';
    if (t === 'pro')      return 'pc-badge pro';
    if (t === 'bundle')   return 'pc-badge bundle';
    if (t === 'wireless') return 'pc-badge wireless';
    return 'pc-badge';
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setAdding(true);
    onAddToCart?.(product, 1);
    setTimeout(() => setAdding(false), 900);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    onWishlist?.(product);
  };

  return (
    <>
      <style>{S}</style>
      <div
        className={`pc-card${variant === 'list' ? ' list' : ''}`}
        onClick={() => onCardClick?.(product)}
        role="button"
        tabIndex={0}
        aria-label={product.name}
        onKeyDown={(e) => e.key === 'Enter' && onCardClick?.(product)}
      >
        {/* Image */}
        <div className="pc-img-wrap">
          <img
            className="pc-img"
            src={product.thumb || product.images?.[0]}
            alt={product.name}
            loading="lazy"
          />
          {product.tag && <span className={badgeClass()}>{product.tag}</span>}

          {/* Wishlist */}
          <button
            className={`pc-wish${isWished ? ' wished' : ''}`}
            onClick={handleWishlist}
            aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isWished ? '♥' : '♡'}
          </button>

          {/* Quick add (grid only) */}
          {variant === 'grid' && (
            <div className="pc-quick">
              <button className="pc-quick-btn" onClick={handleAddToCart}>
                {adding ? 'Added ✓' : 'Quick Add to Bag'}
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pc-info">
          <div style={{ flex: 1 }}>
            <p className="pc-cat">{product.category}</p>
            <h3 className="pc-name">{product.name}</h3>
            <p className="pc-tagline">{product.tagline}</p>

            {/* Rating */}
            <div className="pc-rating">
              <span className="pc-stars">{'★'.repeat(Math.floor(product.rating))}</span>
              <span className="pc-rval">{product.rating}</span>
              <span className="pc-rcnt">({product.reviews?.toLocaleString()})</span>
            </div>
          </div>

          <div className="pc-bottom">
            <div>
              <span className="pc-price">
                <PlanPrice price={product.price} showUpsell={false} />
              </span>
              {product.original && (
                <span className="pc-orig">{inr(product.original)}</span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className={`pc-stock`}>
                <span className={`pc-sdot${product.stock <= 10 ? ' low' : ''}`} />
                {product.stock <= 10 ? `${product.stock} left` : 'In Stock'}
              </span>
              {/* List variant add button */}
              <button className="pc-list-add" onClick={handleAddToCart}>
                {adding ? 'Added ✓' : 'Add to Bag'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}