// services/subscription.service.js

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const API_ROOT = `${API_BASE}/api`;

function getToken() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('fameo-auth');
    return raw ? JSON.parse(raw)?.state?.token : null;
  } catch {
    return null;
  }
}

export class SessionExpiredError extends Error {
  constructor(msg = 'SESSION_EXPIRED') { super(msg); this.name = 'SessionExpiredError'; }
}

async function call(path, { method = 'GET', body } = {}) {
  const token = getToken();
  const res = await fetch(`${API_ROOT}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  const json = await res.json().catch(() => ({}));

  if (res.status === 401) {
    throw new SessionExpiredError(json?.message || 'Session expired');
  }
  if (!res.ok || json?.success === false) {
    const err = new Error(json?.message || json?.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return json?.data !== undefined ? json.data : json;
}

// call() unwraps to `data`; the central API sometimes returns it as a one-item
// array (e.g. the razorpay order). Collapse that to a single object.
const one = (data) => (Array.isArray(data) ? data[0] : data);

// ─── Endpoints (match the proxy backend / central API) ───────────────────────
export const ENDPOINTS = {
  config:         '/subscriptions/config',
  plans:          '/subscriptions/plans',
  current:        '/subscriptions/current',
  membership:     '/subscriptions/membership',
  upgradePreview: '/subscriptions/upgrade-preview',
  history:        '/subscriptions/history',
  transactions:   '/subscriptions/transactions',
  createOrder:    '/subscriptions/create-order',
  // Current checkout flow — Web Subscription & Referral Discount Integration
  // §4 and §6. These replace createOrder + subscribe for NEW web purchases:
  // the backend prices the order, applies the referral discount, and activates
  // the subscription itself on verify.
  marketingCouponQuote: '/subscriptions/marketing-coupon/quote',
  razorpayOrder:  '/subscriptions/razorpay/order',
  razorpayVerify: '/subscriptions/razorpay/verify',
  subscribe:      '/subscriptions/subscribe',
  upgrade:        '/subscriptions/upgrade',
  cancel:         '/subscriptions/cancel',
  resume:         '/subscriptions/resume',
  autoRenew:      '/subscriptions/auto-renew',
};

// ─── Reads ───────────────────────────────────────────────────────────────────
export const getConfig       = () => call(ENDPOINTS.config);
export const getPlans        = () => call(ENDPOINTS.plans);
// The central API returns the current subscription as an ARRAY (the active +
// any cancelled-but-still-valid record). Normalise to the single most relevant
// subscription object so the pages can read sub.plan.plan_code directly.
export const getCurrent = async () => {
  const data = await call(ENDPOINTS.current);
  if (Array.isArray(data)) {
    if (!data.length) return null;
    // Prefer a genuinely active one; else the first (e.g. cancelled-but-valid).
    return data.find((s) => s?.status === 'active' && !s?.is_cancelled) || data[0];
  }
  return data;
};
export const getMembership   = () => call(ENDPOINTS.membership);
export const getHistory      = () => call(ENDPOINTS.history);
export const getTransactions = () => call(ENDPOINTS.transactions);

export const getUpgradePreview = ({ target_plan, target_duration_months } = {}) => {
  const qs = new URLSearchParams();
  if (target_plan) qs.set('target_plan', target_plan);
  if (target_duration_months) qs.set('target_duration_months', String(target_duration_months));
  const suffix = qs.toString() ? `?${qs}` : '';
  return call(`${ENDPOINTS.upgradePreview}${suffix}`);
};

// ─── Campaign (marketing) coupon ─────────────────────────────────────────────
// Validate + preview a campaign coupon for a billing option. DISPLAY ONLY — the
// order response is the final price authority. Returns:
//   { valid, coupon_code, discount_source, discount_type, discount_percent,
//     original_price, discount_amount, payable_price, payment_required,
//     replaces_referral_discount }
// A 422 (invalid/expired/exhausted) throws; the caller keeps the plan and shows
// the message.
export const quoteMarketingCoupon = async ({ billing_id, coupon_code }) =>
  one(await call(ENDPOINTS.marketingCouponQuote, {
    method: 'POST',
    body: { billing_id, coupon_code },
  }));

// ─── Payment ────────────────────────────────────────────────────────────────
// Ask the backend to create a Razorpay order (it owns the amount).
// Pass numeric { plan_id, billing_id, duration_months }.
//
// LEGACY for new web purchases — use createRazorpayOrder below instead. Kept
// for the upgrade flow, which still pairs createOrder with upgrade().
export const createOrder = (payload) =>
  call(ENDPOINTS.createOrder, { method: 'POST', body: payload });

// ─── Razorpay (current flow) ────────────────────────────────────────────────
// §4: send billing_id + idempotency_key, plus an optional campaign coupon code.
// No plan_id, discount, duration or amount — the backend prices the order and
// applies the campaign coupon (which replaces any referral benefit) itself.
export const createRazorpayOrder = async ({ billing_id, idempotency_key, marketing_coupon_code }) =>
  one(await call(ENDPOINTS.razorpayOrder, {
    method: 'POST',
    body: {
      billing_id,
      idempotency_key,
      ...(marketing_coupon_code ? { marketing_coupon_code } : {}),
    },
  }));

// §6: the only thing that activates a subscription. Payment is not complete
// until this succeeds. Do NOT call subscribe() after a Razorpay success.
export const verifyRazorpayPayment = ({
  razorpay_order_id, razorpay_payment_id, razorpay_signature,
}) =>
  call(ENDPOINTS.razorpayVerify, {
    method: 'POST',
    body: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
  });

// §4: 8–100 chars, letters/numbers/underscores/hyphens. One key per checkout
// ATTEMPT, reused on retry of that same attempt.
export const newCheckoutAttemptId = () => {
  const uuid = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  return `web_checkout_${uuid.replace(/-/g, '_')}`.slice(0, 100);
};

// ─── Writes (call AFTER Razorpay Checkout succeeds) ──────────────────────────
// LEGACY for new web purchases (§6 forbids it after a Razorpay success).
// Still used by the upgrade path.
export const subscribe = (payload) =>
  call(ENDPOINTS.subscribe, { method: 'POST', body: payload });

export const upgrade = (payload) =>
  call(ENDPOINTS.upgrade, { method: 'POST', body: payload });

// ─── Manage (no payment) ─────────────────────────────────────────────────────
export const cancelSubscription = ({ subscriptionId, reason } = {}) =>
  call(ENDPOINTS.cancel, { method: 'POST', body: { subscription_id: subscriptionId, cancel_reason: reason || '' } });

export const resumeSubscription = ({ subscriptionId } = {}) =>
  call(ENDPOINTS.resume, { method: 'POST', body: { subscription_id: subscriptionId } });

// auto-renew is a LOCAL preference (per the PDF) — it does not charge a card.
export const setAutoRenew = ({ subscriptionId, autoRenew } = {}) =>
  call(ENDPOINTS.autoRenew, { method: 'POST', body: { subscription_id: subscriptionId, auto_renew: !!autoRenew } });

export const getSubscriptionApiRoot = () => API_ROOT;