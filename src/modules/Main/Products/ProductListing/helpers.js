// modules/Products/Category/helpers.js

import { PRODUCT_CATEGORIES } from '@/constants/megaMenu';

// Turn a URL slug back into the canonical category name from PRODUCT_CATEGORIES.
// Falls back to a title-cased version of the slug if there's no exact match.
export const slugToCategory = (slug) => {
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const match = PRODUCT_CATEGORIES.find((c) => norm(c) === norm(slug));
  if (match) return match;
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

// Order a product list for the header's sort control. Returns a new array —
// the caller's list is left alone. Unknown values (and 'featured') keep the
// order the API returned.
export const sortProducts = (products, sort) => {
  const list = [...products];
  const num = (v, fallback) => (typeof v === 'number' ? v : fallback);

  switch (sort) {
    case 'price-asc':
      return list.sort((a, b) => num(a.price, Infinity) - num(b.price, Infinity));
    case 'price-desc':
      return list.sort((a, b) => num(b.price, -Infinity) - num(a.price, -Infinity));
    case 'rating':
      return list.sort((a, b) => num(b.rating, -1) - num(a.rating, -1));
    case 'name-asc':
      return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    default:
      return list;
  }
};
