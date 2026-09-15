// tests/rate-limit.test.js
import { describe, it, expect, vi, afterEach } from 'vitest';

import { hit, clientKey, limitHeaders } from '@/lib/api/server/rate-limit';

afterEach(() => { vi.useRealTimers(); });

const uniq = () => `k-${Math.random()}`;

describe('hit', () => {
  it('allows exactly `limit` requests, then refuses', () => {
    const key = uniq();
    for (let i = 0; i < 3; i++) expect(hit(key, 3, 60_000).ok).toBe(true);
    expect(hit(key, 3, 60_000).ok).toBe(false);
  });

  it('counts down remaining and never goes negative', () => {
    const key = uniq();
    expect(hit(key, 2, 60_000).remaining).toBe(1);
    expect(hit(key, 2, 60_000).remaining).toBe(0);
    expect(hit(key, 2, 60_000).remaining).toBe(0);
  });

  it('keeps separate keys in separate buckets', () => {
    const a = uniq(); const b = uniq();
    hit(a, 1, 60_000);
    expect(hit(a, 1, 60_000).ok).toBe(false);
    expect(hit(b, 1, 60_000).ok).toBe(true);
  });

  it('resets once the window has passed', () => {
    vi.useFakeTimers();
    const key = uniq();
    expect(hit(key, 1, 1_000).ok).toBe(true);
    expect(hit(key, 1, 1_000).ok).toBe(false);
    vi.advanceTimersByTime(1_001);
    expect(hit(key, 1, 1_000).ok).toBe(true);
  });
});

describe('clientKey', () => {
  const req = (headers) => new Request('https://x.test/', { headers });

  it('takes the FIRST hop of x-forwarded-for — the real client', () => {
    expect(clientKey(req({ 'x-forwarded-for': '1.1.1.1, 2.2.2.2, 3.3.3.3' }))).toBe('1.1.1.1');
  });

  it('falls back through the other proxy headers', () => {
    expect(clientKey(req({ 'x-real-ip': '9.9.9.9' }))).toBe('9.9.9.9');
    expect(clientKey(req({ 'cf-connecting-ip': '8.8.8.8' }))).toBe('8.8.8.8');
  });

  it('never returns undefined, so an unidentifiable caller still gets a bucket', () => {
    expect(clientKey(req({}))).toBe('unknown');
  });
});

describe('limitHeaders', () => {
  it('adds retry-after only when the request was refused', () => {
    expect(limitHeaders({ ok: true, remaining: 5, resetAt: 0, retryAfter: 9 }, 10))
      .not.toHaveProperty('retry-after');
    expect(limitHeaders({ ok: false, remaining: 0, resetAt: 0, retryAfter: 9 }, 10))
      .toHaveProperty('retry-after', '9');
  });
});
