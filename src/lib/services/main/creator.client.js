'use client';
import { createServerAction } from '@/lib/api/action';
// services/creator/creator.client.js
// The creator service: every creator HTTP call in one place.
//
// Layering is component -> hook -> service -> request. These calls used to be
// inlined in lib/hooks/main/useCreator.js, so the hook layer talked to the transport
// directly and skipped this one. The request expressions are unchanged.

import { clientFetch } from '@/lib/api/client/fetcher';
import { creatorEndpoints } from '@/lib/api/endpoints';

export const getCreatorsAction = async () => {
  return createServerAction({
    url: creatorEndpoints.getAll(),
    method: 'GET',
  });
};

export const getCreatorAction = async (id) => {
  return createServerAction({
    url: creatorEndpoints.getOne(id),
    method: 'GET',
  });
};

export const getMyCreatorProfileAction = async () => {
  return createServerAction({
    url: creatorEndpoints.myProfile(),
    method: 'GET',
  });
};
