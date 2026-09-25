// modules/Main/Products/productAdapter.js
// Maps Fameo Products backend rows → the product shape the main web UI
// already renders (see constants/mockData.js PRODUCTS).
// Backend money is in paise; inr() expects rupees.
//
// Product-shaped mapping, owned by the Products module. It lived in
// src/utils/ but had exactly one consumer — this module's own helpers.js —
// and a response mapper for one domain is not a generic utility.

import { paiseToRupees } from '@/utils/formatCurrency';

// Backend product row → UI product
export const adaptProduct = (p) => ({
  id: p.id,                                   // UUID (was numeric in mock)
  slug: p.id,                                 // use UUID as slug in routes
  name: p.name,
  brand: p.brand || '',
  category: p.category,
  subcategory: p.subcategory,
  price: paiseToRupees(p.fameoDiscountedPrice || p.listed_price),       // rupees, for inr()
  original: paiseToRupees(p.suggested_price) || paiseToRupees(p.listed_price),
  image: p.images?.find((i) => i.is_main)?.url || p.images?.[0]?.url || null,
  images: (p.images || []).map((i) => i.url),
  stock: p.available_stock ?? 99,             // default if API does not return it yet
  status: p.status,                            // 'live' | 'frozen' | ...
  available: p.status === 'live',              // frozen → "Temporarily unavailable"
  specs: p.specs || {},
  tag: null,
});

/* adaptCart() lived here and mapped a backend cart to UI lines. Nothing in the
   repo called it — not a component, hook, service or test. Removed rather than
   left as a second, drifting definition of the cart shape. */
