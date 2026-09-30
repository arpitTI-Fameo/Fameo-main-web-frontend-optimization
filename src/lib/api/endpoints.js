// lib/api/endpoints.js
// URLs, cache tags and revalidate windows in one place.
//
// These are FUNCTIONS, not a flat enum — an enum cannot express `/products/:id`
// without string concatenation at the call site, which is defect #12.

/**
 * Main API (API_ORIGIN) — the signed-in member's WEB profile. The main API no
 * longer signs anyone in; that is Fameoinfo-Backend (identityEndpoints).
 */
export const authEndpoints = {
  me: () => '/api/auth/me',
  entitlements: () => '/api/auth/entitlements',
};

/**
 * Fameoinfo-Backend (APP_ORIGIN) — the ONE authentication authority. Sign-in,
 * token refresh and logout for every Fameo service happen here. Called only
 * from server code (our route handlers, the BFF proxy and middleware).
 */
export const identityEndpoints = {
  login: () => '/api/v1/auth/login',
  refresh: () => '/api/v1/auth/refresh',
  logout: () => '/api/v1/auth/logout',
};

/**
 * OUR OWN Next route handlers, NOT upstream paths.
 *
 * These exist because some auth steps must run server-side: /api/auth/login
 * calls the upstream and converts the response into an httpOnly Set-Cookie, so
 * the token never reaches client JavaScript. Posting to the upstream directly
 * skips that and leaves the browser with no session at all.
 *
 * They are listed apart from `authEndpoints` on purpose. `authEndpoints.login()`
 * is the UPSTREAM path '/api/auth/login' and our route happens to sit at the
 * same string — sending the first through the BFF reaches the wrong server with
 * the wrong body shape, which is exactly the bug this split prevents.
 *
 * Always call these with `base: LOCAL_BASE` so they are not prefixed with /api/bff.
 */
export const localAuthRoutes = {
  login: () => '/api/auth/login',
  logout: () => '/api/auth/logout',
  adminLogin: () => '/api/auth/admin-login',
  adminLogout: () => '/api/auth/admin-logout',
  refreshSession: () => '/api/auth/refresh-session',
};

/**
 * Registration flow — the "app" backend (APP_ORIGIN).
 * Unauthenticated; a signed-in session does not exist yet at these steps.
 */
export const registerEndpoints = {
  sendOtp: () => '/api/v1/auth/send-otp',
  verifyOtp: () => '/api/v1/auth/verify-otp',
  verifyEmailOtp: () => '/api/v1/auth/verify-email-otp',
  checkUsername: () => '/api/v1/auth/check-username',
  liveSelfie: () => '/api/v1/auth/fameoselfie',
  uploadSelfie: () => '/api/v1/auth/upload-selfie',
  uploadDocuments: () => '/api/v1/auth/upload-documents',
  register: () => '/api/v1/auth/register',
  validateReferral: (code) =>
    `/api/v1/referral-program/coupons/${encodeURIComponent(code)}/validate`,
};

/**
 * Signed-in reads against the "app" backend (APP_ORIGIN), reached through
 * /api/bff-app with the session token from the httpOnly cookie.
 */
export const userConfigEndpoints = {
  webProfile: () => '/api/v1/user-config/web-profile',
};

/**
 * Referral programme — also on the "app" backend. These used to be assembled
 * from a NEXT_PUBLIC_ base inside portal.client.js, which put the upstream host
 * in the client bundle and kept one domain's URLs outside this registry.
 */
export const referralEndpoints = {
  validateCoupon: (code) =>
    `/api/v1/referral-program/coupons/${encodeURIComponent(code)}/validate`,
  myCoupons: () => '/api/v1/referral-program/my-coupons',
  shareCoupon: (code) =>
    `/api/v1/referral-program/my-coupons/${encodeURIComponent(code)}/share`,
  myBenefit: () => '/api/v1/referral-program/my-referral-benefit',
};

/**
 * Master / reference data. Public, slow-moving and identical for every visitor
 * — the one part of registration that genuinely belongs in publicFetch with a
 * revalidate window rather than a client fetch on every mount.
 */
