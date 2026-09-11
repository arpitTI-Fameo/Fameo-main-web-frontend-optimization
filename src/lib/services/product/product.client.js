'use client';
// services/product/product.client.js
// The product service: every product HTTP call in one place.
//
// Layering is component -> hook -> service -> request.

import { clientFetch } from '@/lib/api/client/fetcher';
import { productEndpoints } from '@/lib/api/endpoints';

export const getProducts = (params = {}) =>
  clientFetch(productEndpoints.getAll(), { params });

export const getProduct = (slug) =>
  clientFetch(productEndpoints.getOne(slug));

export const getProductsByCategory = (cat, params = {}) =>
  clientFetch(productEndpoints.getByCategory(cat), { params });

export const getFeaturedProducts = () =>
  clientFetch(productEndpoints.getFeatured());

export const getBestsellers = () =>
  clientFetch(productEndpoints.getBestsellers());

export const searchProducts = (query) =>
  clientFetch(productEndpoints.search(), { params: { q: query } });
