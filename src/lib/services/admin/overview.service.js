import { adminFetch } from './core';

export const getAdminStats = () => adminFetch("/admin/stats");

export const getAdminActivity = (limit) => adminFetch(`/admin/activity?limit=${limit}`);

export const getAdminSettings = () => adminFetch("/admin/settings");

export const updateAdminFeatureFlag = (flags) => adminFetch("/admin/settings/features", { method: 'PATCH', body: JSON.stringify(flags), headers: { "Content-Type": "application/json" } });
