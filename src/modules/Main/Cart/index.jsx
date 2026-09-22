'use client';
// modules/Main/Cart/index.jsx
// Cart — /cart. Two steps: Your Items, then Shipping Info.
//
// Thin orchestrator. It owns which step is open, reads the cart and membership,
// computes the totals once, and writes the delivery choice into the checkout
// store. Every section below is presentational.
//
// The cart owns the delivery details on purpose: /checkout used to ask for the
// address itself, so a shopper who filled it in here would have been asked the
// same eight fields again one screen later. Checkout now opens on payment when
// this step is complete.

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/constants/routes';
import { useMembership } from '@/lib/hooks/custome/useMembership';
import { useAddresses } from '@/lib/hooks/main/useUser';
import { useAuthStore } from '@/store/authStore';
import { useCartStore, useHydratedCart } from '@/store/cartStore';
import { useCheckoutStore } from '@/store/checkoutStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { isCompleteAddress } from '@/utils/address';
import { DELIVERY_METHODS } from '@/utils/shipping';

import CartItem from './CartItem';
import CartSteps from './CartSteps';
import CartSummary from './CartSummary';
import ShippingStep from './ShippingStep';
import {
  CART_BREADCRUMBS,
  CART_CTA,
  CART_DEFAULT_STEP,
  CART_EMPTY,
  CART_HEADER,
  CART_STEPS,
} from './constants';
import { cartTotals } from './helpers';
import { styles } from './styles';

const [ITEMS_STEP, SHIPPING_STEP] = CART_STEPS.map((s) => s.id);

export default function Cart() {
  const router = useRouter();

  const updateQty = useCartStore((s) => s.updateQty);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const hasWish = useWishlistStore((s) => s.has);
  const user = useAuthStore((s) => s.user);

  // Persisted cart state does not exist during SSR, so render the empty state
  // until hydration completes — React 19 throws away the tree on a mismatch
  // rather than just warning.
  const { items, ready } = useHydratedCart();

  const address = useCheckoutStore((s) => s.address);
  const deliveryMethod = useCheckoutStore((s) => s.deliveryMethod);
  const shippingRateId = useCheckoutStore((s) => s.shippingRateId);
  const setAddress = useCheckoutStore((s) => s.setAddress);
  const setDeliveryMethod = useCheckoutStore((s) => s.setDeliveryMethod);

  const { rate: discountRate, percent, meta: plan } = useMembership();

  const { data: savedAddresses, isLoading: loadingAddresses } = useAddresses();

  const [step, setStep] = useState(CART_DEFAULT_STEP);
  // Addresses added in this session, before any of them reach the account API.
  const [drafts, setDrafts] = useState([]);

  const totals = useMemo(
    () => cartTotals(items, discountRate, deliveryMethod, shippingRateId),
    [items, discountRate, deliveryMethod, shippingRateId]
  );

  // The account's saved addresses plus anything added here this session. Both
  // carry an `id` so the list can mark one selected.
  const addresses = useMemo(() => {
    const saved = Array.isArray(savedAddresses) ? savedAddresses : [];
    return [...saved, ...drafts];
  }, [savedAddresses, drafts]);

  const isPickup = deliveryMethod === DELIVERY_METHODS.PICKUP;
  const canShip = isPickup || isCompleteAddress(address);

  const addAddress = useCallback(
    (next) => {
      const withId = { ...next, id: next.id || `draft-${Date.now()}` };
      setDrafts((prev) => [...prev, withId]);
      setAddress(withId);
    },
    [setAddress]
  );

  const goToPayment = useCallback(() => {
    if (!canShip) return;
    router.push(ROUTES.CHECKOUT);
  }, [canShip, router]);

  const empty = !items.length;

  return (
    <>
      <style>{styles}</style>
      <main className="ct-page">
        <div className="ct-inner">
          <nav className="ct-crumbs" aria-label="Breadcrumb">
            {CART_BREADCRUMBS.map((crumb, i) => {
              const last = i === CART_BREADCRUMBS.length - 1;
              return (
                <span key={crumb.label}>
                  {crumb.href && !last ? (
                    <Link className="ct-crumb" href={crumb.href}>{crumb.label}</Link>
                  ) : (
                    <span className="ct-crumb-current" aria-current="page">{crumb.label}</span>
                  )}
                  {!last && <span className="ct-crumb-sep"> / </span>}
                </span>
              );
            })}
          </nav>

          <header className="ct-head">
            <div>
              <p className="ct-eyebrow">{CART_HEADER.eyebrow}</p>
              <h1 className="ct-title">{CART_HEADER.title}</h1>
              <p className="ct-sub">{CART_HEADER.subtitle}</p>
            </div>

            <CartSteps
              steps={CART_STEPS}
              active={step}
              reachable={(id) => id === ITEMS_STEP || !empty}
              onSelect={setStep}
            />
          </header>

          {!ready ? null : empty ? (
            <div className="ct-empty">
              <h2 className="ct-empty-title">{CART_EMPTY.title}</h2>
              <p className="ct-empty-body">{CART_EMPTY.body}</p>
              <Link className="ct-empty-cta" href={ROUTES.PRODUCTS}>
                {CART_CTA.empty}
              </Link>
            </div>
          ) : (
            <div className="ct-body">
              <div className="ct-main">
                {step === ITEMS_STEP ? (
                  items.map(({ product, qty }) => (
                    <CartItem
                      key={product.id}
                      product={product}
                      qty={qty}
                      onUpdate={updateQty}
                      onRemove={removeFromCart}
                      onWishlist={toggleWish}
                      isWished={hasWish(product.id)}
                    />
                  ))
                ) : (
                  <ShippingStep
                    user={user}
                    method={deliveryMethod}
                    onMethod={setDeliveryMethod}
                    addresses={addresses}
                    loadingAddresses={loadingAddresses}
                    selectedId={address?.id ?? null}
                    onSelectAddress={setAddress}
                    onAddAddress={addAddress}
                  />
                )}
              </div>

              <div className="ct-rail">
                <CartSummary
                  totals={totals}
                  deliveryMethod={deliveryMethod}
                  plan={plan}
                  percent={percent}
                  ctaLabel={step === ITEMS_STEP ? CART_CTA.toShipping : CART_CTA.toPayment}
                  ctaDisabled={step === SHIPPING_STEP && !canShip}
                  onCta={step === ITEMS_STEP ? () => setStep(SHIPPING_STEP) : goToPayment}
                  onBack={step === SHIPPING_STEP ? () => setStep(ITEMS_STEP) : null}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
