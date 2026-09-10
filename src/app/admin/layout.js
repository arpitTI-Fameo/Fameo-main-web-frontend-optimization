"use client";
// app/admin/layout.js
// Route-level auth gate only. The shell itself lives in components/Layout/AdminShell.

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/adminAuthStore";

import AdminShell from "@/components/Layout/AdminShell";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAdminAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [pendingCount, setPending] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  // Wait for Zustand to rehydrate from localStorage before doing anything
  useEffect(() => { setHydrated(true); }, []);

  // ── Login page — bypass layout entirely
  if (pathname === "/admin/login") return <>{children}</>;

  // ── Not hydrated yet — show nothing (prevents flash)
  if (!hydrated) return null;

  // ── Auth guard — runs after hydration
  if (!user) {
    if (typeof window !== "undefined") router.replace("/admin/login");
    return null;
  }

  const adminRoles = ["superAdmin", "contentManager", "moduleMaster", "supportAgent"];
  if (!adminRoles.includes(user.role)) {
    if (typeof window !== "undefined") router.replace("/");
    return null;
  }

  return <AdminShell user={user} logout={logout} pathname={pathname} router={router}
    collapsed={collapsed} setCollapsed={setCollapsed} pendingCount={pendingCount} setPending={setPending}>
    {children}
  </AdminShell>;
}
