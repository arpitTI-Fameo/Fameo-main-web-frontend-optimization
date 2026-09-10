'use client';
// store/cartStore.js
// Zustand cart store — replaces the old CartProvider from AppContext.
// Persisted so cart survives page refresh.
//
// CHANGES (add-to-cart feedback fix):
//  • addToCart now RETURNS a result. It used to return undefined, so callers had
//    no way to tell "added" from "silently clamped at the stock limit" — clicking
//    Add to Bag on an out-of-stock item did literally nothing: no error, no
//    movement. That was the main "is it even added?" complaint.
//  • lastAdded is a signal the UI subscribes to for toasts / badge bumps.
//  • hasHydrated lets components avoid rendering persisted cart state during
//    SSR, which was producing hydration mismatches on /cart.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_QTY_FALLBACK = 99;

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],

      // { id, name, qty, at, status } — bumped on every successful add.
      // `at` is a timestamp so two adds of the same product still register as
      // distinct events for the toast/animation.
      lastAdded: null,

      hasHydrated: false,
      setHydrated: (v) => set({ hasHydrated: v }),

      /**
       * @returns {{ok:boolean, status:'added'|'increased'|'at-max'|'unavailable', added:number, qty:number, max:number}}
       */
      addToCart: (product, qty = 1) => {
        if (!product?.id) return { ok: false, status: 'unavailable', added: 0, qty: 0, max: 0 };

        const items    = get().cartItems;
        const existing = items.find((i) => i.product.id === product.id);
        const max      = Number(product.stock ?? MAX_QTY_FALLBACK);

        if (product.available === false || max <= 0) {
          return { ok: false, status: 'unavailable', added: 0, qty: existing?.qty ?? 0, max };
        }

        const current = existing?.qty ?? 0;
        const target  = Math.min(current + qty, max);
        const added   = target - current;

        if (added <= 0) {
          // Already at the stock ceiling. Previously this branch just wrote the
          // same state back and looked identical to a successful add.
          return { ok: false, status: 'at-max', added: 0, qty: current, max };
        }

        if (existing) {
          set({
            cartItems: items.map((i) =>
              i.product.id === product.id
                // Refresh the stored product too — price/stock may have changed
                // since it was first added.
                ? { ...i, product: { ...i.product, ...product }, qty: target }
                : i
            ),
          });
        } else {
          set({ cartItems: [...items, { product, qty: target }] });
        }

        set({
          lastAdded: {
            id: product.id,
            name: product.name,
            qty: target,
            added,
            at: Date.now(),
            status: existing ? 'increased' : 'added',
          },
        });

        return {
          ok: true,
          status: existing ? 'increased' : 'added',
          added,
          qty: target,
          max,
        };
      },

      clearLastAdded: () => set({ lastAdded: null }),

      updateQty: (productId, newQty) => {
        if (newQty <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cartItems: get().cartItems.map((i) =>
            i.product.id === productId
              ? { ...i, qty: Math.min(newQty, i.product.stock ?? MAX_QTY_FALLBACK) }
              : i
          ),
        });
      },

      removeFromCart: (productId) =>
        set({ cartItems: get().cartItems.filter((i) => i.product.id !== productId) }),

      clearCart: () => set({ cartItems: [], lastAdded: null }),

      // Derived
      cartCount: () => get().cartItems.reduce((s, i) => s + i.qty, 0),
      cartTotal: () =>
        get().cartItems.reduce((s, i) => s + (Number(i.product.price) || 0) * i.qty, 0),
    }),
    {
      name: 'fameo-cart',
      // lastAdded is a transient UI signal — persisting it would re-fire the
      // "Added to bag" toast on every page load.
      partialize: (s) => ({ cartItems: s.cartItems }),
      onRehydrateStorage: () => (state) => { state?.setHydrated(true); },
    }
  )
);

/**
 * Cart values that are safe to render on the server.
 * Persisted state doesn't exist during SSR, so any component that renders the
 * cart directly (count badge, /cart page, drawer) must show the empty state
 * until hydration completes or React 19 throws a hydration mismatch.
 */
export const useHydratedCart = () => {
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const items       = useCartStore((s) => s.cartItems);
  const count       = useCartStore((s) => s.cartCount());
  const total       = useCartStore((s) => s.cartTotal());

  return hasHydrated
    ? { items, count, total, ready: true }
    : { items: [], count: 0, total: 0, ready: false };
};