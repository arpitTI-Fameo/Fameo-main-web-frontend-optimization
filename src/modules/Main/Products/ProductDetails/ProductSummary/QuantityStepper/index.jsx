'use client';
// modules/Main/Products/ProductDetails/ProductSummary/QuantityStepper/index.jsx
// − 1 + . Clamped between 1 and the SKU's available stock, so the page never
// has to re-check the bound before it calls addToCart().

import { MinusIcon, PlusIcon } from '../../icons';

import { S } from './styles';

/**
 * Props
 *  value     number
 *  max       number   – available stock
 *  onChange  (next) => void
 */
export default function QuantityStepper({ value = 1, max = 99, onChange }) {
  const ceiling = Math.max(1, Number(max) || 1);
  const step = (delta) => onChange?.(Math.min(ceiling, Math.max(1, value + delta)));

  return (
    <>
      <style>{S}</style>
      <div className="pqs-wrap">
        <button
          type="button"
          className="pqs-btn"
          onClick={() => step(-1)}
          disabled={value <= 1}
          aria-label="Decrease quantity"
        >
          <MinusIcon />
        </button>

        <span className="pqs-value" aria-live="polite">{value}</span>

        <button
          type="button"
          className="pqs-btn"
          onClick={() => step(1)}
          disabled={value >= ceiling}
          aria-label="Increase quantity"
        >
          <PlusIcon />
        </button>
      </div>
    </>
  );
}
