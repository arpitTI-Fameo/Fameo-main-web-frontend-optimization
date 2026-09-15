import { adminEndpoints } from '@/lib/api/endpoints';
import { createAdminAction } from '@/lib/services/admin/core';
import { adminFetch } from './core';

export const getAdminApprovalsAction = async (status) => {
  return createAdminAction({
    url: adminEndpoints.approvalsList(status),
    method: 'GET',
  });
};

export const reviewAdminApprovalAction = async (id, form) => {
  return createAdminAction({
    url: adminEndpoints.approval(id),
    method: 'PATCH',
    body: form,
  });
};
