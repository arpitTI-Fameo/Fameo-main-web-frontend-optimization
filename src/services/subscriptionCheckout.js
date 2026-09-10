import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  newCheckoutAttemptId,
} from '@/services/subscription.service';
 
export { newCheckoutAttemptId };
 
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
      key:      order.razorpay_key_id,
      order_id: order.razorpay_order_id,
      amount:   order.amount,               // paise, from the backend — never recomputed
      currency: order.currency || 'INR',
      name:     'Fameo VIP',
      description: description || 'Fameo subscription',
      prefill: {
        name:    user?.name || user?.full_name || '',
        email:   user?.email || '',
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
 
// Full purchase: order → Checkout → verify.
//
// `idempotency_key` identifies one checkout ATTEMPT. Pass the same key when the
// user retries after dismissing Checkout or a failed payment, so the backend
// reuses the open order rather than creating a second one (§4, §9). Generate a
// fresh one only for a genuinely new attempt.
//
// Returns { order, verification } so the caller can show the priced breakdown
// the backend actually charged.
export async function purchasePlan({ billing_id, idempotency_key, marketing_coupon_code, user, description }) {
  const attemptId = idempotency_key || newCheckoutAttemptId();
 
  // Create the authoritative order FIRST. The backend prices it (applying the
  // campaign coupon, which replaces any referral discount) — so the coupon MUST
  // be forwarded here, or Razorpay charges the full price.
  const order = await createRazorpayOrder({
    billing_id,
    idempotency_key: attemptId,
    ...(marketing_coupon_code ? { marketing_coupon_code } : {}),
  });
 
  // Full-waiver (100% coupon): the backend already activated the subscription
  // and returned payment_required:false. Razorpay can't process a zero order,
  // so do NOT open Checkout and do NOT verify — just report it as done.
  if (order?.payment_required === false) {
    return { order, verification: null, alreadyCompleted: false };
  }
 
  // §4: the order may already be settled if this attempt was completed
  // elsewhere. Don't re-open Checkout for it.
  if (order?.payment_completed) {
    return { order, verification: null, alreadyCompleted: true };
  }
 
  // Only load Razorpay when we actually need to charge.
  const ok = await loadRazorpay();
  if (!ok) throw new Error('Could not load the payment window. Check your connection and try again.');
 
  const pay = await openCheckout(order, { user, description });
 
  const verification = await verifyRazorpayPayment({
    razorpay_order_id:   pay.razorpay_order_id,
    razorpay_payment_id: pay.razorpay_payment_id,
    razorpay_signature:  pay.razorpay_signature,
  });
 
  return { order, verification, alreadyCompleted: false };
}