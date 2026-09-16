// tests/relative-time.test.js
//
// Nine hand-written "timeAgo" copies collapsed into three shared formatters.
// They were not all the same function, so these tests pin the exact strings
// each one produced before the move — particularly the single branch that
// separates timeAgo from timeAgoNumeric, which is visible text in the UI.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { timeAgo, timeAgoNumeric, daysAgo } from '@/utils/relativeTime';

const NOW = new Date('2026-09-16T12:00:00.000Z');
const ago = (ms) => new Date(NOW.getTime() - ms).toISOString();
const MIN = 60_000, HOUR = 60 * MIN, DAY = 24 * HOUR;

const freeze = () => vi.useFakeTimers({ now: NOW });
afterEach(() => vi.useRealTimers());

describe('timeAgo — the variant that says "just now"', () => {
  it.each([
    [0, 'just now'],
    [59_000, 'just now'],
    [MIN, '1m ago'],
    [59 * MIN, '59m ago'],
    [HOUR, '1h ago'],
    [23 * HOUR, '23h ago'],
    [DAY, '1d ago'],
    [9 * DAY, '9d ago'],
  ])('%ims ago -> %s', (delta, expected) => {
    freeze();
    expect(timeAgo(ago(delta))).toBe(expected);
  });
});

describe('timeAgoNumeric — the variant that never says "just now"', () => {
  it.each([
    [0, '0m ago'],
    [59_000, '0m ago'],
    [MIN, '1m ago'],
    [HOUR, '1h ago'],
    [DAY, '1d ago'],
  ])('%ims ago -> %s', (delta, expected) => {
    freeze();
    expect(timeAgoNumeric(ago(delta))).toBe(expected);
  });

  // The one branch that separates the two. If this ever passes, the
  // consolidation silently changed four screens.
  it('differs from timeAgo only under a minute', () => {
    freeze();
    expect(timeAgoNumeric(ago(0))).not.toBe(timeAgo(ago(0)));
    expect(timeAgoNumeric(ago(HOUR))).toBe(timeAgo(ago(HOUR)));
    expect(timeAgoNumeric(ago(5 * DAY))).toBe(timeAgo(ago(5 * DAY)));
  });
});

describe('daysAgo — whole-day granularity', () => {
  it.each([
    [0, 'today'],
    [HOUR, 'today'],
    [DAY, 'yesterday'],
    [2 * DAY, '2 days ago'],
    [30 * DAY, '30 days ago'],
  ])('%ims ago -> %s', (delta, expected) => {
    freeze();
    expect(daysAgo(ago(delta))).toBe(expected);
  });
});
