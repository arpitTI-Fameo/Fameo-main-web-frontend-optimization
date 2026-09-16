// tests/auth-form-schemas.test.js
//
// The Auth forms moved from hand-rolled validate() functions to React Hook
// Form + zod. The rules did not change — so what is worth testing is exactly
// that: same messages, same keys, same order of precedence.
//
// Two properties here are load-bearing and would fail silently if broken:
//
//   1. ISSUE PATH = ERROR KEY. The step components render `errors.phone`,
//      `errors.verify`, `errors.age` — keys that do not match the value they
//      describe. A schema emitting at `mobile` instead of `phone` renders
//      nothing at all: a missing key is just an absent <div>, not an error.
//
//   2. NO TRANSFORMS. zodResolver hands its parsed output back to RHF as the
//      form values, and the register payload is built from those values. A
//      stray .trim() in a schema would quietly rewrite what the user typed.

import { describe, it, expect } from 'vitest';

import { loginSchema, LOGIN_REQUIRED_MESSAGE } from '@/modules/Auth/Login/schema';
import {
  REGISTER_DEFAULT_VALUES, identityStepSchema, profileStepSchema,
  socialsStepSchema, categoryStepSchema, proofStepSchema, firstInvalidField,
} from '@/modules/Auth/Register/schema';

/** First message per path — the same "first issue wins" rule zodResolver uses. */
async function messagesFor(schema, values) {
  const result = await schema.safeParseAsync(values);
  const byPath = {};
  for (const issue of result.error?.issues || []) {
    const key = issue.path.join('.');
    if (!(key in byPath)) byPath[key] = issue.message;
  }
  return byPath;
}

const identityExternals = (over = {}) => ({
  phoneVerified: true, emailVerified: true,
  referralStatus: { state: 'idle', msg: '', data: null },
  ensureReferralChecked: async () => ({ ok: true, msg: '' }),
  ...over,
});

const validIdentity = (over = {}) => ({
  ...REGISTER_DEFAULT_VALUES,
  fname: 'Ada', lname: 'Lovelace', dob: '1990-05-04',
  mobile: '9876543210', email: 'ada@example.com',
  consentAge: true, consentTerms: true,
  ...over,
});

describe('login form schema', () => {
  it('uses one combined message, so the card still renders a single error line', async () => {
    const onlyUsername = await messagesFor(loginSchema, { username: 'ada', password: '' });
    const onlyPassword = await messagesFor(loginSchema, { username: '', password: 'pw' });
    expect(onlyUsername.password).toBe(LOGIN_REQUIRED_MESSAGE);
    expect(onlyPassword.username).toBe(LOGIN_REQUIRED_MESSAGE);
  });

  it('accepts credentials verbatim — no trimming, no case folding', async () => {
    const values = { username: '  Ada  ', password: ' Pa$$ ' };
    const parsed = loginSchema.parse(values);
    expect(parsed).toEqual(values);
  });
});

