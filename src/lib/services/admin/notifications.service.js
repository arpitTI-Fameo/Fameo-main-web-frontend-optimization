import { adminFetch } from './core';

export const getNotifications = () => adminFetch("/admin/notifications");

export const sendNotification = (form) => adminFetch("/notifications", { method: 'POST', body: JSON.stringify(form), headers: { "Content-Type": "application/json" } });