export const masterEndpoints = {
  states: () => '/api/v1/locations/master-state',
  cities: () => '/api/v1/locations/master-cities',
  pincode: (pin) => `/api/v1/locations/pincode/${encodeURIComponent(pin)}`,
  categories: () => '/api/v1/masters/categories',
  professions: (categoryCode) =>
    `/api/v1/masters/categories/${encodeURIComponent(categoryCode)}/professions`,
};

// ── User ──────────────────────────────────────────────────────────────────────
export const userEndpoints = {
  profile: () => '/api/user/profile',
  updateProfile: () => '/api/user/profile',
  changePassword: () => '/api/user/change-password',
  favorites: () => '/api/user/favorites',
  toggleFavorite: (productId) => `/api/user/favorites/${encodeURIComponent(productId)}`,
  deleteAccount: () => '/api/user/account',
  avatar: () => '/api/user/avatar',
  addresses: () => '/api/user/addresses',
  address: (addrId) => `/api/user/addresses/${encodeURIComponent(addrId)}`,
  addressDefault: (addrId) => `/api/user/addresses/${encodeURIComponent(addrId)}/default`,
};

// ── Products (catalog, cart, fulfillment orders, support) ─────────────────────
// Reached through the products BFF (BFF_PRODUCTS_BASE), which forwards the
// purchases go through customerOrderEndpoints below.
export const fameoProductEndpoints = {
  products: () => '/api/products',
  product: (id) => `/api/products/${encodeURIComponent(id)}`,
  publicProducts: () => '/api/public/products',
  publicProduct: (id) => `/api/public/products/${encodeURIComponent(id)}`,
  cart: () => '/api/cart',
  cartItems: () => '/api/cart/items',
  cartItem: (productId) => `/api/cart/items/${encodeURIComponent(productId)}`,
  orders: () => '/api/orders',
  order: (id) => `/api/orders/${encodeURIComponent(id)}`,
  support: () => '/api/support',
};

// ── Customer Orders ───────────────────────────────────────────────────────────
// The product purchase path: cart → checkout preview → customer order →
// Razorpay payment → verify. One backend, reached through the products BFF.
export const customerOrderEndpoints = {
  create: () => '/api/customer-orders',
  getAll: () => '/api/customer-orders',
  getOne: (id) => `/api/customer-orders/${encodeURIComponent(id)}`,
  // Buyers cannot set an order's status; staff move fulfillment lines instead
  // (fulfillmentEndpoints.status). Staff read a purchase through `staff`.
  staff: (id) => `/api/customer-orders/${encodeURIComponent(id)}/staff`,
  cancel: (id) => `/api/customer-orders/${encodeURIComponent(id)}/cancel`,
  payment: (id) => `/api/customer-orders/${encodeURIComponent(id)}/payment`,
  paymentRetry: (id) => `/api/customer-orders/${encodeURIComponent(id)}/payment/retry`,
};

// ── Fulfillment lines (staff / retailers) ─────────────────────────────────────
export const fulfillmentEndpoints = {
  getAll: () => '/api/orders',
  getOne: (id) => `/api/orders/${encodeURIComponent(id)}`,
  status: (id) => `/api/orders/${encodeURIComponent(id)}/status`,
  customerInvoiceView: (id) => `/api/orders/${encodeURIComponent(id)}/customer-invoice/view`,
  customerInvoiceDownload: (id) =>
    `/api/orders/${encodeURIComponent(id)}/customer-invoice/download`,
};

export const checkoutEndpoints = {
  preview: () => '/api/checkout/preview',
};

export const paymentEndpoints = {
  verify: () => '/api/payments/verify',
};

// ── Inventory ─────────────────────────────────────────────────────────────────
export const inventoryEndpoints = {
  getAll: () => '/api/inventory',
  create: () => '/api/inventory',
  forProduct: (productId) => `/api/inventory/product/${encodeURIComponent(productId)}`,
  // `id` below is the stock record's id (from getAll / forProduct), not the product's.
  stock: (id) => `/api/inventory/${encodeURIComponent(id)}/stock`,
  cost: (id) => `/api/inventory/${encodeURIComponent(id)}/cost`,
  reviewed: (id) => `/api/inventory/${encodeURIComponent(id)}/reviewed`,
};

