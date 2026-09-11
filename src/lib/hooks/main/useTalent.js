'use client';

import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { talentKeys } from '@/lib/services/talent/talent.keys';
import {
  applyJob, getApplications, getJob, getJobs,
} from '@/lib/services/talent/talent.client';

export const useJobs = (opts = {}) => useQuery({
  queryKey: talentKeys.jobs(),
  queryFn: getJobs,
  ...opts,
});

export const useJob = (id, opts = {}) => useQuery({
  queryKey: talentKeys.job(id),
  queryFn: () => getJob(id),
  enabled: Boolean(id),
  ...opts,
});

export const useApplications = (opts = {}) => useQuery({
  queryKey: talentKeys.applications(),
  queryFn: getApplications,
  ...opts,
});

export const useApplyJobMutation = (opts = {}) => useApiMutation({
  mutationFn: applyJob,
  invalidate: [talentKeys.applications()],
  ...opts,
});
