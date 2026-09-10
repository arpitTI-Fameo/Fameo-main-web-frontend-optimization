'use client';
// components/cart/CartToast.js
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

const DURATION = 4600;
const MAX_STACK = 3;

const S = `
  .ctx-wrap {
    position: fixed; z-index: 10000;
    right: 26px; bottom: 26px;
    display: flex; flex-direction: column-reverse; align-items: flex-end;
    pointer-events: none;
    font-family: 'Jost', sans-serif;
    perspective: 1000px;
  }

  .ctx {
    pointer-events: all;
    position: relative;
    width: 340px;
    margin-top: 10px;
    border-radius: 6px;
    overflow: hidden;
    background: rgba(255,255,255,.82);
    -webkit-backdrop-filter: blur(22px) saturate(1.7);
    backdrop-filter: blur(22px) saturate(1.7);
    box-shadow:
      0 1px 0 rgba(255,255,255,.9) inset,
      0 0 0 1px rgba(17,17,24,.07),
      0 12px 24px -8px rgba(17,17,24,.16),
      0 32px 64px -16px rgba(17,17,24,.22);
    transform-origin: bottom right;
    animation: ctxIn .56s cubic-bezier(.16,1,.3,1) both;
  }
  .ctx.leaving { animation: ctxOut .32s cubic-bezier(.55,0,1,.45) forwards; }

  /* Older cards recede behind the newest */
  .ctx[data-depth="1"] { transform: scale(.955) translateY(6px); opacity: .74; }
  .ctx[data-depth="2"] { transform: scale(.91)  translateY(12px); opacity: .48; }

  @keyframes ctxIn {
    0%   { opacity: 0; transform: translateY(26px) scale(.9) rotateX(14deg); }
    100% { opacity: 1; transform: translateY(0)    scale(1)  rotateX(0deg);  }
  }
  @keyframes ctxOut {
    to { opacity: 0; transform: translateX(28px) scale(.94); }
  }

  /* Accent rail down the left edge */
  .ctx-rail { position: absolute; left: 0; top: 0; bottom: 0; width: 3px; }
  .ctx.success .ctx-rail { background: linear-gradient(180deg,#DD8164,#E8457A); }
  .ctx.warn    .ctx-rail { background: linear-gradient(180deg,#E8A33D,#d18f28); }
  .ctx.error   .ctx-rail { background: linear-gradient(180deg,#E05050,#c03a3a); }

  .ctx-body { display: flex; gap: 13px; padding: 15px 16px 14px 19px; }

  /* Thumbnail with a one-shot shimmer sweep */
  .ctx-thumb {
    position: relative; width: 54px; height: 54px; flex-shrink: 0;
    border-radius: 4px; overflow: hidden;
    background: #F2F2F6;
    box-shadow: 0 0 0 1px rgba(17,17,24,.06), 0 4px 12px rgba(17,17,24,.1);
    animation: ctxThumb .6s cubic-bezier(.34,1.56,.64,1) both .06s;
  }
  @keyframes ctxThumb {
    from { transform: scale(.5) rotate(-10deg); opacity: 0; }
    to   { transform: scale(1)  rotate(0deg);   opacity: 1; }
  }
  .ctx-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ctx-thumb::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(115deg,transparent 30%,rgba(255,255,255,.7) 50%,transparent 70%);
    transform: translateX(-130%);
    animation: ctxShimmer 1.1s cubic-bezier(.4,0,.2,1) .34s;
  }
  @keyframes ctxShimmer { to { transform: translateX(130%); } }

  .ctx-fallback {
    width: 100%; height: 100%; display: flex; align-items: center;
    justify-content: center; font-size: 20px;
    background: linear-gradient(135deg,#FDEFE6,#f7dfd4);
  }

  .ctx-main { flex: 1; min-width: 0; }
  .ctx-head {
    display: flex; align-items: center; gap: 5px;
    font-size: 8.5px; font-weight: 500; letter-spacing: .22em;
    text-transform: uppercase; margin-bottom: 5px;
  }
  .ctx.success .ctx-head { color: #DD8164; }
  .ctx.warn    .ctx-head { color: #C4801F; }
  .ctx.error   .ctx-head { color: #C03A3A; }
  .ctx-head svg { width: 11px; height: 11px; }
  .ctx-head svg path {
    stroke: currentColor; stroke-width: 2.6; fill: none;
    stroke-linecap: round; stroke-linejoin: round;
    stroke-dasharray: 22; stroke-dashoffset: 22;
    animation: ctxDraw .46s cubic-bezier(.65,0,.35,1) .22s forwards;
  }
  @keyframes ctxDraw { to { stroke-dashoffset: 0; } }

  .ctx-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px; font-weight: 400; color: #111118;
    line-height: 1.25; margin-bottom: 4px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .ctx-meta {
    font-size: 10.5px; font-weight: 300; color: #7a7a88;
    display: flex; align-items: center; gap: 7px; flex-wrap: wrap;
  }
  .ctx-price { color: #111118; font-weight: 400; }
  .ctx-saved {
    color: #2eaa68; font-weight: 400;
    padding: 1px 6px; border-radius: 2px;
    background: rgba(46,170,104,.09);
    font-size: 9.5px; letter-spacing: .04em;
  }

  .ctx-actions { display: flex; gap: 8px; margin-top: 11px; }
  .ctx-btn {
    flex: 1; text-align: center;
    font-family: 'Jost', sans-serif;
    font-size: 9px; font-weight: 400; letter-spacing: .18em;
    text-transform: uppercase; padding: 8px 10px;
    border-radius: 3px; cursor: pointer; text-decoration: none;
    transition: all .22s cubic-bezier(.4,0,.2,1);
  }
  .ctx-btn.ghost {
    color: #3a3a44; background: rgba(17,17,24,.045);
    border: 1px solid rgba(17,17,24,.07);
  }
  .ctx-btn.ghost:hover { background: rgba(17,17,24,.08); color: #111118; }
  .ctx-btn.solid {
    color: #fff; border: 1px solid transparent;
    background: linear-gradient(120deg,#111118,#2a2a36);
    box-shadow: 0 4px 14px rgba(17,17,24,.22);
  }
  .ctx-btn.solid:hover { transform: translateY(-1px); box-shadow: 0 7px 20px rgba(17,17,24,.3); }

  .ctx-close {
    position: absolute; top: 9px; right: 10px;
    width: 20px; height: 20px; border: none; cursor: pointer;
    background: transparent; color: #b0b0be;
    font-size: 13px; line-height: 1; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    transition: all .2s;
  }
  .ctx-close:hover { background: rgba(17,17,24,.06); color: #111118; }

  /* Hairline countdown rail */
  .ctx-timer {
    position: absolute; left: 0; bottom: 0; height: 1.5px;
    background: linear-gradient(90deg,#DD8164,#E8457A);
    animation: ctxTimer var(--ctx-dur) linear forwards;
  }
  @keyframes ctxTimer { from { width: 100%; } to { width: 0%; } }
  .ctx:hover .ctx-timer { animation-play-state: paused; }

  @media (max-width: 640px) {
    .ctx-wrap { right: 12px; left: 12px; bottom: 12px; align-items: stretch; }
    .ctx { width: auto; }
  }

  @media (prefers-reduced-motion: reduce) {
    .ctx, .ctx-thumb, .ctx-thumb::after, .ctx-head svg path, .ctx-timer {
      animation: none !important;
    }
    .ctx-head svg path { stroke-dashoffset: 0; }
    .ctx-thumb::after { display: none; }
  }
`;

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5 L9.5 18 L20 6.5" /></svg>
);

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