// ── Pricing ───────────────────────────────────────────────────────────────────
// Prices change through reprice requests (propose → approve / reject); the
// safety table shows each product's discount headroom. There is no direct
// per-product price write.
export const pricingEndpoints = {
  safety: () => '/api/pricing/safety',
  reprice: () => '/api/pricing/reprice',
  propose: (productId) => `/api/pricing/reprice/${encodeURIComponent(productId)}/propose`,
  approve: (id) => `/api/pricing/reprice/${encodeURIComponent(id)}/approve`,
  reject: (id) => `/api/pricing/reprice/${encodeURIComponent(id)}/reject`,
};

// ── Invoice ───────────────────────────────────────────────────────────────────
export const invoiceEndpoints = {
  getAll: () => '/api/invoices',
  getOne: (id) => `/api/invoices/${encodeURIComponent(id)}`,
  // Retailer invoices are raised over fulfillment lines: body { order_ids, gst_rate? }.
  raise: () => '/api/invoices/raise',
  view: (id) => `/api/invoices/${encodeURIComponent(id)}/view`,
  download: (id) => `/api/invoices/${encodeURIComponent(id)}/download`,
  settle: (id) => `/api/invoices/${encodeURIComponent(id)}/settle`,
  dispute: (id) => `/api/invoices/${encodeURIComponent(id)}/dispute`,
  eway: (id) => `/api/invoices/${encodeURIComponent(id)}/eway`,
  retryEway: (id) => `/api/invoices/${encodeURIComponent(id)}/retry-eway`,
};

// ── Catalog administration (commerce staff: PRODUCTS_* roles) ─────────────────
export const catalogEndpoints = {
  products: () => '/api/products',
  product: (id) => `/api/products/${encodeURIComponent(id)}`,
  productApprove: (id) => `/api/products/${encodeURIComponent(id)}/approve`,
  productReject: (id) => `/api/products/${encodeURIComponent(id)}/reject`,
  productArchive: (id) => `/api/products/${encodeURIComponent(id)}/archive`,
  productMargin: (id) => `/api/products/${encodeURIComponent(id)}/margin`,
  productImages: (id) => `/api/products/${encodeURIComponent(id)}/images`,
  productImage: (id, imageId) =>
    `/api/products/${encodeURIComponent(id)}/images/${encodeURIComponent(imageId)}`,
  productImageMain: (id, imageId) =>
    `/api/products/${encodeURIComponent(id)}/images/${encodeURIComponent(imageId)}/main`,
  categories: () => '/api/categories',
  category: (id) => `/api/categories/${encodeURIComponent(id)}`,
  categoriesSchema: () => '/api/categories/schema',
  categoriesUsed: () => '/api/categories/used',
  categoryUsage: (id) => `/api/categories/${encodeURIComponent(id)}/usage`,
  categoryFieldDeactivate: (id, key) =>
    `/api/categories/${encodeURIComponent(id)}/fields/${encodeURIComponent(key)}/deactivate`,
  vendors: () => '/api/vendors',
  vendor: (id) => `/api/vendors/${encodeURIComponent(id)}`,
  vendorsExpiring: () => '/api/vendors/expiring',
  staffUsers: () => '/api/users',
  staffUser: (id) => `/api/users/${encodeURIComponent(id)}`,
};

// ── Imports (retailer stock sheets, catalog sheets) ──────────────────────────
export const importEndpoints = {
  jobs: () => '/api/imports',
  job: (id) => `/api/imports/${encodeURIComponent(id)}`,
  template: () => '/api/imports/template',
  commit: (id) => `/api/imports/${encodeURIComponent(id)}/commit`,
  cancel: (id) => `/api/imports/${encodeURIComponent(id)}/cancel`,
  catalog: () => '/api/products/import',
  catalogJob: (jobId) => `/api/products/import/${encodeURIComponent(jobId)}`,
};

