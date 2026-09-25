import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import {
  getCartAction,
  addCartItemAction,
  updateCartItemAction,
  removeCartItemAction,
  clearCartAction,
} from '@/lib/services/main/cart.api';

export const cartKeys = {
  all: ['cart'],
  details: () => [...cartKeys.all, 'detail'],
};

export const useCart = (opts = {}) => useQuery({
  queryKey: cartKeys.details(),
  queryFn: async () => {
    const response = await getCartAction();
    if (!response.code) throw response;
    return response.result; // Should return { cart, pricing, issues, can_checkout, limits }
  },
  ...opts,
});

export const useAddToCart = (opts = {}) => useApiMutation({
  mutationFn: (data) => addCartItemAction(data), // { product_id, quantity }
  invalidate: [cartKeys.all],
  ...opts,
});

export const useUpdateCartItem = (opts = {}) => useApiMutation({
  mutationFn: ({ itemId, data }) => updateCartItemAction(itemId, data), // { quantity }
  invalidate: [cartKeys.all],
  ...opts,
});

export const useRemoveCartItem = (opts = {}) => useApiMutation({
  mutationFn: (itemId) => removeCartItemAction(itemId),
  invalidate: [cartKeys.all],
  ...opts,
});

export const useClearCart = (opts = {}) => useApiMutation({
  mutationFn: () => clearCartAction(),
  invalidate: [cartKeys.all],
  ...opts,
});
