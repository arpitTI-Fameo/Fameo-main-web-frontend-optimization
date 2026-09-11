'use client';
// services/register/register.client.js
// The register service: every registration HTTP call in one place.
//
// Layering is component -> hook -> service -> request. All of this lived in
// lib/hooks/main/useRegister.js, so the hook file was simultaneously the
// service AND the transport adapter for the app backend.
//
// Registration is unauthenticated; appFetch goes through /api/bff-app so the
// upstream origin stays out of the client bundle.

import { request, qs } from '@/lib/api/core';
import { BFF_APP_BASE } from '@/lib/api/config';
import { registerEndpoints, masterEndpoints } from '@/lib/api/endpoints';
import { registerKeys } from './register.keys';


// ── Service Functions ────────────────────────────────────────────────────────

/** Same-origin call to the app backend via its BFF. */
export function appFetch(path, { params, ...init } = {}) {
  return request(`${BFF_APP_BASE}${path}${qs(params)}`, {
    credentials: 'same-origin',
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });
}

/** FormData variant — no Content-Type, the browser sets the boundary. */
export function appUpload(path, formData, init = {}) {
  return request(`${BFF_APP_BASE}${path}`, {
    method: 'POST',
    credentials: 'same-origin',
    ...init,
    body: formData,
  });
}

// ── Query Options ────────────────────────────────────────────────────────────

export const statesQueryOptions = () => ({
  queryKey: registerKeys.states(),
  queryFn: () => appFetch(masterEndpoints.states()),
  staleTime: 60 * 60_000,
});

export const citiesQueryOptions = (stateId) => ({
  queryKey: registerKeys.cities(stateId),
  queryFn: () => appFetch(masterEndpoints.cities(), { params: { state_id: stateId } }),
  enabled: Boolean(stateId),
  staleTime: 60 * 60_000,
});

export const categoriesQueryOptions = () => ({
  queryKey: registerKeys.categories(),
  queryFn: () => appFetch(masterEndpoints.categories()),
  staleTime: 60 * 60_000,
});

export const professionsQueryOptions = (categoryCode) => ({
  queryKey: registerKeys.professions(categoryCode),
  queryFn: () => appFetch(masterEndpoints.professions(categoryCode)),
  enabled: Boolean(categoryCode),
  staleTime: 60 * 60_000,
});

// ── Lookups ──────────────────────────────────────────────────────────────────

export const lookupPincode = (pin) => appFetch(masterEndpoints.pincode(pin));

export const checkUsername = (username) =>
  appFetch(registerEndpoints.checkUsername(), { params: { username } });

export const validateReferral = (code) =>
  appFetch(registerEndpoints.validateReferral(code));

// ── Registration step functions ──────────────────────────────────────────────

export const sendOtp = (body) =>
  appFetch(registerEndpoints.sendOtp(), { method: 'POST', body: JSON.stringify(body) });

export const verifyOtp = (body) =>
  appFetch(registerEndpoints.verifyOtp(), { method: 'POST', body: JSON.stringify(body) });

export const verifyEmailOtp = (body) =>
  appFetch(registerEndpoints.verifyEmailOtp(), { method: 'POST', body: JSON.stringify(body) });

export const uploadLiveSelfie = (formData) =>
  appUpload(registerEndpoints.liveSelfie(), formData);

export const uploadSelfie = (formData) =>
  appUpload(registerEndpoints.uploadSelfie(), formData);

export const uploadDocuments = (formData) =>
  appUpload(registerEndpoints.uploadDocuments(), formData);

export const submitRegistration = (payload) =>
  appFetch(registerEndpoints.register(), { method: 'POST', body: JSON.stringify(payload) });

// ── Hooks ────────────────────────────────────────────────────────────────────
