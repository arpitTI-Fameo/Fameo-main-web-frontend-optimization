"use client";
// components/Layout/AdminShell/AdminSidebar/SidebarFooter/index.jsx

import { S } from "../../styles";

export default function SidebarFooter({ collapsed, user, rc, router, doLogout }) {
  if (collapsed) return null;
  return (
    <div style={S.footer}>
      <div style={{ ...S.avatar, background: rc.accent + "22", color: rc.accent }}>
        {user.name?.charAt(0).toUpperCase() || "A"}
      </div>
      <div style={S.footInfo}>
        <span style={S.footName}>{user.name}</span>
        <span style={S.footRole}>{rc.label}</span>
      </div>
      <button onClick={() => router.push("/")} style={S.footBtn} title="Back to site">↗</button>
      <button onClick={doLogout} style={S.footBtn} title="Logout">⏻</button>
    </div>
  );
}
