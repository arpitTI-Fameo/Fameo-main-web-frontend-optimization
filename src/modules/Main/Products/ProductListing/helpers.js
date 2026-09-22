// modules/Products/Category/helpers.js

import { PRODUCT_CATEGORIES } from '@/constants/megaMenu';
import { sortConfig } from './constants';

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
  const config = sortConfig[sort];
  if (!config) return [...products];

  const { field, order } = config;
  const numOrder = parseInt(order, 10);

  // Helper to resolve nested dot-notation paths (e.g. "skuPrice.salePrice")
  const getVal = (obj, path) => path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined) ? acc[part] : undefined, obj);

  return [...products].sort((a, b) => {
    let valA = getVal(a, field);
    let valB = getVal(b, field);

    // Provide fallbacks for the current mock UI structure while we transition to full API typings
    if (valA === undefined) {
      if (field.toLowerCase().includes('price')) valA = a.price;
      else if (field.toLowerCase().includes('rating')) valA = a.rating;
      else if (field.toLowerCase().includes('name')) valA = a.name;
    }
    if (valB === undefined) {
      if (field.toLowerCase().includes('price')) valB = b.price;
      else if (field.toLowerCase().includes('rating')) valB = b.rating;
      else if (field.toLowerCase().includes('name')) valB = b.name;
    }

    if (typeof valA === 'string' && typeof valB === 'string') {
      return valA.localeCompare(valB) * numOrder;
    }

    const numA = typeof valA === 'number' ? valA : 0;
    const numB = typeof valB === 'number' ? valB : 0;
    return (numA - numB) * numOrder;
  });
};
