
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCartStore, useHydratedCart } from '@/store/cartStore';
import { inr } from '@/lib/formatCurrency';
import CartItem from './CartItem';
import { useMembership } from '@/hooks/useMembership';
import { planTotals, memberUnitPrice, PLAN_DISCOUNTS } from '@/lib/planPricing';
import { SHIPPING_RATES, shippingCostFor, DEFAULT_SHIPPING } from '@/lib/shipping';
import { styles } from './styles';

// The plan table and the membership fetch used to be duplicated here and in
// CheckoutClient, and the two disagreed about the value's SHAPE — this page read
// a local table (correct) while checkout read `membership.discountRate` from the
// API (undefined when the API sends `discountPercent`). A Popular member saw 2%
// off here and full price at checkout. Both now go through useMembership().

export default function Cart() {
  const updateQty = useCartStore((s) => s.updateQty);
  const removeFromCart = useCartStore((s) => s.removeFromCart);

  // Persisted cart state doesn't exist during SSR. CheckoutClient already gated
  // on a `mounted` flag; this page didn't, which produced a hydration mismatch
  // on every visit — and under React 19 a mismatch can throw away the client
  // tree rather than just warning.
  const { items: cartItems, total: cartTotal, ready } = useHydratedCart();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [discountKey, setDiscountKey] = useState(0);

  const { plan: userPlan, rate: discountRate, percent, meta: plan } = useMembership();

  useEffect(() => { setDiscountKey(k => k + 1); }, [cartTotal]);

  // Per-line discount, summed — matches how the products backend rounds each
  // item's final_price before multiplying by quantity.
  const { discount: planDiscount, payable } = planTotals(cartItems, discountRate);
  const elitePayable = planTotals(cartItems, PLAN_DISCOUNTS.elite).payable;
  const premiumExtra = Math.round(payable - elitePayable);

  // Shipping came from a local `cartTotal > 200 ? 0 : 18` rule here, a separate
  // USD threshold in CartDrawer, and a third table in DeliveryForm. All three
  // now read lib/shipping.js, and all three judge the threshold on the
  // post-discount payable so they can't disagree.
  const shipping = shippingCostFor(DEFAULT_SHIPPING, payable);
  const total = payable + shipping - discount;

  const applyPromo = () => {
    setDiscount(promoCode.toUpperCase() === 'CREATOR10' ? Math.round(cartTotal * 0.1) : 0);
  };

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
