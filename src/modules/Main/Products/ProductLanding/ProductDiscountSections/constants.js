// modules/Main/Products/ProductLanding/ProductDiscountSections/constants.js
// Copy + imagery for the landing discount / category strip.
// Scoped to this section only — these crops are shot-on-white product cutouts,
// deliberately different from the editorial category photos used elsewhere.

// Centre banner — the promo that sits between the two category columns.
export const DISCOUNT_BANNER = {
  eyebrow: 'Creator Gear Essentials',
  headline: 'Upto 40% Off',
};

// Three category tiles. `slug` feeds ROUTES.CATEGORY() on "View All".
export const DISCOUNT_TILES = {
  left: {
    slug: 'cameras',
    label: 'Cameras',
    count: '1230+ item',
    // TEMP preview — real: 'https://images.unsplash.com/photo-1606980625105-1a3b1d2b3d2b?w=900&q=80'
    img: '/ProductImages/camera-gimbal.webp',
    alt: 'Mirrorless camera body',
  },
  mid: {
    slug: 'lighting',
    label: 'Lighting',
    count: '678+ item',
    // TEMP preview — real: 'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=900&q=80'
    img: '/ProductImages/camera-gimbal.webp',
    alt: 'Studio light on a stand',
  },
  right: {
    slug: 'lenses',
    label: 'Lenses',
    count: '2000+ item',
    // TEMP preview — real: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=900&q=80'
    img: '/ProductImages/camera-gimbal.webp',
    alt: 'Prime camera lens',
  },
};
