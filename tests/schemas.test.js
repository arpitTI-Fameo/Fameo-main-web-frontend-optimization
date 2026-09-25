// tests/schemas.test.js
//
// The load-bearing test in this file is the "keeps unknown keys" one. Every
// schema in lib/api/schemas.js must be loose: z.object silently STRIPS keys it
// does not name, so a strict schema would delete real response fields and the
// bug would surface as `undefined` inside a component with no error anywhere.

import { describe, it, expect } from 'vitest';

import {
  identityLoginSchema,
  identityTokensSchema,
  userSchema,
  loginResponseSchema,
} from '@/lib/api/schemas';

describe('every response schema is loose', () => {
  it('userSchema keeps fields it does not declare', () => {
    const parsed = userSchema.parse({
      _id: '1', email: 'a@b.c', role: 'creator',
      avatarUrl: 'https://x/y.jpg', membershipTier: 'gold',
    });
    expect(parsed.avatarUrl).toBe('https://x/y.jpg');
    expect(parsed.membershipTier).toBe('gold');
  });

  it('identityLoginSchema keeps fields it does not declare', () => {
    const parsed = identityLoginSchema.parse({
      tokens: { access_token: 't', refresh_token: 'r', token_type: 'Bearer' },
      user: { user_id: 'u', username: 'FAMEO1' },
      session_id: 's',
    });
    expect(parsed.session_id).toBe('s');
    expect(parsed.tokens.token_type).toBe('Bearer');
    expect(parsed.user.username).toBe('FAMEO1');
  });

  it('loginResponseSchema tolerates a null user', () => {
    expect(loginResponseSchema.parse({ user: null }).user).toBeNull();
  });
});

describe('identity token contract (Fameoinfo-Backend)', () => {
  it('rejects a login with no access token — the bug it exists to catch', () => {
    expect(identityLoginSchema.safeParse({ tokens: {}, user: null }).success).toBe(false);
    expect(identityLoginSchema.safeParse({ user: { user_id: 'u' } }).success).toBe(false);
  });

  it('rejects an empty-string access token, which would set a useless cookie', () => {
    expect(identityTokensSchema.safeParse({ access_token: '' }).success).toBe(false);
  });

  it('accepts a refresh answer without a user', () => {
    expect(identityTokensSchema.safeParse({ access_token: 'a', refresh_token: 'r', expires_in: 900 }).success).toBe(true);
  });
});
