'use client';
// store/uiStore.js
// Zustand UI state — drawer open/close, modal, toasts, loading flags.
// NOT persisted (resets on page load — that is correct for UI state).

import { create } from 'zustand';

export const useUIStore = create((set) => ({
  // Cart drawer
  cartDrawerOpen: false,
  openCartDrawer:  () => set({ cartDrawerOpen: true  }),
  closeCartDrawer: () => set({ cartDrawerOpen: false }),
  toggleCartDrawer:() => set((s) => ({ cartDrawerOpen: !s.cartDrawerOpen })),

  // Mobile nav drawer
  mobileNavOpen:  false,
  openMobileNav:  () => set({ mobileNavOpen: true  }),
  closeMobileNav: () => set({ mobileNavOpen: false }),

  // Global loading flag (e.g. during checkout submit)
  globalLoading: false,
  setGlobalLoading: (v) => set({ globalLoading: v }),

  // Toast / snackbar
  toast: null,   // { message, type: 'success' | 'error' | 'info' }
  showToast: (message, type = 'success') => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3500);
  },
  clearToast: () => set({ toast: null }),
}));