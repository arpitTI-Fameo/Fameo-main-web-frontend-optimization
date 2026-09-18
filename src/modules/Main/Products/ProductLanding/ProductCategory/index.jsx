'use client';
// modules/Main/Products/ProductLanding/ProductCategory/index.jsx
// Landing inspiration rail — black intro panel on the left, a horizontally
// snapped row of category cards on the right that runs off the edge.
// The leading visible card is the "active" one: it carries the notched corner,
// the open button and the white caption panel.

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

import { ArrowRightIcon, ArrowUpRightIcon, HeroWaves } from './icons';
import { CATEGORY_HERO, CATEGORY_SLIDES } from './constants';
import { S } from './styles';
import ProductHeading from '../ProductHeading';

/**
 * Props
 *  hero    { title, subtitle, cta }
 *  slides  [{ n, room, title, slug, img }]
 */
export default function ProductCategory({
  hero = CATEGORY_HERO,
  slides = CATEGORY_SLIDES,
}) {
  const router = useRouter();
  const railRef = useRef(null);
  const [active, setActive] = useState(0);

  const openCategory = (slug) => router.push(ROUTES.CATEGORY(slug));

  // One card plus the flex gap — read from the DOM so the clamped card width
  // and gap never have to be duplicated here.
  const step = useCallback(() => {
    const rail = railRef.current;
    const card = rail?.querySelector('.pc-card');
    if (!rail || !card) return 0;
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    return card.offsetWidth + gap;
  }, []);

  const onScroll = useCallback(() => {
    const rail = railRef.current;
    const s = step();
    if (!rail || !s) return;
    setActive(Math.round(rail.scrollLeft / s));
  }, [step]);

  const next = useCallback(() => {
    const rail = railRef.current;
    const s = step();
    if (!rail || !s) return;
    const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
    rail.scrollTo({ left: atEnd ? 0 : rail.scrollLeft + s, behavior: 'smooth' });
  }, [step]);

  return (
    <>
      <style>{S}</style>
      <section className="pc-wrap" aria-label={hero.title}>
        
        <ProductHeading
          eyebrow="Curated Collections"
          title={<>Browse by <em>category</em></>}
          linkText="View All"
          onLinkClick={() => router.push(ROUTES.PRODUCTS)}
          className="pc-head-padding"
        />

        <div className="pc-row">

          <div className="pc-hero">
            <HeroWaves />
            <h2 className="pc-hero-title">{hero.title}</h2>
            <p className="pc-hero-sub">{hero.subtitle}</p>
            <button
              type="button"
              className="pc-hero-cta"
              onClick={() => router.push(ROUTES.PRODUCTS)}
            >
              {hero.cta}
            </button>
          </div>

          <div className="pc-rail-shell">
            <div className="pc-rail" ref={railRef} onScroll={onScroll}>
              {slides.map((s, i) => (
                <article
                  key={s.slug}
                  className={`pc-card${i === active ? ' is-active' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${s.room} — ${s.title}`}
                  onClick={() => openCategory(s.slug)}
                  onKeyDown={(e) => e.key === 'Enter' && openCategory(s.slug)}
                >
                  <div className="pc-card-frame">
                    <img className="pc-card-img" src={s.img} alt={s.title} loading="lazy" />
                  </div>

                  {i === active && (
                    <>
                      <button
                        type="button"
                        className="pc-card-open"
                        onClick={(e) => { e.stopPropagation(); openCategory(s.slug); }}
                        aria-label={`Open ${s.title}`}
                      >
                        <ArrowUpRightIcon />
                      </button>

                      <div className="pc-card-info">
                        <p className="pc-card-meta">
                          {s.n} <span className="pc-dash" aria-hidden="true" /> {s.room}
                        </p>
                        <h3 className="pc-card-title">{s.title}</h3>
                      </div>
                    </>
                  )}
                </article>
              ))}
            </div>

            <button
              type="button"
              className="pc-next"
              onClick={next}
              aria-label="Next inspiration"
            >
              <ArrowRightIcon />
            </button>
          </div>

        </div>
      </section>
    </>
  );
}
