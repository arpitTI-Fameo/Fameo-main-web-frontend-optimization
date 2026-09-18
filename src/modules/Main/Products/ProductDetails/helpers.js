// modules/Main/Products/ProductDetails/helpers.js
// Pure resolution and shaping for the detail page. No React, no network.
//
// The page is fed by two sources that are joined here and nowhere else:
// @/constants/mockData PRODUCTS (the storefront row) and ./constants
// DETAIL_SKUS (the SKU record). Everything downstream sees one merged object.

import { PRODUCTS } from '@/constants/mockData';

import { toSlug } from '../helpers';

import {
  DETAIL_CARE_BODY,
  DETAIL_MAX_RATING,
  DETAIL_SHIPPING,
  DETAIL_SKUS,
  DETAIL_TABS,
} from './constants';

// Storefront row + SKU record → the single object every section renders from.
const merge = (base) => {
  const detail = DETAIL_SKUS[base.id] || {};
  const mrp = base.original && base.original > base.price ? base.original : null;

  return {
    ...base,
    ...detail,
    slug: toSlug(base.name),
    categorySlug: toSlug(base.category),
    // Money stays in rupees so inr() can print it directly.
    sellingPrice: base.price,
    mrp,
    savePercent: discountPercent(mrp, base.price),
    reviewCount: base.reviews,
    // `reviews` on the storefront row is a COUNT; on the SKU record it is the
    // review list. The list wins here — reviewCount above keeps the number.
    reviews: detail.reviews || [],
  };
};

export const DETAIL_CATALOGUE = PRODUCTS.map(merge);

// Whole rupees off, rounded — the "Save 13%" pill next to the price.
export function discountPercent(mrp, price) {
  if (!mrp || !price || mrp <= price) return null;
  return Math.round(((mrp - price) / mrp) * 100);
}

/**
 * Resolve a URL segment to a product.
 *
 * Matches the derived name slug first, then the raw id — a live row adapted by
 * productAdapter carries a UUID as its slug, and those links should still land
 * somewhere real. Falls back to the first product rather than 404ing, because
 * the catalogue here is dummy data standing in for the API: every card on the
 * listing grid has to open a populated page until the service is wired up.
 * Delete the fallback the day this reads from the products service.
 */
export function findDetailProduct(slug) {
  const wanted = toSlug(slug);
  const [first] = DETAIL_CATALOGUE;
  if (!wanted) return first;
  return (
    DETAIL_CATALOGUE.find((p) => p.slug === wanted) ||
    DETAIL_CATALOGUE.find((p) => String(p.id) === String(slug)) ||
    first
  );
}

// The tab strip's bodies. Description is authored per product; the other three
// are assembled from the SKU's structured fields plus the shared policy copy,
// so no product has to spell out a shipping paragraph twice.
export function buildDetailTabs(product) {
  if (!product) return [];

  const { length, width, height, unit } = product.dimensions || {};
  const hasDims = length != null && width != null && height != null;

  const bodies = {
    description: {
      body: product.description || [product.longDesc].filter(Boolean),
      specs: Object.entries(product.specs || {}).map(([label, value]) => ({ label, value })),
    },
    dimensions: {
      body: [
        hasDims
          ? `Assembled it measures ${length} × ${width} × ${height} ${unit}. Every figure below is taken from a production unit, not the drawing.`
          : 'Measurements for this item are taken from a production unit rather than the drawing.',
        'Check the packed size against your lift or stairwell before a delivery slot is booked.',
      ],
      specs: [
        hasDims && { label: 'Assembled', value: `${length} × ${width} × ${height} ${unit}` },
        product.weight && { label: 'Weight', value: product.weight },
        product.packedWeight && { label: 'Packed weight', value: product.packedWeight },
        product.unit && { label: 'Sold as', value: product.unit },
      ].filter(Boolean),
    },
    materials: {
      body: DETAIL_CARE_BODY,
      specs: product.materials || [],
    },
    shipping: {
      body: DETAIL_SHIPPING.body,
      specs: [
        product.leadTime && { label: 'Lead time', value: product.leadTime },
        ...DETAIL_SHIPPING.specs,
      ].filter(Boolean),
    },
  };

  return DETAIL_TABS.map((tab) => ({ ...tab, ...bodies[tab.id] })).filter(
    (tab) => tab.body?.length || tab.specs?.length
  );
}

// { 5: 78, 4: 16, ... } → rows ordered 5 down to 1, ready to render as bars.
export function ratingBars(breakdown = {}) {
  return Array.from({ length: DETAIL_MAX_RATING }, (_, i) => {
    const stars = DETAIL_MAX_RATING - i;
    return { stars, percent: Number(breakdown[stars]) || 0 };
  });
}

// The "You may also like" rail. Honours the SKU's own related ids, then tops
// up from the same category so the rail is never short.
export function relatedProducts(product, limit) {
  if (!product) return [];

  const picked = (product.related || [])
    .map((id) => DETAIL_CATALOGUE.find((p) => p.id === id))
    .filter(Boolean);

  const fill = DETAIL_CATALOGUE.filter(
    (p) => p.id !== product.id && !picked.some((q) => q.id === p.id)
  ).sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category));

  return [...picked, ...fill].slice(0, limit);
}

// Variant axis id → the value that starts selected (the first one).
export function defaultVariantSelection(axes = []) {
  return axes.reduce((acc, axis) => {
    const [first] = axis.values || [];
    if (first) acc[axis.id] = first.value;
    return acc;
  }, {});
}
