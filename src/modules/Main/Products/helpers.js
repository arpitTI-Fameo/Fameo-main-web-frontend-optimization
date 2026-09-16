// modules/Products/helpers.js

import { adaptProduct } from './productAdapter';

// products-mongo row (snake_case, paise) → the shape ShopSection/ProductDetail render
export const toUiProduct = (p) => {
  const a = adaptProduct(p);
  return {
    ...a,
    thumb: a.image,
    tagline: p.subcategory || '',
    desc: p.description || '',
    longDesc: p.description || '',
    original: null,
    rating: p.rating ?? null,
    reviews: p.reviews ?? 0,
    stock: a.stock ?? 99,
    features: p.features || [],
    specs: a.specs,
  };
};
