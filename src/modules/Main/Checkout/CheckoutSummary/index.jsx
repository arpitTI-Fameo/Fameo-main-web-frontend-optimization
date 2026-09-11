'use client';
// modules/Checkout/CheckoutSummary/index.jsx
import { inr } from '@/utils/formatCurrency';
import { normalizePlan, planLabel, PLAN_DISCOUNTS } from '@/utils/planPricing';
import { S } from './styles';

export default function CheckoutSummary({ cartItems, cartTotal, shippingCost, memberDiscount = 0, membershipType = 'free' }) {
  // Labels now come from the shared plan table rather than an inline ternary
  // that only knew two tiers — legacy 'pro'/'premium' fell through to '' and
  // rendered the discount as a bare figure with no explanation of where it
  // came from.
  const plan    = normalizePlan(membershipType);
  const meta    = planLabel(plan);
  const percent = Math.round((PLAN_DISCOUNTS[plan] || 0) * 100);

  // Never render an unlabelled discount row. If the plan can't be resolved but
  // a discount exists, say something truthful rather than nothing.
  const discountLabel = percent > 0
    ? `${meta.icon} ${meta.label} plan discount (${percent}% off)`
    : 'Member discount';

  const grandTotal    = cartTotal + shippingCost - memberDiscount;

  return (
    <>
      <style>{S}</style>
      <div className="csum-wrap">
        <h3 className="csum-title">Order Summary</h3>

        {cartItems.map(({ product, qty }) => (
          <div className="csum-item" key={product.id}>
            <div className="csum-img">
              {product.thumb
                ? <img src={product.thumb} alt={product.name} loading="lazy" />
                : <span style={{ fontSize: 18 }}>{product.emoji || '📦'}</span>}
            </div>
            <div className="csum-info">
              <p className="csum-name">{product.name}</p>
              <p className="csum-qty">Qty {qty}</p>
            </div>
            <span className="csum-price">{inr(product.price * qty)}</span>
          </div>
        ))}

        <div className="csum-row"><span>Subtotal</span><span>{inr(cartTotal)}</span></div>
        <div className="csum-row">
          <span>Shipping</span>
          <span>{shippingCost === 0 ? 'Free' : inr(shippingCost)}</span>
        </div>

        {memberDiscount > 0 && (
          <div className="csum-discount-row">
            <span className="csum-discount-label">{discountLabel}</span>
            <span className="csum-discount-val">−{inr(memberDiscount)}</span>
          </div>
        )}

        {shippingCost === 0 && <p className="csum-free">✓ Free shipping applied</p>}

        <div className="csum-total">
          <span>Total</span>
          <span>{inr(grandTotal)}</span>
        </div>

        {memberDiscount > 0 && (
          <>
            <div className="csum-total-orig">Original: {inr(cartTotal + shippingCost)}</div>
            <div className="csum-savings">
              You save {inr(memberDiscount)} with your {meta.label} plan
            </div>
          </>
        )}
      </div>
    </>
  );
}
