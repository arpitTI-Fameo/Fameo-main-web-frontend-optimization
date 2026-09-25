// modules/Main/Cart/helpers.js
// Cart arithmetic. Pure — no React, no network.

import { paiseToRupees } from '@/utils/formatCurrency';
import { planTotals, CHECKOUT_DISCOUNT_RATE } from '@/utils/planPricing';
import { rateFor, shippingCostFor } from '@/utils/shipping';

/**
 * The server cart (useCart → { cart, pricing, limits }) → the same
 * [{ product, qty, cartItemId }] lines the local cart yields, in rupees.
 *
 * Money is read from pricing.items: unit_price is recomputed by the backend
 * from Product.fameoDiscountedPrice and is exactly what checkout charges.
 * cart.items[].final_price is a legacy figure cached at add time (with the old
 * plan discount) and is only a fallback. No plan discount applies at checkout
 * (CHECKOUT_DISCOUNT_RATE), so there is no struck-through "before discount"
 * price. pricing.items also adds the quantity caps and the brand, joined on
 * the cart item id.
 */
export function serverCartItems(data) {
  const lines = data?.cart?.items || [];
  const pricing = new Map((data?.pricing?.items || []).map((p) => [p.cart_item_id, p]));
  const perItemCap = data?.limits?.max_quantity_per_item;

  return lines.map((line) => {
    const p = pricing.get(line.id) || {};
    const snap = p.product_snapshot || {};
    const price = paiseToRupees(p.unit_price ?? line.final_price) || 0;
    // The stepper stops at whichever runs out first: the per-item cap or stock.
    const caps = [p.max_quantity ?? perItemCap, p.available_quantity].filter((n) => n != null);

    return {
      product: {
        id: line.product_id,
        name: line.name || line.product_name || snap.name,
        brand: snap.brand,
        image: line.main_image || snap.image,
        category: line.category || snap.category,
        price,
        original: null,
        stock: caps.length ? Math.min(...caps) : undefined,
        // Catalogue shots are packshots on white — framed whole, never cropped.
        imageFit: 'contain',
      },
      qty: line.quantity,
      cartItemId: line.id,
    };
  });
}

/**
 * cartTotals() for a server cart, same shape. The member discount is already
 * locked into each line's price, so it is read back as listed − paid rather
 * than applied a second time from the membership rate.
 */
export function serverCartTotals(items = [], deliveryMethod, shippingRateId) {
  const listed = items.reduce((sum, i) => sum + (i.product.original ?? i.product.price) * i.qty, 0);
  const payable = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const rate = rateFor(deliveryMethod, shippingRateId);
  const shipping = shippingCostFor(rate, payable);

  return {
    listed,
    discount: Math.round((listed - payable) * 100) / 100,
    payable,
    rate,
    shipping,
    total: payable + shipping,
    count: items.reduce((sum, i) => sum + i.qty, 0),
  };
}

/**
 * Every number the summary prints, from one place.
 *
 * The rule that matters: the free-shipping threshold is judged on the
 * POST-discount payable, not the listed subtotal. A member's discount can
 * legitimately drop them back under the line, and the cart, the drawer and
 * checkout all have to agree about that — they used to not.
 *
 * @param items          [{ product, qty }]
 * @param discountRate   the member's rate — accepted for the callers, but NOT
 *                       applied: checkout applies CHECKOUT_DISCOUNT_RATE, and
 *                       the page must show what Razorpay will charge
 * @param deliveryMethod 'door' | 'pickup'
 * @param shippingRateId id from SHIPPING_RATES
 */
export function cartTotals(items = [], discountRate = 0, deliveryMethod, shippingRateId) {
  const listed = items.reduce(
    (sum, i) => sum + (Number(i.product?.price) || 0) * i.qty,
    0
  );

  const { discount, payable } = planTotals(items, CHECKOUT_DISCOUNT_RATE);
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