// ── Commerce support tickets (buyers, retailers, staff) ──────────────────────
export const commerceSupportEndpoints = {
  tickets: () => '/api/support',
  ticket: (id) => `/api/support/${encodeURIComponent(id)}`,
  stats: () => '/api/support/stats',
};

// ── Community ─────────────────────────────────────────────────────────────────
export const communityEndpoints = {
  // Spaces
  hero: () => '/community/hero',
  spaces: () => '/community/spaces',
  joinSpace: (id) => `/community/spaces/${id}/join`,
  leaveSpace: (id) => `/community/spaces/${id}/leave`,
  spaceFeed: (id) => `/community/spaces/${id}/posts`,
  spaceMods: (id) => `/community/spaces/${id}/moderators`,
  topContributors: (id) => `/community/spaces/${id}/top-contributors`,
  // Feed
  feed: () => '/community/feed',
  // Posts
  posts: () => '/community/posts',
  post: (id) => `/community/posts/${id}`,
  postLike: (id) => `/community/posts/${id}/like`,
  postSave: (id) => `/community/posts/${id}/save`,
  // Comments
  postComments: (pid) => `/community/posts/${pid}/comments`,
  comment: (id) => `/community/comments/${id}`,
  commentLike: (id) => `/community/comments/${id}/like`,
  // Reports
  reports: () => '/community/reports',
  reportAction: (id) => `/community/reports/${id}/action`,
  // Feedback
  submissions: () => '/community/feedback/submissions',
  submission: (id) => `/community/feedback/submissions/${id}`,
  submissionReviews: (id) => `/community/feedback/submissions/${id}/reviews`,
  submissionBrand: (id) => `/community/feedback/submissions/${id}/brand-readiness`,
  mentorsOnline: () => '/community/feedback/mentors/online',
  // Users
  userFollow: (uid) => `/community/users/${uid}/follow`,
  userBlock: (uid) => `/community/users/${uid}/block`,
  userStats: (uid) => `/community/users/${uid}/stats`,
  userPosts: (uid) => `/community/users/${uid}/posts`,
  // Search / Recognition
  search: () => '/community/search',
  topCreators: () => '/community/recognition/top',
  // Notifications
  notifications: () => '/community/notifications',
  readAllNotifs: () => '/community/notifications/read-all',
};

// ── Events ────────────────────────────────────────────────────────────────────
export const eventEndpoints = {
  getAll: () => '/events',
  live: () => '/events/live',
  getOne: (id) => `/events/${id}`,
  roomToken: (id) => `/events/${id}/room`,
  qa: (id) => `/events/${id}/qa`,
  replay: (id) => `/events/${id}/replay`,
  discussion: (id) => `/events/${id}/discussion`,
  rsvp: (id) => `/events/${id}/rsvp`,
  start: (id) => `/events/${id}/start`,
  end: (id) => `/events/${id}/end`,
};

// ── Chat ──────────────────────────────────────────────────────────────────────
// ── AI Support Assistant ──────────────────────────────────────────────────────
// A DIFFERENT upstream from chatEndpoints below. That one is the community
// chat (rooms, DMs, uploads, read receipts) on the main API; this is the RAG
// support bot on its own service. Same word, unrelated backends — keeping them
// as separate objects is what stops a path from being sent to the wrong one.
export const assistantEndpoints = {
  chat: () => '/api/v1/chat',
  health: () => '/api/v1/health',
};

export const chatEndpoints = {
  rooms: () => '/chat/rooms',
  dmRoom: (uid) => `/chat/rooms/dm/${uid}`,
  groupRoom: () => '/chat/rooms/group',
  messages: (rid) => `/chat/rooms/${rid}/messages`,
  readRoom: (rid) => `/chat/rooms/${rid}/read`,
};

