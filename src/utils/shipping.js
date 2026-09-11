// lib/shipping.js
// SINGLE SOURCE OF TRUTH for shipping costs.
//
// There used to be THREE different shipping rules that disagreed with each other:
//   CartClient.js   → cartTotal > 200 ? 0 : 18
//   CartDrawer.js   → FREE_SHIPPING_THRESHOLD = 200  // USD
//   DeliveryForm.js → SHIPPING_RATES + `Math.round(cost * 84)` on DISPLAY only
//
// The last one was the dangerous one: Express *displayed* ₹1,512 (18 × 84) but
// CheckoutClient added the raw `rate.price` — ₹18 — to the Razorpay amount.
// The numbers 0/18/35/200 were pseudo-USD left over from the mock data era.
//
// These are now real rupee amounts. Everything imports from here.

export const SHIPPING_RATES = [
  {
    id: 'standard',
    label: 'Standard Delivery',
    days: '5–7 business days',
    price: 79,
    free_above: 2000,          // free over ₹2,000
  },
  {
    id: 'express',
    label: 'Express Delivery',
    days: '2–3 business days',
    price: 199,
    free_above: null,
  },
  {
    id: 'overnight',
    label: 'Overnight Delivery',
    days: 'Next business day',
    price: 399,
    free_above: null,
  },
];

export const DEFAULT_SHIPPING = SHIPPING_RATES[0];

/** Free-shipping threshold used by the cart page and drawer progress bar. */
export const FREE_SHIPPING_THRESHOLD = DEFAULT_SHIPPING.free_above;

/**
 * Cost of a shipping option for a given order value, in rupees.
 * `orderValue` should be the POST-discount payable — a member's discount can
 * legitimately drop them back under the free-shipping line, and the cart, the
 * drawer and the checkout all need to agree about that.
 */
export const shippingCostFor = (rate, orderValue = 0) => {
  if (!rate) return 0;
  if (rate.free_above && orderValue >= rate.free_above) return 0;
  return Number(rate.price) || 0;
};