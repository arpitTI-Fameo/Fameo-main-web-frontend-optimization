import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import {
  previewCheckoutAction,
  createCustomerOrderAction,
  createOrderPaymentAction,
  cancelCustomerOrderAction,
  verifyCustomerPaymentAction,
  getCustomerOrdersAction,
  getCustomerOrderAction,
  getCustomerOrderForStaffAction,
  getOrderPaymentAction,
  retryOrderPaymentAction,
  getFulfillmentOrdersAction,
  getFulfillmentOrderAction,
  updateFulfillmentStatusAction,
  viewCustomerInvoiceAction,
  downloadCustomerInvoiceAction,
  getInventoryAction,
  createInventoryAction,
  getProductInventoryAction,
  updateProductInventoryAction,
  updateInventoryCostAction,
  markInventoryReviewedAction,
  getPricingAction,
  getRepriceRequestsAction,
  proposeRepriceAction,
  approveRepriceAction,
  rejectRepriceAction,
  getInvoicesAction,
  getInvoiceAction,
  raiseInvoiceAction,
  viewInvoiceAction,
  downloadInvoiceAction,
  settleInvoiceAction,
  disputeInvoiceAction,
  getInvoiceEwayAction,
  retryInvoiceEwayAction,
} from '@/lib/services';

// ── Keys ───────────────────────────────────────────────────────────────────
export const ecommerceKeys = {
  customerOrders: {
    all: ['customerOrders'],
    lists: () => [...ecommerceKeys.customerOrders.all, 'list'],
    details: () => [...ecommerceKeys.customerOrders.all, 'detail'],
    detail: (id) => [...ecommerceKeys.customerOrders.details(), id],
  },
  inventory: {
    all: ['inventory'],
    lists: () => [...ecommerceKeys.inventory.all, 'list'],
    details: () => [...ecommerceKeys.inventory.all, 'detail'],
    detail: (id) => [...ecommerceKeys.inventory.details(), id],
  },
  pricing: {
    all: ['pricing'],
    lists: () => [...ecommerceKeys.pricing.all, 'list'],
    details: () => [...ecommerceKeys.pricing.all, 'detail'],
    detail: (id) => [...ecommerceKeys.pricing.details(), id],
  },
  fulfillment: {
    all: ['fulfillment'],
    list: (params) => [...ecommerceKeys.fulfillment.all, 'list', params ?? {}],
    detail: (id) => [...ecommerceKeys.fulfillment.all, 'detail', id],
  },
  payment: (orderId) => ['customerOrders', 'payment', orderId],
  reprice: (params) => ['pricing', 'reprice', params ?? {}],
  invoice: {
    all: ['invoice'],
    lists: () => [...ecommerceKeys.invoice.all, 'list'],
    details: () => [...ecommerceKeys.invoice.all, 'detail'],
    detail: (id) => [...ecommerceKeys.invoice.details(), id],
  },
};

