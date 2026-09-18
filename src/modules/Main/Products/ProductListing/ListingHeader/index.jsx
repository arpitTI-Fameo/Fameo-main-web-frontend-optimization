'use client';
// modules/Main/Products/ProductListing/ListingHeader/index.jsx
// Listing page header: breadcrumb + display title + result count on a warm
// band, then the control bar — Filters trigger, category pills, sort select
// and the grid/list view toggle.
//
// Presentational. Every piece of state (category, sort, view) and every
// handler is owned by the page component above.

import Link from 'next/link';

import { LISTING_VIEWS } from '../constants';

import { ChevronDownIcon, FilterIcon, GridViewIcon, ListViewIcon } from './icons';
import { S } from './styles';

/**
 * Props
 *  title         string
 *  subtitle      string
 *  breadcrumbs   { label, href? }[]   – last entry renders as the current page
 *  shown         number               – cards currently rendered
 *  total         number               – matches after filtering
 *  categories    string[]             – pill labels, "All" first
 *  active        string               – selected pill
 *  onSelect      (category) => void
 *  sortOptions   { value, label }[]
 *  sort          string
 *  onSortChange  (value) => void
 *  view          'grid' | 'list'
 *  onViewChange  (view) => void
 *  onFilters     () => void           – no panel wired yet, so this is the one
 *                                       control still waiting for a handler
 */
export default function ListingHeader({
  title,
  subtitle,
  breadcrumbs = [],
  shown = 0,
  total = 0,
  categories = [],
  active,
  onSelect,
  sortOptions = [],
  sort,
  onSortChange,
  view = LISTING_VIEWS.GRID,
  onViewChange,
  onFilters,
}) {
  // "Showing 1–12 of 86 results" — the grid always counts from the first card.
  const count = Math.min(shown, total);
  const countLabel = total > 0 ? `Showing 1–${count} of ${total} results` : null;

  return (
    <>
      <style>{S}</style>
      <header className="plh-wrap">
        <div className="plh-band">
          <div className="plh-inner">
            {!!breadcrumbs.length && (
              <nav className="plh-crumbs" aria-label="Breadcrumb">
                {breadcrumbs.map((crumb, i) => {
                  const isLast = i === breadcrumbs.length - 1;
                  return (
                    <span className="plh-crumb-slot" key={crumb.label}>
                      {crumb.href && !isLast ? (
                        <Link className="plh-crumb" href={crumb.href}>
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className="plh-crumb is-current" aria-current="page">
                          {crumb.label}
                        </span>
                      )}
                      {!isLast && (
                        <span className="plh-sep" aria-hidden="true">
                          /
                        </span>
                      )}
                    </span>
                  );
                })}
              </nav>
            )}

            <div className="plh-head">
              <div className="plh-headline">
                <h1 className="plh-title">{title}</h1>
                {subtitle && <p className="plh-sub">{subtitle}</p>}
              </div>
              {countLabel && <p className="plh-count">{countLabel}</p>}
            </div>
          </div>
        </div>

        <div className="plh-bar">
          <div className="plh-inner plh-bar-inner">
            <button
              type="button"
              className="plh-filters"
              onClick={() => onFilters?.()}
            >
              <FilterIcon />
              Filters
            </button>

            {!!categories.length && (
              <div className="plh-pills" role="tablist" aria-label="Product categories">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    role="tab"
                    aria-selected={c === active}
                    className={`plh-pill${c === active ? ' is-on' : ''}`}
                    onClick={() => onSelect?.(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            <div className="plh-tools">
              {!!sortOptions.length && (
                <label className="plh-sort">
                  <span className="plh-sort-label">Sort by:</span>
                  <span className="plh-select-wrap">
                    <select
                      className="plh-select"
                      value={sort}
                      onChange={(e) => onSortChange?.(e.target.value)}
                    >
                      {sortOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <span className="plh-chev" aria-hidden="true">
                      <ChevronDownIcon />
                    </span>
                  </span>
                </label>
              )}

              <div className="plh-views" role="group" aria-label="View mode">
                <button
                  type="button"
                  className={`plh-view${view === LISTING_VIEWS.GRID ? ' is-on' : ''}`}
                  aria-pressed={view === LISTING_VIEWS.GRID}
                  aria-label="Grid view"
                  onClick={() => onViewChange?.(LISTING_VIEWS.GRID)}
                >
                  <GridViewIcon />
                </button>
                <button
                  type="button"
                  className={`plh-view${view === LISTING_VIEWS.LIST ? ' is-on' : ''}`}
                  aria-pressed={view === LISTING_VIEWS.LIST}
                  aria-label="List view"
                  onClick={() => onViewChange?.(LISTING_VIEWS.LIST)}
                >
                  <ListViewIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
