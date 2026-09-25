import { createServerAction } from '@/lib/api/action';
import { cartEndpoints } from '@/lib/api/endpoints';
import { BFF_PRODUCTS_BASE } from '@/lib/api/config';

// We need to add cart endpoints to endpoints.js if they don't exist in cartEndpoints object
// Actually the previous search showed:
// cart: () => '/cart',
// cartItems: () => '/cart/items',
// cartItem: (productId) => `/cart/items/${productId}`,
// wait, the endpoints are exported independently maybe? Let's assume we can just use strings or we will check endpoints.js in a moment.

export const getCartAction = async () => {
  return createServerAction({
    url: '/api/cart',
    method: 'GET',
    base: BFF_PRODUCTS_BASE,
  });
};

export const addCartItemAction = async (data) => {
  return createServerAction({
    url: '/api/cart/items',
    method: 'POST',
    body: data,
    base: BFF_PRODUCTS_BASE,
  });
};

export const updateCartItemAction = async (itemId, data) => {
  return createServerAction({
    url: `/api/cart/items/${itemId}`,
    method: 'PATCH',
    body: data,
    base: BFF_PRODUCTS_BASE,
  });
};

export const removeCartItemAction = async (itemId) => {
  return createServerAction({
    url: `/api/cart/items/${itemId}`,
    method: 'DELETE',
    base: BFF_PRODUCTS_BASE,
  });
};

export const clearCartAction = async () => {
  return createServerAction({
    url: '/api/cart',
    method: 'DELETE',
    base: BFF_PRODUCTS_BASE,
  });
};
