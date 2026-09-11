// lib/api/core.js
// Isomorphic request core: native fetch, envelope unwrapping, timeouts.
//
// Native fetch on both sides is what unlocks the Next Data Cache,
// revalidateTag, ISR and per-request memoization. Axios cannot do any of that
// on the server, which is why this layer does not use it.

import { ApiError } from './errors';
import { REQUEST_TIMEOUT } from './config';

/**
 * THE definition of success for this backend. Every call site depends on it,
 * so it lives in exactly one place.
 *
 * Fameo's API answers `{ success, message, data }`. Two rules, in order:
 *   1. A literal `success: false` is a failure even on HTTP 200.
 *   2. Otherwise trust the HTTP status.
 *
 * Note `code` is deliberately NOT treated as a success flag: `code: 0` is
 * falsy and would read as failure. That is defect #10 in the guide.
 *
 * @param {any} body   parsed response body
 * @param {boolean} httpOk  res.ok
 */
export function isSuccessEnvelope(body, httpOk) {
  if (body && typeof body === 'object' && 'success' in body) {
    return body.success !== false;
  }
  return httpOk;
}

/** Pull the payload out of the envelope, so no call site does `.data.data`. */
export function unwrap(body) {
  if (body && typeof body === 'object' && 'data' in body) return body.data;
  return body;
}

function messageFrom(body, fallback) {
  if (body && typeof body === 'object') {
    if (typeof body.message === 'string' && body.message) return body.message;
    if (typeof body.error === 'string' && body.error) return body.error;
    return fallback;
  }
  if (typeof body === 'string' && body) {
    // HTML error pages (404/413/500 from a proxy) — strip tags so the message
    // is readable instead of a wall of markup.
    return body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160) || fallback;
  }
  return fallback;
}

/**
 * Pull per-field validation errors out of whichever shape the backend used.
 *
 * The registration API nests them at error.details.errors and puts only
 * "Request validation failed" in `message`. Other endpoints use `errors` or
 * `details`. Checking all of them here means no call site has to.
 */
function fieldErrorsFrom(body) {
  if (!body || typeof body !== 'object') return [];
  const raw =
    body.error?.details?.errors ||
    body.errors ||
    body.details ||
    body.data?.errors ||
    [];
  return Array.isArray(raw) ? raw : [];
}

/**
 * One fetch wrapper for server and browser alike.
 *
 * @param {string} url  absolute URL (server) or same-origin path (browser)
 * @param {RequestInit & { timeout?: number, rawResponse?: boolean, rawEnvelope?: boolean }} [init]
 * @returns {Promise<any>} the unwrapped payload
 * @throws {ApiError}
 */
export async function request(url, init = {}) {
  const { timeout = REQUEST_TIMEOUT, rawResponse = false, rawEnvelope = false, ...rest } = init;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  let res;
  try {
    res = await fetch(url, { ...rest, signal: controller.signal });
  } catch (err) {
    clearTimeout(timer);
    if (err?.name === 'AbortError') {
      throw new ApiError('Request timed out', { status: 0, code: 'TIMEOUT', url });
    }
    throw new ApiError(err?.message || 'Network request failed', { status: 0, url });
  } finally {
    clearTimeout(timer);
  }

  if (rawResponse) return res;

  // 204 and friends have no body to parse.
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    if (!res.ok) throw new ApiError('Request failed', { status: res.status, url });
    return null;
  }

  let body;
  const contentType = res.headers.get('content-type') || '';
  try {
    if (contentType.includes('application/json')) {
      body = await res.json();
    } else {
      // Read as text first: 404/413/500 are often HTML or empty, and res.json()
      // throws on those, which is what used to hide the real status code.
      const raw = await res.text();
      try { body = raw ? JSON.parse(raw) : null; } catch { body = raw || null; }
    }
  } catch {
    if (!res.ok) throw new ApiError('Request failed', { status: res.status, url });
    return null;
  }

  if (!isSuccessEnvelope(body, res.ok)) {
    throw new ApiError(messageFrom(body, 'Request failed'), {
      status: res.status,
      code: body?.code,
      details: body,
      url,
      fieldErrors: fieldErrorsFrom(body),
      serverMessage: typeof body?.message === 'string' ? body.message : '',
    });
  }

  // rawEnvelope: hand back { success, message, data } untouched. The
  // registration flow inspects those fields itself.
  return rawEnvelope ? body : unwrap(body);
}

/** Build a query string, skipping null/undefined/''. */
export function qs(params) {
  if (!params) return '';
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === null || v === undefined || v === '') continue;
    search.set(k, String(v));
  }
  const s = search.toString();
  return s ? `?${s}` : '';
}
