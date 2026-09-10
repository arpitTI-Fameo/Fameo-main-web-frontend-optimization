
// 'use client';
// import { useState, useEffect, useRef } from 'react';
// import { useRouter }              from 'next/navigation';
// import { useCartStore }           from '@/store/cartStore';
// import { useAuthStore }           from '@/store/authStore';
// import CheckoutSteps              from '@/components/checkout/CheckoutSteps';
// import CheckoutSummary            from '@/components/checkout/CheckoutSummary';
// import DeliveryForm, { validateAddress, validateAddressFields, focusFirstError } from '@/components/checkout/DeliveryForm';
// import { SHIPPING_RATES, shippingCostFor } from '@/lib/shipping';
// import { planTotals, reconcilePlanTotals, planLabel } from '@/lib/planPricing';
// import { useMembership }          from '@/hooks/useMembership';
// import PaymentStep                from '@/components/checkout/PaymentStep';
// import OrderReview                from '@/components/checkout/OrderReview';
// import OrderConfirmation          from '@/components/checkout/OrderConfirmation';
// import {
//   syncCartToServer,
//   checkout   as productsCheckout,
//   clearCart  as clearServerCart,
// } from '@/services/fameoProducts.service';

// const BASE        = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// // Razorpay's default per-transaction ceiling. Keep in sync with RAZORPAY_MAX_INR
// // on the backend — if Razorpay Support raises your account limit, raise both.
// const MAX_ORDER_INR = Number(process.env.NEXT_PUBLIC_MAX_ORDER_INR || 500000);
// const ADDRESS_KEY = 'fameo_saved_address';

// const getToken = () => {
//   try {
//     const raw = localStorage.getItem('fameo-auth');
//     return raw ? JSON.parse(raw)?.state?.token : null;
//   } catch { return null; }
// };

// const loadRazorpay = () =>
//   new Promise((resolve) => {
//     if (window.Razorpay) return resolve(true);
//     const s = document.createElement('script');
//     s.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     s.onload = () => resolve(true);
//     s.onerror = () => resolve(false);
//     document.body.appendChild(s);
//   });

// const S = `
//   .chk-page { max-width:1160px; margin:0 auto; padding:40px 56px 80px; font-family:'Jost',sans-serif; background:#fff; min-height:100vh; }
//   .chk-title { font-family:'Cormorant Garamond',serif; font-size:clamp(28px,4vw,48px); font-weight:300; color:#181820; margin-bottom:4px; }
//   .chk-title em { font-style:italic; color:#E8405A; }
//   .chk-sub { font-size:10px; font-weight:300; letter-spacing:.2em; text-transform:uppercase; color:#9898a8; margin-bottom:32px; }
//   .chk-body { display:grid; grid-template-columns:1fr 320px; gap:48px; align-items:start; }
//   .chk-error { padding:10px 14px; background:rgba(232,64,90,.06); border:1px solid rgba(232,64,90,.25); border-radius:3px; font-size:12px; font-weight:300; color:#E8405A; margin-bottom:16px; }
//   @media(max-width:900px) { .chk-page { padding:28px 20px 60px; } .chk-body { grid-template-columns:1fr; } }
// `;

// export default function CheckoutClient() {
//   const router          = useRouter();
//   const { user, token } = useAuthStore();

//   const cartItems  = useCartStore((s) => s.cartItems);
//   const cartTotal  = useCartStore((s) => s.cartTotal());
//   const clearCart  = useCartStore((s) => s.clearCart);

//   const [step,       setStep]       = useState(0);
//   const [error,      setError]      = useState('');
//   const errorRef                    = useRef(null);

//   // Payment errors render at the top of the page. If the shopper is down by the
//   // Pay button when one fires, the message is off-screen and the click looks
//   // like it did nothing — scroll it into view.
//   useEffect(() => {
//     if (!error) return;
//     errorRef.current?.scrollIntoView({
//       behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
//         ? 'auto' : 'smooth',
//       block: 'center',
//     });
//   }, [error]);
//   const [loading,    setLoading]    = useState(false);
//   const [confOrder,  setConfOrder]  = useState(null);
//   // When the server's authoritative total is higher than what the plan discount
//   // implied (e.g. the discount doesn't apply to this item), we reprice the
//   // summary to the server figure and ask the shopper to confirm — never charge
//   // more than we showed. Holds the server payable (rupees) once known.
//   const [repriced,   setRepriced]   = useState(null);
//   // COD removed — products are prepaid only. Razorpay is the only method.
//   const [payMethod,  setPayMethod]  = useState('razorpay');
//   const [shipping,   setShipping]   = useState(SHIPPING_RATES[0]);
//   const [savedAddr,  setSavedAddr]  = useState(null);

