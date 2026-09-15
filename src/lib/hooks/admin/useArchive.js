import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getArchiveAction, restoreArchiveItemAction, deleteContentAction } from '@/lib/services/admin/archive.service';

export const useAdminArchive = (opts = {}) => useQuery({
    queryKey: ['admin', 'archive'],
    queryFn: getArchiveAction,
    ...opts
});

export const useRestoreArchiveMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: restoreArchiveItemAction,
        ...opts
    });
    return { ...mutation, restore: mutation.mutateAsync };
};

export const useDeleteContentMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: deleteContentAction,
        ...opts
    });
    return { ...mutation, remove: mutation.mutateAsync };
};
