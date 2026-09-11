'use client';

import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { userKeys } from '@/lib/services/user/user.keys';
import {
  changePassword, deleteAccount, getAddresses, getFavorites, getProfile, toggleFavorite, updateProfile, uploadAvatar,
} from '@/lib/services/user/user.client';

export const useProfile = (opts = {}) => useQuery({
  queryKey: userKeys.profile(),
  queryFn: getProfile,
  staleTime: 60_000,
  ...opts,
});

export const useFavorites = (opts = {}) => useQuery({
  queryKey: userKeys.favorites(),
  queryFn: getFavorites,
  staleTime: 60_000,
  ...opts,
});

export const useAddresses = (opts = {}) => useQuery({
  queryKey: userKeys.addresses(),
  queryFn: getAddresses,
  ...opts,
});

export const useUpdateProfileMutation = (opts = {}) => useApiMutation({
  mutationFn: updateProfile,
  invalidate: [userKeys.profile()],
  ...opts,
});

export const useChangePasswordMutation = (opts = {}) => useApiMutation({
  mutationFn: changePassword,
  ...opts,
});

export const useToggleFavoriteMutation = (opts = {}) => useApiMutation({
  mutationFn: toggleFavorite,
  invalidate: [userKeys.favorites()],
  ...opts,
});

export const useDeleteAccountMutation = (opts = {}) => useApiMutation({
  mutationFn: deleteAccount,
  ...opts,
});

export const useUploadAvatarMutation = (opts = {}) => useApiMutation({
  mutationFn: uploadAvatar,
  invalidate: [userKeys.profile()],
  ...opts,
});
