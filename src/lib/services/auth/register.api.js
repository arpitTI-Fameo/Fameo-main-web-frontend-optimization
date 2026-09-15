'use client';

import { BFF_APP_BASE } from '@/lib/api/config';
import { clientFetch, clientUpload } from '@/lib/api/client/fetcher';
import { registerEndpoints, masterEndpoints } from '@/lib/api/endpoints';
import { createServerAction } from '@/lib/api/action';

// ── Actions ─────────────────────────────────────────────────────────────────

/** Same-origin call to the app backend via its BFF. */
export function appFetch(path, init = {}) {
  return clientFetch(path, { base: BFF_APP_BASE, ...init });
}

/** FormData variant — no Content-Type, the browser sets the boundary. */
export function appUpload(path, formData, init = {}) {
  return clientUpload(path, formData, { base: BFF_APP_BASE, ...init });
}

export const getStatesAction = async () => {
  return createServerAction({
    url: masterEndpoints.states(),
    method: 'GET',
    base: BFF_APP_BASE,
  });
};

export const getCitiesAction = async (stateId) => {
  return createServerAction({
    url: masterEndpoints.cities(),
    method: 'GET',
    params: { state_id: stateId },
    base: BFF_APP_BASE,
  });
};

export const getCategoriesAction = async () => {
  return createServerAction({
    url: masterEndpoints.categories(),
    method: 'GET',
    base: BFF_APP_BASE,
  });
};

export const getProfessionsAction = async (categoryCode) => {
  return createServerAction({
    url: masterEndpoints.professions(categoryCode),
    method: 'GET',
    base: BFF_APP_BASE,
  });
};

export const lookupPincodeAction = async (pin) => {
  return createServerAction({
    url: masterEndpoints.pincode(pin),
    method: 'GET',
    base: BFF_APP_BASE,
  });
};

export const checkUsernameAction = async (username) => {
  return createServerAction({
    url: registerEndpoints.checkUsername(),
    method: 'GET',
    params: { username },
    base: BFF_APP_BASE,
  });
};

export const validateReferralAction = async (code) => {
  return createServerAction({
    url: registerEndpoints.validateReferral(code),
    method: 'GET',
    base: BFF_APP_BASE,
  });
};

export const sendOtpAction = async (body) => {
  return createServerAction({
    url: registerEndpoints.sendOtp(),
    method: 'POST',
    body,
    base: BFF_APP_BASE,
  });
};

export const verifyOtpAction = async (body) => {
  return createServerAction({
    url: registerEndpoints.verifyOtp(),
    method: 'POST',
    body,
    base: BFF_APP_BASE,
  });
};

export const verifyEmailOtpAction = async (body) => {
  return createServerAction({
    url: registerEndpoints.verifyEmailOtp(),
    method: 'POST',
    body,
    base: BFF_APP_BASE,
  });
};

export const uploadLiveSelfieAction = async (formData) => {
  return createServerAction({
    url: registerEndpoints.liveSelfie(),
    method: 'POST',
    body: formData,
    base: BFF_APP_BASE,
  });
};

export const uploadSelfieAction = async (formData) => {
  return createServerAction({
    url: registerEndpoints.uploadSelfie(),
    method: 'POST',
    body: formData,
    base: BFF_APP_BASE,
  });
};

export const uploadDocumentsAction = async (formData) => {
  return createServerAction({
    url: registerEndpoints.uploadDocuments(),
    method: 'POST',
    body: formData,
    base: BFF_APP_BASE,
  });
};

export const submitRegistrationAction = async (payload) => {
  return createServerAction({
    url: registerEndpoints.register(),
    method: 'POST',
    body: payload,
    base: BFF_APP_BASE,
  });
};

// Re-exports so UI components that use the functions directly don't break immediately
