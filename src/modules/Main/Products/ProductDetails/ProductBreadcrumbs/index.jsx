'use client';
// modules/Main/Products/ProductDetails/ProductBreadcrumbs/index.jsx
// Home / Category / Product. Presentational — the page builds the trail.

import Link from 'next/link';

import { S } from './styles';

/**
 * Props
 *  items  [{ label, href? }]  – the last entry is the current page and
 *                               carries no href.
 */
export default function ProductBreadcrumbs({ items = [] }) {
  if (!items.length) return null;

  return (
    <>
      <style>{S}</style>
      <nav className="pdb-wrap" aria-label="Breadcrumb">
        <ol className="pdb-list">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li className="pdb-item" key={`${item.label}-${i}`}>
                {item.href && !isLast ? (
                  <Link className="pdb-link" href={item.href}>
                    {item.label}
                  </Link>
                ) : (
                  <span className="pdb-link is-current" aria-current="page">
                    {item.label}
                  </span>
                )}
                {!isLast && <span className="pdb-sep" aria-hidden="true">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
