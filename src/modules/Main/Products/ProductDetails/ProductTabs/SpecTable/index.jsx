// modules/Main/Products/ProductDetails/ProductTabs/SpecTable/index.jsx
// The right column of a tab panel: label above value, one rule between rows.

import { S } from './styles';

/**
 * Props
 *  rows  [{ label, value }]
 *  wide  boolean  – no copy beside it: lay the rows out across the panel
 */
export default function SpecTable({ rows = [], wide = false }) {
  if (!rows.length) return null;

  return (
    <>
      <style>{S}</style>
      <dl className={`pst-list${wide ? ' is-wide' : ''}`}>
        {rows.map((row) => (
          <div className="pst-row" key={row.label}>
            <dt className="pst-label">{row.label}</dt>
            <dd className="pst-value">{row.value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
