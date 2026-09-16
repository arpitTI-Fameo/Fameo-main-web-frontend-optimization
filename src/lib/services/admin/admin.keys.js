// lib/services/admin/admin.keys.js
//
// The single source of query keys for the admin panel.
//
// Every admin hook used to write its key as an array literal, and two of them
// were duplicated verbatim by the server prefetch on the matching page:
//
//     app/admin/courses/page.js   queryKey: ['admin', 'courses']
//     lib/hooks/admin/useCourses  queryKey: ['admin', 'courses']
//
// They agree here by luck. When they stop agreeing nothing breaks loudly — the
// dehydrated cache simply never matches the hook that reads it, so the page
// ships a spinner and refetches everything it just prefetched. That is the
// failure CLAUDE.md §2a means by "silent dead hydration", and it is why both
// sides now import from one place.
//
// Every factory below returns the SAME array the literal it replaced produced,
// element for element.

export const adminKeys = {
  all: () => ['admin'],

  // Overview
  stats: () => [...adminKeys.all(), 'stats'],
  activity: (limit) => [...adminKeys.all(), 'activity', { limit }],
  settings: () => [...adminKeys.all(), 'settings'],

  // Content
  content: () => [...adminKeys.all(), 'content'],
  contentList: (params) => [...adminKeys.content(), params],
  contentDetail: (id) => [...adminKeys.content(), id],

  // Courses
  courses: () => [...adminKeys.all(), 'courses'],
  course: (id) => [...adminKeys.courses(), id],

  // Approvals & archive
  approvals: (status) => [...adminKeys.all(), 'approvals', { status }],
  archive: () => [...adminKeys.all(), 'archive'],

  // Catalogue
  products: () => [...adminKeys.all(), 'products'],
  media: () => [...adminKeys.all(), 'media'],
  moduleMasters: () => [...adminKeys.all(), 'module-masters'],

  // People
  roleUsers: () => [...adminKeys.all(), 'roles', 'users'],
  contacts: (search, roleFilter) => [...adminKeys.all(), 'contacts', { search, roleFilter }],

  // Support
  support: () => [...adminKeys.all(), 'support'],
  supportTickets: (status) => [...adminKeys.support(), 'tickets', { status }],
  supportFaqs: () => [...adminKeys.support(), 'faqs'],

  // Reporting
  revenue: () => [...adminKeys.all(), 'revenue'],
  analytics: () => [...adminKeys.all(), 'analytics'],
  analyticsOverview: () => [...adminKeys.analytics(), 'overview'],
  analyticsTopics: () => [...adminKeys.analytics(), 'topics'],

  // Notifications
  notifications: () => [...adminKeys.all(), 'notifications'],
};
