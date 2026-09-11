import { adminFetch } from './core';

export const getAnalyticsOverview = () => adminFetch("/admin/analytics/overview");

export const getAnalyticsTopics = () => adminFetch("/admin/analytics/topics");
