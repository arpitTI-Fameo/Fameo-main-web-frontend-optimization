import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import {
  getOrdersAction,
  getOrderAction,
  getTrackOrderAction,
  createRazorpayOrderAction,
  verifyPaymentAction,
  placeCODAction
} from '@/lib/services';

// ── Keys ───────────────────────────────────────────────────────────────────
export const orderKeys = {
  all: () => ['order'],
  lists: () => [...orderKeys.all(), 'list'],
  list: (params) => [...orderKeys.lists(), params],
  details: () => [...orderKeys.all(), 'detail'],
  detail: (id) => [...orderKeys.details(), id],
  track: (id) => [...orderKeys.all(), 'track', id],
};

export const useOrders = (params = {}, opts = {}) => useQuery({

  queryKey: orderKeys.list(params),
  queryFn: async () => {
    const response = await getOrdersAction(params);
    if (!response.code) throw response;
    return response.result;
  },
  staleTime: 60_000,
  ...opts,
});

export const useOrder = (id, opts = {}) => useQuery({

  queryKey: orderKeys.detail(id),
  queryFn: async () => {
    const response = await getOrderAction(id);
    if (!response.code) throw response;
    return response.result;
  },
  enabled: Boolean(id),
  ...opts,
});

export const useTrackOrder = (id, opts = {}) => useQuery({

  queryKey: orderKeys.track(id),
  queryFn: async () => {
    const response = await getTrackOrderAction(id);
    if (!response.code) throw response;
    return response.result;
  },
  enabled: Boolean(id),
  ...opts,
});

export const useCreateRazorpayOrderMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await createRazorpayOrderAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useVerifyPaymentMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await verifyPaymentAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  invalidate: [orderKeys.lists()],
  ...opts,
});

export const usePlaceCODMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await placeCODAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  invalidate: [orderKeys.lists()],
  ...opts,
});