//   // Plan resolution moved into useMembership(). The old code did its own fetch
//   // and read `d.data.discountRate` directly — undefined whenever the API answers
//   // with `discountPercent: 2`, which silently charged Popular/Elite members full
//   // price at checkout while /cart still showed them the discount.
//   const { plan, rate: discountRate, percent, meta: planMeta } = useMembership();
//   const membership = { type: plan, discountRate, discountPercent: percent };

//   // Cart totals come from persisted (localStorage) state the server can't see,
//   // so the first client render must match the server's empty-cart render.
//   // Gate the cart-dependent UI until after mount to avoid a hydration mismatch.
//   const [mounted, setMounted] = useState(false);
//   useEffect(() => { setMounted(true); }, []);

//   const [addr, setAddr] = useState({
//     firstName: user?.name?.split(' ')[0] || '',
//     lastName:  user?.name?.split(' ').slice(1).join(' ') || '',
//     email:     user?.email || '',
//     phone: '', address: '', city: '',
//     state: 'Telangana', pin: '', country: 'India', saveAddr: true,
//   });

//   // Load saved address from localStorage
//   useEffect(() => {
//     try {
//       const saved = localStorage.getItem(ADDRESS_KEY);
//       if (saved) setSavedAddr(JSON.parse(saved));
//     } catch (_) {}
//   }, []);

//   // Redirect if cart empty.
//   // `step` was missing from the dep array, so this ran against a stale step and
//   // could bounce the user to /products right after clearCart() on a successful
//   // payment — losing the confirmation screen. Also wait for hydration: the
//   // persisted cart doesn't exist during SSR, so on first paint it always looks
//   // empty.
//   useEffect(() => {
//     if (!mounted) return;
//     if (cartItems.length === 0 && step < 3) router.push('/products');
//   }, [cartItems, step, mounted, router]);

//   // If the bag changes, drop any server reprice so we recompute cleanly.
//   useEffect(() => { setRepriced(null); }, [cartItems]);

//   // ── Pricing calculations ────────────────────────────────────────────────────
//   // DISPLAY ONLY. The amount actually charged comes from the products server
//   // cart in handleRazorpay (STEP 2) — but the two are now reconciled before the
//   // Razorpay sheet opens instead of being allowed to silently disagree.
//   //
//   // Discount is computed per line then summed, matching how the products backend
//   // rounds each item's final_price before multiplying by quantity. Summing first
//   // and discounting once drifted by a rupee or two and made this page disagree
//   // with the invoice.
//   const { subtotal, discount: memberDiscount, payable } = planTotals(cartItems, discountRate);
//   // Once the server tells us the real price (after a first Pay attempt that
//   // disagreed), the summary AND the pay-guard both use THAT figure — so the
//   // shopper sees exactly what they'll be charged and the second tap goes through.
//   const dispPayable  = repriced ? repriced.serverPayable : payable;
//   const dispDiscount = repriced ? Math.max(0, subtotal - repriced.serverPayable) : memberDiscount;

//   // Free-shipping threshold is judged on the POST-discount payable, so the cart,
//   // the drawer and this page all reach the same answer.
//   const shippingCost   = shippingCostFor(shipping, dispPayable);
//   const grandTotalINR  = Math.round(dispPayable + shippingCost);

//   const handleAddrChange = (key, value) => {
//     if (key === '__fill__') { setAddr((a) => ({ ...a, ...value, saveAddr: false })); return; }
//     setAddr((a) => ({ ...a, [key]: value }));
//     setError('');
//   };

//   const handleDeliveryNext = () => {
//     // DeliveryForm now validates and scrolls to the offending field itself, so
//     // by the time this fires the address is already clean. Kept as a backstop
//     // in case onNext is ever wired from elsewhere.
//     const fieldErrors = validateAddressFields(addr);
//     if (Object.keys(fieldErrors).length) {
//       focusFirstError(fieldErrors);
//       return setError(validateAddress(addr));
//     }
//     if (addr.saveAddr) {
//       try {
//         const { saveAddr: _, ...toSave } = addr;
//         localStorage.setItem(ADDRESS_KEY, JSON.stringify(toSave));
//         setSavedAddr(toSave);
//       } catch (_) {}
//     }
//     setError('');
//     setStep(1);
//   };

