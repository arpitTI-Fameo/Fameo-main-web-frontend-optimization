'use client';
// components/checkout/PaymentStep.js
// COD removed — products are prepaid only. Razorpay is the only method.
import { inr } from '@/lib/formatCurrency';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
  .ps-sec-title { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:400; color:#181820; margin-bottom:18px; padding-bottom:12px; border-bottom:1px solid rgba(0,0,0,0.08); }
  .ps-note { font-family:'Jost',sans-serif; font-size:12px; font-weight:300; color:#9898a8; line-height:1.7; margin-bottom:20px; }
  .ps-rzp-panel { padding:18px; border:1.5px solid #E8405A; border-radius:3px; background:#fde8f0; margin-bottom:16px; }
  .ps-rzp-head { display:flex; align-items:center; gap:10px; margin-bottom:12px; }
  .ps-rzp-icon { font-size:20px; }
  .ps-rzp-label { font-family:'Jost',sans-serif; font-size:12px; font-weight:400; color:#181820; }
  .ps-rzp-sub { font-family:'Jost',sans-serif; font-size:10px; color:#9898a8; margin-top:2px; }
  .ps-rzp-desc { font-family:'Jost',sans-serif; font-size:12px; font-weight:300; color:#9898a8; line-height:1.75; margin-bottom:14px; }
  .ps-rzp-tags { display:flex; gap:6px; flex-wrap:wrap; }
  .ps-rzp-tag { font-family:'Jost',sans-serif; font-size:9px; font-weight:400; letter-spacing:.1em; text-transform:uppercase; padding:4px 10px; border:1px solid rgba(0,0,0,0.08); background:#fff; color:#9898a8; border-radius:3px; }

  /* Amount summary box */
  .ps-amount-box { padding:14px 16px; border:1px solid rgba(0,0,0,.08); border-radius:3px; background:#fff; margin-bottom:16px; }
  .ps-amount-row { display:flex; justify-content:space-between; padding:5px 0; font-family:'Jost',sans-serif; font-size:12px; font-weight:300; color:#9898a8; border-bottom:1px solid rgba(0,0,0,.05); }
  .ps-amount-row span:last-child { color:#181820; }
  .ps-amount-row.discount span:last-child { color:#e8457a; }
  .ps-amount-total { display:flex; justify-content:space-between; align-items:baseline; padding:8px 0 0; font-family:'Jost',sans-serif; font-size:12px; font-weight:500; color:#181820; }
  .ps-amount-total span:last-child { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:400; }
  .ps-savings { font-family:'Jost',sans-serif; font-size:10px; font-weight:300; color:#2eaa68; text-align:right; margin-top:4px; }

  .ps-nav { display:flex; gap:12px; margin-top:24px; }
  .ps-btn-primary { font-family:'Jost',sans-serif; font-size:10px; font-weight:400; letter-spacing:.22em; text-transform:uppercase; padding:13px 28px; background:#181820; color:#fff; border:1.5px solid #181820; cursor:pointer; transition:all .25s; display:inline-flex; align-items:center; gap:8px; border-radius:3px; }
  .ps-btn-primary:hover { background:#E8405A; border-color:#E8405A; }
  .ps-btn-secondary { font-family:'Jost',sans-serif; font-size:10px; font-weight:300; letter-spacing:.2em; text-transform:uppercase; padding:13px 22px; background:transparent; color:#9898a8; border:1.5px solid rgba(0,0,0,0.08); cursor:pointer; transition:all .25s; border-radius:3px; }
  .ps-btn-secondary:hover { border-color:#181820; color:#181820; }
  .ps-secure { display:flex; align-items:center; justify-content:center; gap:6px; margin-top:12px; font-family:'Jost',sans-serif; font-size:10px; color:#9898a8; }
`;

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