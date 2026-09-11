import { adminFetch } from './core';

export const getArchive = () => adminFetch("/admin/archive");

export const restoreArchiveItem = (id) => adminFetch(`/admin/archive/${id}/restore`, { method: 'PATCH' });

export const deleteContent = (id) => adminFetch(`/admin/content/${id}`, { method: 'DELETE' });
