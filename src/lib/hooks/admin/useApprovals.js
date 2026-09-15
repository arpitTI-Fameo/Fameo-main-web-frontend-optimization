import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getAdminApprovalsAction, reviewAdminApprovalAction } from '@/lib/services/admin/approvals.service';

export const useAdminApprovals = (status, opts = {}) => useQuery({
    queryKey: ['admin', 'approvals', { status }],
    queryFn: () => getAdminApprovalsAction(status),
    ...opts
});

export const useReviewApprovalMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, form }) => reviewAdminApprovalAction(id, form),
        ...opts
    });
    return { ...mutation, reviewApproval: mutation.mutateAsync };
};
