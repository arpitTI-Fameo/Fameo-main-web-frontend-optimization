'use client';

import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { registerKeys } from '@/lib/services/register/register.keys';
import {
  appFetch, appUpload,
  statesQueryOptions, citiesQueryOptions, categoriesQueryOptions, professionsQueryOptions,
  lookupPincode, checkUsername, validateReferral,
  sendOtp, verifyOtp, verifyEmailOtp,
  uploadLiveSelfie, uploadSelfie, uploadDocuments, submitRegistration,
} from '@/lib/services/register/register.client';

// Re-exported so components keep a single import point for the register flow.
export {
  appFetch, appUpload,
  statesQueryOptions, citiesQueryOptions, categoriesQueryOptions, professionsQueryOptions,
  lookupPincode, checkUsername, validateReferral,
  sendOtp, verifyOtp, verifyEmailOtp,
  uploadLiveSelfie, uploadSelfie, uploadDocuments, submitRegistration,
};

export const useStates = (o = {}) => useQuery({ ...statesQueryOptions(), ...o });

export const useCities = (id, o = {}) => useQuery({ ...citiesQueryOptions(id), ...o });

export const useCategories = (o = {}) => useQuery({ ...categoriesQueryOptions(), ...o });

export const useProfessions = (c, o = {}) => useQuery({ ...professionsQueryOptions(c), ...o });

export const useSendOtpMutation = (o = {}) =>
  useApiMutation({ mutationFn: sendOtp, ...o });

export const useVerifyOtpMutation = (o = {}) =>
  useApiMutation({ mutationFn: verifyOtp, ...o });

export const useVerifyEmailOtpMutation = (o = {}) =>
  useApiMutation({ mutationFn: verifyEmailOtp, ...o });

export const useUploadLiveSelfieMutation = (o = {}) =>
  useApiMutation({ mutationFn: uploadLiveSelfie, ...o });

export const useUploadSelfieMutation = (o = {}) =>
  useApiMutation({ mutationFn: uploadSelfie, ...o });

export const useUploadDocumentsMutation = (o = {}) =>
  useApiMutation({ mutationFn: uploadDocuments, ...o });

export const useRegisterMutation = (o = {}) =>
  useApiMutation({ mutationFn: submitRegistration, invalidate: [registerKeys.all()], ...o });
