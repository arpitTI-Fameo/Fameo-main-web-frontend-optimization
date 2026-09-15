import { adminEndpoints } from '@/lib/api/endpoints';
import { createAdminAction } from '@/lib/services/admin/core';
import { adminFetch } from './core';

export const getAdminProductsAction = async () => {
  return createAdminAction({
    url: adminEndpoints.productsList(),
    method: 'GET',
  });
};

export const createAdminProductAction = async (form) => {
  return createAdminAction({
    url: adminEndpoints.productsList(),
    method: 'POST',
    body: form,
  });
};

export const updateAdminProductAction = async (id, form) => {
  return createAdminAction({
    url: adminEndpoints.product(id),
    method: 'PUT',
    body: form,
  });
};

export const updateProductStatusAction = async (id, status) => {
  return createAdminAction({
    url: adminEndpoints.productStatus(id),
    method: 'PATCH',
    body: { status },
  });
};
