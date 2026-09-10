'use client';
// components/checkout/CheckoutSummary.js
import { inr } from '@/lib/formatCurrency';
import { normalizePlan, planLabel, PLAN_DISCOUNTS } from '@/lib/planPricing';

const S = `
  .csum-wrap { border:1px solid rgba(0,0,0,0.08); background:#fafafa; padding:22px 20px; position:sticky; top:80px; border-radius:3px; }
  .csum-title { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:400; color:#181820; margin-bottom:16px; padding-bottom:12px; border-bottom:1px solid rgba(0,0,0,0.08); }
  .csum-item { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid rgba(0,0,0,0.08); }
  .csum-img { width:40px; height:40px; background:#f4f4f6; border:1px solid rgba(0,0,0,0.08); flex-shrink:0; overflow:hidden; border-radius:2px; display:flex; align-items:center; justify-content:center; }
  .csum-img img { width:100%; height:100%; object-fit:cover; display:block; }
  .csum-info { flex:1; min-width:0; }
  .csum-name { font-family:'Jost',sans-serif; font-size:11px; font-weight:400; color:#181820; text-transform:uppercase; letter-spacing:.06em; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .csum-qty { font-size:10px; color:#9898a8; margin-top:2px; }
  .csum-price { font-family:'Cormorant Garamond',serif; font-size:15px; font-weight:400; white-space:nowrap; }
  .csum-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(0,0,0,0.08); font-family:'Jost',sans-serif; font-size:12px; font-weight:300; color:#9898a8; }
  .csum-row span:last-child { color:#181820; }
  .csum-discount-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(0,0,0,0.08); font-family:'Jost',sans-serif; font-size:12px; font-weight:300; }
  .csum-discount-label { display:flex; align-items:center; gap:5px; color:#9898a8; }
  .csum-discount-val { font-family:'Cormorant Garamond',serif; font-size:16px; color:#e8457a; }
  .csum-total { display:flex; justify-content:space-between; align-items:baseline; padding:12px 0 0; font-family:'Jost',sans-serif; font-size:13px; font-weight:400; color:#181820; }
  .csum-total span:last-child { font-family:'Cormorant Garamond',serif; font-size:22px; }
  .csum-total-orig { display:flex; justify-content:flex-end; font-family:'Jost',sans-serif; font-size:10px; font-weight:300; color:#9898a8; text-decoration:line-through; margin-top:2px; }
  .csum-free { font-family:'Jost',sans-serif; font-size:9px; font-weight:300; letter-spacing:.12em; text-transform:uppercase; color:#2eaa68; margin-top:6px; }
  .csum-savings { margin-top:10px; padding:8px 12px; background:rgba(46,170,104,.06); border:1px solid rgba(46,170,104,.15); border-radius:3px; font-family:'Jost',sans-serif; font-size:10px; font-weight:300; color:#2eaa68; text-align:center; letter-spacing:.08em; }
`;

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