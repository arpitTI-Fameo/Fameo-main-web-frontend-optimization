'use client';
// modules/Main/Products/ProductListing/PromoBanner/index.jsx
// Full-width closing banner — scene photo, headline, sub-line and a CTA.
//
// The site footer is NOT rendered here: app/(main)/layout.js already mounts
// MainFooter below every page, and a second one would double up.

import { S } from './styles';

/**
 * Props
 *  image       string
 *  imageAlt    string
 *  titleTop    string   – first headline line
 *  titleBottom string   – second headline line
 *  subtitle    string
 *  ctaLabel    string
 *  onCta       () => void
 */
export default function PromoBanner({
  image,
  imageAlt = '',
  titleTop,
  titleBottom,
  subtitle,
  ctaLabel,
  onCta,
}) {
  return (
    <>
      <style>{S}</style>
      <section className="pb-wrap">
        <div className="pb-inner">
          {image && <img className="pb-img" src={image} alt={imageAlt} loading="lazy" />}
          <span className="pb-veil" aria-hidden="true" />

          <div className="pb-body">
            <h2 className="pb-title">
              {titleTop}
              <br />
              {titleBottom}
            </h2>
            {subtitle && <p className="pb-sub">{subtitle}</p>}
            {ctaLabel && (
              <button type="button" className="pb-cta" onClick={onCta}>
                {ctaLabel}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 12h15" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
