'use client';
// modules/Main/Products/ProductDetails/RelatedProducts/index.jsx
// "You may also like" — four cards under the reviews.
//
// It renders the listing grid's ProductCard rather than a second card of its
// own. The rail sits on the same storefront as /products/[category], so a
// different card here would be a second definition of what a product looks
// like — and the member price, wishlist heart and bag button would then have
// to be kept in step in two places.

import ProductCard from '../../ProductListing/ProductGrid/ProductCard';
import { DETAIL_RELATED } from '../constants';

import { S } from './styles';

/**
 * Props
 *  products     Product[]
 *  onOpen       (p) => void
 *  onAddToCart  (p, el) => void
 *  onWishlist   (p) => void
 *  isWished     (id) => boolean
 */
export default function RelatedProducts({
  products = [],
  onOpen,
  onAddToCart,
  onWishlist,
  isWished,
}) {
  if (!products.length) return null;

  return (
    <>
      <style>{S}</style>
      <section className="pdp-section" aria-labelledby="pdp-related-title">
        <div className="pdp-inner">
          <h2 className="pdp-section-title" id="pdp-related-title">
            {DETAIL_RELATED.title}
          </h2>

          <div className="prl-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={onOpen}
                onAddToCart={onAddToCart}
                onWishlist={onWishlist}
                isWished={isWished?.(product.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
