'use client';
// modules/Main/Cart/CartItem/index.jsx
// One row in the cart: shot on the left, then brand / name / category, the
// quantity stepper, and the line price on the right. Wishlist and remove sit
// top-right.
//
// Used by the cart page and, with `compact`, by the drawer — the drawer drops
// the category chip and the wishlist button and tightens the grid, but it is
// the same markup so the two can never drift apart.
//
// Presentational: quantity, removal and wishlist are all callbacks owned by the
// surface that renders it.

import { inr } from '@/utils/formatCurrency';

import { HeartIcon, MinusIcon, PlusIcon, TrashIcon } from '../icons';

import { S } from './styles';

/**
 * Props
 *  product     Product
 *  qty         number
 *  onUpdate    (productId, nextQty) => void
 *  onRemove    (productId) => void
 *  onWishlist  (product) => void
 *  isWished    boolean
 *  compact     boolean  – drawer variant
 */
export default function CartItem({
  product,
  qty,
  onUpdate,
  onRemove,
  onWishlist,
  isWished = false,
  compact = false,
}) {
  if (!product) return null;

  const max = Number(product.stock ?? 99);
  const image = product.thumb || product.image || product.images?.[0];

  return (
    <>
      <style>{S}</style>
      <article className={`cti-row${compact ? ' is-compact' : ''}`}>
        <div className={`cti-media${product.imageFit === 'contain' ? ' is-contain' : ''}`}>
          {image ? (
            <img className="cti-img" src={image} alt={product.name} loading="lazy" />
          ) : (
            <span className="cti-img-fallback" aria-hidden="true">{product.emoji || '📦'}</span>
          )}
        </div>

        <div className="cti-body">
          <div className="cti-headline">
            <div className="cti-titles">
              {product.brand && (
                <p className="cti-brand">By {product.brand}</p>
              )}
              <h3 className="cti-name">{product.name}</h3>
            </div>

            <div className="cti-tools">
              {!compact && onWishlist && (
                <button
                  type="button"
                  className={`cti-wish${isWished ? ' is-on' : ''}`}
                  onClick={() => onWishlist(product)}
                  aria-pressed={isWished}
                  aria-label={isWished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
                >
                  <HeartIcon filled={isWished} />
                </button>
              )}
              <button
                type="button"
                className="cti-remove"
                onClick={() => onRemove?.(product.id)}
                aria-label={`Remove ${product.name} from cart`}
              >
                <TrashIcon />
              </button>
            </div>
          </div>

          {!compact && product.category && (
            <p className="cti-category">
              <span className="cti-category-label">Category:</span>
              <span className="cti-chip">{product.category}</span>
            </p>
          )}

          <div className="cti-foot">
            <div className="cti-qty">
              <button
                type="button"
                className="cti-qbtn"
                onClick={() => onUpdate?.(product.id, qty - 1)}
                aria-label={`Decrease quantity of ${product.name}`}
              >
                <MinusIcon />
              </button>
              <span className="cti-qval" aria-live="polite">{qty}</span>
              <button
                type="button"
                className="cti-qbtn is-dark"
                onClick={() => onUpdate?.(product.id, qty + 1)}
                disabled={qty >= max}
                aria-label={`Increase quantity of ${product.name}`}
              >
                <PlusIcon />
              </button>
            </div>

            <div className="cti-price">
              {/* Struck price is per line like the one under it — a unit price
                  above a line total would read as a saving it is not. */}
              {product.original > product.price && (
                <p className="cti-price-was">{inr(product.original * qty)}</p>
              )}
              <p className="cti-price-now">{inr(product.price * qty)}</p>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
