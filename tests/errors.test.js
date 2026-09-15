// tests/errors.test.js
import { describe, it, expect } from 'vitest';

import { ApiError, toUserMessage } from '@/lib/api/errors';

describe('ApiError', () => {
  it('classifies by status', () => {
    expect(new ApiError('x', { status: 401 }).isUnauthorized).toBe(true);
    expect(new ApiError('x', { status: 403 }).isForbidden).toBe(true);
    expect(new ApiError('x', { status: 404 }).isNotFound).toBe(true);
    expect(new ApiError('x', { status: 422 }).isValidation).toBe(true);
    expect(new ApiError('x', { status: 400 }).isValidation).toBe(true);
    expect(new ApiError('x', { status: 0 }).isNetwork).toBe(true);
  });

  it('treats a TIMEOUT code as a timeout, not a generic network error', () => {
    const e = new ApiError('x', { status: 0, code: 'TIMEOUT' });
    expect(e.isTimeout).toBe(true);
  });

  it('keeps fieldErrors as a first-class property', () => {
    const e = new ApiError('Request validation failed', {
      status: 422,
      fieldErrors: [{ field: 'email', message: 'required' }],
    });
    expect(e.fieldErrors).toHaveLength(1);
  });
});

describe('toUserMessage', () => {
  it('never leaks a 500 message to the user', () => {
    const e = new ApiError('TypeError: cannot read property x of undefined', { status: 500 });
    expect(toUserMessage(e)).toBe('The server had a problem. Please try again shortly.');
  });

  it('does surface a validation message, which comes from our own backend', () => {
    const e = new ApiError('Email is already registered', { status: 422 });
    expect(toUserMessage(e)).toBe('Email is already registered');
  });

  it('handles a non-ApiError without throwing', () => {
    expect(toUserMessage(new Error('boom'))).toBe('Something went wrong. Please try again.');
    expect(toUserMessage(undefined)).toBe('Something went wrong. Please try again.');
    expect(toUserMessage('a string')).toBe('Something went wrong. Please try again.');
  });

  it('distinguishes timeout from offline', () => {
    expect(toUserMessage(new ApiError('', { status: 0, code: 'TIMEOUT' })))
      .toBe('That took too long. Please try again.');
    expect(toUserMessage(new ApiError('', { status: 0 })))
      .toBe('Cannot reach the server. Check your connection.');
  });
});
