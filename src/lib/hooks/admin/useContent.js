import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getAdminContentAction, updateAdminContentStatusAction, getAdminContentByIdAction, createAdminContentAction, updateAdminContentAction } from '@/lib/services/admin/content.service';
import { deleteContentAction } from '@/lib/services/admin/archive.service';
import { adminKeys } from '@/lib/services/admin/admin.keys';

export const useAdminContent = (params, opts = {}) => useQuery({
    queryKey: adminKeys.contentList(params.toString()),
    queryFn: () => getAdminContentAction(params),
    ...opts
});

export const useUpdateContentStatusMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, status }) => updateAdminContentStatusAction(id, status),
        ...opts
    });
    return { ...mutation, updateStatus: mutation.mutateAsync };
};

export const useDeleteContentMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: deleteContentAction,
        ...opts
    });
    return { ...mutation, remove: mutation.mutateAsync };
};

export const useAdminContentById = (id, opts = {}) => useQuery({
    queryKey: adminKeys.contentDetail(id),
    queryFn: () => getAdminContentByIdAction(id),
    ...opts
});

export const useSaveContentMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, isNew, form }) => isNew ? createAdminContentAction(form) : updateAdminContentAction(id, form),
        ...opts
    });
    return { ...mutation, saveContent: mutation.mutateAsync };
};
