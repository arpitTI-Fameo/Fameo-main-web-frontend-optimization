import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getAdminApprovals, reviewAdminApproval } from '@/lib/services/admin/approvals.service';

export const useAdminApprovals = (status, opts = {}) => useQuery({
    queryKey: ['admin', 'approvals', { status }],
    queryFn: () => getAdminApprovals(status),
    ...opts
});

export const useReviewApprovalMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, form }) => reviewAdminApproval(id, form),
        ...opts
    });
    return { ...mutation, reviewApproval: mutation.mutateAsync };
};
