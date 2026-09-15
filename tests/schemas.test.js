// tests/schemas.test.js
//
// The load-bearing test in this file is the "keeps unknown keys" one. Every
// schema in lib/api/schemas.js must be loose: z.object silently STRIPS keys it
// does not name, so a strict schema would delete real response fields and the
// bug would surface as `undefined` inside a component with no error anywhere.

import { describe, it, expect } from 'vitest';

import { upstreamLoginSchema, userSchema, loginResponseSchema } from '@/lib/api/schemas';

describe('every response schema is loose', () => {
  it('userSchema keeps fields it does not declare', () => {
    const parsed = userSchema.parse({
      _id: '1', email: 'a@b.c', role: 'creator',
      avatarUrl: 'https://x/y.jpg', membershipTier: 'gold',
    });
    expect(parsed.avatarUrl).toBe('https://x/y.jpg');
    expect(parsed.membershipTier).toBe('gold');
  });

  it('upstreamLoginSchema keeps fields it does not declare', () => {
    const parsed = upstreamLoginSchema.parse({
      token: 't', user: { _id: '1' }, refreshToken: 'r', expiresIn: 3600,
    });
    expect(parsed.refreshToken).toBe('r');
    expect(parsed.expiresIn).toBe(3600);
  });

  it('loginResponseSchema tolerates a null user', () => {
    expect(loginResponseSchema.parse({ user: null }).user).toBeNull();
  });
});

describe('upstreamLoginSchema', () => {
  it('rejects a response with no token — the bug it exists to catch', () => {
    const r = upstreamLoginSchema.safeParse({ user: { _id: '1' } });
    expect(r.success).toBe(false);
  });

  it('rejects an empty-string token, which would set a useless cookie', () => {
    const r = upstreamLoginSchema.safeParse({ token: '', user: { _id: '1' } });
    expect(r.success).toBe(false);
  });

  it('accepts a missing appToken — not every account has one', () => {
    const r = upstreamLoginSchema.safeParse({ token: 't', user: { _id: '1' } });
    expect(r.success).toBe(true);
  });

  it('accepts both _id and id, since the backends disagree', () => {
    expect(upstreamLoginSchema.safeParse({ token: 't', user: { id: 5 } }).success).toBe(true);
    expect(upstreamLoginSchema.safeParse({ token: 't', user: { _id: 'x' } }).success).toBe(true);
  });
});
