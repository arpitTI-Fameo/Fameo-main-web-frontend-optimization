// constants/portalMockData.js
// ─────────────────────────────────────────────────────────────────────────────
// Mock data for the member portal.
//
// IMPORTANT: every object here is shaped exactly like the API response the
// portal services expect. When the real API is wired up, you only change
// services/portal.service.js — nothing in the components has to change.
//
// See services/portal.service.js for the endpoint each mock maps to.
// ─────────────────────────────────────────────────────────────────────────────

// ─── GET /portal/profile ─────────────────────────────────────────────────────
export const MOCK_PROFILE = {
  id: 'usr_8412',
  fullName: 'Ananya Sharma',
  handle: '@ananya_creates',
  initials: 'AS',
  avatarUrl: null, // falls back to initials when null
  bio: 'Fashion & lifestyle creator · 125K followers',
  location: 'Mumbai, India',
  verified: true,
  plan: { code: 'elite', label: 'Elite', badge: 'Elite member' },
  stats: [
    { key: 'followers', label: 'Followers', value: '125K' },
    { key: 'views', label: 'Profile views', value: '2,431' },
    { key: 'referrals', label: 'Referrals', value: '4' },
  ],
  checks: [
    { id: 'kyc',   label: 'Identity verified',         sub: 'Aadhaar KYC via Digio',    status: 'done' },
    { id: 'sub',   label: 'Elite subscription active', sub: 'Renews 19 Jul 2026 · Razorpay', status: 'done' },
    { id: 'email', label: 'Email verified',            sub: 'ananya@example.com',       status: 'done' },
    { id: 'phone', label: 'Phone verification pending',sub: 'Complete this in the app', status: 'pending' },
  ],
  billing: { planLabel: 'Elite', nextAmount: 3499, nextDate: '19 Jul' },
};

// ─── GET /portal/activity ────────────────────────────────────────────────────
export const MOCK_ACTIVITY = [
  {
    id: 'act_1', type: 'referral', icon: 'user-plus', tone: 'success',
    title: 'Rahul M. subscribed via your coupon',
    subtitle: 'Tier A · 80% off · Popular plan',
    amount: 114.95, amountTone: 'warning', amountLabel: '+₹114.95', time: '2h ago',
  },
  {
    id: 'act_2', type: 'wallet', icon: 'wallet', tone: 'accent',
    title: '₹229.90 added to your wallet',
    subtitle: '15-day hold completed · Tier B',
    amount: 229.9, amountTone: 'success', amountLabel: 'Released', time: '1d ago',
  },
  {
    id: 'act_3', type: 'share', icon: 'share', tone: 'warning',
    title: 'You shared a Tier B coupon',
    subtitle: '50% off · waiting for registration',
    amount: null, amountTone: null, amountLabel: null, time: '3d ago',
  },
  {
    id: 'act_4', type: 'views', icon: 'eye', tone: 'pro',
    title: '168 new profile views this week',
    subtitle: 'From discovery and search',
    amount: null, amountTone: null, amountLabel: null, time: '5d ago',
  },
];

// ─── GET /portal/wallet ──────────────────────────────────────────────────────
export const MOCK_WALLET = {
  currency: 'INR',
  available: 344.85,
  onHold: 174.95,
  lifetimeEarned: 519.8,
  spent: 0,
  holdDays: 15,
};

// ─── GET /portal/wallet/transactions ─────────────────────────────────────────
export const MOCK_TRANSACTIONS = [
  { id: 'txn_1', type: 'credit', description: 'Referral reward — Rahul M.', tier: 'A · 80%', amount: 114.95, status: 'holding',  date: '2026-07-04' },
  { id: 'txn_2', type: 'credit', description: 'Referral reward — Pooja S.', tier: 'B · 50%', amount: 229.9,  status: 'released', date: '2026-06-20' },
  { id: 'txn_3', type: 'credit', description: 'Referral reward — Sara K.',  tier: 'C · 35%', amount: 174.95, status: 'released', date: '2026-05-15' },
];

