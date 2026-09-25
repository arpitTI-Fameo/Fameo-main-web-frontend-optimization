import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getAdminSupportTicketsAction, getAdminSupportFaqsAction, replyAdminSupportTicketAction, updateAdminSupportTicketStatusAction, createAdminSupportFaqAction, getAdminSupportTicketAction, createAdminSupportTicketAction, deleteAdminSupportFaqAction } from '@/lib/services/admin/support.service';
import { adminKeys } from '@/lib/services/admin/admin.keys';

export const useAdminSupportTickets = (status, opts = {}) => useQuery({
    queryKey: adminKeys.supportTickets(status),
    queryFn: () => getAdminSupportTicketsAction(status),
    ...opts
});

export const useAdminSupportFaqs = (opts = {}) => useQuery({
    queryKey: adminKeys.supportFaqs(),
    queryFn: getAdminSupportFaqsAction,
    ...opts
});

export const useReplySupportTicketMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, message }) => replyAdminSupportTicketAction(id, { message }),
        ...opts
    });
    return { ...mutation, reply: mutation.mutateAsync };
};

export const useUpdateSupportTicketStatusMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, status }) => updateAdminSupportTicketStatusAction(id, status),
        ...opts
    });
    return { ...mutation, updateStatus: mutation.mutateAsync };
};

export const useCreateSupportFaqMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: createAdminSupportFaqAction,
        ...opts
    });
    return { ...mutation, addFaq: mutation.mutateAsync };
};

export const useAdminSupportTicket = (id, opts = {}) => useQuery({
    queryKey: [...adminKeys.support(), 'ticket', id],
    queryFn: () => getAdminSupportTicketAction(id),
    enabled: Boolean(id),
    ...opts
});

export const useCreateSupportTicketMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: createAdminSupportTicketAction,
        invalidate: [adminKeys.support()],
        ...opts
    });
    return { ...mutation, createTicket: mutation.mutateAsync };
};

export const useDeleteSupportFaqMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: deleteAdminSupportFaqAction,
        invalidate: [adminKeys.supportFaqs()],
        ...opts
    });
    return { ...mutation, deleteFaq: mutation.mutateAsync };
};
