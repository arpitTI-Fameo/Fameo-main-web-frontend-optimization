// 'use client';
// // hooks/useServerCart.js
// // Server-backed cart hook for the main Fameo web.
// //
// // Why server cart instead of your zustand cartStore for products:
// //  - stock is RESERVED on add (two creators can't buy the last unit)
// //  - the discount % is LOCKED at cart creation from the creator's plan
// //  - the cart expires after 30 minutes (TTL) — pricing stays consistent
// // Keep using cartStore for any non-products flows; use this hook on the
// // products cart/checkout pages.

// import { useCallback, useEffect, useState } from 'react';
// import {
//   getCart, addToCart as apiAdd, removeFromCart as apiRemove,
//   clearCart as apiClear, checkout as apiCheckout,
// } from '@/services/fameoProducts.service';
// import { adaptCart } from '@/lib/productAdapter';

// export function useServerCart() {
//   const [cart, setCart] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const refresh = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { cart: raw } = await getCart();
//       setCart(adaptCart(raw));
//     } catch (e) {
//       // 401 → not logged in; 403 → staff account (cart is creators-only)
//       setError(e);
//       setCart(null);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { refresh(); }, [refresh]);

//   const add = useCallback(async (productId, qty = 1) => {
//     try {
//       await apiAdd(productId, qty);
//       await refresh();
//       return { ok: true };
//     } catch (e) {
//       // 409 = insufficient stock — e.message says how many units are available
//       return { ok: false, message: e.message, status: e.status };
//     }
//   }, [refresh]);

//   const remove = useCallback(async (productId) => {
//     await apiRemove(productId);
//     await refresh();
//   }, [refresh]);

//   const clear = useCallback(async () => {
//     await apiClear();
//     await refresh();
//   }, [refresh]);

//   /**
//    * Complete the purchase. Call ONLY inside the Razorpay success handler:
//    *
//    *   const rzp = new window.Razorpay({
//    *     ...options,
//    *     handler: async (response) => {
//    *       const result = await completeCheckout(response.razorpay_payment_id);
//    *       if (result.ok) router.push('/account/orders');
//    *     },
//    *   });
//    *
//    * Never call before payment is confirmed (doc §9.1 — payment captured but
//    * order stuck is the failure mode this prevents).
//    */
//   const completeCheckout = useCallback(async (paymentRef) => {
//     if (!cart?.id) return { ok: false, message: 'No active cart' };
//     try {
//       const res = await apiCheckout(cart.id, paymentRef);
//       await refresh(); // fresh empty cart
//       return { ok: true, orders: res.orders };
//     } catch (e) {
//       // Cart may have expired (30-min TTL) — surface clearly
//       return { ok: false, message: e.message, status: e.status };
//     }
//   }, [cart, refresh]);

//   const count = cart?.items?.reduce((s, i) => s + i.qty, 0) ?? 0;

//   return { cart, count, loading, error, refresh, add, remove, clear, completeCheckout };
// }




'use client';
// hooks/useServerCart.js
// Server-backed cart hook for the main Fameo web.
//
// Why server cart instead of your zustand cartStore for products:
//  - stock is RESERVED on add (two creators can't buy the last unit)
//  - the discount % is LOCKED at cart creation from the creator's plan
//  - the cart expires after 30 minutes (TTL) — pricing stays consistent
// Keep using cartStore for any non-products flows; use this hook on the
// products cart/checkout pages.

import { useCallback, useEffect, useState } from 'react';
import {
  getCart, addToCart as apiAdd, removeFromCart as apiRemove,
  clearCart as apiClear, checkout as apiCheckout,
} from '@/services/fameoProducts.service';
import { adaptCart } from '@/lib/productAdapter';

export function useServerCart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { cart: raw } = await getCart();
      setCart(adaptCart(raw));
    } catch (e) {
      // 401 → not logged in; 403 → staff account (cart is creators-only)
      setError(e);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const add = useCallback(async (productId, qty = 1) => {
    try {
      await apiAdd(productId, qty);
      await refresh();
      return { ok: true };
    } catch (e) {
      // 409 = insufficient stock — e.message says how many units are available
      return { ok: false, message: e.message, status: e.status };
    }
  }, [refresh]);

  const remove = useCallback(async (productId) => {
    await apiRemove(productId);
    await refresh();
  }, [refresh]);

  const clear = useCallback(async () => {
    await apiClear();
    await refresh();
  }, [refresh]);

  /**
   * Complete the purchase. Call ONLY inside the Razorpay success handler:
   *
   *   const rzp = new window.Razorpay({
   *     ...options,
   *     handler: async (response) => {
   *       const result = await completeCheckout(response.razorpay_payment_id);
   *       if (result.ok) router.push('/account/orders');
   *     },
   *   });
   *
   * Never call before payment is confirmed (doc §9.1 — payment captured but
   * order stuck is the failure mode this prevents).
   */
  const completeCheckout = useCallback(async (paymentRef, shippingAddress = null) => {
    if (!cart?.id) return { ok: false, message: 'No active cart' };
    try {
      const res = await apiCheckout(cart.id, paymentRef, shippingAddress);
      await refresh(); // fresh empty cart
      return { ok: true, orders: res.orders };
    } catch (e) {
      // Cart may have expired (30-min TTL) — surface clearly
      return { ok: false, message: e.message, status: e.status };
    }
  }, [cart, refresh]);

  const count = cart?.items?.reduce((s, i) => s + i.qty, 0) ?? 0;

  return { cart, count, loading, error, refresh, add, remove, clear, completeCheckout };
}
