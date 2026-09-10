/* ── API config ─────────────────────────────────────────────────────────── */
export const API_BASE = 'https://uat-api.fameo.info';
export const apiUrl = (path) => `${API_BASE}${path}`;
export const apiCall = async (endpoint, method = 'POST', body = null, isFormData = false) => {
  const headers = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';
  const options = { method, headers };
  if (body) options.body = isFormData ? body : JSON.stringify(body);

  let res;
  try {
    res = await fetch(apiUrl(endpoint), options);
  } catch (netErr) {
    // CORS block / DNS / offline all land here as an opaque "Failed to fetch"
    throw new Error(`Network or CORS failure calling ${endpoint} - ${netErr?.message || 'Failed to fetch'}`);
  }

  // Read as text first: 404/413/500 responses are usually HTML or empty, and
  // res.json() throws on those, which is what was hiding the real status code.
  const raw = await res.text();
  let data = {};
  try { data = raw ? JSON.parse(raw) : {}; } catch { data = {}; }

  if (!res.ok) {
    // 422s from this API nest the useful part three levels down, under
    // error.details.errors — data.message is only ever the generic
    // "Request validation failed", which names nothing.
    const rawFieldErrors = data.error?.details?.errors
      || data.errors || data.details || data.data?.errors || [];
    const fieldErrors = Array.isArray(rawFieldErrors) ? rawFieldErrors : [];
    const detail = (typeof data.message === 'string' ? data.message : '')
      || (typeof data.error === 'string' ? data.error : '')
      || (raw ? raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160) : '');
    console.error(`[apiCall] ${method} ${endpoint} -> ${res.status}`, detail || '(empty body)');
    if (fieldErrors.length) console.table(fieldErrors);
    else if (raw) console.error(`[apiCall] ${endpoint} body:`, raw.slice(0, 1000));
    const err = new Error(`${endpoint} failed (${res.status})${detail ? ': ' + detail : ''}`);
    err.status = res.status;
    err.serverMessage = typeof data.message === 'string' ? data.message : '';
    err.fieldErrors = fieldErrors;
    throw err;
  }
  return data;
};

/* ── referral validation endpoint (Integration Guide §5.1) ──────────────── */
export const REFERRAL_VALIDATE = (code) => `/api/v1/referral-program/coupons/${encodeURIComponent(code)}/validate`;

/* ── referral link ──────────────────────────────────────────────────────────
   Friends arrive from an invite link built on /account/referrals, shaped
   /register?ref=FAMEO-XXXXXXXX. Read straight off window.location rather than
   useSearchParams() so this page stays a plain client render — no Suspense
   boundary, no CSR bailout, no hydration mismatch.
   ------------------------------------------------------------------------ */
export const REFERRAL_PARAM_KEYS = ['ref', 'referral', 'coupon'];
export function readReferralFromUrl() {
  if (typeof window === 'undefined') return '';
  const qs = new URLSearchParams(window.location.search);
  for (const key of REFERRAL_PARAM_KEYS) {
    const v = qs.get(key);
    // Normalise the same way the manual input does, so a messy link still works.
    if (v && v.trim()) return v.trim().replace(/[^A-Za-z0-9-]/g, '').slice(0, 30).toUpperCase();
  }
  return '';
}

/* ── live selfie (blink liveness) config ────────────────────────────────── */
export const LIVE_SELFIE_ENDPOINT = '/api/v1/auth/fameoselfie';
