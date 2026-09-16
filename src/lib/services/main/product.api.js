import { createServerAction } from '@/lib/api/action';
// services/fameoProducts.service.js
// Creator-side client for the Fameo Products backend (fameo-products-backend).
// Drop into your main web's services/ folder.
//
// Auth rides on the httpOnly session cookie, attached by the products BFF.
// The products backend and the main backend share JWT_SECRET, so one login
// works for both — see INTEGRATION.md.
//
// ⚠️ All money from this API is in PAISE. Use lib/productAdapter.js
//    (or divide by 100) before display.

// Same-origin via the products BFF, which attaches the httpOnly session
// cookie server-side. /cart, /orders and /checkout need that session; before
// this they read the token from localStorage, which no longer holds one.
import { BFF_PRODUCTS_BASE, PRODUCTS_PAGE_SIZE } from '@/lib/api/config';
import { fameoProductEndpoints } from '@/lib/api/endpoints';
import { clientFetch } from '@/lib/api/client/fetcher';

const call = (path, options = {}) =>
  clientFetch(path, { base: BFF_PRODUCTS_BASE, ...options });

// ── Products (public catalog for creators) ─────────────────────
export const getLiveProductsAction = async (params = {}) => {
  const qs = new URLSearchParams({ status: 'live', limit: PRODUCTS_PAGE_SIZE, ...params });
  return createServerAction({
    url: `/products?${qs}`,
    method: 'GET',
    base: BFF_PRODUCTS_BASE
  });
};

// ── Storefront (PUBLIC — no login required) ────────────────────
// Hits /api/public/products on the products backend, which returns only
// 'live' products and needs no token. Use these on anonymous storefront pages.
export const getStorefrontProductsAction = async (params = {}) => {
  const qs = new URLSearchParams({ limit: PRODUCTS_PAGE_SIZE, ...params });
  return createServerAction({
    url: `/public/products?${qs}`,
    method: 'GET',
    base: BFF_PRODUCTS_BASE
  });
};

export const getStorefrontProductAction = async (id) => {
  return createServerAction({
    url: `/public/products/${id}`,
    method: 'GET',
    base: BFF_PRODUCTS_BASE
  });
};

// GET /products/:id — includes images array
export const getProductAction = async (id) => {
  return createServerAction({
    url: fameoProductEndpoints.product(id),
    method: 'GET',
    base: BFF_PRODUCTS_BASE
  });
};

// ── Server cart (§5.4) — creators only ─────────────────────────
// Discount is LOCKED at cart creation from the creator's current plan.
// Cart expires 30 minutes after creation. Stock is reserved on add.
export const getCartAction = async () => {
  return createServerAction({
    url: fameoProductEndpoints.cart(),
    method: 'GET',
    base: BFF_PRODUCTS_BASE
  });
};

export const addToCartAction = async (product_id, quantity = 1) => {
  return createServerAction({
    url: '/cart/items',
    method: 'POST',
    body: { product_id, quantity },
    base: BFF_PRODUCTS_BASE
  });
};

export const removeFromCartAction = async (productId) => {
  return createServerAction({
    url: `/cart/items/${productId}`,
    method: 'DELETE',
    base: BFF_PRODUCTS_BASE
  });
};

export const clearCartAction = async () => {
  return createServerAction({
    url: fameoProductEndpoints.cart(),
    method: 'DELETE',
    base: BFF_PRODUCTS_BASE
  });
};

// ── Checkout (§5.5 + §6.1) ──────────────────────────────────────
export const checkoutAction = async (cart_id, payment_ref, shipping_address = null) => {
  return createServerAction({
    url: '/orders/checkout',
    method: 'POST',
    body: { cart_id, payment_ref, shipping_address },
    base: BFF_PRODUCTS_BASE
  });
};

// ── Orders & support (creator scope is automatic) ──────────────
export const getMyOrdersAction = async () => {
  return createServerAction({
    url: fameoProductEndpoints.orders(),
    method: 'GET',
    base: BFF_PRODUCTS_BASE
  });
};

export const getOrderAction = async (id) => {
  return createServerAction({
    url: fameoProductEndpoints.order(id),
    method: 'GET',
    base: BFF_PRODUCTS_BASE
  });
};

export const raiseTicketAction = async ({ issue, type, priority, order_id }) => {
  return createServerAction({
    url: '/support',
    method: 'POST',
    body: { issue, type, priority, order_id },
    base: BFF_PRODUCTS_BASE
  });
};

export const getMyTicketsAction = async () => {
  return createServerAction({
    url: fameoProductEndpoints.support(),
    method: 'GET',
    base: BFF_PRODUCTS_BASE
  });
};

// ── Cart sync (browsing cart → server cart) ─────────────────────
// Replaces the server cart with the local cart, so stock is reserved and
// the plan discount is locked before payment. Returns the fresh server cart.
//
// Items are added sequentially, not in parallel: the server cart is a single
// document and concurrent writes to it will clobber each other's items.
export const syncCartToServerAction = async (localItems) => {
  await clearCartAction().catch(() => {});

  const failed = [];
  for (const { product, qty } of localItems) {
    try {
      await addToCartAction(product.id, qty);
    } catch (e) {
      failed.push({ name: product.name || product.id, reason: e.message });
    }
  }

  const response = await getCartAction();
  return { cart: response.result?.cart, failed };
};

// ─── TanStack Query Hooks ──────────────────────────────────────────────────
