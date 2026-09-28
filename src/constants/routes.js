// constants/routes.js
// Every in-app path lives here. Link to a route through these constants —
// never spell a path as a string literal in a component, hook or module.

/** `withQuery(ROUTES.LOGIN, { redirect: ROUTES.PLANS })` → `/login?redirect=%2Fplans` */
export const withQuery = (path, params) => `${path}?${new URLSearchParams(params)}`;

export const UPCOMING_ROUTES = {
  OTP: '/otp',
  PRODUCTS: '/products',
  COMMUNITY: '/community',
  COMMUNITY_USER: (id) => `/community/user/${id}`,
  COMMUNITY_SPACE: (id) => `/community/space/${id}`,
  TALENT_HIRE: '/talent-hire',
  PLANS: '/plans',
  PRODUCT: (category, slug) => `/products/${category}/${slug}`,
  FAVORITES: '/favorites',
  CATEGORY: (cat) => `/products/${cat}`,
  SUPPORT: '/support',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ACCOUNT: '/account',
  ACCOUNT_PROFILE: '/account/profile',
  ORDERS: '/account/orders',
  ORDER: (id) => `/account/orders/${id}`,
  TRACK_ORDER: '/account/track-order',
  SETTINGS: '/account/settings',
  WALLET: '/account/wallet',
  REFERRALS: '/account/referrals',
  ACCOUNT_PRODUCTS: '/account/products',
  SUBSCRIPTION: '/account/subscription',
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  HOME: '/',
  COURSES: '/resources/courses',
  COURSE: (slug) => `/resources/courses/${slug}`,
  ARTICLES: '/resources/articles',
  ARTICLE: (slug) => `/resources/articles/${slug}`,
  MY_LEARNINGS: '/resources/my-learnings',
  SAVED: '/resources/saved',
  RESOURCES: '/resources',
  UPCOMING: '/upcoming',
  // Linked from the course footer; no page exists under app/ yet.
  PRIVACY: '/privacy',
  TERMS: '/terms',
  ...UPCOMING_ROUTES,
};

/* PROTECTED_ROUTES used to live here, commented "used in middleware.js". It
   was not: middleware reads lib/auth/gated-routes.js, and the two lists had
   already drifted apart — this one was missing /products, /resources and the
   paid-tier routes entirely. A dead copy of an access-control list is worse
   than no copy, because editing it looks like changing who can reach what.
   Removed; lib/auth/gated-routes.js is the one source.

   PRODUCTS_SUBNAV_ROUTES went the same way — no consumer anywhere in the
   repo, and a second '/products' spelling next to ROUTES.PRODUCTS. */
/* ── Admin panel ───────────────────────────────────────────────────────────
   Every path under /admin, in one place.

   These were spelled out as literals in the sidebar's per-role nav map (which
   repeats the same path in up to four role blocks), the layout's auth guard,
   the edge middleware, and half a dozen Admin modules. A path that moves has
   to be found in all of them; miss one and the link 404s in production for
   whichever role happens to see it.

   Only paths the app actually links to are listed. Routes that exist under
   app/admin but are never linked (/admin/creation, /admin/leads,
   /admin/resources, /admin/staff) are deliberately absent — an unused constant
   is just another thing to keep true.
   ------------------------------------------------------------------------ */
export const ADMIN_ROUTES = {
  ROOT: '/admin',
  LOGIN: '/admin/login',

  APPROVAL: '/admin/approval',
  CONTENT: '/admin/content',
  CONTENT_NEW: '/admin/content/new',
  CONTENT_NEW_EDIT: '/admin/content/new/edit',
  CONTENT_EDIT: (id) => `/admin/content/${id}/edit`,
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
};
