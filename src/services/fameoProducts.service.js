// services/fameoProducts.service.js
// Creator-side client for the Fameo Products backend (fameo-products-backend).
// Drop into your main web's services/ folder.
//
// Uses the same token storage your app already uses ('fameo-auth' zustand
// persist) so a logged-in creator's JWT is sent automatically.
// The products backend and your existing backend can share JWT_SECRET so
// one login works for both — see INTEGRATION.md.
//
// ⚠️ All money from this API is in PAISE. Use lib/productAdapter.js
//    (or divide by 100) before display.

const PRODUCTS_API =
  process.env.NEXT_PUBLIC_PRODUCTS_API_URL || 'http://localhost:5001/api';

const getToken = () => {
  try {
    const raw = localStorage.getItem('fameo-auth');
    return raw ? JSON.parse(raw)?.state?.token : null;
  } catch {
    return null;
  }
};

const call = async (path, options = {}) => {
  const token = getToken();
  const res = await fetch(`${PRODUCTS_API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
};



// ── Products (public catalog for creators) ─────────────────────
// GET /products?status=live&category=&search=&page=&limit=
export const getLiveProducts = (params = {}) => {
  const qs = new URLSearchParams({ status: 'live', limit: 50, ...params });
  return call(`/products?${qs}`); // { products, total }
};

// ── Storefront (PUBLIC — no login required) ────────────────────
// Hits /api/public/products on the products backend, which returns only
// 'live' products and needs no token. Use these on anonymous storefront pages.
export const getStorefrontProducts = (params = {}) => {
  const qs = new URLSearchParams({ limit: 50, ...params });
  return call(`/public/products?${qs}`); // { products, total }
};

export const getStorefrontProduct = (id) =>
  call(`/public/products/${id}`); // { product }

// GET /products/:id — includes images array
export const getProduct = (id) => call(`/products/${id}`); // { product }

// ── Server cart (§5.4) — creators only ─────────────────────────
// Discount is LOCKED at cart creation from the creator's current plan.
// Cart expires 30 minutes after creation. Stock is reserved on add.
export const getCart = () => call('/cart'); // gets or creates active cart

export const addToCart = (product_id, quantity = 1) =>
  call('/cart/items', { method: 'POST', body: JSON.stringify({ product_id, quantity }) });
  // 409 → insufficient stock: err.message tells how many units are available

export const removeFromCart = (productId) =>
  call(`/cart/items/${productId}`, { method: 'DELETE' }); // releases reservation

export const clearCart = () => call('/cart', { method: 'DELETE' });

// ── Checkout (§5.5 + §6.1) ──────────────────────────────────────
// ⚠️ Call ONLY after Razorpay confirms payment (doc §9.1) — never before.
// shipping_address is the buyer's delivery address, captured at checkout. It is
// stored on the order and snapshotted onto the customer invoice (Ship-To) that
// ships in the box, so the retailer knows where to send the goods.
export const checkout = (cart_id, payment_ref, shipping_address = null) =>
  call('/orders/checkout', {
    method: 'POST',
    body: JSON.stringify({ cart_id, payment_ref, shipping_address }),
  });

// ── Orders & support (creator scope is automatic) ──────────────
export const getMyOrders = () => call('/orders');           // { orders } — own orders only
export const getOrder = (id) => call(`/orders/${id}`);      // { order }
export const raiseTicket = ({ issue, type, priority, order_id }) =>
  call('/support', { method: 'POST', body: JSON.stringify({ issue, type, priority, order_id }) });
export const getMyTickets = () => call('/support');         // own tickets only



// ── Cart sync (browsing cart → server cart) ─────────────────────
// Replaces the server cart with the local cart, so stock is reserved and
// the plan discount is locked before payment. Returns the fresh server cart.
//
// Items are added sequentially, not in parallel: the server cart is a single
// document and concurrent writes to it will clobber each other's items.
export const syncCartToServer = async (localItems) => {
  await clearCart().catch(() => {});   // release any stale reservations

  const failed = [];
  for (const { product, qty } of localItems) {
    try {
      await addToCart(product.id, qty);
    } catch (e) {
      failed.push({ name: product.name || product.id, reason: e.message });
    }
  }

  const { cart } = await getCart();
  return { cart, failed };
};