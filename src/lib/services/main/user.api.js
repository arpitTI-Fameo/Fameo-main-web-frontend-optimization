

import { userEndpoints } from '@/lib/api/endpoints';
import { createServerAction } from '@/lib/api/action';

// ── Actions ─────────────────────────────────────────────────────────────────

export const getProfileAction = async (authToken) => {
  return createServerAction({
    url: userEndpoints.profile(),
    method: 'GET',
    authToken,
  });
};

export const getFavoritesAction = async (authToken) => {
  return createServerAction({
    url: userEndpoints.favorites(),
    method: 'GET',
    authToken,
  });
};

export const getAddressesAction = async (authToken) => {
  return createServerAction({
    url: userEndpoints.addresses(),
    method: 'GET',
    authToken,
  });
};

export const updateProfileAction = async (data) => {
  return createServerAction({
    url: userEndpoints.updateProfile(),
    method: 'PUT',
    body: data,
  });
};

export const changePasswordAction = async (data) => {
  return createServerAction({
    url: userEndpoints.changePassword(),
    method: 'POST',
    body: data,
  });
};

export const toggleFavoriteAction = async (productId) => {
  return createServerAction({
    url: userEndpoints.toggleFavorite(productId),
    method: 'POST',
  });
};

export const deleteAccountAction = async () => {
  return createServerAction({
    url: userEndpoints.deleteAccount(),
    method: 'DELETE',
  });
};

export const uploadAvatarAction = async (formData) => {
  return createServerAction({
    url: userEndpoints.avatar(),
    method: 'POST',
    body: formData,
  });
};

// ── Hooks ───────────────────────────────────────────────────────────────────
