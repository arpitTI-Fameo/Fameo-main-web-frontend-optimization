'use client';
// app/(main)/products/brand/page.js
// Brands listing page — /products/brand
// Shows all partner brands. Clicking a brand filters products by that brand.

import { useRouter } from 'next/navigation';
import { PRODUCT_BRANDS } from '@/constants/megaMenu';
import { ROUTES } from '@/constants/routes';

const BRAND_IMAGES = {
  Sony:       'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=400&q=80',
  Canon:      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80',
  Nikon:      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80',
  Fujifilm:   'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&q=80',
  DJI:        'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400&q=80',
  GoPro:      'https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?w=400&q=80',
  Sigma:      'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=400&q=80',
  Tamron:     'https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=400&q=80',
  Godox:      'https://images.unsplash.com/photo-1627483262769-04d0a1401487?w=400&q=80',
  Blackmagic: 'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=400&q=80',
  Insta360:   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
  Hollyland:  'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&q=80',
  Samyang:    'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=400&q=80',
  Laowa:      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
};

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  :root {
    --br-rose:#E8405A; --br-ink:#111118;
    --br-muted:#888898; --br-line:#EEEEF2;
    --br-surf:#F7F7FA; --br-white:#ffffff;
  }

  .br-page { background: var(--br-white); }

  /* hero */
  .br-hero {
    padding: 56px 56px 40px;
    border-bottom: 1px solid var(--br-line);
  }
  .br-hero-ey {
    font-family: 'Jost', sans-serif; font-size: 9px; font-weight: 500;
    letter-spacing: .28em; text-transform: uppercase; color: var(--br-rose);
    margin-bottom: 10px; display: flex; align-items: center; gap: 10px;
  }
  .br-hero-ey::before { content: ''; width: 20px; height: 1px; background: var(--br-rose); opacity: .6; }
  .br-hero-title {
    font-family: 'Cormorant Garamond', serif; font-size: clamp(36px,5vw,64px);
    font-weight: 300; color: var(--br-ink); line-height: 1.05;
  }
  .br-hero-title em { font-style: italic; color: var(--br-rose); }
  .br-hero-sub {
    font-size: 13px; font-weight: 300; color: var(--br-muted);
    margin-top: 12px; max-width: 480px; line-height: 1.7;
  }

  /* grid */
  .br-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1px; background: var(--br-line);
    margin: 0;
  }

  /* brand card */
  .br-card {
    background: var(--br-white); position: relative;
    overflow: hidden; cursor: pointer;
    aspect-ratio: 4/3;
    transition: transform .35s cubic-bezier(.22,1,.36,1);
  }
  .br-card:hover { z-index: 1; transform: scale(1.02); }
  .br-card-img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    filter: grayscale(.6) brightness(.75);
    transition: filter .4s;
  }
  .br-card:hover .br-card-img { filter: grayscale(0) brightness(.65); }
  .br-card-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(17,17,24,.8) 0%, transparent 55%);
  }
  .br-card-overlay::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 2px; background: var(--br-rose);
    transform: scaleX(0); transform-origin: left;
    transition: transform .32s cubic-bezier(.22,1,.36,1);
  }
  .br-card:hover .br-card-overlay::after { transform: scaleX(1); }
  .br-card-info {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 18px 20px;
  }
  .br-card-name {
    font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300;
    letter-spacing: .1em; text-transform: uppercase; color: #fff; line-height: 1;
  }
  .br-card-cta {
    font-family: 'Jost', sans-serif; font-size: 8px; font-weight: 400;
    letter-spacing: .22em; text-transform: uppercase; color: rgba(255,255,255,.5);
    margin-top: 4px; display: flex; align-items: center; gap: 6px;
    transition: color .2s;
  }
  .br-card:hover .br-card-cta { color: var(--br-rose); }
  .br-card-arrow {
    width: 16px; height: 1px; background: currentColor; position: relative;
    flex-shrink: 0; transition: width .2s;
  }
  .br-card:hover .br-card-arrow { width: 22px; }
  .br-card-arrow::after {
    content: ''; position: absolute; right: 0; top: -2.5px;
    width: 5px; height: 5px;
    border-top: 1px solid currentColor; border-right: 1px solid currentColor;
    transform: rotate(45deg);
  }

  @media (max-width: 768px) {
    .br-hero { padding: 40px 20px 28px; }
    .br-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

export default function BrandsPage() {
  const router = useRouter();

  const handleBrandClick = (brand) => {
    router.push(`${ROUTES.PRODUCTS}?brand=${encodeURIComponent(brand)}`);
  };

  return (
    <>
      <style>{S}</style>
      <div className="br-page">

        {/* Hero */}
        <div className="br-hero">
          <p className="br-hero-ey">Our Partners</p>
          <h1 className="br-hero-title">Trusted <em>Brands</em></h1>
          <p className="br-hero-sub">
            Every brand in the Fameo store is vetted by working creators.
            Only gear that passes the field test makes it to our shelves.
          </p>
        </div>

        {/* Brand grid */}
        <div className="br-grid">
          {PRODUCT_BRANDS.map((brand) => (
            <div
              key={brand}
              className="br-card"
              onClick={() => handleBrandClick(brand)}
              role="button"
              tabIndex={0}
              aria-label={`Shop ${brand}`}
              onKeyDown={(e) => e.key === 'Enter' && handleBrandClick(brand)}
            >
              <img
                className="br-card-img"
                src={BRAND_IMAGES[brand] || 'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=400&q=80'}
                alt={brand}
                loading="lazy"
              />
              <div className="br-card-overlay" />
              <div className="br-card-info">
                <h2 className="br-card-name">{brand}</h2>
                <p className="br-card-cta">
                  Shop <div className="br-card-arrow" />
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}