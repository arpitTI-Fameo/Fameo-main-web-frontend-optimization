import { adminFetch } from './core';

export const getAdminContent = (params) => adminFetch(`/admin/content?${params}`);

export const updateAdminContentStatus = (id, status) => adminFetch(`/admin/content/${id}/status`, { method: 'PATCH', body: JSON.stringify({status}), headers: { "Content-Type": "application/json" } });

export const deleteAdminContent = (id) => adminFetch(`/admin/content/${id}`, { method: 'DELETE' });

export const getAdminContentById = (id) => adminFetch(`/admin/content/${id}`);

export const createAdminContent = (form) => adminFetch(`/admin/content`, { method: 'POST', body: JSON.stringify(form), headers: { "Content-Type": "application/json" } });

export const updateAdminContent = (id, form) => adminFetch(`/admin/content/${id}`, { method: 'PUT', body: JSON.stringify(form), headers: { "Content-Type": "application/json" } });
