'use client';
// modules/Main/Cart/CartSteps/index.jsx
// The two tabs in the masthead: Your Items / Shipping Info.
//
// Presentational. The page owns which step is open, and decides whether the
// shipping tab can be reached yet — an empty cart has nothing to ship.

import { CartIcon, TruckIcon } from '../icons';

import { S } from './styles';

const ICONS = { cart: CartIcon, truck: TruckIcon };

/**
 * Props
 *  steps     [{ id, label, hint, icon }]
 *  active    string   – step id
 *  reachable (id) => boolean
 *  onSelect  (id) => void
 */
export default function CartSteps({ steps = [], active, reachable, onSelect }) {
  if (!steps.length) return null;

  return (
    <>
      <style>{S}</style>
      <div className="cts-wrap" role="tablist" aria-label="Cart progress">
        {steps.map((step) => {
          const Icon = ICONS[step.icon] || CartIcon;
          const on = step.id === active;
          const open = reachable ? reachable(step.id) : true;

          return (
            <button
              type="button"
              key={step.id}
              role="tab"
              aria-selected={on}
              disabled={!open}
              className={`cts-tab${on ? ' is-on' : ''}`}
              onClick={() => open && onSelect?.(step.id)}
            >
              <span className="cts-icon" aria-hidden="true"><Icon /></span>
              <span className="cts-text">
                <span className="cts-label">{step.label}</span>
                <span className="cts-hint">{step.hint}</span>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
