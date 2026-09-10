// // src/lib/api.js
// const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// async function req(path, options = {}) {
//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("fameo_token") : null;

//   const res = await fetch(`${BASE}${path}`, {
//     credentials: "include",
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...options.headers,
//     },
//   });

//   const data = await res.json();
//   if (!res.ok) throw new Error(data.error || "Request failed");
//   return data;
// }

// export const authApi = {
//   signup: (body) => req("/api/auth/signup", { method: "POST", body: JSON.stringify(body) }),
//   login:  (body) => req("/api/auth/login",  { method: "POST", body: JSON.stringify(body) }),
//   logout: ()     => req("/api/auth/logout",  { method: "POST" }),
//   me:     ()     => req("/api/auth/me"),
//   updateProfile: (formData) =>
//     fetch(`${BASE}/api/auth/update-profile`, {
//       method: "PATCH",
//       credentials: "include",
//       headers: { Authorization: `Bearer ${localStorage.getItem("fameo_token")}` },
//       body: formData,
//     }).then((r) => r.json()),
//   changePassword: (body) =>
//     req("/api/auth/change-password", { method: "PATCH", body: JSON.stringify(body) }),
// };

// export const ordersApi = {
//   getAll:  ()        => req("/api/orders"),
//   getById: (id)      => req(`/api/orders/${id}`),
//   track:   (orderId) => req(`/api/orders/track/${orderId}`),
// };

// export const favoritesApi = {
//   getAll: ()          => req("/api/favorites"),
//   add:    (productId) => req(`/api/favorites/${productId}`, { method: "POST" }),
//   remove: (productId) => req(`/api/favorites/${productId}`, { method: "DELETE" }),
// };

// export const learningsApi = {
//   getAll:         ()                   => req("/api/learnings"),
//   enroll:         (courseId, title)    => req(`/api/learnings/${courseId}/enroll`, { method: "POST", body: JSON.stringify({ title }) }),
//   updateProgress: (courseId, progress) => req(`/api/learnings/${courseId}/progress`, { method: "PATCH", body: JSON.stringify({ progress }) }),
// };

// // default export as object too — both import styles work
// const api = { auth: authApi, orders: ordersApi, favorites: favoritesApi, learnings: learningsApi };
// export default api;


// lib/api.js
// Base API client — all services use this
// Reads token from authStore (Zustand)

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function req(path, options = {}) {
  // Get token from Zustand store (client side only)
  let token = null;
  if (typeof window !== 'undefined') {
    try {
      const raw   = localStorage.getItem('fameo-auth');
      const state = raw ? JSON.parse(raw) : null;
      token       = state?.state?.token || null;
    } catch (_) {}
  }

  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  register:       (body) => req('/api/auth/register',        { method: 'POST', body: JSON.stringify(body) }),
  verifyOtp:      (body) => req('/api/auth/verify-otp',       { method: 'POST', body: JSON.stringify(body) }),
  login:          (body) => req('/api/auth/login',            { method: 'POST', body: JSON.stringify(body) }),
  logout:         ()     => req('/api/auth/logout',           { method: 'POST' }),
  me:             ()     => req('/api/auth/me'),
  sendOtp:        (body) => req('/api/auth/send-otp',         { method: 'POST', body: JSON.stringify(body) }),
  forgotPassword: (body) => req('/api/auth/forgot-password',  { method: 'POST', body: JSON.stringify(body) }),
  resetPassword:  (body) => req('/api/auth/reset-password',   { method: 'POST', body: JSON.stringify(body) }),
};

// ── User ──────────────────────────────────────────────────────────────────────
export const userApi = {
  getProfile:     ()             => req('/api/user/profile'),
  updateProfile:  (body)         => req('/api/user/profile',         { method: 'PATCH', body: JSON.stringify(body) }),
  changePassword: (body)         => req('/api/user/change-password', { method: 'PATCH', body: JSON.stringify(body) }),
  getFavorites:   ()             => req('/api/user/favorites'),
  toggleFavorite: (productId)    => req(`/api/user/favorites/${productId}`, { method: 'POST' }),
  deleteAccount:  ()             => req('/api/user/account',         { method: 'DELETE' }),
  updateAvatar:   (formData)     => {
    let token = null;
    try {
      const raw = localStorage.getItem('fameo-auth');
      token = raw ? JSON.parse(raw)?.state?.token : null;
    } catch (_) {}
    return fetch(`${BASE}/api/user/avatar`, {
      method: 'PATCH',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }).then(r => r.json());
  },
};

// ── Products ──────────────────────────────────────────────────────────────────
export const productApi = {
  getAll:        (params = {}) => req(`/api/products?${new URLSearchParams(params)}`),
  getOne:        (slug)        => req(`/api/products/${slug}`),
  getByCategory: (cat, params) => req(`/api/products/category/${cat}?${new URLSearchParams(params)}`),
  getFeatured:   (limit)       => req(`/api/products/featured${limit ? `?limit=${limit}` : ''}`),
  getBestsellers:(limit)       => req(`/api/products/bestsellers${limit ? `?limit=${limit}` : ''}`),
  search:        (q)           => req(`/api/products/search?q=${encodeURIComponent(q)}`),
};

