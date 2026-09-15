

import { userEndpoints, userConfigEndpoints } from '@/lib/api/endpoints';
import { BFF_APP_BASE } from '@/lib/api/config';
import { createServerAction } from '@/lib/api/action';

// ── Actions ─────────────────────────────────────────────────────────────────
//
// `authToken` was removed from these signatures: the BFF attaches the
// session from an httpOnly cookie and strips any Authorization header a
// caller sends, so the argument authenticated nothing. Callers may still
// pass one — JavaScript ignores extra arguments — and it is now correctly
// ignored instead of silently pretending to work.

/**
 * The rich profile the /account/profile page renders: user_profile,
 * registration, documents, tier badge.
 *
 * This lives on the APP backend, not the main one. getProfileAction() below
 * returns the main API's account record ({ _id, name, email, role }) — a
 * different shape entirely, and pointing the profile page at it is why that
 * page rendered blank.
 */
export const getWebProfileAction = async () => {
  return createServerAction({
    url: userConfigEndpoints.webProfile(),
    base: BFF_APP_BASE,
    method: 'GET',
  });
};

export const getProfileAction = async () => {
  return createServerAction({
    url: userEndpoints.profile(),
    method: 'GET',
  });
};

export const getFavoritesAction = async () => {
  return createServerAction({
    url: userEndpoints.favorites(),
    method: 'GET',
  });
};

export const getAddressesAction = async () => {
  return createServerAction({
    url: userEndpoints.addresses(),
    method: 'GET',
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
