'use client';
// modules/Main/Products/ProductDetails/ProductTabs/index.jsx
// Description / Dimensions / Materials & care / Shipping.
//
// The strip is a real tablist: arrow keys move between tabs and only the open
// panel is in the accessibility tree. Which tab is open is owned by the page,
// so a future deep link (?tab=shipping) needs no change here.

import { useCallback, useRef } from 'react';
import Separator from '@/components/ui/Separator';

import SpecTable from './SpecTable';
import { S } from './styles';

/**
 * Props
 *  tabs      [{ id, label, body: string[], specs: [{label,value}] }]
 *  active    string   – tab id
 *  onSelect  (id) => void
 */
export default function ProductTabs({ tabs = [], active, onSelect }) {
  const stripRef = useRef(null);

  const onKeyDown = useCallback(
    (e) => {
      const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!delta) return;
      e.preventDefault();
      const i = tabs.findIndex((t) => t.id === active);
      const next = tabs[(i + delta + tabs.length) % tabs.length];
      onSelect?.(next.id);
      stripRef.current?.querySelector(`[data-tab="${next.id}"]`)?.focus();
    },
    [tabs, active, onSelect]
  );

  if (!tabs.length) return null;

  const panel = tabs.find((t) => t.id === active) || tabs[0];

  return (
    <>
      <style>{S}</style>
      <section className="ptb-wrap">
        <div className="ptb-strip-band">
          <div className="pdp-inner">
            <div
              className="ptb-strip"
              role="tablist"
              ref={stripRef}
              onKeyDown={onKeyDown}
              aria-label="Product information"
            >
              {tabs.map((tab) => {
                const on = tab.id === panel.id;
                return (
                  <button
                    type="button"
                    key={tab.id}
                    role="tab"
                    data-tab={tab.id}
                    id={`ptb-tab-${tab.id}`}
                    aria-selected={on}
                    aria-controls={`ptb-panel-${tab.id}`}
                    tabIndex={on ? 0 : -1}
                    className={`ptb-tab${on ? ' is-on' : ''}`}
                    onClick={() => onSelect?.(tab.id)}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          <Separator variant="straight" className="ptb-separator" />
        </div>

        <div className="pdp-inner">
          <div
            className="ptb-panel"
            role="tabpanel"
            id={`ptb-panel-${panel.id}`}
            aria-labelledby={`ptb-tab-${panel.id}`}
          >
            <div className="ptb-body">
              {(panel.body || []).map((para) => (
                <p className="ptb-para" key={para}>{para}</p>
              ))}
            </div>

            <SpecTable rows={panel.specs} />
          </div>
        </div>
      </section>
    </>
  );
}