// ── Orders ────────────────────────────────────────────────────────────────────
export const ordersApi = {
  createRazorpayOrder: (body)    => req('/api/orders/create-razorpay-order', { method: 'POST', body: JSON.stringify(body) }),
  verifyPayment:       (body)    => req('/api/orders/verify-payment',         { method: 'POST', body: JSON.stringify(body) }),
  placeCOD:            (body)    => req('/api/orders',                        { method: 'POST', body: JSON.stringify(body) }),
  getAll:              (params)  => req(`/api/orders?${new URLSearchParams(params)}`),
  getOne:              (id)      => req(`/api/orders/${id}`),
  track:               (id)      => req(`/api/orders/track/${id}`),
};

// ── Resources ─────────────────────────────────────────────────────────────────
export const resourceApi = {
  getCourses:      (params)  => req(`/api/resources/courses?${new URLSearchParams(params)}`),
  getCourse:       (slug)    => req(`/api/resources/courses/${slug}`),
  getArticles:     (params)  => req(`/api/resources/articles?${new URLSearchParams(params)}`),
  getArticle:      (slug)    => req(`/api/resources/articles/${slug}`),
  getLearnings:    ()        => req('/api/resources/learnings'),
  enroll:          (id, title) => req(`/api/resources/learnings/${id}/enroll`, { method: 'POST', body: JSON.stringify({ title }) }),
  updateProgress:  (id, progress) => req(`/api/resources/learnings/${id}/progress`, { method: 'PATCH', body: JSON.stringify({ progress }) }),
  getSaved:        ()        => req('/api/resources/saved'),
  toggleSaved:     (id, type) => req(`/api/resources/saved/${id}`, { method: 'POST', body: JSON.stringify({ resourceType: type }) }),
};

// ── Community ─────────────────────────────────────────────────────────────────
export const communityApi = {
  getFeed:       (params)  => req(`/api/community?${new URLSearchParams(params)}`),
  createPost:    (body)    => req('/api/community',                    { method: 'POST', body: JSON.stringify(body) }),
  toggleLike:    (postId)  => req(`/api/community/${postId}/like`,     { method: 'POST' }),
  deletePost:    (postId)  => req(`/api/community/${postId}`,          { method: 'DELETE' }),
  getComments:   (postId)  => req(`/api/community/${postId}/comments`),
  addComment:    (postId, body) => req(`/api/community/${postId}/comments`, { method: 'POST', body: JSON.stringify(body) }),
  deleteComment: (commentId)   => req(`/api/community/comments/${commentId}`, { method: 'DELETE' }),
  toggleFollow:  (userId)  => req(`/api/community/follow/${userId}`,   { method: 'POST' }),
};

// ── Talent ────────────────────────────────────────────────────────────────────
export const talentApi = {
  getJobs:        (params) => req(`/api/talent?${new URLSearchParams(params)}`),
  getJob:         (id)     => req(`/api/talent/${id}`),
  postJob:        (body)   => req('/api/talent',                      { method: 'POST', body: JSON.stringify(body) }),
  apply:          (id, body) => req(`/api/talent/${id}/apply`,        { method: 'POST', body: JSON.stringify(body) }),
  getApplications:()       => req('/api/talent/me/applications'),
};

// ── Creators ──────────────────────────────────────────────────────────────────
export const creatorApi = {
  getAll:       (params) => req(`/api/creators?${new URLSearchParams(params)}`),
  getOne:       (userId) => req(`/api/creators/${userId}`),
  getMyProfile: ()       => req('/api/creators/me'),
  updateProfile:(body)   => req('/api/creators/me',                   { method: 'PUT', body: JSON.stringify(body) }),
};

// ── Notifications ─────────────────────────────────────────────────────────────
export const notifApi = {
  getAll:    (params) => req(`/api/notifications?${new URLSearchParams(params)}`),
  readAll:   ()       => req('/api/notifications/read-all',            { method: 'PATCH' }),
  readOne:   (id)     => req(`/api/notifications/${id}/read`,          { method: 'PATCH' }),
};

// ── Chat ──────────────────────────────────────────────────────────────────────
export const chatApi = {
  getRooms:    ()            => req('/api/chat/rooms'),
  getMessages: (roomId, p)   => req(`/api/chat/rooms/${roomId}/messages?page=${p || 1}`),
  createRoom:  (recipientId) => req('/api/chat/rooms',                 { method: 'POST', body: JSON.stringify({ recipientId }) }),
  markRead:    (roomId)      => req(`/api/chat/rooms/${roomId}/read`,  { method: 'PATCH' }),
};

export default { authApi, userApi, productApi, ordersApi, resourceApi, communityApi, talentApi, creatorApi, notifApi, chatApi };