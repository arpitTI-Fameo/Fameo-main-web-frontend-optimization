'use client';
import { createServerAction } from '@/lib/api/action';
// services/talent/talent.client.js
// The talent service: every talent HTTP call in one place.
//
// Layering is component -> hook -> service -> request. These calls used to be
// inlined in lib/hooks/main/useTalent.js, so the hook layer talked to the transport
// directly and skipped this one. The request expressions are unchanged.

import { clientFetch } from '@/lib/api/client/fetcher';
import { talentEndpoints } from '@/lib/api/endpoints';

export const getJobsAction = async () => {
  return createServerAction({
    url: talentEndpoints.jobs(),
    method: 'GET',
  });
};

export const getJobAction = async (id) => {
  return createServerAction({
    url: talentEndpoints.job(id),
    method: 'GET',
  });
};

export const getApplicationsAction = async () => {
  return createServerAction({
    url: talentEndpoints.myApplications(),
    method: 'GET',
  });
};

export const applyJobAction = async ({ id, data }) => {
  return createServerAction({
    url: talentEndpoints.apply(id),
    method: 'POST',
    body: data,
  });
};
