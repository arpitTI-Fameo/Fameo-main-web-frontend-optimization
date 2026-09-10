'use client';
// store/wishlistStore.js
// Zustand wishlist (favorites) store — persisted to localStorage.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [], // array of product objects

      add: (product) => {
        if (get().has(product.id)) return;
        set({ items: [...get().items, product] });
      },

      remove: (productId) =>
        set({ items: get().items.filter((p) => p.id !== productId) }),

      toggle: (product) => {
        if (get().has(product.id)) {
          get().remove(product.id);
        } else {
          get().add(product);
        }
      },

      has: (productId) => get().items.some((p) => p.id === productId),

      count: () => get().items.length,

      clear: () => set({ items: [] }),
    }),
    {
      name: 'fameo-wishlist',
    }
  )
);