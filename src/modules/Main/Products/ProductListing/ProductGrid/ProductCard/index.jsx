'use client';
// modules/Main/Products/ProductListing/ProductCard/index.jsx
// Listing card — grey tile, rating top-left, wishlist top-right, product shot
// in the middle, name + price bottom-left and the bag button bottom-right.
//
// Purely presentational: every action is a callback owned by the page.

// Member pricing. The listing grid is a storefront surface, so it prints the
// plan price rather than the raw listed price — a Popular or Elite member
// browsing a category would otherwise see no discount at all.
import PlanPrice from '../../../ProductDetails/PlanPrice';

import { BagIcon, HeartIcon, StarIcon } from './icons';
import { S } from './styles';

/**
 * Props
 *  product      Product
 *  onOpen       (p) => void       – open the detail overlay
 *  onAddToCart  (p, el) => void   – el is handed to flyToCart for the arc
 *  onWishlist   (p) => void
 *  isWished     boolean
 */
export default function ProductCard({
  product,
  onOpen,
  onAddToCart,
  onWishlist,
  isWished = false,
}) {
  const open = () => onOpen?.(product);

  const add = (e) => {
    e.stopPropagation();
    onAddToCart?.(product, e.currentTarget.closest('.plc-card') || e.currentTarget);
  };

  const wish = (e) => {
    e.stopPropagation();
    onWishlist?.(product);
  };

  return (
    <>
      <style>{S}</style>
      <article
        className="plc-card"
        role="button"
        tabIndex={0}
        aria-label={product.name}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
          open();
        }}
      >
        <div className="plc-top">
          {product.rating != null && (
            <span className="plc-rating">
              <StarIcon />
              {product.rating}
            </span>
          )}
          <button
            type="button"
            className={`plc-wish${isWished ? ' is-on' : ''}`}
            onClick={wish}
            aria-label={isWished ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
            aria-pressed={isWished}
          >
            <HeartIcon filled={isWished} />
          </button>
        </div>

        <div className="plc-media">
          <img
            className="plc-img"
            // src={product.thumb || product.image || product.images?.[0]}
            src="/ProductImages/camera-gimbal.webp"
            alt={product.name}
            loading="lazy"
          />
        </div>

        <div className="plc-foot">
          <div className="plc-text">
            <h3 className="plc-name">{product.name}</h3>
            <p className="plc-price">
              <PlanPrice price={product.price} showUpsell={false} />
            </p>
          </div>
          <button
            type="button"
            className="plc-bag"
            onClick={add}
            aria-label={`Add ${product.name} to bag`}
          >
            <BagIcon />
          </button>
        </div>
      </article>
    </>
  );
}
