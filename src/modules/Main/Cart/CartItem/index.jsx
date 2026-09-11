'use client';
// modules/Cart/CartItem/index.jsx
// Reusable single cart item row.
// Used by both CartClient (full /cart page) and CartDrawer (slide-in panel).
//
// Props:
//   product   — product object
//   qty       — current quantity
//   onUpdate  — (productId, newQty) => void
//   onRemove  — (productId) => void
//   compact   — boolean, true = drawer style (smaller), false = full page style

import { inr } from '@/utils/formatCurrency';

import { S } from './styles';

export default function CartItem({ product, qty, onUpdate, onRemove, compact = false }) {
  return (
    <>
      <style>{S}</style>
      <div className={`ci-row${compact ? ' compact' : ''}`}>

        {/* Image */}
        <div className="ci-img">
          {product.thumb
            ? <img src={product.thumb} alt={product.name} loading="lazy" />
            : <span className="ci-img-placeholder">{product.emoji || '📦'}</span>
          }
        </div>

        {/* Info */}
        <div>
          <p className="ci-cat">{product.category}</p>
          <p className="ci-name">{product.name}</p>
          <p className="ci-tagline">{product.tagline}</p>
          <div className="ci-price-row">
            <span className="ci-price">{inr(product.price)}</span>
            {product.original && (
              <span className="ci-orig">{inr(product.original)}</span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="ci-controls">
          <div className="ci-qty">
            <button className="ci-qbtn" onClick={() => onUpdate(product.id, qty - 1)}>−</button>
            <div className="ci-qval">{qty}</div>
            <button className="ci-qbtn" onClick={() => onUpdate(product.id, qty + 1)}>+</button>
          </div>
          <span className="ci-subtotal">{inr(product.price * qty)}</span>
          <button className="ci-remove" onClick={() => onRemove(product.id)}>Remove</button>
        </div>

      </div>
    </>
  );
}
