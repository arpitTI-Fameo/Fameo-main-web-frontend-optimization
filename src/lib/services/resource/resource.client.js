'use client';
// services/resource/resource.client.js
// The resource service: every resource HTTP call in one place.
//
// Layering is component -> hook -> service -> request. These calls used to be
// inlined in lib/hooks/main/useResource.js, so the hook layer talked to the transport
// directly and skipped this one. The request expressions are unchanged.

import { clientFetch } from '@/lib/api/client/fetcher';
import { resourceEndpoints } from '@/lib/api/endpoints';

export const getCourses = (params) =>
  clientFetch(resourceEndpoints.courses(), { params });

export const getCourse = (slug) =>
  clientFetch(resourceEndpoints.course(slug));

export const getLearnings = () =>
  clientFetch(resourceEndpoints.learnings());

export const getSavedResources = () =>
  clientFetch(resourceEndpoints.saved());

export const enroll = (id) =>
  clientFetch(resourceEndpoints.enroll(id), { method: 'POST' });

export const updateProgress = ({ id, data }) =>
  clientFetch(resourceEndpoints.updateProgress(id), { method: 'POST', body: JSON.stringify(data) });
