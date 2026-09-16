import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getAdminProductsAction, createAdminProductAction, updateAdminProductAction, updateProductStatusAction } from '@/lib/services/admin/products.service';
import { adminKeys } from '@/lib/services/admin/admin.keys';

export const useAdminProducts = (opts = {}) => useQuery({
    queryKey: adminKeys.products(),
    queryFn: getAdminProductsAction,
    ...opts
});

export const useSaveProductMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, form }) => id ? updateAdminProductAction(id, form) : createAdminProductAction(form),
        ...opts
    });
    return { ...mutation, saveProduct: mutation.mutateAsync };
};

export const useUpdateProductStatusMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, status }) => updateProductStatusAction(id, status),
        ...opts
    });
    return { ...mutation, updateStatus: mutation.mutateAsync };
};
