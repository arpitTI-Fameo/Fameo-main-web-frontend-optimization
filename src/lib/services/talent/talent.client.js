'use client';
// services/talent/talent.client.js
// The talent service: every talent HTTP call in one place.
//
// Layering is component -> hook -> service -> request. These calls used to be
// inlined in lib/hooks/main/useTalent.js, so the hook layer talked to the transport
// directly and skipped this one. The request expressions are unchanged.

import { clientFetch } from '@/lib/api/client/fetcher';
import { talentEndpoints } from '@/lib/api/endpoints';

export const getJobs = () =>
  clientFetch(talentEndpoints.jobs());

export const getJob = (id) =>
  clientFetch(talentEndpoints.job(id));

export const getApplications = () =>
  clientFetch(talentEndpoints.myApplications());

export const applyJob = ({ id, data }) =>
  clientFetch(talentEndpoints.apply(id), { method: 'POST', body: JSON.stringify(data) });
