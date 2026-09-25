// modules/Main/Products/ProductDetails/helpers.js
// Pure resolution and shaping for the detail page. No React, no network.
//
// The page is fed by two sources that are joined here and nowhere else:
// @/constants/mockData PRODUCTS (the storefront row) and ./constants
// DETAIL_SKUS (the SKU record). Everything downstream sees one merged object.

import { PRODUCTS } from '@/constants/mockData';

import { toSlug } from '../helpers';
import { adaptProduct } from '../productAdapter';

import {
  DETAIL_CARE_BODY,
  DETAIL_HIDDEN_SPECS,
  DETAIL_MAX_RATING,
  DETAIL_SHIPPING,
  DETAIL_SKUS,
  DETAIL_SPEC_LABELS,
  DETAIL_TAB_FALLBACK_LABELS,
  DETAIL_TABS,
} from './constants';

// Storefront row + SKU record → the single object every section renders from.
export const mergeDetailProduct = (base) => {
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

export const DETAIL_CATALOGUE = PRODUCTS.map(mergeDetailProduct);

/* ── live catalogue rows ─────────────────────────────────────────────────── */

const HIDDEN_SPECS = new Set(DETAIL_HIDDEN_SPECS);

// "Mirrorless Cameras ø Nikon" — the sheet joins a path with a stray glyph.
const SUBCATEGORY_SEP = /\s+[ø›»>|]\s+/;

// One sheet cell → display text, or null when there is nothing to show.
function specValue(key, value) {
  if (value == null || value === '' || typeof value === 'object') return null;
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';

  const text = String(value).trim().replace(/\.$/, '');
  if (!text) return null;
  if (key === 'GST') return text.replace(/^GST\s*/i, '');            // "GST 18%" → "18%"
  if (key === 'Dimensions') return text.replace(/\s*x\s*/gi, ' × ');
  // "china" → "China", but "iPhone" stays as the sheet wrote it.
  return text === text.toLowerCase() ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

// "Kit Lens option: Nikon Z7II With 24-70mm" → one pill axis per labelled
// pair. The payload names only this SKU's own value, not the rest of its
// variant group, so each axis carries the one option, already selected.
function liveVariantAxes(text) {
  return String(text || '')
    .split(/\s*[;|]\s*/)
    .map((pair) => {
      const at = pair.indexOf(':');
      const label = pair.slice(0, at).trim();
      const value = pair.slice(at + 1).trim();
      if (at < 1 || !label || !value) return null;
      return {
        id: toSlug(label),
        label,
        type: 'pill',
        values: [{ value: toSlug(value), label: value }],
      };
    })
    .filter(Boolean);
}

/**
 * A Products service row → the same merged object the dummy catalogue yields.
 *
 * The service sends no copy of its own — no description, tagline or
 * highlights — so those are drawn from facts it does send rather than left
 * blank or invented: the variant group names the product, the spec sheet
 * supplies manufacturer and origin, and the ERP bookkeeping is dropped.
 */
export function liveDetailProduct(raw) {
  const base = adaptProduct(raw);
  const sheet = raw.specs || {};
  const fact = (key) => specValue(key, sheet[key]);

  const type = String(raw.subcategory || '').split(SUBCATEGORY_SEP)[0].trim();
  const axes = liveVariantAxes(raw.variant_values);
  const group = raw.variant_group_name?.trim();

  const specs = {
    // Brand, model and type lead; the sheet's own order follows.
    Brand: base.brand,
    Model: fact('Model'),
    Type: type,
    ...Object.fromEntries(axes.map((a) => [a.label, a.values[0].label])),
  };
  Object.keys(sheet).forEach((key) => {
    if (!HIDDEN_SPECS.has(key)) specs[DETAIL_SPEC_LABELS[key] || key] = fact(key);
  });

  const origin = fact('Country Of Origin');
  const maker = fact('Manufacturer');
  const gst = fact('GST');

  return mergeDetailProduct({
    ...base,
    tagline: group && group !== base.name ? group : [base.brand, type].filter(Boolean).join(' · '),
    variantAxes: axes,
    highlights: [
      maker && `Manufactured by ${maker}`,
      origin && `Country of origin: ${origin}`,
      gst && `GST invoice included (${gst})`,
    ].filter(Boolean),
    specs: Object.fromEntries(Object.entries(specs).filter(([, value]) => value)),
    // Catalogue shots are packshots on white — framed whole, never cropped.
    imageFit: 'contain',
  });
}

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
  const description = product.description || [product.longDesc].filter(Boolean);
  const materials = product.materials || [];

  // Renames a tab for what it holds when its authored half is missing.
  const fallback = (id, missing) => (missing ? { label: DETAIL_TAB_FALLBACK_LABELS[id] } : {});

  const bodies = {
    description: {
      body: description,
      specs: Object.entries(product.specs || {}).map(([label, value]) => ({ label, value })),
      ...fallback('description', !description.length),
    },
    // Only a measured SKU gets this tab. A live row's single "Dimensions"
    // figure already sits in its spec sheet, and the copy below is about
    // assembled size, which that figure does not claim to be.
    dimensions: (hasDims || product.weight || product.packedWeight) && {
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
      specs: materials,
      ...fallback('materials', !materials.length),
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
