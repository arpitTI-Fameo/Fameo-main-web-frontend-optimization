'use client';
// services/order/order.client.js
// The order service: every order HTTP call in one place.
//
// Layering is component -> hook -> service -> request. These calls used to be
// inlined in lib/hooks/main/useOrder.js, so the hook layer talked to the transport
// directly and skipped this one. The request expressions are unchanged.

import { clientFetch } from '@/lib/api/client/fetcher';
import { orderEndpoints } from '@/lib/api/endpoints';

export const getOrders = (params) =>
  clientFetch(orderEndpoints.getAll(), { params });

export const getOrder = (id) =>
  clientFetch(orderEndpoints.getOne(id));

export const getTrackOrder = (id) =>
  clientFetch(orderEndpoints.track(id));

export const createRazorpayOrder = (data) =>
  clientFetch(orderEndpoints.createRazorpayOrder(), { method: 'POST', body: JSON.stringify(data) });

export const verifyPayment = (data) =>
  clientFetch(orderEndpoints.verifyPayment(), { method: 'POST', body: JSON.stringify(data) });

export const placeCOD = (data) =>
  clientFetch(orderEndpoints.placeCOD(), { method: 'POST', body: JSON.stringify(data) });
