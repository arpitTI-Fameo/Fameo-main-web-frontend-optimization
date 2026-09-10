// export const PRODUCTS_SUBNAV_ROUTES = ['/products'];



// constants/routes.js
export const ROUTES = {
  // Auth
  LOGIN:          '/login',
  REGISTER:       '/register',
  OTP:            '/otp',

  // Main
  HOME:           '/',
  PRODUCTS:       '/products',
  RESOURCES:      '/resources',
  COMMUNITY:      '/community',
  TALENT_HIRE:    '/talent-hire',
  PLANS:          '/plans',

  // Products
  PRODUCT:        (slug) => `/products/${slug}`,
  CATEGORY:       (cat)  => `/products/${cat}`,

  // Resources
  COURSES:        '/resources/courses',
  COURSE:         (slug) => `/resources/courses/${slug}`,
  ARTICLES:       '/resources/articles',
  ARTICLE:        (slug) => `/resources/articles/${slug}`,
  MY_LEARNINGS:   '/resources/my-learnings',
  SAVED:          '/resources/saved',

  // Cart & Checkout
  CART:           '/cart',
  CHECKOUT:       '/checkout',

  // Account
  ACCOUNT:        '/account',
  ORDERS:         '/account/orders',
  ORDER:          (id)   => `/account/orders/${id}`,
  TRACK_ORDER:    '/account/track-order',
  FAVORITES:      '/account/favorites',
  PROFILE:        '/account/profile',
  SETTINGS:       '/account/settings',
};

// Routes that require auth — used in middleware.js
export const PROTECTED_ROUTES = [
  '/account',
  '/account/orders',
  '/account/favorites',
  '/account/profile',
  '/account/settings',
  '/checkout',
  '/resources/my-learnings',
  '/resources/saved',
];

// Routes that show ProductsSubNav (bag button visible)
export const PRODUCTS_SUBNAV_ROUTES = ['/products'];