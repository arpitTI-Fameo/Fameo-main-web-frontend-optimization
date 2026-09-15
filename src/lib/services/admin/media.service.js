import { adminEndpoints } from '@/lib/api/endpoints';
import { createAdminAction } from '@/lib/services/admin/core';
import { adminFetch } from './core';

export const getMediaAction = async () => {
  return createAdminAction({
    url: adminEndpoints.mediaList(),
    method: 'GET',
  });
};

// The picker reads the whole library in one go. Kept as its own function
// because the URL differs from getMedia() above — preserving the exact request
// the component made before the restructure.
export const getMediaLibraryAction = async (limit = 200) => {
  return createAdminAction({
    url: adminEndpoints.mediaListPagination(limit),
    method: 'GET',
  });
};

export const uploadMediaAction = async (form) => {
  return createAdminAction({
    url: adminEndpoints.mediaUpload(),
    method: 'POST',
    body: form,
  });
};

export const deleteMediaItemAction = async (id) => {
  return createAdminAction({
    url: adminEndpoints.media(id),
    method: 'DELETE',
  });
};
