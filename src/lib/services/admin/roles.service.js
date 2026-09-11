import { adminFetch } from './core';

export const getAdminRoleUsers = () => adminFetch("/admin/roles/users");

export const updateAdminRole = (id, role) => adminFetch(`/admin/roles/${id}`, { method: 'PATCH', body: JSON.stringify({role}), headers: { "Content-Type": "application/json" } });

export const toggleAdminRoleAccess = (id, isActive) => adminFetch(`/admin/roles/${id}/access`, { method: 'PATCH', body: JSON.stringify({isActive}), headers: { "Content-Type": "application/json" } });

export const deleteAdminRoleUser = (id) => adminFetch(`/admin/roles/${id}`, { method: 'DELETE' });

export const updateAdminRolePassword = (id, password) => adminFetch(`/admin/roles/${id}/password`, { method: 'PATCH', body: JSON.stringify({password}), headers: { "Content-Type": "application/json" } });

export const createAdminRoleUser = (form) => adminFetch("/admin/roles/create-user", { method: 'POST', body: JSON.stringify(form), headers: { "Content-Type": "application/json" } });
