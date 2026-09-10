'use client';
// modules/Checkout/PaymentStep/index.jsx
// COD removed — products are prepaid only. Razorpay is the only method.
import { inr } from '@/lib/formatCurrency';
import { S } from './styles';

export default function PaymentStep({
  grandTotalINR, cartTotal, shippingCost, memberDiscount = 0, membership = {},
  onNext, onBack,
}) {
  const membershipType = membership?.type || 'free';
  const discountLabel = membershipType === 'popular' ? '◈ Popular (2% off)'
                      : membershipType === 'elite'   ? '★ Elite (5% off)'
                      : '';

  return (
    <>
      <style>{S}</style>

      <h2 className="ps-sec-title">Payment</h2>
      <p className="ps-note">All payments are secured and encrypted.</p>

      {/* Razorpay — the only method */}
      <div className="ps-rzp-panel">
        <div className="ps-rzp-head">
          <span className="ps-rzp-icon">🔐</span>
          <div>
            <div className="ps-rzp-label">Pay Online</div>
            <div className="ps-rzp-sub">UPI · Cards · Net Banking · Wallets</div>
          </div>
        </div>
        <p className="ps-rzp-desc">
          Powered by Razorpay — India&apos;s most trusted payment gateway.
          Supports UPI (GPay, PhonePe, Paytm), Credit/Debit cards, Net Banking, Wallets and EMI.
        </p>
        <div className="ps-rzp-tags">
          {['UPI','Visa','Mastercard','RuPay','Net Banking','Paytm','EMI'].map(t => (
            <span key={t} className="ps-rzp-tag">{t}</span>
          ))}
        </div>
      </div>

      {/* Amount summary */}
      <div className="ps-amount-box">
        {cartTotal > 0 && (
          <div className="ps-amount-row"><span>Subtotal</span><span>{inr(cartTotal)}</span></div>
        )}
        {shippingCost >= 0 && (
          <div className="ps-amount-row">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'Free' : inr(shippingCost)}</span>
          </div>
        )}
        {memberDiscount > 0 && (
          <div className="ps-amount-row discount">
            <span>{discountLabel}</span>
            <span>−{inr(memberDiscount)}</span>
          </div>
        )}
        <div className="ps-amount-total">
          <span>Amount Payable</span>
          <span>{inr(grandTotalINR)}</span>
        </div>
        {memberDiscount > 0 && (
          <p className="ps-savings">✓ Saving {inr(memberDiscount)} with your {membershipType} plan</p>
        )}
      </div>

      <div className="ps-nav">
        <button className="ps-btn-secondary" onClick={onBack}>← Back</button>
        <button className="ps-btn-primary"   onClick={onNext}>Review Order →</button>
      </div>

      <div className="ps-secure">🔒 256-bit SSL · Secured by Razorpay</div>
    </>
  );
}
