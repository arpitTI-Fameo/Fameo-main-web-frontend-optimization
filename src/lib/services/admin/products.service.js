import { adminFetch } from './core';

export const getAdminProducts = () => adminFetch("/admin/products");

export const createAdminProduct = (form) => adminFetch("/admin/products", { method: 'POST', body: JSON.stringify(form), headers: { "Content-Type": "application/json" } });

export const updateAdminProduct = (id, form) => adminFetch(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(form), headers: { "Content-Type": "application/json" } });

export const updateProductStatus = (id, status) => adminFetch(`/admin/products/${id}/status`, { method: 'PATCH', body: JSON.stringify({status}), headers: { "Content-Type": "application/json" } });
