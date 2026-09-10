// // services/order.service.js
// // Maps to backend: /api/orders/*
// // Used by: checkout/CheckoutClient.js, account/orders/* pages

// import { ordersApi }    from '@/lib/api';
// import { useCartStore } from '@/store/cartStore';

// // ─── Create Razorpay order on backend ────────────────────────────────────────
// // Called by: checkout/CheckoutClient.js → handleRazorpay()
// export const createRazorpayOrder = async ({ grandTotal }) => {
//   const res = await ordersApi.createRazorpayOrder({
//     amount:   Math.round(grandTotal * 84 * 100), // paise
//     currency: 'INR',
//   });
//   return res.data; // { orderId, amount, currency }
// };

// // ─── Verify payment after Razorpay callback ──────────────────────────────────
// // Called by: checkout/CheckoutClient.js → Razorpay handler
// export const verifyPayment = async (payload) => {
//   const cartItems = useCartStore.getState().cartItems;
//   const res = await ordersApi.verifyPayment({ ...payload, cartItems });
//   return res.data; // { success, orderId }
// };

// // ─── Place COD order ──────────────────────────────────────────────────────────
// // Called by: checkout/CheckoutClient.js → handleCOD()
// export const placeCOD = async ({ addr, shipping, grandTotal }) => {
//   const cartItems = useCartStore.getState().cartItems;
//   const res = await ordersApi.placeCOD({ cartItems, addr, shipping, total: grandTotal });
//   return res.data; // { success, orderId }
// };

// // ─── Get all user orders ──────────────────────────────────────────────────────
// // Used by: account/orders/page.js
// export const getOrders = async (params = {}) => {
//   const res = await ordersApi.getAll(params);
//   return res.data; // { orders, total, page, totalPages }
// };

// // ─── Get single order ─────────────────────────────────────────────────────────
// // Used by: account/orders/[orderId]/page.js
// export const getOrder = async (orderId) => {
//   const res = await ordersApi.getOne(orderId);
//   return res.data;
// };

// // ─── Track order ─────────────────────────────────────────────────────────────
// // Used by: account/track-order/page.js
// export const trackOrder = async (orderId) => {
//   const res = await ordersApi.track(orderId);
//   return res.data; // { id, status, tracking_number, shipped_at, delivered_at }
// };


// services/order.service.js
// Maps to backend: /api/orders/*
// Used by: checkout/CheckoutClient.js, account/orders/* pages

import { ordersApi } from '@/lib/api';
// NOTE: the cart store is deliberately NOT imported here any more. See below.

// ─── Create Razorpay order on backend ────────────────────────────────────────
// Called by: checkout/CheckoutClient.js → handleRazorpay()
//
// The backend now prices the order itself from the products-backend server cart
// (server-locked final_price, plan discount already applied) and derives
// shipping from the option id. `grandTotal` travels as `expectedINR` purely as
// a cross-check: if it disagrees with the server's own figure the request is
// refused, so nobody is charged a number they were never shown. It is not the
// charge.
export const createRazorpayOrder = async ({ grandTotal, shippingMethod = 'standard' }) => {
  const res = await ordersApi.createRazorpayOrder({
    shippingMethod,
    expectedINR: Math.round(grandTotal),
  });
  return res.data; // { orderId, amount, currency, key, breakdown }
};

// ─── Verify payment after Razorpay callback ──────────────────────────────────
// Called by: checkout/CheckoutClient.js → Razorpay handler
//
// SAST M-2. This used to attach the Zustand cart — prices read straight out of
// localStorage — and the backend wrote them to the orders row verbatim. Since
// the Razorpay signature only covers `order_id|payment_id`, a ₹1 payment plus a
// valid signature plus an edited localStorage cart produced a paid order for
// anything. Nothing monetary leaves the browser now: this request carries proof
// of payment and a delivery address, and the server reconciles against the
// quote it wrote at create time.
export const verifyPayment = async (payload) => {
  const res = await ordersApi.verifyPayment(payload);
  return res.data; // { success, orderId, total, subtotal, shippingCost, memberDiscount }
};

// ─── Place COD order ──────────────────────────────────────────────────────────
// COD is disabled server-side (the route returns 410). Kept as a thin shim so
// any lingering caller gets the backend's message rather than a TypeError.
export const placeCOD = async ({ addr, shipping }) => {
  const res = await ordersApi.placeCOD({ addr, shipping });
  return res.data;
};

// ─── Get all user orders ──────────────────────────────────────────────────────
// Used by: account/orders/page.js
export const getOrders = async (params = {}) => {
  const res = await ordersApi.getAll(params);
  return res.data; // { orders, total, page, totalPages }
};

// ─── Get single order ─────────────────────────────────────────────────────────
// Used by: account/orders/[orderId]/page.js
export const getOrder = async (orderId) => {
  const res = await ordersApi.getOne(orderId);
  return res.data;
};

// ─── Track order ─────────────────────────────────────────────────────────────
// Used by: account/track-order/page.js
export const trackOrder = async (orderId) => {
  const res = await ordersApi.track(orderId);
  return res.data; // { id, status, tracking_number, shipped_at, delivered_at }
};