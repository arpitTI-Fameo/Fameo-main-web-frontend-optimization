import { adminEndpoints } from '@/lib/api/endpoints';
import { createAdminAction } from '@/lib/services/admin/core';
import { adminFetch } from './core';

export const getAdminSupportTicketsAction = async (status) => {
  return createAdminAction({
    url: adminEndpoints.supportTickets(status),
    method: 'GET',
  });
};

export const getAdminSupportFaqsAction = async () => {
  return createAdminAction({
    url: adminEndpoints.supportFaqs(),
    method: 'GET',
  });
};

export const replyAdminSupportTicketAction = async (id, form) => {
  return createAdminAction({
    url: adminEndpoints.supportTicketReply(id),
    method: 'POST',
    body: form,
  });
};

export const updateAdminSupportTicketStatusAction = async (id, status) => {
  return createAdminAction({
    url: adminEndpoints.supportTicket(id),
    method: 'PATCH',
    body: { status },
  });
};

export const createAdminSupportFaqAction = async (form) => {
  return createAdminAction({
    url: adminEndpoints.supportFaqs(),
    method: 'POST',
    body: form,
  });
};