// ── Customer Orders ───────────────────────────────────────────────────────────
export const useCustomerOrders = (opts = {}) => useQuery({
  queryKey: ecommerceKeys.customerOrders.lists(),
  queryFn: async () => {
    const response = await getCustomerOrdersAction();
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useCustomerOrder = (id, opts = {}) => useQuery({
  queryKey: ecommerceKeys.customerOrders.detail(id),
  queryFn: async () => {
    const response = await getCustomerOrderAction(id);
    if (!response.code) throw response;
    return response.result;
  },
  enabled: Boolean(id),
  ...opts,
});

/** Throw a failed action envelope (so react-query sees an error); else its result. */
const resultOf = (action) => async (...args) => {
  const response = await action(...args);
  if (!response.code) throw response;
  return response.result;
};

// Staff read of a purchase (orders:view).
export const useCustomerOrderForStaff = (id, opts = {}) => useQuery({
  queryKey: [...ecommerceKeys.customerOrders.detail(id), 'staff'],
  queryFn: () => resultOf(getCustomerOrderForStaffAction)(id),
  enabled: Boolean(id),
  ...opts,
});

export const useOrderPayment = (orderId, opts = {}) => useQuery({
  queryKey: ecommerceKeys.payment(orderId),
  queryFn: () => resultOf(getOrderPaymentAction)(orderId),
  enabled: Boolean(orderId),
  ...opts,
});

export const useRetryOrderPaymentMutation = (opts = {}) => useApiMutation({
  mutationFn: resultOf(retryOrderPaymentAction),
  invalidate: [ecommerceKeys.customerOrders.all],
  ...opts,
});

// ── Fulfillment lines (staff / retailers) ─────────────────────────────────────
export const useFulfillmentOrders = (params, opts = {}) => useQuery({
  queryKey: ecommerceKeys.fulfillment.list(params),
  queryFn: () => resultOf(getFulfillmentOrdersAction)(params),
  ...opts,
});

export const useFulfillmentOrder = (id, opts = {}) => useQuery({
  queryKey: ecommerceKeys.fulfillment.detail(id),
  queryFn: () => resultOf(getFulfillmentOrderAction)(id),
  enabled: Boolean(id),
  ...opts,
});

/** mutate({ id, data: { status, ... } }) — moves a fulfillment line along its state machine. */
export const useUpdateFulfillmentStatusMutation = (opts = {}) => useApiMutation({
  mutationFn: ({ id, data }) => resultOf(updateFulfillmentStatusAction)(id, data),
  invalidate: [ecommerceKeys.fulfillment.all, ecommerceKeys.customerOrders.all],
  ...opts,
});

export const useViewCustomerInvoiceMutation = (opts = {}) => useApiMutation({
  mutationFn: resultOf(viewCustomerInvoiceAction),
  ...opts,
});

export const useDownloadCustomerInvoiceMutation = (opts = {}) => useApiMutation({
  mutationFn: resultOf(downloadCustomerInvoiceAction),
  ...opts,
});

// ── Checkout (buyer) ──────────────────────────────────────────────────────────
// Unwrapped: resolves to the response body, rejects with an Error whose
// message is the server's, so the checkout page can show it as-is.
const unwrap = (response) => {
  if (!response.code) {
    throw Object.assign(new Error(response.error || 'Request failed'), {
      status: response.status,
      details: response.details,
    });
  }
  return response.result;
};

export const usePreviewCheckoutMutation = (opts = {}) => useApiMutation({
  mutationFn: async (shippingAddress) => unwrap(await previewCheckoutAction(shippingAddress)),
  ...opts,
});

export const useCreateCustomerOrderMutation = (opts = {}) => useApiMutation({
  mutationFn: async (args) => unwrap(await createCustomerOrderAction(args)),
  invalidate: [ecommerceKeys.customerOrders.all],
  ...opts,
});

export const useCreateOrderPaymentMutation = (opts = {}) => useApiMutation({
  mutationFn: async (args) => unwrap(await createOrderPaymentAction(args)),
  ...opts,
});

export const useCancelCustomerOrderMutation = (opts = {}) => useApiMutation({
  mutationFn: async (args) => unwrap(await cancelCustomerOrderAction(args)),
  invalidate: [ecommerceKeys.customerOrders.all],
  ...opts,
});

export const useVerifyCustomerPaymentMutation = (opts = {}) => useApiMutation({
  mutationFn: async (args) => unwrap(await verifyCustomerPaymentAction(args)),
  invalidate: [ecommerceKeys.customerOrders.all],
  ...opts,
});

// ── Inventory ─────────────────────────────────────────────────────────────────
export const useInventory = (params, opts = {}) => useQuery({
  queryKey: [...ecommerceKeys.inventory.lists(), params ?? {}],
  queryFn: () => resultOf(getInventoryAction)(params),
  ...opts,
});

export const useProductInventory = (productId, opts = {}) => useQuery({
  queryKey: ecommerceKeys.inventory.detail(productId),
  queryFn: () => resultOf(getProductInventoryAction)(productId),
  enabled: Boolean(productId),
  ...opts,
});

export const useCreateInventoryMutation = (opts = {}) => useApiMutation({
  mutationFn: resultOf(createInventoryAction),
  invalidate: [ecommerceKeys.inventory.all],
  ...opts,
});

/** mutate({ id, data: { qty, reason? } }) — `id` is the stock record's id. */
export const useUpdateProductInventory = (opts = {}) => useApiMutation({
  mutationFn: ({ id, data }) => resultOf(updateProductInventoryAction)(id, data),
  invalidate: [ecommerceKeys.inventory.all],
  ...opts,
});

/** mutate({ id, data: { new_cost_price } }). */
export const useUpdateInventoryCostMutation = (opts = {}) => useApiMutation({
  mutationFn: ({ id, data }) => resultOf(updateInventoryCostAction)(id, data),
  invalidate: [ecommerceKeys.inventory.all, ecommerceKeys.pricing.all],
  ...opts,
});

export const useMarkInventoryReviewedMutation = (opts = {}) => useApiMutation({
  mutationFn: resultOf(markInventoryReviewedAction),
  invalidate: [ecommerceKeys.inventory.all],
  ...opts,
});

// ── Pricing ───────────────────────────────────────────────────────────────────
/** The discount-safety table (one row per product). */
export const usePricing = (params, opts = {}) => useQuery({
  queryKey: [...ecommerceKeys.pricing.lists(), params ?? {}],
  queryFn: () => resultOf(getPricingAction)(params),
  ...opts,
});

export const useRepriceRequests = (params, opts = {}) => useQuery({
  queryKey: ecommerceKeys.reprice(params),
  queryFn: () => resultOf(getRepriceRequestsAction)(params),
  ...opts,
});

/** mutate({ productId, data }) — proposes a new price; a super admin approves it. */
export const useProposeRepriceMutation = (opts = {}) => useApiMutation({
  mutationFn: ({ productId, data }) => resultOf(proposeRepriceAction)(productId, data),
  invalidate: [ecommerceKeys.pricing.all],
  ...opts,
});

export const useApproveRepriceMutation = (opts = {}) => useApiMutation({
  mutationFn: ({ id, data }) => resultOf(approveRepriceAction)(id, data),
  invalidate: [ecommerceKeys.pricing.all],
  ...opts,
});

export const useRejectRepriceMutation = (opts = {}) => useApiMutation({
  mutationFn: ({ id, data }) => resultOf(rejectRepriceAction)(id, data),
  invalidate: [ecommerceKeys.pricing.all],
  ...opts,
});

// ── Invoices ──────────────────────────────────────────────────────────────────
export const useInvoices = (params, opts = {}) => useQuery({
  queryKey: [...ecommerceKeys.invoice.lists(), params ?? {}],
  queryFn: () => resultOf(getInvoicesAction)(params),
  ...opts,
});

export const useInvoice = (id, opts = {}) => useQuery({
  queryKey: ecommerceKeys.invoice.detail(id),
  queryFn: () => resultOf(getInvoiceAction)(id),
  enabled: Boolean(id),
  ...opts,
});

export const useInvoiceEway = (id, opts = {}) => useQuery({
  queryKey: [...ecommerceKeys.invoice.detail(id), 'eway'],
  queryFn: () => resultOf(getInvoiceEwayAction)(id),
  enabled: Boolean(id),
  ...opts,
});

/** mutate({ order_ids, gst_rate? }) — raises a retailer invoice over fulfillment lines. */
export const useRaiseInvoiceMutation = (opts = {}) => useApiMutation({
  mutationFn: resultOf(raiseInvoiceAction),
  invalidate: [ecommerceKeys.invoice.all, ecommerceKeys.fulfillment.all],
  ...opts,
});

export const useSettleInvoiceMutation = (opts = {}) => useApiMutation({
  mutationFn: ({ id, data }) => resultOf(settleInvoiceAction)(id, data),
  invalidate: [ecommerceKeys.invoice.all],
  ...opts,
});

/** mutate({ id, data: { note } }). */
export const useDisputeInvoiceMutation = (opts = {}) => useApiMutation({
  mutationFn: ({ id, data }) => resultOf(disputeInvoiceAction)(id, data),
  invalidate: [ecommerceKeys.invoice.all],
  ...opts,
});

export const useRetryInvoiceEwayMutation = (opts = {}) => useApiMutation({
  mutationFn: resultOf(retryInvoiceEwayAction),
  invalidate: [ecommerceKeys.invoice.all],
  ...opts,
});

export const useViewInvoiceMutation = (opts = {}) => useApiMutation({
  mutationFn: resultOf(viewInvoiceAction),
  ...opts,
});

export const useDownloadInvoice = (opts = {}) => useApiMutation({
  mutationFn: resultOf(downloadInvoiceAction),
  ...opts,
});
