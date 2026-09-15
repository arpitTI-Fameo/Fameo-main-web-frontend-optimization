import { adminEndpoints } from '@/lib/api/endpoints';
import { createAdminAction } from '@/lib/services/admin/core';
import { adminFetch } from './core';

export const getNotificationsAction = async () => {
  return createAdminAction({
    url: adminEndpoints.notificationsAdmin(),
    method: 'GET',
  });
};

export const sendNotificationAction = async (form) => {
  return createAdminAction({
    url: adminEndpoints.notifications(),
    method: 'POST',
    body: form,
  });
};
