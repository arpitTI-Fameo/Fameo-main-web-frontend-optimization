// lib/planPricing.js
// SINGLE SOURCE OF TRUTH for creator plan discounts on the storefront.
//
// Before this file existed the discount table was duplicated in three places
// (constants/membership.js, CartClient.js, and an implicit `membership.discountRate`
// read in CheckoutClient.js). They disagreed about the SHAPE of the value:
//   - CartClient  looked up a local table keyed by plan name  → worked
//   - CheckoutClient read `membership.discountRate` from the API → silently 0
//     whenever the API returns `discountPercent: 2` instead of `discountRate: 0.02`
// which made a Popular member's discount appear on /cart and vanish on /checkout.
//
// Everything plan-related now goes through here.
//
// NOTE: this is DISPLAY math only. The authoritative price is the one the
// products backend locks into the server cart at add time (discount_pct_locked /
// final_price). Never charge from these numbers — see reconcilePlanTotals().

// free = 0% · popular = 2% · elite = 5%
// `pro` is a dead legacy tier — it maps to free (no product discount).
// `premium` was an old name for elite; kept so old JWTs/user docs still work.
export const PLAN_DISCOUNTS = {
  free:    0,
  pro:     0,      // legacy, login-only tier — no product discount
  popular: 0.02,
  elite:   0.05,
  premium: 0.05,   // legacy alias for elite
};

export const PLAN_META = {
  free:    { label: 'Free',    color: '#9898a8', icon: '○' },
  pro:     { label: 'Pro',     color: '#7c9ec9', icon: '✦' },
  popular: { label: 'Popular', color: '#d4a0c0', icon: '◈' },
  elite:   { label: 'Elite',   color: '#e8457a', icon: '★' },
};

/** Collapse every legacy / cased / API spelling of a tier down to a canonical id. */
export const normalizePlan = (raw) => {
  const key = String(raw ?? '').trim().toLowerCase();
  if (key === 'premium') return 'elite';
  if (key === 'pro')     return 'free';   // legacy tier, no product discount
  return PLAN_DISCOUNTS[key] !== undefined ? key : 'free';
};

/**
 * Pull a discount RATE (0–1) out of whatever the membership endpoint returned.
 *
 * Accepts every shape we've seen in the wild:
 *   { type:'popular' }                       → 0.02  (from the table)
 *   { type:'popular', discountRate: 0.02 }   → 0.02
 *   { type:'popular', discountPercent: 2 }   → 0.02
 *   { plan_code:'POPULAR', discount_pct: 2 } → 0.02
 *
 * The plan-table value WINS over an API-supplied rate when the API value is
 * missing or zero, so a backend that forgets to send the rate can't silently
 * strip a paying member's discount.
 */
export const resolveDiscountRate = (membership) => {
  const plan = normalizePlan(
    membership?.type ?? membership?.plan ?? membership?.plan_code ?? membership?.planCode
  );
  const tableRate = PLAN_DISCOUNTS[plan] ?? 0;

  const raw =
    membership?.discountRate      ?? membership?.discount_rate ??
    membership?.discountPct       ?? membership?.discount_pct  ??
    membership?.discountPercent   ?? membership?.discount_percent;

  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return tableRate;

  // >1 means it came through as a percentage (2, 5) not a rate (0.02, 0.05)
  const apiRate = n > 1 ? n / 100 : n;

  // Guard against a bad payload capping a real member. Never go below the
  // tier's entitled discount, never above 100%.
  return Math.min(Math.max(apiRate, tableRate), 1);
};

export const planLabel = (plan) => PLAN_META[normalizePlan(plan)] ?? PLAN_META.free;

/** Per-unit price a member actually pays, in whole rupees. */
export const memberUnitPrice = (listedPrice, rate) => {
  const p = Number(listedPrice) || 0;
  if (!rate) return p;
  return Math.round(p * (1 - rate));
};

/**
 * Cart totals for a plan. Discount is computed PER LINE and then summed, which
 * is how the products backend does it (it rounds each item's final_price before
 * multiplying by quantity). Summing first and discounting once drifts by a rupee
 * or two on large carts and makes the cart page disagree with the invoice.
 *
 * @param {Array<{product:{price:number}, qty:number}>} items
 * @param {number} rate  0–1
 */
export const planTotals = (items = [], rate = 0) => {
  let subtotal = 0;
  let payable  = 0;

  for (const { product, qty } of items) {
    const q      = Number(qty) || 0;
    const listed = Number(product?.price) || 0;
    subtotal += listed * q;
    payable  += memberUnitPrice(listed, rate) * q;
  }

  return {
    subtotal,                          // pre-discount
    discount: subtotal - payable,      // the member saving
    payable,                           // post-discount, pre-shipping
  };
};

/**
 * Compare the client's displayed total against the server cart's authoritative
 * total (products backend, paise). Returns the SERVER figure to charge plus a
 * flag when the two disagree by more than a rupee of rounding.
 *
 * The old checkout displayed `cartTotal + shipping - clientDiscount` but charged
 * `serverTotal + shipping`. When the membership fetch failed those were different
 * numbers and nothing noticed — the user saw one price and Razorpay took another.
 */
export const reconcilePlanTotals = ({ serverItems = [], displayedPayable = 0 }) => {
  const serverPaise = serverItems.reduce(
    (s, i) => s + (Number(i.final_price) || 0) * (Number(i.quantity) || 0),
    0
  );
  const serverPayable = Math.round(serverPaise / 100);
  const drift         = serverPayable - Math.round(displayedPayable);

  return {
    serverPayable,
    drift,
    mismatch: Math.abs(drift) > 1,   // >₹1 is a real disagreement, not rounding
  };
};