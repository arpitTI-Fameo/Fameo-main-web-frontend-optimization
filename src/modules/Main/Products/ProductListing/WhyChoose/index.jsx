'use client';
// modules/Main/Products/ProductListing/WhyChoose/index.jsx
// Two-column value-prop block: copy plus a 2×2 feature grid on the left,
// a lifestyle shot on the right. Presentational — content comes from props.

import FeatureIcon from './icons';
import { S } from './styles';

/**
 * Props
 *  title     string
 *  subtitle  string
 *  features  { id, icon, title, text }[]
 *  image     string
 *  imageAlt  string
 */
export default function WhyChoose({
  title,
  subtitle,
  features = [],
  image,
  imageAlt = '',
}) {
  return (
    <>
      <style>{S}</style>
      <section className="wc-wrap" aria-label={title}>
        <div className="wc-inner">
          <div className="wc-copy">
            <h2 className="wc-title">{title}</h2>
            {subtitle && <p className="wc-sub">{subtitle}</p>}

            <ul className="wc-grid">
              {features.map((f) => (
                <li key={f.id} className="wc-item">
                  <span className="wc-icon">
                    <FeatureIcon name={f.icon} />
                  </span>
                  <h3 className="wc-item-title">{f.title}</h3>
                  <p className="wc-item-text">{f.text}</p>
                </li>
              ))}
            </ul>
          </div>

          {image && (
            <div className="wc-media">
              <img className="wc-img" src={image} alt={imageAlt} loading="lazy" />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
