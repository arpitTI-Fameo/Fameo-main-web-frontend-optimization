'use client';
// modules/Products/Brands/index.jsx
// Brands listing page — /products/brand
// Shows all partner brands. Clicking a brand filters products by that brand.

import { useRouter } from 'next/navigation';
import { PRODUCT_BRANDS } from '@/constants/megaMenu';
import { ROUTES } from '@/constants/routes';

import { BRAND_IMAGES } from './constants';
import { S } from './styles';

export default function Brands() {
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