// ── Podcast ───────────────────────────────────────────────────────────────────
export const podcastEndpoints = {
  shows: () => '/podcast',
  show: (id) => `/podcast/${id}`,
  showSubscribe: (id) => `/podcast/${id}/subscribe`,
  episodes: (sid) => `/podcast/shows/${sid}/episodes`,
  episode: (id) => `/podcast/episodes/${id}`,
  episodeLike: (id) => `/podcast/episodes/${id}/like`,
  episodeSave: (id) => `/podcast/episodes/${id}/save`,
  episodeComments: (id) => `/podcast/episodes/${id}/comments`,
  episodeTranscription: (id) => `/podcast/episodes/${id}/transcription`,
  mySubscriptions: () => '/podcast/me/subscriptions',
  mySaved: () => '/podcast/me/saved',
};

// ── Resources ─────────────────────────────────────────────────────────────────
// Articles and saved resources have no backend; the learner's courses are
// `myCourses`, and enrolment / progress / reviews / notes are keyed by slug.
export const resourceEndpoints = {
  courses: () => '/api/resources/courses',
  course: (slug) => `/api/resources/courses/${encodeURIComponent(slug)}`,
  myCourses: () => '/api/resources/my-courses',
  enroll: (slug) => `/api/resources/courses/${encodeURIComponent(slug)}/enroll`,
  updateProgress: (slug) => `/api/resources/courses/${encodeURIComponent(slug)}/progress`,
  review: (slug) => `/api/resources/courses/${encodeURIComponent(slug)}/review`,
  notes: (slug) => `/api/resources/courses/${encodeURIComponent(slug)}/notes`,
  note: (noteId) => `/api/resources/notes/${encodeURIComponent(noteId)}`,
};

// ── Learner Hub topics + the published course catalogue (public) ────────────
export const topicEndpoints = {
  list: () => '/api/topics',
  bySlug: (slug) => `/api/topics/${encodeURIComponent(slug)}`,
  byModule: (moduleId) => `/api/topics/module/${encodeURIComponent(moduleId)}`,
};

export const publishedCourseEndpoints = {
  list: () => '/api/courses',
  bySlug: (slug) => `/api/courses/${encodeURIComponent(slug)}`,
};

// ── Talent ────────────────────────────────────────────────────────────────────
export const talentEndpoints = {
  jobs: () => '/api/talent',
  job: (id) => `/api/talent/${encodeURIComponent(id)}`,
  apply: (id) => `/api/talent/${encodeURIComponent(id)}/apply`,
  myApplications: () => '/api/talent/me/applications',
};

// ── Creators ──────────────────────────────────────────────────────────────────
export const creatorEndpoints = {
  getAll: () => '/api/creators',
  getOne: (userId) => `/api/creators/${encodeURIComponent(userId)}`,
  myProfile: () => '/api/creators/me',
};

// ── Notifications ─────────────────────────────────────────────────────────────
export const notificationEndpoints = {
  getAll: () => '/api/notifications',
  readAll: () => '/api/notifications/read-all',
  readOne: (id) => `/api/notifications/${encodeURIComponent(id)}/read`,
};

// ── Subscriptions ─────────────────────────────────────────────────────────────
export const subscriptionEndpoints = {
  config: () => '/api/subscriptions/config',
  plans: () => '/api/subscriptions/plans',
  current: () => '/api/subscriptions/current',
  membership: () => '/api/subscriptions/membership',
  upgradePreview: () => '/api/subscriptions/upgrade-preview',
  history: () => '/api/subscriptions/history',
  transactions: () => '/api/subscriptions/transactions',
  createOrder: () => '/api/subscriptions/create-order',
  marketingCouponQuote: () => '/api/subscriptions/marketing-coupon/quote',
  razorpayOrder: () => '/api/subscriptions/razorpay/order',
  razorpayVerify: () => '/api/subscriptions/razorpay/verify',
  subscribe: () => '/api/subscriptions/subscribe',
  upgrade: () => '/api/subscriptions/upgrade',
  cancel: () => '/api/subscriptions/cancel',
  resume: () => '/api/subscriptions/resume',
  autoRenew: () => '/api/subscriptions/auto-renew',
};

