"use client";
// components/Layout/AdminShell/index.jsx
// Authed admin app shell — sidebar + main. Rendered by app/admin/layout.js
// once its auth guard passes, so hooks here only run for a valid admin.

import { useEffect } from "react";
import { getAdminApprovalsAction } from '@/lib/services/admin/approvals.service';
import { useSocket } from "@/lib/hooks/custome/useSocket";

import AdminSidebar from "./AdminSidebar";
import { NAV, ROLE_COLORS } from "./constants";
import { S } from "./styles";
import { ADMIN_ROUTES } from "@/constants/routes";
import { CONTENT_APPROVER_ROLES } from "@/constants/roles";

export default function AdminShell({
  user, logout, pathname, router, collapsed, setCollapsed, pendingCount, setPending, children,
}) {

  // Only superAdmin and contentManager can access approvals
  const canFetchPending = CONTENT_APPROVER_ROLES.includes(user.role);

  const fetchPending = async () => {
    if (!canFetchPending) return;  // ← fix: skip for supportAgent + moduleMaster
    try {
      const d = await getAdminApprovalsAction("pending&limit=1");
      setPending(d?.data?.total ?? d?.data?.approvals?.length ?? 0);
    } catch (err) {
      // Deliberately not surfaced: this runs every 30s and a toast storm would
      // be worse than a stale badge. Logged so a persistent failure is still
      // findable instead of invisible.
      console.warn("[AdminShell] pending-approvals poll failed:", err?.message);
    }
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

  const doLogout = async () => { await logout(); router.replace(ADMIN_ROUTES.LOGIN); };

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
