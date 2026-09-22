// utils/address.js
// Shipping-address shape and validation. Pure — no React, no DOM, no network.
//
// These lived inside Checkout/DeliveryForm. The cart now collects the address
// too, and a module may not import from a sibling module (CLAUDE.md §2), so
// they moved here rather than being copied. DeliveryForm imports them from this
// file now; there is still exactly one definition of each.

export const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli',
  'Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry',
];

// Canonical field order — drives which error we scroll to first, so the page
// always jumps to the topmost problem rather than an arbitrary one.
export const ADDRESS_FIELDS = [
  ['firstName', 'First name'],
  ['lastName',  'Last name'],
  ['email',     'Email address'],
  ['phone',     'Phone number'],
  ['address',   'Street address'],
  ['city',      'City'],
  ['state',     'State'],
  ['pin',       'PIN code'],
];

/** A blank address, with anything we already know about the shopper filled in. */
export const emptyAddress = (user = null) => ({
  firstName: user?.name?.split(' ')[0] || '',
  lastName:  user?.name?.split(' ').slice(1).join(' ') || '',
  email:     user?.email || '',
  phone: '', address: '', city: '',
  state: 'Telangana', pin: '', country: 'India',
});

/**
 * Validate EVERY field and return a { field: message } map.
 *
 * The old validateAddress() bailed on the first problem and returned a lone
 * string, which is why the shopper had to hunt: the message appeared next to
 * the button at the bottom, named a field they couldn't see, and revealed only
 * one issue at a time — fix it, submit, discover the next one.
 */
export function validateAddressFields(addr = {}) {
  const errors = {};

  for (const [key, label] of ADDRESS_FIELDS) {
    if (!String(addr[key] ?? '').trim()) errors[key] = `${label} is required`;
  }

  if (!errors.pin && !/^\d{6}$/.test(String(addr.pin || '')))
    errors.pin = 'PIN code must be exactly 6 digits';

  if (!errors.phone && !/^\d{10}$/.test(String(addr.phone || '').replace(/\D/g, '')))
    errors.phone = 'Phone must be 10 digits';

  if (!errors.email && !/\S+@\S+\.\S+/.test(String(addr.email || '')))
    errors.email = 'Enter a valid email address';

  return errors;
}

/** Kept for existing callers — returns the first message, or null. */
export function validateAddress(addr) {
  const errors = validateAddressFields(addr);
  const first  = ADDRESS_FIELDS.find(([k]) => errors[k]);
  return first ? errors[first[0]] : null;
}

/** True when every required field is present and well-formed. */
export const isCompleteAddress = (addr) =>
  !!addr && Object.keys(validateAddressFields(addr)).length === 0;

/** One-line rendering for a summary or a selected-address card. */
export const formatAddressLine = (addr = {}) =>
  [addr.address, addr.city, addr.state, addr.pin].filter(Boolean).join(', ');

/** "Jane Doe" from the two name fields. */
export const addressName = (addr = {}) =>
  `${addr.firstName || ''} ${addr.lastName || ''}`.trim();
