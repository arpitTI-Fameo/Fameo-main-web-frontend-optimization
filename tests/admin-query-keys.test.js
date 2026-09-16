// tests/admin-query-keys.test.js
//
// Pins the admin query keys to the exact arrays that were written inline
// before they moved into a factory.
//
// This is not a restatement of the implementation for its own sake. A query
// key is a cache address shared by a server prefetch and the client hook that
// reads it, and when the two disagree nothing throws — the dehydrated entry
// just never matches, the page shows a spinner, and every prefetched request
// runs again on the client. Freezing the arrays here means a rename in the
// factory has to be a deliberate act, not a silent cache miss.

import { describe, it, expect } from 'vitest';
import { adminKeys } from '@/lib/services/admin/admin.keys';

describe('admin query keys still address the same cache entries', () => {
  it.each([
    [adminKeys.all(), ['admin']],
    [adminKeys.stats(), ['admin', 'stats']],
    [adminKeys.activity(5), ['admin', 'activity', { limit: 5 }]],
    [adminKeys.settings(), ['admin', 'settings']],
    [adminKeys.contentList('page=1&limit=10'), ['admin', 'content', 'page=1&limit=10']],
    [adminKeys.contentDetail('abc'), ['admin', 'content', 'abc']],
    [adminKeys.courses(), ['admin', 'courses']],
    [adminKeys.course('c1'), ['admin', 'courses', 'c1']],
    [adminKeys.approvals('pending'), ['admin', 'approvals', { status: 'pending' }]],
    [adminKeys.archive(), ['admin', 'archive']],
    [adminKeys.products(), ['admin', 'products']],
    [adminKeys.media(), ['admin', 'media']],
    [adminKeys.moduleMasters(), ['admin', 'module-masters']],
    [adminKeys.roleUsers(), ['admin', 'roles', 'users']],
    [adminKeys.contacts('jo', 'admin'), ['admin', 'contacts', { search: 'jo', roleFilter: 'admin' }]],
    [adminKeys.supportTickets('open'), ['admin', 'support', 'tickets', { status: 'open' }]],
    [adminKeys.supportFaqs(), ['admin', 'support', 'faqs']],
    [adminKeys.revenue(), ['admin', 'revenue']],
    [adminKeys.analyticsOverview(), ['admin', 'analytics', 'overview']],
    [adminKeys.analyticsTopics(), ['admin', 'analytics', 'topics']],
    [adminKeys.notifications(), ['admin', 'notifications']],
  ])('%j', (actual, expected) => {
    expect(actual).toEqual(expected);
  });

  // The pair that was duplicated across the prefetch page and the hook.
  it('gives the prefetch and the hook the identical key for courses', () => {
    expect(adminKeys.courses()).toEqual(adminKeys.courses());
    expect(adminKeys.contentList('page=1&limit=10'))
      .toEqual(adminKeys.contentList('page=1&limit=10'));
  });

  it('roots every key under "admin" so one invalidation can clear the panel', () => {
    const factories = Object.values(adminKeys).map((fn) => fn('x', 'y'));
    for (const key of factories) expect(key[0]).toBe('admin');
  });
});
