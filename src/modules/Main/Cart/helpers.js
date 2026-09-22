// modules/Main/Cart/helpers.js
// Cart arithmetic. Pure — no React, no network.

import { planTotals } from '@/utils/planPricing';
import { rateFor, shippingCostFor } from '@/utils/shipping';

/**
 * Every number the summary prints, from one place.
 *
 * The rule that matters: the free-shipping threshold is judged on the
 * POST-discount payable, not the listed subtotal. A member's discount can
 * legitimately drop them back under the line, and the cart, the drawer and
 * checkout all have to agree about that — they used to not.
 *
 * @param items          [{ product, qty }]
 * @param discountRate   membership rate, 0 for none
 * @param deliveryMethod 'door' | 'pickup'
 * @param shippingRateId id from SHIPPING_RATES
 */
export function cartTotals(items = [], discountRate = 0, deliveryMethod, shippingRateId) {
  const listed = items.reduce(
    (sum, i) => sum + (Number(i.product?.price) || 0) * i.qty,
    0
  );

  const { discount, payable } = planTotals(items, discountRate);
  const rate = rateFor(deliveryMethod, shippingRateId);
  const shipping = shippingCostFor(rate, payable);

  return {
    listed,
    discount,
    payable,
    rate,
    shipping,
    total: payable + shipping,
    count: items.reduce((sum, i) => sum + i.qty, 0),
  };
}

/** What one line costs at its listed price. */
export const lineTotal = (item) =>
  (Number(item?.product?.price) || 0) * (item?.qty || 0);

/** "1 Item" / "3 Items" — the summary's subtotal label takes this. */
export const itemCountLabel = (n) => `${n} ${n === 1 ? 'Item' : 'Items'}`;
