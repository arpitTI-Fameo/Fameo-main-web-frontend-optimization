import { adminEndpoints } from '@/lib/api/endpoints';
import { createAdminAction } from '@/lib/services/admin/core';
import { adminFetch } from './core';

export const getAdminContentAction = async (params) => {
  return createAdminAction({
    url: adminEndpoints.contentList(params),
    method: 'GET',
  });
};

export const updateAdminContentStatusAction = async (id, status) => {
  return createAdminAction({
    url: adminEndpoints.contentStatus(id),
    method: 'PATCH',
    body: { status },
  });
};

export const deleteAdminContentAction = async (id) => {
  return createAdminAction({
    url: adminEndpoints.content(id),
    method: 'DELETE',
  });
};

export const getAdminContentByIdAction = async (id) => {
  return createAdminAction({
    url: adminEndpoints.content(id),
    method: 'GET',
  });
};

export const createAdminContentAction = async (form) => {
  return createAdminAction({
    url: adminEndpoints.contentCreate(),
    method: 'POST',
    body: form,
  });
};

export const updateAdminContentAction = async (id, form) => {
  return createAdminAction({
    url: adminEndpoints.content(id),
    method: 'PUT',
    body: form,
  });
};
