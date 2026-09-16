import { useQuery } from '@tanstack/react-query';
import { getAdminRevenueAction } from '@/lib/services/admin/revenue.service';
import { adminKeys } from '@/lib/services/admin/admin.keys';

export const useAdminRevenue = (opts = {}) => useQuery({
    queryKey: adminKeys.revenue(),
    queryFn: getAdminRevenueAction,
    ...opts
});