/**
 * Cache tags for revalidateTag(). Auth data is per-user and never cached, so
 * auth has no tags. Master data does.
 */
export const tags = {
  masterStates: () => 'master:states',
  masterCities: (stateId) => `master:cities:${stateId}`,
  masterCategories: () => 'master:categories',
  masterProfessions: (code) => `master:professions:${code}`,
};

/** Revalidate windows (seconds) for publicFetch. */
export const revalidate = {
  // Reference data changes rarely; an hour is generous and still bounded.
  master: 3600,
};


// ── Admin ──────────────────────────────────────────────────────────────────────
export const adminEndpoints = {
  // Approvals
  approvalsList: (status) => `/admin/approvals?status=${status}`,
  approval: (id) => `/admin/approvals/${id}`,

  // Archive
  archiveList: () => "/admin/archive",
  archiveRestore: (id) => `/admin/archive/${id}/restore`,

  // Content
  contentList: (params) => `/admin/content?${params}`,
  contentStatus: (id) => `/admin/content/${id}/status`,
  content: (id) => `/admin/content/${id}`,
  contentCreate: () => `/admin/content`,
  contentRollback: (id) => `/admin/content/${id}/rollback`,

  // Media
  mediaList: () => "/admin/media",
  mediaListPagination: (limit) => `/media?limit=${limit}`,
  mediaUpload: () => "/media/upload",
  media: (id) => `/media/${id}`,

  // Analytics
  analyticsOverview: () => "/admin/analytics/overview",
  analyticsTopics: () => "/admin/analytics/topics",

  // Courses
  coursesList: () => "/courses/admin/list",
  course: (id) => `/courses/admin/${id}`,
  coursesCreate: () => "/courses/admin",
  courseTogglePublish: (id) => `/courses/admin/${id}/toggle-publish`,
  courseFeature: (id) => `/courses/admin/${id}/feature`,
  coursesReorder: () => "/courses/admin/reorder",

  // Resource catalogue (static courses + DB overrides)
  resourceStats: () => "/resources/admin/stats",
  resourceCourses: () => "/resources/admin/courses",
  resourceTogglePublish: (slug) => `/resources/admin/courses/${slug}/toggle-publish`,
  resourceLessonUpload: (id, chapterId) =>
    `/resources/admin/courses/${id}/chapters/${chapterId}/lessons/upload`,

  // Learners
  learners: () => "/admin/learners",
  learner: (id) => `/admin/learners/${id}`,
  contacts: () => "/admin/contacts",

  // Notifications
  notificationsAdmin: () => "/admin/notifications",
  notifications: () => "/notifications",

  // Roles
  rolesUsers: () => "/admin/roles/users",
  role: (id) => `/admin/roles/${id}`,
  roleAccess: (id) => `/admin/roles/${id}/access`,
  rolePassword: (id) => `/admin/roles/${id}/password`,
  roleCreateUser: () => "/admin/roles/create-user",

  // Products
  productsList: () => "/admin/products",
  product: (id) => `/admin/products/${id}`,
  productStatus: (id) => `/admin/products/${id}/status`,

  // Module Masters
  moduleMastersList: () => "/admin/module-masters",
  moduleMasterModules: (id) => `/admin/module-masters/${id}/modules`,
  moduleMaster: (id) => `/admin/module-masters/${id}`,

  // Revenue
  revenue: () => "/admin/revenue",

  // Support
  supportTickets: (status) => `/admin/support/tickets?status=${status}`,
  supportFaqs: () => "/admin/support/faqs",
  supportTicketReply: (id) => `/admin/support/tickets/${id}/reply`,
  supportTicket: (id) => `/admin/support/tickets/${id}`,
  supportTicketCreate: () => "/admin/support/tickets",
  supportFaq: (id) => `/admin/support/faqs/${id}`,

  // Overview
  stats: () => "/admin/stats",
  activity: (limit) => `/admin/activity?limit=${limit}`,
  settings: () => "/admin/settings",
  settingsFeatures: () => "/admin/settings/features",
  settingsIntegrations: () => "/admin/settings/integrations",
};
