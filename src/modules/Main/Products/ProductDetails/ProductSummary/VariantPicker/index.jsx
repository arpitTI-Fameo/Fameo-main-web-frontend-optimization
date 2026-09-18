'use client';
// modules/Main/Products/ProductDetails/ProductSummary/VariantPicker/index.jsx
// One variant axis. A 'swatch' axis renders colour discs, a 'pill' axis
// renders labelled pills — both are the same radio group underneath, so the
// page never cares which kind an axis is.

import { S } from './styles';

/**
 * Props
 *  axis      { id, label, type: 'swatch'|'pill', values: [{ value, label, hex }] }
 *  selected  string
 *  onSelect  (value) => void
 */
export default function VariantPicker({ axis, selected, onSelect }) {
  const values = axis?.values || [];
  if (!axis || values.length === 0) return null;

  const isSwatch = axis.type === 'swatch';

  return (
    <>
      <style>{S}</style>
      <div className="pvp-axis">
        <span className="pvp-label" id={`pvp-${axis.id}`}>
          {axis.label}
        </span>

        <div
          className={`pvp-row${isSwatch ? ' is-swatch' : ''}`}
          role="radiogroup"
          aria-labelledby={`pvp-${axis.id}`}
        >
          {values.map((v) => {
            const on = v.value === selected;
            return (
              <button
                type="button"
                key={v.value}
                role="radio"
                aria-checked={on}
                aria-label={v.label}
                title={isSwatch ? v.label : undefined}
                className={`${isSwatch ? 'pvp-swatch' : 'pvp-pill'}${on ? ' is-on' : ''}`}
                onClick={() => onSelect?.(v.value)}
              >
                {isSwatch ? (
                  <span className="pvp-dot" style={{ background: v.hex }} />
                ) : (
                  v.label
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
