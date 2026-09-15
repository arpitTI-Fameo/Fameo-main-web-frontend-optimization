import { adminEndpoints } from '@/lib/api/endpoints';
import { createAdminAction } from '@/lib/services/admin/core';

export const getAdminRoleUsersAction = async () => {
  return createAdminAction({
    url: adminEndpoints.rolesUsers(),
    method: 'GET',
  });
};

export const updateAdminRoleAction = async (id, role) => {
  return createAdminAction({
    url: adminEndpoints.role(id),
    method: 'PATCH',
    body: { role },
  });
};

export const toggleAdminRoleAccessAction = async (id, isActive) => {
  return createAdminAction({
    url: adminEndpoints.roleAccess(id),
    method: 'PATCH',
    body: { isActive },
  });
};

export const deleteAdminRoleUserAction = async (id) => {
  return createAdminAction({
    url: adminEndpoints.role(id),
    method: 'DELETE',
  });
};

export const updateAdminRolePasswordAction = async (id, password) => {
  return createAdminAction({
    url: adminEndpoints.rolePassword(id),
    method: 'PATCH',
    body: {
      password,
    },
  });
};

export const createAdminRoleUserAction = async (form) => {
  return createAdminAction({
    url: adminEndpoints.roleCreateUser(),
    method: 'POST',
    body: form,
  });
};
