'use client';
// modules/Main/Products/ProductLanding/ProductDiscountSections/index.jsx
// Landing discount / category strip — three category tiles with the promo
// banner sitting between the left and right columns.
// "View All" routes to the category page, same as CollectionShowcase does.

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

import { DISCOUNT_BANNER, DISCOUNT_TILES } from './constants';
import { S } from './styles';
import ProductHeading from '../ProductHeading';

function CategoryTile({ tile, className, onOpen }) {
  return (
    <article className={`pdl-card ${className}`}>
      <div className="pdl-card-content">
        <p className="pdl-count">{tile.count}</p>
        <h3 className="pdl-title">{tile.label}</h3>
        <button
          type="button"
          className="pdl-link"
          onClick={() => onOpen(tile.slug)}
          aria-label={`View all ${tile.label}`}
        >
          View All <span className="pdl-arrow" aria-hidden="true" />
        </button>
      </div>
      <div className="pdl-media">
        <img className="pdl-img" src={tile.img} alt={tile.alt} loading="lazy" />
      </div>
    </article>
  );
}

/**
 * Props
 *  banner  { eyebrow, headline }        – centre promo copy
 *  tiles   { left, mid, right }         – category tiles, see ./constants
 */
export default function ProductDiscountSections({
  banner = DISCOUNT_BANNER,
  tiles = DISCOUNT_TILES,
}) {
  const router = useRouter();
  const openCategory = (slug) => router.push(ROUTES.CATEGORY(slug));

  return (
    <>
      <style>{S}</style>
      <section className="pdl-wrap" aria-label="Category offers">
        <ProductHeading
          eyebrow="Latest Articles"
          title={<>Featured <em>Categories</em></>}
          linkText="More Categories"
          onLinkClick={() => router.push(ROUTES.PRODUCTS)}
        />

        <div className="pdl-grid">

          <CategoryTile tile={tiles.left} className="pdl-side pdl-left" onOpen={openCategory} />

          <div className="pdl-banner">
            <p className="pdl-banner-ey">{banner.eyebrow}</p>
            <h2 className="pdl-banner-title">{banner.headline}</h2>
          </div>

          <CategoryTile tile={tiles.mid} className="pdl-mid" onOpen={openCategory} />

          <CategoryTile tile={tiles.right} className="pdl-side pdl-right" onOpen={openCategory} />

        </div>
      </section>
    </>
  );
}
