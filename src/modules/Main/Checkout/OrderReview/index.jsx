'use client';
// COD removed — products are prepaid only.
import { inr } from '@/lib/formatCurrency';
import { S } from './styles';

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
