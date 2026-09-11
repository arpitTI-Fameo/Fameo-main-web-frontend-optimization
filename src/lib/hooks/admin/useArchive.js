import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getArchive, restoreArchiveItem, deleteContent } from '@/lib/services/admin/archive.service';

export const useAdminArchive = (opts = {}) => useQuery({
    queryKey: ['admin', 'archive'],
    queryFn: getArchive,
    ...opts
});

export const useRestoreArchiveMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: restoreArchiveItem,
        ...opts
    });
    return { ...mutation, restore: mutation.mutateAsync };
};

export const useDeleteContentMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: deleteContent,
        ...opts
    });
    return { ...mutation, remove: mutation.mutateAsync };
};
