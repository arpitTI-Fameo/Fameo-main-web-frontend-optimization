// modules/Main/Cart/constants.js
// Copy and step identity for the cart. Scoped to this feature.

import { ROUTES } from '@/constants/routes';

export const CART_BREADCRUMBS = [
  { label: 'Home', href: ROUTES.HOME },
  { label: 'Cart' },
];

export const CART_HEADER = {
  eyebrow: 'Shopping Cart',
  title: 'Your Cart',
  subtitle: 'Review your items and tell us where to deliver them.',
};

/* The two-tab progress header. `id` is what the page holds in state. */
export const CART_STEPS = [
  {
    id: 'items',
    label: 'Your Items',
    hint: 'Review your selected products.',
    icon: 'cart',
  },
  {
    id: 'shipping',
    label: 'Shipping Info',
    hint: 'Provide your delivery details.',
    icon: 'truck',
  },
];

export const [{ id: CART_DEFAULT_STEP }] = CART_STEPS;

export const CART_SUMMARY = {
  title: 'Your Cart Summary',
  subtotalLabel: 'Total Price',
  subtotalNote: 'Excl. taxes',
  cartSubtotal: 'Cart Subtotal',
  delivery: 'Delivery Charges',
  deliveryFree: 'Free',
  deliveryPickup: 'Not applicable',
  total: 'Order Total',
  // The reference reads "Final prices will be shared in the approved quotation"
  // because it is a quote flow. This is a real checkout, so the total is what
  // the card is actually charged.
  note: '* Inclusive of all taxes. Nothing further is added at payment.',
};

export const CART_CTA = {
  toShipping: 'Continue to Shipping',
  toPayment: 'Proceed to Payment',
  backToItems: 'Your Cart Summary',
  empty: 'Continue Shopping',
};

export const DELIVERY_HEADING = 'How would you like to get your order?';

export const ADDRESS_SECTION = {
  title: 'Select Shipping Address',
  add: 'Add New Address',
  cancel: 'Cancel',
  save: 'Save Address',
  empty:
    "It looks like you don't have any saved addresses yet. Please add a new address to proceed.",
};

export const PICKUP_NOTICE = {
  title: 'Collect from our warehouse',
  body:
    'Bring your order confirmation and a photo ID. We will email you as soon as it is ready to collect.',
};

export const CART_EMPTY = {
  title: 'Your cart is empty',
  body: 'Browse the store and add something you like.',
};
