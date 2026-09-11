import { adminFetch } from './core';

export const getAdminApprovals = (status) => adminFetch(`/admin/approvals?status=${status}`);

export const reviewAdminApproval = (id, form) => adminFetch(`/admin/approvals/${id}`, { method: 'PATCH', body: JSON.stringify(form), headers: { "Content-Type": "application/json" } });
