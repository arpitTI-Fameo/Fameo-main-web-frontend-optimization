'use client';
// modules/Products/PlanPrice/index.jsx
// Shows the creator's plan price on a product.
//
// This is the fix for "the user has the Popular plan but no offer is showing".
// Nothing under components/products/ read membership at all — every price on the
// storefront was the raw listed_price, identical for an anonymous visitor and a
// paying Elite member. The discount only appeared once you reached /cart, which
// is far too late: the whole point of the tier is to make the member price
// visible while browsing.
//
// Renders three ways:
//   member          → ₹9,800  (was ₹10,000)  ◈ Popular −2%
//   free + logged in→ ₹10,000  · ◈ Popular members pay ₹9,800
//   anonymous       → ₹10,000  (unchanged, no upsell noise)

import { inr } from '@/lib/formatCurrency';
import { memberUnitPrice, PLAN_DISCOUNTS, PLAN_META } from '@/lib/planPricing';
import { useMembership } from '@/hooks/useMembership';

import { S } from './styles';

/**
 * @param {number} price     listed price in rupees
 * @param {number} qty       multiplier for the "you save" line (default 1)
 * @param {'sm'|'lg'} size
 * @param {boolean} showUpsell  show "Popular members pay X" to non-members
 */
export default function PlanPrice({
  price,
  qty = 1,
  size = 'sm',
  showUpsell = true,
  className = '',
}) {
  const { rate, percent, plan, meta, isMember, ready } = useMembership();

  const listed = Number(price) || 0;

  // Until the persisted auth state has rehydrated, render the plain listed price
  // so the server and client markup agree.
  if (!ready) {
    return (
      <>
        <style>{S}</style>
        <span className={`pp-wrap ${className}`}>
          <span className="pp-row"><span className="pp-now">{inr(listed)}</span></span>
        </span>
      </>
    );
  }

  if (isMember && rate > 0) {
    const now  = memberUnitPrice(listed, rate);
    const save = (listed - now) * qty;

    return (
      <>
        <style>{S}</style>
        <span className={`pp-wrap ${size === 'lg' ? 'lg' : ''} ${className}`}>
          <span className="pp-row">
            <span className="pp-now">{inr(now)}</span>
            <span className="pp-was">{inr(listed)}</span>
            <span className="pp-badge" style={{ color: meta.color }}>
              {meta.icon} {meta.label} −{percent}%
            </span>
          </span>
          {save > 0 && <span className="pp-save">You save {inr(save)}</span>}
        </span>
      </>
    );
  }

  // Logged-in on the free tier → show what a plan would be worth on THIS item.
  const popularPrice = memberUnitPrice(listed, PLAN_DISCOUNTS.popular);

  return (
    <>
      <style>{S}</style>
      <span className={`pp-wrap ${size === 'lg' ? 'lg' : ''} ${className}`}>
        <span className="pp-row"><span className="pp-now">{inr(listed)}</span></span>
        {showUpsell && listed > 0 && (
          <span className="pp-upsell">
            <span style={{ color: PLAN_META.popular.color }}>{PLAN_META.popular.icon}</span>{' '}
            Popular members pay <b>{inr(popularPrice)}</b>
          </span>
        )}
      </span>
    </>
  );
}
