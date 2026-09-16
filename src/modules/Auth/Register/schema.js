// Form-input contracts for the 5-step register wizard.
//
// These are NOT response schemas (those live in @/lib/api/schemas) — they
// describe what the USER may submit, and they are the single source of the
// validation rules that used to live inline in RegisterContainer.
//
// ── Two conventions worth knowing before you edit ────────────────────────────
//
// 1. ISSUE PATH = ERROR KEY, NOT FIELD NAME.
//    The step UI reads `errors.phone`, `errors.verify`, `errors.age`,
//    `errors.platform`, `errors.selfie` — keys that do not match the value they
//    describe (`mobile`, `consentAge`, `primaryPlatform`, …). Those keys are
//    the contract the Step components already render, so the schemas emit at
//    the key, not at the value's name. Rename one and the message stops
//    rendering — silently, because a missing key is just an absent <div>.
//
// 2. EVERY OBJECT IS LOOSE.
//    zodResolver hands its parsed output back to React Hook Form as the form
//    values. z.object STRIPS unknown keys, so a strict schema here would delete
//    every field the current step does not name — stateCode, categoryId and the
//    rest would vanish on submit. Same rule, same reason, as lib/api/schemas.js.
//
// A step schema is a loose object (declarative rules for the fields whose key
// already matches) plus one superRefine (everything cross-field, async, or
// keyed differently). superRefine runs even when a declared field failed, so a
// step always reports ALL of its problems at once — the behaviour the old
// validateStep() had. Where two issues land on the same path the FIRST wins,
// which is how the required → malformed → out-of-range ordering survives.

import { z } from 'zod';
import { validateMobile, validateEmail, PATTERNS, PIN_PATTERN } from './constants';
import { isRealDate, calcAge, cleanUrl } from './helpers';

/* ── defaults ─────────────────────────────────────────────────────────────
   The wizard's starting values. `consentAge` / `consentTerms` are the two
   confirmation checkboxes; they are form data, so React Hook Form owns them
   like every other field. The UI still sees them as `consents.age/.terms`.
   ---------------------------------------------------------------------- */
export const REGISTER_DEFAULT_VALUES = {
  fname: '', lname: '', dob: '', cc: '+91', mobile: '', email: '',
  username: '', gender: '',
  stateId: null, state: '', stateCode: '', cityId: null, city: '', pincode: '',
  primaryPlatform: '', youtube: '', instagram: '',
  categoryCode: '', category: '', categoryId: null,
  professionCode: '', profession: '', professionId: null,
  pressUrls: '',
  referralCode: '',
  consentAge: false, consentTerms: false,
};

/* ── field schemas ────────────────────────────────────────────────────────
   Reusable and independently testable. Each one reproduces the exact
   if / else-if ladder it replaces, so the first message a user sees for a
   given field is the message they saw before.
   ---------------------------------------------------------------------- */

/* .refine(v => v.trim()) rather than .trim().min(1): .trim() is a TRANSFORM,
   and zodResolver hands its parsed output to handleSubmit as the form values.
   Nothing here may rewrite what the user typed — the payload is built from
   these values verbatim. Same reason the username and pincode rules below
   test a trimmed copy instead of trimming the value. */
export const firstNameSchema = z.string().refine((v) => v.trim().length > 0, 'First name is required');
export const lastNameSchema = z.string().refine((v) => v.trim().length > 0, 'Last name is required');

/** Required → real calendar date → 18+. `new Date('2000-11-31')` rolls over,
 *  which is why isRealDate() and not the Date constructor decides. */
export const dobSchema = z.string().superRefine((value, ctx) => {
  if (!value) {
    ctx.addIssue({ code: 'custom', message: 'Date of birth is required' });
    return;
  }
  if (!isRealDate(value)) {
    ctx.addIssue({ code: 'custom', message: 'That date doesn’t exist — please pick a valid date.' });
    return;
  }
  const age = calcAge(value);
  if (!(age !== null && age >= 18)) {
    ctx.addIssue({ code: 'custom', message: `You must be 18 or older (you're ${age}).` });
  }
});

/** One precise reason, never a generic "invalid email" — see validateEmail(). */
export const emailSchema = z.string().superRefine((value, ctx) => {
  const result = validateEmail(value);
  if (!result.ok) {
    ctx.addIssue({ code: 'custom', message: result.msg || 'Enter a valid email address' });
  }
});

