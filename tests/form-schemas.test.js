// tests/form-schemas.test.js
//
// The two forms outside modules/Auth that moved to React Hook Form + zod:
// the admin sign-in card and the support request form. As with the auth
// schemas, the rules did not change — so what is tested is that they did not.
//
// The load-bearing case in here is "accepts what type=email accepts". The
// admin card keeps its native `required` / `type="email"` attributes, so a zod
// rule stricter than the browser's would reject an address the browser lets
// through and block a sign-in that works today.

import { describe, it, expect } from 'vitest';

import {
  adminLoginSchema, ADMIN_LOGIN_DEFAULT_VALUES, ADMIN_LOGIN_REQUIRED_MESSAGE,
} from '@/modules/Admin/Login/schema';
import { supportSchema, firstSupportError } from '@/modules/Main/Support/schema';

/** First message per path — the "first issue wins" rule zodResolver uses. */
function messagesFor(schema, values) {
  const result = schema.safeParse(values);
  const byPath = {};
  for (const issue of result.error?.issues || []) {
    const key = issue.path.join('.');
    if (!(key in byPath)) byPath[key] = issue.message;
  }
  return byPath;
}

describe('admin sign-in schema', () => {
  it('reports both empty fields with the one message the card can show', () => {
    expect(messagesFor(adminLoginSchema, ADMIN_LOGIN_DEFAULT_VALUES)).toEqual({
      email: ADMIN_LOGIN_REQUIRED_MESSAGE,
      password: ADMIN_LOGIN_REQUIRED_MESSAGE,
    });
  });

  it('prefers "required" over "invalid" for an empty email', () => {
    const messages = messagesFor(adminLoginSchema, { email: '', password: 'pw' });
    expect(messages.email).toBe(ADMIN_LOGIN_REQUIRED_MESSAGE);
  });

  // The whole reason this schema uses a regex instead of z.email().
  it.each([
    ['admin@fameo.in', 'ordinary address'],
    ['root@localhost', 'no dot, no TLD — valid to the browser'],
    ['admin@intranet', 'single-label host'],
    ["o'brien+tag@sub.example.co.uk", 'punctuation and subdomains'],
  ])('accepts %s (%s), exactly as type="email" does', (email) => {
    expect(messagesFor(adminLoginSchema, { email, password: 'pw' })).toEqual({});
  });

  it.each(['plainstring', 'two@@at.com', 'has space@x.com', '@nolocal.com'])(
    'rejects %s the way the browser would',
    (email) => {
      expect(messagesFor(adminLoginSchema, { email, password: 'pw' }).email)
        .toBe('Enter a valid email address');
    },
  );

  it('submits the credential exactly as typed', () => {
    const values = { email: 'Admin@Fameo.in', password: '  pa$$ word  ' };
    expect(adminLoginSchema.parse(values)).toEqual(values);
  });
});

describe('support request schema', () => {
  const valid = (over = {}) => ({
    name: 'Jane Creator',
    email: 'jane@example.com',
    category: 'Account & Login',
    subject: '',
    message: 'My OTP never arrives.',
    website: '',
    ...over,
  });

  it('keeps the three original messages', () => {
    expect(messagesFor(supportSchema, valid({ name: '   ' })).name).toBe('Please enter your name.');
    expect(messagesFor(supportSchema, valid({ email: 'jane@example' })).email)
      .toBe('Please enter a valid email address.');
    expect(messagesFor(supportSchema, valid({ message: '  \n ' })).message)
      .toBe('Please describe how we can help.');
  });

  it('treats subject as optional and leaves the topic alone', () => {
    expect(messagesFor(supportSchema, valid({ subject: '' }))).toEqual({});
    expect(supportSchema.parse(valid({ category: 'Verification' })).category).toBe('Verification');
  });

  it('never validates the honeypot — a filled one is handled in silence', () => {
    expect(messagesFor(supportSchema, valid({ website: 'http://spam.example' }))).toEqual({});
  });

  it('keeps every field, including ones it does not name', () => {
    const parsed = supportSchema.parse(valid({ website: 'x', extra: 'kept' }));
    expect(parsed.website).toBe('x');
    expect(parsed.extra).toBe('kept');
  });

  it('emails the message exactly as typed — no trimming on the way out', () => {
    const values = valid({ name: '  Jane  ', message: '  please help  ' });
    const parsed = supportSchema.parse(values);
    expect(parsed.name).toBe('  Jane  ');
    expect(parsed.message).toBe('  please help  ');
  });

  it('surfaces one message at a time, in the order validate() checked', () => {
    const allBad = {
      name: { message: 'Please enter your name.' },
      email: { message: 'Please enter a valid email address.' },
      message: { message: 'Please describe how we can help.' },
    };
    expect(firstSupportError(allBad)).toBe('Please enter your name.');

    const { name, ...withoutName } = allBad;
    expect(firstSupportError(withoutName)).toBe('Please enter a valid email address.');
    expect(firstSupportError({ message: allBad.message })).toBe('Please describe how we can help.');
    expect(firstSupportError({})).toBe('');
  });
});
