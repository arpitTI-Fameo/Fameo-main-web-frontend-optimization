import { adminEndpoints } from '@/lib/api/endpoints';
import { createAdminAction } from '@/lib/services/admin/core';
import { adminFetch } from './core';

export const getAdminStatsAction = async () => {
  return createAdminAction({
    url: adminEndpoints.stats(),
    method: 'GET',
  });
};

export const getAdminActivityAction = async (limit) => {
  return createAdminAction({
    url: adminEndpoints.activity(limit),
    method: 'GET',
  });
};

export const getAdminSettingsAction = async () => {
  return createAdminAction({
    url: adminEndpoints.settings(),
    method: 'GET',
  });
};

export const updateAdminFeatureFlagAction = async (flags) => {
  return createAdminAction({
    url: adminEndpoints.settingsFeatures(),
    method: 'PATCH',
    body: flags,
  });
};
