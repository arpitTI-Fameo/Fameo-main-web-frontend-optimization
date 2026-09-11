import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getAdminProducts, createAdminProduct, updateAdminProduct, updateProductStatus } from '@/lib/services/admin/products.service';

export const useAdminProducts = (opts = {}) => useQuery({
    queryKey: ['admin', 'products'],
    queryFn: getAdminProducts,
    ...opts
});

export const useSaveProductMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, form }) => id ? updateAdminProduct(id, form) : createAdminProduct(form),
        ...opts
    });
    return { ...mutation, saveProduct: mutation.mutateAsync };
};

export const useUpdateProductStatusMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, status }) => updateProductStatus(id, status),
        ...opts
    });
    return { ...mutation, updateStatus: mutation.mutateAsync };
};
