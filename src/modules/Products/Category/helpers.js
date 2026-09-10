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
