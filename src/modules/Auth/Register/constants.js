import {
  BriefcaseBusiness, Compass, Drama, Gamepad2, GraduationCap, HeartPulse, Megaphone,
  Microscope, Music2, Newspaper, Palette, Scale, Shirt, Sparkles, Sun, Trophy, Utensils,
} from 'lucide-react';
import { env } from '@/env';
import { BFF_APP_BASE } from '@/lib/api/config';

/* ── file upload limits (must match the copy shown to the user) ─────────── */
export const MAX_GENERIC_FILES = 5;
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_DOC_EXT = /\.(pdf|docx?|jpe?g|png|webp)$/i;

export const COUNTRY_CODES = [
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
export const MOBILE_RULES = {
  '+91': { len: [10, 10], start: /^[6-9]/, startMsg: 'Indian mobile numbers start with 6, 7, 8 or 9.' },
  '+1': { len: [10, 10], start: /^[2-9]/, startMsg: 'US and Canada numbers can’t start with 0 or 1.' },
  '+44': { len: [10, 10], start: /^7/, startMsg: 'UK mobile numbers start with 7 — drop the leading 0.' },
  '+971': { len: [9, 9], start: /^5/, startMsg: 'UAE mobile numbers start with 5.' },
  '+65': { len: [8, 8], start: /^[89]/, startMsg: 'Singapore mobile numbers start with 8 or 9.' },
  '+61': { len: [9, 9], start: /^4/, startMsg: 'Australian mobile numbers start with 4 — drop the leading 0.' },
  '+49': { len: [10, 11] },
  '+33': { len: [9, 9], start: /^[67]/, startMsg: 'French mobile numbers start with 6 or 7.' },
  '+966': { len: [9, 9], start: /^5/, startMsg: 'Saudi mobile numbers start with 5.' },
  '+92': { len: [10, 10], start: /^3/, startMsg: 'Pakistani mobile numbers start with 3.' },
  '+880': { len: [10, 10], start: /^1/, startMsg: 'Bangladeshi mobile numbers start with 1.' },
  '+60': { len: [9, 10], start: /^1/, startMsg: 'Malaysian mobile numbers start with 1.' },
  '+62': { len: [9, 12], start: /^8/, startMsg: 'Indonesian mobile numbers start with 8.' },
  '+63': { len: [10, 10], start: /^9/, startMsg: 'Philippine mobile numbers start with 9.' },
};
export const mobileRule = (cc) => MOBILE_RULES[cc] || { len: [7, 15] };
export const mobileLenRange = (cc) => mobileRule(cc).len;

/* `hard: true` = certainly wrong, safe to surface mid-typing.
   Soft problems (still too short) only surface on blur or submit. */
export function validateMobile(cc, raw) {
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

export const PATTERNS = {
  // Rejects a@b..com, a@b.com. and other shapes the old loose rule allowed.
  email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/,
  username: /^[A-Za-z0-9_.]{1,30}$/,
  // Accept an optional @ — people paste both shapes.
  instagramUrl: /^https?:\/\/(www\.)?instagram\.com\/@?([A-Za-z0-9_.]{1,30})\/?$/,
  youtube: /^https?:\/\/((www|m)\.)?youtube\.com\/((@[A-Za-z0-9_.-]{1,100})|channel\/[A-Za-z0-9_-]{10,}|c\/[A-Za-z0-9_.-]{1,100}|user\/[A-Za-z0-9_.-]{1,100})\/?$/,
  referral: /^[A-Za-z0-9-]{4,30}$/,
};

export const EMAIL_TYPOS = {
  'gmail.con': 'gmail.com', 'gmail.co': 'gmail.com', 'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com', 'gnail.com': 'gmail.com', 'gmail.cm': 'gmail.com',
  'yahoo.con': 'yahoo.com', 'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com',
  'hotmail.con': 'hotmail.com', 'hotmial.com': 'hotmail.com',
  'outlook.con': 'outlook.com', 'outlok.com': 'outlook.com',
  'rediffmail.con': 'rediffmail.com', 'icloud.con': 'icloud.com',
};

/* Returns { ok, msg, hard?, warn? } — one precise reason, not a generic
   "invalid email". `warn` is a non-blocking "did you mean" nudge. */
export function validateEmail(rawInput) {
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
export const PIN_PATTERN = /^[1-9][0-9]{5}$/;
export const PIN_LOOKUP_URL = (pin) => `${BFF_APP_BASE}/api/v1/locations/pincode/${pin}`;
// Flip on only once https://api.postalpincode.in is allow-listed in connect-src.
export const PIN_USE_PUBLIC_FALLBACK = false;
export const PIN_FALLBACK_URL = (pin) => `https://api.postalpincode.in/pincode/${pin}`;

export const normName = (s) => String(s || '').toLowerCase().replace(/[^a-z]/g, '');

/* Once the endpoint 404s we stop calling it — otherwise every keystroke fires
   another doomed request and floods the console. Set back to true on reload. */
let pinLookupAvailable = true;

export async function lookupPincode(pin) {
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

/* Pick the icon from the category NAME, not the position-based single-letter
   code (which the API doesn't order predictably). The description is only a
   fallback, so a stray word in it can't beat the name. Order matters:
   "Activism" must reach Politics before the acting rule sees "act". */
export const CATEGORY_KEYWORDS = [
  [/politic|activis|campaign/i, Megaphone],
  [/comed|humou?r|funny|meme|entertain|\bact(ing|or)?\b|drama|theat|film|movie|cinema/i, Drama],
  [/\bart|culture|design|paint|craft|photo/i, Palette],
  [/business|entrepreneur|financ|market/i, BriefcaseBusiness],
  [/edu|learn|teach|academ|study/i, GraduationCap],
  [/fashion|style|beauty|makeup|model/i, Shirt],
  [/food|cook|chef|recipe|culinary|hospitality/i, Utensils],
  [/\blaw|legal|advocate|justice|govern/i, Scale],
  [/health|medic|doctor|pharma|clinic|wellness|fitness|yoga|nutrition/i, HeartPulse],
  [/journal|media|news|press/i, Newspaper],
  [/music|singer|song|\bdj\b|audio/i, Music2],
  [/relig|spirit|faith/i, Sun],
  [/scien|research|innovat/i, Microscope],
  [/sport|athlet/i, Trophy],
  [/tech|gaming|game|esport|engineer/i, Gamepad2],
  [/travel|tourism|adventure|explor/i, Compass],
];
export function pickCategoryIcon(cat) {
  for (const hay of [cat.category_name, cat.description]) {
    if (!hay) continue;
    for (const [re, Icon] of CATEGORY_KEYWORDS) if (re.test(hay)) return Icon;
  }
  return Sparkles;
}

/* Category icon tiles cycle through four soft tones. */
export const CATEGORY_TONES = [
  { bg: '#F3E8F0', ink: '#BB7B9F' },
  { bg: '#EEE9F4', ink: '#9983B5' },
  { bg: '#F2EDE6', ink: '#B29774' },
  { bg: '#E9EEF2', ink: '#7B9AAA' },
];

export const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const POLICY_BASE_URL = process.env.NEXT_PUBLIC_APP_ORIGIN || 'https://uat-api.fameo.info';

export const POLICY_LINKS = [
  { label: 'Privacy Policy', href: `${POLICY_BASE_URL}/privacy-policy.html` },
  { label: 'Terms of Service', href: `${POLICY_BASE_URL}/terms-and-conditions.html` },
  { label: 'Cookie Policy', href: `${POLICY_BASE_URL}/cookie-policy.html` },
];

/* Copy per step. `story` is the left column: `lead` on the first line, then
   `pre` and the serif `accent` on the second. `title`/`sub` head the form. */
export const STEPS = [
  {
    label: 'Identity',
    story: { lead: 'Your next circle', pre: 'starts', accent: 'with you.', sub: 'A place to be known for who you are. Let’s begin with the essentials.' },
    title: 'Let’s make it official.',
    sub: 'Your details stay private. Your connections start here.',
  },
  {
    label: 'Profile',
    story: { lead: 'A little context.', accent: 'A lot in common.', sub: 'Give your future connections a place to start.' },
    title: 'A name they’ll remember.',
    sub: 'Your username is public. Your location helps us find people nearby.',
  },
  {
    label: 'Socials',
    story: { lead: 'Your work.', accent: 'Your world.', sub: 'Bring your public presence. Your audience stays where it is.' },
    title: 'Bring your public side.',
    sub: 'Add at least one profile where you share your work.',
  },
  {
    label: 'Category',
    story: { lead: 'Make room for', accent: 'your kind of people.', sub: 'From everyday interests to extraordinary expertise, there’s a place for you.' },
    title: 'What’s your world?',
    sub: 'Choose the category that best represents your public work.',
  },
  {
    label: 'Verification',
    story: { lead: 'Real people.', accent: 'Real possibility.', sub: 'A thoughtful final step toward a network built on trust.' },
    title: 'A little trust goes a long way.',
    sub: 'One quick identity check, and you’re ready for review.',
  },
];

/* Primary platform choices on the Socials step. Values are what the API takes. */
export const PLATFORMS = [
  { value: 'Instagram', label: 'Instagram' },
  { value: 'YouTube', label: 'YouTube' },
  { value: 'Both', label: 'Both' },
];

export const OTP_LENGTH = 6;
export const RESEND_SECONDS = 30;