//   // ── Razorpay ────────────────────────────────────────────────────────────────
//   const handleRazorpay = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const sdkLoaded = await loadRazorpay();
//       if (!sdkLoaded) throw new Error('Razorpay SDK failed to load');

//       const authToken = getToken();
//       const headers   = { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) };

//       // STEP 1 — push the local cart into the products server cart.
//       // This reserves stock and locks the plan discount (doc §1.3).
//       const { cart: serverCart, failed } = await syncCartToServer(cartItems);
//       if (failed.length) {
//         throw new Error(
//           `Could not reserve: ${failed.map(f => `${f.name} (${f.reason})`).join('; ')}`
//         );
//       }
//       if (!serverCart?.id || !serverCart.items?.length) {
//         throw new Error('Cart could not be prepared. Please try again.');
//       }

//       // STEP 2 — the SERVER decides the price, not the browser.
//       // Products API returns paise.
//       //
//       // Reconcile against what we just showed the user. Previously the page
//       // displayed `cartTotal + shipping - clientDiscount` but charged
//       // `serverTotal + shipping`; when the membership lookup failed those were
//       // different numbers and nothing noticed — the user saw one price and
//       // Razorpay took another. Now a real disagreement stops the flow.
//       const { serverPayable, drift, mismatch } = reconcilePlanTotals({
//         serverItems: serverCart.items,
//         displayedPayable: dispPayable,
//       });

//       if (mismatch) {
//         console.error('[checkout] price mismatch', {
//           displayedPayable: dispPayable, serverPayable, drift, plan,
//         });
//         // The server is the source of truth. If it wants MORE than we showed
//         // (the plan discount doesn't apply to this item), never charge it
//         // silently — reprice the summary to the server figure and ask the
//         // shopper to confirm. The next Pay tap sees displayed === server and
//         // sails through. If the server is CHEAPER, just proceed at that price.
//         if (serverPayable > Math.round(dispPayable)) {
//           setRepriced({ serverPayable });
//           setError(
//             `Heads up — your plan discount doesn't apply to this item, so the total is ` +
//             `₹${serverPayable.toLocaleString('en-IN')} (not ₹${Math.round(dispPayable).toLocaleString('en-IN')}). ` +
//             `We've updated your order summary — tap Pay again to confirm.`
//           );
//           setLoading(false);
//           return;
//         }
//       }

//       // Shipping is recomputed from the SERVER payable for the same reason.
//       const serverShipping = shippingCostFor(shipping, serverPayable);
//       const payableINR     = serverPayable + serverShipping;
//       // What the server actually discounted, for the audit record below.
//       const serverDiscount = Math.round(subtotal - serverPayable);

//       // Razorpay rejects anything above its per-transaction ceiling (₹5,00,000
//       // by default). Catch it here so the shopper gets an actionable message
//       // instead of the Pay button failing with an opaque gateway error.
//       if (payableINR > MAX_ORDER_INR) {
//         throw new Error(
//           `Order total ₹${payableINR.toLocaleString('en-IN')} is above the ` +
//           `₹${MAX_ORDER_INR.toLocaleString('en-IN')} per-transaction limit. ` +
//           `Please split this into two orders, or contact us to place it manually.`
//         );
//       }

//       // STEP 3 — Razorpay order for the server-verified amount
//       const orderRes  = await fetch(`${BASE}/api/orders/create-razorpay-order`, {
//         method: 'POST', headers,
//         body: JSON.stringify({ amountINR: payableINR }),
//       });
//       const orderData = await orderRes.json();
//       if (!orderRes.ok) throw new Error(orderData.message || 'Failed to create order');

//       const rzpOptions = {
//         key:         orderData.data.key,
//         amount:      orderData.data.amount,
//         currency:    orderData.data.currency,
//         name:        'Fameo',
//         description: `${cartItems.length} item${cartItems.length > 1 ? 's' : ''}`,
//         order_id:    orderData.data.orderId,
//         prefill: {
//           name:    `${addr.firstName} ${addr.lastName}`,
//           email:   addr.email,
//           contact: addr.phone,
//         },
//         notes: {
//           address:    `${addr.address}, ${addr.city}, ${addr.state} - ${addr.pin}`,
//           membership: membership.type,
//         },
//         theme: { color: '#E8405A' },

