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
import { BFF_PRODUCTS_BASE } from '@/lib/api/config';
import { fameoProductEndpoints } from '@/lib/api/endpoints';
import { request } from '@/lib/api/core';

const PRODUCTS_API = BFF_PRODUCTS_BASE;

const call = async (path, options = {}) => {
  return request(`${PRODUCTS_API}${path}`, {
    ...options,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};

// ── Products (public catalog for creators) ─────────────────────
// GET /products?status=live&category=&search=&page=&limit=
export const getLiveProducts = (params = {}) => {
  const qs = new URLSearchParams({ status: 'live', limit: 50, ...params });
  return call(`/products?${qs}`); // { products, total }
};

// ── Storefront (PUBLIC — no login required) ────────────────────
// Hits /api/public/products on the products backend, which returns only
// 'live' products and needs no token. Use these on anonymous storefront pages.
export const getStorefrontProducts = (params = {}) => {
  const qs = new URLSearchParams({ limit: 50, ...params });
  return call(`/public/products?${qs}`); // { products, total }
};

export const getStorefrontProduct = (id) =>
  call(`/public/products/${id}`); // { product }

// GET /products/:id — includes images array
export const getProduct = (id) => call(fameoProductEndpoints.product(id)); // { product }

// ── Server cart (§5.4) — creators only ─────────────────────────
// Discount is LOCKED at cart creation from the creator's current plan.
// Cart expires 30 minutes after creation. Stock is reserved on add.
export const getCart = () => call(fameoProductEndpoints.cart()); // gets or creates active cart

export const addToCart = (product_id, quantity = 1) =>
  call('/cart/items', { method: 'POST', body: JSON.stringify({ product_id, quantity }) });
  // 409 → insufficient stock: err.message tells how many units are available

export const removeFromCart = (productId) =>
  call(`/cart/items/${productId}`, { method: 'DELETE' }); // releases reservation

export const clearCart = () => call(fameoProductEndpoints.cart(), { method: 'DELETE' });

// ── Checkout (§5.5 + §6.1) ──────────────────────────────────────
// ⚠️ Call ONLY after Razorpay confirms payment (doc §9.1) — never before.
// shipping_address is the buyer's delivery address, captured at checkout. It is
// stored on the order and snapshotted onto the customer invoice (Ship-To) that
// ships in the box, so the retailer knows where to send the goods.
export const checkout = (cart_id, payment_ref, shipping_address = null) =>
  call('/orders/checkout', {
    method: 'POST',
    body: JSON.stringify({ cart_id, payment_ref, shipping_address }),
  });

// ── Orders & support (creator scope is automatic) ──────────────
export const getMyOrders = () => call(fameoProductEndpoints.orders());           // { orders } — own orders only
export const getOrder = (id) => call(fameoProductEndpoints.order(id));      // { order }
export const raiseTicket = ({ issue, type, priority, order_id }) =>
  call('/support', { method: 'POST', body: JSON.stringify({ issue, type, priority, order_id }) });
export const getMyTickets = () => call(fameoProductEndpoints.support());         // own tickets only

// ── Cart sync (browsing cart → server cart) ─────────────────────
// Replaces the server cart with the local cart, so stock is reserved and
// the plan discount is locked before payment. Returns the fresh server cart.
//
// Items are added sequentially, not in parallel: the server cart is a single
// document and concurrent writes to it will clobber each other's items.
export const syncCartToServer = async (localItems) => {
  await clearCart().catch(() => {});   // release any stale reservations

  const failed = [];
  for (const { product, qty } of localItems) {
    try {
      await addToCart(product.id, qty);
    } catch (e) {
      failed.push({ name: product.name || product.id, reason: e.message });
    }
  }

  const { cart } = await getCart();
  return { cart, failed };
};

// ─── TanStack Query Hooks ──────────────────────────────────────────────────

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

