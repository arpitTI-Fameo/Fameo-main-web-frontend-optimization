'use client';
// COD removed — products are prepaid only.
import { inr } from '@/lib/formatCurrency';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
  .or-sec-title { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:400; color:#181820; margin-bottom:18px; padding-bottom:12px; border-bottom:1px solid rgba(0,0,0,0.08); }
  .or-box { padding:16px 18px; border:1px solid rgba(0,0,0,0.08); border-radius:3px; margin-bottom:12px; background:#fafafa; }
  .or-box-label { font-family:'Jost',sans-serif; font-size:9px; font-weight:400; letter-spacing:.22em; text-transform:uppercase; color:#E8405A; margin-bottom:8px; }
  .or-box-val { font-family:'Jost',sans-serif; font-size:13px; font-weight:300; color:#181820; line-height:1.7; }
  .or-edit { font-family:'Jost',sans-serif; font-size:9px; font-weight:400; letter-spacing:.14em; text-transform:uppercase; color:#9898a8; background:none; border:none; cursor:pointer; padding:0; margin-top:8px; display:block; transition:color .18s; }
  .or-edit:hover { color:#E8405A; }
  .or-price-box { padding:16px 18px; border:1px solid rgba(0,0,0,0.08); border-radius:3px; margin-bottom:16px; background:#fff; }
  .or-price-row { display:flex; justify-content:space-between; padding:6px 0; font-family:'Jost',sans-serif; font-size:12px; font-weight:300; color:#9898a8; border-bottom:1px solid rgba(0,0,0,0.06); }
  .or-price-row span:last-child { color:#181820; }
  .or-price-row.discount span:last-child { color:#e8457a; font-family:'Cormorant Garamond',serif; font-size:16px; }
  .or-price-total { display:flex; justify-content:space-between; align-items:baseline; padding:10px 0 0; font-family:'Jost',sans-serif; font-size:13px; font-weight:500; color:#181820; }
  .or-price-total span:last-child { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:400; }
  .or-savings { margin-top:8px; font-family:'Jost',sans-serif; font-size:10px; font-weight:300; color:#2eaa68; text-align:right; }
  .or-rzp-btn { width:100%; padding:16px; background:linear-gradient(135deg,#c02060,#E8405A); color:#fff; font-family:'Jost',sans-serif; font-size:10px; font-weight:400; letter-spacing:.22em; text-transform:uppercase; border:none; cursor:pointer; border-radius:3px; display:flex; align-items:center; justify-content:center; gap:10px; transition:opacity .22s; position:relative; overflow:hidden; }
  .or-rzp-btn:hover { opacity:.9; }
  .or-rzp-btn:disabled { opacity:.5; cursor:not-allowed; }
  .or-rzp-btn::before { content:''; position:absolute; top:0; left:-60%; width:40%; height:100%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent); transform:skewX(-18deg); animation:orShimmer 2.4s ease infinite; }
  @keyframes orShimmer { 0%{left:-60%} 40%,100%{left:120%} }
  .or-nav { display:flex; gap:12px; margin-top:10px; }
  .or-btn-secondary { font-family:'Jost',sans-serif; font-size:10px; font-weight:300; letter-spacing:.2em; text-transform:uppercase; padding:13px 22px; background:transparent; color:#9898a8; border:1.5px solid rgba(0,0,0,0.08); cursor:pointer; transition:all .25s; border-radius:3px; }
  .or-btn-secondary:hover { border-color:#181820; color:#181820; }
  .or-secure { display:flex; align-items:center; justify-content:center; gap:6px; margin-top:14px; font-family:'Jost',sans-serif; font-size:10px; color:#9898a8; }
`;

export default function OrderReview({
  addr, shipping, shippingCost,
  grandTotalINR, cartTotal, memberDiscount = 0, membership = {},
  loading, onPlace, onBack,
}) {
  const membershipType = membership?.type || 'free';
  const discountLabel = membershipType === 'popular' ? '◈ Popular (2% off)'
                      : membershipType === 'elite'   ? '★ Elite (5% off)'
                      : '';
  const subtotal = cartTotal || 0;

  return (
    <>
      <style>{S}</style>
      <h2 className="or-sec-title">Review Your Order</h2>

      {/* Address */}
      <div className="or-box">
        <p className="or-box-label">Shipping To</p>
        <p className="or-box-val">
          {addr.firstName} {addr.lastName} · {addr.phone}<br />
          {addr.address}, {addr.city}<br />
          {addr.state} — {addr.pin}, India
        </p>
        <button className="or-edit" onClick={onBack}>Edit address</button>
      </div>

      {/* Shipping */}
      <div className="or-box">
        <p className="or-box-label">Delivery Method</p>
        <p className="or-box-val">
          {shipping.label} · {shipping.days}
          {shippingCost === 0 ? ' · Free' : ` · ${inr(shippingCost)}`}
        </p>
      </div>

      {/* Payment */}
      <div className="or-box">
        <p className="or-box-label">Payment</p>
        <p className="or-box-val">🔐 Online Payment via Razorpay</p>
      </div>

      {/* Price breakdown */}
      <div className="or-price-box">
        <p className="or-box-label" style={{ marginBottom:'10px' }}>Price Breakdown</p>
        <div className="or-price-row"><span>Subtotal</span><span>{inr(subtotal)}</span></div>
        <div className="or-price-row">
          <span>Shipping</span>
          <span>{shippingCost === 0 ? 'Free' : inr(shippingCost)}</span>
        </div>
        {memberDiscount > 0 && (
          <div className="or-price-row discount">
            <span>{discountLabel}</span>
            <span>−{inr(memberDiscount)}</span>
          </div>
        )}
        <div className="or-price-total">
          <span>Total</span>
          <span>{inr(grandTotalINR)}</span>
        </div>
        {memberDiscount > 0 && (
          <p className="or-savings">✓ You save {inr(memberDiscount)} with your {membershipType} plan</p>
        )}
      </div>

      {/* CTA */}
      <div style={{ marginTop: 4 }}>
        <button className="or-rzp-btn" onClick={onPlace} disabled={loading}>
          {loading ? 'Opening Payment...' : `🔐 Pay ${inr(grandTotalINR)} via Razorpay`}
        </button>
      </div>

      <div className="or-nav">
        <button className="or-btn-secondary" onClick={onBack}>← Back</button>
      </div>
      <div className="or-secure">🔒 Secure checkout · Free 30-day returns · Creator-verified products</div>
    </>
  );
}