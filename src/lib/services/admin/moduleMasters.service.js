import { adminEndpoints } from '@/lib/api/endpoints';
import { createAdminAction } from '@/lib/services/admin/core';
import { adminFetch } from './core';

export const getModuleMastersAction = async () => {
  return createAdminAction({
    url: adminEndpoints.moduleMastersList(),
    method: 'GET',
  });
};

export const inviteModuleMasterAction = async (form) => {
  return createAdminAction({
    url: adminEndpoints.moduleMastersList(),
    method: 'POST',
    body: form,
  });
};

export const updateModuleMasterModulesAction = async (id, moduleIds) => {
  return createAdminAction({
    url: adminEndpoints.moduleMasterModules(id),
    method: 'PATCH',
    body: { moduleIds },
  });
};

export const revokeModuleMasterAction = async (id) => {
  return createAdminAction({
    url: adminEndpoints.moduleMaster(id),
    method: 'DELETE',
  });
};