//         handler: async (response) => {
//           try {
//             // STEP 4 — record the payment on the main backend (PostgreSQL)
//             const verifyRes = await fetch(`${BASE}/api/orders/verify-payment`, {
//               method: 'POST', headers,
//               body: JSON.stringify({
//                 razorpay_order_id:   response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature:  response.razorpay_signature,
//                 cartItems, addr,
//                 shipping:       { method: shipping.id, cost: serverShipping },
//                 totalINR:       payableINR,
//                 // Record the discount the SERVER applied, not the client's
//                 // estimate — this row is what reconciliation reads later.
//                 memberDiscount: serverDiscount,
//                 membershipType: membership.type,
//               }),
//             });
//             const verifyData = await verifyRes.json();
//             if (!verifyRes.ok) throw new Error(verifyData.message || 'Verification failed');

//             // STEP 5 — create the products orders (MongoDB).
//             // This is what makes the order appear in the retailer/admin dashboard,
//             // deducts stock, and generates the creator invoice.
//             let productsOrderIds = [];
//             let fulfilmentWarning = '';
//             try {
//               // Delivery address captured on this checkout — sent so it lands on
//               // the order and the box (customer) invoice's Ship-To.
//               const shippingAddress = {
//                 name:    `${addr.firstName || ''} ${addr.lastName || ''}`.trim(),
//                 phone:   addr.phone,
//                 email:   addr.email,
//                 line1:   addr.address,
//                 city:    addr.city,
//                 state:   addr.state,
//                 pincode: addr.pin,
//                 country: 'India',
//               };
//               const res = await productsCheckout(serverCart.id, response.razorpay_payment_id, shippingAddress);
//               productsOrderIds = (res.orders || []).map(o => o.id);
//             } catch (e) {
//               // Payment already succeeded — never fail the user here.
//               // Surface it so support can reconcile against the payment ref.
//               console.error('[products checkout] failed', e);
//               fulfilmentWarning =
//                 `Payment received (${response.razorpay_payment_id}) but the order needs ` +
//                 `manual confirmation. Please contact support with this payment ID.`;
//             }

//             clearCart();
//             setConfOrder({
//               id:             verifyData.data.orderId,
//               paymentId:      response.razorpay_payment_id,
//               totalINR:       payableINR,
//               memberDiscount: serverDiscount,
//               shippingCost:   serverShipping,
//               membershipType: membership.type,
//               discountRate,
//               productsOrderIds,
//               fulfilmentWarning,
//             });
//             if (fulfilmentWarning) setError(fulfilmentWarning);
//             setStep(3);
//           } catch (err) {
//             setError(`Payment verification failed: ${err.message}`);
//           } finally {
//             setLoading(false);
//           }
//         },

//         modal: {
//           ondismiss: async () => {
//             // Release reserved stock so an abandoned checkout doesn't hold units.
//             await clearServerCart().catch(() => {});
//             setLoading(false);
//             setError('Payment cancelled.');
//           },
//         },
//       };

//       const rzp = new window.Razorpay(rzpOptions);
//       rzp.on('payment.failed', async (r) => {
//         await clearServerCart().catch(() => {});
//         setError(`Payment failed: ${r.error.description}`);
//         setLoading(false);
//       });
//       rzp.open();

//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   const handlePlace = () => handleRazorpay();

//   if (!mounted) {
//     return (
//       <>
//         <style>{S}</style>
//         <div className="chk-page">
//           <h1 className="chk-title">Secure <em>Checkout</em></h1>
//           <p className="chk-sub">Fameo · Creator Store</p>
//         </div>
//       </>
//     );
//   }

