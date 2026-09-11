'use client';

import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { orderKeys } from '@/lib/services/order/order.keys';
import {
  createRazorpayOrder, getOrder, getOrders, getTrackOrder, placeCOD, verifyPayment,
} from '@/lib/services/order/order.client';

export const useOrders = (params = {}, opts = {}) => useQuery({
  queryKey: orderKeys.list(params),
  queryFn: () => getOrders(params),
  staleTime: 60_000,
  ...opts,
});

export const useOrder = (id, opts = {}) => useQuery({
  queryKey: orderKeys.detail(id),
  queryFn: () => getOrder(id),
  enabled: Boolean(id),
  ...opts,
});

export const useTrackOrder = (id, opts = {}) => useQuery({
  queryKey: orderKeys.track(id),
  queryFn: () => getTrackOrder(id),
  enabled: Boolean(id),
  ...opts,
});

export const useCreateRazorpayOrderMutation = (opts = {}) => useApiMutation({
  mutationFn: createRazorpayOrder,
  ...opts,
});

export const useVerifyPaymentMutation = (opts = {}) => useApiMutation({
  mutationFn: verifyPayment,
  invalidate: [orderKeys.lists()],
  ...opts,
});

export const usePlaceCODMutation = (opts = {}) => useApiMutation({
  mutationFn: placeCOD,
  invalidate: [orderKeys.lists()],
  ...opts,
});
