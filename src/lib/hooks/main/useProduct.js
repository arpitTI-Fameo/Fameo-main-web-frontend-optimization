'use client';

import { useQuery } from '@tanstack/react-query';
import { productKeys } from '@/lib/services/product/product.keys';
import {
  getProducts, getProduct, getProductsByCategory,
  getFeaturedProducts, getBestsellers, searchProducts,
} from '@/lib/services/product/product.client';

// Shared so an RSC prefetch and this hook cannot disagree about the key.
export const allProductsQueryOptions = (params = {}) => ({
  queryKey: productKeys.list(params),
  queryFn: () => getProducts(params),
  staleTime: 60_000,
});

export const useProducts = (params = {}, opts = {}) =>
  useQuery({ ...allProductsQueryOptions(params), ...opts });

export const useProduct = (slug, opts = {}) =>
  useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => getProduct(slug),
    enabled: Boolean(slug),
    ...opts,
  });

export const useProductsByCategory = (cat, params = {}, opts = {}) =>
  useQuery({
    queryKey: [...productKeys.lists(), 'category', cat, params],
    queryFn: () => getProductsByCategory(cat, params),
    enabled: Boolean(cat),
    ...opts,
  });

export const useFeaturedProducts = (opts = {}) =>
  useQuery({
    queryKey: productKeys.featured(),
    queryFn: getFeaturedProducts,
    ...opts,
  });

export const useBestsellers = (opts = {}) =>
  useQuery({
    queryKey: productKeys.bestsellers(),
    queryFn: getBestsellers,
    ...opts,
  });

export const useSearchProducts = (query, opts = {}) =>
  useQuery({
    queryKey: [...productKeys.all(), 'search', query],
    queryFn: () => searchProducts(query),
    enabled: Boolean(query),
    ...opts,
  });
