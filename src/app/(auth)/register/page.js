'use client';

import React, { useState, useEffect, useRef } from 'react';
import logo from '../../assets/logo.png';

/* ═══════════════════════════════════════════════════════════════════════════
   FAMEO REGISTER FLOW — Doc 1 design system + Doc 2 API-driven steps
   ─────────────────────────────────────────────────────────────────────────
     STEP 01 — IDENTITY   name · dob (18+ gate) · country/mobile/email · referral
     STEP 02 — PROFILE    username · gender · pin → state/city
     STEP 03 — SOCIALS    primary platform · youtube url · instagram url
     STEP 04 — CATEGORY   category grid (API) · profession (API)
     STEP 05 — PROOF      LIVE selfie (blink liveness) · docs · press urls
     SUCCESS              application summary
   ═══════════════════════════════════════════════════════════════════════ */

/* ── API config ─────────────────────────────────────────────────────────── */
const API_BASE = 'https://uat-api.fameo.info';
const apiUrl = (path) => `${API_BASE}${path}`;
const apiCall = async (endpoint, method = 'POST', body = null, isFormData = false) => {
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
const REFERRAL_VALIDATE = (code) => `/api/v1/referral-program/coupons/${encodeURIComponent(code)}/validate`;

/* ── referral link ──────────────────────────────────────────────────────────
   Friends arrive from an invite link built on /account/referrals, shaped
   /register?ref=FAMEO-XXXXXXXX. Read straight off window.location rather than
   useSearchParams() so this page stays a plain client render — no Suspense
   boundary, no CSR bailout, no hydration mismatch.
   ------------------------------------------------------------------------ */
const REFERRAL_PARAM_KEYS = ['ref', 'referral', 'coupon'];
function readReferralFromUrl() {
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
const LIVE_SELFIE_ENDPOINT = '/api/v1/auth/fameoselfie';
const BLINK_FRAME_WIDTH = 480;
const BLINK_FRAME_QUALITY = 0.55;
const FINAL_SELFIE_WIDTH = 960;
const FINAL_SELFIE_QUALITY = 0.78;

/* ── liveness pacing ─────────────────────────────────────────────────────── */
const BLINK_FRAME_COUNT = 16;      // frames across the blink window
const BLINK_FRAME_INTERVAL = 220;  // ms between frames → ~3.5s blink window
const MIN_BLINK_FRAMES = 3;
const OPEN_HOLD_MS = 2500;         // "keep eyes open" hold
const COUNTDOWN_MS = 3000;         // 3-2-1 countdown
const CAPTURE_SETTLE_MS = 500;     // settle before final selfie

/* ── file upload limits (must match the copy shown to the user) ─────────── */
const MAX_GENERIC_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_DOC_EXT = /\.(pdf|docx?|jpe?g|png|webp)$/i;

const COUNTRY_CODES = [
  { c: 'IN', d: '+91' }, { c: 'US', d: '+1' }, { c: 'GB', d: '+44' },
  { c: 'AE', d: '+971' }, { c: 'SG', d: '+65' }, { c: 'AU', d: '+61' },
  { c: 'DE', d: '+49' }, { c: 'FR', d: '+33' }, { c: 'SA', d: '+966' },
  { c: 'PK', d: '+92' }, { c: 'BD', d: '+880' }, { c: 'MY', d: '+60' },
  { c: 'ID', d: '+62' }, { c: 'PH', d: '+63' },
];

/* ── mobile rules ───────────────────────────────────────────────────────────
   Per-country digit length AND leading-digit rule. The old single
   /^\d{7,15}$/ let a +91 number take 15 digits and accepted 0000000000.
   Anything not listed falls back to the permissive 7–15 range.
   ------------------------------------------------------------------------ */
const MOBILE_RULES = {
  '+91':  { len: [10, 10], start: /^[6-9]/, startMsg: 'Indian mobile numbers start with 6, 7, 8 or 9.' },
  '+1':   { len: [10, 10], start: /^[2-9]/, startMsg: 'US and Canada numbers can’t start with 0 or 1.' },
  '+44':  { len: [10, 10], start: /^7/,     startMsg: 'UK mobile numbers start with 7 — drop the leading 0.' },
  '+971': { len: [9, 9],   start: /^5/,     startMsg: 'UAE mobile numbers start with 5.' },
  '+65':  { len: [8, 8],   start: /^[89]/,  startMsg: 'Singapore mobile numbers start with 8 or 9.' },
  '+61':  { len: [9, 9],   start: /^4/,     startMsg: 'Australian mobile numbers start with 4 — drop the leading 0.' },
  '+49':  { len: [10, 11] },
  '+33':  { len: [9, 9],   start: /^[67]/,  startMsg: 'French mobile numbers start with 6 or 7.' },
  '+966': { len: [9, 9],   start: /^5/,     startMsg: 'Saudi mobile numbers start with 5.' },
  '+92':  { len: [10, 10], start: /^3/,     startMsg: 'Pakistani mobile numbers start with 3.' },
  '+880': { len: [10, 10], start: /^1/,     startMsg: 'Bangladeshi mobile numbers start with 1.' },
  '+60':  { len: [9, 10],  start: /^1/,     startMsg: 'Malaysian mobile numbers start with 1.' },
  '+62':  { len: [9, 12],  start: /^8/,     startMsg: 'Indonesian mobile numbers start with 8.' },
  '+63':  { len: [10, 10], start: /^9/,     startMsg: 'Philippine mobile numbers start with 9.' },
};
const mobileRule = (cc) => MOBILE_RULES[cc] || { len: [7, 15] };
const mobileLenRange = (cc) => mobileRule(cc).len;

/* `hard: true` = certainly wrong, safe to surface mid-typing.
   Soft problems (still too short) only surface on blur or submit. */
function validateMobile(cc, raw) {
  const r = mobileRule(cc);
  const [min, max] = r.len;
  const hint = min === max ? `${max} digits` : `${min}–${max} digits`;
  if (!raw) return { ok: false, msg: 'Mobile number is required', hint };
  if (r.start && !r.start.test(raw)) return { ok: false, hard: true, msg: r.startMsg, hint };
  if (raw.length > max) return { ok: false, hard: true, msg: `That’s too long for ${cc} — it should be ${hint}.`, hint };
  if (raw.length < min) return { ok: false, msg: `That’s ${raw.length} of ${hint} for ${cc}.`, hint };
  if (/^(\d)\1+$/.test(raw)) return { ok: false, hard: true, msg: 'That doesn’t look like a real number.', hint };
  return { ok: true, msg: '', hint };
}

const PATTERNS = {
  // Rejects a@b..com, a@b.com. and other shapes the old loose rule allowed.
  email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/,
  username: /^[A-Za-z0-9_.]{1,30}$/,
  // Accept an optional @ — people paste both shapes.
  instagramUrl: /^https?:\/\/(www\.)?instagram\.com\/@?([A-Za-z0-9_.]{1,30})\/?$/,
  youtube: /^https?:\/\/((www|m)\.)?youtube\.com\/((@[A-Za-z0-9_.-]{1,100})|channel\/[A-Za-z0-9_-]{10,}|c\/[A-Za-z0-9_.-]{1,100}|user\/[A-Za-z0-9_.-]{1,100})\/?$/,
  referral: /^[A-Za-z0-9-]{4,30}$/,
};

const EMAIL_TYPOS = {
  'gmail.con': 'gmail.com', 'gmail.co': 'gmail.com', 'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com', 'gnail.com': 'gmail.com', 'gmail.cm': 'gmail.com',
  'yahoo.con': 'yahoo.com', 'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com',
  'hotmail.con': 'hotmail.com', 'hotmial.com': 'hotmail.com',
  'outlook.con': 'outlook.com', 'outlok.com': 'outlook.com',
  'rediffmail.con': 'rediffmail.com', 'icloud.con': 'icloud.com',
};

/* Returns { ok, msg, hard?, warn? } — one precise reason, not a generic
   "invalid email". `warn` is a non-blocking "did you mean" nudge. */
function validateEmail(rawInput) {
  const v = (rawInput || '').trim();
  if (!v) return { ok: false, msg: 'Email address is required' };
  if (/\s/.test(v)) return { ok: false, hard: true, msg: 'Email addresses can’t contain spaces.' };
  const parts = v.split('@');
  if (parts.length === 1) return { ok: false, msg: 'Missing the “@” — e.g. you@example.com' };
  if (parts.length > 2) return { ok: false, hard: true, msg: 'An email address can only contain one “@”.' };
  const [local, domain] = parts;
  if (!local) return { ok: false, hard: true, msg: 'Add the part before the “@” — e.g. you@example.com' };
  if (/^\.|\.$|\.\./.test(local)) return { ok: false, hard: true, msg: 'The part before “@” can’t start, end, or double up on dots.' };
  if (!domain) return { ok: false, msg: 'Add the domain after the “@” — e.g. example.com' };
  if (!domain.includes('.')) return { ok: false, msg: 'The domain needs a dot — e.g. example.com' };
  if (/\.\./.test(domain) || /^[.-]/.test(domain) || /[.-]$/.test(domain))
    return { ok: false, hard: true, msg: 'That domain doesn’t look right — check for extra dots or dashes.' };
  if (!/\.[A-Za-z]{2,}$/.test(domain)) return { ok: false, msg: 'The domain must end in something like .com or .in' };
  if (!PATTERNS.email.test(v)) return { ok: false, msg: 'Enter a valid email address (e.g. you@example.com)' };
  const suggest = EMAIL_TYPOS[domain.toLowerCase()];
  if (suggest) return { ok: true, msg: '', warn: `Did you mean ${local}@${suggest}?` };
  return { ok: true, msg: '' };
}

/* ── pincode ────────────────────────────────────────────────────────────────
   State + district → PIN is one-to-many (Mumbai alone has 100+), so a PIN
   cannot be auto-filled from a district. We invert it: the user types the
   6-digit PIN and we resolve state + district from it.

   The lookup goes through our own API because connect-src is locked down —
   calling api.postalpincode.in from the browser is blocked, same class of
   failure as the old fetch('data:…'). If the endpoint is missing the field
   degrades silently to plain 6-digit format validation.

     GET /api/v1/locations/pincode/:pincode
     → { success: true, data: { pincode, state, district, area } }
   ------------------------------------------------------------------------ */
const PIN_PATTERN = /^[1-9][0-9]{5}$/;
const PIN_LOOKUP_URL = (pin) => `${API_BASE}/api/v1/locations/pincode/${pin}`;
// Flip on only once https://api.postalpincode.in is allow-listed in connect-src.
const PIN_USE_PUBLIC_FALLBACK = false;
const PIN_FALLBACK_URL = (pin) => `https://api.postalpincode.in/pincode/${pin}`;

const normName = (s) => String(s || '').toLowerCase().replace(/[^a-z]/g, '');

/* Once the endpoint 404s we stop calling it — otherwise every keystroke fires
   another doomed request and floods the console. Set back to true on reload. */
let pinLookupAvailable = true;

async function lookupPincode(pin) {
  if (pinLookupAvailable) {
    try {
      const r = await fetch(PIN_LOOKUP_URL(pin));
      if (r.status === 404 || r.status === 501) {
        pinLookupAvailable = false;
        console.info('[pincode] lookup endpoint not available — state and city stay manual.');
      } else if (r.ok) {
        const j = await r.json();
        const d = Array.isArray(j?.data) ? j.data[0] : j?.data;
        if (d && (d.state || d.state_name)) {
          return {
            state: d.state || d.state_name,
            district: d.district || d.city || d.city_name || '',
            area: d.area || d.office || '',
          };
        }
      }
    } catch {
      pinLookupAvailable = false;
      console.info('[pincode] lookup unreachable — state and city stay manual.');
    }
  }
  if (!PIN_USE_PUBLIC_FALLBACK) return null;
  try {
    const r = await fetch(PIN_FALLBACK_URL(pin));
    const j = await r.json();
    const po = j?.[0]?.Status === 'Success' ? j[0].PostOffice?.[0] : null;
    if (po) return { state: po.State, district: po.District, area: po.Name };
  } catch { /* ignore */ }
  return null;
}

const CATEGORY_ICON_MAP = {
  A: '🎭', B: '💼', C: '😂', D: '🎓', E: '🌿', F: '👗',
  G: '🍽️', H: '💊', I: '🌍', J: '⚖️', K: '🎵', L: '🏅',
  M: '🔬', N: '✈️', O: '🌟', P: '➕',
};

/* Pick the icon from the category NAME, not the position-based single-letter
   code (which the API doesn't order predictably, so Music was getting Acting's
   mask). Code map stays as a last-resort fallback. */
const CATEGORY_KEYWORDS = [
  [/act|drama|theat|film|movie|cinema/i, '🎭'], [/business|entrepreneur|financ|market/i, '💼'],
  [/comed|humou?r|funny|meme/i, '😂'], [/edu|learn|teach|academ|study/i, '🎓'],
  [/health|wellness|fitness|yoga|nutrition/i, '🌿'], [/fashion|style|beauty|makeup|model/i, '👗'],
  [/food|cook|chef|recipe|culinary/i, '🍽️'], [/medic|doctor|pharma|clinic/i, '💊'],
  [/travel|tourism|adventure|explor/i, '✈️'], [/law|legal|advocate|justice/i, '⚖️'],
  [/music|singer|song|dj|audio/i, '🎵'], [/sport|athlet|gaming|esport/i, '🏅'],
  [/scien|tech|research|engineer/i, '🔬'], [/lifestyle|vlog|daily/i, '🌍'],
  [/art|design|paint|craft|photo/i, '🎨'], [/danc|choreo/i, '💃'],
];
function pickCategoryIcon(cat) {
  const hay = `${cat.category_name || ''} ${cat.description || ''}`;
  for (const [re, icon] of CATEGORY_KEYWORDS) if (re.test(hay)) return icon;
  return CATEGORY_ICON_MAP[cat.category_code] || '🌟';
}

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const POLICY_LINKS = [
  { label: 'Privacy Policy',   href: 'https://uat-api.fameo.info/privacy-policy.html',       icon: '🔒' },
  { label: 'Terms of Service', href: 'https://uat-api.fameo.info/terms-and-conditions.html', icon: '📋' },
  { label: 'Cookie Policy',    href: 'https://uat-api.fameo.info/cookie-policy.html',        icon: '🍪' },
];

const STEPS = [
  { kicker: 'STEP 01 — IDENTITY', lead: 'Your',   accent: 'identity',
    sub: 'Enter your legal name, verify your mobile and email, and confirm your age. This stays private — used only by our verification team.' },
  { kicker: 'STEP 02 — PROFILE',  lead: 'Your',   accent: 'profile',
    sub: 'Pick a unique username and tell us a little about where you are. Your username is public — everything else stays private.' },
  { kicker: 'STEP 03 — SOCIALS',  lead: 'Your',   accent: 'socials',
    sub: 'Link your public profiles. At least one platform is required — followers are never combined.' },
  { kicker: 'STEP 04 — CATEGORY', lead: 'Your',   accent: 'category',
    sub: 'Select the category and profession that best describe your public profile.' },
  { kicker: 'STEP 05 — PROOF',    lead: 'Almost', accent: 'famous',
    sub: 'Complete a live blink check and upload supporting documents to finish your application.' },
];

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

/* ── CSS ─────────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400;1,9..144,500&family=Schibsted+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

.frg, .frg *, .frg *::before, .frg *::after { box-sizing: border-box; margin: 0; padding: 0; }
.frg {
  --canvas:#F2EFE9;
  --card:#FBFAF7;
  --tile:#E8E4DD;
  --ink:#1A1A1A;
  --muted:#8B8781;
  --muted2:#A8A49C;
  --p1:#DD8164;
  --p2:#D45A79;
  --p3:#C96A6B;
  --peach:#FFC98F;
  --grad: linear-gradient(135deg,#FFC98F 20%,#DD8164 58%,#D45A79 88%);
  --grad-btn: linear-gradient(135deg,#FFC98F 12%,#DD8164 52%,#D45A79 92%);
  --tint: rgba(212,90,121,.10);
  --tint-2: rgba(212,90,121,.18);
  --blue:#2757F0;
  --line: rgba(26,26,26,.12);
  --line-soft: rgba(26,26,26,.07);
  --amber:#B07A12;
  --err:#C0392B;
  --green:#0e9f5a; --green-bg:rgba(14,159,90,.08);
  --red:#e03030;   --red-bg:rgba(224,48,48,.08);
  --amber-bg:rgba(176,122,18,.08);
  --ink-2:#5a2f2f; --ink-3:#a5615f; --ink-4:#d0a08f;
  --f-bg:#fff;
  --ease: cubic-bezier(.22,1,.36,1);
  font-family: 'Schibsted Grotesk', sans-serif;
  color: var(--ink);
  min-height: 100svh;
  position: relative; overflow: hidden;
  background:
    radial-gradient(1100px 700px at 12% -10%, rgba(212,90,121,.16), transparent 62%),
    radial-gradient(900px 700px at 92% 108%, rgba(255,201,143,.16), transparent 60%),
    var(--canvas);
  display: flex; align-items: flex-start; justify-content: center;
  padding: 6vh 24px 10vh;
}
.frg::after {
  content:''; position:absolute; inset:0; pointer-events:none; opacity:.55;
  background-image: radial-gradient(rgba(26,26,26,.035) 1px, transparent 1px);
  background-size: 3px 3px;
}

.frg-orbit { position: fixed; z-index: 1; pointer-events: none; width: 360px; height: 360px; opacity: .8; }
.frg-orbit.l { left: -90px; top: 7%; }
.frg-orbit.r { right: -100px; bottom: 5%; }
.frg-orbit circle {
  fill: none; stroke: var(--ink); stroke-width: 1; opacity: .16;
  stroke-dasharray: 5 12; animation: frgSpin 44s linear infinite; transform-origin: 50% 50%;
}
.frg-orbit circle:nth-child(2) { stroke: var(--p2); opacity: .5; stroke-dasharray: 2 26; animation: frgSpin 26s linear infinite reverse; }
@keyframes frgSpin { to { transform: rotate(360deg); } }

/* ════ card ══════════════════════════════════════════════════════ */
.frg-card {
  position: relative; z-index: 2;
  width: min(640px, 94vw);
  border-radius: 20px;
  border: 1px solid var(--line);
  background: var(--card);
  padding: clamp(24px, 4vw, 42px) clamp(20px, 4vw, 46px) clamp(24px, 3.5vw, 38px);
  box-shadow: 0 40px 110px rgba(26,26,26,.13), 0 4px 14px rgba(26,26,26,.05);
  animation: frgCardIn .8s var(--ease) both;
}
.frg-card::before {
  content:''; position:absolute; top:0; left:0; right:0; height:3px;
  background: linear-gradient(90deg, var(--peach), var(--p1) 45%, var(--p2) 80%, transparent);
  border-radius: 20px 20px 0 0;
}
@keyframes frgCardIn { from { opacity:0; transform: translateY(26px) scale(.985); } to { opacity:1; transform:none; } }

/* ════ brand header ══════════════════════════════════════════════ */
.frg-brand { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid var(--line-soft); }
.frg-brand-mark { display: flex; align-items: center; gap: 13px; text-decoration: none; }
.frg-brand-mark img { height: 32px; width: auto; max-width: 200px; display: block; object-fit: contain; }
.frg-brand-word { font-family:'Schibsted Grotesk',sans-serif; font-weight: 700; font-size: 24px; letter-spacing: -.035em; color: var(--ink); position: relative; }
.frg-brand-word .dot { display: inline-block; width: .5em; height: .5em; border-radius: 50%; background: var(--grad); margin-left: .06em; vertical-align: .04em; transform: scale(0); animation: frgDotPop .55s var(--ease) .35s forwards; }
@keyframes frgDotPop { to { transform: scale(1); } }
.frg-brand-rule { width: 1px; height: 22px; flex: none; background: linear-gradient(to bottom, transparent, var(--line), transparent); }
.frg-brand-sub { font-family:'Space Mono',monospace; font-size: 8.5px; letter-spacing: .26em; text-transform: uppercase; color: var(--muted); }
.frg-brand-back { font-family:'Space Mono',monospace; font-size: 10px; letter-spacing: .18em; color: var(--muted); text-decoration: none; white-space: nowrap; transition: color .25s; }
.frg-brand-back:hover { color: var(--ink); }
@media (max-width: 560px) { .frg-brand-rule, .frg-brand-sub { display: none; } }

/* ════ headline / rules / fields ═════════════════════════════════ */
.frg-kicker { font-family:'Space Mono',monospace; font-size: 11px; letter-spacing:.24em; color: var(--muted); margin-bottom: 16px; }
.frg-h1 { font-family:'Fraunces',serif; font-weight: 400; font-size: clamp(32px, 4.4vw, 50px); line-height: 1.05; letter-spacing: -.01em; margin-bottom: 16px; }
.frg-h1 em {
  font-style: italic; font-weight: 500;
  background: linear-gradient(100deg,#E9A063 0%, #DD8164 45%, #D45A79 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;
  position: relative; display: inline-block; padding: 0 .06em;
}
.frg-h1 em::before {
  content:''; position:absolute; left:0; right:0; bottom:.1em; height:.34em; z-index:-1;
  background: var(--tint-2); border-radius: 2px; transform: scaleX(0); transform-origin: 0 50%;
  animation: frgHighlight .75s var(--ease) .25s forwards;
}
@keyframes frgHighlight { to { transform: scaleX(1); } }
.frg-sub { font-size: 15px; font-weight: 300; color: var(--muted); line-height: 1.6; max-width: 540px; }

.frg-rule {
  display: flex; align-items: center; gap: 16px; margin: 34px 0 22px;
  font-family:'Space Mono',monospace; font-size: 10.5px; letter-spacing:.22em; color: var(--muted); white-space: nowrap;
}
.frg-rule::after { content:''; flex:1; height:1px; background: linear-gradient(90deg, var(--line), transparent); }

.frg-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 34px; }
.frg-field { margin-bottom: 26px; position: relative; scroll-margin-top: 90px; }
.frg-label { display: flex; align-items: center; gap: 10px; font-size: 13.5px; font-weight: 600; margin-bottom: 6px; flex-wrap: wrap; }
.frg-label .req { color: var(--p2); }
.frg-label .opt { font-family:'Space Mono',monospace; font-size: 8.5px; letter-spacing:.14em; color: var(--muted2); text-transform: uppercase; font-weight: 700; }
/* inline "change mobile / email" control shown once OTP is sent */
.frg-change { margin-left: auto; font-family:'Space Mono',monospace; font-size: 9px; letter-spacing:.14em; text-transform: uppercase; color: var(--p2); background: none; border: none; cursor: pointer; }
.frg-change:hover { text-decoration: underline; text-underline-offset: 3px; }
.frg-input, .frg-select, .frg-area, .frg-select2 {
  width: 100%; background: transparent; border: none; outline: none;
  border-bottom: 1px solid var(--line);
  color: var(--ink); font-family:'Schibsted Grotesk',sans-serif;
  font-size: 17px; font-weight: 400; padding: 12px 2px; transition: border-color .3s; border-radius: 0;
}
.frg-area { resize: vertical; min-height: 74px; line-height: 1.55; }
.frg-input::placeholder, .frg-area::placeholder { color: var(--muted2); font-weight: 300; }
.frg-input.mono { font-family:'Space Mono',monospace; font-size: 15px; letter-spacing: .08em; text-transform: uppercase; }
.frg-uline { position: relative; }
.frg-uline::after {
  content:''; position:absolute; left:0; right:0; bottom:0; height:2px;
  background: var(--grad); transform: scaleX(0); transform-origin: 0 50%; transition: transform .45s var(--ease);
}
.frg-uline:focus-within::after { transform: scaleX(1); }
.frg-uline.err { border-bottom: none; }
.frg-uline.err .frg-input { border-bottom-color: var(--err); }
.frg-uline.err::after { background: var(--err); transform: scaleX(1); }
.frg-uline.ok .frg-input, .frg-uline.ok .frg-select2 { border-bottom-color: var(--green); }
.frg-help { font-size: 12px; color: var(--muted); margin-top: 8px; font-weight: 300; }
.frg-help.err  { color: var(--err); font-weight: 400; }
/* success state is green — it used to inherit --p2 (pink), which read as an
   error even when the username was available */
.frg-help.ok   { color: var(--green); font-weight: 400; }
.frg-help.warn { color: var(--amber); font-weight: 400; }

/* align the country-code baseline with the input underline */
.frg-mobile { display: flex; align-items: flex-end; gap: 18px; }
.frg-cc {
  display: flex; align-items: center; gap: 6px; flex: none;
  padding: 12px 2px;
  border-bottom: 1px solid var(--line);
  align-self: flex-end;
}
.frg-cc .iso { font-family:'Space Mono',monospace; font-size: 11px; color: var(--muted); letter-spacing:.08em; }
.frg-cc .frg-select { padding: 0 4px 0 0; }
.frg-select { width: auto; font-weight: 600; font-size: 16px; cursor: pointer; padding-right: 4px; }
.frg-select option, .frg-select2 option { background: var(--card); color: var(--ink); }
.frg-mobile .frg-uline { flex: 1; }

.frg-selwrap { position: relative; }
.frg-selwrap::after {
  content:''; position:absolute; right:6px; top:50%; width:8px; height:8px;
  border-right:1.5px solid var(--muted2); border-bottom:1.5px solid var(--muted2);
  transform: translateY(-70%) rotate(45deg); pointer-events:none;
}
.frg-select2 { padding: 12px 22px 12px 2px; appearance: none; cursor: pointer; }
.frg-select2:disabled { color: var(--muted2); cursor: not-allowed; }

.frg-pill {
  display: inline-flex; align-items: center; gap: 6px;
  font-family:'Space Mono',monospace; font-size: 9px; font-weight: 700; letter-spacing:.16em;
  padding: 4px 11px; border-radius: 20px;
  border: 1px solid rgba(176,122,18,.4); color: var(--amber); background: rgba(176,122,18,.06);
}
.frg-pill .dot { width: 5px; height: 5px; border-radius: 50%; background: var(--amber); animation: frgPulse 1.6s ease-in-out infinite; }
@keyframes frgPulse { 50% { opacity:.35; } }
.frg-pill.ok { border-color: transparent; color: #fff; background: var(--grad); }
.frg-pill.ok .dot { background: #fff; animation: none; }
.frg-pill.err { border-color: rgba(192,57,43,.45); color: var(--err); background: rgba(192,57,43,.06); }
.frg-pill.err .dot { background: var(--err); }

.frg-otp {
  display: inline-flex; align-items: center; gap: 10px;
  font-family:'Space Mono',monospace; font-size: 11.5px; font-weight: 700; letter-spacing:.22em;
  padding: 15px 30px; border-radius: 50px; cursor: pointer;
  color: var(--p2); background: transparent; border: 1.5px solid rgba(212,90,121,.45);
  transition: background .3s, color .3s, border-color .3s, transform .15s var(--ease), box-shadow .3s; margin-top: 4px;
}
.frg-otp:hover:not(:disabled) { background: var(--grad); border-color: transparent; color: #fff; box-shadow: 0 10px 30px rgba(212,90,121,.4); }
.frg-otp:active:not(:disabled) { transform: scale(.97); }
.frg-otp:disabled { opacity: .32; cursor: not-allowed; }
.frg-otp svg { width: 14px; height: 14px; }

.frg-otp-panel { margin-top: 22px; padding: 24px 24px 20px; border: 1px solid rgba(212,90,121,.35); border-radius: 12px; background: var(--tint); animation: frgUp .5s var(--ease) both; }
.frg-otp-panel-title { font-family:'Space Mono',monospace; font-size: 10px; letter-spacing: .2em; color: var(--muted); margin-bottom: 16px; }
.frg-otp-digits { display: flex; gap: 10px; flex-wrap: wrap; }
.frg-otp-digit {
  width: 48px; height: 56px; text-align: center;
  font-family:'Space Mono',monospace; font-size: 21px; font-weight: 700;
  color: var(--ink); background: #fff; border: 1px solid var(--line); border-radius: 10px; outline: none;
  transition: border-color .25s, box-shadow .25s; caret-color: var(--p2);
}
.frg-otp-digit:focus { border-color: var(--p2); box-shadow: 0 0 0 4px rgba(212,90,121,.16); }
.frg-otp-digit.filled { border-color: rgba(212,90,121,.5); }
.frg-otp-panel.shake .frg-otp-digit { animation: frgShake .4s var(--ease); border-color: var(--err); }
@keyframes frgShake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-3px); } }
.frg-otp-actions { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-top: 18px; flex-wrap: wrap; }
.frg-verify {
  display: inline-flex; align-items: center; gap: 10px;
  font-family:'Space Mono',monospace; font-size: 10.5px; font-weight: 700; letter-spacing:.2em;
  color: #fff; background: var(--grad); border: none; border-radius: 50px; padding: 13px 28px; cursor: pointer;
  box-shadow: 0 10px 30px rgba(212,90,121,.35); transition: transform .15s var(--ease), box-shadow .3s, opacity .3s;
}
.frg-verify:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 16px 40px rgba(212,90,121,.5); }
.frg-verify:active:not(:disabled) { transform: scale(.96); }
.frg-verify:disabled { opacity: .34; cursor: not-allowed; box-shadow: none; }
.frg-resend { font-family:'Space Mono',monospace; font-size: 10px; letter-spacing: .16em; background: none; border: none; cursor: pointer; color: var(--p2); padding: 6px 2px; transition: color .25s; }
.frg-resend:hover:not(:disabled) { text-decoration: underline; text-underline-offset: 3px; }
.frg-resend:disabled { color: var(--muted2); cursor: default; }
.frg-otp-status { font-family:'Space Mono',monospace; font-size: 10px; letter-spacing: .1em; margin-top: 12px; }
.frg-otp-status.verified { color: var(--green); }
.frg-otp-status.error { color: var(--err); }
.frg-otp-status.pending { color: var(--muted); }
.frg-otp-done {
  display: inline-flex; align-items: center; gap: 12px; margin-top: 22px; padding: 16px 24px;
  border: 1px solid rgba(14,159,90,.4); border-radius: 12px; background: var(--green-bg);
  font-family:'Space Mono',monospace; font-size: 10.5px; font-weight: 700; letter-spacing: .18em; color: var(--green);
  animation: frgUp .5s var(--ease) both;
}
.frg-otp-done svg { width: 18px; height: 18px; flex: none; }

.frg-check {
  display: flex; align-items: flex-start; gap: 16px; border: 1px solid var(--line); border-radius: 12px;
  padding: 18px 20px; margin-bottom: 14px; cursor: pointer; background: transparent;
  transition: border-color .3s, background .3s, opacity .3s; scroll-margin-top: 90px;
}
.frg-check:hover { border-color: rgba(212,90,121,.4); background: var(--tint); }
.frg-check.on { border-color: var(--p2); background: var(--tint); }
.frg-check.err { border-color: rgba(192,57,43,.5); background: rgba(192,57,43,.05); }
.frg-check.locked { cursor: default; opacity: .75; }
.frg-check.locked:hover { border-color: var(--line); background: transparent; }
.frg-check.locked.on:hover { border-color: var(--p2); background: var(--tint); }
.frg-check.locked.err:hover { border-color: rgba(192,57,43,.5); background: rgba(192,57,43,.05); }
.frg-box { width: 20px; height: 20px; flex: none; margin-top: 1px; border: 1.5px solid var(--line); border-radius: 5px; background: #fff; display: grid; place-items: center; transition: background .25s, border-color .25s; }
.frg-check.on .frg-box { background: var(--grad); border-color: transparent; animation: frgBoxPop .3s var(--ease); }
.frg-check.err .frg-box { border-color: var(--err); }
@keyframes frgBoxPop { 40% { transform: scale(1.25); } }
.frg-box svg { width: 12px; height: 12px; stroke: #fff; stroke-width: 3; fill: none; opacity: 0; transition: opacity .15s; }
.frg-check.on .frg-box svg { opacity: 1; }
.frg-check p { font-size: 14px; font-weight: 300; line-height: 1.55; color: #3a3833; }
.frg-check .frg-check-note { color: var(--green); font-weight: 500; }
.frg-check .frg-check-err { display: block; margin-top: 6px; font-size: 12px; font-weight: 400; color: var(--err); }
.frg-check a { color: var(--p2); text-decoration: none; }
.frg-check a:hover { text-decoration: underline; text-underline-offset: 3px; }
.frg-consent-err { font-size: 12px; color: var(--err); margin-top: 8px; display: flex; align-items: center; gap: 6px; }

.frg-at { font-family:'Space Mono',monospace; color: var(--muted); font-size: 17px; padding-right: 6px; border-bottom: 1px solid var(--line); display: flex; align-items: center; }
.frg-user-row { display: flex; }
.frg-user-row .frg-uline { flex: 1; }

/* notes */
.frg-note { border-radius: 12px; padding: 12px 16px; font-size: 13px; font-weight: 300; line-height: 1.55; margin: 14px 0; }
.frg-note.soft  { background: var(--tint); border: 1px solid rgba(212,90,121,.18); color: #6b5a52; }
.frg-note.green { background: var(--green-bg); border: 1px solid rgba(14,159,90,.2); color: var(--green); }
.frg-note.amber { background: var(--amber-bg); border: 1px solid rgba(176,122,18,.25); color: var(--amber); }
.frg-note.red   { background: var(--red-bg); border: 1px solid rgba(224,48,48,.2); color: var(--red); }
.frg-note b { font-weight: 600; }
.frg-note a { color: var(--p2); cursor: pointer; text-decoration: none; font-weight: 500; }
.frg-note a:hover { text-decoration: underline; text-underline-offset: 3px; }

/* referral applied card */
.frg-ref-applied {
  display: flex; align-items: center; gap: 13px; margin-top: 12px; padding: 13px 16px;
  border: 1px solid rgba(14,159,90,.35); border-radius: 12px; background: var(--green-bg);
  animation: frgUp .4s var(--ease) both;
}
.frg-ref-applied .frg-ref-ico { width: 30px; height: 30px; border-radius: 8px; background: var(--grad); display: grid; place-items: center; color: #fff; font-size: 14px; flex: none; }
.frg-ref-applied .frg-ref-txt { flex: 1; min-width: 0; }
.frg-ref-applied .frg-ref-ttl { font-size: 13px; font-weight: 600; color: var(--green); }
.frg-ref-applied .frg-ref-sub { font-size: 11.5px; color: #4a6a54; margin-top: 2px; }
.frg-ref-applied .frg-ref-rm { border: none; background: none; color: var(--muted); font-size: 18px; cursor: pointer; line-height: 1; flex: none; }
.frg-ref-applied .frg-ref-rm:hover { color: var(--err); }

/* ════ live-check explainer card (step 05) ═══════════════════════ */
.frg-livecard {
  border: 1px solid rgba(212,90,121,.22); border-radius: 18px; overflow: hidden;
  background: linear-gradient(160deg, rgba(255,201,143,.10), rgba(212,90,121,.06));
  margin-bottom: 16px; scroll-margin-top: 90px;
}
.frg-livecard.err { border-color: rgba(224,48,48,.35); background: var(--red-bg); }
.frg-livecard-hdr { display: flex; align-items: center; gap: 13px; padding: 16px 18px 14px; }
.frg-livecard-ico {
  width: 40px; height: 40px; border-radius: 12px; flex: none; display: grid; place-items: center;
  background: var(--grad); box-shadow: 0 8px 22px rgba(212,90,121,.32);
}
.frg-livecard-ttl { font-family:'Fraunces',serif; font-weight: 500; font-size: 17px; color: var(--ink); line-height: 1.25; }
.frg-livecard-sub { font-size: 12px; font-weight: 300; color: var(--muted); margin-top: 2px; }
.frg-livecard-body { padding: 0 18px 18px; }
.frg-livesteps { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
.frg-livestep { display: flex; align-items: flex-start; gap: 12px; }
.frg-livestep-n {
  width: 22px; height: 22px; border-radius: 50%; flex: none; display: grid; place-items: center;
  font-family:'Space Mono',monospace; font-size: 9.5px; font-weight: 700;
  color: var(--p2); background: #fff; border: 1px solid rgba(212,90,121,.35); margin-top: 1px;
}
.frg-livestep-txt { font-size: 13.5px; font-weight: 300; color: #4a423e; line-height: 1.5; }
.frg-livestep-txt b { font-weight: 600; color: var(--ink); }
.frg-livereq { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 16px; }
.frg-livereq span {
  font-family:'Space Mono',monospace; font-size: 8.5px; letter-spacing: .12em; text-transform: uppercase;
  padding: 5px 10px; border-radius: 20px; color: var(--muted);
  background: rgba(255,255,255,.7); border: 1px solid var(--line-soft);
}
.frg-livestart {
  width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 11px;
  font-family:'Space Mono',monospace; font-size: 11.5px; font-weight: 700; letter-spacing: .2em;
  color: #fff; background: var(--grad-btn); border: none; border-radius: 14px; padding: 17px 24px; cursor: pointer;
  box-shadow: 0 14px 36px rgba(212,90,121,.34); transition: transform .18s var(--ease), box-shadow .3s;
}
.frg-livestart:hover { transform: translateY(-2px); box-shadow: 0 20px 50px rgba(212,90,121,.46); }
.frg-livestart:active { transform: scale(.98); }

/* ════ category grid ═════════════════════════════════════════════ */
.frg-catgrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; scroll-margin-top: 90px; }
.frg-cat {
  border: 1px solid var(--line); border-radius: 14px; padding: 16px 10px; cursor: pointer; text-align: center; background: transparent;
  transition: border-color .25s, background .25s, transform .2s var(--ease), box-shadow .25s;
}
.frg-cat:hover { transform: translateY(-3px); border-color: rgba(212,90,121,.45); box-shadow: 0 12px 30px rgba(26,26,26,.1); }
.frg-cat:focus-visible { outline: 2px solid var(--p2); outline-offset: 2px; }
.frg-cat.on { border-color: var(--p2); background: var(--tint); box-shadow: 0 14px 34px rgba(212,90,121,.18); }
.frg-catgrid.err .frg-cat { border-color: rgba(192,57,43,.4); }
.frg-cat-ico { font-size: 22px; margin-bottom: 8px; }
.frg-cat-lbl { font-size: 10.5px; font-weight: 500; color: var(--muted); line-height: 1.3; letter-spacing: .01em; }
.frg-cat.on .frg-cat-lbl { color: var(--p2); }
.frg-cat-skel { border: 1px dashed var(--line); border-radius: 14px; padding: 16px 10px; text-align: center; animation: frgPulse2 1.4s ease-in-out infinite; }
@keyframes frgPulse2 { 0%,100% { opacity:.5; } 50% { opacity:1; } }
.frg-cat-skel-ico { width: 24px; height: 24px; border-radius: 50%; background: var(--line); margin: 0 auto 8px; }
.frg-cat-skel-lbl { width: 42px; height: 7px; border-radius: 3px; background: var(--line); margin: 0 auto; }

/* ════ documents ═════════════════════════════════════════════════ */
.frg-docs { display: flex; flex-direction: column; gap: 12px; scroll-margin-top: 90px; }
.frg-doc-slot { border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: #fff; }
.frg-doc-hdr { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: var(--tint); border-bottom: 1px solid var(--line-soft); }
.frg-doc-lbl { font-family:'Space Mono',monospace; font-size: 9.5px; letter-spacing: .14em; color: var(--p3); text-transform: uppercase; }
.frg-doc-rm { border: none; background: none; color: var(--muted); font-size: 18px; cursor: pointer; line-height: 1; }
.frg-doc-rm:hover { color: var(--err); }
.frg-doc-up { display: flex; align-items: center; gap: 12px; padding: 15px 16px; cursor: pointer; transition: background .2s; }
.frg-doc-up:hover { background: var(--tint); }
.frg-doc-up-txt { font-size: 13.5px; color: var(--p3); flex: 1; }
.frg-doc-up-sub { font-family:'Space Mono',monospace; font-size: 8px; letter-spacing: .1em; color: var(--muted2); }
.frg-doc-file { display: flex; align-items: center; gap: 12px; padding: 13px 16px; }
.frg-doc-fico { width: 30px; height: 30px; border-radius: 7px; background: var(--tint); display: grid; place-items: center; flex: none; }
.frg-doc-fname { font-size: 13px; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.frg-doc-fsize { font-family:'Space Mono',monospace; font-size: 9px; color: var(--muted); }
.frg-upload { border: 1.5px dashed rgba(212,90,121,.3); border-radius: 14px; padding: 26px 16px; text-align: center; cursor: pointer; background: var(--tint); transition: border-color .2s; }
.frg-upload:hover { border-color: var(--p2); }
.frg-upload-ttl { font-size: 14px; color: #3a3833; margin-bottom: 4px; }
.frg-upload-sub { font-family:'Space Mono',monospace; font-size: 8px; letter-spacing: .1em; color: var(--muted2); }
.frg-file { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px; margin-bottom: 8px; background: #fff; }
.frg-file-name { flex: 1; font-size: 13px; color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.frg-file-sz { font-family:'Space Mono',monospace; font-size: 9px; color: var(--muted); }
.frg-file-rm { color: var(--muted); cursor: pointer; font-size: 16px; }
.frg-file-rm:hover { color: var(--err); }

/* ════ selfie result card ════════════════════════════════════════ */
.frg-selfie { display: flex; align-items: flex-start; gap: 16px; background: var(--tint); border: 1px solid rgba(212,90,121,.2); border-radius: 14px; padding: 16px 18px; margin-bottom: 14px; }
.frg-selfie.done  { background: var(--green-bg); border-color: rgba(14,159,90,.3); }
.frg-selfie.error { background: var(--red-bg); border-color: rgba(224,48,48,.28); }
.frg-selfie-img { width: 68px; height: 68px; border-radius: 50%; object-fit: cover; border: 2px solid var(--p2); flex: none; }
.frg-selfie.done .frg-selfie-img  { border-color: var(--green); }
.frg-selfie.error .frg-selfie-img { border-color: var(--err); }
.frg-selfie-info { flex: 1; min-width: 0; }
.frg-selfie-name { font-size: 13px; font-weight: 500; color: #3a3833; margin-bottom: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.frg-selfie-row { display: flex; align-items: center; gap: 7px; font-size: 12.5px; }
.frg-selfie-row.analyzing, .frg-selfie-row.uploading { color: var(--amber); }
.frg-selfie-row.done { color: var(--green); font-weight: 500; }
.frg-selfie-row.error { color: var(--err); }
.frg-selfie-live {
  display: inline-flex; align-items: center; gap: 6px; margin-top: 8px;
  font-family:'Space Mono',monospace; font-size: 8.5px; font-weight: 700; letter-spacing: .16em;
  padding: 4px 10px; border-radius: 20px; color: #fff; background: var(--grad);
}

/* spinner */
.frg-spin { width: 14px; height: 14px; border: 2px solid rgba(212,90,121,.2); border-top-color: var(--p2); border-radius: 50%; animation: frgSpinc .7s linear infinite; display: inline-block; flex: none; }
.frg-spin.white { border-color: rgba(255,255,255,.25); border-top-color: #fff; }
@keyframes frgSpinc { to { transform: rotate(360deg); } }

/* ════ success ═══════════════════════════════════════════════════ */
.frg-success { text-align: center; padding: 16px 8px 6px; animation: frgUp .6s var(--ease) both; }
.frg-suc-ico { width: 72px; height: 72px; border-radius: 50%; background: var(--green-bg); border: 1px solid rgba(14,159,90,.2); display: grid; place-items: center; margin: 0 auto 20px; box-shadow: 0 0 0 12px rgba(14,159,90,.04); }
.frg-suc-ico svg { width: 30px; height: 30px; }
.frg-suc-tbl { border: 1px solid var(--line); border-radius: 14px; overflow: hidden; max-width: 400px; margin: 24px auto 0; text-align: left; background: #fff; }
.frg-suc-row { display: flex; justify-content: space-between; gap: 14px; padding: 12px 18px; border-bottom: 1px solid var(--line-soft); font-size: 13.5px; }
.frg-suc-row:last-child { border-bottom: none; }
.frg-suc-k { font-family:'Space Mono',monospace; font-size: 9.5px; letter-spacing: .16em; color: var(--muted); }
.frg-suc-v { font-weight: 500; color: var(--ink); text-align: right; overflow-wrap: anywhere; }

/* ════ footer nav ════════════════════════════════════════════════ */
.frg-foot { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-top: 38px; padding-top: 28px; border-top: 1px solid var(--line-soft); }
.frg-foot-label { font-family:'Space Mono',monospace; font-size: 10.5px; letter-spacing:.22em; color: var(--muted); }
.frg-foot-actions { display: flex; align-items: center; gap: 14px; }
.frg-back { display: inline-flex; align-items: center; gap: 10px; font-family:'Space Mono',monospace; font-size: 11px; font-weight: 700; letter-spacing:.18em; color: var(--muted); background: transparent; cursor: pointer; border: 1px solid var(--line); border-radius: 50px; padding: 16px 28px; transition: color .25s, border-color .25s, transform .15s var(--ease); }
.frg-back:hover:not(:disabled) { color: var(--p2); border-color: rgba(212,90,121,.5); }
.frg-back:active:not(:disabled) { transform: scale(.96); }
.frg-back:disabled { opacity: .4; cursor: not-allowed; }
.frg-continue {
  position: relative; overflow: hidden;
  display: inline-flex; align-items: center; gap: 12px;
  font-family:'Space Mono',monospace; font-size: 12px; font-weight: 700; letter-spacing:.2em;
  color: #fff; background: var(--grad); border: none; border-radius: 50px; padding: 18px 40px; cursor: pointer;
  box-shadow: 0 16px 44px rgba(212,90,121,.4); transition: transform .2s var(--ease), box-shadow .3s, opacity .3s;
}
.frg-continue::after {
  content:''; position:absolute; inset:0;
  background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.35) 50%, transparent 70%);
  transform: translateX(-160%); transition: transform .7s var(--ease);
}
.frg-continue:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 26px 70px rgba(212,90,121,.55); }
.frg-continue:hover:not(:disabled)::after { transform: translateX(160%); }
.frg-continue:active:not(:disabled) { transform: scale(.97); }
.frg-continue.soft-disabled { opacity: .58; box-shadow: none; }
.frg-continue:disabled { opacity: .34; cursor: not-allowed; box-shadow: none; }
.frg-continue .arr { transition: transform .3s var(--ease); }
.frg-continue:hover:not(:disabled) .arr { transform: translateX(5px); }

/* ════ step transitions ══════════════════════════════════════════ */
.frg-panel.fwd { animation: frgFwd .5s var(--ease) both; }
.frg-panel.bwd { animation: frgBwd .5s var(--ease) both; }
@keyframes frgFwd { from { opacity:0; transform: translateX(46px); } to { opacity:1; transform:none; } }
@keyframes frgBwd { from { opacity:0; transform: translateX(-46px); } to { opacity:1; transform:none; } }
.frg-stag { animation: frgUp .7s var(--ease) both; }
@keyframes frgUp { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform:none; } }

/* ══════════════════════════════════════════════════════════════════
   CAMERA MODAL — live-detection UI
   ══════════════════════════════════════════════════════════════════ */
.cam-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: radial-gradient(900px 700px at 50% 12%, rgba(90,32,20,.72), rgba(16,7,4,.96));
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; padding: 18px;
  animation: camIn .24s ease both;
}
@keyframes camIn { from { opacity: 0; } to { opacity: 1; } }
.cam-modal {
  width: 100%; max-width: 470px; background: var(--card);
  border-radius: 24px; overflow: hidden;
  box-shadow: 0 40px 100px rgba(60,20,10,.6), 0 0 0 1px rgba(255,255,255,.06);
  animation: camModalIn .4s var(--ease) both;
}
@keyframes camModalIn { from { opacity: 0; transform: translateY(22px) scale(.97); } to { opacity: 1; transform: none; } }

/* header + segmented step track */
.cam-hdr { padding: 15px 18px 13px; border-bottom: 1px solid var(--line-soft); }
.cam-hdr-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.cam-hdr-ttl { font-family:'Fraunces',serif; font-weight: 500; font-size: 17px; color: var(--ink); display: flex; align-items: center; gap: 9px; }
.cam-live-dot {
  width: 7px; height: 7px; border-radius: 50%; background: var(--p2); flex: none;
  box-shadow: 0 0 0 0 rgba(212,90,121,.7); animation: camLiveDot 1.9s ease-out infinite;
}
@keyframes camLiveDot {
  0% { box-shadow: 0 0 0 0 rgba(212,90,121,.7); }
  70% { box-shadow: 0 0 0 8px rgba(212,90,121,0); }
  100% { box-shadow: 0 0 0 0 rgba(212,90,121,0); }
}
.cam-close { border: none; background: var(--tint); border-radius: 9px; width: 30px; height: 30px; cursor: pointer; font-size: 13px; color: var(--muted); display: grid; place-items: center; transition: background .15s, color .15s; flex: none; }
.cam-close:hover { background: var(--tint-2); color: var(--ink); }
.cam-track { display: flex; gap: 5px; margin-top: 12px; }
.cam-track-seg { flex: 1; height: 3px; border-radius: 3px; background: var(--line); overflow: hidden; position: relative; }
.cam-track-seg i { position: absolute; inset: 0; width: 0%; background: var(--grad-btn); border-radius: 3px; transition: width .25s linear; display: block; }
.cam-track-lbls { display: flex; gap: 5px; margin-top: 6px; }
.cam-track-lbl {
  flex: 1; text-align: center; font-family:'Space Mono',monospace;
  font-size: 7.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted2);
  transition: color .25s;
}
.cam-track-lbl.on { color: var(--p2); font-weight: 700; }
.cam-track-lbl.done { color: var(--green); }

/* viewfinder */
.cam-vf { position: relative; width: 100%; background: #120705; height: clamp(400px, 60vh, 640px); overflow: hidden; }
@media (min-height: 800px) { .cam-vf { height: clamp(460px, 64vh, 720px); } }
.cam-video { width: 100%; height: 100%; object-fit: cover; display: block; }
.cam-video.mirror { transform: scaleX(-1); }

/* face frame — SVG ring with progress arc */
.cam-frame { position: absolute; inset: 0; pointer-events: none; z-index: 3; }
.cam-frame svg { width: 100%; height: 100%; display: block; }
.cam-frame .vignette { fill: rgba(10,4,2,.52); }
.cam-frame .ring-bg { fill: none; stroke: rgba(255,255,255,.28); stroke-width: 2.5; }
.cam-frame .ring-arc {
  fill: none; stroke: url(#camArc); stroke-width: 4; stroke-linecap: round;
  transition: stroke-dashoffset .22s linear;
}
.cam-frame .ring-glow { fill: none; stroke: rgba(212,90,121,.35); stroke-width: 10; filter: blur(6px); opacity: 0; transition: opacity .35s; }
.cam-frame.active .ring-glow { opacity: 1; }
.cam-frame.blink .ring-glow { stroke: rgba(255,201,143,.6); opacity: 1; }
/* corner ticks */
.cam-frame .tick { fill: none; stroke: rgba(255,255,255,.55); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.cam-frame.active .tick { stroke: var(--peach); }

/* scanning sweep during the open-eye hold */
.cam-sweep {
  position: absolute; left: 0; right: 0; height: 90px; z-index: 4; pointer-events: none;
  background: linear-gradient(to bottom, transparent, rgba(255,201,143,.22) 45%, rgba(212,90,121,.32) 55%, transparent);
  animation: camSweep 2.2s var(--ease) infinite;
}
@keyframes camSweep { 0% { top: -12%; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { top: 96%; opacity: 0; } }

/* big countdown ring */
.cam-count-wrap { position: absolute; inset: 0; display: grid; place-items: center; z-index: 6; pointer-events: none; }
.cam-count {
  width: 108px; height: 108px; border-radius: 50%; display: grid; place-items: center;
  background: rgba(16,7,4,.55); border: 2px solid rgba(255,255,255,.25);
  backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
}
.cam-count span {
  font-family:'Fraunces',serif; font-weight: 600; font-size: 54px; line-height: 1; color: #fff;
  text-shadow: 0 4px 22px rgba(0,0,0,.6);
  animation: camCountPop .95s var(--ease) both;
}
@keyframes camCountPop { from { opacity: 0; transform: scale(1.7); } 60% { opacity: 1; } to { opacity: 1; transform: scale(1); } }

/* blink prompt burst */
.cam-blinkburst { position: absolute; inset: 0; display: grid; place-items: center; z-index: 6; pointer-events: none; }
.cam-blinkburst-inner { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.cam-eye {
  width: 78px; height: 50px; display: grid; place-items: center;
  filter: drop-shadow(0 4px 16px rgba(0,0,0,.55));
  animation: camEyeBlink 1.25s ease-in-out infinite;
}
@keyframes camEyeBlink {
  0%, 36%, 54%, 100% { transform: scaleY(1); }
  45% { transform: scaleY(.06); }
}
.cam-blinkword {
  font-family:'Fraunces',serif; font-style: italic; font-weight: 600; font-size: 27px; color: #fff;
  text-shadow: 0 3px 18px rgba(0,0,0,.7); letter-spacing: -.01em;
}
.cam-blink-flash {
  position: absolute; inset: 0; z-index: 5; pointer-events: none;
  background: radial-gradient(circle at 50% 45%, rgba(255,201,143,.5), transparent 62%); opacity: 0;
  animation: camFlash .4s ease both;
}
@keyframes camFlash { 0% { opacity: 1; } 100% { opacity: 0; } }

/* coach strip at the bottom of the viewfinder */
.cam-coach {
  position: absolute; left: 0; right: 0; bottom: 0; z-index: 7;
  padding: 22px 18px 16px;
  background: linear-gradient(to top, rgba(14,6,3,.94) 30%, rgba(14,6,3,0));
  display: flex; flex-direction: column; align-items: center; gap: 7px;
  pointer-events: none;
}
.cam-coach-phase {
  font-family:'Space Mono',monospace; font-size: 8px; font-weight: 700;
  letter-spacing: .3em; text-transform: uppercase; color: #FFCBA0;
}
.cam-coach-msg {
  font-family:'Schibsted Grotesk',sans-serif; font-size: 16px; font-weight: 600;
  color: #fff; text-align: center; line-height: 1.3; text-shadow: 0 2px 14px rgba(0,0,0,.7);
  animation: camCoachIn .32s var(--ease) both;
}
.cam-coach-hint {
  font-family:'Schibsted Grotesk',sans-serif; font-size: 12px; font-weight: 300;
  color: rgba(255,255,255,.68); text-align: center; line-height: 1.45; max-width: 300px;
}
@keyframes camCoachIn { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: none; } }
.cam-coach-frames {
  display: flex; align-items: center; gap: 6px; margin-top: 3px;
  font-family:'Space Mono',monospace; font-size: 8.5px; letter-spacing: .18em; color: rgba(255,255,255,.6);
}
.cam-coach-frames i { width: 5px; height: 5px; border-radius: 50%; background: var(--peach); display: block; animation: frgPulse 1s ease-in-out infinite; }

/* loading + error states */
.cam-loading, .cam-error {
  position: absolute; inset: 0; z-index: 8; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px; padding: 26px; text-align: center;
  background: rgba(14,6,3,.82);
}
.cam-loading-txt { color: rgba(255,255,255,.7); font-size: 12.5px; }
.cam-error-ico { font-size: 30px; }
.cam-error-txt { color: #fff; font-size: 12.5px; line-height: 1.65; max-width: 300px; }
.cam-retry { margin-top: 6px; padding: 10px 22px; border-radius: 10px; border: 1px solid rgba(255,255,255,.3); background: rgba(255,255,255,.1); color: #fff; font-family:'Space Mono',monospace; font-size: 10px; letter-spacing: .12em; cursor: pointer; transition: background .15s; }
.cam-retry:hover { background: rgba(255,255,255,.2); }

/* inline (non-blocking) run error */
.cam-runerr {
  display: flex; align-items: flex-start; gap: 9px;
  padding: 12px 18px; background: var(--red-bg); border-top: 1px solid rgba(224,48,48,.22);
  font-size: 12.5px; font-weight: 400; color: var(--red); line-height: 1.5;
  animation: frgUp .3s var(--ease) both;
}
.cam-runerr span:first-child { flex: none; }

/* checklist shown before starting */
.cam-checklist { padding: 14px 18px 4px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; }
.cam-checkitem { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 300; color: #57504b; }
.cam-checkitem svg { flex: none; }

.cam-controls { padding: 14px 18px 18px; }
.cam-shutter {
  width: 100%; background: var(--grad-btn); border: none; border-radius: 14px; padding: 16px 0; cursor: pointer;
  color: #fff; font-family:'Space Mono',monospace; font-weight: 700; font-size: 11px; letter-spacing: .2em;
  text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 9px;
  box-shadow: 0 14px 36px rgba(212,90,121,.34); transition: box-shadow .2s, filter .2s, transform .18s var(--ease), opacity .2s;
}
.cam-shutter:hover:not(:disabled) { box-shadow: 0 20px 48px rgba(212,90,121,.5); filter: brightness(1.05); transform: translateY(-1px); }
.cam-shutter:active:not(:disabled) { transform: scale(.985); }
.cam-shutter:disabled { opacity: .45; cursor: not-allowed; box-shadow: none; }

/* ════ policy modal ══════════════════════════════════════════════ */
.pm-backdrop { position: fixed; inset: 0; z-index: 9999; background: rgba(18,8,4,.72); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); display: flex; align-items: flex-end; justify-content: center; animation: pmBgIn .25s ease both; }
@keyframes pmBgIn { from { opacity: 0; } to { opacity: 1; } }
@media (min-width: 640px) { .pm-backdrop { align-items: center; padding: 24px; } }
.pm-sheet { position: relative; width: 100%; max-width: 780px; height: 92dvh; max-height: 800px; background: var(--card); border: 1px solid var(--line); border-radius: 20px 20px 0 0; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 -8px 60px rgba(120,50,30,.4), 0 40px 100px rgba(0,0,0,.6); animation: pmSheetIn .32s var(--ease) both; }
@media (min-width: 640px) { .pm-sheet { border-radius: 20px; height: 88dvh; } }
@keyframes pmSheetIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
.pm-sheet.pm-closing { animation: pmSheetOut .22s ease forwards; }
.pm-backdrop.pm-closing { animation: pmBgOut .24s ease forwards; }
@keyframes pmSheetOut { to { opacity: 0; transform: translateY(32px); } }
@keyframes pmBgOut { to { opacity: 0; } }
.pm-topline { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--grad); z-index: 2; border-radius: 20px 20px 0 0; }
.pm-handle { width: 36px; height: 4px; border-radius: 2px; background: var(--line); margin: 14px auto 0; flex: none; }
@media (min-width: 640px) { .pm-handle { display: none; } }
.pm-header { display: flex; align-items: center; gap: 12px; padding: 16px 22px 14px; border-bottom: 1px solid var(--line-soft); flex: none; }
.pm-icon { width: 36px; height: 36px; border-radius: 9px; background: var(--tint); border: 1px solid rgba(212,90,121,.25); display: grid; place-items: center; flex: none; font-size: 15px; }
.pm-title-block { flex: 1; min-width: 0; }
.pm-eyebrow { font-family:'Space Mono',monospace; font-size: 8px; letter-spacing: .28em; text-transform: uppercase; color: var(--p2); margin-bottom: 2px; display: block; }
.pm-title { font-family:'Fraunces',serif; font-weight: 500; font-size: clamp(15px,2vw,18px); color: var(--ink); line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pm-actions { display: flex; align-items: center; gap: 7px; flex: none; }
.pm-action-btn { height: 32px; display: flex; align-items: center; gap: 5px; padding: 0 11px; border-radius: 8px; border: 1px solid var(--line); background: transparent; color: var(--muted); font-family:'Space Mono',monospace; font-size: 9px; letter-spacing: .06em; cursor: pointer; text-decoration: none; white-space: nowrap; transition: border-color .18s, color .18s; }
.pm-action-btn:hover { border-color: rgba(212,90,121,.4); color: var(--p2); }
.pm-close { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--line); background: transparent; display: grid; place-items: center; cursor: pointer; color: var(--muted); transition: border-color .18s, color .18s; flex: none; }
.pm-close:hover { border-color: rgba(212,90,121,.5); color: var(--ink); }
.pm-iframe-wrap { flex: 1; position: relative; overflow: hidden; }
.pm-iframe { width: 100%; height: 100%; border: none; display: block; background: #fff; }
.pm-spinner-ov { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 13px; background: var(--card); z-index: 5; transition: opacity .3s, visibility .3s; }
.pm-spinner-ov.pm-hidden { opacity: 0; visibility: hidden; }
.pm-spin-txt { font-family:'Space Mono',monospace; font-size: 9px; color: var(--muted); letter-spacing: .1em; text-transform: uppercase; }
@media (max-width: 560px) { .pm-header { padding: 13px 14px 11px; } .pm-action-btn span { display: none; } .pm-action-btn { padding: 0 9px; } }

/* ════ responsive / motion ═══════════════════════════════════════ */
@media (max-width: 1360px) { .frg-orbit { display: none; } }
@media (max-width: 720px) { .frg-catgrid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 640px) {
  .frg-row2 { grid-template-columns: 1fr; gap: 0; }
  .frg-foot { flex-direction: column; align-items: stretch; text-align: center; }
  .frg-foot-actions { flex-direction: column-reverse; align-items: stretch; }
  .frg-continue, .frg-back { justify-content: center; }
  .frg-otp-digit { width: 42px; height: 50px; font-size: 18px; }
  .frg-catgrid { grid-template-columns: repeat(3, 1fr); }
  .cam-count { width: 92px; height: 92px; }
  .cam-count span { font-size: 44px; }
  .cam-blinkword { font-size: 23px; }
  .cam-coach-msg { font-size: 15px; }
  .cam-checklist { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .frg-orbit circle, .frg-pill .dot { animation: none; }
  .frg-card, .frg-stag, .frg-panel.fwd, .frg-panel.bwd, .frg-otp-panel, .frg-otp-done { animation: none; }
  .frg-h1 em::before { animation: none; transform: scaleX(1); }
  .frg-brand-word .dot { animation: none; transform: scale(1); }
  .cam-overlay, .cam-modal, .cam-sweep, .cam-eye, .cam-count span,
  .cam-coach-msg, .cam-blink-flash, .cam-live-dot, .cam-coach-frames i { animation: none; }
}
`;

/* ── small pieces ────────────────────────────────────────────────────────── */
const Tick = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="11" fill="#D45A79" />
    <path d="M7 12.5l3.2 3L17 9" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CheckMark = () => (<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>);
const GreenTick = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="11" fill="#0e9f5a" />
    <path d="M7 12.5l3.2 3L17 9" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const EyeGlyph = ({ size = 78, stroke = '#FFC98F' }) => (
  <svg viewBox="0 0 78 50" fill="none" aria-hidden="true" width={size} height={size * 50 / 78}>
    <path d="M3 25C12 10 24.5 3 39 3s27 7 36 22c-9 15-21.5 22-36 22S12 40 3 25z"
      stroke={stroke} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="39" cy="25" r="10" fill={stroke} />
  </svg>
);
const MiniCheck = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="6.2" stroke="#D45A79" strokeWidth="1.2" />
    <path d="M4.3 7.2l1.9 1.9L9.9 5.4" stroke="#D45A79" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Check({ on, toggle, err, locked, errText, refCb, children }) {
  return (
    <div
      ref={refCb}
      className={`frg-check${on ? ' on' : ''}${err ? ' err' : ''}${locked ? ' locked' : ''}`}
      onClick={locked ? undefined : toggle}
      role="checkbox" aria-checked={on} aria-disabled={locked || undefined} tabIndex={0}
      onKeyDown={e => !locked && (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), toggle())}
    >
      <span className="frg-box"><CheckMark /></span>
      <p>{children}{err && errText && <span className="frg-check-err">{errText}</span>}</p>
    </div>
  );
}

/* ── helpers ─────────────────────────────────────────────────────────────── */
/* new Date('2000-11-31') silently rolls over to Dec 1, so calcAge never
   rejected impossible calendar dates. Verify the parts round-trip. */
function isRealDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return false;
  const y = +m[1], mo = +m[2], d = +m[3];
  const dt = new Date(y, mo - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d;
}
function calcAge(dob) {
  if (!isRealDate(dob)) return null;
  const d = new Date(dob + 'T00:00:00');
  const t = new Date();
  let age = t.getFullYear() - d.getFullYear();
  const m = t.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < d.getDate())) age--;
  return age;
}
function maxDobISO() {
  const t = new Date(); t.setFullYear(t.getFullYear() - 18);
  const p = n => String(n).padStart(2, '0');
  return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`;
}
function minDobISO() {
  const t = new Date(); t.setFullYear(t.getFullYear() - 100);
  const p = n => String(n).padStart(2, '0');
  return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`;
}
const fmtSize = (bytes) => bytes < 1048576 ? Math.round(bytes / 1024) + 'KB' : (bytes / 1048576).toFixed(1) + 'MB';
const formatDocLabel = (str) => str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* Social links copied from the mobile apps carry ?igshid= / ?si= tracking
   params, which used to fail validation. Strip query, hash and trailing slash
   before we test or store the URL. */
const cleanUrl = (u) => String(u || '').trim().split(/[?#]/)[0].replace(/\/+$/, '');

/* Server strings like "/api/v1/auth/verify-otp failed (400): Invalid OTP"
   should never reach the user. */
function friendlyOtpError(message = '') {
  const m = message.toLowerCase();
  if (m.includes('expire')) return 'That code has expired — request a new one.';
  if (m.includes('too many') || m.includes('attempt') || m.includes('locked')) return 'Too many attempts. Please request a new code.';
  if (m.includes('network') || m.includes('cors') || m.includes('failed to fetch')) return 'Couldn’t reach the server. Check your connection and try again.';
  return 'That code doesn’t match. Check it and try again.';
}
function friendlyRegisterError(err) {
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

function dataUrlToBlob(dataUrl) {
  const [header, b64] = dataUrl.split(',');
  const mime = (header.match(/:(.*?);/) || [, 'image/jpeg'])[1];
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function livenessHint(message = '') {
  const m = message.toLowerCase();
  if (m.includes('under 18')) return 'You must be 18 or older to register on Fameo.';
  if (m.includes('adult') || m.includes('explicit')) return 'Please retake a normal, clear selfie.';
  if (m.includes('replay') || m.includes('screen')) return 'Use the live camera directly — not a photo of another screen.';
  if (m.includes('blink')) return 'Blink slowly 2–3 times while looking straight at the camera, then retry.';
  if (m.includes('clear face') || m.includes('face')) return 'Improve lighting, centre your face, and keep only one face in frame.';
  return 'Please retry the live check.';
}
function isFatalLiveness(message = '') {
  const m = message.toLowerCase();
  return m.includes('under 18') || m.includes('adult') || m.includes('explicit');
}

/* ── Policy Modal ────────────────────────────────────────────────────────── */
function PolicyModal({ policy, onClose }) {
  const [loaded, setLoaded] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
  const handleClose = () => { setClosing(true); setTimeout(onClose, 240); };

  return (
    <div className={`pm-backdrop${closing ? ' pm-closing' : ''}`}
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
      role="dialog" aria-modal="true" aria-label={policy.label}>
      <div className={`pm-sheet${closing ? ' pm-closing' : ''}`}>
        <div className="pm-topline" aria-hidden="true" />
        <div className="pm-handle" aria-hidden="true" />
        <div className="pm-header">
          <div className="pm-icon">{policy.icon}</div>
          <div className="pm-title-block">
            <span className="pm-eyebrow">Legal · Fameo</span>
            <div className="pm-title">{policy.label}</div>
          </div>
          <div className="pm-actions">
            <a href={policy.href} target="_blank" rel="noopener noreferrer" className="pm-action-btn" title="Open in new tab">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M7 1h4m0 0v4m0-4L5.5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Open</span>
            </a>
            <button className="pm-close" onClick={handleClose} aria-label="Close">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className="pm-iframe-wrap">
          <div className={`pm-spinner-ov${loaded ? ' pm-hidden' : ''}`}>
            <span className="frg-spin" style={{ width: 30, height: 30 }} />
            <span className="pm-spin-txt">Loading document…</span>
          </div>
          <iframe className="pm-iframe" src={policy.href} title={policy.label}
            onLoad={() => setLoaded(true)}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms" />
        </div>
      </div>
    </div>
  );
}

/* ── Live Selfie Capture ────────────────────────────────────────────────────
   UNCHANGED — face verification left exactly as it was.
   Phases: loading → ready → open (2.5s) → countdown (3s) → blink (~3.5s)
           → capturing → (parent: checking)
   ------------------------------------------------------------------------ */
const COACH = {
  loading:   { phase: 'PREPARING',  msg: 'Starting your camera…',              hint: '' },
  ready:     { phase: 'READY',      msg: 'Centre your face in the ring',       hint: 'The whole check takes about 10 seconds' },
  open:      { phase: 'STEP 1 OF 3',msg: 'Keep your eyes open',                hint: 'Look straight ahead and hold still' },
  countdown: { phase: 'STEP 2 OF 3',msg: 'Get ready to blink',                 hint: 'At zero: blink and move your head slightly' },
  blink:     { phase: 'STEP 3 OF 3',msg: 'Blink 2–3 times & move your head',   hint: 'Add a small nod or gentle turn — keep it natural' },
  capturing: { phase: 'ALMOST DONE',msg: 'Hold still — capturing',             hint: '' },
};
const TRACK_STEPS = ['EYES OPEN', 'GET READY', 'BLINK'];

function LiveSelfieCapture({ onCaptured, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const abortRef = useRef(false);

  const [phase, setPhase] = useState('loading');
  const [camError, setCamError] = useState('');   // fatal — camera unusable
  const [runError, setRunError] = useState('');   // recoverable — retry inline
  const [progress, setProgress] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [flashKey, setFlashKey] = useState(0);

  const stopStream = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
  };

  const startCamera = async () => {
    stopStream(); setPhase('loading'); setCamError(''); setRunError('');
    setProgress(0); setHoldProgress(0); setFrameCount(0); setCountdown(0);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCamError('Camera not supported in this browser. Please use Chrome or Safari.'); return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      video.setAttribute('playsinline', 'true'); video.setAttribute('muted', 'true'); video.muted = true;

      // Kick off playback. A play() rejection here is usually a benign autoplay
      // / interrupt quirk — the stream still renders via the autoPlay attribute,
      // and we confirm real readiness by polling readyState below, so don't
      // treat it as fatal.
      try { await video.play(); } catch { /* non-fatal autoplay/abort */ }

      // Poll for a genuinely decodable frame instead of awaiting onloadedmetadata.
      let warm = false;
      for (let i = 0; i < 50; i += 1) { // ~6s budget
        if (abortRef.current) return;
        if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) { warm = true; break; }
        await sleep(120);
      }
      if (!warm) {
        setCamError('Camera didn\u2019t start streaming. Close any other app using the camera, check the site\u2019s camera permission, and try again.');
        return;
      }
      setPhase('ready');
    } catch (err) {
      const msg = err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError'
        ? 'Camera permission denied. Allow camera access for this site in your browser, then try again.'
        : err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError' ? 'No front camera was found on this device.'
        : err?.name === 'NotReadableError' || err?.name === 'TrackStartError' ? 'Your camera is in use by another app. Close it and try again.'
        : `Couldn\u2019t start the camera${err?.message ? ` (${err.message})` : ''}. Check the site\u2019s camera permission and try again.`;
      setCamError(msg);
    }
  };

  useEffect(() => {
    abortRef.current = false;
    startCamera();
    return () => { abortRef.current = true; stopStream(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* capture a mirrored frame — null if the video has no real pixels yet */
  const captureFrame = (maxWidth, quality) => {
    const video = videoRef.current, canvas = canvasRef.current;
    if (!video || !canvas) return null;
    if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) return null;

    const scale = Math.min(1, maxWidth / video.videoWidth);
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.translate(canvas.width, 0); ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    const url = canvas.toDataURL('image/jpeg', quality);
    if (!url || url.length < 2000) return null; // blank/black frame
    return url;
  };

  const captureFrameWithRetry = async (maxWidth, quality, attempts = 6, gap = 120) => {
    for (let i = 0; i < attempts; i += 1) {
      const f = captureFrame(maxWidth, quality);
      if (f) return f;
      await sleep(gap);
      if (abortRef.current) return null;
    }
    return null;
  };

  const runLiveCheck = async () => {
    if (phase !== 'ready') return;
    setRunError(''); setCamError('');
    try {
      /* STEP 1 — open-eye hold */
      setPhase('open'); setProgress(0); setHoldProgress(0); setFrameCount(0);
      const holdTicks = 10;
      for (let i = 0; i < holdTicks; i += 1) {
        await sleep(OPEN_HOLD_MS / holdTicks);
        if (abortRef.current) return;
        setHoldProgress((i + 1) / holdTicks);
      }

      const openFrame = await captureFrameWithRetry(BLINK_FRAME_WIDTH, BLINK_FRAME_QUALITY);
      if (abortRef.current) return;
      if (!openFrame) throw new Error('No camera image detected. Make sure the lens is not covered and the room is well lit, then try again.');
      const blinkFrames = [openFrame];
      setFrameCount(1);

      /* STEP 2 — countdown */
      setPhase('countdown');
      for (let n = Math.round(COUNTDOWN_MS / 1000); n >= 1; n -= 1) {
        setCountdown(n);
        await sleep(1000);
        if (abortRef.current) return;
      }
      setCountdown(0);

      /* STEP 3 — blink window */
      setPhase('blink');
      setFlashKey(k => k + 1);
      for (let i = 0; i < BLINK_FRAME_COUNT; i += 1) {
        const frame = captureFrame(BLINK_FRAME_WIDTH, BLINK_FRAME_QUALITY);
        if (frame) { blinkFrames.push(frame); setFrameCount(blinkFrames.length); }
        setProgress((i + 1) / BLINK_FRAME_COUNT);
        await sleep(BLINK_FRAME_INTERVAL);
        if (abortRef.current) return;
      }

      /* STEP 4 — final selfie */
      setPhase('capturing');
      await sleep(CAPTURE_SETTLE_MS);
      if (abortRef.current) return;

      const finalFrame = await captureFrameWithRetry(FINAL_SELFIE_WIDTH, FINAL_SELFIE_QUALITY);
      if (abortRef.current) return;
      if (!finalFrame) throw new Error('Could not capture your photo. Please check the lighting and try again.');
      if (blinkFrames.length < MIN_BLINK_FRAMES) {
        throw new Error(`Only ${blinkFrames.length} usable frames were captured. Stay in front of the camera for the full check and try again.`);
      }

      const selfieBlob = dataUrlToBlob(finalFrame);
      const selfieFile = new File([selfieBlob], `fameoselfie_${Date.now()}.jpg`, { type: 'image/jpeg' });

      stopStream();
      onCaptured({ selfieFile, previewUrl: finalFrame, blinkFrames });
    } catch (err) {
      setRunError(err?.message || 'Live capture failed. Please try again.');
      setPhase('ready');
      setProgress(0); setHoldProgress(0); setCountdown(0); setFrameCount(0);
    }
  };

  const coach = COACH[phase] || COACH.ready;
  const running = phase === 'open' || phase === 'countdown' || phase === 'blink' || phase === 'capturing';
  const activeFrame = running;

  /* ring arc progress across the whole sequence */
  const ringProgress = phase === 'open' ? holdProgress * 0.3
    : phase === 'countdown' ? 0.3 + (1 - countdown / (COUNTDOWN_MS / 1000)) * 0.25
    : phase === 'blink' ? 0.55 + progress * 0.4
    : phase === 'capturing' ? 1 : 0;

  const R = 128, C = 2 * Math.PI * R;

  const trackFill = [
    phase === 'open' ? holdProgress : (['countdown', 'blink', 'capturing'].includes(phase) ? 1 : 0),
    phase === 'countdown' ? 1 - countdown / (COUNTDOWN_MS / 1000) : (['blink', 'capturing'].includes(phase) ? 1 : 0),
    phase === 'blink' ? progress : (phase === 'capturing' ? 1 : 0),
  ];
  const activeTrackIdx = phase === 'open' ? 0 : phase === 'countdown' ? 1 : (phase === 'blink' || phase === 'capturing') ? 2 : -1;

  const shutterLabel = camError ? '↻ RESTART CAMERA'
    : phase === 'capturing' ? 'CAPTURING…'
    : phase === 'blink' ? 'BLINK NOW…'
    : phase === 'countdown' ? 'GET READY…'
    : phase === 'open' ? 'HOLD STILL…'
    : runError ? '↻ TRY AGAIN'
    : '👁  START LIVE CHECK';

  return (
    <div className="cam-overlay" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Live selfie verification">
      <div className="cam-modal">

        {/* header + step track */}
        <div className="cam-hdr">
          <div className="cam-hdr-top">
            <span className="cam-hdr-ttl"><i className="cam-live-dot" /> Live selfie check</span>
            <button className="cam-close" onClick={() => { abortRef.current = true; stopStream(); onClose(); }} aria-label="Close">✕</button>
          </div>
          <div className="cam-track" aria-hidden="true">
            {TRACK_STEPS.map((_, i) => (
              <span className="cam-track-seg" key={i}>
                <i style={{ width: `${Math.round(Math.min(1, Math.max(0, trackFill[i])) * 100)}%` }} />
              </span>
            ))}
          </div>
          <div className="cam-track-lbls">
            {TRACK_STEPS.map((s, i) => (
              <span key={s} className={`cam-track-lbl${activeTrackIdx === i ? ' on' : ''}${trackFill[i] >= 1 && activeTrackIdx !== i ? ' done' : ''}`}>{s}</span>
            ))}
          </div>
        </div>

        {/* viewfinder */}
        <div className="cam-vf">
          <video ref={videoRef} autoPlay playsInline muted className="cam-video mirror" />

          {phase === 'open' && !camError && <div className="cam-sweep" aria-hidden="true" />}
          {phase === 'blink' && <div key={flashKey} className="cam-blink-flash" aria-hidden="true" />}

          {/* face ring + progress arc */}
          {!camError && phase !== 'loading' && (
            <div className={`cam-frame${activeFrame ? ' active' : ''}${phase === 'blink' ? ' blink' : ''}`} aria-hidden="true">
              <svg viewBox="0 0 360 480" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="camArc" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFC98F" />
                    <stop offset="55%" stopColor="#DD8164" />
                    <stop offset="100%" stopColor="#D45A79" />
                  </linearGradient>
                  <mask id="camHole">
                    <rect width="360" height="480" fill="#fff" />
                    <ellipse cx="180" cy="210" rx="118" ry="146" fill="#000" />
                  </mask>
                </defs>
                <rect className="vignette" width="360" height="480" mask="url(#camHole)" />
                <ellipse className="ring-glow" cx="180" cy="210" rx="118" ry="146" />
                <ellipse className="ring-bg" cx="180" cy="210" rx="118" ry="146" />
                <circle
                  className="ring-arc" cx="180" cy="210" r={R}
                  strokeDasharray={C} strokeDashoffset={C * (1 - ringProgress)}
                  transform="rotate(-90 180 210) scale(0.92 1.14) translate(15.6 -25.8)"
                />
                <g className="tick">
                  <path d="M62 132 L62 108 L86 108" />
                  <path d="M298 132 L298 108 L274 108" />
                  <path d="M62 288 L62 312 L86 312" />
                  <path d="M298 288 L298 312 L274 312" />
                </g>
              </svg>
            </div>
          )}

          {/* countdown */}
          {phase === 'countdown' && countdown > 0 && (
            <div className="cam-count-wrap">
              <div className="cam-count"><span key={countdown}>{countdown}</span></div>
            </div>
          )}

          {/* blink prompt */}
          {phase === 'blink' && (
            <div className="cam-blinkburst">
              <div className="cam-blinkburst-inner">
                <span className="cam-eye"><EyeGlyph /></span>
                <span className="cam-blinkword">Blink</span>
              </div>
            </div>
          )}

          {/* loading */}
          {phase === 'loading' && !camError && (
            <div className="cam-loading">
              <span className="frg-spin white" style={{ width: 26, height: 26 }} />
              <div className="cam-loading-txt">Starting camera…</div>
            </div>
          )}

          {/* fatal camera error */}
          {camError && (
            <div className="cam-error">
              <div className="cam-error-ico">📷</div>
              <div className="cam-error-txt">{camError}</div>
              <button className="cam-retry" onClick={startCamera}>Restart camera</button>
            </div>
          )}

          {/* coach strip */}
          {!camError && phase !== 'loading' && (
            <div className="cam-coach" aria-live="polite">
              <span className="cam-coach-phase">{coach.phase}</span>
              <span key={phase} className="cam-coach-msg">{coach.msg}</span>
              {coach.hint && <span className="cam-coach-hint">{coach.hint}</span>}
              {(phase === 'blink' || phase === 'capturing') && frameCount > 0 && (
                <span className="cam-coach-frames"><i />{frameCount} FRAMES CAPTURED</span>
              )}
            </div>
          )}
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* inline recoverable error */}
        {runError && !camError && (
          <div className="cam-runerr" role="alert"><span>⚠</span><span>{runError}</span></div>
        )}

        {/* pre-start checklist */}
        {phase === 'ready' && !camError && !runError && (
          <div className="cam-checklist">
            <span className="cam-checkitem"><MiniCheck /> Only your face in frame</span>
            <span className="cam-checkitem"><MiniCheck /> Bright, even lighting</span>
            <span className="cam-checkitem"><MiniCheck /> No sunglasses or hats</span>
            <span className="cam-checkitem"><MiniCheck /> Live camera, not a photo</span>
          </div>
        )}

        <div className="cam-controls">
          <button
            className="cam-shutter"
            onClick={camError ? startCamera : runLiveCheck}
            disabled={!camError && phase !== 'ready'}
          >
            {running && !camError
              ? <><span className="frg-spin white" style={{ width: 13, height: 13 }} />{shutterLabel}</>
              : shutterLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
export default function FameoRegisterFlow({ onComplete, logo: logoProp }) {
  const brandLogo = logoProp ?? logo;
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState('fwd');

  const [form, setForm] = useState({
    fname: '', lname: '', dob: '', cc: '+91', mobile: '', email: '',
    username: '', gender: '',
    stateId: null, state: '', stateCode: '', cityId: null, city: '', pincode: '',
    primaryPlatform: '', youtube: '', instagram: '',
    categoryCode: '', category: '', categoryId: null,
    professionCode: '', profession: '', professionId: null,
    pressUrls: '',
    referralCode: '',
  });
  const [consents, setConsents] = useState({ age: false, terms: false });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [activePolicy, setActivePolicy] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  /* OTP */
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileOtp, setMobileOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [emailOtp, setEmailOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [mobileOtpStatus, setMobileOtpStatus] = useState({ msg: '', type: '' });
  const [emailOtpStatus, setEmailOtpStatus] = useState({ msg: '', type: '' });
  const [mobileShake, setMobileShake] = useState(false);
  const [emailShake, setEmailShake] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const mobileRefs = useRef([]);
  const emailRefs = useRef([]);

  /* referral */
  const [referralStatus, setReferralStatus] = useState({ state: 'idle', msg: '', data: null });
  const [referralFromLink, setReferralFromLink] = useState(false);
  const referralCheckRef = useRef(null);

  /* async lookups */
  const [usernameStatus, setUsernameStatus] = useState(null);
  const usernameCheckRef = useRef(null);
  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(true);
  const [statesError, setStatesError] = useState('');
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [citiesError, setCitiesError] = useState('');
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState('');
  const [professions, setProfessions] = useState([]);
  const [profLoading, setProfLoading] = useState(false);
  const [profError, setProfError] = useState('');
  const [selectedProfObj, setSelectedProfObj] = useState(null);

  /* pincode → state / city */
  const [pinStatus, setPinStatus] = useState({ state: 'idle', data: null });
  const pendingCityRef = useRef(null);

  /* selfie + docs */
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [docSlots, setDocSlots] = useState({});
  const [fileError, setFileError] = useState('');
  const docInputRefs = useRef({});
  const [selfieFile, setSelfieFile] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [selfieUrl, setSelfieUrl] = useState(null);
  const [selfieStatus, setSelfieStatus] = useState({ state: 'idle', msg: '', hint: '', liveness: '', fatal: false });
  const [cameraOpen, setCameraOpen] = useState(false);

  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const uploadedDocsRef = useRef(null);
  const [summary, setSummary] = useState(null);

  const cardRef = useRef(null);

  /* refs used to scroll to the first invalid field on submit */
  const fieldRefs = useRef({});
  const registerFieldRef = (id) => (el) => { if (el) fieldRefs.current[id] = el; };
  const focusField = (id) => {
    const el = fieldRefs.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const focusable = el.matches('input,select,textarea,button')
      ? el
      : el.querySelector('input,select,textarea,button,[tabindex]');
    setTimeout(() => { try { (focusable || el).focus({ preventScroll: true }); } catch { /* noop */ } }, 320);
  };

  const getRaw = () => form.mobile.replace(/\D/g, '');

  /* central error helper — clears one or more error keys */
  const clearErr = (...keys) => setErrors(er => {
    const n = { ...er };
    keys.forEach(k => { delete n[k]; });
    return n;
  });
  const markTouched = (k) => () => setTouched(t => ({ ...t, [k]: true }));

  /* resend ticker */
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  /* load states + categories on mount */
  useEffect(() => {
    setStatesLoading(true); setStatesError('');
    fetch(`${API_BASE}/api/v1/locations/master-state`).then(r => r.json())
      .then(res => { if (res.success && Array.isArray(res.data)) setStates(res.data); else setStatesError('Could not load states.'); })
      .catch(() => setStatesError('Network error loading states.'))
      .finally(() => setStatesLoading(false));

    setCatLoading(true); setCatError('');
    fetch(`${API_BASE}/api/v1/masters/categories`).then(r => r.json())
      .then(res => { if (res.success && Array.isArray(res.data)) setCategories(res.data); else setCatError('Could not load categories. Please refresh.'); })
      .catch(() => setCatError('Network error loading categories.'))
      .finally(() => setCatLoading(false));
  }, []);

  /* prefill + validate a referral code arriving from an invite link */
  useEffect(() => {
    const code = readReferralFromUrl();
    if (!code) return;
    setForm(f => ({ ...f, referralCode: code }));
    setReferralFromLink(true);
    // Pass the code explicitly — setForm hasn't flushed yet, so the closure
    // inside validateReferral would still see an empty referralCode.
    validateReferral(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* load cities on state change */
  useEffect(() => {
    if (!form.stateId) { setCities([]); return; }
    setCitiesLoading(true); setCitiesError(''); setCities([]);
    fetch(`${API_BASE}/api/v1/locations/master-cities?state_id=${form.stateId}`).then(r => r.json())
      .then(res => { if (res.success && Array.isArray(res.data)) setCities(res.data); else setCitiesError('Could not load cities.'); })
      .catch(() => setCitiesError('Network error loading cities.'))
      .finally(() => setCitiesLoading(false));
  }, [form.stateId]);

  /* load professions on category change */
  useEffect(() => {
    if (!form.categoryCode) { setProfessions([]); setSelectedProfObj(null); return; }
    setProfLoading(true); setProfError(''); setProfessions([]); setSelectedProfObj(null);
    setForm(f => ({ ...f, profession: '', professionCode: '', professionId: null }));
    fetch(`${API_BASE}/api/v1/masters/categories/${form.categoryCode}/professions`).then(r => r.json())
      .then(res => { if (res.success && Array.isArray(res.data)) setProfessions(res.data); else setProfError('Could not load professions for this category.'); })
      .catch(() => setProfError('Network error loading professions.'))
      .finally(() => setProfLoading(false));
  }, [form.categoryCode]);

  const set = k => e => { setForm(f => ({ ...f, [k]: e.target.value })); clearErr(k); };
  const setField = (k, v) => { setForm(f => ({ ...f, [k]: v })); clearErr(k); };

  /* ── DOB / age gate ── */
  const age = calcAge(form.dob);
  const ageOk = age !== null && age >= 18;
  const underage = age !== null && age < 18;
  const onDobChange = e => {
    const dob = e.target.value;
    setForm(f => ({ ...f, dob }));
    const a = calcAge(dob);
    setConsents(prev => ({ ...prev, age: a !== null && a >= 18 }));
    clearErr('dob', 'consent', 'age');
  };

  /* ── contact change resets OTP ── */
  const resetOtp = () => {
    setOtpSent(false); setPhoneVerified(false); setEmailVerified(false);
    setMobileOtp(Array(OTP_LENGTH).fill('')); setEmailOtp(Array(OTP_LENGTH).fill(''));
    setMobileOtpStatus({ msg: '', type: '' }); setEmailOtpStatus({ msg: '', type: '' });
    setResendIn(0);
  };
  const onMobileChange = e => {
    setForm(f => ({ ...f, mobile: e.target.value.replace(/\D/g, '').slice(0, mobileLenRange(f.cc)[1]) }));
    clearErr('phone');
    if (otpSent || phoneVerified || emailVerified) resetOtp();
  };
  const onEmailChange = e => {
    // Lowercase so You@GMAIL.com and you@gmail.com can't create two accounts.
    setForm(f => ({ ...f, email: e.target.value.trim().toLowerCase() }));
    clearErr('email');
    if (otpSent || phoneVerified || emailVerified) resetOtp();
  };

  /* ── live mobile / email validity ──────────────────────────────────────────
     `hard` problems (wrong leading digit, too long, two @) show as you type.
     Soft ones (still too short) wait for blur or a submit attempt so the field
     isn't red from the first keystroke.
     ---------------------------------------------------------------------- */
  const mobileRaw = getRaw();
  const mobileCheck = validateMobile(form.cc, mobileRaw);
  const mobileOk = mobileCheck.ok;
  const mobileHint = mobileCheck.hint;
  const mobileErrMsg = mobileCheck.msg || 'Enter a valid mobile number.';
  const showMobileErr = Boolean(errors.phone || (mobileRaw && !mobileOk && (mobileCheck.hard || touched.mobile || submitAttempted)));

  const emailCheck = validateEmail(form.email);
  const emailOk = emailCheck.ok;
  const emailErrMsg = emailCheck.msg;
  const emailWarn = emailCheck.warn || '';
  const showEmailErr = Boolean(errors.email || (form.email && !emailOk && (emailCheck.hard || touched.email || submitAttempted)));

  const userPatternOk = PATTERNS.username.test(form.username);

  /* ── referral code ── */
  const onReferralChange = e => {
    const v = e.target.value.replace(/[^A-Za-z0-9-]/g, '').slice(0, 30).toUpperCase();
    setForm(f => ({ ...f, referralCode: v }));
    clearErr('referral');
    setReferralFromLink(false);
    setReferralStatus({ state: 'idle', msg: '', data: null });
  };
  /* Returns { ok, msg }. Callers (link prefill · blur · submit) can pass the
     code explicitly, so they never depend on form state having flushed. An
     in-flight check is reused rather than duplicated. */
  const validateReferral = (codeArg) => {
    const code = String(codeArg ?? form.referralCode).trim();
    if (!code) { setReferralStatus({ state: 'idle', msg: '', data: null }); clearErr('referral'); return Promise.resolve({ ok: true, msg: '' }); }
    if (referralCheckRef.current?.code === code) return referralCheckRef.current.promise;
    if (!PATTERNS.referral.test(code)) {
      const msg = 'Codes are 4–30 letters, numbers or dashes.';
      setReferralStatus({ state: 'invalid', msg, data: null });
      setErrors(er => ({ ...er, referral: msg }));
      return Promise.resolve({ ok: false, msg });
    }
    setReferralStatus({ state: 'checking', msg: 'Checking code…', data: null });
    const promise = (async () => {
      try {
        const res = await apiCall(REFERRAL_VALIDATE(code), 'GET');
        const data = res?.data || res;
        const valid = res?.success !== false && (data?.valid !== false);
        if (!valid) {
          const msg = res?.message || 'This referral code is not valid.';
          setReferralStatus({ state: 'invalid', msg, data: null });
          setErrors(er => ({ ...er, referral: msg }));
          return { ok: false, msg };
        }
        const tier = data?.couponTier || data?.tier;
        const discount = data?.discountPercent ?? data?.discount;
        const msg = discount ? `Valid — ${discount}% off applied` : 'Referral code applied';
        setReferralStatus({ state: 'valid', msg, data: { code, tier, discount } });
        clearErr('referral');
        return { ok: true, msg };
      } catch (err) {
        console.error('[referral-validate]', err);
        const msg = err?.serverMessage || 'We couldn’t check that code. Please try again, or clear the field to continue.';
        setReferralStatus({ state: 'invalid', msg, data: null });
        setErrors(er => ({ ...er, referral: msg }));
        return { ok: false, msg };
      } finally {
        if (referralCheckRef.current?.code === code) referralCheckRef.current = null;
      }
    })();
    referralCheckRef.current = { code, promise };
    return promise;
  };
  const removeReferral = () => {
    setForm(f => ({ ...f, referralCode: '' }));
    setReferralFromLink(false);
    setReferralStatus({ state: 'idle', msg: '', data: null });
    clearErr('referral');
  };

  /* ── Send OTP ── */
  const sendOtp = async () => {
    const e = {};
    if (!form.fname.trim()) e.fname = 'First name is required';
    if (!form.lname.trim()) e.lname = 'Last name is required';
    if (!mobileOk) e.phone = mobileErrMsg;
    if (!emailOk) e.email = emailErrMsg || 'Enter a valid email address (e.g. you@example.com)';
    if (Object.keys(e).length) {
      setErrors(er => ({ ...er, ...e }));
      setTouched(t => ({ ...t, mobile: true, email: true }));
      const order = ['fname', 'lname', 'phone', 'email'];
      const first = order.find(k => e[k]);
      if (first) focusField(first === 'phone' ? 'mobile' : first);
      return;
    }
    setOtpSending(true);
    try {
      const res = await apiCall('/api/v1/auth/send-otp', 'POST', {
        mobile_number: getRaw(),
        mobile_country_code: form.cc,
        email: form.email,
        full_name: `${form.fname} ${form.lname}`.trim(),
      });
      setOtpSent(true);
      setMobileOtp(Array(OTP_LENGTH).fill('')); setEmailOtp(Array(OTP_LENGTH).fill(''));
      setResendIn(RESEND_SECONDS);
      if (res.data?.mobile_otp) console.log('[DEV] Mobile OTP:', res.data.mobile_otp, '| Email OTP:', res.data.email_otp);
      setTimeout(() => mobileRefs.current[0]?.focus(), 60);
    } catch (err) {
      // Raw server/network detail stays in the console; the user sees clean copy.
      console.error('[send-otp]', err);
      const known = (err?.serverMessage || '').toLowerCase();
      const msg = known.includes('already')
        ? 'An account already exists with this number or email. Try logging in instead.'
        : 'Could not send the code right now. Check your number and try again.';
      setErrors(er => ({ ...er, phone: msg }));
      focusField('mobile');
    } finally { setOtpSending(false); }
  };

  /* ── OTP digit handling ── */
  const otpDigit = (kind, i, val) => {
    const v = val.replace(/\D/g, '');
    const [, setArr, refs] = kind === 'mobile'
      ? [mobileOtp, setMobileOtp, mobileRefs] : [emailOtp, setEmailOtp, emailRefs];
    if (kind === 'mobile') setMobileOtpStatus({ msg: '', type: '' }); else setEmailOtpStatus({ msg: '', type: '' });
    setArr(prev => {
      const next = [...prev];
      if (v.length <= 1) next[i] = v;
      else v.slice(0, OTP_LENGTH - i).split('').forEach((ch, j) => { next[i + j] = ch; });
      return next;
    });
    if (v) refs.current[Math.min(i + v.length, OTP_LENGTH - 1)]?.focus();
  };
  const otpKey = (kind, i, e) => {
    const [arr, setArr, refs] = kind === 'mobile'
      ? [mobileOtp, setMobileOtp, mobileRefs] : [emailOtp, setEmailOtp, emailRefs];
    if (e.key === 'Backspace' && !arr[i] && i > 0) { refs.current[i - 1]?.focus(); setArr(p => { const n = [...p]; n[i - 1] = ''; return n; }); }
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < OTP_LENGTH - 1) refs.current[i + 1]?.focus();
  };

  const verifyMobile = async () => {
    const otp = mobileOtp.join('');
    if (otp.length !== OTP_LENGTH) return;
    setMobileOtpStatus({ msg: 'Verifying…', type: 'pending' });
    try {
      await apiCall('/api/v1/auth/verify-otp', 'POST', { mobile_number: getRaw(), mobile_country_code: form.cc, otp });
      setPhoneVerified(true);
      setMobileOtpStatus({ msg: 'MOBILE VERIFIED ✓', type: 'verified' });
      clearErr('verify');
      setTimeout(() => emailRefs.current[0]?.focus(), 80);
    } catch (err) {
      console.error('[verify-otp]', err);
      setMobileOtpStatus({ msg: friendlyOtpError(err?.serverMessage || err?.message), type: 'error' });
      setMobileShake(true); setTimeout(() => setMobileShake(false), 420);
    }
  };
  const verifyEmail = async () => {
    const otp = emailOtp.join('');
    if (otp.length !== OTP_LENGTH) return;
    setEmailOtpStatus({ msg: 'Verifying…', type: 'pending' });
    try {
      await apiCall('/api/v1/auth/verify-email-otp', 'POST', { email: form.email, otp });
      setEmailVerified(true);
      setEmailOtpStatus({ msg: 'EMAIL VERIFIED ✓', type: 'verified' });
      clearErr('verify');
    } catch (err) {
      console.error('[verify-email-otp]', err);
      setEmailOtpStatus({ msg: friendlyOtpError(err?.serverMessage || err?.message), type: 'error' });
      setEmailShake(true); setTimeout(() => setEmailShake(false), 420);
    }
  };

  /* ── username check ─────────────────────────────────────────────────────
     The old onBlur-only version raced Continue: blur fired the request on
     mousedown, then click ran validation while status was still null, so the
     first click did nothing. Now the check is debounced as you type, and
     Continue awaits the in-flight promise instead of racing it.
     -------------------------------------------------------------------- */
  const checkUsername = (nameArg) => {
    const username = String(nameArg ?? form.username).trim();
    if (!username) { setUsernameStatus(null); return Promise.resolve(null); }
    if (!PATTERNS.username.test(username)) {
      setUsernameStatus('invalid');
      setErrors(er => ({ ...er, username: 'Use 1–30 letters, numbers, dots or underscores.' }));
      return Promise.resolve('invalid');
    }
    if (usernameCheckRef.current?.username === username) return usernameCheckRef.current.promise;
    setUsernameStatus('checking');
    const promise = (async () => {
      try {
        const res = await apiCall(`/api/v1/auth/check-username?username=${encodeURIComponent(username)}`, 'GET');
        const available = res?.data?.available === true;
        setUsernameStatus(available ? 'available' : 'taken');
        if (available) clearErr('username');
        else setErrors(er => ({ ...er, username: `@${username} is already taken — please use another username.` }));
        return available ? 'available' : 'taken';
      } catch (err) {
        console.error('[check-username]', err);
        setUsernameStatus('error');
        return 'error';
      } finally {
        if (usernameCheckRef.current?.username === username) usernameCheckRef.current = null;
      }
    })();
    usernameCheckRef.current = { username, promise };
    return promise;
  };

  const ensureUsernameChecked = async () => {
    const name = form.username.trim();
    if (!name) return null;
    const inflight = usernameCheckRef.current;
    if (inflight && inflight.username === name) return inflight.promise;
    if (usernameStatus === 'available' || usernameStatus === 'taken') return usernameStatus;
    return checkUsername(name);
  };

  /* live availability as they type */
  useEffect(() => {
    const name = form.username.trim();
    if (!name) { setUsernameStatus(null); return; }
    if (!PATTERNS.username.test(name)) { setUsernameStatus('invalid'); return; }
    const t = setTimeout(() => checkUsername(name), 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.username]);

  /* ── pincode → state / district ───────────────────────────────────────── */
  useEffect(() => {
    const pin = form.pincode.trim();
    if (!pin) { setPinStatus({ state: 'idle', data: null }); return; }
    if (!PIN_PATTERN.test(pin)) {
      setPinStatus({ state: pin.length < 6 ? 'typing' : 'invalid', data: null });
      return;
    }
    let cancelled = false;
    setPinStatus({ state: 'checking', data: null });
    const t = setTimeout(async () => {
      const res = await lookupPincode(pin);
      if (cancelled) return;
      setPinStatus(res ? { state: 'found', data: res } : { state: 'unknown', data: null });
    }, 350);
    return () => { cancelled = true; clearTimeout(t); };
  }, [form.pincode]);

  /* cities load asynchronously after a state is set — match the queued
     district once they arrive */
  useEffect(() => {
    if (!pendingCityRef.current || !cities.length) return;
    const want = normName(pendingCityRef.current);
    const c = cities.find(x => normName(x.city_name) === want)
      || cities.find(x => normName(x.city_name).includes(want) || want.includes(normName(x.city_name)));
    if (c) { setForm(f => ({ ...f, cityId: c.id, city: c.city_name })); clearErr('city'); }
    pendingCityRef.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities]);

  const applyPinLocation = () => {
    const d = pinStatus.data;
    if (!d) return;
    const st = states.find(s => normName(s.state_name) === normName(d.state));
    if (!st) return;
    setForm(f => ({ ...f, stateId: st.id, state: st.state_name, stateCode: st.state_code, cityId: null, city: '' }));
    pendingCityRef.current = d.district;
    clearErr('state', 'city');
  };

  const pinMismatch = pinStatus.state === 'found' && Boolean(form.state)
    && normName(pinStatus.data.state) !== normName(form.state);

  /* ── state / city / profession selection ── */
  const onStateChange = (stateId) => {
    const s = states.find(x => x.id === parseInt(stateId)) || null;
    setForm(f => ({ ...f, stateId: s ? s.id : null, state: s ? s.state_name : '', stateCode: s ? s.state_code : '', cityId: null, city: '' }));
    pendingCityRef.current = null;
    clearErr('state');
  };
  const onCityChange = (cityId) => {
    const c = cities.find(x => x.id === parseInt(cityId)) || null;
    setForm(f => ({ ...f, cityId: c ? c.id : null, city: c ? c.city_name : '' }));
    clearErr('city');
  };
  const onProfessionChange = (code) => {
    const p = professions.find(x => x.profession_code === code) || null;
    setSelectedProfObj(p);
    setForm(f => ({ ...f, professionCode: code, profession: p ? p.profession_name : '', professionId: p ? p.profession_id : null }));
    clearErr('profession');
  };

  /* ── LIVE selfie handling (unchanged) ── */
  const handleLiveCaptured = async ({ selfieFile: file, previewUrl, blinkFrames }) => {
    try {
      setCameraOpen(false);
      setSelfieFile(file); setSelfiePreview(previewUrl); setSelfieUrl(null);
      setSelfieStatus({ state: 'checking', msg: '', hint: '', liveness: '', fatal: false });
      clearErr('selfie');

      const liveForm = new FormData();
      liveForm.append('selfie', file, 'fameoselfie.jpg');
      blinkFrames.forEach((frame) => {
        if (typeof frame === 'string' && frame.startsWith('data:image')) {
          liveForm.append('blink_frames', frame);
        }
      });
      console.log(`[fameoselfie] sending selfie + ${blinkFrames.length} blink_frames (string data URLs)`);

      let liveRes;
      try {
        liveRes = await fetch(`${API_BASE}${LIVE_SELFIE_ENDPOINT}`, { method: 'POST', body: liveForm });
      } catch (netErr) {
        throw new Error(`Could not reach the verification service (${netErr?.message || 'network error'}).`);
      }
      const liveRaw = await liveRes.text();
      let liveData = {};
      try { liveData = liveRaw ? JSON.parse(liveRaw) : {}; } catch { liveData = {}; }
      console.log(`[fameoselfie] ${liveRes.status}`, liveRaw.slice(0, 500));

      if (!liveRes.ok) {
        console.error(`[fameoselfie] ${liveRes.status}`, liveRaw.slice(0, 300));
        const serverMsg = liveData?.message
          || (liveRes.status === 413 ? 'Verification images were too large for the server.'
            : liveRes.status === 404 ? 'Verification endpoint not found.'
            : liveRes.status === 401 || liveRes.status === 403 ? 'Verification service rejected the request.'
            : 'Verification service error.');
        setSelfieStatus({ state: 'error', msg: serverMsg, hint: livenessHint(serverMsg), liveness: '', fatal: isFatalLiveness(serverMsg) });
        return;
      }

      const verified = liveData?.success === true && liveData?.data?.verified === true;
      if (!verified) {
        const msg = liveData?.message || 'Live selfie verification failed. Please try again.';
        setSelfieStatus({ state: 'error', msg, hint: livenessHint(msg), liveness: '', fatal: isFatalLiveness(msg) });
        return;
      }
      const livenessNote = liveData?.data?.liveness || 'Blink and natural movement detected';

      setSelfieStatus({ state: 'uploading', msg: '', hint: '', liveness: livenessNote, fatal: false });
      const uploadForm = new FormData();
      uploadForm.append('selfie', file);
      uploadForm.append('mobile_number', getRaw());
      const upRes = await apiCall('/api/v1/auth/upload-selfie', 'POST', uploadForm, true);
      if (!upRes?.success) throw new Error(upRes?.message || 'Selfie upload failed');
      const uploadedUrl = upRes?.data?.selfie_url || upRes?.data?.url || null;
      if (!uploadedUrl) throw new Error('Selfie URL not returned');

      setSelfieUrl(uploadedUrl);
      setSelfieStatus({ state: 'done', msg: '', hint: '', liveness: livenessNote, fatal: false });
      clearErr('selfie');
    } catch (err) {
      const msg = err?.message || 'Something went wrong';
      setSelfieStatus({ state: 'error', msg, hint: livenessHint(msg), liveness: '', fatal: isFatalLiveness(msg) });
    }
  };

  const retakeSelfie = () => {
    setSelfieFile(null); setSelfiePreview(null); setSelfieUrl(null);
    setSelfieStatus({ state: 'idle', msg: '', hint: '', liveness: '', fatal: false });
    setCameraOpen(true);
  };

  /* ── documents ──────────────────────────────────────────────────────────
     The copy promised "up to 5 files · 10MB each" but nothing enforced it,
     so oversized uploads only failed at submit time as an opaque 413.
     -------------------------------------------------------------------- */
  const requiredDocs = selectedProfObj?.required_documents || [];

  const rejectFile = (file) => {
    if (!ACCEPTED_DOC_EXT.test(file.name)) return `${file.name} isn’t a supported type. Use PDF, DOC, JPG, PNG or WEBP.`;
    if (file.size > MAX_FILE_BYTES) return `${file.name} is ${fmtSize(file.size)} — each file must be under 10MB.`;
    return '';
  };

  const handleSlotFile = (docType, file) => {
    if (!file) return;
    const bad = rejectFile(file);
    if (bad) { setFileError(bad); return; }
    setFileError('');
    const entry = { id: Math.random().toString(36).slice(2), file, name: file.name, size: fmtSize(file.size), tag: docType, url: null };
    setDocSlots(prev => ({ ...prev, [docType]: entry }));
    setUploadedFiles(prev => [...prev.filter(f => f.tag !== docType), entry]);
    clearErr('docs');
  };
  const removeSlot = (docType) => {
    setDocSlots(prev => { const n = { ...prev }; delete n[docType]; return n; });
    setUploadedFiles(prev => prev.filter(f => f.tag !== docType));
  };
  const addGenericFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;
    const room = MAX_GENERIC_FILES - uploadedFiles.length;
    if (room <= 0) { setFileError(`You can upload up to ${MAX_GENERIC_FILES} files.`); return; }

    const problems = [];
    const accepted = [];
    incoming.forEach(f => {
      const bad = rejectFile(f);
      if (bad) { problems.push(bad); return; }
      if (accepted.length < room) accepted.push(f);
      else problems.push(`${f.name} wasn’t added — the limit is ${MAX_GENERIC_FILES} files.`);
    });

    setFileError(problems[0] || '');
    if (!accepted.length) return;
    setUploadedFiles(prev => [...prev, ...accepted.map(f => ({
      id: Math.random().toString(36).slice(2), file: f, name: f.name, size: fmtSize(f.size), tag: 'credential', url: null,
    }))]);
  };
  const removeGeneric = (id) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
    setFileError('');
  };

  /* ── register ── */
  const handleRegister = async () => {
    setRegistering(true);
    setRegisterError('');
    try {
      // A failed register used to re-run upload-documents on every retry,
      // leaving an orphaned copy of every file on the server per attempt.
      // Reuse the URLs while the file set is unchanged.
      let uploadedDocs = [];
      const fileSetKey = uploadedFiles.map(f => `${f.tag}:${f.name}:${f.file.size}`).join('|');
      if (uploadedDocsRef.current?.key === fileSetKey) {
        uploadedDocs = uploadedDocsRef.current.docs;
      } else if (uploadedFiles.length > 0) {
        const fd = new FormData();
        // Files first, then the tag list, so index N of `tags` lines up with
        // index N of `documents` server-side.
        uploadedFiles.forEach(f => fd.append('documents', f.file, f.name));
        uploadedFiles.forEach(f => fd.append('tags', f.tag || 'credential'));
        fd.append('tags_json', JSON.stringify(uploadedFiles.map(f => f.tag || 'credential')));
        fd.append('mobile_number', getRaw());

        const docRes = await apiCall('/api/v1/auth/upload-documents', 'POST', fd, true);
        const docPayload = Array.isArray(docRes?.data) ? docRes.data[0] : docRes?.data;
        const docArray = docPayload?.documents || docRes?.documents || [];
        uploadedDocs = Array.isArray(docArray) ? docArray.map(d => ({
          tag: d.tag || 'credential',
          url: d.url || d.document_url || d.file_url,
          filename: d.filename || d.original_name || '',
          type: d.type || d.mime_type || 'application/octet-stream',
        })).filter(d => d.url) : [];

        if (!uploadedDocs.length) {
          console.error('[upload-documents] 200 OK but no usable document URLs:', docRes);
          throw new Error('Documents uploaded but the server returned no file URLs. Please retry.');
        }
        uploadedDocsRef.current = { key: fileSetKey, docs: uploadedDocs };
      }

      // instagram_username used to receive the full URL — send the handle.
      // Do NOT add an instagram_url key: /auth/register runs Joi with
      // unknown(false), so any field not in its schema comes back as a 422
      // "excess property and therefore is not allowed". The full URL has
      // nowhere to go until backend adds it.
      const igMatch = PATTERNS.instagramUrl.exec(cleanUrl(form.instagram));
      const igHandle = igMatch ? igMatch[2] : undefined;
      const pressList = form.pressUrls.split('\n').map(s => s.trim()).filter(Boolean);

      const payload = {
        username: form.username,
        full_name: `${form.fname} ${form.lname}`.trim(),
        mobile_number: getRaw(),
        mobile_country_code: form.cc,
        email: form.email,
        date_of_birth: form.dob || undefined,
        gender: form.gender || undefined,
        city: form.city,
        state: form.state || undefined,
        pincode: form.pincode || undefined,
        primary_platform: form.primaryPlatform,
        instagram_username: igHandle,
        youtube_channel_link: form.youtube || undefined,
        primary_content_category: form.categoryCode,
        category_id: form.categoryId || undefined,
        sub_category_id: form.professionId || undefined,
        selfie_image: selfieUrl || undefined,
        documents: uploadedDocs.length ? uploadedDocs : undefined,
        // pressUrls was collected on step 05 and then silently dropped.
        press_urls: pressList.length ? pressList : undefined,
        referral_id: (referralStatus.state === 'valid' && form.referralCode) ? form.referralCode : undefined,
        age_consent_18_plus: true,
        terms_conditions_accepted: true,
      };
      const regRes = await apiCall('/api/v1/auth/register', 'POST', payload);

      // Guide §3 concurrency rule: validate checks availability but does NOT
      // reserve the coupon — the claim happens here. A 200 alone does not mean
      // the code was applied, so referral_applied is the only confirmation.
      const regData = Array.isArray(regRes?.data) ? regRes.data[0] : regRes?.data;
      const sentReferral = payload.referral_id || null;
      const referralApplied = regData?.referral_applied === true;
      if (sentReferral && !referralApplied) {
        setReferralStatus({
          state: 'invalid',
          msg: 'Referral code could not be applied — it may have been claimed by someone else.',
          data: null,
        });
      }

      // Prefer the server's application id. The old client-generated
      // 'FAM-<timestamp>' was shown to the user but existed nowhere in the
      // backend, so support could never look it up.
      const serverAppId = regData?.application_id || regData?.applicationId
        || regData?.application_number || regData?.id || regData?.user_id || null;
      if (!serverAppId) console.warn('[register] no application id in response — showing a local reference instead', regData);

      const s = {
        name: payload.full_name, username: form.username, category: form.category,
        profession: form.profession, platform: form.primaryPlatform,
        referral: referralApplied ? sentReferral : null,
        referralMissed: Boolean(sentReferral && !referralApplied),
        appId: serverAppId ? String(serverAppId) : 'FAM-' + Date.now().toString(36).toUpperCase(),
        appIdIsLocal: !serverAppId,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      };
      setSummary(s);
      onComplete?.(s);
      go(5);
    } catch (err) {
      console.error('[register]', err);
      setRegisterError(friendlyRegisterError(err));
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } finally { setRegistering(false); }
  };

  /* ── validity per step ── */
  const ytOk = !(form.primaryPlatform === 'YouTube' || form.primaryPlatform === 'Both') || PATTERNS.youtube.test(cleanUrl(form.youtube));
  const igOk = !(form.primaryPlatform === 'Instagram' || form.primaryPlatform === 'Both') || PATTERNS.instagramUrl.test(cleanUrl(form.instagram));
  const referralOk = !form.referralCode.trim() || referralStatus.state === 'valid';

  const stepValid = [
    Boolean(form.fname.trim() && form.lname.trim() && form.dob && ageOk && mobileOk && emailOk && phoneVerified && emailVerified && consents.age && consents.terms && referralOk),
    Boolean(form.username && userPatternOk && usernameStatus === 'available' && form.gender && form.stateId && form.city && PIN_PATTERN.test(form.pincode.trim())),
    Boolean(form.primaryPlatform && ytOk && igOk),
    Boolean(form.categoryCode && form.profession),
    Boolean(selfieFile && selfieStatus.state === 'done'),
  ][step];

  const busy = registering || selfieStatus.state === 'checking' || selfieStatus.state === 'uploading' || otpSending || referralStatus.state === 'checking';

  /* ── validate the current step, collect errors + first invalid field id ── */
  const validateStep = async (s) => {
    const e = {};
    const order = [];
    const add = (id, cond, msg, scrollId) => {
      order.push(scrollId || id);
      if (cond) e[id] = msg;
    };

    if (s === 0) {
      add('fname', !form.fname.trim(), 'First name is required');
      add('lname', !form.lname.trim(), 'Last name is required');
      if (!form.dob) { e.dob = 'Date of birth is required'; order.push('dob'); }
      else if (!isRealDate(form.dob)) { e.dob = 'That date doesn’t exist — please pick a valid date.'; order.push('dob'); }
      else if (!ageOk) { e.dob = `You must be 18 or older (you're ${age}).`; order.push('dob'); }
      add('phone', !mobileOk, mobileErrMsg, 'mobile');
      add('email', !emailOk, emailErrMsg || 'Enter a valid email address', 'email');
      if (form.referralCode.trim() && referralStatus.state !== 'valid') {
        const r = await validateReferral();
        if (!r.ok) { e.referral = r.msg || 'Enter a valid referral code, or clear the field.'; order.push('referral'); }
      }
      if (!phoneVerified || !emailVerified) { e.verify = 'Please verify both mobile and email.'; order.push(otpSent ? 'otp-panel' : 'otp-send'); }
      if (!consents.age) { e.age = 'Please confirm you are 18 or older.'; order.push('age'); }
      if (!consents.terms) { e.terms = 'Please accept the Terms, Privacy and Cookie policies.'; order.push('terms'); }
    }
    if (s === 1) {
      const uname = form.username.trim();
      if (!uname) { e.username = 'Username is required'; order.push('username'); }
      else if (!PATTERNS.username.test(uname)) { e.username = 'Use 1–30 letters, numbers, dots or underscores.'; order.push('username'); }
      else {
        // Await the check already in flight rather than racing it — this is
        // what made the first Continue click a no-op.
        const st = await ensureUsernameChecked();
        if (st === 'taken') { e.username = `@${uname} is already taken — please use another username.`; order.push('username'); }
        else if (st !== 'available') { e.username = 'We couldn’t confirm this username. Please try again.'; order.push('username'); }
      }
      add('gender', !form.gender, 'Please select your gender');
      const pin = form.pincode.trim();
      if (!pin) { e.pincode = 'PIN code is required'; order.push('pincode'); }
      else if (!PIN_PATTERN.test(pin)) { e.pincode = 'Enter a valid 6-digit PIN code (it can’t start with 0).'; order.push('pincode'); }
      add('state', !form.stateId, 'Please select your state');
      add('city', !form.city, 'Please select your city');
    }
    if (s === 2) {
      add('platform', !form.primaryPlatform, 'Please select your primary platform');
      if ((form.primaryPlatform === 'YouTube' || form.primaryPlatform === 'Both') && !ytOk) { e.youtube = 'Enter a valid YouTube channel URL'; order.push('youtube'); }
      if ((form.primaryPlatform === 'Instagram' || form.primaryPlatform === 'Both') && !igOk) { e.instagram = 'Enter a valid Instagram profile URL'; order.push('instagram'); }
    }
    if (s === 3) {
      add('category', !form.categoryCode, 'Please choose a category');
      add('profession', form.categoryCode && !form.profession, 'Please select your profession');
    }
    if (s === 4) {
      add('selfie', !(selfieFile && selfieStatus.state === 'done'), 'Please complete the live selfie check');
      // Documents are optional — QC1 can request anything missing during review.
    }

    const firstInvalid = order.find(id => {
      const key = id === 'mobile' ? 'phone' : (id === 'otp-panel' || id === 'otp-send') ? 'verify' : id;
      return e[key];
    });
    return { errors: e, firstInvalid };
  };

  const go = (n) => {
    setDir(n > step ? 'fwd' : 'bwd');
    setStep(n);
    setSubmitAttempted(false);
    setRegisterError('');
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const next = async () => {
    if (step === 5 || busy) return;
    setSubmitAttempted(true);
    setRegisterError('');

    const { errors: e, firstInvalid } = await validateStep(step);
    if (Object.keys(e).length > 0) {
      // Replace this step's errors instead of merging, so stale keys (e.g. a
      // "DOB required" from an earlier attempt) don't survive once fixed.
      setErrors(e);
      if (firstInvalid) focusField(firstInvalid);
      return;
    }
    if (step === 4) { handleRegister(); return; }
    go(step + 1);
  };

  const toggleConsent = key => { setConsents(p => ({ ...p, [key]: !p[key] })); clearErr(key === 'age' ? 'age' : 'terms'); };

  const meta = STEPS[step] || STEPS[STEPS.length - 1];
  const footLabels = ['COMPLETE IDENTITY & VERIFY', 'BUILD YOUR PROFILE', 'LINK YOUR SOCIALS', 'CHOOSE YOUR CATEGORY', 'FINAL PROOF & SUBMIT'];
  const mobileComplete = mobileOtp.every(d => d !== '');
  const emailComplete = emailOtp.every(d => d !== '');

  const success = step === 5;

  return (
    <div className="frg">
      <style>{CSS}</style>

      <svg className="frg-orbit l" viewBox="0 0 360 360" aria-hidden="true"><circle cx="180" cy="180" r="170" /><circle cx="180" cy="180" r="150" /></svg>
      <svg className="frg-orbit r" viewBox="0 0 360 360" aria-hidden="true"><circle cx="180" cy="180" r="170" /><circle cx="180" cy="180" r="150" /></svg>

      {cameraOpen && <LiveSelfieCapture onCaptured={handleLiveCaptured} onClose={() => setCameraOpen(false)} />}
      {activePolicy && <PolicyModal policy={activePolicy} onClose={() => setActivePolicy(null)} />}

      {/* ── card ── */}
      <div className="frg-card" ref={cardRef}>

        {/* brand header */}
        <div className="frg-brand">
          <a className="frg-brand-mark" href="/" aria-label="Fameo home">
            {brandLogo ? (
              <img src={typeof brandLogo === 'string' ? brandLogo : brandLogo.src} alt="Fameo" />
            ) : (
              <span className="frg-brand-word">Fame<span className="dot" /></span>
            )}
            <span className="frg-brand-rule" aria-hidden="true" />
            <span className="frg-brand-sub">Creator Network</span>
          </a>
          <a className="frg-brand-back" href="/login">ALREADY A MEMBER? LOG IN →</a>
        </div>

        {success ? (
          /* ════ SUCCESS ════ */
          <div className="frg-success">
            <div className="frg-suc-ico"><GreenTick /></div>
            <div className="frg-kicker" style={{ textAlign: 'center' }}>APPLICATION RECEIVED</div>
            <h1 className="frg-h1" style={{ textAlign: 'center' }}>Application <em>submitted</em></h1>
            <p className="frg-sub" style={{ margin: '0 auto', textAlign: 'center' }}>
              Your application is now in the QC1 review queue. You&apos;ll receive an email once a decision is made.
            </p>
            {summary?.referralMissed && (
              <div className="frg-note amber" style={{ textAlign: 'left', maxWidth: 400, margin: '20px auto 0' }}>
                <b>Your referral code wasn&apos;t applied.</b> Your application went through
                normally, but the code had already been claimed. Ask your friend for another one.
              </div>
            )}
            <div className="frg-suc-tbl">
              {[
                ['NAME', summary?.name],
                ['USERNAME', summary ? '@' + summary.username : ''],
                ['CATEGORY', summary?.category],
                ['PROFESSION', summary?.profession],
                ['PLATFORM', summary?.platform],
                ...(summary?.referral ? [['REFERRAL', summary.referral]] : []),
                [summary?.appIdIsLocal ? 'REFERENCE' : 'APPLICATION ID', summary?.appId],
                ['SUBMITTED', summary?.date],
                ['STATUS', 'Under review'],
              ].map(([k, v]) => (
                <div className="frg-suc-row" key={k}>
                  <span className="frg-suc-k">{k}</span>
                  <span className="frg-suc-v" style={k === 'STATUS' ? { color: 'var(--amber)' } : undefined}>{v || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* step panel */}
            <div key={step} className={`frg-panel ${dir}`}>
              <div className="frg-kicker">{meta.kicker}</div>
              <h1 className="frg-h1">{meta.lead} <em>{meta.accent}</em></h1>
              <p className="frg-sub">{meta.sub}</p>

              {/* ════ STEP 01 — IDENTITY ════ */}
              {step === 0 && (
                <>
                  {/* invite banner — only when the visitor arrived via a referral link */}
                  {referralFromLink && referralStatus.state === 'valid' && (
                    <div className="frg-note green">
                      <b>You&apos;ve been invited.</b>{' '}
                      {referralStatus.data?.discount
                        ? `Your friend's code gets you ${referralStatus.data.discount}% off your first plan.`
                        : 'Your invite code has been applied.'}
                      {' '}It&apos;s already filled in below — nothing to enter.
                    </div>
                  )}
                  {referralFromLink && referralStatus.state === 'invalid' && (
                    <div className="frg-note amber">
                      <b>The invite code in your link could not be verified.</b>{' '}
                      You can clear it below and continue, or check the link your friend sent.
                    </div>
                  )}

                  <div className="frg-rule">PERSONAL DETAILS</div>
                  <div className="frg-row2">
                    <div className="frg-field" ref={registerFieldRef('fname')}>
                      <label className="frg-label" htmlFor="frg-first">First name <span className="req">*</span></label>
                      <div className={`frg-uline${errors.fname ? ' err' : ''}`}>
                        <input id="frg-first" className="frg-input" placeholder="Ada" value={form.fname} onChange={set('fname')} autoComplete="given-name" />
                      </div>
                      {errors.fname && <div className="frg-help err">{errors.fname}</div>}
                    </div>
                    <div className="frg-field" ref={registerFieldRef('lname')}>
                      <label className="frg-label" htmlFor="frg-last">Last name <span className="req">*</span></label>
                      <div className={`frg-uline${errors.lname ? ' err' : ''}`}>
                        <input id="frg-last" className="frg-input" placeholder="Lovelace" value={form.lname} onChange={set('lname')} autoComplete="family-name" />
                      </div>
                      {errors.lname && <div className="frg-help err">{errors.lname}</div>}
                    </div>
                  </div>

                  <div className="frg-field" ref={registerFieldRef('dob')}>
                    <label className="frg-label" htmlFor="frg-dob">
                      Date of birth <span className="req">*</span>
                      {ageOk && <span className="frg-pill ok"><span className="dot" /> 18+ CONFIRMED</span>}
                      {underage && <span className="frg-pill err"><span className="dot" /> UNDER 18</span>}
                    </label>
                    <div className={`frg-uline${underage || errors.dob ? ' err' : ''}`}>
                      <input id="frg-dob" className="frg-input" type="date" value={form.dob} onChange={onDobChange}
                        min={minDobISO()} max={maxDobISO()} aria-invalid={underage || undefined} aria-describedby="frg-dob-help" />
                    </div>
                    <div id="frg-dob-help" className={`frg-help${underage || errors.dob ? ' err' : ageOk ? ' ok' : ''}`} role={underage ? 'alert' : undefined}>
                      {underage ? `You're ${age} — Fameo is only for people 18 and older. You won't be able to continue with this date of birth.`
                        : ageOk ? `You're ${age} — eligibility confirmed. We've checked the 18+ box for you.`
                        : errors.dob ? errors.dob
                        : 'You must be 18 or older to create a Fameo account.'}
                    </div>
                  </div>

                  <div className="frg-rule">CONTACT VERIFICATION</div>

                  <div className="frg-field" ref={registerFieldRef('mobile')}>
                    <label className="frg-label" htmlFor="frg-mobile">
                      Mobile number <span className="req">*</span>
                      <span className={`frg-pill${phoneVerified ? ' ok' : ''}`}><span className="dot" /> {phoneVerified ? 'VERIFIED' : 'UNVERIFIED'}</span>
                      {otpSent && <button type="button" className="frg-change" onClick={resetOtp}>Change mobile / email</button>}
                    </label>
                    <div className="frg-mobile">
                      <div className="frg-cc">
                        <span className="iso">{COUNTRY_CODES.find(x => x.d === form.cc)?.c}</span>
                        <select className="frg-select" value={form.cc}
                          onChange={e => { const cc = e.target.value; setForm(f => ({ ...f, cc, mobile: f.mobile.slice(0, mobileLenRange(cc)[1]) })); clearErr('phone'); }}
                          disabled={otpSent} aria-label="Country code">
                          {COUNTRY_CODES.map(x => <option key={x.c + x.d} value={x.d}>{x.d}</option>)}
                        </select>
                      </div>
                      <div className={`frg-uline${showMobileErr ? ' err' : mobileOk ? ' ok' : ''}`}>
                        <input id="frg-mobile" className="frg-input" type="tel" inputMode="numeric" autoComplete="tel"
                          placeholder="Mobile number (without country code)" value={form.mobile}
                          onChange={onMobileChange} disabled={otpSent}
                          onBlur={markTouched('mobile')}
                          aria-invalid={showMobileErr || undefined} />
                      </div>
                    </div>
                    <div className={`frg-help${showMobileErr ? ' err' : mobileOk ? ' ok' : ''}`}>
                      {showMobileErr ? (errors.phone || mobileErrMsg)
                        : mobileOk ? 'Looks good'
                        : `Digits only · ${mobileHint} for ${form.cc}`}
                    </div>
                  </div>

                  <div className="frg-field" ref={registerFieldRef('email')}>
                    <label className="frg-label" htmlFor="frg-email">
                      Email address <span className="req">*</span>
                      <span className={`frg-pill${emailVerified ? ' ok' : ''}`}><span className="dot" /> {emailVerified ? 'VERIFIED' : 'UNVERIFIED'}</span>
                    </label>
                    <div className={`frg-uline${showEmailErr ? ' err' : form.email && emailOk ? ' ok' : ''}`}>
                      <input id="frg-email" className="frg-input" type="email" placeholder="you@example.com"
                        value={form.email} onChange={onEmailChange} disabled={otpSent} autoComplete="email"
                        onBlur={markTouched('email')} aria-invalid={showEmailErr || undefined} />
                    </div>
                    <div className={`frg-help${showEmailErr ? ' err' : emailWarn ? ' warn' : form.email && emailOk ? ' ok' : ''}`}>
                      {showEmailErr ? (errors.email || emailErrMsg)
                        : emailWarn ? emailWarn
                        : form.email && emailOk ? 'Looks good'
                        : "We'll send a verification code to this address"}
                    </div>
                  </div>

                  {/* ── referral code (optional) ── */}
                  <div className="frg-field" ref={registerFieldRef('referral')}>
                    <label className="frg-label" htmlFor="frg-referral">
                      Referral code <span className="opt">Optional</span>
                      {referralStatus.state === 'valid' && <span className="frg-pill ok"><span className="dot" /> APPLIED</span>}
                    </label>
                    <div className={`frg-uline${errors.referral ? ' err' : referralStatus.state === 'valid' ? ' ok' : ''}`}>
                      <input id="frg-referral" className="frg-input mono" placeholder="FAMEO-XXXXXX"
                        value={form.referralCode} onChange={onReferralChange}
                        onBlur={() => form.referralCode.trim() && referralStatus.state !== 'valid' && validateReferral()}
                        autoComplete="off" aria-invalid={!!errors.referral || undefined} />
                    </div>
                    <div className={`frg-help${errors.referral ? ' err' : referralStatus.state === 'valid' ? ' ok' : ''}`}>
                      {referralStatus.state === 'checking' ? 'Checking code…'
                        : referralStatus.state === 'valid' ? referralStatus.msg
                        : errors.referral ? errors.referral
                        : 'Have a code from a friend? Enter it to get your joining discount.'}
                    </div>

                    {referralStatus.state === 'valid' && (
                      <div className="frg-ref-applied">
                        <span className="frg-ref-ico">✓</span>
                        <span className="frg-ref-txt">
                          <span className="frg-ref-ttl">Referral applied{referralStatus.data?.tier ? ` · Tier ${referralStatus.data.tier}` : ''}</span>
                          <span className="frg-ref-sub">
                            {referralStatus.data?.discount ? `${referralStatus.data.discount}% off your first plan` : 'Discount will apply at checkout'} · code {form.referralCode}
                          </span>
                        </span>
                        <button className="frg-ref-rm" onClick={removeReferral} title="Remove code" type="button">×</button>
                      </div>
                    )}
                  </div>

                  {!otpSent && (
                    <button className="frg-otp" ref={registerFieldRef('otp-send')} disabled={!(mobileOk && emailOk) || otpSending} onClick={sendOtp}>
                      {otpSending ? <span className="frg-spin" /> : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                        </svg>
                      )}
                      {otpSending ? 'SENDING…' : 'SEND OTP TO MOBILE & EMAIL'}
                    </button>
                  )}
                  {errors.verify && !otpSent && <div className="frg-help err" style={{ marginTop: 10 }}>{errors.verify}</div>}

                  {otpSent && !phoneVerified && (
                    <div className={`frg-otp-panel${mobileShake ? ' shake' : ''}`} ref={registerFieldRef('otp-panel')}>
                      <div className="frg-otp-panel-title">STEP 1 — ENTER THE {OTP_LENGTH}-DIGIT CODE SENT TO {form.cc} {getRaw()}</div>
                      <div className="frg-otp-digits">
                        {mobileOtp.map((d, i) => (
                          <input key={i} ref={el => (mobileRefs.current[i] = el)}
                            className={`frg-otp-digit${d ? ' filled' : ''}`} inputMode="numeric"
                            autoComplete={i === 0 ? 'one-time-code' : 'off'} maxLength={OTP_LENGTH} value={d}
                            onChange={e => otpDigit('mobile', i, e.target.value)} onKeyDown={e => otpKey('mobile', i, e)}
                            onFocus={e => e.target.select()} aria-label={`Mobile OTP digit ${i + 1}`} />
                        ))}
                      </div>
                      {mobileOtpStatus.msg && <div className={`frg-otp-status ${mobileOtpStatus.type}`}>{mobileOtpStatus.msg}</div>}
                      <div className="frg-otp-actions">
                        <button type="button" className="frg-verify" disabled={!mobileComplete || mobileOtpStatus.type === 'pending'} onClick={verifyMobile}>VERIFY MOBILE →</button>
                        <button type="button" className="frg-resend" disabled={resendIn > 0} onClick={sendOtp}>
                          {resendIn > 0 ? `RESEND IN 00:${String(resendIn).padStart(2, '0')}` : 'RESEND CODE'}
                        </button>
                      </div>
                    </div>
                  )}

                  {otpSent && phoneVerified && (
                    <div className="frg-otp-done" role="status"><Tick /> MOBILE VERIFIED</div>
                  )}
                  {otpSent && phoneVerified && !emailVerified && (
                    <div className={`frg-otp-panel${emailShake ? ' shake' : ''}`} ref={registerFieldRef('otp-panel')}>
                      <div className="frg-otp-panel-title">STEP 2 — ENTER THE {OTP_LENGTH}-DIGIT CODE SENT TO {form.email}</div>
                      <div className="frg-otp-digits">
                        {emailOtp.map((d, i) => (
                          <input key={i} ref={el => (emailRefs.current[i] = el)}
                            className={`frg-otp-digit${d ? ' filled' : ''}`} inputMode="numeric"
                            autoComplete={i === 0 ? 'one-time-code' : 'off'} maxLength={OTP_LENGTH} value={d}
                            onChange={e => otpDigit('email', i, e.target.value)} onKeyDown={e => otpKey('email', i, e)}
                            onFocus={e => e.target.select()} aria-label={`Email OTP digit ${i + 1}`} />
                        ))}
                      </div>
                      {emailOtpStatus.msg && <div className={`frg-otp-status ${emailOtpStatus.type}`}>{emailOtpStatus.msg}</div>}
                      <div className="frg-otp-actions">
                        <button type="button" className="frg-verify" disabled={!emailComplete || emailOtpStatus.type === 'pending'} onClick={verifyEmail}>VERIFY EMAIL →</button>
                        <button type="button" className="frg-resend" disabled={resendIn > 0} onClick={sendOtp}>
                          {resendIn > 0 ? `RESEND IN 00:${String(resendIn).padStart(2, '0')}` : 'RESEND CODE'}
                        </button>
                      </div>
                    </div>
                  )}
                  {emailVerified && <div className="frg-otp-done" role="status"><Tick /> MOBILE & EMAIL VERIFIED</div>}
                  {errors.verify && otpSent && !(phoneVerified && emailVerified) && <div className="frg-help err" style={{ marginTop: 10 }}>{errors.verify}</div>}

                  <div className="frg-rule">YOUR CONFIRMATION</div>
                  <Check
                    on={consents.age}
                    toggle={() => { if (underage) return; toggleConsent('age'); }}
                    locked={underage} err={underage || !!errors.age}
                    refCb={registerFieldRef('age')}
                    errText={underage ? 'Your date of birth shows you are under 18, so this cannot be confirmed.' : errors.age || undefined}
                  >
                    I confirm that I am 18 years of age or older and legally eligible to create an account on Fameo.
                    {consents.age && ageOk && <span className="frg-check-note"> (Auto-confirmed from your date of birth ✓)</span>}
                  </Check>
                  <Check on={consents.terms} toggle={() => toggleConsent('terms')} err={!!errors.terms}
                    refCb={registerFieldRef('terms')} errText={errors.terms || undefined}>
                    I have read and agree to Fameo&apos;s{' '}
                    <a onClick={e => { e.stopPropagation(); setActivePolicy(POLICY_LINKS[1]); }}>Terms of Service</a>,{' '}
                    <a onClick={e => { e.stopPropagation(); setActivePolicy(POLICY_LINKS[0]); }}>Privacy Policy</a>, and{' '}
                    <a onClick={e => { e.stopPropagation(); setActivePolicy(POLICY_LINKS[2]); }}>Cookie Policy</a>.
                  </Check>
                </>
              )}

              {/* ════ STEP 02 — PROFILE ════ */}
              {step === 1 && (
                <>
                  <div className="frg-rule">PUBLIC USERNAME</div>
                  <div className="frg-field" ref={registerFieldRef('username')}>
                    <label className="frg-label" htmlFor="frg-user">Username <span className="req">*</span></label>
                    <div className="frg-user-row">
                      <span className="frg-at">@</span>
                      <div className={`frg-uline${usernameStatus === 'available' ? ' ok' : (errors.username || usernameStatus === 'taken' || usernameStatus === 'invalid') ? ' err' : ''}`}>
                        <input id="frg-user" className="frg-input" placeholder="ada.lovelace" value={form.username}
                          onChange={e => { setField('username', e.target.value.replace(/[^A-Za-z0-9_.]/g, '').slice(0, 30)); setUsernameStatus(null); }}
                          autoComplete="username" />
                      </div>
                    </div>
                    <div className={`frg-help${usernameStatus === 'available' ? ' ok' : (errors.username || usernameStatus === 'taken' || usernameStatus === 'invalid' || usernameStatus === 'error') ? ' err' : ''}`}>
                      {usernameStatus === 'checking' ? 'Checking availability…'
                        : usernameStatus === 'available' ? `✓ @${form.username} is available — fameo.vip/@${form.username} is yours`
                        : usernameStatus === 'taken' ? `@${form.username} is already taken — please use another username`
                        : usernameStatus === 'error' ? 'We couldn’t check that username just now — please try again'
                        : errors.username ? errors.username
                        : '1–30 characters · letters, numbers, dots and underscores'}
                    </div>
                  </div>

                  <div className="frg-rule">PERSONAL DETAILS</div>
                  <div className="frg-field" ref={registerFieldRef('gender')}>
                    <label className="frg-label" htmlFor="frg-gender">Gender <span className="req">*</span></label>
                    <div className={`frg-uline${errors.gender ? ' err' : ''}`}><div className="frg-selwrap">
                      <select id="frg-gender" className="frg-select2" value={form.gender} onChange={e => setField('gender', e.target.value)}>
                        <option value="">Select gender</option>
                        {GENDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div></div>
                    {errors.gender && <div className="frg-help err">{errors.gender}</div>}
                  </div>

                  {/* ── LOCATION ────────────────────────────────────────────
                      A district maps to many PIN codes, so a PIN can never be
                      derived from state + city. The reverse works, and runs as
                      a progressive enhancement: if the lookup endpoint exists,
                      typing a PIN offers to fill state and city and warns on a
                      mismatch. If it doesn't, these three fields stay manual
                      and nothing here breaks. ----------------------------- */}
                  <div className="frg-rule">LOCATION</div>

                  <div className="frg-row2">
                    <div className="frg-field" ref={registerFieldRef('state')}>
                      <label className="frg-label" htmlFor="frg-state">State <span className="req">*</span></label>
                      {statesError && <div className="frg-note red">{statesError}</div>}
                      <div className={`frg-uline${errors.state ? ' err' : ''}`}><div className="frg-selwrap">
                        <select id="frg-state" className="frg-select2" value={form.stateId || ''} onChange={e => onStateChange(e.target.value)} disabled={statesLoading}>
                          <option value="">{statesLoading ? 'Loading states…' : 'Select state'}</option>
                          {states.map(s => <option key={s.id} value={s.id}>{s.state_name}</option>)}
                        </select>
                      </div></div>
                      {errors.state && <div className="frg-help err">{errors.state}</div>}
                    </div>

                    <div className="frg-field" ref={registerFieldRef('city')}>
                      <label className="frg-label" htmlFor="frg-city">City <span className="req">*</span></label>
                      {citiesError && <div className="frg-help err">{citiesError}</div>}
                      <div className={`frg-uline${errors.city ? ' err' : ''}`}><div className="frg-selwrap">
                        <select id="frg-city" className="frg-select2" value={form.cityId || ''} onChange={e => onCityChange(e.target.value)} disabled={!form.stateId || citiesLoading}>
                          <option value="">{!form.stateId ? 'Select a state first' : citiesLoading ? 'Loading cities…' : cities.length === 0 ? 'No cities found' : 'Select city'}</option>
                          {cities.map(c => <option key={c.id} value={c.id}>{c.city_name}</option>)}
                        </select>
                      </div></div>
                      {errors.city && <div className="frg-help err">{errors.city}</div>}
                    </div>
                  </div>

                  <div className="frg-field" ref={registerFieldRef('pincode')}>
                    <label className="frg-label" htmlFor="frg-pin">PIN code <span className="req">*</span></label>
                    <div className={`frg-uline${errors.pincode || pinStatus.state === 'invalid' ? ' err' : pinStatus.state === 'found' && !pinMismatch ? ' ok' : ''}`}>
                      <input id="frg-pin" className="frg-input" inputMode="numeric" maxLength={6} autoComplete="postal-code"
                        placeholder="e.g. 400001" value={form.pincode}
                        onChange={e => setField('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} />
                    </div>
                    <div className={`frg-help${errors.pincode || pinStatus.state === 'invalid' ? ' err' : pinStatus.state === 'found' && !pinMismatch ? ' ok' : ''}`}>
                      {errors.pincode ? errors.pincode
                        : pinStatus.state === 'invalid' ? 'A PIN code is 6 digits and can’t start with 0.'
                        : pinStatus.state === 'checking' ? 'Checking this PIN code…'
                        : pinStatus.state === 'found' ? [pinStatus.data.area, pinStatus.data.district, pinStatus.data.state].filter(Boolean).join(' · ')
                        : 'Your 6-digit PIN code'}
                    </div>

                    {pinStatus.state === 'found' && !form.stateId && (
                      <div className="frg-note green">
                        This PIN is in <b>{[pinStatus.data.district, pinStatus.data.state].filter(Boolean).join(', ')}</b>.{' '}
                        <a onClick={applyPinLocation} role="button" tabIndex={0}
                          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), applyPinLocation())}>
                          Fill state and city for me
                        </a>
                      </div>
                    )}
                    {pinMismatch && (
                      <div className="frg-note amber">
                        <b>This PIN code is in {pinStatus.data.state}</b>, but you selected {form.state}.{' '}
                        <a onClick={applyPinLocation} role="button" tabIndex={0}
                          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), applyPinLocation())}>
                          Use {pinStatus.data.district || pinStatus.data.state} instead
                        </a>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ════ STEP 03 — SOCIALS ════ */}
              {step === 2 && (
                <>
                  <div className="frg-note soft">Followers are never combined. The higher single-platform count is used.</div>
                  <div className="frg-rule">PRIMARY PLATFORM</div>
                  <div className="frg-field" ref={registerFieldRef('platform')}>
                    <label className="frg-label" htmlFor="frg-plat">Primary platform <span className="req">*</span></label>
                    <div className={`frg-uline${errors.platform ? ' err' : ''}`}><div className="frg-selwrap">
                      <select id="frg-plat" className="frg-select2" value={form.primaryPlatform} onChange={e => { setForm(f => ({ ...f, primaryPlatform: e.target.value })); clearErr('platform', 'youtube', 'instagram'); }}>
                        <option value="">Select platform</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Both">Both</option>
                      </select>
                    </div></div>
                    {errors.platform && <div className="frg-help err">{errors.platform}</div>}
                  </div>

                  {(form.primaryPlatform === 'YouTube' || form.primaryPlatform === 'Both') && (
                    <div className="frg-field" ref={registerFieldRef('youtube')}>
                      <label className="frg-label" htmlFor="frg-yt">YouTube channel URL <span className="req">*</span></label>
                      <div className={`frg-uline${(form.youtube && !ytOk) || errors.youtube ? ' err' : form.youtube && ytOk ? ' ok' : ''}`}>
                        <input id="frg-yt" className="frg-input" type="url" placeholder="https://youtube.com/@yourchannel"
                          value={form.youtube} onChange={e => setField('youtube', cleanUrl(e.target.value))} />
                      </div>
                      <div className={`frg-help${(form.youtube && !ytOk) || errors.youtube ? ' err' : form.youtube && ytOk ? ' ok' : ''}`}>
                        {(form.youtube && !ytOk) || errors.youtube
                          ? 'That link doesn’t look like a channel. Use youtube.com/@handle, /channel/ID, /c/name or /user/name'
                          : form.youtube && ytOk ? 'Looks good'
                          : 'Accepted: youtube.com/@handle · /channel/ID · /c/name · /user/name'}
                      </div>
                    </div>
                  )}

                  {(form.primaryPlatform === 'Instagram' || form.primaryPlatform === 'Both') && (
                    <div className="frg-field" ref={registerFieldRef('instagram')}>
                      <label className="frg-label" htmlFor="frg-ig">Instagram profile URL <span className="req">*</span></label>
                      <div className={`frg-uline${(form.instagram && !igOk) || errors.instagram ? ' err' : form.instagram && igOk ? ' ok' : ''}`}>
                        <input id="frg-ig" className="frg-input" type="url" placeholder="https://instagram.com/yourhandle"
                          value={form.instagram} onChange={e => setField('instagram', cleanUrl(e.target.value))} />
                      </div>
                      <div className={`frg-help${(form.instagram && !igOk) || errors.instagram ? ' err' : form.instagram && igOk ? ' ok' : ''}`}>
                        {(form.instagram && !igOk) || errors.instagram
                          ? 'That link doesn’t look like a profile. Use https://instagram.com/yourhandle'
                          : form.instagram && igOk ? 'Looks good'
                          : 'Full URL — e.g. https://instagram.com/yourhandle (tracking links are fine)'}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ════ STEP 04 — CATEGORY ════ */}
              {step === 3 && (
                <>
                  <div className="frg-rule">PRIMARY CATEGORY</div>
                  {catError && <div className="frg-note red">{catError}</div>}
                  <div className={`frg-catgrid${errors.category ? ' err' : ''}`} ref={registerFieldRef('category')} role="radiogroup" aria-label="Primary category">
                    {catLoading
                      ? Array.from({ length: 8 }).map((_, i) => (
                        <div className="frg-cat-skel" key={i}><div className="frg-cat-skel-ico" /><div className="frg-cat-skel-lbl" /></div>
                      ))
                      : categories.map(cat => {
                        const on = form.categoryCode === cat.category_code;
                        const pick = () => { setForm(f => ({ ...f, categoryCode: cat.category_code, category: cat.category_name, categoryId: cat.category_id })); clearErr('category'); };
                        return (
                          <div key={cat.category_code}
                            className={`frg-cat${on ? ' on' : ''}`}
                            onClick={pick}
                            role="radio" aria-checked={on} tabIndex={0}
                            onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), pick())}
                            title={cat.description || cat.category_name}>
                            <div className="frg-cat-ico">{pickCategoryIcon(cat)}</div>
                            <div className="frg-cat-lbl">{cat.category_name}</div>
                          </div>
                        );
                      })}
                  </div>
                  {errors.category && <div className="frg-help err" style={{ marginTop: 10 }}>{errors.category}</div>}

                  {form.categoryCode && (
                    <>
                      <div className="frg-rule">PROFESSION</div>
                      {profError && <div className="frg-note red">{profError}</div>}
                      <div className="frg-field" ref={registerFieldRef('profession')}>
                        <label className="frg-label" htmlFor="frg-prof">Select your profession <span className="req">*</span></label>
                        <div className={`frg-uline${errors.profession ? ' err' : ''}`}><div className="frg-selwrap">
                          <select id="frg-prof" className="frg-select2" value={form.professionCode || ''}
                            onChange={e => onProfessionChange(e.target.value)} disabled={profLoading || professions.length === 0}>
                            <option value="">{profLoading ? 'Loading professions…' : professions.length === 0 ? 'No professions found' : 'Select your profession'}</option>
                            {professions.map(p => <option key={p.profession_code} value={p.profession_code}>{p.profession_name}</option>)}
                          </select>
                        </div></div>
                        {errors.profession && <div className="frg-help err">{errors.profession}</div>}
                      </div>
                    </>
                  )}
                </>
              )}

              {/* ════ STEP 05 — PROOF ════ */}
              {step === 4 && (
                <>
                  <div className="frg-rule">LIVE SELFIE</div>
                  {!selfieFile ? (
                    <div className={`frg-livecard${errors.selfie ? ' err' : ''}`} ref={registerFieldRef('selfie')}>
                      <div className="frg-livecard-hdr">
                        <span className="frg-livecard-ico"><EyeGlyph size={24} stroke="#fff" /></span>
                        <div>
                          <div className="frg-livecard-ttl">Live blink verification</div>
                          <div className="frg-livecard-sub">About 10 seconds · guided on screen</div>
                        </div>
                      </div>
                      <div className="frg-livecard-body">
                        <div className="frg-livesteps">
                          <div className="frg-livestep">
                            <span className="frg-livestep-n">1</span>
                            <span className="frg-livestep-txt">Look straight at the camera and keep your eyes <b>open</b> for three seconds.</span>
                          </div>
                          <div className="frg-livestep">
                            <span className="frg-livestep-n">2</span>
                            <span className="frg-livestep-txt">Wait for the <b>3 · 2 · 1</b> countdown to reach zero.</span>
                          </div>
                          <div className="frg-livestep">
                            <span className="frg-livestep-n">3</span>
                            <span className="frg-livestep-txt"><b>Blink slowly 2–3 times</b> with a small, natural head movement.</span>
                          </div>
                        </div>
                        <div className="frg-livereq">
                          <span>One face only</span>
                          <span>Good lighting</span>
                          <span>No sunglasses</span>
                          <span>Live camera only</span>
                        </div>
                        <button className="frg-livestart" onClick={() => setCameraOpen(true)}>
                          START LIVE CHECK <span>→</span>
                        </button>
                        {errors.selfie && <div className="frg-help err" style={{ marginTop: 10 }}>⚠ {errors.selfie}</div>}
                      </div>
                    </div>
                  ) : (
                    <div className={`frg-selfie${selfieStatus.state === 'done' ? ' done' : ''}${selfieStatus.state === 'error' ? ' error' : ''}`} ref={registerFieldRef('selfie')}>
                      <img src={selfiePreview} alt="Live selfie preview" className="frg-selfie-img" />
                      <div className="frg-selfie-info">
                        <div className="frg-selfie-name">{selfieFile.name}</div>

                        {selfieStatus.state === 'checking' && (
                          <div className="frg-selfie-row analyzing"><span className="frg-spin" style={{ width: 12, height: 12 }} /> Checking liveness…</div>
                        )}
                        {selfieStatus.state === 'uploading' && (
                          <div className="frg-selfie-row uploading"><span className="frg-spin" style={{ width: 12, height: 12 }} /> Uploading verified selfie…</div>
                        )}
                        {selfieStatus.state === 'done' && (
                          <>
                            <div className="frg-selfie-row done">✓ Live face verified &amp; uploaded</div>
                            {selfieStatus.liveness && <span className="frg-selfie-live"><span>👁</span> LIVENESS CONFIRMED</span>}
                          </>
                        )}
                        {selfieStatus.state === 'error' && (
                          <>
                            <div className="frg-selfie-row error">{selfieStatus.msg}</div>
                            {selfieStatus.hint && <div className="frg-help err" style={{ marginTop: 4 }}>{selfieStatus.hint}</div>}
                          </>
                        )}

                        {(selfieStatus.state === 'done' || (selfieStatus.state === 'error' && !selfieStatus.fatal)) && (
                          <button className="frg-otp" style={{ marginTop: 10, padding: '9px 20px', fontSize: 10 }} onClick={retakeSelfie}>
                            {selfieStatus.state === 'done' ? 'RETAKE' : 'TRY AGAIN'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="frg-rule">SUPPORTING DOCUMENTS — OPTIONAL</div>
                  {fileError && <div className="frg-note red">{fileError}</div>}
                  {requiredDocs.length > 0 ? (
                    <>
                      <div className="frg-note soft">
                        Upload what you have — these help QC1 review your application faster.
                        You can submit without them and add them later if asked.
                      </div>
                      <div className="frg-docs" ref={registerFieldRef('docs')}>
                        {requiredDocs.map(docType => {
                          const slot = docSlots[docType];
                          return (
                            <div key={docType} className="frg-doc-slot">
                              <div className="frg-doc-hdr">
                                <span className="frg-doc-lbl">{formatDocLabel(docType)}</span>
                                {slot && <button className="frg-doc-rm" onClick={() => removeSlot(docType)} title="Remove">×</button>}
                              </div>
                              {slot ? (
                                <div className="frg-doc-file">
                                  <div className="frg-doc-fico">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                      <rect x="1" y="1" width="12" height="12" rx="3" stroke="#DD8164" strokeWidth="1.2" />
                                      <path d="M4 6h6M4 8.5h4" stroke="#DD8164" strokeWidth="1.1" strokeLinecap="round" />
                                    </svg>
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div className="frg-doc-fname">{slot.name}</div>
                                    <div className="frg-doc-fsize">{slot.size}</div>
                                  </div>
                                  <div style={{ color: 'var(--green)', fontSize: 13, fontWeight: 600 }}>✓</div>
                                </div>
                              ) : (
                                <div className="frg-doc-up" onClick={() => docInputRefs.current[docType]?.click()}
                                  role="button" tabIndex={0}
                                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), docInputRefs.current[docType]?.click())}>
                                  <input ref={el => { docInputRefs.current[docType] = el; }} type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" style={{ display: 'none' }}
                                    onChange={e => { if (e.target.files[0]) handleSlotFile(docType, e.target.files[0]); e.target.value = ''; }} />
                                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ flex: 'none' }}>
                                    <path d="M9 12V4M9 4L6 7M9 4L12 7" stroke="#C96A6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3 14h12" stroke="#C96A6B" strokeWidth="1.5" strokeLinecap="round" />
                                  </svg>
                                  <span className="frg-doc-up-txt">Upload {formatDocLabel(docType)}</span>
                                  <span className="frg-doc-up-sub">PDF · JPG · PNG · WEBP · DOC · MAX 10MB</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="frg-note soft">Upload any supporting documents (awards, contracts, press coverage, credentials).</div>
                      {uploadedFiles.map(f => (
                        <div className="frg-file" key={f.id}>
                          <span className="frg-file-name">{f.name}</span>
                          <span className="frg-file-sz">{f.size}</span>
                          <span className="frg-file-rm" onClick={() => removeGeneric(f.id)} role="button" tabIndex={0}
                            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), removeGeneric(f.id))}>×</span>
                        </div>
                      ))}
                      {uploadedFiles.length < MAX_GENERIC_FILES && (
                        <div className="frg-upload" role="button" tabIndex={0}
                          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && e.currentTarget.click()}
                          onClick={() => {
                            const inp = document.createElement('input');
                            inp.type = 'file'; inp.multiple = true;
                            inp.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp';
                            inp.onchange = e => addGenericFiles(e.target.files);
                            inp.click();
                          }}>
                          <div className="frg-upload-ttl">Click to upload documents</div>
                          <div className="frg-upload-sub">
                            PDF · DOC · DOCX · JPG · PNG · WEBP · {MAX_GENERIC_FILES - uploadedFiles.length} OF {MAX_GENERIC_FILES} REMAINING · 10MB EACH
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div className="frg-rule">PRESS / MEDIA</div>
                  <div className="frg-field">
                    <label className="frg-label" htmlFor="frg-press">Press / media URLs <span className="opt">Optional</span></label>
                    <div className="frg-uline">
                      <textarea id="frg-press" className="frg-area" rows={3}
                        placeholder="Paste links to press articles — one per line"
                        value={form.pressUrls} onChange={set('pressUrls')} />
                    </div>
                    <div className="frg-help">One link per line. These are sent with your application.</div>
                  </div>
                </>
              )}
            </div>

            {registerError && (
              <div className="frg-note red" role="alert" style={{ marginTop: 20 }}>
                <b>We couldn’t submit your application.</b> {registerError}
              </div>
            )}

            {/* footer nav */}
            <div className="frg-foot">
              <span className="frg-foot-label">
                {step === 0 && underage ? 'NOT ELIGIBLE — MUST BE 18+' : footLabels[step]}
              </span>
              <div className="frg-foot-actions">
                {step > 0 && <button className="frg-back" onClick={() => go(step - 1)} disabled={busy}>← BACK</button>}
                <button
                  className={`frg-continue${!stepValid && !busy ? ' soft-disabled' : ''}`}
                  disabled={busy || (step === 0 && underage)}
                  onClick={next}
                >
                  {step === 4
                    ? (registering ? <><span className="frg-spin white" /> SUBMITTING…</>
                      : selfieStatus.state === 'checking' ? <><span className="frg-spin white" /> VERIFYING LIVENESS…</>
                      : selfieStatus.state === 'uploading' ? <><span className="frg-spin white" /> UPLOADING…</>
                      : <>SUBMIT APPLICATION <span className="arr">→</span></>)
                    : <>CONTINUE <span className="arr">→</span></>}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}