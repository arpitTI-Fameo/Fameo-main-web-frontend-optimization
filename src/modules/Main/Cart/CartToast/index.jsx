'use client';
// modules/Cart/CartToast/index.jsx
// Premium add-to-bag confirmation.
//
// The original storefront had no confirmation at all — CartDrawer was mounted
// but never opened, and uiStore.showToast() had no renderer. This is that layer,
// built as a stacking glass card: frosted backdrop, layered depth shadow, spring
// entrance, a hairline countdown rail, and a shimmer that sweeps the thumbnail
// once on arrival.
//
// Stacks up to three; older cards recede in scale and opacity behind the newest
// so rapid adds read as a pile rather than a flicker.

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { inr } from '@/lib/formatCurrency';
import { useMembership } from '@/hooks/useMembership';
import { memberUnitPrice } from '@/lib/planPricing';
import { S } from './styles';
import CheckIcon from './CheckIcon';

const DURATION = 4600;
const MAX_STACK = 3;


export default function CartToast() {
  const lastAdded  = useCartStore((s) => s.lastAdded);
  const cartItems  = useCartStore((s) => s.cartItems);
  const uiToast    = useUIStore((s) => s.toast);
  const clearToast = useUIStore((s) => s.clearToast);
  const openDrawer = useUIStore((s) => s.openCartDrawer);
  const drawerOpen = useUIStore((s) => s.cartDrawerOpen);
  const { rate, percent, isMember } = useMembership();

  const [stack, setStack] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setStack((s) => s.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    clearTimeout(timers.current[id]);
    timers.current[id] = setTimeout(
      () => setStack((s) => s.filter((t) => t.id !== id)), 340
    );
  }, []);

  const push = useCallback((toast) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setStack((s) => [...s, { ...toast, id }].slice(-MAX_STACK));
    timers.current[id] = setTimeout(() => dismiss(id), DURATION);
  }, [dismiss]);

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

  // Successful adds
  useEffect(() => {
    if (!lastAdded?.at) return;
    const entry = cartItems.find((i) => i.product.id === lastAdded.id);
    const p     = entry?.product;
    const listed = Number(p?.price) || 0;
    const unit   = isMember ? memberUnitPrice(listed, rate) : listed;

    push({
      kind: 'success',
      head: lastAdded.status === 'increased' ? 'Bag updated' : 'Added to bag',
      name: lastAdded.name,
      image: p?.thumb || p?.image || p?.images?.[0] || null,
      qty: lastAdded.qty,
      unit,
      saved: isMember && listed > unit ? (listed - unit) * lastAdded.qty : 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastAdded?.at]);

  // Failures routed through uiStore
  useEffect(() => {
    if (!uiToast?.message) return;
    push({
      kind: uiToast.type === 'error' ? 'error' : uiToast.type === 'warn' ? 'warn' : 'success',
      head: uiToast.type === 'error' ? 'Not added' : uiToast.type === 'warn' ? 'Heads up' : 'Bag',
      name: uiToast.message,
    });
    clearToast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiToast]);

  // The drawer already shows the bag contents — a toast on top of it is
  // redundant and, at the drawer's z-index, overlapped the summary rows.
  if (!stack.length || drawerOpen) return null;

  const totalCount = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <style>{S}</style>
      <div className="ctx-wrap" role="status" aria-live="polite">
        {stack.map((t, i) => {
          const depth = stack.length - 1 - i;
          const isSuccess = t.kind === 'success' && t.qty != null;
          return (
            <div
              key={t.id}
              className={`ctx ${t.kind}${t.leaving ? ' leaving' : ''}`}
              data-depth={depth > 0 ? Math.min(depth, 2) : undefined}
              style={{ '--ctx-dur': `${DURATION}ms` }}
            >
              <span className="ctx-rail" aria-hidden="true" />

              <div className="ctx-body">
                <div className="ctx-thumb">
                  {t.image
                    ? <img src={t.image} alt="" />
                    : <div className="ctx-fallback">{t.kind === 'success' ? '🛍' : '⚠'}</div>}
                </div>

                <div className="ctx-main">
                  <div className="ctx-head">
                    {t.kind === 'success' && <CheckIcon />}
                    {t.head}
                  </div>
                  <div className="ctx-name" title={t.name}>{t.name}</div>

                  {isSuccess && (
                    <div className="ctx-meta">
                      <span className="ctx-price">{inr(t.unit)}</span>
                      <span>·</span>
                      <span>Qty {t.qty}</span>
                      {t.saved > 0 && (
                        <span className="ctx-saved">−{percent}% saved {inr(t.saved)}</span>
                      )}
                    </div>
                  )}

                  {isSuccess && (
                    <div className="ctx-actions">
                      <button
                        className="ctx-btn ghost"
                        onClick={() => { openDrawer(); dismiss(t.id); }}
                      >
                        View bag ({totalCount})
                      </button>
                      <Link
                        href="/checkout"
                        className="ctx-btn solid"
                        onClick={() => dismiss(t.id)}
                      >
                        Checkout
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <button className="ctx-close" onClick={() => dismiss(t.id)} aria-label="Dismiss">✕</button>
              <span className="ctx-timer" aria-hidden="true" />
            </div>
          );
        })}
      </div>
    </>
  );
}