describe('register step 01 — identity', () => {
  it('reports every problem on the step at once, under the legacy error keys', async () => {
    const messages = await messagesFor(
      identityStepSchema(identityExternals({ phoneVerified: false, emailVerified: false })),
      { ...REGISTER_DEFAULT_VALUES },
    );
    expect(messages).toEqual({
      fname: 'First name is required',
      lname: 'Last name is required',
      dob: 'Date of birth is required',
      email: 'Email address is required',
      phone: 'Mobile number is required',
      verify: 'Please verify both mobile and email.',
      age: 'Please confirm you are 18 or older.',
      terms: 'Please accept the Terms, Privacy and Cookie policies.',
    });
  });

  it('walks the DOB ladder in order: required, then real date, then 18+', async () => {
    const externals = identityExternals();
    const impossible = await messagesFor(identityStepSchema(externals), validIdentity({ dob: '2000-11-31' }));
    expect(impossible.dob).toBe('That date doesn’t exist — please pick a valid date.');

    const child = new Date();
    child.setFullYear(child.getFullYear() - 10);
    const iso = child.toISOString().slice(0, 10);
    const underage = await messagesFor(identityStepSchema(externals), validIdentity({ dob: iso }));
    expect(underage.dob).toMatch(/^You must be 18 or older \(you're 10\)\.$/);
  });

  it('keeps the per-country mobile rule, reported at `phone`', async () => {
    const externals = identityExternals();
    const badStart = await messagesFor(identityStepSchema(externals), validIdentity({ cc: '+91', mobile: '1234567890' }));
    expect(badStart.phone).toBe('Indian mobile numbers start with 6, 7, 8 or 9.');
    expect(badStart.mobile).toBeUndefined();

    const tooShort = await messagesFor(identityStepSchema(externals), validIdentity({ cc: '+971', mobile: '5123' }));
    expect(tooShort.phone).toBe('That’s 4 of 9 digits for +971.');
  });

  it('only consults the referral lookup for a code that has not already validated', async () => {
    let calls = 0;
    const externals = identityExternals({ ensureReferralChecked: async () => (calls++, { ok: false, msg: 'Nope' }) });

    expect(await messagesFor(identityStepSchema(externals), validIdentity())).toEqual({});
    expect(calls).toBe(0);

    const withCode = await messagesFor(identityStepSchema(externals), validIdentity({ referralCode: 'FAMEO-1' }));
    expect(withCode.referral).toBe('Nope');
    expect(calls).toBe(1);

    const alreadyValid = identityExternals({
      referralStatus: { state: 'valid', msg: '', data: null },
      ensureReferralChecked: async () => (calls++, { ok: false, msg: 'Nope' }),
    });
    expect(await messagesFor(identityStepSchema(alreadyValid), validIdentity({ referralCode: 'FAMEO-1' }))).toEqual({});
    expect(calls).toBe(1);
  });

  it('passes a complete step and returns the values untouched', async () => {
    const values = validIdentity({ fname: ' Ada ' });
    const parsed = await identityStepSchema(identityExternals()).parseAsync(values);
    expect(parsed).toEqual(values);
    expect(parsed.fname).toBe(' Ada ');
  });
});

describe('register step 02 — profile', () => {
  const values = (over = {}) => ({
    ...REGISTER_DEFAULT_VALUES,
    username: 'ada.lovelace', gender: 'female',
    stateId: 12, state: 'Maharashtra', city: 'Mumbai', cityId: 3, pincode: '400001',
    ...over,
  });

  it('reports the state by its id but under the `state` key', async () => {
    const messages = await messagesFor(
      profileStepSchema({ ensureUsernameChecked: async () => 'available' }),
      values({ stateId: null }),
    );
    expect(messages.state).toBe('Please select your state');
  });

  it('distinguishes taken from unconfirmable usernames', async () => {
    const taken = await messagesFor(profileStepSchema({ ensureUsernameChecked: async () => 'taken' }), values());
    expect(taken.username).toBe('@ada.lovelace is already taken — please use another username.');

    const errored = await messagesFor(profileStepSchema({ ensureUsernameChecked: async () => 'error' }), values());
    expect(errored.username).toBe('We couldn’t confirm this username. Please try again.');
  });

  it('rejects a bad username without spending a lookup on it', async () => {
    let calls = 0;
    const messages = await messagesFor(
      profileStepSchema({ ensureUsernameChecked: async () => (calls++, 'available') }),
      values({ username: 'ada lovelace!' }),
    );
    expect(messages.username).toBe('Use 1–30 letters, numbers, dots or underscores.');
    expect(calls).toBe(0);
  });

  it('keeps the 6-digit PIN rule and leaves the typed value alone', async () => {
    const bad = await messagesFor(profileStepSchema({ ensureUsernameChecked: async () => 'available' }), values({ pincode: '012345' }));
    expect(bad.pincode).toBe('Enter a valid 6-digit PIN code (it can’t start with 0).');

    const parsed = await profileStepSchema({ ensureUsernameChecked: async () => 'available' }).parseAsync(values());
    expect(parsed.pincode).toBe('400001');
  });
});

describe('register steps 03–05', () => {
  it('requires only the URLs the chosen platform implies', async () => {
    const base = { ...REGISTER_DEFAULT_VALUES };
    expect(await messagesFor(socialsStepSchema(), base)).toEqual({
      platform: 'Please select your primary platform',
    });

    const youtubeOnly = await messagesFor(socialsStepSchema(), { ...base, primaryPlatform: 'YouTube' });
    expect(youtubeOnly.youtube).toBe('Enter a valid YouTube channel URL');
    expect(youtubeOnly.instagram).toBeUndefined();

    const both = await messagesFor(socialsStepSchema(), { ...base, primaryPlatform: 'Both' });
    expect(Object.keys(both).sort()).toEqual(['instagram', 'youtube']);
  });

  it('accepts a social link that still carries tracking params', async () => {
    const messages = await messagesFor(socialsStepSchema(), {
      ...REGISTER_DEFAULT_VALUES,
      primaryPlatform: 'Instagram',
      instagram: 'https://instagram.com/ada?igshid=abc123',
    });
    expect(messages).toEqual({});
  });

  it('asks for a profession only once a category is chosen', async () => {
    const base = { ...REGISTER_DEFAULT_VALUES };
    expect(await messagesFor(categoryStepSchema(), base)).toEqual({ category: 'Please choose a category' });
    expect(await messagesFor(categoryStepSchema(), { ...base, categoryCode: 'K' }))
      .toEqual({ profession: 'Please select your profession' });
  });

  it('gates step 05 on the live selfie, never on the optional documents', async () => {
    expect(await messagesFor(proofStepSchema({ selfieReady: false }), REGISTER_DEFAULT_VALUES))
      .toEqual({ selfie: 'Please complete the live selfie check' });
    expect(await messagesFor(proofStepSchema({ selfieReady: true }), REGISTER_DEFAULT_VALUES)).toEqual({});
  });
});

describe('scroll target for the first invalid field', () => {
  it('follows the order the fields appear in, not the order zod reported them', () => {
    const errors = { terms: {}, phone: {}, lname: {} };
    expect(firstInvalidField(0, errors)).toBe('lname');
  });

  it('maps the keys whose scroll target is not their own name', () => {
    expect(firstInvalidField(0, { phone: {} })).toBe('mobile');
    expect(firstInvalidField(0, { verify: {} }, { otpSent: false })).toBe('otp-send');
    expect(firstInvalidField(0, { verify: {} }, { otpSent: true })).toBe('otp-panel');
  });

  it('returns null when the step is clean', () => {
    expect(firstInvalidField(1, {})).toBeNull();
  });
});
