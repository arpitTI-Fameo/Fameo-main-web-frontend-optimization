'use client';
import { createServerAction } from '@/lib/api/action';
// services/product/product.client.js
// The product service: every product HTTP call in one place.
//
// Layering is component -> hook -> service -> request.

import { clientFetch } from '@/lib/api/client/fetcher';
import { productEndpoints } from '@/lib/api/endpoints';

export const getProductsAction = async (params = {}) => {
  return createServerAction({
    url: productEndpoints.getAll(),
    method: 'GET',
  });
};

export const getProductAction = async (slug) => {
  return createServerAction({
    url: productEndpoints.getOne(slug),
    method: 'GET',
  });
};

export const getProductsByCategoryAction = async (cat, params = {}) => {
  return createServerAction({
    url: productEndpoints.getByCategory(cat),
    method: 'GET',
  });
};

export const getFeaturedProductsAction = async () => {
  return createServerAction({
    url: productEndpoints.getFeatured(),
    method: 'GET',
  });
};

export const getBestsellersAction = async () => {
  return createServerAction({
    url: productEndpoints.getBestsellers(),
    method: 'GET',
  });
};

export const searchProductsAction = async (query) => {
  return createServerAction({
    url: productEndpoints.search(),
    method: 'GET',
    params: { q: query },
  });
};