// ─── GET /portal/referrals ───────────────────────────────────────────────────
export const MOCK_REFERRALS = {
  summary: { total: 15, remaining: 9, subscribed: 4, totalEarned: 519.8 },
  tiers: [
    { code: 'A', discount: 80, durations: '1 & 3 mo', remaining: 3, earnRate: 5 },
    { code: 'B', discount: 50, durations: '3 & 6 mo', remaining: 3, earnRate: 10 },
    { code: 'C', discount: 35, durations: '6 & 12 mo', remaining: 3, earnRate: 15 },
  ],
  coupons: [
    { id: 'cp_1', code: 'FAMEO-X7K2M9', tier: 'A', discount: 80, status: 'subscribed', friend: 'Rahul M.', stage: 'Popular · 1 month',            reward: 114.95, rewardStatus: 'hold' },
    { id: 'cp_2', code: 'FAMEO-K3P9QR', tier: 'B', discount: 50, status: 'shared',     friend: null,       stage: 'Waiting for registration',    reward: null,   rewardStatus: null },
    { id: 'cp_3', code: 'FAMEO-T5QA9Z', tier: 'C', discount: 35, status: 'subscribed', friend: 'Pooja S.', stage: 'Elite · 6 months',            reward: 524.85, rewardStatus: 'paid' },
    { id: 'cp_4', code: 'FAMEO-M2N7PQ', tier: 'A', discount: 80, status: 'rejected',   friend: 'Ajay B.',  stage: 'Did not qualify',             reward: null,   rewardStatus: null },
    { id: 'cp_5', code: 'FAMEO-R4XK2L', tier: 'B', discount: 50, status: 'no_sub',     friend: 'Sara K.',  stage: 'Approved — awaiting subscribe', reward: null, rewardStatus: null },
  ],
};

// ─── GET /portal/subscription ────────────────────────────────────────────────
export const MOCK_SUBSCRIPTION = {
  current: {
    code: 'elite', label: 'Elite plan', price: 3499, interval: 'month',
    status: 'active', renewsOn: '19 Jul 2026', gateway: 'Razorpay',
  },
  notice: 'You are on Elite — the highest plan. No upgrade available.',
  plans: [
    { code: 'popular', label: 'Popular', price: 2299, interval: 'mo', current: false, features: 'Verified badge · DMs · geo discovery' },
    { code: 'elite',   label: 'Elite',   price: 3499, interval: 'mo', current: true,  features: 'All Popular + priority placement + analytics' },
  ],
  cancellationNote: 'Cancellation takes effect at end of current billing period. No refunds.',
};

// ─── GET /portal/invoices ────────────────────────────────────────────────────
export const MOCK_INVOICES = [
  { id: 'inv_1', number: 'FM-001248', plan: 'Elite',   amount: 3499,   gst: 629.82, type: 'standard',      method: 'Razorpay', date: '2026-07-04', downloadUrl: '#' },
  { id: 'inv_2', number: 'FM-001189', plan: 'Elite',   amount: 3499,   gst: 629.82, type: 'standard',      method: 'Razorpay', date: '2026-06-04', downloadUrl: '#' },
  { id: 'inv_3', number: 'FM-001102', plan: 'Popular', amount: 1149.5, gst: 206.91, type: 'proration',     method: 'Razorpay', date: '2026-05-10', downloadUrl: '#' },
  { id: 'inv_4', number: 'FM-001041', plan: 'Popular', amount: 0,      gst: 0,      type: 'coupon_waiver', method: 'Coupon',   date: '2026-01-01', downloadUrl: '#' },
];

// ─── GET /portal/products ────────────────────────────────────────────────────
export const MOCK_PORTAL_PRODUCTS = [
  { id: 'pr_1', name: 'Wireless earbuds',    price: 299, icon: 'headphones', inStock: true },
  { id: 'pr_2', name: 'Smart band',          price: 299, icon: 'watch',      inStock: true },
  { id: 'pr_3', name: 'Steel bottle',        price: 199, icon: 'bottle',     inStock: true },
  { id: 'pr_4', name: 'Bluetooth keyboard',  price: 499, icon: 'keyboard',   inStock: true },
  { id: 'pr_5', name: 'Portable speaker',    price: 349, icon: 'speaker',    inStock: true },
  { id: 'pr_6', name: 'Wireless mouse',      price: 249, icon: 'mouse',      inStock: false },
];

// ─── GET /portal/notifications ───────────────────────────────────────────────
export const MOCK_NOTIFICATIONS = [
  { id: 'n_1', tone: 'pro',     text: 'Rahul M. subscribed using your Tier A coupon', time: '2 hours ago', read: false },
  { id: 'n_2', tone: 'success', text: '₹229.90 released to your wallet',              time: '1 day ago',   read: false },
  { id: 'n_3', tone: 'warning', text: 'Your Elite plan renews in 5 days — ₹3,499',    time: '2 days ago',  read: true  },
  { id: 'n_4', tone: 'muted',   text: '168 new profile views this week',              time: '5 days ago',  read: true  },
];
