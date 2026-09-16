// constants/locale.js
//
// The locale every Intl formatter in the app uses.
//
// 'en-IN' was written out 20+ times across eleven files — the shared currency
// util, Plans, Checkout, Account, Subscription, Community. It decides how a
// rupee amount is grouped (₹1,00,000, not ₹100,000) and how a date reads, so
// it is formatting CONFIGURATION, not user-facing copy: there is no
// localisation layer here for it to belong to, and a second market would mean
// finding all twenty call sites by hand.
//
// Note: one call site deliberately does NOT use this — the register flow's
// application date formats with 'en-GB'. That is a different value, used once,
// and is left exactly as it was.

/** Passed to toLocaleString / toLocaleDateString / Intl.NumberFormat. */
export const DEFAULT_LOCALE = 'en-IN';
