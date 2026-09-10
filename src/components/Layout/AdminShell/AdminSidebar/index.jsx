"use client";
// components/Layout/AdminShell/AdminSidebar/index.jsx

import SidebarHeader from "./SidebarHeader";
import RoleBadge from "./RoleBadge";
import AdminNav from "./AdminNav";
import SidebarFooter from "./SidebarFooter";
import { S } from "../styles";

export default function AdminSidebar({
  user, rc, sections, pathname, collapsed, setCollapsed, pendingCount, router, doLogout,
}) {
  return (
    <aside style={{ ...S.sidebar, width: collapsed ? 64 : 240, background: rc.bg }}>
      <SidebarHeader collapsed={collapsed} setCollapsed={setCollapsed} rc={rc} />

      <RoleBadge collapsed={collapsed} rc={rc} />

      <AdminNav
        sections={sections}
        pathname={pathname}
        collapsed={collapsed}
        rc={rc}
        pendingCount={pendingCount}
      />

      <SidebarFooter
        collapsed={collapsed}
        user={user}
        rc={rc}
        router={router}
        doLogout={doLogout}
      />
    </aside>
  );
}
