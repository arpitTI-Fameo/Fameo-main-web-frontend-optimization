'use client';
// modules/Checkout/OrderConfirmation/index.jsx
import Link    from 'next/link';
import { inr } from '@/utils/formatCurrency';
import { S } from './styles';

export default function OrderConfirmation({ order, addr }) {
  const hasSavings = order?.memberDiscount > 0;

  return (
    <>
      <style>{S}</style>
      <div className="oc-wrap">
        <div className="oc-icon">🎉</div>
        <h2 className="oc-title">Order <em>Confirmed!</em></h2>
        <p className="oc-sub">
          Thank you, {addr?.firstName || 'Creator'}!<br />
          Your order is being prepared and will be dispatched shortly.<br />
          Confirmation sent to {addr?.email || 'your email'}.
        </p>
        <p className="oc-id">Order ID: {order?.id}</p>

        {/* Price breakdown */}
        <div className="oc-breakdown">
          {order?.cartTotal > 0 && (
            <div className="oc-brow"><span>Subtotal</span><span>{inr(order.cartTotal)}</span></div>
          )}
          {order?.shippingCost >= 0 && (
            <div className="oc-brow">
              <span>Shipping</span>
              <span>{order.shippingCost === 0 ? 'Free' : inr(order.shippingCost)}</span>
            </div>
          )}
          {hasSavings && (
            <div className="oc-brow discount">
              <span>Member discount</span>
              <span>−{inr(order.memberDiscount)}</span>
            </div>
          )}
          <div className="oc-brow total">
            <span>Total Paid</span>
            <span>{inr(order?.totalINR || 0)}</span>
          </div>
        </div>

        {hasSavings && (
          <div className="oc-savings-badge">
            ✓ You saved {inr(order.memberDiscount)} with your {order.membershipType} plan
          </div>
        )}

        <div className="oc-ctas">
          <Link href="/account/orders" className="oc-btn-primary">Track Order →</Link>
          <Link href="/products"       className="oc-btn-secondary">Continue Shopping</Link>
        </div>

        <div className="oc-delivery">📦 Expected delivery in 5–7 business days</div>
      </div>
    </>
  );
}
