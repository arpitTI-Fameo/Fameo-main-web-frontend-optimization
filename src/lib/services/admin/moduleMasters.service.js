import { adminFetch } from './core';

export const getModuleMasters = () => adminFetch("/admin/module-masters");

export const inviteModuleMaster = (form) => adminFetch("/admin/module-masters", { method: 'POST', body: JSON.stringify(form), headers: { "Content-Type": "application/json" } });

export const updateModuleMasterModules = (id, moduleIds) => adminFetch(`/admin/module-masters/${id}/modules`, { method: 'PATCH', body: JSON.stringify({moduleIds}), headers: { "Content-Type": "application/json" } });

export const revokeModuleMaster = (id) => adminFetch(`/admin/module-masters/${id}`, { method: 'DELETE' });
