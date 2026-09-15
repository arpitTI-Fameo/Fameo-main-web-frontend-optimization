import { createAdminAction } from '@/lib/services/admin/core';
import { adminFetch } from './core';

export const getAdminContacts = (search, roleFilter) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (roleFilter !== "all") params.set("role", roleFilter);
    return adminFetch(`/admin/contacts?${params.toString()}`);
};
