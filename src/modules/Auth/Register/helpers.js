/* ── helpers ─────────────────────────────────────────────────────────────── */
/* new Date('2000-11-31') silently rolls over to Dec 1, so calcAge never
   rejected impossible calendar dates. Verify the parts round-trip. */
export function isRealDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return false;
  const y = +m[1], mo = +m[2], d = +m[3];
  const dt = new Date(y, mo - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d;
}
export function calcAge(dob) {
  if (!isRealDate(dob)) return null;
  const d = new Date(dob + 'T00:00:00');
  const t = new Date();
  let age = t.getFullYear() - d.getFullYear();
  const m = t.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < d.getDate())) age--;
  return age;
}
export function maxDobISO() {
  const t = new Date(); t.setFullYear(t.getFullYear() - 18);
  const p = n => String(n).padStart(2, '0');
  return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`;
}
export function minDobISO() {
  const t = new Date(); t.setFullYear(t.getFullYear() - 100);
  const p = n => String(n).padStart(2, '0');
  return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`;
}
export const fmtSize = (bytes) => bytes < 1048576 ? Math.round(bytes / 1024) + 'KB' : (bytes / 1048576).toFixed(1) + 'MB';
export const formatDocLabel = (str) => str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

/* Social links copied from the mobile apps carry ?igshid= / ?si= tracking
   params, which used to fail validation. Strip query, hash and trailing slash
   before we test or store the URL. */
export const cleanUrl = (u) => String(u || '').trim().split(/[?#]/)[0].replace(/\/+$/, '');

/* Server strings like "/api/v1/auth/verify-otp failed (400): Invalid OTP"
   should never reach the user. */
export function friendlyOtpError(message = '') {
  const m = message.toLowerCase();
  if (m.includes('expire')) return 'That code has expired — request a new one.';
  if (m.includes('too many') || m.includes('attempt') || m.includes('locked')) return 'Too many attempts. Please request a new code.';
  if (m.includes('network') || m.includes('cors') || m.includes('failed to fetch')) return 'Couldn’t reach the server. Check your connection and try again.';
  return 'That code doesn’t match. Check it and try again.';
}
export function friendlyRegisterError(err) {
  const raw = (err?.serverMessage || err?.message || '').toLowerCase();
  if (err?.status === 422 && err.fieldErrors?.length) {
    const names = err.fieldErrors
      .map(e => e.field || e.path || e.param || e.key)
      .filter(Boolean)
      .map(f => String(f).replace(/^registrationData\./, ''));
    const first = err.fieldErrors[0];
    const reason = first?.message || first?.msg || '';
    if (names.length) return `The server rejected these details: ${names.join(', ')}${reason ? ` — ${reason}` : ''}`;
    if (reason) return reason;
  }
  if (err?.status === 409 || raw.includes('already exist') || raw.includes('duplicate')) {
    return 'An account already exists with this mobile number or email. Try logging in instead.';
  }
  if (err?.status === 413 || raw.includes('too large')) return 'Your documents were too large to upload. Keep each file under 10MB and try again.';
  if (raw.includes('network') || raw.includes('cors') || raw.includes('failed to fetch')) {
    return 'Couldn’t reach the server. Check your connection and try again.';
  }
  return err?.serverMessage || 'We couldn’t submit your application. Please try again in a moment.';
}


export function livenessHint(message = '') {
  const m = message.toLowerCase();
  if (m.includes('under 18')) return 'You must be 18 or older to register on Fameo.';
  if (m.includes('adult') || m.includes('explicit')) return 'Please retake a normal, clear selfie.';
  if (m.includes('replay') || m.includes('screen')) return 'Use the live camera directly — not a photo of another screen.';
  if (m.includes('blink')) return 'Blink slowly 2–3 times while looking straight at the camera, then retry.';
  if (m.includes('clear face') || m.includes('face')) return 'Improve lighting, centre your face, and keep only one face in frame.';
  return 'Please retry the live check.';
}
export function isFatalLiveness(message = '') {
  const m = message.toLowerCase();
  return m.includes('under 18') || m.includes('adult') || m.includes('explicit');
}
