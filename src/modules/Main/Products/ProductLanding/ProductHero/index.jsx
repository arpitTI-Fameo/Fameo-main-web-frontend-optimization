'use client';
// modules/Main/Products/ProductLanding/ProductHero/index.jsx
// Landing hero — stone panel with the headline, tab chips and a feature card on
// the left; a full-bleed feature image with a glass caption on the right.
// The chips swap both panels, so one tab owns the whole hero.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

import { ArrowUpRightIcon, StarIcon } from './icons';
import { HERO_CTA, HERO_TABS, HERO_TITLE } from './constants';
import { S } from './styles';

/**
 * Props
 *  title  string   – headline in the stone panel
 *  tabs   [{ id, label, card, feature }] – see ./constants
 */
export default function ProductHero({ title = HERO_TITLE, tabs = HERO_TABS }) {
  const router = useRouter();
  const [activeId, setActiveId] = useState(tabs[0]?.id);

  const tab = tabs.find((t) => t.id === activeId) || tabs[0];
  if (!tab) return null;

  const { card, feature } = tab;
  const openCategory = (slug) => router.push(ROUTES.CATEGORY(slug));

  return (
    <>
      <style>{S}</style>
      <section className="phero-wrap" aria-label={title}>
        <div className="phero-row">

          {/* left — headline, chips, feature card */}
          <div className="phero-left">
            <h1 className="phero-title">{title}</h1>

            <div className="phero-chips" role="tablist">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={t.id === activeId}
                  className={`phero-chip${t.id === activeId ? ' is-on' : ''}`}
                  onClick={() => setActiveId(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <article
              className="phero-card"
              role="button"
              tabIndex={0}
              aria-label={card.title}
              onClick={() => openCategory(card.slug)}
              onKeyDown={(e) => e.key === 'Enter' && openCategory(card.slug)}
            >
              <div className="phero-card-body">
                <p className="phero-card-tag">{tab.label}</p>
                <h2 className="phero-card-title">{card.title}</h2>
                <p className="phero-card-desc">{card.desc}</p>
                <button
                  type="button"
                  className="phero-card-go"
                  onClick={(e) => { e.stopPropagation(); openCategory(card.slug); }}
                  aria-label={`Open ${card.title}`}
                >
                  <ArrowUpRightIcon />
                </button>
              </div>
              <div className="phero-card-media">
                <img className="phero-card-img" src={card.img} alt={card.title} />
              </div>
            </article>
          </div>

          {/* right — feature image with glass caption */}
          <div className="phero-right">
            <img className="phero-right-img" src={feature.img} alt={feature.title} />

            <div className="phero-glass">
              <div className="phero-glass-top">
                <h2 className="phero-glass-title">{feature.title}</h2>
                <p className="phero-rating">
                  <span className="phero-stars">
                    {[0, 1, 2, 3, 4].map((i) => <StarIcon key={i} />)}
                  </span>
                  {feature.rating}
                </p>
              </div>

              <p className="phero-glass-desc">{feature.desc}</p>

              <div className="phero-glass-actions">
                <button
                  type="button"
                  className="phero-view"
                  onClick={() => openCategory(feature.slug)}
                >
                  {HERO_CTA}
                </button>
                <button
                  type="button"
                  className="phero-go"
                  onClick={() => openCategory(feature.slug)}
                  aria-label={`Open ${feature.title}`}
                >
                  <ArrowUpRightIcon />
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
