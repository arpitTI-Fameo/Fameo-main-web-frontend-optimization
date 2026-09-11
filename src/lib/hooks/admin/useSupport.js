import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getAdminSupportTickets, getAdminSupportFaqs, replyAdminSupportTicket, updateAdminSupportTicketStatus, createAdminSupportFaq } from '@/lib/services/admin/support.service';

export const useAdminSupportTickets = (status, opts = {}) => useQuery({
    queryKey: ['admin', 'support', 'tickets', { status }],
    queryFn: () => getAdminSupportTickets(status),
    ...opts
});

export const useAdminSupportFaqs = (opts = {}) => useQuery({
    queryKey: ['admin', 'support', 'faqs'],
    queryFn: getAdminSupportFaqs,
    ...opts
});

export const useReplySupportTicketMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, message }) => replyAdminSupportTicket(id, { message }),
        ...opts
    });
    return { ...mutation, reply: mutation.mutateAsync };
};

export const useUpdateSupportTicketStatusMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, status }) => updateAdminSupportTicketStatus(id, status),
        ...opts
    });
    return { ...mutation, updateStatus: mutation.mutateAsync };
};

export const useCreateSupportFaqMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: createAdminSupportFaq,
        ...opts
    });
    return { ...mutation, addFaq: mutation.mutateAsync };
};
