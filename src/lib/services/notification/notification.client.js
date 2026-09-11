'use client';
// services/notification/notification.client.js
// The notification service: every notification HTTP call in one place.
//
// Layering is component -> hook -> service -> request. These calls used to be
// inlined in lib/hooks/main/useNotification.js, so the hook layer talked to the transport
// directly and skipped this one. The request expressions are unchanged.

import { clientFetch } from '@/lib/api/client/fetcher';
import { notificationEndpoints } from '@/lib/api/endpoints';

export const getNotifications = () =>
  clientFetch(notificationEndpoints.getAll());

export const readAllNotifications = () =>
  clientFetch(notificationEndpoints.readAll(), { method: 'POST' });

export const readNotification = (id) =>
  clientFetch(notificationEndpoints.readOne(id), { method: 'POST' });
