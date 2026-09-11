'use client';

import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
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

export const useAdminQuery = (path, opts = {}) => {
  return useQuery({
    queryKey: ['admin', path],
    queryFn: () => adminFetch(path),
    ...opts,
  });
};

export const useAdminMutation = (opts = {}) => {
  return useApiMutation({
    mutationFn: ({ path, method = 'POST', body, isFormData = false }) => {
      const fetchOpts = { method };
      if (body && !isFormData) {
        fetchOpts.body = JSON.stringify(body);
        fetchOpts.headers = { "Content-Type": "application/json" };
      } else if (isFormData) {
        fetchOpts.body = body;
      }
      return adminFetch(path, fetchOpts);
    },
    ...opts,
  });
};

// --- Specific Hooks ---

export const useAnalyticsOverview = (opts = {}) => useAdminQuery("/admin/analytics/overview", opts);
export const useAnalyticsTopics = (opts = {}) => useAdminQuery("/admin/analytics/topics", opts);

export const useAdminArchive = (opts = {}) => useAdminQuery("/admin/archive", opts);
export const useRestoreArchiveMutation = (opts = {}) => {
    const mutation = useAdminMutation(opts);
    return {
        ...mutation,
        restore: (id) => mutation.mutateAsync({ path: `/admin/archive/${id}/restore`, method: 'PATCH' })
    };
};
export const useDeleteContentMutation = (opts = {}) => {
    const mutation = useAdminMutation(opts);
    return {
        ...mutation,
        remove: (id) => mutation.mutateAsync({ path: `/admin/content/${id}`, method: 'DELETE' })
    };
};

export const useAdminContacts = (search, roleFilter, opts = {}) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (roleFilter !== "all") params.set("role", roleFilter);
    return useAdminQuery(`/admin/contacts?${params.toString()}`, opts);
};

// Drop-in replacement for legacy components not yet converted to hooks
export const api = {
  get:    (p)      => adminFetch(p),
  post:   (p, b)   => adminFetch(p, { method: "POST",   body: JSON.stringify(b), headers: { "Content-Type": "application/json" } }),
  put:    (p, b)   => adminFetch(p, { method: "PUT",    body: JSON.stringify(b), headers: { "Content-Type": "application/json" } }),
  patch:  (p, b)   => adminFetch(p, { method: "PATCH",  body: JSON.stringify(b), headers: { "Content-Type": "application/json" } }),
  delete: (p)      => adminFetch(p, { method: "DELETE" }),
  upload: (p, fd)  => adminFetch(p, { method: "POST", body: fd }),
  getProfile: async () => {
    const res = await adminFetch("/users/profile");
    return res?.data || res;
  },
};
