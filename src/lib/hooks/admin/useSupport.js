import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getAdminSupportTicketsAction, getAdminSupportFaqsAction, replyAdminSupportTicketAction, updateAdminSupportTicketStatusAction, createAdminSupportFaqAction } from '@/lib/services/admin/support.service';
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
