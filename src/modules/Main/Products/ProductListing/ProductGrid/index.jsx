'use client';
// modules/Main/Products/ProductListing/ProductGrid/index.jsx
// Three-column card grid with a "Load more" step. Filtering lives in the page
// component above — this renders exactly the list it is handed.

import { LISTING_VIEWS } from '../constants';

import ProductCard from './ProductCard';
import { S } from './styles';

/**
 * Props
 *  products     Product[]
 *  view         'grid' | 'list'   – row layout comes from the listing header
 *  onOpen       (p) => void
 *  onAddToCart  (p, el) => void
 *  onWishlist   (p) => void
 *  isWished     (id) => boolean
 *  visibleCount number            – how many cards to render
 *  onLoadMore   () => void
 *  loading      boolean
 *  error        string | null
 */
export default function ProductGrid({
  products = [],
  view = LISTING_VIEWS.GRID,
  onOpen,
  onAddToCart,
  onWishlist,
  isWished,
  visibleCount = products.length,
  onLoadMore,
  loading = false,
  error = null,
}) {
  const visible = products.slice(0, visibleCount);
  const remaining = products.length - visible.length;

  return (
    <>
      <style>{S}</style>
      <div className="pg-wrap">
        {loading && <p className="pg-note">Loading products…</p>}

        {!loading && error && <p className="pg-note is-error">{error}</p>}

        {!loading && !error && !products.length && (
          <p className="pg-note">No products here yet — try another category.</p>
        )}

        {!loading && !error && !!visible.length && (
          <>
            <div className={`pg-grid${view === LISTING_VIEWS.LIST ? ' is-list' : ''}`}>
              {visible.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onOpen={onOpen}
                  onAddToCart={onAddToCart}
                  onWishlist={onWishlist}
                  isWished={isWished?.(p.id)}
                />
              ))}
            </div>

            {remaining > 0 && (
              <div className="pg-more">
                <button type="button" className="pg-more-btn" onClick={onLoadMore}>
                  Load more ({remaining} left)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