/** Per-country length and leading-digit rules, so the schema needs the code. */
export const mobileSchemaFor = (countryCode) => z.string().superRefine((value, ctx) => {
  const result = validateMobile(countryCode, String(value || '').replace(/\D/g, ''));
  if (!result.ok) {
    ctx.addIssue({ code: 'custom', message: result.msg || 'Enter a valid mobile number.' });
  }
});

export const usernamePatternSchema = z.string()
  .refine((v) => v.trim().length > 0, 'Username is required')
  .refine((v) => !v.trim() || PATTERNS.username.test(v.trim()), 'Use 1–30 letters, numbers, dots or underscores.');

export const genderSchema = z.string().min(1, 'Please select your gender');

export const pincodeSchema = z.string()
  .refine((v) => v.trim().length > 0, 'PIN code is required')
  .refine((v) => !v.trim() || PIN_PATTERN.test(v.trim()), 'Enter a valid 6-digit PIN code (it can’t start with 0).');

export const citySchema = z.string().min(1, 'Please select your city');

/** Tracking params (?igshid=, ?si=) are stripped before the pattern is tested. */
export const youtubeUrlSchema = z.string()
  .refine((value) => PATTERNS.youtube.test(cleanUrl(value)), 'Enter a valid YouTube channel URL');
export const instagramUrlSchema = z.string()
  .refine((value) => PATTERNS.instagramUrl.test(cleanUrl(value)), 'Enter a valid Instagram profile URL');

/* ── helpers ──────────────────────────────────────────────────────────── */

/** Run a field schema and report its first message at `path` — the bridge
 *  between a field's own rules and the error key the UI reads. */
function checkField(ctx, schema, value, path) {
  const result = schema.safeParse(value);
  if (!result.success) {
    ctx.addIssue({ code: 'custom', path: [path], message: result.error.issues[0].message });
  }
}

const requiresYoutube = (platform) => platform === 'YouTube' || platform === 'Both';
const requiresInstagram = (platform) => platform === 'Instagram' || platform === 'Both';

/* ── step schemas ─────────────────────────────────────────────────────────
   Each takes the state that lives outside the form — OTP verification, the
   referral/username lookups, the selfie upload — because those decide whether
   a step may be left, but they are not values the user types.
   ---------------------------------------------------------------------- */

/**
 * STEP 01 — name · dob (18+ gate) · mobile · email · referral · consents.
 * `ensureReferralChecked` is awaited exactly where the old code awaited it:
 * on submit, and only when a code is present that has not already validated.
 */
export const identityStepSchema = ({
  phoneVerified, emailVerified, referralStatus, ensureReferralChecked,
}) => z.looseObject({
  fname: firstNameSchema,
  lname: lastNameSchema,
  dob: dobSchema,
  email: emailSchema,
}).superRefine(async (values, ctx) => {
  checkField(ctx, mobileSchemaFor(values.cc), values.mobile, 'phone');

  if (String(values.referralCode || '').trim() && referralStatus.state !== 'valid') {
    const result = await ensureReferralChecked();
    if (!result.ok) {
      ctx.addIssue({
        code: 'custom', path: ['referral'],
        message: result.msg || 'Enter a valid referral code, or clear the field.',
      });
    }
  }

  if (!phoneVerified || !emailVerified) {
    ctx.addIssue({ code: 'custom', path: ['verify'], message: 'Please verify both mobile and email.' });
  }
  if (!values.consentAge) {
    ctx.addIssue({ code: 'custom', path: ['age'], message: 'Please confirm you are 18 or older.' });
  }
  if (!values.consentTerms) {
    ctx.addIssue({ code: 'custom', path: ['terms'], message: 'Please accept the Terms, Privacy and Cookie policies.' });
  }
});

/**
 * STEP 02 — username (availability) · gender · pin · state · city.
 * `ensureUsernameChecked` awaits the debounced check already in flight rather
 * than racing it; racing it is what made the first Continue click a no-op.
 */
