'use client';
import { createServerAction } from '@/lib/api/action';
// services/notification/notification.client.js
// The notification service: every notification HTTP call in one place.
//
// Layering is component -> hook -> service -> request. These calls used to be
// inlined in lib/hooks/main/useNotification.js, so the hook layer talked to the transport
// directly and skipped this one. The request expressions are unchanged.

import { clientFetch } from '@/lib/api/client/fetcher';
import { notificationEndpoints } from '@/lib/api/endpoints';

export const getNotificationsAction = async () => {
  return createServerAction({
    url: notificationEndpoints.getAll(),
    method: 'GET',
  });
};

export const readAllNotificationsAction = async () => {
  return createServerAction({
    url: notificationEndpoints.readAll(),
    method: 'POST',
  });
};

export const readNotificationAction = async (id) => {
  return createServerAction({
    url: notificationEndpoints.readOne(id),
    method: 'POST',
  });
};
