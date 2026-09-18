'use client';
// modules/Main/Products/ProductDetails/ProductGallery/GalleryThumbs/index.jsx
// The filmstrip under the main shot. Owns nothing — the gallery holds the
// active index and hands it down.

import { S } from './styles';

/**
 * Props
 *  images    string[]
 *  active    number
 *  onSelect  (index) => void
 *  alt       string    – product name, for each thumb's label
 */
export default function GalleryThumbs({ images = [], active = 0, onSelect, alt = '' }) {
  if (images.length < 2) return null;

  return (
    <>
      <style>{S}</style>
      <div className="pgt-strip" role="tablist" aria-label={`${alt} images`}>
        {images.map((src, i) => (
          <button
            type="button"
            key={`${src}-${i}`}
            role="tab"
            aria-selected={i === active}
            aria-label={`${alt} — view ${i + 1}`}
            className={`pgt-thumb${i === active ? ' is-active' : ''}`}
            onClick={() => onSelect?.(i)}
          >
            <img className="pgt-img" src={src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </>
  );
}
