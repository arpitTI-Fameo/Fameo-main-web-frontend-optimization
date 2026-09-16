import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getNotificationsAction, sendNotificationAction } from '@/lib/services/admin/notifications.service';
import { adminKeys } from '@/lib/services/admin/admin.keys';

export const useAdminNotifications = (opts = {}) => useQuery({
    queryKey: adminKeys.notifications(),
    queryFn: getNotificationsAction,
    ...opts
});

export const useSendNotificationMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: sendNotificationAction,
        ...opts
    });
    return { ...mutation, sendNotificationAction: mutation.mutateAsync };
};
