// lib/api/endpoints.js
// URLs, cache tags and revalidate windows in one place.
//
// These are FUNCTIONS, not a flat enum — an enum cannot express `/products/:id`
// without string concatenation at the call site, which is defect #12.

export const authEndpoints = {
  appLogin: () => '/api/auth/app-login',
  login: () => '/api/auth/login',
  logout: () => '/api/auth/logout',
  me: () => '/api/auth/me',
  register: () => '/api/auth/register',
  sendOtp: () => '/api/auth/send-otp',
  verifyOtp: () => '/api/auth/verify-otp',
  forgotPassword: () => '/api/auth/forgot-password',
  resetPassword: () => '/api/auth/reset-password',
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
 * /api/bff-app so the app token stays in an httpOnly cookie.
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
};

// ── Products ──────────────────────────────────────────────────────────────────
export const productEndpoints = {
  getAll: () => '/api/products',
  getOne: (slug) => `/api/products/${encodeURIComponent(slug)}`,
  getByCategory: (cat) => `/api/products/category/${encodeURIComponent(cat)}`,
  getFeatured: () => '/api/products/featured',
  getBestsellers: () => '/api/products/bestsellers',
  search: () => '/api/products/search',
};

// ── Fameo Products backend (PRODUCTS_ORIGIN) ─────────────────────────────────
// A SEPARATE service from productEndpoints above. Same session (shared
// JWT_SECRET) but a different contract: bare /products and /cart rather than
// /api/products. Kept distinct on purpose — conflating the two would send
// calls to the wrong backend.
export const fameoProductEndpoints = {
  products: () => '/products',
  product: (id) => `/products/${id}`,
  publicProducts: () => '/public/products',
  publicProduct: (id) => `/public/products/${id}`,
  cart: () => '/cart',
  cartItems: () => '/cart/items',
  cartItem: (productId) => `/cart/items/${productId}`,
  orders: () => '/orders',
  order: (id) => `/orders/${id}`,
  checkout: () => '/orders/checkout',
  support: () => '/support',
};

// ── Orders ────────────────────────────────────────────────────────────────────
export const orderEndpoints = {
  createRazorpayOrder: () => '/api/orders/create-razorpay-order',
  verifyPayment: () => '/api/orders/verify-payment',
  placeCOD: () => '/api/orders',
  getAll: () => '/api/orders',
  getOne: (id) => `/api/orders/${encodeURIComponent(id)}`,
  track: (id) => `/api/orders/track/${encodeURIComponent(id)}`,
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
export const resourceEndpoints = {
  courses: () => '/api/resources/courses',
  course: (slug) => `/api/resources/courses/${encodeURIComponent(slug)}`,
  articles: () => '/api/resources/articles',
  article: (slug) => `/api/resources/articles/${encodeURIComponent(slug)}`,
  learnings: () => '/api/resources/learnings',
  enroll: (id) => `/api/resources/learnings/${encodeURIComponent(id)}/enroll`,
  updateProgress: (id) => `/api/resources/learnings/${encodeURIComponent(id)}/progress`,
  saved: () => '/api/resources/saved',
  toggleSaved: (id) => `/api/resources/saved/${encodeURIComponent(id)}`,
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
  
  // Overview
  stats: () => "/admin/stats",
  activity: (limit) => `/admin/activity?limit=${limit}`,
  settings: () => "/admin/settings",
  settingsFeatures: () => "/admin/settings/features",
};
