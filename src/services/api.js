// services/api.js
// Fameo — Central API client
// All admin pages import from here — never raw fetch()

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("fameo_token");
}
export function setTokens(access, refresh) {
  localStorage.setItem("fameo_token", access);
  if (refresh) localStorage.setItem("fameo_refresh", refresh);
}
export function clearTokens() {
  localStorage.removeItem("fameo_token");
  localStorage.removeItem("fameo_refresh");
  sessionStorage.removeItem("fameo_user");
}

async function req(path, opts = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opts.headers,
  };
  const res = await fetch(`${BASE}${path}`, { ...opts, headers });

  // Expired — try one refresh
//   if (res.status === 401) {
//     const rf = localStorage.getItem("fameo_refresh");
//     if (rf) {
//       try {
//         const rr = await fetch(`${BASE}/auth/refresh`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ refreshToken: rf }),
//         });
//         if (rr.ok) {
//           const rd = await rr.json();
//           setTokens(rd.data.accessToken, rd.data.refreshToken);
//           const retry = await fetch(`${BASE}${path}`, {
//             ...opts,
//             headers: { ...headers, Authorization: `Bearer ${rd.data.accessToken}` },
//           });
//           return retry.json();
//         }
//       } catch {}
//     }
//     clearTokens();
//     if (typeof window !== "undefined") window.location.href = "/admin/login";
//     return;
//   }

// api.js — replace the 401 handler
if (res.status === 401) {
  clearTokens();
  if (typeof window !== "undefined" && !window.location.pathname.includes("/admin/login")) {
    window.location.href = "/admin/login";
  }
  return;
}

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  get:    (p)      => req(p),
  post:   (p, b)   => req(p, { method: "POST",   body: JSON.stringify(b) }),
  put:    (p, b)   => req(p, { method: "PUT",    body: JSON.stringify(b) }),
  patch:  (p, b)   => req(p, { method: "PATCH",  body: JSON.stringify(b) }),
  delete: (p)      => req(p, { method: "DELETE" }),
  upload: (p, fd)  => {
    const token = getToken();
    return fetch(`${BASE}${p}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: fd,
    }).then(r => r.json());
  },

  // ── User profile (GET /users/profile) — used by web + mobile.
  //    The profile service returns { success, message, data: {...} },
  //    so we hand back the inner `data` object directly.
  getProfile: async () => {
    const res = await req("/users/profile");
    return res?.data || res;
  },
};