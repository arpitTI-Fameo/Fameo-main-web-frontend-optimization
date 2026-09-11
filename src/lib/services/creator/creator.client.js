'use client';
// services/creator/creator.client.js
// The creator service: every creator HTTP call in one place.
//
// Layering is component -> hook -> service -> request. These calls used to be
// inlined in lib/hooks/main/useCreator.js, so the hook layer talked to the transport
// directly and skipped this one. The request expressions are unchanged.

import { clientFetch } from '@/lib/api/client/fetcher';
import { creatorEndpoints } from '@/lib/api/endpoints';

export const getCreators = () =>
  clientFetch(creatorEndpoints.getAll());

export const getCreator = (id) =>
  clientFetch(creatorEndpoints.getOne(id));

export const getMyCreatorProfile = () =>
  clientFetch(creatorEndpoints.myProfile());
