'use client';
// modules/Main/Cart/CartDrawer/index.jsx
// Slide-in bag, opened from the nav or after an add-to-cart.
//
// Same palette and the same CartItem as /cart, in its compact variant — the
// drawer and the page are one surface in two sizes, so a change to the row
// lands in both.
//
// It deliberately stops at "View Cart": the shipping step now lives in /cart,
// and a drawer is the wrong place to pick an address. The old "Proceed to
// Checkout" link is gone for the same reason — it jumped past the step that
// collects the delivery details.

import { useMemo, useCallback } from 'react';
import Link from 'next/link';

import { ROUTES } from '@/constants/routes';
import { useMembership } from '@/lib/hooks/custome/useMembership';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/lib/hooks/main/useCart';
import { useAuthStore } from '@/store/authStore';
import { useCartStore, useHydratedCart } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { inr } from '@/utils/formatCurrency';
import { DELIVERY_METHODS, FREE_SHIPPING_THRESHOLD } from '@/utils/shipping';

import CartItem from '../CartItem';
import { CART_EMPTY } from '../constants';
import { cartTotals, itemCountLabel, serverCartItems, serverCartTotals } from '../helpers';
import { ArrowRightIcon, CloseIcon } from '../icons';

import { S } from './styles';

export default function CartDrawer() {
  const updateQtyLocal = useCartStore((s) => s.updateQty);
  const removeFromCartLocal = useCartStore((s) => s.removeFromCart);

  const user = useAuthStore((s) => s.user);
  const isAuth = Boolean(user);

  const { data: serverCartData } = useCart({ enabled: isAuth });
  const { mutate: serverUpdateQty } = useUpdateCartItem();
  const { mutate: serverRemoveFromCart } = useRemoveCartItem();

  const { items: localItems } = useHydratedCart();

  const items = useMemo(
    () => (isAuth ? serverCartItems(serverCartData) : localItems),
    [isAuth, localItems, serverCartData]
  );

  const updateQty = useCallback((productId, nextQty, cartItemId) => {
    if (isAuth) {
      serverUpdateQty({ itemId: cartItemId || productId, data: { quantity: nextQty } });
    } else {
      updateQtyLocal(productId, nextQty);
    }
  }, [isAuth, serverUpdateQty, updateQtyLocal]);

  const removeFromCart = useCallback((productId, cartItemId) => {
    if (isAuth) {
      serverRemoveFromCart(cartItemId || productId);
    } else {
      removeFromCartLocal(productId);
    }
  }, [isAuth, serverRemoveFromCart, removeFromCartLocal]);

  const isOpen = useUIStore((s) => s.cartDrawerOpen);
  const close = useUIStore((s) => s.closeCartDrawer);

  const { rate, percent, meta, isMember } = useMembership();

  // Door delivery at the default rate — the drawer only previews the bag, so it
  // shows the standard case rather than pretending to know the final method.
  const totals = isAuth
    ? serverCartTotals(items, DELIVERY_METHODS.DOOR)
    : cartTotals(items, rate, DELIVERY_METHODS.DOOR);

  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - totals.payable, 0);
  const freeShipping = totals.payable >= FREE_SHIPPING_THRESHOLD;
  const progress = Math.min((totals.payable / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <>
      <style>{S}</style>

      <div
        className={`cd-backdrop${isOpen ? ' is-open' : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      <aside
        className={`cd-panel${isOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <header className="cd-head">
          <div>
            <h2 className="cd-title">Your Cart</h2>
            <p className="cd-count">{itemCountLabel(totals.count)}</p>
          </div>
          <button type="button" className="cd-close" onClick={close} aria-label="Close cart">
            <CloseIcon />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="cd-empty">
            <h3 className="cd-empty-title">{CART_EMPTY.title}</h3>
            <p className="cd-empty-body">{CART_EMPTY.body}</p>
            <Link className="cd-empty-cta" href={ROUTES.PRODUCTS} onClick={close}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="cd-items">
              {items.map(({ product, qty, cartItemId }) => (
                <CartItem
                  key={cartItemId || product.id}
                  product={product}
                  qty={qty}
                  onUpdate={(pid, nextQty) => updateQty(pid, nextQty, cartItemId)}
                  onRemove={(pid) => removeFromCart(pid, cartItemId)}
                  compact
                />
              ))}
            </div>

            <footer className="cd-foot">
              {freeShipping ? (
                <p className="cd-ship is-free">Free delivery unlocked</p>
              ) : (
                <>
                  <div className="cd-ship-bar">
                    <span className="cd-ship-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="cd-ship">Add {inr(remaining)} more for free delivery</p>
                </>
              )}

              <div className="cd-row">
                <span className="cd-row-label">Subtotal</span>
                <span className="cd-row-value">{inr(totals.listed)}</span>
              </div>

              {isMember && totals.discount > 0 && (
                <>
                  <div className="cd-row">
                    <span className="cd-row-label" style={{ color: meta.color }}>
                      {meta.icon} {meta.label} −{percent}%
                    </span>
                    <span className="cd-row-value" style={{ color: meta.color }}>
                      −{inr(totals.discount)}
                    </span>
                  </div>
                  <div className="cd-row">
                    <span className="cd-row-label">You pay</span>
                    <span className="cd-row-value">{inr(totals.payable)}</span>
                  </div>
                </>
              )}

              <Link className="cd-cta" href={ROUTES.CART} onClick={close}>
                View Cart
                <ArrowRightIcon />
              </Link>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
