import { adminFetch } from './core';

export const getAdminSupportTickets = (status) => adminFetch(`/admin/support/tickets?status=${status}`);

export const getAdminSupportFaqs = () => adminFetch("/admin/support/faqs");

export const replyAdminSupportTicket = (id, form) => adminFetch(`/admin/support/tickets/${id}/reply`, { method: 'POST', body: JSON.stringify(form), headers: { "Content-Type": "application/json" } });

export const updateAdminSupportTicketStatus = (id, status) => adminFetch(`/admin/support/tickets/${id}`, { method: 'PATCH', body: JSON.stringify({status}), headers: { "Content-Type": "application/json" } });

export const createAdminSupportFaq = (form) => adminFetch("/admin/support/faqs", { method: 'POST', body: JSON.stringify(form), headers: { "Content-Type": "application/json" } });
