import { adminEndpoints } from '@/lib/api/endpoints';
import { createAdminAction } from '@/lib/services/admin/core';
import { adminFetch } from './core';

export const getAdminRevenueAction = async () => {
  return createAdminAction({
    url: adminEndpoints.revenue(),
    method: 'GET',
  });
};
