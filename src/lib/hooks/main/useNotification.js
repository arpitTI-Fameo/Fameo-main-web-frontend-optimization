'use client';

import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { notificationKeys } from '@/lib/services/notification/notification.keys';
import {
  getNotifications, readAllNotifications, readNotification,
} from '@/lib/services/notification/notification.client';

export const useNotifications = (opts = {}) => useQuery({
  queryKey: notificationKeys.lists(),
  queryFn: getNotifications,
  ...opts,
});

export const useReadAllNotificationsMutation = (opts = {}) => useApiMutation({
  mutationFn: readAllNotifications,
  invalidate: [notificationKeys.lists()],
  ...opts,
});

export const useReadNotificationMutation = (opts = {}) => useApiMutation({
  mutationFn: readNotification,
  invalidate: [notificationKeys.lists()],
  ...opts,
});
