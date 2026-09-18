// modules/Products/helpers.js

import { ROUTES } from '@/constants/routes';

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

// URL-safe segment from any display string. The inverse of ProductListing's
// slugToCategory(), and the same normaliser both the category segment and the
// product segment of a detail URL are built with — 'Bags & Tripods' and
// 'LUMIÈRE PRO' have to survive the round trip.
export const toSlug = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// Href for a product's detail page. Live rows carry a UUID slug from
// adaptProduct(); mock rows have only a name, so derive one.
export const productHref = (product) =>
  ROUTES.PRODUCT(toSlug(product?.category), product?.slug || toSlug(product?.name));
