import { clientFetch } from '@/lib/api/client/fetcher';

const ADMIN_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

export const adminFetch = async (path, opts = {}) => {
  const token = getToken();
  const url = `${ADMIN_BASE}${path}`;
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opts.headers,
  };
  
  try {
    const data = await clientFetch(url, { ...opts, headers });
    return { data };
  } catch (error) {
    if (error.status === 401) {
      clearTokens();
      if (typeof window !== "undefined" && !window.location.pathname.includes("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    throw error;
  }
};
