// tests/constants-values.test.js
//
// Freezes the literal values that moved out of the code and into constants.
//
// The whole point of that refactor was that the runtime string stays byte for
// byte what it was. A renamed KEY is a compile error someone notices; a
// changed VALUE is silent — '/admin/media-center' becoming '/admin/media'
// still builds, still renders a link, and 404s only for whoever clicks it.
// These are the values as they were written inline before centralisation.

import { describe, it, expect } from 'vitest';

import { ROUTES, ADMIN_ROUTES } from '@/constants/routes';
import {
  ADMIN_ROLE, ADMIN_ROLES, CONTENT_AUTHOR_ROLES, CONTENT_APPROVER_ROLES,
} from '@/constants/roles';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { CONTENT_STATUS, STATUS_CONFIG } from '@/modules/Admin/ContentOS/constants';
import { ADMIN_PREFIX, GATED_ROUTES } from '@/lib/auth/gated-routes';
import { DEFAULT_LOCALE } from '@/constants/locale';
import { PRODUCTS_PAGE_SIZE } from '@/lib/api/config';

describe('admin route paths', () => {
  it('are exactly the paths the sidebar, guards and middleware used', () => {
    expect(ADMIN_ROUTES).toEqual({
      ROOT: '/admin',
      LOGIN: '/admin/login',
      APPROVAL: '/admin/approval',
      CONTENT: '/admin/content',
      CONTENT_NEW: '/admin/content/new',
      CONTENT_NEW_EDIT: '/admin/content/new/edit',
      COURSES: '/admin/courses',
      MEDIA_CENTER: '/admin/media-center',
      ARCHIVE: '/admin/archive',
      PRODUCTS: '/admin/products',
      REVENUE: '/admin/revenue',
      ANALYTICS: '/admin/analytics',
      CONTACTS: '/admin/contacts',
      MODULE_MASTERS: '/admin/module-masters',
      ROLES: '/admin/roles',
      SUPPORT: '/admin/support',
      NOTIFICATIONS: '/admin/notifications',
      SETTINGS: '/admin/settings',
    });
  });

  it('every admin path sits under the root, so the middleware prefix test holds', () => {
    for (const path of Object.values(ADMIN_ROUTES)) {
      expect(path.startsWith(ADMIN_ROUTES.ROOT)).toBe(true);
    }
  });

  // gated-routes used to spell '/admin' itself.
  it('is the same value the route gate uses', () => {
    expect(ADMIN_PREFIX).toBe(ADMIN_ROUTES.ROOT);
    expect(GATED_ROUTES).toContain(ADMIN_ROUTES.ROOT);
  });

  it('keeps /support pointing at the support centre', () => {
    expect(ROUTES.SUPPORT).toBe('/support');
  });
});

describe('admin roles', () => {
  it('are the four values in the token’s role claim', () => {
    expect(ADMIN_ROLE).toEqual({
      SUPER_ADMIN: 'superAdmin',
      CONTENT_MANAGER: 'contentManager',
      MODULE_MASTER: 'moduleMaster',
      SUPPORT_AGENT: 'supportAgent',
    });
  });

  // The list the middleware, the login route and the layout each had a copy of.
  it('allows exactly the roles the three guards allowed', () => {
    expect(ADMIN_ROLES).toEqual(['superAdmin', 'contentManager', 'moduleMaster', 'supportAgent']);
  });

  it('keeps the content capability lists as they were written inline', () => {
    expect(CONTENT_AUTHOR_ROLES).toEqual(['superAdmin', 'contentManager', 'moduleMaster']);
    expect(CONTENT_APPROVER_ROLES).toEqual(['superAdmin', 'contentManager']);
  });

  it('never grants a support agent authoring rights', () => {
    expect(CONTENT_AUTHOR_ROLES).not.toContain(ADMIN_ROLE.SUPPORT_AGENT);
    expect(CONTENT_APPROVER_ROLES).not.toContain(ADMIN_ROLE.SUPPORT_AGENT);
  });

  it('draws every capability list from the admin roles', () => {
    for (const role of [...CONTENT_AUTHOR_ROLES, ...CONTENT_APPROVER_ROLES]) {
      expect(ADMIN_ROLES).toContain(role);
    }
  });
});

describe('web storage keys', () => {
  it('address the same entries the literals did', () => {
    expect(STORAGE_KEYS).toEqual({
      USER: 'fameo_user',
      JUST_LOGGED_IN: 'fameo_just_logged_in',
      PROFILE_PHOTO: 'fameo_profile_photo',
      LEGACY_TOKEN: 'fameo_token',
      LEGACY_REFRESH: 'fameo_refresh',
    });
  });
});

describe('content status', () => {
  it('keeps the four lifecycle values', () => {
    expect(CONTENT_STATUS).toEqual({
      PUBLISHED: 'published',
      DRAFT: 'draft',
      REVIEW: 'review',
      ARCHIVED: 'archived',
    });
  });

  // ContentOSFilters renders Object.keys(STATUS_CONFIG) as the filter chips,
  // so this order is the on-screen order and is load-bearing.
  it('configures every status, in the order the filter chips render', () => {
    expect(Object.keys(STATUS_CONFIG)).toEqual(['published', 'draft', 'review', 'archived']);
  });
});

describe('formatting and paging defaults', () => {
  // Grouping differs by locale: 'en-IN' gives ₹1,00,000 where 'en-US' gives
  // ₹100,000. Changing this silently restyles every price in the app.
  it('formats with the Indian locale, as all 21 call sites did', () => {
    expect(DEFAULT_LOCALE).toBe('en-IN');
    expect((100000).toLocaleString(DEFAULT_LOCALE)).toBe('1,00,000');
  });

  // The client storefront call and its server prefetch must ask for the same
  // page, or the dehydrated cache entry never matches the query that reads it.
  it('keeps the product page size the prefetch and the hook agreed on', () => {
    expect(PRODUCTS_PAGE_SIZE).toBe(50);
  });
});
