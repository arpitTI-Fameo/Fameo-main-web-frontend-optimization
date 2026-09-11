'use client';
// services/user/user.client.js
// The user service: every user HTTP call in one place.
//
// Layering is component -> hook -> service -> request. These calls used to be
// inlined in lib/hooks/main/useUser.js, so the hook layer talked to the transport
// directly and skipped this one. The request expressions are unchanged.

import { clientFetch, clientUpload } from '@/lib/api/client/fetcher';
import { userEndpoints } from '@/lib/api/endpoints';

export const getProfile = () =>
  clientFetch(userEndpoints.profile());

export const getFavorites = () =>
  clientFetch(userEndpoints.favorites());

export const getAddresses = () =>
  clientFetch(userEndpoints.addresses());

export const updateProfile = (data) =>
  clientFetch(userEndpoints.updateProfile(), { method: 'PUT', body: JSON.stringify(data) });

export const changePassword = (data) =>
  clientFetch(userEndpoints.changePassword(), { method: 'POST', body: JSON.stringify(data) });

export const toggleFavorite = (productId) =>
  clientFetch(userEndpoints.toggleFavorite(productId), { method: 'POST' });

export const deleteAccount = () =>
  clientFetch(userEndpoints.deleteAccount(), { method: 'DELETE' });

export const uploadAvatar = (formData) =>
  clientUpload(userEndpoints.avatar(), formData);
