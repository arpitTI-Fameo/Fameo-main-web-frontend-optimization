import { adminEndpoints } from '@/lib/api/endpoints';
import { createAdminAction } from '@/lib/services/admin/core';
import { adminFetch } from './core';

export const getAnalyticsOverviewAction = async () => {
  return createAdminAction({
    url: adminEndpoints.analyticsOverview(),
    method: 'GET',
  });
};

export const getAnalyticsTopicsAction = async () => {
  return createAdminAction({
    url: adminEndpoints.analyticsTopics(),
    method: 'GET',
  });
};
