import { useQuery } from '@tanstack/react-query';
import { getAdminRevenueAction } from '@/lib/services/admin/revenue.service';

export const useAdminRevenue = (opts = {}) => useQuery({
    queryKey: ['admin', 'revenue'],
    queryFn: getAdminRevenueAction,
    ...opts
});
