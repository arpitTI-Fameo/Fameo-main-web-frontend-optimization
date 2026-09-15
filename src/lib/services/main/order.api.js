
import { createServerAction } from '@/lib/api/action';
// services/order/order.client.js
// The order service: every order HTTP call in one place.
//
// Layering is component -> hook -> service -> request. These calls used to be
// inlined in lib/hooks/main/useOrder.js, so the hook layer talked to the transport
// directly and skipped this one. The request expressions are unchanged.

import { clientFetch } from '@/lib/api/client/fetcher';
import { orderEndpoints } from '@/lib/api/endpoints';

export const getOrdersAction = async (params) => {
  return createServerAction({
    url: orderEndpoints.getAll(),
    method: 'GET',
  });
};

export const getOrderAction = async (id) => {
  return createServerAction({
    url: orderEndpoints.getOne(id),
    method: 'GET',
  });
};

export const getTrackOrderAction = async (id) => {
  return createServerAction({
    url: orderEndpoints.track(id),
    method: 'GET',
  });
};

export const createRazorpayOrderAction = async (data) => {
  return createServerAction({
    url: orderEndpoints.createRazorpayOrder(),
    method: 'POST',
    body: data,
  });
};

export const verifyPaymentAction = async (data) => {
  return createServerAction({
    url: orderEndpoints.verifyPayment(),
    method: 'POST',
    body: data,
  });
};

export const placeCODAction = async (data) => {
  return createServerAction({
    url: orderEndpoints.placeCOD(),
    method: 'POST',
    body: data,
  });
};
