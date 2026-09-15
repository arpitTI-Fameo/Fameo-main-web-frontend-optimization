// tests/core.test.js
import { describe, it, expect, vi, afterEach } from 'vitest';
import { z } from 'zod';

import { isSuccessEnvelope, unwrap, qs, request } from '@/lib/api/core';
import { ApiError } from '@/lib/api/errors';

afterEach(() => { vi.unstubAllGlobals(); });

const jsonResponse = (body, { status = 200 } = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

describe('isSuccessEnvelope', () => {
  it('treats a literal success:false as failure even on HTTP 200', () => {
    expect(isSuccessEnvelope({ success: false, message: 'nope' }, true)).toBe(false);
  });

  it('does NOT read code:0 as failure — defect #10', () => {
    expect(isSuccessEnvelope({ code: 0, data: {} }, true)).toBe(true);
  });

  it('falls back to the HTTP status when there is no success field', () => {
    expect(isSuccessEnvelope({ data: 1 }, true)).toBe(true);
    expect(isSuccessEnvelope({ data: 1 }, false)).toBe(false);
  });
});

describe('unwrap', () => {
  it('returns the data field when the envelope has one', () => {
    expect(unwrap({ success: true, data: { id: 1 } })).toEqual({ id: 1 });
  });

  it('passes a bare payload through untouched', () => {
    expect(unwrap([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('returns null data rather than the envelope', () => {
    expect(unwrap({ success: true, data: null })).toBeNull();
  });
});

describe('qs', () => {
  it('skips null, undefined and empty string but keeps 0 and false', () => {
    expect(qs({ a: 0, b: false, c: null, d: undefined, e: '' })).toBe('?a=0&b=false');
  });

  it('returns an empty string for no params', () => {
    expect(qs()).toBe('');
    expect(qs({})).toBe('');
  });
});

describe('request', () => {
  it('unwraps a successful envelope', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({ success: true, data: { id: 7 } })));
    await expect(request('/x')).resolves.toEqual({ id: 7 });
  });

  it('throws an ApiError carrying the status and the backend message', async () => {
    vi.stubGlobal('fetch', vi.fn(async () =>
      jsonResponse({ success: false, message: 'Email already in use' }, { status: 409 })));

    await expect(request('/x')).rejects.toMatchObject({
      name: 'ApiError',
      status: 409,
      message: 'Email already in use',
    });
  });

  it('digs nested 422 field errors out of the registration shape', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({
      success: false,
      message: 'Request validation failed',
      error: { details: { errors: [{ field: 'mobile', message: 'invalid' }] } },
    }, { status: 422 })));

    await expect(request('/x')).rejects.toMatchObject({
      status: 422,
      fieldErrors: [{ field: 'mobile', message: 'invalid' }],
    });
  });

  it('strips tags from an HTML error page instead of surfacing markup', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(
      '<html><body><h1>413 Request Entity Too Large</h1></body></html>',
      { status: 413, headers: { 'content-type': 'text/html' } },
    )));

    const err = await request('/x').catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.message).not.toContain('<');
    expect(err.message).toContain('413');
  });

  it('reports a timeout as TIMEOUT, not as a generic network failure', async () => {
    vi.stubGlobal('fetch', vi.fn((_url, init) => new Promise((_resolve, reject) => {
      init.signal.addEventListener('abort', () => {
        reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
      });
    })));

    await expect(request('/x', { timeout: 10 })).rejects.toMatchObject({ code: 'TIMEOUT' });
  });

  it('returns null for 204 instead of trying to parse a body', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 204 })));
    await expect(request('/x')).resolves.toBeNull();
  });

  describe('schema validation', () => {
    it('passes a matching payload through', async () => {
      vi.stubGlobal('fetch', vi.fn(async () => jsonResponse({ success: true, data: { id: 1 } })));
      const schema = z.looseObject({ id: z.number() });
      await expect(request('/x', { schema })).resolves.toEqual({ id: 1 });
    });

    it('PRESERVES fields the schema does not name — a strict schema would delete them', async () => {
      vi.stubGlobal('fetch', vi.fn(async () =>
        jsonResponse({ success: true, data: { id: 1, extra: 'keep me' } })));
      const schema = z.looseObject({ id: z.number() });
      await expect(request('/x', { schema })).resolves.toEqual({ id: 1, extra: 'keep me' });
    });

    it('throws SCHEMA_MISMATCH in development when the contract drifts', async () => {
      vi.stubGlobal('fetch', vi.fn(async () =>
        jsonResponse({ success: true, data: { id: 'not-a-number' } })));
      const schema = z.looseObject({ id: z.number() });
      await expect(request('/x', { schema })).rejects.toMatchObject({ code: 'SCHEMA_MISMATCH' });
    });
  });
});
