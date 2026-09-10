
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCartStore, useHydratedCart } from '@/store/cartStore';
import { inr }           from '@/lib/formatCurrency';
import CartItem          from '@/components/cart/CartItem';
import { useMembership } from '@/hooks/useMembership';
import { planTotals, memberUnitPrice, PLAN_DISCOUNTS } from '@/lib/planPricing';
import { SHIPPING_RATES, shippingCostFor, DEFAULT_SHIPPING } from '@/lib/shipping';

// The plan table and the membership fetch used to be duplicated here and in
// CheckoutClient, and the two disagreed about the value's SHAPE — this page read
// a local table (correct) while checkout read `membership.discountRate` from the
// API (undefined when the API sends `discountPercent`). A Popular member saw 2%
// off here and full price at checkout. Both now go through useMembership().

export default function CartClient() {
  const updateQty        = useCartStore((s) => s.updateQty);
  const removeFromCart   = useCartStore((s) => s.removeFromCart);

  // Persisted cart state doesn't exist during SSR. CheckoutClient already gated
  // on a `mounted` flag; this page didn't, which produced a hydration mismatch
  // on every visit — and under React 19 a mismatch can throw away the client
  // tree rather than just warning.
  const { items: cartItems, total: cartTotal, ready } = useHydratedCart();

  const [promoCode,   setPromoCode]   = useState('');
  const [discount,    setDiscount]    = useState(0);
  const [discountKey, setDiscountKey] = useState(0);

  const { plan: userPlan, rate: discountRate, percent, meta: plan } = useMembership();

  useEffect(() => { setDiscountKey(k => k + 1); }, [cartTotal]);

  // Per-line discount, summed — matches how the products backend rounds each
  // item's final_price before multiplying by quantity.
  const { discount: planDiscount, payable } = planTotals(cartItems, discountRate);
  const elitePayable    = planTotals(cartItems, PLAN_DISCOUNTS.elite).payable;
  const premiumExtra    = Math.round(payable - elitePayable);

  // Shipping came from a local `cartTotal > 200 ? 0 : 18` rule here, a separate
  // USD threshold in CartDrawer, and a third table in DeliveryForm. All three
  // now read lib/shipping.js, and all three judge the threshold on the
  // post-discount payable so they can't disagree.
  const shipping = shippingCostFor(DEFAULT_SHIPPING, payable);
  const total    = payable + shipping - discount;

  const applyPromo = () => {
    setDiscount(promoCode.toUpperCase() === 'CREATOR10' ? Math.round(cartTotal * 0.1) : 0);
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
    :root {
      --white:#fff; --snow:#fafafa; --soft:#f4f4f6;
      --border:rgba(0,0,0,0.08); --ink:#181820;
      --ink-soft:#444450; --ink-muted:#9898a8;
      --pink:#e8457a; --pink-pale:#fde8f0; --pink-deep:#c02060;
      --green:#2eaa68; --red:#e05050;
    }
    .cart-page { max-width:1200px; margin:0 auto; padding:100px 56px 80px; font-family:'Jost',sans-serif; background:#fff; min-height:100vh; }
    .cart-head { padding-bottom:22px; border-bottom:1px solid var(--border); margin-bottom:36px; }
    .cart-title { font-family:'Cormorant Garamond',serif; font-size:clamp(32px,5vw,58px); font-weight:300; color:var(--ink); }
    .cart-title em { font-style:italic; color:var(--pink); }
    .cart-sub { font-size:10px; font-weight:300; letter-spacing:.22em; text-transform:uppercase; color:var(--ink-muted); margin-top:5px; }
    .cart-body { display:grid; grid-template-columns:1fr 360px; gap:48px; align-items:start; }
    .plan-strip { display:flex; align-items:center; gap:10px; padding:11px 16px; border:1px solid var(--border); background:var(--snow); margin-bottom:28px; border-radius:2px; }
    .plan-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
    .plan-strip-text { font-size:10px; font-weight:300; letter-spacing:.16em; text-transform:uppercase; color:var(--ink-muted); }
    .plan-strip-badge { font-size:9px; font-weight:400; letter-spacing:.22em; text-transform:uppercase; padding:3px 10px; border:1px solid; }
    .cart-items { display:flex; flex-direction:column; }
    .cart-empty { text-align:center; padding:80px 0; }
    .cart-empty-icon { font-size:52px; margin-bottom:18px; }
    .cart-empty-title { font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:300; color:var(--ink); margin-bottom:8px; }
    .cart-empty-sub { font-size:13px; color:var(--ink-muted); margin-bottom:28px; font-weight:300; }
    .cart-summary { background:#fff; border:1px solid var(--border); padding:28px 24px; position:sticky; top:80px; border-radius:2px; }
    .cart-summary-title { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:400; color:var(--ink); margin-bottom:20px; padding-bottom:14px; border-bottom:1px solid var(--border); }
    .sum-row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border); font-size:12px; font-weight:300; color:var(--ink-muted); }
    .sum-row span:last-child { color:var(--ink); font-size:13px; }
    .sum-discount-row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border); font-size:12px; font-weight:300; }
    .sum-discount-label { display:flex; align-items:center; gap:6px; color:var(--ink-muted); }
    .sum-discount-val { font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:400; color:var(--pink); }
    .sum-total { display:flex; justify-content:space-between; align-items:baseline; padding:14px 0 0; font-size:13px; font-weight:400; color:var(--ink); }
    .sum-total span:last-child { font-family:'Cormorant Garamond',serif; font-size:26px; }
    .sum-free { font-size:10px; font-weight:300; letter-spacing:.12em; text-transform:uppercase; color:var(--green); margin:8px 0 0; }
    .upgrade-box { margin-top:14px; padding:14px; background:var(--pink-pale); border:1px solid rgba(232,69,122,.2); border-radius:3px; }
    .upgrade-text { font-size:12px; font-weight:300; color:var(--ink-soft); line-height:1.65; margin-bottom:10px; }
    .upgrade-amt { font-family:'Cormorant Garamond',serif; font-size:20px; color:var(--pink-deep); font-weight:500; }
    .upgrade-btn { display:flex; align-items:center; justify-content:center; gap:6px; width:100%; padding:10px; background:linear-gradient(135deg,var(--pink-deep),var(--pink)); color:#fff; font-family:'Jost',sans-serif; font-size:9px; font-weight:400; letter-spacing:.22em; text-transform:uppercase; border:none; cursor:pointer; border-radius:2px; text-decoration:none; transition:opacity .2s; }
    .upgrade-btn:hover { opacity:.9; }
    .promo-row { display:flex; margin:18px 0; }
    .promo-inp { flex:1; padding:11px 14px; border:1px solid var(--border); border-right:none; background:var(--snow); font-family:'Jost',sans-serif; font-size:11px; color:var(--ink); outline:none; transition:border-color .2s; }
    .promo-inp:focus { border-color:var(--pink); }
    .promo-inp::placeholder { color:var(--ink-muted); }
    .promo-btn { padding:11px 16px; border:1px solid var(--border); background:var(--ink); color:#fff; font-family:'Jost',sans-serif; font-size:10px; letter-spacing:.16em; text-transform:uppercase; cursor:pointer; transition:background .2s; white-space:nowrap; }
    .promo-btn:hover { background:var(--pink); border-color:var(--pink); }
    .btn-ink { width:100%; padding:15px; margin-bottom:10px; background:var(--ink); color:#fff; font-family:'Jost',sans-serif; font-size:10px; font-weight:300; letter-spacing:.22em; text-transform:uppercase; border:1px solid var(--ink); cursor:pointer; transition:all .25s; display:flex; align-items:center; justify-content:center; text-decoration:none; }
    .btn-ink:hover { background:var(--pink); border-color:var(--pink); }
    .btn-line { width:100%; padding:15px; background:transparent; color:var(--ink); font-family:'Jost',sans-serif; font-size:10px; font-weight:300; letter-spacing:.2em; text-transform:uppercase; border:1px solid var(--border); cursor:pointer; transition:all .25s; display:flex; align-items:center; justify-content:center; text-decoration:none; }
    .btn-line:hover { border-color:var(--ink); }
    .cart-trust { margin-top:16px; display:flex; flex-direction:column; gap:8px; }
    .cart-trust-item { font-size:10px; font-weight:300; color:var(--ink-muted); display:flex; align-items:center; gap:8px; }
    @media(max-width:900px) { .cart-page { padding:90px 20px 60px; } .cart-body { grid-template-columns:1fr; } .cart-summary { position:static; } }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="cart-page">
        <div className="cart-head">
          <h1 className="cart-title">Your <em>Bag</em></h1>
          <p className="cart-sub">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
        </div>

        {/* Membership strip — only show if not free */}
        {cartItems.length > 0 && userPlan !== 'free' && (
          <div className="plan-strip">
            <span className="plan-dot" style={{ background: plan.color }} />
            <span className="plan-strip-text">Active plan</span>
            <span className="plan-strip-badge" style={{ color: plan.color, borderColor: plan.color }}>
              {plan.icon} {plan.label}
            </span>
            <span className="plan-strip-text" style={{ marginLeft: 'auto' }}>
              {percent}% member price applied to every item
            </span>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛍️</div>
            <h2 className="cart-empty-title">Your bag is empty</h2>
            <p className="cart-empty-sub">Discover gear built for creators like you.</p>
            <Link href="/products" className="btn-ink" style={{ width: 'auto', display: 'inline-flex' }}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-body">
            <div className="cart-items">
              {cartItems.map(({ product, qty }) => (
                <CartItem
                  key={product.id}
                  product={product}
                  qty={qty}
                  onUpdate={updateQty}
                  onRemove={removeFromCart}
                  compact={false}
                />
              ))}
            </div>

            <div className="cart-summary">
              <h3 className="cart-summary-title">Order Summary</h3>

              <div className="sum-row"><span>Subtotal</span><span>{inr(cartTotal)}</span></div>
              <div className="sum-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : inr(shipping)}</span>
              </div>

              {/* Member discount row */}
              {planDiscount > 0 && (
                <div className="sum-discount-row" key={discountKey}>
                  <span className="sum-discount-label">
                    <span style={{ color: plan.color }}>{plan.icon}</span>
                    {plan.label} ({percent}% off)
                  </span>
                  <span className="sum-discount-val">−{inr(planDiscount)}</span>
                </div>
              )}

              {discount > 0 && (
                <div className="sum-row">
                  <span>Promo (CREATOR10)</span>
                  <span style={{ color: 'var(--green)' }}>−{inr(discount)}</span>
                </div>
              )}

              <div className="sum-total"><span>Total</span><span>{inr(total)}</span></div>
              {shipping === 0 && <p className="sum-free">✓ Free shipping unlocked</p>}

              {/* Upgrade prompt — show if not premium */}
              {(userPlan === 'free' || userPlan === 'popular') && premiumExtra > 0 && (
                <div className="upgrade-box">
                  <p className="upgrade-text">
                    Upgrade to <strong>Elite</strong> and save an extra{' '}
                    <span className="upgrade-amt">{inr(premiumExtra)}</span> on this order.
                    5% off everything, always.
                  </p>
                  <Link href="/plans" className="upgrade-btn">
                    ★ Upgrade to Elite →
                  </Link>
                </div>
              )}

              {/* Promo code */}
              <div className="promo-row">
                <input
                  className="promo-inp"
                  placeholder="Promo code (CREATOR10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                />
                <button className="promo-btn" onClick={applyPromo}>Apply</button>
              </div>

              <Link href="/checkout" className="btn-ink">Proceed to Checkout</Link>
              <Link href="/products" className="btn-line">Continue Shopping</Link>

              <div className="cart-trust">
                <span className="cart-trust-item">🔒 Secure 256-bit SSL checkout</span>
                <span className="cart-trust-item">↩ Free 30-day returns</span>
                <span className="cart-trust-item">✓ Creator-verified products</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}