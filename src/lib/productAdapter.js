// lib/productAdapter.js
// Maps Fameo Products backend rows → the product shape your main web UI
// already renders (see constants/mockData.js PRODUCTS).
// Backend money is in paise; your `inr()` formatter expects rupees.

export const paiseToRupees = (paise) =>
  paise == null ? null : Math.round(paise) / 100;

// Backend product row → UI product
export const adaptProduct = (p) => ({
  id: p.id,                                   // UUID (was numeric in mock)
  slug: p.id,                                 // use UUID as slug in routes
  name: p.name,
  brand: p.brand || '',
  category: p.category,
  subcategory: p.subcategory,
  price: paiseToRupees(p.listed_price),       // rupees, for inr()
  image: p.images?.find((i) => i.is_main)?.url || p.images?.[0]?.url || null,
  images: (p.images || []).map((i) => i.url),
  stock: p.available_stock ?? undefined,      // present only on some endpoints
  status: p.status,                            // 'live' | 'frozen' | ...
  available: p.status === 'live',              // frozen → "Temporarily unavailable"
  specs: p.specs || {},
  tag: null,
});

// Backend cart → UI cart lines
// discount_pct_locked + final_price were fixed when the item was added —
// display these, never recompute on the client.
export const adaptCart = (cart) => ({
  id: cart.id,
  expiresAt: cart.expires_at,                 // show a TTL countdown if you like
  plan: cart.plan_snapshot,                   // plan the discount was locked from
  items: (cart.items || []).map((it) => ({
    productId: it.product_id,
    name: it.product_name,
    qty: it.quantity,
    listedPrice: paiseToRupees(it.listed_price_at_add),
    discountPct: it.discount_pct_locked,
    finalPrice: paiseToRupees(it.final_price), // per-unit, discount applied
  })),
  total: paiseToRupees(
    (cart.items || []).reduce((s, it) => s + it.final_price * it.quantity, 0)
  ),
});
