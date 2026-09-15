// tests/client-key.test.js
//
// Regression tests for a VERIFIED rate-limit bypass.
//
// clientKey() used to return the FIRST X-Forwarded-For entry. Proxies APPEND
// the peer address rather than replacing the header, so that entry is whatever
// the client sent. Rotating it gave a fresh bucket per request and defeated
// every limit in the app — login brute force, the BFF proxy, the revalidate
// webhook. Confirmed live before the fix:
//
//     exhausted bucket -> 429 + x-ratelimit headers   (limiter refused)
//     rotating fake IP -> 401 from the upstream       (sailed straight through)

import { describe, it, expect } from 'vitest';

import { clientKey } from '@/lib/api/server/rate-limit';

const req = (headers = {}) => new Request('https://x.test/', { headers });

describe('clientKey cannot be steered by a client-supplied header', () => {
  it('ignores client-prepended X-Forwarded-For entries', () => {
    // The attacker sends "1.1.1.1"; our proxy appends the real peer "9.9.9.9".
    const forged = clientKey(req({ 'x-forwarded-for': '1.1.1.1, 9.9.9.9' }));
    expect(forged).toBe('9.9.9.9');
    expect(forged).not.toBe('1.1.1.1');
  });

  it('gives the SAME bucket however the client rotates the forged prefix', () => {
    const keys = new Set(
      ['a.a.a.a', 'b.b.b.b', 'c.c.c.c', 'd.d.d.d'].map((fake) =>
        clientKey(req({ 'x-forwarded-for': `${fake}, 9.9.9.9` })),
      ),
    );
    // One real client behind one proxy must always collapse to one bucket.
    expect(keys.size).toBe(1);
    expect([...keys][0]).toBe('9.9.9.9');
  });

  it('still separates genuinely different clients', () => {
    const a = clientKey(req({ 'x-forwarded-for': 'x, 10.0.0.1' }));
    const b = clientKey(req({ 'x-forwarded-for': 'x, 10.0.0.2' }));
    expect(a).not.toBe(b);
  });
});

describe('clientKey prefers headers the edge controls', () => {
  it('trusts cf-connecting-ip over X-Forwarded-For', () => {
    expect(clientKey(req({
      'cf-connecting-ip': '5.5.5.5',
      'x-forwarded-for': 'spoofed, 9.9.9.9',
    }))).toBe('5.5.5.5');
  });

  it('trusts x-real-ip over X-Forwarded-For', () => {
    expect(clientKey(req({
      'x-real-ip': '7.7.7.7',
      'x-forwarded-for': 'spoofed, 9.9.9.9',
    }))).toBe('7.7.7.7');
  });

  it('trusts x-vercel-forwarded-for', () => {
    expect(clientKey(req({ 'x-vercel-forwarded-for': '6.6.6.6' }))).toBe('6.6.6.6');
  });
});

describe('clientKey fails safe', () => {
  it('returns a shared bucket when no header identifies the caller', () => {
    // Limiting too aggressively is the safe direction; returning a unique
    // value here would mean no limiting at all.
    expect(clientKey(req({}))).toBe('unknown');
  });

  it('handles a single-entry X-Forwarded-For', () => {
    expect(clientKey(req({ 'x-forwarded-for': '9.9.9.9' }))).toBe('9.9.9.9');
  });

  it('ignores empty entries rather than returning a blank key', () => {
    expect(clientKey(req({ 'x-forwarded-for': ' , , 9.9.9.9' }))).toBe('9.9.9.9');
  });
});
