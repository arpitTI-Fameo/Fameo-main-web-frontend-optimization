import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import {
  getLiveProductsAction,
  getStorefrontProductsAction,
  getStorefrontProductAction,
  getProductAction,
  getCartAction,
  getMyOrdersAction,
  getOrderAction,
  getMyTicketsAction,
  addToCartAction,
  checkoutAction,
  removeFromCartAction,
  clearCartAction,
  raiseTicketAction,
  syncCartToServerAction
} from '@/lib/services';

// ── Keys ───────────────────────────────────────────────────────────────────
export const fameoProductsKeys = {
  all: ['fameoProducts'],
  liveProducts: (params) => [...fameoProductsKeys.all, 'liveProducts', params],
  storefrontProducts: (params) => [...fameoProductsKeys.all, 'storefrontProducts', params],
  storefrontProduct: (id) => [...fameoProductsKeys.all, 'storefrontProduct', id],
  product: (id) => [...fameoProductsKeys.all, 'product', id],
  cart: () => [...fameoProductsKeys.all, 'cart'],
  orders: () => [...fameoProductsKeys.all, 'orders'],
  order: (id) => [...fameoProductsKeys.all, 'order', id],
  tickets: () => [...fameoProductsKeys.all, 'tickets'],
};

export const productKeys = {
  all: () => ['product'],
  lists: () => [...productKeys.all(), 'list'],
  list: (params) => [...productKeys.lists(), params],
  details: () => [...productKeys.all(), 'detail'],
  detail: (slug) => [...productKeys.details(), slug],
  featured: () => [...productKeys.all(), 'featured'],
  bestsellers: () => [...productKeys.all(), 'bestsellers'],
};


export const useLiveProducts = (params = {}, opts = {}) => useQuery({
  queryKey: fameoProductsKeys.liveProducts(params), queryFn: async () => {
    const response = await getLiveProductsAction(params);
    if (!response.code) throw response;
    return response.result;
  }, ...opts
});

export const useStorefrontProducts = (params = {}, opts = {}) => useQuery({
  queryKey: fameoProductsKeys.storefrontProducts(params), queryFn: async () => {
    const response = await getStorefrontProductsAction(params);
    if (!response.code) throw response;
    return response.result;
  }, ...opts
});

export const useStorefrontProduct = (id, opts = {}) => useQuery({
  queryKey: fameoProductsKeys.storefrontProduct(id), queryFn: async () => {
    const response = await getStorefrontProductAction(id);
    if (!response.code) throw response;
    return response.result;
  }, enabled: !!id, ...opts
});

export const useProduct = (id, opts = {}) => useQuery({
  queryKey: fameoProductsKeys.product(id), queryFn: async () => {
    const response = await getProductAction(id);
    if (!response.code) throw response;
    return response.result;
  }, enabled: !!id, ...opts
});

export const useCart = (opts = {}) => useQuery({
  queryKey: fameoProductsKeys.cart(), queryFn: async () => {
    const response = await getCartAction();
    if (!response.code) throw response;
    return response.result;
  }, ...opts
});

export const useMyOrders = (opts = {}) => useQuery({
  queryKey: fameoProductsKeys.orders(), queryFn: async () => {
    const response = await getMyOrdersAction();
    if (!response.code) throw response;
    return response.result;
  }, ...opts
});

export const useOrder = (id, opts = {}) => useQuery({
  queryKey: fameoProductsKeys.order(id), queryFn: async () => {
    const response = await getOrderAction(id);
    if (!response.code) throw response;
    return response.result;
  }, enabled: !!id, ...opts
});

export const useMyTickets = (opts = {}) => useQuery({
  queryKey: fameoProductsKeys.tickets(), queryFn: async () => {
    const response = await getMyTicketsAction();
    if (!response.code) throw response;
    return response.result;
  }, ...opts
});

export const useAddToCartMutation = (opts = {}) => useApiMutation({ mutationFn: ({ productId, quantity }) => addToCartAction(productId, quantity), invalidate: [fameoProductsKeys.cart()], ...opts });

export const useRemoveFromCartMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await removeFromCartAction(...args);
    if (!response.code) throw response;
    return response.result;
  }, invalidate: [fameoProductsKeys.cart()], ...opts
});

export const useClearCartMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await clearCartAction(...args);
    if (!response.code) throw response;
    return response.result;
  }, invalidate: [fameoProductsKeys.cart()], ...opts
});

export const useCheckoutMutation = (opts = {}) => useApiMutation({ mutationFn: ({ cart_id, payment_ref, shipping_address }) => checkoutAction(cart_id, payment_ref, shipping_address), invalidate: [fameoProductsKeys.cart(), fameoProductsKeys.orders()], ...opts });

export const useRaiseTicketMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await raiseTicketAction(...args);
    if (!response.code) throw response;
    return response.result;
  }, invalidate: [fameoProductsKeys.tickets()], ...opts
});

export const useSyncCartToServerMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await syncCartToServerAction(...args);
    if (!response.code) throw response;
    return response.result;
  }, invalidate: [fameoProductsKeys.cart()], ...opts
});
