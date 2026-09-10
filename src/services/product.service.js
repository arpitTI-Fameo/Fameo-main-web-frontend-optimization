import { productApi } from '@/lib/api';

// ─── Get all products with filters ───────────────────────────────────────────
// Used by: products/page.js (ShopSection)
export const getProducts = async (params = {}) => {
  const res = await productApi.getAll(params);
  return res.data; // { products, total, page, totalPages, hasMore }
};

// ─── Get single product ───────────────────────────────────────────────────────
// Used by: products/[productSlug]/page.js
export const getProduct = async (slug) => {
  const res = await productApi.getOne(slug);
  return res.data;
};

// ─── Get by category ─────────────────────────────────────────────────────────
// Used by: products/[category]/page.js
export const getByCategory = async (category, params = {}) => {
  const res = await productApi.getByCategory(category, params);
  return res.data;
};

// ─── Get featured products ────────────────────────────────────────────────────
// Used by: home page hero
export const getFeatured = async (limit = 8) => {
  const res = await productApi.getFeatured(limit);
  return res.data;
};

// ─── Get bestsellers ──────────────────────────────────────────────────────────
// Used by: home page bestsellers strip
export const getBestsellers = async (limit = 6) => {
  const res = await productApi.getBestsellers(limit);
  return res.data;
};

// ─── Search ───────────────────────────────────────────────────────────────────
// Used by: search bar in MainNav
export const searchProducts = async (q) => {
  if (!q?.trim()) return [];
  const res = await productApi.search(q);
  return res.data;
};