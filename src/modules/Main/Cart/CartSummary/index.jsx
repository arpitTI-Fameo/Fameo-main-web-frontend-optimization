'use client';
// modules/Main/Cart/CartSummary/index.jsx
// The right rail. Same component on both steps — step 2 adds a back chevron
// next to the title and swaps the CTA.
//
// Every figure arrives already computed by cartTotals(); this file does no
// arithmetic of its own, so the rail can never disagree with what checkout
// charges.

import { inr } from '@/utils/formatCurrency';
import { DELIVERY_METHODS } from '@/utils/shipping';

import { CART_SUMMARY } from '../constants';
import { itemCountLabel } from '../helpers';
import { ArrowRightIcon, ChevronLeftIcon } from '../icons';

import { S } from './styles';

/**
 * Props
 *  totals          from cartTotals()
 *  deliveryMethod  'door' | 'pickup'
 *  plan            { icon, label, color } when a membership discount applies
 *  percent         membership percent
 *  ctaLabel        string
 *  ctaDisabled     boolean
 *  onCta           () => void
 *  onBack          () => void | null  – renders the back chevron when given
 */
export default function CartSummary({
  totals,
  deliveryMethod,
  plan,
  percent,
  ctaLabel,
  ctaDisabled = false,
  onCta,
  onBack,
}) {
  if (!totals) return null;

  const isPickup = deliveryMethod === DELIVERY_METHODS.PICKUP;

  const deliveryValue = isPickup
    ? CART_SUMMARY.deliveryPickup
    : totals.shipping === 0
      ? CART_SUMMARY.deliveryFree
      : inr(totals.shipping);

  return (
    <>
      <style>{S}</style>
      <aside className="ctsum-wrap" aria-label={CART_SUMMARY.title}>
        <div className="ctsum-head">
          {onBack && (
            <button
              type="button"
              className="ctsum-back"
              onClick={onBack}
              aria-label="Back to your items"
            >
              <ChevronLeftIcon />
            </button>
          )}
          <h2 className="ctsum-title">{CART_SUMMARY.title}</h2>
        </div>

        <div className="ctsum-rows">
          <div className="ctsum-row">
            <span className="ctsum-label">
              {CART_SUMMARY.subtotalLabel} ({itemCountLabel(totals.count)})
              <small className="ctsum-note">{CART_SUMMARY.subtotalNote}</small>
            </span>
            <span className="ctsum-value">{inr(totals.listed)}</span>
          </div>

          {totals.discount > 0 && plan && (
            <div className="ctsum-row">
              <span className="ctsum-label" style={{ color: plan.color }}>
                {plan.icon} {plan.label} −{percent}%
              </span>
              <span className="ctsum-value" style={{ color: plan.color }}>
                −{inr(totals.discount)}
              </span>
            </div>
          )}
        </div>

        <div className="ctsum-rows ctsum-rows-bordered">
          <div className="ctsum-row">
            <span className="ctsum-label">{CART_SUMMARY.cartSubtotal}</span>
            <span className="ctsum-value">{inr(totals.payable)}</span>
          </div>

          <div className="ctsum-row">
            <span className="ctsum-label">{CART_SUMMARY.delivery}</span>
            <span className={`ctsum-value${totals.shipping === 0 && !isPickup ? ' is-free' : ''}`}>
              {deliveryValue}
            </span>
          </div>
        </div>

        <div className="ctsum-total">
          <span className="ctsum-total-label">{CART_SUMMARY.total}</span>
          <span className="ctsum-total-value">{inr(totals.total)}</span>
        </div>

        <p className="ctsum-footnote">{CART_SUMMARY.note}</p>

        <button
          type="button"
          className="ctsum-cta"
          onClick={onCta}
          disabled={ctaDisabled}
        >
          {ctaLabel}
          <ArrowRightIcon />
        </button>
      </aside>
    </>
  );
}
