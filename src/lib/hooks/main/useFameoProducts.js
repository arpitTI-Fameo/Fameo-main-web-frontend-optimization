'use client';

import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { fameoProductsKeys, getLiveProducts, getStorefrontProducts, getStorefrontProduct, getProduct, getCart, getMyOrders, getOrder, getMyTickets, addToCart, removeFromCart, clearCart, checkout, raiseTicket, syncCartToServer } from '@/lib/services/product/fameoProducts.client';

export const useLiveProducts = (params = {}, opts = {}) => useQuery({ queryKey: fameoProductsKeys.liveProducts(params), queryFn: () => getLiveProducts(params), ...opts });

export const useStorefrontProducts = (params = {}, opts = {}) => useQuery({ queryKey: fameoProductsKeys.storefrontProducts(params), queryFn: () => getStorefrontProducts(params), ...opts });

export const useStorefrontProduct = (id, opts = {}) => useQuery({ queryKey: fameoProductsKeys.storefrontProduct(id), queryFn: () => getStorefrontProduct(id), enabled: !!id, ...opts });

export const useProduct = (id, opts = {}) => useQuery({ queryKey: fameoProductsKeys.product(id), queryFn: () => getProduct(id), enabled: !!id, ...opts });

export const useCart = (opts = {}) => useQuery({ queryKey: fameoProductsKeys.cart(), queryFn: getCart, ...opts });

export const useMyOrders = (opts = {}) => useQuery({ queryKey: fameoProductsKeys.orders(), queryFn: getMyOrders, ...opts });

export const useOrder = (id, opts = {}) => useQuery({ queryKey: fameoProductsKeys.order(id), queryFn: () => getOrder(id), enabled: !!id, ...opts });

export const useMyTickets = (opts = {}) => useQuery({ queryKey: fameoProductsKeys.tickets(), queryFn: getMyTickets, ...opts });

export const useAddToCartMutation = (opts = {}) => useApiMutation({ mutationFn: ({ productId, quantity }) => addToCart(productId, quantity), invalidate: [fameoProductsKeys.cart()], ...opts });

export const useRemoveFromCartMutation = (opts = {}) => useApiMutation({ mutationFn: removeFromCart, invalidate: [fameoProductsKeys.cart()], ...opts });

export const useClearCartMutation = (opts = {}) => useApiMutation({ mutationFn: clearCart, invalidate: [fameoProductsKeys.cart()], ...opts });

export const useCheckoutMutation = (opts = {}) => useApiMutation({ mutationFn: ({ cart_id, payment_ref, shipping_address }) => checkout(cart_id, payment_ref, shipping_address), invalidate: [fameoProductsKeys.cart(), fameoProductsKeys.orders()], ...opts });

export const useRaiseTicketMutation = (opts = {}) => useApiMutation({ mutationFn: raiseTicket, invalidate: [fameoProductsKeys.tickets()], ...opts });

export const useSyncCartToServerMutation = (opts = {}) => useApiMutation({ mutationFn: syncCartToServer, invalidate: [fameoProductsKeys.cart()], ...opts });