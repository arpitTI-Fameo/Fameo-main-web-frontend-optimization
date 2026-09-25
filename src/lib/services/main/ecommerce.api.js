import { createServerAction } from '@/lib/api/action';
import { BFF_PRODUCTS_BASE } from '@/lib/api/config';
import {
  inventoryEndpoints,
  pricingEndpoints,
  invoiceEndpoints,
  customerOrderEndpoints,
  checkoutEndpoints,
  paymentEndpoints,
  fulfillmentEndpoints,
} from '@/lib/api/endpoints';

// ── Checkout (buyer) ──────────────────────────────────────────────────────────
// Every amount here is computed by the backend from the live catalog; the body
// only ever carries the delivery address. Money comes back in PAISE.

/** The authoritative totals for the buyer's server cart, before ordering. */
export const previewCheckoutAction = async (shippingAddress) => {
  return createServerAction({
    url: checkoutEndpoints.preview(),
    method: 'POST',
    body: shippingAddress ? { shipping_address: shippingAddress } : {},
    base: BFF_PRODUCTS_BASE,
  });
};

/**
 * Freeze the server cart into an order. `idempotencyKey` makes a retried
 * request (timeout, double tap) return the same order instead of a second one.
 */
export const createCustomerOrderAction = async ({ shippingAddress, idempotencyKey }) => {
  return createServerAction({
    url: customerOrderEndpoints.create(),
    method: 'POST',
    body: { shipping_address: shippingAddress },
    headers: { 'Idempotency-Key': idempotencyKey },
    base: BFF_PRODUCTS_BASE,
  });
};

/** Razorpay Checkout options for an order — reuses a live attempt if one exists. */
export const createOrderPaymentAction = async ({ orderId, idempotencyKey }) => {
  return createServerAction({
    url: customerOrderEndpoints.payment(orderId),
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
    base: BFF_PRODUCTS_BASE,
  });
};

/** Release an unpaid order (and the stock it holds). */
export const cancelCustomerOrderAction = async ({ orderId, reason }) => {
  return createServerAction({
    url: customerOrderEndpoints.cancel(orderId),
    method: 'POST',
    body: reason ? { reason } : {},
    base: BFF_PRODUCTS_BASE,
  });
};

/** Hand the Razorpay browser callback to the backend, which checks it with Razorpay. */
export const verifyCustomerPaymentAction = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  return createServerAction({
    url: paymentEndpoints.verify(),
    method: 'POST',
    body: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
    base: BFF_PRODUCTS_BASE,
  });
};

// ── Customer Orders ───────────────────────────────────────────────────────────
export const getCustomerOrdersAction = async () => {
  return createServerAction({
    url: customerOrderEndpoints.getAll(),
    method: 'GET',
    base: BFF_PRODUCTS_BASE,
  });
};

export const getCustomerOrderAction = async (id) => {
  return createServerAction({
    url: customerOrderEndpoints.getOne(id),
    method: 'GET',
    base: BFF_PRODUCTS_BASE,
  });
};

// One commerce call through the products BFF. Resolves to the action envelope
// ({ code, status, error, result }) like every action above.
const commerce = (method, url, body) =>
  createServerAction({ url, method, base: BFF_PRODUCTS_BASE, ...(body !== undefined ? { body } : {}) });

// ── Customer orders: staff view + payment status/retry ───────────────────────
export const getCustomerOrderForStaffAction = async (id) => commerce('GET', customerOrderEndpoints.staff(id));
export const getOrderPaymentAction = async (orderId) => commerce('GET', customerOrderEndpoints.payment(orderId));
export const retryOrderPaymentAction = async ({ orderId, idempotencyKey }) =>
  createServerAction({
    url: customerOrderEndpoints.paymentRetry(orderId),
    method: 'POST',
    base: BFF_PRODUCTS_BASE,
    ...(idempotencyKey ? { headers: { 'Idempotency-Key': idempotencyKey } } : {}),
  });

// ── Fulfillment lines (staff / retailers) ─────────────────────────────────────
export const getFulfillmentOrdersAction = async (params) =>
  commerce('GET', fulfillmentEndpoints.getAll(), params);
export const getFulfillmentOrderAction = async (id) => commerce('GET', fulfillmentEndpoints.getOne(id));
export const updateFulfillmentStatusAction = async (id, data) =>
  commerce('PATCH', fulfillmentEndpoints.status(id), data);
export const viewCustomerInvoiceAction = async (orderId) =>
  commerce('GET', fulfillmentEndpoints.customerInvoiceView(orderId));
export const downloadCustomerInvoiceAction = async (orderId) =>
  commerce('GET', fulfillmentEndpoints.customerInvoiceDownload(orderId));

// ── Inventory ─────────────────────────────────────────────────────────────────
export const getInventoryAction = async (params) => commerce('GET', inventoryEndpoints.getAll(), params);
export const createInventoryAction = async (data) => commerce('POST', inventoryEndpoints.create(), data);
export const getProductInventoryAction = async (productId) =>
  commerce('GET', inventoryEndpoints.forProduct(productId));
/** `id` is the stock record's id; body { qty, reason? }. */
export const updateProductInventoryAction = async (id, data) =>
  commerce('PATCH', inventoryEndpoints.stock(id), data);
/** Body { new_cost_price }. */
export const updateInventoryCostAction = async (id, data) =>
  commerce('PATCH', inventoryEndpoints.cost(id), data);
export const markInventoryReviewedAction = async (id) =>
  commerce('PATCH', inventoryEndpoints.reviewed(id));

// ── Pricing (reprice requests + safety table) ────────────────────────────────
export const getPricingAction = async (params) => commerce('GET', pricingEndpoints.safety(), params);
export const getRepriceRequestsAction = async (params) =>
  commerce('GET', pricingEndpoints.reprice(), params);
export const proposeRepriceAction = async (productId, data) =>
  commerce('POST', pricingEndpoints.propose(productId), data);
export const approveRepriceAction = async (id, data) =>
  commerce('POST', pricingEndpoints.approve(id), data);
export const rejectRepriceAction = async (id, data) =>
  commerce('POST', pricingEndpoints.reject(id), data);

// ── Invoices ──────────────────────────────────────────────────────────────────
export const getInvoicesAction = async (params) => commerce('GET', invoiceEndpoints.getAll(), params);
export const getInvoiceAction = async (id) => commerce('GET', invoiceEndpoints.getOne(id));
/** Body { order_ids: [fulfillment line ids], gst_rate? }. */
export const raiseInvoiceAction = async (data) => commerce('POST', invoiceEndpoints.raise(), data);
export const viewInvoiceAction = async (id) => commerce('GET', invoiceEndpoints.view(id));
export const downloadInvoiceAction = async (id) => commerce('GET', invoiceEndpoints.download(id));
/** Body { reference?, paid_amount?, note? }. */
export const settleInvoiceAction = async (id, data) => commerce('POST', invoiceEndpoints.settle(id), data);
/** Body { note }. */
export const disputeInvoiceAction = async (id, data) => commerce('POST', invoiceEndpoints.dispute(id), data);
export const getInvoiceEwayAction = async (id) => commerce('GET', invoiceEndpoints.eway(id));
export const retryInvoiceEwayAction = async (id) => commerce('POST', invoiceEndpoints.retryEway(id));