//   if (step === 3 && confOrder) {
//     return (
//       <>
//         <style>{S}</style>
//         <div className="chk-page">
//           {confOrder.fulfilmentWarning && (
//             <div className="chk-error">⚠ {confOrder.fulfilmentWarning}</div>
//           )}
//           <OrderConfirmation order={{ membershipType: membership.type, cartTotal, shippingCost, ...confOrder }} addr={addr} />
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <style>{S}</style>
//       <div className="chk-page">
//         <h1 className="chk-title">Secure <em>Checkout</em></h1>
//         <p className="chk-sub">Fameo · Creator Store</p>
//         <CheckoutSteps current={step} />
//         {error && <div className="chk-error" ref={errorRef} role="alert">⚠ {error}</div>}
//         <div className="chk-body">
//           <div>
//             {step === 0 && (
//               <DeliveryForm
//                 addr={addr} onAddr={handleAddrChange}
//                 shipping={shipping} onShipping={setShipping}
//                 savedAddr={savedAddr} cartTotal={dispPayable}
//                 onNext={handleDeliveryNext} onBack={() => router.push('/cart')}
//               />
//             )}
//             {step === 1 && (
//               <PaymentStep
//                 payMethod={payMethod} onPayMethod={setPayMethod}
//                 grandTotalINR={grandTotalINR}
//                 cartTotal={cartTotal}
//                 shippingCost={shippingCost}
//                 memberDiscount={dispDiscount}
//                 membership={membership}
//                 onNext={() => setStep(2)} onBack={() => setStep(0)}
//               />
//             )}
//             {step === 2 && (
//               <OrderReview
//                 addr={addr} shipping={shipping} shippingCost={shippingCost}
//                 payMethod={payMethod}
//                 grandTotalINR={grandTotalINR}
//                 cartTotal={cartTotal}
//                 memberDiscount={dispDiscount}
//                 membership={membership}
//                 loading={loading}
//                 onPlace={handlePlace} onBack={() => setStep(1)}
//               />
//             )}
//           </div>
//           <CheckoutSummary
//             cartItems={cartItems}
//             cartTotal={cartTotal}
//             shippingCost={shippingCost}
//             memberDiscount={dispDiscount}
//             // BUG: this passed `membership={membership}` — an OBJECT — but
//             // CheckoutSummary's prop is `membershipType` (a string). The prop
//             // never matched, so it defaulted to 'free': the discount row lost
//             // its label entirely and the footer read "with your free plan"
//             // while the left-hand breakdown correctly said "Popular (2% off)".
//             membershipType={membership.type}
//           />
//         </div>
//       </div>
//     </>
//   );
// }


'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter }              from 'next/navigation';
import { useCartStore }           from '@/store/cartStore';
import { useAuthStore }           from '@/store/authStore';
import CheckoutSteps              from '@/components/checkout/CheckoutSteps';
import CheckoutSummary            from '@/components/checkout/CheckoutSummary';
import DeliveryForm, { validateAddress, validateAddressFields, focusFirstError } from '@/components/checkout/DeliveryForm';
import { SHIPPING_RATES, shippingCostFor } from '@/lib/shipping';
import { planTotals, reconcilePlanTotals, planLabel } from '@/lib/planPricing';
import { useMembership }          from '@/hooks/useMembership';
import PaymentStep                from '@/components/checkout/PaymentStep';
import OrderReview                from '@/components/checkout/OrderReview';
import OrderConfirmation          from '@/components/checkout/OrderConfirmation';
import {
  syncCartToServer,
  checkout   as productsCheckout,
  clearCart  as clearServerCart,
} from '@/services/fameoProducts.service';

const BASE        = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Razorpay's default per-transaction ceiling. Keep in sync with RAZORPAY_MAX_INR
// on the backend — if Razorpay Support raises your account limit, raise both.
const MAX_ORDER_INR = Number(process.env.NEXT_PUBLIC_MAX_ORDER_INR || 500000);
const ADDRESS_KEY = 'fameo_saved_address';

const getToken = () => {
  try {
    const raw = localStorage.getItem('fameo-auth');
    return raw ? JSON.parse(raw)?.state?.token : null;
  } catch { return null; }
};

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

const S = `
  .chk-page { max-width:1160px; margin:0 auto; padding:40px 56px 80px; font-family:'Jost',sans-serif; background:#fff; min-height:100vh; }
  .chk-title { font-family:'Cormorant Garamond',serif; font-size:clamp(28px,4vw,48px); font-weight:300; color:#181820; margin-bottom:4px; }
  .chk-title em { font-style:italic; color:#E8405A; }
  .chk-sub { font-size:10px; font-weight:300; letter-spacing:.2em; text-transform:uppercase; color:#9898a8; margin-bottom:32px; }
  .chk-body { display:grid; grid-template-columns:1fr 320px; gap:48px; align-items:start; }
  .chk-error { padding:10px 14px; background:rgba(232,64,90,.06); border:1px solid rgba(232,64,90,.25); border-radius:3px; font-size:12px; font-weight:300; color:#E8405A; margin-bottom:16px; }
  @media(max-width:900px) { .chk-page { padding:28px 20px 60px; } .chk-body { grid-template-columns:1fr; } }
`;

