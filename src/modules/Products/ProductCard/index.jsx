'use client';
// modules/Products/ProductCard/index.jsx
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
import PlanPrice from '../PlanPrice';

import { S } from './styles';


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
