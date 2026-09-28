'use client';
import { env } from '@/env';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useCheckoutStore } from '@/store/checkoutStore';
import CheckoutSteps from './CheckoutSteps';
import CheckoutSummary from './CheckoutSummary';
import { SHIPPING_RATES, shippingCostFor, rateFor } from '@/utils/shipping';
import { planTotals, planLabel, CHECKOUT_DISCOUNT_RATE } from '@/utils/planPricing';
import { toOrderShippingAddress, isCompleteAddress } from '@/utils/address';
import { paiseToRupees } from '@/utils/formatCurrency';
import { useMembership } from '@/lib/hooks/custome/useMembership';
import PaymentStep from './PaymentStep';
import OrderReview from './OrderReview';
import OrderConfirmation from './OrderConfirmation';
import { newCheckoutAttemptId } from '@/lib/hooks/main/useSubscription';
import {
  usePreviewCheckoutMutation,
  useCreateCustomerOrderMutation,
  useCreateOrderPaymentMutation,
  useCancelCustomerOrderMutation,
  useVerifyCustomerPaymentMutation,
} from '@/lib/hooks/main/useEcommerce';
import { useSyncCartToServerMutation } from '@/lib/hooks/main/useProduct';
import { S } from './styles';
import { BFF_BASE } from '@/lib/api/config';
import { DEFAULT_LOCALE } from '@/constants/locale';
import { ROUTES } from '@/constants/routes';

// Same-origin via the BFF; the httpOnly session cookie is attached
// server-side, so this module no longer builds an Authorization header.

// Razorpay's default per-transaction ceiling. Keep in sync with RAZORPAY_MAX_INR
// on the backend — if Razorpay Support raises your account limit, raise both.
const MAX_ORDER_INR = Number(env.NEXT_PUBLIC_MAX_ORDER_INR || 500000);


const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

