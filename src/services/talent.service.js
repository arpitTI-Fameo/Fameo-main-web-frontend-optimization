// services/talent.service.js
// Maps to backend: /api/talent/*
// Used by: talent-hire/* pages

import { talentApi } from '@/lib/api';

export const getJobs        = async (params = {}) => (await talentApi.getJobs(params)).data;
export const getJob         = async (id)           => (await talentApi.getJob(id)).data;
export const postJob        = async (body)          => (await talentApi.postJob(body)).data;
export const applyForJob    = async (id, body)      => (await talentApi.apply(id, body)).data;
export const getApplications= async ()             => (await talentApi.getApplications()).data;