import { createServerAction } from '@/lib/api/action';
import { clientFetch } from '@/lib/api/client/fetcher';
import { BFF_APP_BASE } from '@/lib/api/config';
import { referralEndpoints } from '@/lib/api/endpoints';
import {
  MOCK_PROFILE,
  MOCK_ACTIVITY,
  MOCK_WALLET,
  MOCK_TRANSACTIONS,
  MOCK_REFERRALS,
  MOCK_SUBSCRIPTION,
  MOCK_INVOICES,
  MOCK_PORTAL_PRODUCTS,
  MOCK_NOTIFICATIONS,
} from '@/constants/portalMockData';

// ─── Toggle ──────────────────────────────────────────────────────────────────
const USE_MOCK = process.env.NEXT_PUBLIC_PORTAL_MOCK !== 'false';

// Referral calls go through /api/bff-app. The upstream host is no longer here
// (it was a NEXT_PUBLIC_ value, so it shipped in the bundle) and neither is the
// token: the app token is an httpOnly cookie the BFF attaches server-side.
async function uatFetch(path, { method = 'GET', body } = {}) {
  try {
    return await clientFetch(path, {
      base: BFF_APP_BASE,
      method,
      headers: { Accept: 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch (error) {
    // Expired / invalid app token → send the user to re-login. There is no
    // refresh token for this upstream, so a fresh login is the correct recovery.
    const expired =
      error.status === 401 ||
      error.errorCode === 'INVALID_TOKEN' ||
      /expired|invalid token/i.test(error.message || '');

    if (expired && typeof window !== 'undefined') {
      const here = window.location.pathname + window.location.search;
      window.location.href = `/login?reason=session_expired&redirect=${encodeURIComponent(here)}`;
      throw new Error('SESSION_EXPIRED');
    }
    throw error;
  }
}

const uatGet  = (path)       => uatFetch(path, { method: 'GET' });
const uatPost = (path, body) => uatFetch(path, { method: 'POST', body });

// ─── Endpoints ───────────────────────────────────────────────────────────────
// The paths themselves now live in lib/api/endpoints.js with every other
// domain. This object is kept as a thin alias so existing call sites in this
// file read the same as before.
export const ENDPOINTS = {
  // §5.1 — public, validate a referral code
  validateCoupon:  (code) => referralEndpoints.validateCoupon(code),
  // §5.4 — my coupons, remaining count, conversions, rewards
  myCoupons:       referralEndpoints.myCoupons(),
  // §5.5 — mark one of my coupons as shared
  shareCoupon:     (code) => referralEndpoints.shareCoupon(code),
  // §5.6 — the logged-in friend's incoming referral benefit
  myBenefit:       referralEndpoints.myBenefit(),
};

// Simulated latency so loading states are visible during development.
const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

// The guide wraps everything in { success, message, data }. Unwrap `data`, and
// unwrap a single-element array where the API returns one (login/register do).
const unwrap = (res) => {
  const d = res && typeof res === 'object' && 'data' in res ? res.data : res;
  return Array.isArray(d) && d.length === 1 ? d[0] : d;
};

// ─── Tier metadata (guide §2 table) ──────────────────────────────────────────
// The my-coupons response carries tier terms per coupon, but not an aggregated
// per-tier "remaining" count. We derive tiers from the coupon list, using this
// table to fill in durations text and defaults.
const TIER_TERMS = {
  A: { discount: 80, earnRate: 5,  durations: '1 or 3 months' },
  B: { discount: 50, earnRate: 10, durations: '3 or 6 months' },
  C: { discount: 35, earnRate: 15, durations: '6 or 12 months' },
};

// ─── Adapters: API shape → component shape ───────────────────────────────────

// Coupon status (UPPERCASE, guide §7) → the status strings the UI styles.
const COUPON_STATUS = {
  AVAILABLE:  'no_sub',      // ready to share (not yet shared)
  SHARED:     'shared',
  REGISTERED: 'pending',     // QC pending
  APPROVED:   'pending',     // approved, awaiting subscription
  SUBSCRIBED: 'subscribed',
  REJECTED:   'rejected',
};

// Human-readable "stage" line for the journey tracker, from coupon status.
const COUPON_STAGE = {
  AVAILABLE:  'Ready to share',
  SHARED:     'Waiting for registration',
  REGISTERED: 'Registration received · QC pending',
  APPROVED:   'Approved · subscription pending',
  SUBSCRIBED: 'Converted',
  REJECTED:   'Registration rejected',
};

// One API coupon → one row the referrals table/tracker understands.
function adaptCoupon(c) {
  const terms = TIER_TERMS[c.couponTier] || {};
  return {
    id:           String(c.id ?? c.code),
    code:         c.code,
    tier:         c.couponTier,
    discount:     c.discountPercent ?? terms.discount ?? null,
    status:       COUPON_STATUS[c.status] || 'no_sub',
    friend:       c.friendName || null,
    stage:        COUPON_STAGE[c.status] || '—',
    reward:       c.rewardAmount ?? null,
    // rewardStatus HOLD/RELEASED (guide §7) → hold/paid used by the UI
    rewardStatus: c.rewardStatus === 'RELEASED' ? 'paid'
                : c.rewardStatus === 'HOLD'     ? 'hold'
                : null,
    shareUrl:     c.shareUrl || null,
    shareMessage: c.shareMessage || null,
    // kept for transaction dates; underscore-prefixed as they're not UI fields
    _sharedAt:      c.sharedAt || null,
    _subscribedAt:  c.subscribedAt || null,
  };
}

// Whole my-coupons payload → the { summary, tiers, coupons } the page expects.
function adaptReferrals(data) {
  const s = data.summary || {};
  const coupons = (data.coupons || []).map(adaptCoupon);

  // Derive per-tier remaining from AVAILABLE coupons in each tier.
  const tiers = ['A', 'B', 'C'].map((code) => {
    const terms = TIER_TERMS[code];
    const remaining = (data.coupons || []).filter(
      (c) => c.couponTier === code && c.status === 'AVAILABLE'
    ).length;
    return { code, ...terms, remaining };
  });

  return {
    summary: {
      total:       s.total ?? coupons.length,
      remaining:   s.available ?? 0,
      subscribed:  s.converted ?? 0,
      totalEarned: s.totalReward ?? 0,
    },
    tiers,
    coupons,
    creatorTier: data.creatorTier || null,
  };
}

// Wallet: the guide (§6 note) says there is no dedicated user wallet endpoint
// yet — reward amounts live inside my-coupons. So we compute the wallet from the
// coupon rewards until the backend exposes /my-wallet.
function adaptWallet(referralsData) {
  const coupons = referralsData.coupons || [];
  const sum = (pred) =>
    coupons.reduce((t, c) => t + (pred(c) ? Number(c.reward || 0) : 0), 0);

  const released = sum((c) => c.rewardStatus === 'paid');
  const onHold   = sum((c) => c.rewardStatus === 'hold');

  return {
    currency:       'INR',
    available:      released,             // released rewards are spendable
    onHold,                               // HOLD rewards not yet released
    lifetimeEarned: released + onHold,
    spent:          0,                    // no spend endpoint yet
    holdDays:       15,                   // 15-day hold, guide §6
  };
}

// Transactions: one row per coupon that has a reward, newest first.
function adaptTransactions(referralsData) {
  return (referralsData.coupons || [])
    .filter((c) => c.reward != null)
    .map((c) => ({
      id:          `txn_${c.id ?? c.code}`,
      type:        'credit',
      description: `Referral reward — ${c.friend || c.code}`,
      tier:        `${c.tier} · ${(TIER_TERMS[c.tier] || {}).discount ?? ''}%`,
      amount:      Number(c.reward || 0),
      status:      c.rewardStatus === 'paid' ? 'released' : 'holding',
      date:        c._subscribedAt || c._sharedAt || null,
    }))
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

// ─── Reads ───────────────────────────────────────────────────────────────────

// Profile / activity / subscription / invoices / products / notifications are
// not part of the referral guide. They stay on mock until their own endpoints
// exist; wire them here the same way when they do.

export const getProfileAction = async () => {
  if (USE_MOCK) { await delay(); return MOCK_PROFILE; }
  return MOCK_PROFILE; // TODO: replace with real profile endpoint when available
};

export const getActivityAction = async (limit = 10) => {
  if (USE_MOCK) { await delay(); return MOCK_ACTIVITY.slice(0, limit); }
  return MOCK_ACTIVITY.slice(0, limit); // TODO: real activity feed
};

export const getSubscriptionAction = async () => {
  if (USE_MOCK) { await delay(); return MOCK_SUBSCRIPTION; }
  return MOCK_SUBSCRIPTION; // TODO: real subscription endpoint
};

export const getInvoicesAction = async () => {
  if (USE_MOCK) { await delay(); return MOCK_INVOICES; }
  return MOCK_INVOICES; // TODO: real invoices endpoint
};

export const getPortalProductsAction = async () => {
  if (USE_MOCK) { await delay(); return MOCK_PORTAL_PRODUCTS; }
  return MOCK_PORTAL_PRODUCTS; // TODO: real products endpoint
};

export const getNotificationsAction = async () => {
  if (USE_MOCK) { await delay(200); return MOCK_NOTIFICATIONS; }
  return MOCK_NOTIFICATIONS; // TODO: real notifications endpoint
};

// Referrals — GET /referral-program/my-coupons (guide §5.4)
export const getReferralsAction = async () => {
  if (USE_MOCK) { await delay(); return MOCK_REFERRALS; }
  const data = unwrap(await uatGet(ENDPOINTS.myCoupons));
  return adaptReferrals(data);
};

// Wallet — derived from my-coupons rewards (guide §6 note: no wallet endpoint)
export const getWalletAction = async () => {
  if (USE_MOCK) { await delay(); return MOCK_WALLET; }
  const data = unwrap(await uatGet(ENDPOINTS.myCoupons));
  return adaptWallet(adaptReferrals(data));
};

// Transactions — also derived from my-coupons rewards
export const getTransactionsAction = async () => {
  if (USE_MOCK) { await delay(); return MOCK_TRANSACTIONS; }
  const data = unwrap(await uatGet(ENDPOINTS.myCoupons));
  return adaptTransactions(adaptReferrals(data));
};

// ─── Writes ──────────────────────────────────────────────────────────────────

// Share a coupon — POST /my-coupons/{code}/share (guide §5.5).
// The referrals UI passes a coupon *id*; the API keys on *code*, so resolve the
// code from the current coupon list first.
export const shareCouponAction = async (couponIdOrCode) => {
  if (USE_MOCK) { await delay(); return { ok: true, couponId: couponIdOrCode }; }

  let code = couponIdOrCode;
  // If we were handed an internal id, look up the code.
  if (!/^FAMEO-/i.test(String(couponIdOrCode))) {
    const data = unwrap(await uatGet(ENDPOINTS.myCoupons));
    const match = (data.coupons || []).find(
      (c) => String(c.id) === String(couponIdOrCode)
    );
    if (match) code = match.code;
  }

  const res = unwrap(await uatPost(ENDPOINTS.shareCoupon(code), {}));
  return { ok: true, ...res }; // { code, status, shareUrl, shareMessage }
};

// Validate a referral code — GET /coupons/{code}/validate (guide §5.1).
// Public; used by the registration page, exposed here for completeness.
export const validateCoupon = async (code, { plan, duration } = {}) => {
  if (USE_MOCK) {
    await delay();
    return { code, couponTier: 'A', discountPercent: 80, rewardPercent: 5,
             allowedDurations: [1, 3], planApplicability: 'BOTH' };
  }
  const qs = new URLSearchParams();
  if (plan) qs.set('plan', plan);
  if (duration) qs.set('duration', duration);
  const suffix = qs.toString() ? `?${qs}` : '';
  return unwrap(await uatGet(`${ENDPOINTS.validateCoupon(code)}${suffix}`));
};

// Incoming referral benefit — GET /my-referral-benefit (guide §5.6).
export const getReferralBenefit = async ({ plan, duration } = {}) => {
  if (USE_MOCK) {
    await delay();
    return { code: 'FAMEO-AB12CD34', couponTier: 'A', discountPercent: 80,
             allowedDurations: [1, 3], planApplicability: 'BOTH' };
  }
  const qs = new URLSearchParams();
  if (plan) qs.set('plan', plan);
  if (duration) qs.set('duration', duration);
  const suffix = qs.toString() ? `?${qs}` : '';
  return unwrap(await uatGet(`${ENDPOINTS.myBenefit}${suffix}`));
};

// ─── Not in the referral guide ───────────────────────────────────────────────
// These have no endpoint in the guide. They resolve locally so the UI stays
// functional; wire them up when the backend adds them (guide §10 lists the
// wallet spend + product purchase gaps).

export const buyWithWalletAction = async (productId) => {
  if (USE_MOCK) { await delay(); return { ok: true, productId }; }
  return { ok: true, productId }; // TODO: real product purchase endpoint
};

export const cancelSubscriptionAction = async (reason = '') => {
  if (USE_MOCK) { await delay(); return { ok: true }; }
  return { ok: true, reason }; // TODO: real cancel endpoint
};

// ─── TanStack Query Hooks ──────────────────────────────────────────────────