export default function Checkout({ initialAddresses }) {
  const router = useRouter();
  const { user, token } = useAuthStore();

  const cartItems = useCartStore((s) => s.cartItems);
  const cartTotal = useCartStore((s) => s.cartTotal());
  const clearCart = useCartStore((s) => s.clearCart);

  const syncCartToServerMutation = useSyncCartToServerMutation();
  const { mutateAsync: previewCheckout } = usePreviewCheckoutMutation();
  const { mutateAsync: createCustomerOrder } = useCreateCustomerOrderMutation();
  const { mutateAsync: createOrderPayment } = useCreateOrderPaymentMutation();
  const { mutateAsync: cancelCustomerOrder } = useCancelCustomerOrderMutation();
  const { mutateAsync: verifyPayment } = useVerifyCustomerPaymentMutation();

  // The unpaid order this page created, if any. Tapping Pay again (after the
  // Razorpay sheet was closed, or an attempt failed) pays THIS order rather
  // than creating a second one that would hold the same stock. `cartKey` ties
  // it to the bag it was made from.
  const pendingOrderRef = useRef(null);

  // The cart collects the address and the delivery method now, so this page
  // opens on payment when they are already settled. Reading the store once on
  // mount (not subscribing) keeps a later edit from yanking the step backwards
  // mid-checkout.
  const [{ cartAddress, cartMethod, cartRateId }] = useState(() => {
    const cs = useCheckoutStore.getState();
    return {
      cartAddress: cs.address,
      cartMethod: cs.deliveryMethod,
      cartRateId: cs.shippingRateId,
    };
  });

  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const errorRef = useRef(null);

  // Payment errors render at the top of the page. If the shopper is down by the
  // Pay button when one fires, the message is off-screen and the click looks
  // like it did nothing — scroll it into view.
  useEffect(() => {
    if (!error) return;
    errorRef.current?.scrollIntoView({
      behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        ? 'auto' : 'smooth',
      block: 'center',
    });
  }, [error]);
  const [loading, setLoading] = useState(false);
  const [confOrder, setConfOrder] = useState(null);
  // When the server's authoritative total is higher than what the plan discount
  // implied (e.g. the discount doesn't apply to this item), we reprice the
  // summary to the server figure and ask the shopper to confirm — never charge
  // more than we showed. Holds the server payable (rupees) once known.
  const [repriced, setRepriced] = useState(null);
  // COD removed — products are prepaid only. Razorpay is the only method.
  const [payMethod, setPayMethod] = useState('razorpay');
  // Pickup is priced as a zero-cost rate by rateFor(), so the totals here need
  // no special case for it.
  const [shipping, setShipping] = useState(() => rateFor(cartMethod, cartRateId));

  const { plan, rate: discountRate, percent, meta: planMeta } = useMembership();
  const membership = { type: plan, discountRate, discountPercent: percent };

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [addr] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '', address: '', city: '',
    state: 'Telangana', pin: '', country: 'India',
    ...(cartAddress || {}),
  });

  // Redirect if cart empty.
  useEffect(() => {
    if (!mounted) return;
    if (cartItems.length === 0 && step < 2) router.push(ROUTES.PRODUCTS);
  }, [cartItems, step, mounted, router]);

  // Which bag an unpaid order was created from.
  const cartKey = cartItems.map((i) => `${i.product?.id}:${i.qty}`).join('|');

  // If the bag changes, drop any server reprice so we recompute cleanly, and
  // release an unpaid order made from the old bag — it holds that bag's stock.
  useEffect(() => {
    setRepriced(null);
    const pending = pendingOrderRef.current;
    if (pending && pending.cartKey !== cartKey) {
      pendingOrderRef.current = null;
      cancelCustomerOrder({ orderId: pending.orderId, reason: 'Bag changed before payment' })
        .catch(() => { });
    }
  }, [cartKey, cancelCustomerOrder]);

  // ── Pricing calculations ────────────────────────────────────────────────────
  // DISPLAY ONLY. The amount actually charged is the backend's (checkout
  // preview → order → Razorpay), and the two are reconciled before the
  // Razorpay sheet opens instead of being allowed to silently disagree.
  //
  // Checkout applies no plan discount (CHECKOUT_DISCOUNT_RATE) and delivery is
  // free (utils/shipping), matching the backend's charge rules — so this shows
  // exactly what Razorpay will take.
  const { subtotal, discount: memberDiscount, payable } = planTotals(cartItems, CHECKOUT_DISCOUNT_RATE);
  // Once the server tells us the real price (after a first Pay attempt that
  // disagreed), the summary AND the pay-guard both use THAT figure — so the
  // shopper sees exactly what they'll be charged and the second tap goes through.
  const dispPayable = repriced ? repriced.serverPayable : payable;
  const dispDiscount = repriced ? Math.max(0, subtotal - repriced.serverPayable) : memberDiscount;

  // Free-shipping threshold is judged on the POST-discount payable, so the cart,
  // the drawer and this page all reach the same answer.
  const shippingCost = shippingCostFor(shipping, dispPayable);
  const grandTotalINR = Math.round(dispPayable + shippingCost);

  // ── Razorpay ────────────────────────────────────────────────────────────────
  const handleRazorpay = async () => {
    setLoading(true);
    setError('');
    try {
      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) throw new Error('Razorpay SDK failed to load');

      // The order API needs a delivery address. Warehouse pickup collects none
      // in the cart, and orders cannot be created without one yet.
      if (!isCompleteAddress(addr)) {
        throw new Error(
          'Please add a delivery address in your bag before paying — ' +
          'pickup orders need contact details too.'
        );
      }
      const shippingAddress = toOrderShippingAddress(addr);

      let pending = pendingOrderRef.current?.cartKey === cartKey ? pendingOrderRef.current : null;

      if (!pending) {
        // STEP 1 — push the local cart into the server cart. This reserves stock.
        const { cart: serverCart, failed } = await syncCartToServerMutation.mutateAsync(cartItems);
        if (failed.length) {
          throw new Error(
            `Could not reserve: ${failed.map(f => `${f.name} (${f.reason})`).join('; ')}`
          );
        }
        if (!serverCart?.id || !serverCart.items?.length) {
          throw new Error('Cart could not be prepared. Please try again.');
        }

        // STEP 2 — the SERVER decides the price, not the browser (paise).
        // Reconcile against what we just showed. If the server wants MORE,
        // never charge it silently — reprice the summary to the server figure
        // and ask the shopper to confirm; the next Pay tap sails through. If
        // the server is CHEAPER, proceed at that price.
        const preview = await previewCheckout(shippingAddress);
        if (!preview.can_checkout) {
          const issue = preview.issues?.[0];
          throw new Error(issue?.message || 'Some items in your bag are no longer available.');
        }
        const serverPayable = paiseToRupees(preview.summary.grand_total);
        // Against the unrounded figure: grandTotalINR is rounded for display
        // and would flag a ₹9,799.40 order as "more than shown".
        if (serverPayable - (dispPayable + shippingCost) > 0.009) {
          console.error('[checkout] price mismatch', { displayed: grandTotalINR, serverPayable });
          setRepriced({ serverPayable });
          setError(
            `Heads up — the price of an item in your bag has changed, so the total is ` +
            `₹${serverPayable.toLocaleString(DEFAULT_LOCALE)} (not ₹${grandTotalINR.toLocaleString(DEFAULT_LOCALE)}). ` +
            `We've updated your order summary — tap Pay again to confirm.`
          );
          setLoading(false);
          return;
        }

        // Razorpay rejects anything above its per-transaction ceiling (₹5,00,000
        // by default). Catch it here so the shopper gets an actionable message
        // instead of the Pay button failing with an opaque gateway error.
        if (serverPayable > MAX_ORDER_INR) {
          throw new Error(
            `Order total ₹${serverPayable.toLocaleString(DEFAULT_LOCALE)} is above the ` +
            `₹${MAX_ORDER_INR.toLocaleString(DEFAULT_LOCALE)} per-transaction limit. ` +
            `Please split this into two orders, or contact us to place it manually.`
          );
        }

        // STEP 3 — freeze the order: prices, address and stock are fixed now.
        const { order } = await createCustomerOrder({
          shippingAddress,
          idempotencyKey: newCheckoutAttemptId(),
        });
        pending = { orderId: order.id, orderNumber: order.order_number, cartKey };
        pendingOrderRef.current = pending;
      }

      // STEP 4 — a Razorpay order for exactly the order's total. Reuses the
      // live attempt when there is one, so a retry never double-charges.
      const { payment } = await createOrderPayment({
        orderId: pending.orderId,
        idempotencyKey: newCheckoutAttemptId(),
      });
      const chargedINR = paiseToRupees(payment.amount);

      const rzpOptions = {
        key: payment.key_id,
        amount: payment.amount,
        currency: payment.currency,
        name: 'Fameo',
        description: `${cartItems.length} item${cartItems.length > 1 ? 's' : ''}`,
        order_id: payment.provider_order_id,
        prefill: {
          name: `${addr.firstName} ${addr.lastName}`,
          email: addr.email,
          contact: addr.phone,
        },
        notes: {
          order_number: payment.order_number,
          address: `${addr.address}, ${addr.city}, ${addr.state} - ${addr.pin}`,
          membership: membership.type,
        },
        theme: { color: '#E8405A' },

        handler: async (response) => {
          try {
            // STEP 5 — the backend checks the payment with Razorpay and
            // confirms the order: stock, fulfillment, invoice and emails all
            // happen there, in one place.
            const { verification } = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Paid for, but an item sold out before the payment landed: the
            // backend has queued a refund.
            const fulfilmentWarning = verification.status === 'CAPTURED_REFUND_PENDING'
              ? `Payment received (${response.razorpay_payment_id}) but an item sold out before it ` +
                `completed. It will be refunded — please contact support with this payment ID.`
              : '';

            pendingOrderRef.current = null;
            clearCart();
            setConfOrder({
              id: verification.order_number || pending.orderNumber,
              paymentId: response.razorpay_payment_id,
              totalINR: chargedINR,
              memberDiscount: 0,
              shippingCost: 0,
              membershipType: membership.type,
              discountRate: CHECKOUT_DISCOUNT_RATE,
              fulfilmentWarning,
            });
            if (fulfilmentWarning) setError(fulfilmentWarning);
            setStep(2);
          } catch (err) {
            // The money may have been taken even though this call failed —
            // Razorpay's webhook confirms the order on its own. Never ask the
            // shopper to pay again.
            setError(
              `Payment verification failed: ${err.message}. If you were charged, order ` +
              `${pending.orderNumber} will confirm automatically — please don't pay again.`
            );
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            // The order stays open (its stock held) until it expires, so a
            // second tap on Pay retries it instead of starting over.
            setLoading(false);
            setError('Payment cancelled.');
          },
        },
      };

      const rzp = new window.Razorpay(rzpOptions);
      rzp.on('payment.failed', (r) => {
        setError(`Payment failed: ${r.error.description}`);
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handlePlace = () => handleRazorpay();

  if (!mounted) {
    return (
      <>
        <style>{S}</style>
        <div className="chk-page">
          <h1 className="chk-title">Secure <em>Checkout</em></h1>
          <p className="chk-sub">Fameo · Creator Store</p>
        </div>
      </>
    );
  }

  if (step === 2 && confOrder) {
    return (
      <>
        <style>{S}</style>
        <div className="chk-page">
          {confOrder.fulfilmentWarning && (
            <div className="chk-error">⚠ {confOrder.fulfilmentWarning}</div>
          )}
          <OrderConfirmation order={{ membershipType: membership.type, cartTotal, shippingCost, ...confOrder }} addr={addr} />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{S}</style>
      <div className="chk-page">
        <h1 className="chk-title">Secure <em>Checkout</em></h1>
        <p className="chk-sub">Fameo · Creator Store</p>
        <CheckoutSteps current={step} />
        {error && <div className="chk-error" ref={errorRef} role="alert">⚠ {error}</div>}
        <div className="chk-body">
          <div>
            {step === 0 && (
              <PaymentStep
                payMethod={payMethod} onPayMethod={setPayMethod}
                grandTotalINR={grandTotalINR}
                cartTotal={cartTotal}
                shippingCost={shippingCost}
                memberDiscount={dispDiscount}
                membership={membership}
                onNext={() => setStep(1)} onBack={() => router.push(ROUTES.CART)}
              />
            )}
            {step === 1 && (
              <OrderReview
                addr={addr} shipping={shipping} shippingCost={shippingCost}
                payMethod={payMethod}
                grandTotalINR={grandTotalINR}
                cartTotal={cartTotal}
                memberDiscount={dispDiscount}
                membership={membership}
                loading={loading}
                onPlace={handlePlace} onBack={() => setStep(0)}
              />
            )}
          </div>
          <CheckoutSummary
            cartItems={cartItems}
            cartTotal={cartTotal}
            shippingCost={shippingCost}
            memberDiscount={dispDiscount}
            // BUG: this passed `membership={membership}` — an OBJECT — but
            // CheckoutSummary's prop is `membershipType` (a string). The prop
            // never matched, so it defaulted to 'free': the discount row lost
            // its label entirely and the footer read "with your free plan"
            // while the left-hand breakdown correctly said "Popular (2% off)".
            membershipType={membership.type}
          />
        </div>
      </div>
    </>
  );
}
