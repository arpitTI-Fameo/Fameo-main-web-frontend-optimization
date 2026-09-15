import { adminEndpoints } from '@/lib/api/endpoints';
import { createAdminAction } from '@/lib/services/admin/core';
import { adminFetch } from './core';

export const getArchiveAction = async () => {
  return createAdminAction({
    url: adminEndpoints.archiveList(),
    method: 'GET',
  });
};

export const restoreArchiveItemAction = async (id) => {
  return createAdminAction({
    url: adminEndpoints.archiveRestore(id),
    method: 'PATCH',
  });
};

export const deleteContentAction = async (id) => {
  return createAdminAction({
    url: adminEndpoints.content(id),
    method: 'DELETE',
  });
};
