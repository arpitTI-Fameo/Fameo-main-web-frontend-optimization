'use client';
// store/checkoutStore.js
// The handoff between /cart and /checkout.
//
// The cart now owns the delivery details: step 2 picks how the order travels
// and which address it goes to. Checkout reads them from here and opens on the
// payment step instead of asking for the same address a second time.
//
// This replaces the raw localStorage.getItem('fameo_saved_address') that lived
// inside Checkout. That was a single-file implementation detail with no reader
// outside it; now two surfaces need the value, so it belongs in the store layer
// where the rest of the client state lives.
//
// Nothing secret goes in here — an address, a delivery choice and a rate id.
// Session tokens stay in the httpOnly cookie (CLAUDE.md §2a).

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { DELIVERY_METHODS, DEFAULT_SHIPPING } from '@/utils/shipping';
import { isCompleteAddress } from '@/utils/address';

export const useCheckoutStore = create(
  persist(
    (set, get) => ({
      // The address the shopper chose in the cart. null until they pick one.
      address: null,

      // 'door' | 'pickup'
      deliveryMethod: DELIVERY_METHODS.DOOR,

      // id from SHIPPING_RATES. Ignored while deliveryMethod is 'pickup'.
      shippingRateId: DEFAULT_SHIPPING.id,

      setAddress: (address) => set({ address }),

      setDeliveryMethod: (deliveryMethod) => {
        // Collecting a shipping address for a warehouse pickup makes no sense,
        // but dropping it would lose the shopper's work if they toggle back.
        // Keep it; the cart simply stops asking for it.
        set({ deliveryMethod });
      },

      setShippingRate: (shippingRateId) => set({ shippingRateId }),

      /** Checkout uses this to decide whether it can skip its delivery step. */
      hasDeliveryDetails: () => {
        const { deliveryMethod, address } = get();
        if (deliveryMethod === DELIVERY_METHODS.PICKUP) return true;
        return isCompleteAddress(address);
      },

      reset: () =>
        set({
          address: null,
          deliveryMethod: DELIVERY_METHODS.DOOR,
          shippingRateId: DEFAULT_SHIPPING.id,
        }),
    }),
    { name: 'fameo-checkout' }
  )
);
