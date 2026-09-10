'use client';
// components/cart/CartDrawer.js
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
import CartItem          from '@/components/cart/CartItem';

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  /* ── backdrop ── */
  .cd-backdrop {
    position: fixed; inset: 0; z-index: 1100;
    background: rgba(17,17,24,.45);
    backdrop-filter: blur(4px);
    opacity: 0; pointer-events: none;
    transition: opacity .35s cubic-bezier(.22,1,.36,1);
  }
  .cd-backdrop.open { opacity: 1; pointer-events: all; }

  /* ── drawer panel ── */
  .cd-panel {
    position: fixed; top: 0; right: 0; bottom: 0; z-index: 1101;
    width: min(420px, 92vw);
    background: #fff;
    border-left: 1px solid #EEEEF2;
    display: flex; flex-direction: column;
    transform: translateX(100%);
    transition: transform .4s cubic-bezier(.22,1,.36,1);
    box-shadow: -20px 0 60px rgba(17,17,24,.12);
  }
  .cd-panel.open { transform: translateX(0); }

  /* ── header ── */
  .cd-head {
    padding: 0 22px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid #EEEEF2; flex-shrink: 0;
  }
  .cd-head-left { display: flex; align-items: baseline; gap: 10px; }
  .cd-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 300; color: #111118;
  }
  .cd-title em { font-style: italic; color: #E8405A; }
  .cd-count {
    font-size: 10px; font-weight: 300; letter-spacing: .16em;
    text-transform: uppercase; color: #888898;
  }
  .cd-close {
    width: 34px; height: 34px;
    display: flex; align-items: center; justify-content: center;
    border: 1.5px solid #EEEEF2; border-radius: 3px;
    background: none; cursor: pointer; font-size: 15px; color: #888898;
    transition: border-color .18s, color .18s;
  }
  .cd-close:hover { border-color: #E8405A; color: #E8405A; }

  /* ── items scroll area ── */
  .cd-items {
    flex: 1; overflow-y: auto; padding: 0 22px;
    scrollbar-width: thin; scrollbar-color: #EEEEF2 transparent;
  }
  .cd-items::-webkit-scrollbar { width: 4px; }
  .cd-items::-webkit-scrollbar-thumb { background: #EEEEF2; border-radius: 2px; }

  /* ── empty state ── */
  .cd-empty {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 12px; padding: 40px 22px; text-align: center;
  }
  .cd-empty-icon  { font-size: 44px; }
  .cd-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 300; color: #111118;
  }
  .cd-empty-sub { font-size: 12px; font-weight: 300; color: #888898; }

  /* ── footer ── */
  .cd-foot {
    padding: 18px 22px 24px;
    border-top: 1px solid #EEEEF2; flex-shrink: 0;
    background: #fff;
  }
  .cd-subtotal-row {
    display: flex; justify-content: space-between; align-items: baseline;
    margin-bottom: 16px;
  }
  .cd-subtotal-label {
    font-size: 10px; font-weight: 300; letter-spacing: .16em;
    text-transform: uppercase; color: #888898;
  }
  .cd-subtotal-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px; font-weight: 400; color: #111118;
  }
  .cd-free-ship {
    font-size: 9px; font-weight: 300; letter-spacing: .14em;
    text-transform: uppercase; color: #2eaa68; margin-bottom: 14px;
    display: flex; align-items: center; gap: 6px;
  }
  .cd-ship-bar {
    height: 2px; background: #EEEEF2; border-radius: 1px;
    margin-bottom: 16px; overflow: hidden;
  }
  .cd-ship-fill {
    height: 100%; background: #2eaa68; border-radius: 1px;
    transition: width .6s cubic-bezier(.22,1,.36,1);
  }
  .cd-ship-note {
    font-size: 9px; font-weight: 300; letter-spacing: .12em;
    color: #888898; margin-bottom: 14px; text-align: center;
  }
  .cd-btn-checkout {
    display: flex; align-items: center; justify-content: center;
    width: 100%; padding: 14px;
    background: #111118; color: #fff;
    font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 300;
    letter-spacing: .22em; text-transform: uppercase;
    border: 1.5px solid #111118; text-decoration: none;
    transition: background .22s, border-color .22s;
    margin-bottom: 8px;
  }
  .cd-btn-checkout:hover { background: #E8405A; border-color: #E8405A; }
  .cd-btn-view {
    display: flex; align-items: center; justify-content: center;
    width: 100%; padding: 12px;
    background: transparent; color: #888898;
    font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 300;
    letter-spacing: .2em; text-transform: uppercase;
    border: 1.5px solid #EEEEF2; text-decoration: none;
    transition: border-color .2s, color .2s;
  }
  .cd-btn-view:hover { border-color: #111118; color: #111118; }
`;

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