export default function CheckoutClient() {
  const router          = useRouter();
  const { user, token } = useAuthStore();

  const cartItems  = useCartStore((s) => s.cartItems);
  const cartTotal  = useCartStore((s) => s.cartTotal());
  const clearCart  = useCartStore((s) => s.clearCart);

  const [step,       setStep]       = useState(0);
  const [error,      setError]      = useState('');
  const errorRef                    = useRef(null);

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
  const [loading,    setLoading]    = useState(false);
  const [confOrder,  setConfOrder]  = useState(null);
  // When the server's authoritative total is higher than what the plan discount
  // implied (e.g. the discount doesn't apply to this item), we reprice the
  // summary to the server figure and ask the shopper to confirm — never charge
  // more than we showed. Holds the server payable (rupees) once known.
  const [repriced,   setRepriced]   = useState(null);
  // COD removed — products are prepaid only. Razorpay is the only method.
  const [payMethod,  setPayMethod]  = useState('razorpay');
  const [shipping,   setShipping]   = useState(SHIPPING_RATES[0]);
  const [savedAddr,  setSavedAddr]  = useState(null);

  // Plan resolution moved into useMembership(). The old code did its own fetch
  // and read `d.data.discountRate` directly — undefined whenever the API answers
  // with `discountPercent: 2`, which silently charged Popular/Elite members full
  // price at checkout while /cart still showed them the discount.
  const { plan, rate: discountRate, percent, meta: planMeta } = useMembership();
  const membership = { type: plan, discountRate, discountPercent: percent };

  // Cart totals come from persisted (localStorage) state the server can't see,
  // so the first client render must match the server's empty-cart render.
  // Gate the cart-dependent UI until after mount to avoid a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [addr, setAddr] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName:  user?.name?.split(' ').slice(1).join(' ') || '',
    email:     user?.email || '',
    phone: '', address: '', city: '',
    state: 'Telangana', pin: '', country: 'India', saveAddr: true,
  });

  // Load saved address from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(ADDRESS_KEY);
      if (saved) setSavedAddr(JSON.parse(saved));
    } catch (_) {}
  }, []);

  // Redirect if cart empty.
  // `step` was missing from the dep array, so this ran against a stale step and
  // could bounce the user to /products right after clearCart() on a successful
  // payment — losing the confirmation screen. Also wait for hydration: the
  // persisted cart doesn't exist during SSR, so on first paint it always looks
  // empty.
  useEffect(() => {
    if (!mounted) return;
    if (cartItems.length === 0 && step < 3) router.push('/products');
  }, [cartItems, step, mounted, router]);

  // If the bag changes, drop any server reprice so we recompute cleanly.
  useEffect(() => { setRepriced(null); }, [cartItems]);

  // ── Pricing calculations ────────────────────────────────────────────────────
  // DISPLAY ONLY. The amount actually charged comes from the products server
  // cart in handleRazorpay (STEP 2) — but the two are now reconciled before the
  // Razorpay sheet opens instead of being allowed to silently disagree.
  //
  // Discount is computed per line then summed, matching how the products backend
  // rounds each item's final_price before multiplying by quantity. Summing first
  // and discounting once drifted by a rupee or two and made this page disagree
  // with the invoice.
  const { subtotal, discount: memberDiscount, payable } = planTotals(cartItems, discountRate);
  // Once the server tells us the real price (after a first Pay attempt that
  // disagreed), the summary AND the pay-guard both use THAT figure — so the
  // shopper sees exactly what they'll be charged and the second tap goes through.
  const dispPayable  = repriced ? repriced.serverPayable : payable;
  const dispDiscount = repriced ? Math.max(0, subtotal - repriced.serverPayable) : memberDiscount;

  // Free-shipping threshold is judged on the POST-discount payable, so the cart,
  // the drawer and this page all reach the same answer.
  const shippingCost   = shippingCostFor(shipping, dispPayable);
  const grandTotalINR  = Math.round(dispPayable + shippingCost);

  const handleAddrChange = (key, value) => {
    if (key === '__fill__') { setAddr((a) => ({ ...a, ...value, saveAddr: false })); return; }
    setAddr((a) => ({ ...a, [key]: value }));
    setError('');
  };

  const handleDeliveryNext = () => {
    // DeliveryForm now validates and scrolls to the offending field itself, so
    // by the time this fires the address is already clean. Kept as a backstop
    // in case onNext is ever wired from elsewhere.
    const fieldErrors = validateAddressFields(addr);
    if (Object.keys(fieldErrors).length) {
      focusFirstError(fieldErrors);
      return setError(validateAddress(addr));
    }
    if (addr.saveAddr) {
      try {
        const { saveAddr: _, ...toSave } = addr;
        localStorage.setItem(ADDRESS_KEY, JSON.stringify(toSave));
        setSavedAddr(toSave);
      } catch (_) {}
    }
    setError('');
    setStep(1);
  };

  // ── Razorpay ────────────────────────────────────────────────────────────────
  const handleRazorpay = async () => {
    setLoading(true);
    setError('');
    try {
      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) throw new Error('Razorpay SDK failed to load');

      const authToken = getToken();
      const headers   = { 'Content-Type': 'application/json', ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) };

      // STEP 1 — push the local cart into the products server cart.
      // This reserves stock and locks the plan discount (doc §1.3).
      const { cart: serverCart, failed } = await syncCartToServer(cartItems);
      if (failed.length) {
        throw new Error(
          `Could not reserve: ${failed.map(f => `${f.name} (${f.reason})`).join('; ')}`
        );
      }
      if (!serverCart?.id || !serverCart.items?.length) {
        throw new Error('Cart could not be prepared. Please try again.');
      }

      // STEP 2 — the SERVER decides the price, not the browser.
      // Products API returns paise.
      //
      // Reconcile against what we just showed the user. Previously the page
      // displayed `cartTotal + shipping - clientDiscount` but charged
      // `serverTotal + shipping`; when the membership lookup failed those were
      // different numbers and nothing noticed — the user saw one price and
      // Razorpay took another. Now a real disagreement stops the flow.
      const { serverPayable, drift, mismatch } = reconcilePlanTotals({
        serverItems: serverCart.items,
        displayedPayable: dispPayable,
      });

      if (mismatch) {
        console.error('[checkout] price mismatch', {
          displayedPayable: dispPayable, serverPayable, drift, plan,
        });
        // The server is the source of truth. If it wants MORE than we showed
        // (the plan discount doesn't apply to this item), never charge it
        // silently — reprice the summary to the server figure and ask the
        // shopper to confirm. The next Pay tap sees displayed === server and
        // sails through. If the server is CHEAPER, just proceed at that price.
        if (serverPayable > Math.round(dispPayable)) {
          setRepriced({ serverPayable });
          setError(
            `Heads up — your plan discount doesn't apply to this item, so the total is ` +
            `₹${serverPayable.toLocaleString('en-IN')} (not ₹${Math.round(dispPayable).toLocaleString('en-IN')}). ` +
            `We've updated your order summary — tap Pay again to confirm.`
          );
          setLoading(false);
          return;
        }
      }

      // Shipping is recomputed from the SERVER payable for the same reason.
      const serverShipping = shippingCostFor(shipping, serverPayable);
      const payableINR     = serverPayable + serverShipping;
      // What the server actually discounted, for the audit record below.
      const serverDiscount = Math.round(subtotal - serverPayable);

      // Razorpay rejects anything above its per-transaction ceiling (₹5,00,000
      // by default). Catch it here so the shopper gets an actionable message
      // instead of the Pay button failing with an opaque gateway error.
      if (payableINR > MAX_ORDER_INR) {
        throw new Error(
          `Order total ₹${payableINR.toLocaleString('en-IN')} is above the ` +
          `₹${MAX_ORDER_INR.toLocaleString('en-IN')} per-transaction limit. ` +
          `Please split this into two orders, or contact us to place it manually.`
        );
      }

      // STEP 3 — Razorpay order. The backend now prices this itself from the
      // products-backend server cart; `expectedINR` is sent only so it can
      // refuse if what we displayed has drifted from what it computes. It
      // cannot raise or lower the charge.
      const orderRes  = await fetch(`${BASE}/api/orders/create-razorpay-order`, {
        method: 'POST', headers,
        body: JSON.stringify({
          shippingMethod: shipping.id,
          expectedINR:    payableINR,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || 'Failed to create order');

      const rzpOptions = {
        key:         orderData.data.key,
        amount:      orderData.data.amount,
        currency:    orderData.data.currency,
        name:        'Fameo',
        description: `${cartItems.length} item${cartItems.length > 1 ? 's' : ''}`,
        order_id:    orderData.data.orderId,
        prefill: {
          name:    `${addr.firstName} ${addr.lastName}`,
          email:   addr.email,
          contact: addr.phone,
        },
        notes: {
          address:    `${addr.address}, ${addr.city}, ${addr.state} - ${addr.pin}`,
          membership: membership.type,
        },
        theme: { color: '#E8405A' },

        handler: async (response) => {
          try {
            // STEP 4 — record the payment on the main backend (PostgreSQL)
            const verifyRes = await fetch(`${BASE}/api/orders/verify-payment`, {
              method: 'POST', headers,
              // Money no longer travels in this request. The backend reads the
              // quote it wrote at create time and confirms the captured amount
              // against Razorpay directly. cartItems / totalINR / shipping.cost
              // used to be written to the orders row verbatim, which made a
              // valid signature enough to mint an order at any price.
              body: JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                addr,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.message || 'Verification failed');

            // STEP 5 — create the products orders (MongoDB).
            // This is what makes the order appear in the retailer/admin dashboard,
            // deducts stock, and generates the creator invoice.
            let productsOrderIds = [];
            let fulfilmentWarning = '';
            try {
              // Delivery address captured on this checkout — sent so it lands on
              // the order and the box (customer) invoice's Ship-To.
              const shippingAddress = {
                name:    `${addr.firstName || ''} ${addr.lastName || ''}`.trim(),
                phone:   addr.phone,
                email:   addr.email,
                line1:   addr.address,
                city:    addr.city,
                state:   addr.state,
                pincode: addr.pin,
                country: 'India',
              };
              const res = await productsCheckout(serverCart.id, response.razorpay_payment_id, shippingAddress);
              productsOrderIds = (res.orders || []).map(o => o.id);
            } catch (e) {
              // Payment already succeeded — never fail the user here.
              // Surface it so support can reconcile against the payment ref.
              console.error('[products checkout] failed', e);
              fulfilmentWarning =
                `Payment received (${response.razorpay_payment_id}) but the order needs ` +
                `manual confirmation. Please contact support with this payment ID.`;
            }

            clearCart();
            setConfOrder({
              id:             verifyData.data.orderId,
              paymentId:      response.razorpay_payment_id,
              totalINR:       payableINR,
              memberDiscount: serverDiscount,
              shippingCost:   serverShipping,
              membershipType: membership.type,
              discountRate,
              productsOrderIds,
              fulfilmentWarning,
            });
            if (fulfilmentWarning) setError(fulfilmentWarning);
            setStep(3);
          } catch (err) {
            setError(`Payment verification failed: ${err.message}`);
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: async () => {
            // Release reserved stock so an abandoned checkout doesn't hold units.
            await clearServerCart().catch(() => {});
            setLoading(false);
            setError('Payment cancelled.');
          },
        },
      };

      const rzp = new window.Razorpay(rzpOptions);
      rzp.on('payment.failed', async (r) => {
        await clearServerCart().catch(() => {});
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

  if (step === 3 && confOrder) {
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
              <DeliveryForm
                addr={addr} onAddr={handleAddrChange}
                shipping={shipping} onShipping={setShipping}
                savedAddr={savedAddr} cartTotal={dispPayable}
                onNext={handleDeliveryNext} onBack={() => router.push('/cart')}
              />
            )}
            {step === 1 && (
              <PaymentStep
                payMethod={payMethod} onPayMethod={setPayMethod}
                grandTotalINR={grandTotalINR}
                cartTotal={cartTotal}
                shippingCost={shippingCost}
                memberDiscount={dispDiscount}
                membership={membership}
                onNext={() => setStep(2)} onBack={() => setStep(0)}
              />
            )}
            {step === 2 && (
              <OrderReview
                addr={addr} shipping={shipping} shippingCost={shippingCost}
                payMethod={payMethod}
                grandTotalINR={grandTotalINR}
                cartTotal={cartTotal}
                memberDiscount={dispDiscount}
                membership={membership}
                loading={loading}
                onPlace={handlePlace} onBack={() => setStep(1)}
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