'use client';
// modules/Main/Products/ProductDetails/ProductGallery/index.jsx
// Left half of the top block: the big shot, its badge and wishlist toggle,
// with the thumbnail strip underneath.
//
// Owns exactly one thing — which image is showing. Wishlist state belongs to
// the page, because the header bag and the related rail read the same store.

import { useEffect, useState } from 'react';

import { HeartIcon } from '../icons';

import GalleryThumbs from './GalleryThumbs';
import { S } from './styles';

/**
 * Props
 *  images      string[]
 *  name        string
 *  badge       string|null       – 'New', 'Sale', 'Bestseller' …
 *  isWished    boolean
 *  onWishlist  () => void
 */
export default function ProductGallery({
  images = [],
  name = '',
  badge = null,
  isWished = false,
  onWishlist,
}) {
  const [active, setActive] = useState(0);

  // A different product means a different filmstrip — start at its first shot.
  useEffect(() => { setActive(0); }, [name]);

  const shots = images.filter(Boolean);
  const current = shots[active] || shots[0];

  return (
    <>
      <style>{S}</style>
      <section className="pgl-wrap" aria-label={`${name} gallery`}>
        <div className="pgl-stage">
          {badge && <span className="pgl-badge">{badge}</span>}

          <button
            type="button"
            className={`pgl-wish${isWished ? ' is-on' : ''}`}
            onClick={onWishlist}
            aria-pressed={isWished}
            aria-label={isWished ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
          >
            <HeartIcon filled={isWished} size={18} />
          </button>

          {current ? (
            <img className="pgl-img" src={current} alt={name} />
          ) : (
            <div className="pgl-empty" aria-hidden="true" />
          )}
        </div>

        <GalleryThumbs
          images={shots}
          active={active}
          onSelect={setActive}
          alt={name}
        />
      </section>
    </>
  );
}
