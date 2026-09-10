"use client";
// components/Layout/AdminShell/index.jsx
// Authed admin app shell — sidebar + main. Rendered by app/admin/layout.js
// once its auth guard passes, so hooks here only run for a valid admin.

import { useEffect } from "react";
import { api } from "@/services/api";
import { useSocket } from "@/hooks/useSocket";

import AdminSidebar from "./AdminSidebar";
import { NAV, ROLE_COLORS } from "./constants";
import { S } from "./styles";

export default function AdminShell({
  user, logout, pathname, router, collapsed, setCollapsed, pendingCount, setPending, children,
}) {

  // Only superAdmin and contentManager can access approvals
  const canFetchPending = ["superAdmin", "contentManager"].includes(user.role);

  const fetchPending = async () => {
    if (!canFetchPending) return;  // ← fix: skip for supportAgent + moduleMaster
    try {
      const d = await api.get("/admin/approvals?status=pending&limit=1");
      setPending(d?.data?.total ?? d?.data?.approvals?.length ?? 0);
    } catch { }
  };

  useEffect(() => {
    fetchPending();
    const t = setInterval(fetchPending, 30000);
    return () => clearInterval(t);
  }, []);

  useSocket({
    "admin:approval_reviewed": fetchPending,
    "topic:published": canFetchPending ? fetchPending : () => { },
  });

  const doLogout = async () => { await logout(); router.replace("/admin/login"); };

  const rc = ROLE_COLORS[user.role] || ROLE_COLORS.contentManager;
  const navItems = NAV[user.role] || [];
  const sections = {};
  navItems.forEach(item => {
    if (!sections[item.section]) sections[item.section] = [];
    sections[item.section].push(item);
  });

  return (
    <div style={S.root}>
      <AdminSidebar
        user={user}
        rc={rc}
        sections={sections}
        pathname={pathname}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        pendingCount={pendingCount}
        router={router}
        doLogout={doLogout}
      />

      <main style={S.main}>{children}</main>
    </div>
  );
}
