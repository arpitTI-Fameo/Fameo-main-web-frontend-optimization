
import { createServerAction } from '@/lib/api/action';

import { clientFetch } from '@/lib/api/client/fetcher';
import { subscriptionEndpoints } from '@/lib/api/endpoints';

const one = (data) => (Array.isArray(data) ? data[0] : data);

export const newCheckoutAttemptId = () => {
  const uuid = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  return `web_checkout_${uuid.replace(/-/g, '_')}`.slice(0, 100);
};

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

function openCheckout(order, { user, description } = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      key: order.razorpay_key_id,
      order_id: order.razorpay_order_id,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'Fameo VIP',
      description: description || 'Fameo subscription',
      prefill: {
        name: user?.name || user?.full_name || '',
        email: user?.email || '',
        contact: user?.phone || user?.mobile_number || '',
      },
      theme: { color: '#C9A96E' },
      handler: (response) => resolve(response),
      modal: { ondismiss: () => reject(new Error('Payment cancelled.')) },
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (r) => reject(new Error(r?.error?.description || 'Payment failed')));
    rzp.open();
  });
}

export async function purchasePlan({ billing_id, idempotency_key, marketing_coupon_code, user, description }) {
  const attemptId = idempotency_key || newCheckoutAttemptId();

  const orderData = {
    billing_id,
    idempotency_key: attemptId,
    ...(marketing_coupon_code ? { marketing_coupon_code } : {}),
  };
  
  const orderArray = await clientFetch(subscriptionEndpoints.razorpayOrder(), { method: 'POST', body: JSON.stringify(orderData) });
  const order = one(orderArray);

  if (order?.payment_required === false) {
    return { order, verification: null, alreadyCompleted: false };
  }

  if (order?.payment_completed) {
    return { order, verification: null, alreadyCompleted: true };
  }

  const ok = await loadRazorpay();
  if (!ok) throw new Error('Could not load the payment window. Check your connection and try again.');

  const pay = await openCheckout(order, { user, description });

  const verifyData = {
    razorpay_order_id: pay.razorpay_order_id,
    razorpay_payment_id: pay.razorpay_payment_id,
    razorpay_signature: pay.razorpay_signature,
  };
  
  const verification = await clientFetch(subscriptionEndpoints.razorpayVerify(), { method: 'POST', body: JSON.stringify(verifyData) });

  return { order, verification, alreadyCompleted: false };
}

// The quote endpoint answers with a one-item array; one() collapses it. This
// lived in the hook, which referenced one() without importing it — a
// ReferenceError the moment a coupon was applied. It belongs here, next to
// the helper it needs.
export const quoteMarketingCouponAction = async (data) =>
  one(await clientFetch(subscriptionEndpoints.marketingCouponQuote(), {
    method: 'POST',
    body: JSON.stringify(data),
  }));

export const getSubscriptionConfigAction = async () => {
  return createServerAction({
    url: subscriptionEndpoints.config(),
    method: 'GET',
  });
};

export const getPlansAction = async () => {
  return createServerAction({
    url: subscriptionEndpoints.plans(),
    method: 'GET',
  });
};

export const getMembershipAction = async () => {
  return createServerAction({
    url: subscriptionEndpoints.membership(),
    method: 'GET',
  });
};

export const getSubscriptionHistoryAction = async () => {
  return createServerAction({
    url: subscriptionEndpoints.history(),
    method: 'GET',
  });
};

export const createRazorpayOrderAction = async (data) => {
  return createServerAction({
    url: subscriptionEndpoints.razorpayOrder(),
    method: 'POST',
    body: data,
  });
};

export const verifyRazorpayPaymentAction = async (data) => {
  return createServerAction({
    url: subscriptionEndpoints.razorpayVerify(),
    method: 'POST',
    body: data,
  });
};

export const cancelSubscriptionAction = async (data) => {
  return createServerAction({
    url: subscriptionEndpoints.cancel(),
    method: 'POST',
    body: { subscription_id: data.subscriptionId },
  });
};

export const resumeSubscriptionAction = async (data) => {
  return createServerAction({
    url: subscriptionEndpoints.resume(),
    method: 'POST',
    body: { subscription_id: data.subscriptionId },
  });
};

export const setAutoRenewAction = async (data) => {
  return createServerAction({
    url: subscriptionEndpoints.autoRenew(),
    method: 'POST',
    body: { subscription_id: data.subscriptionId },
  });
};

// The central API returns the current subscription as an ARRAY (the active one
// plus any cancelled-but-still-valid record). Normalise to the single most
// relevant subscription so callers can read sub.plan.plan_code directly.
export const getCurrentSubscriptionAction = async () => {
  const data = await clientFetch(subscriptionEndpoints.current());
  if (Array.isArray(data)) {
    if (!data.length) return null;
    return data.find((s) => s?.status === 'active' && !s?.is_cancelled) || data[0];
  }
  return data;
};
