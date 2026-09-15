import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import {
  getProfileAction,
  getFavoritesAction,
  getAddressesAction,
  updateProfileAction,
  changePasswordAction,
  toggleFavoriteAction,
  deleteAccountAction,
  uploadAvatarAction
} from '@/lib/services';

// ── Keys ───────────────────────────────────────────────────────────────────
export const userKeys = {
  all: () => ['user'],
  profile: () => [...userKeys.all(), 'profile'],
  favorites: () => [...userKeys.all(), 'favorites'],
  addresses: () => [...userKeys.all(), 'addresses'],
};

// ── Hooks ──────────────────────────────────────────────────────────────────
export const useProfile = ({ initialData, ...opts } = {}) => useQuery({
  queryKey: userKeys.profile(),
  queryFn: async () => {
    const response = await getProfileAction();
    if (!response.code) throw response;
    return response.result;
  },
  staleTime: 60_000,
  ...(initialData !== undefined ? { initialData } : {}),
  ...opts,
});

export const useFavorites = ({ initialData, ...opts } = {}) => useQuery({
  queryKey: userKeys.favorites(),
  queryFn: async () => {
    const response = await getFavoritesAction();
    if (!response.code) throw response;
    return response.result;
  },
  staleTime: 60_000,
  ...(initialData !== undefined ? { initialData } : {}),
  ...opts,
});

export const useAddresses = ({ initialData, ...opts } = {}) => useQuery({
  queryKey: userKeys.addresses(),
  queryFn: async () => {
    const response = await getAddressesAction();
    if (!response.code) throw response;
    return response.result;
  },
  ...(initialData !== undefined ? { initialData } : {}),
  ...opts,
});

export const useUpdateProfileMutation = (opts = {}) => useApiMutation({
  mutationFn: async (data) => {
    const response = await updateProfileAction(data);
    if (!response.code) throw response;
    return response.result;
  },
  invalidate: [userKeys.profile()],
  ...opts,
});

export const useChangePasswordMutation = (opts = {}) => useApiMutation({
  mutationFn: async (data) => {
    const response = await changePasswordAction(data);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useToggleFavoriteMutation = (opts = {}) => useApiMutation({
  mutationFn: async (productId) => {
    const response = await toggleFavoriteAction(productId);
    if (!response.code) throw response;
    return response.result;
  },
  invalidate: [userKeys.favorites()],
  ...opts,
});

export const useDeleteAccountMutation = (opts = {}) => useApiMutation({
  mutationFn: async () => {
    const response = await deleteAccountAction();
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useUploadAvatarMutation = (opts = {}) => useApiMutation({
  mutationFn: async (formData) => {
    const response = await uploadAvatarAction(formData);
    if (!response.code) throw response;
    return response.result;
  },
  invalidate: [userKeys.profile()],
  ...opts,
});
