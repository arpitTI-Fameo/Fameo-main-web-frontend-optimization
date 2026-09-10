'use client';
// modules/Cart/CartDrawer/index.jsx
// Slide-in cart drawer — opens from the right when user adds to bag.
// Triggered via uiStore: openCartDrawer() / closeCartDrawer()
// Add <CartDrawer /> once in app/(main)/layout.js alongside MainNav.
//
// Usage:
//   import { useUIStore } from '@/store/uiStore';
//   const openCartDrawer = useUIStore((s) => s.openCartDrawer);
//   <button onClick={openCartDrawer}>Add to Bag</button>

import Link from 'next/link';
import { useCartStore, useHydratedCart } from '@/store/cartStore';
import { useUIStore }    from '@/store/uiStore';
import { inr }           from '@/lib/formatCurrency';
import { useMembership } from '@/hooks/useMembership';
import { planTotals }    from '@/lib/planPricing';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/shipping';
import CartItem          from '../CartItem';

import { S } from './styles';

// FREE_SHIPPING_THRESHOLD used to be `200; // USD` — a pseudo-USD leftover being
// compared against a rupee total, so any bag over ₹200 claimed free shipping
// while the checkout charged for it. Now imported from lib/shipping.js.

export default function CartDrawer() {
  const updateQty      = useCartStore((s) => s.updateQty);
  const removeFromCart = useCartStore((s) => s.removeFromCart);

  // Drawer renders persisted cart state, so gate it on hydration like the other
  // cart surfaces.
  const { items: cartItems, total: cartTotal } = useHydratedCart();

  const isOpen         = useUIStore((s) => s.cartDrawerOpen);
  const close          = useUIStore((s) => s.closeCartDrawer);

  const { rate, percent, meta, isMember } = useMembership();
  const { discount: planDiscount, payable } = planTotals(cartItems, rate);

  // Threshold is judged on the post-discount payable, matching CartClient and
  // CheckoutClient.
  const shippingProgress = Math.min((payable / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining        = Math.max(FREE_SHIPPING_THRESHOLD - payable, 0);
  const freeShipping     = payable >= FREE_SHIPPING_THRESHOLD;

  return (
    <>
      <style>{S}</style>

      {/* Backdrop */}
      <div
        className={`cd-backdrop${isOpen ? ' open' : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`cd-panel${isOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        {/* Header */}
        <div className="cd-head">
          <div className="cd-head-left">
            <h2 className="cd-title">Your <em>Bag</em></h2>
            <span className="cd-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
          </div>
          <button className="cd-close" onClick={close} aria-label="Close cart">✕</button>
        </div>

        {cartItems.length === 0 ? (
          /* Empty state */
          <div className="cd-empty">
            <div className="cd-empty-icon">🛍️</div>
            <h3 className="cd-empty-title">Your bag is empty</h3>
            <p className="cd-empty-sub">Add some gear to get started.</p>
          </div>
        ) : (
          /* Items */
          <div className="cd-items">
            {cartItems.map(({ product, qty }, i) => (
              <CartItem
                key={product.id}
                product={product}
                qty={qty}
                onUpdate={updateQty}
                onRemove={removeFromCart}
                compact
              />
            ))}
          </div>
        )}

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cd-foot">
            {/* Free shipping progress */}
            {freeShipping ? (
              <p className="cd-free-ship">✓ Free shipping unlocked</p>
            ) : (
              <>
                <div className="cd-ship-bar">
                  <div className="cd-ship-fill" style={{ width: `${shippingProgress}%` }} />
                </div>
                <p className="cd-ship-note">
                  Add {inr(remaining)} more for free shipping
                </p>
              </>
            )}

            {/* Subtotal */}
            <div className="cd-subtotal-row">
              <span className="cd-subtotal-label">Subtotal</span>
              <span className="cd-subtotal-val">{inr(cartTotal)}</span>
            </div>

            {/* Member discount — the drawer previously showed the full listed
                total with no hint that the creator's plan changes the price. */}
            {isMember && planDiscount > 0 && (
              <>
                <div className="cd-subtotal-row" style={{ paddingTop: 0 }}>
                  <span className="cd-subtotal-label" style={{ color: meta.color }}>
                    {meta.icon} {meta.label} −{percent}%
                  </span>
                  <span className="cd-subtotal-val" style={{ color: meta.color }}>
                    −{inr(planDiscount)}
                  </span>
                </div>
                <div className="cd-subtotal-row" style={{ paddingTop: 0 }}>
                  <span className="cd-subtotal-label">You pay</span>
                  <span className="cd-subtotal-val">{inr(payable)}</span>
                </div>
              </>
            )}

            {/* CTAs */}
            <Link href="/checkout" className="cd-btn-checkout" onClick={close}>
              Proceed to Checkout
            </Link>
            <Link href="/cart" className="cd-btn-view" onClick={close}>
              View Full Bag
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
