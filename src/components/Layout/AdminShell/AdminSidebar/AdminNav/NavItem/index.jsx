"use client";
// components/Layout/AdminShell/AdminSidebar/AdminNav/NavItem/index.jsx

import Link from "next/link";

import { S } from "../../../styles";

export default function NavItem({ item, active, collapsed, rc, pendingCount }) {
  return (
    <Link href={item.href} style={{
      ...S.navItem,
      background: active ? rc.accent + "18" : "transparent",
      borderLeft: active ? `3px solid ${rc.accent}` : "3px solid transparent",
      color: active ? "#F0E8D6" : "rgba(240,232,214,0.42)",
      justifyContent: collapsed ? "center" : "flex-start",
    }}>
      <span style={{ ...S.navIcon, color: active ? rc.accent : "inherit" }}>{item.icon}</span>
      {!collapsed && (
        <>
          <span style={S.navLabel}>{item.label}</span>
          {item.badge && pendingCount > 0 && (
            <span style={{ ...S.badge, background: rc.accent, color: rc.bg }}>{pendingCount}</span>
          )}
        </>
      )}
    </Link>
  );
}
