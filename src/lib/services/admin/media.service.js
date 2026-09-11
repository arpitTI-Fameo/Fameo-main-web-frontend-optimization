import { adminFetch } from './core';

export const getMedia = () => adminFetch("/admin/media");

// The picker reads the whole library in one go. Kept as its own function
// because the URL differs from getMedia() above — preserving the exact request
// the component made before the restructure.
export const getMediaLibrary = (limit = 200) => adminFetch(`/media?limit=${limit}`);

export const uploadMedia = (form) => adminFetch("/media/upload", { method: 'POST', body: form });

export const deleteMediaItem = (id) => adminFetch(`/media/${id}`, { method: 'DELETE' });
