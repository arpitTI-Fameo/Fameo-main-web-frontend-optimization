import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { getAdminRoleUsers, updateAdminRole, toggleAdminRoleAccess, deleteAdminRoleUser, updateAdminRolePassword, createAdminRoleUser } from '@/lib/services/admin/roles.service';

export const useAdminRoleUsers = (opts = {}) => useQuery({
    queryKey: ['admin', 'roles', 'users'],
    queryFn: getAdminRoleUsers,
    ...opts
});

export const useUpdateAdminRoleMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, role }) => updateAdminRole(id, role),
        ...opts
    });
    return { ...mutation, updateRole: mutation.mutateAsync };
};

export const useToggleAdminRoleAccessMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, isActive }) => toggleAdminRoleAccess(id, isActive),
        ...opts
    });
    return { ...mutation, toggleAccess: mutation.mutateAsync };
};

export const useDeleteAdminRoleUserMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: deleteAdminRoleUser,
        ...opts
    });
    return { ...mutation, deleteUser: mutation.mutateAsync };
};

export const useUpdateAdminRolePasswordMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: ({ id, password }) => updateAdminRolePassword(id, password),
        ...opts
    });
    return { ...mutation, updatePassword: mutation.mutateAsync };
};

export const useCreateAdminRoleUserMutation = (opts = {}) => {
    const mutation = useApiMutation({
        mutationFn: createAdminRoleUser,
        ...opts
    });
    return { ...mutation, createUser: mutation.mutateAsync };
};