export const profileStepSchema = ({ ensureUsernameChecked }) => z.looseObject({
  gender: genderSchema,
  pincode: pincodeSchema,
  city: citySchema,
}).superRefine(async (values, ctx) => {
  const username = String(values.username || '').trim();
  const pattern = usernamePatternSchema.safeParse(username);
  if (!pattern.success) {
    ctx.addIssue({ code: 'custom', path: ['username'], message: pattern.error.issues[0].message });
  } else {
    const status = await ensureUsernameChecked();
    if (status === 'taken') {
      ctx.addIssue({
        code: 'custom', path: ['username'],
        message: `@${username} is already taken — please use another username.`,
      });
    } else if (status !== 'available') {
      ctx.addIssue({
        code: 'custom', path: ['username'],
        message: 'We couldn’t confirm this username. Please try again.',
      });
    }
  }

  // The <select> carries the id; the name is only what we show and submit.
  if (!values.stateId) {
    ctx.addIssue({ code: 'custom', path: ['state'], message: 'Please select your state' });
  }
});

/** STEP 03 — primary platform, and the URL(s) that platform makes required. */
export const socialsStepSchema = () => z.looseObject({}).superRefine((values, ctx) => {
  const platform = values.primaryPlatform;
  if (!platform) {
    ctx.addIssue({ code: 'custom', path: ['platform'], message: 'Please select your primary platform' });
  }
  if (requiresYoutube(platform)) checkField(ctx, youtubeUrlSchema, values.youtube, 'youtube');
  if (requiresInstagram(platform)) checkField(ctx, instagramUrlSchema, values.instagram, 'instagram');
});

/** STEP 04 — category grid, then the profession that category unlocks. */
export const categoryStepSchema = () => z.looseObject({}).superRefine((values, ctx) => {
  if (!values.categoryCode) {
    ctx.addIssue({ code: 'custom', path: ['category'], message: 'Please choose a category' });
  } else if (!values.profession) {
    ctx.addIssue({ code: 'custom', path: ['profession'], message: 'Please select your profession' });
  }
});

/** STEP 05 — the live selfie. Documents stay optional: QC1 can request
 *  anything missing during review. */
export const proofStepSchema = ({ selfieReady }) => z.looseObject({}).superRefine((_values, ctx) => {
  if (!selfieReady) {
    ctx.addIssue({ code: 'custom', path: ['selfie'], message: 'Please complete the live selfie check' });
  }
});

/** The schema for the step being shown. Step 5 is the success screen. */
export const stepSchema = (step, externals) => ([
  identityStepSchema, profileStepSchema, socialsStepSchema, categoryStepSchema, proofStepSchema,
][step] || (() => z.looseObject({})))(externals);

/* ── focus order ──────────────────────────────────────────────────────────
   Which field the card scrolls to when a step fails, in the order the old
   validateStep() pushed them. `field: null` means the target depends on
   runtime state — the OTP row is the send button until a code has been sent.
   ---------------------------------------------------------------------- */
export const STEP_FOCUS_ORDER = [
  [
    { key: 'fname', field: 'fname' },
    { key: 'lname', field: 'lname' },
    { key: 'dob', field: 'dob' },
    { key: 'phone', field: 'mobile' },
    { key: 'email', field: 'email' },
    { key: 'referral', field: 'referral' },
    { key: 'verify', field: null },
    { key: 'age', field: 'age' },
    { key: 'terms', field: 'terms' },
  ],
  [
    { key: 'username', field: 'username' },
    { key: 'gender', field: 'gender' },
    { key: 'pincode', field: 'pincode' },
    { key: 'state', field: 'state' },
    { key: 'city', field: 'city' },
  ],
  [
    { key: 'platform', field: 'platform' },
    { key: 'youtube', field: 'youtube' },
    { key: 'instagram', field: 'instagram' },
  ],
  [
    { key: 'category', field: 'category' },
    { key: 'profession', field: 'profession' },
  ],
  [
    { key: 'selfie', field: 'selfie' },
  ],
];

/** First failing field of `step`, as a scroll target id. */
export function firstInvalidField(step, errors, { otpSent } = {}) {
  const entry = (STEP_FOCUS_ORDER[step] || []).find(({ key }) => errors[key]);
  if (!entry) return null;
  if (entry.key === 'verify') return otpSent ? 'otp-panel' : 'otp-send';
  return entry.field;
}

/** @typedef {typeof REGISTER_DEFAULT_VALUES} RegisterValues */
/** @typedef {z.infer<ReturnType<typeof identityStepSchema>>} IdentityStepValues */
/** @typedef {z.infer<ReturnType<typeof profileStepSchema>>} ProfileStepValues */
