import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import {
  getStatesAction,
  getCitiesAction,
  getCategoriesAction,
  getProfessionsAction,
  sendOtpAction,
  verifyOtpAction,
  verifyEmailOtpAction,
  uploadLiveSelfieAction,
  uploadSelfieAction,
  uploadDocumentsAction,
  submitRegistrationAction
} from '@/lib/services/auth/register.api.js';

// ── Keys ───────────────────────────────────────────────────────────────────
// services/register/register.keys.js
// Single source of query keys for registration reference data.
//
// Master data is the part of this flow worth caching, and it is exactly where
// defect #6 bites: a prefetch keyed ['states'] and a hook keyed
// ['states', stateId] are different entries, so the prefetch silently does
// nothing. Both sides import from here.

export const registerKeys = {
  all: () => ['register'],

  master: () => [...registerKeys.all(), 'master'],
  states: () => [...registerKeys.master(), 'states'],
  cities: (stateId) => [...registerKeys.master(), 'cities', stateId ?? null],
  categories: () => [...registerKeys.master(), 'categories'],
  professions: (categoryCode) =>
    [...registerKeys.master(), 'professions', categoryCode ?? null],
  pincode: (pin) => [...registerKeys.master(), 'pincode', pin ?? null],

  username: (name) => [...registerKeys.all(), 'username', name ?? null],
  referral: (code) => [...registerKeys.all(), 'referral', code ?? null],
};

// ── Hooks ──────────────────────────────────────────────────────────────────
export const useStates = (o = {}) => useQuery({
  queryKey: registerKeys.states(),
  queryFn: async () => {
    const response = await getStatesAction();
    if (!response.code) throw response;
    return response.result;
  },
  staleTime: 60 * 60_000,
  ...o,
});

export const useCities = (id, o = {}) => useQuery({
  queryKey: registerKeys.cities(id),
  queryFn: async () => {
    const response = await getCitiesAction(id);
    if (!response.code) throw response;
    return response.result;
  },
  enabled: Boolean(id),
  staleTime: 60 * 60_000,
  ...o,
});

export const useCategories = (o = {}) => useQuery({
  queryKey: registerKeys.categories(),
  queryFn: async () => {
    const response = await getCategoriesAction();
    if (!response.code) throw response;
    return response.result;
  },
  staleTime: 60 * 60_000,
  ...o,
});

export const useProfessions = (c, o = {}) => useQuery({
  queryKey: registerKeys.professions(c),
  queryFn: async () => {
    const response = await getProfessionsAction(c);
    if (!response.code) throw response;
    return response.result;
  },
  enabled: Boolean(c),
  staleTime: 60 * 60_000,
  ...o,
});

export const useSendOtpMutation = (o = {}) => useApiMutation({
  mutationFn: async (body) => {
    const response = await sendOtpAction(body);
    if (!response.code) throw response;
    return response.result;
  },
  ...o,
});

export const useVerifyOtpMutation = (o = {}) => useApiMutation({
  mutationFn: async (body) => {
    const response = await verifyOtpAction(body);
    if (!response.code) throw response;
    return response.result;
  },
  ...o,
});

export const useVerifyEmailOtpMutation = (o = {}) => useApiMutation({
  mutationFn: async (body) => {
    const response = await verifyEmailOtpAction(body);
    if (!response.code) throw response;
    return response.result;
  },
  ...o,
});

export const useUploadLiveSelfieMutation = (o = {}) => useApiMutation({
  mutationFn: async (formData) => {
    const response = await uploadLiveSelfieAction(formData);
    if (!response.code) throw response;
    return response.result;
  },
  ...o,
});

export const useUploadSelfieMutation = (o = {}) => useApiMutation({
  mutationFn: async (formData) => {
    const response = await uploadSelfieAction(formData);
    if (!response.code) throw response;
    return response.result;
  },
  ...o,
});

export const useUploadDocumentsMutation = (o = {}) => useApiMutation({
  mutationFn: async (formData) => {
    const response = await uploadDocumentsAction(formData);
    if (!response.code) throw response;
    return response.result;
  },
  ...o,
});

export const useRegisterMutation = (o = {}) => useApiMutation({
  mutationFn: async (payload) => {
    const response = await submitRegistrationAction(payload);
    if (!response.code) throw response;
    return response.result;
  },
  invalidate: [registerKeys.all()],
  ...o,
});
