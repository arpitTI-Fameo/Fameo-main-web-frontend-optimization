import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getAdminRoleUsersAction, updateAdminRoleAction, toggleAdminRoleAccessAction, deleteAdminRoleUserAction, updateAdminRolePasswordAction, createAdminRoleUserAction } from '@/lib/services/admin/roles.service';

export const useAdminRoleUsers = (opts = {}) => useQuery({
    queryKey: ['admin', 'roles', 'users'],
    queryFn: getAdminRoleUsersAction,
    ...opts
});

export const useUpdateAdminRoleMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, role }) => updateAdminRoleAction(id, role),
        ...opts
    });
    return { ...mutation, updateRole: mutation.mutateAsync };
};

export const useToggleAdminRoleAccessMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, isActive }) => toggleAdminRoleAccessAction(id, isActive),
        ...opts
    });
    return { ...mutation, toggleAccess: mutation.mutateAsync };
};

export const useDeleteAdminRoleUserMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: deleteAdminRoleUserAction,
        ...opts
    });
    return { ...mutation, deleteUser: mutation.mutateAsync };
};

export const useUpdateAdminRolePasswordMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, password }) => updateAdminRolePasswordAction(id, password),
        ...opts
    });
    return { ...mutation, updatePassword: mutation.mutateAsync };
};

export const useCreateAdminRoleUserMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: createAdminRoleUserAction,
        ...opts
    });
    return { ...mutation, createUser: mutation.mutateAsync };
};
