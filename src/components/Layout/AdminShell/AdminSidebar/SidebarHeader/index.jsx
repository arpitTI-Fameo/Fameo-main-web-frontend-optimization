"use client";
// components/Layout/AdminShell/AdminSidebar/SidebarHeader/index.jsx

import Link from "next/link";

import { S } from "../../styles";

export default function SidebarHeader({ collapsed, setCollapsed, rc }) {
  return (
    <div style={S.sbTop}>
      {!collapsed && (
        <Link href="/admin" style={{ ...S.logo, color: "#F0E8D6", textDecoration: "none" }}>
          Fameo <span style={{ color: rc.accent }}>Admin</span>
        </Link>
      )}
      <button onClick={() => setCollapsed(c => !c)} style={{ ...S.colBtn, color: rc.accent }}>
        {collapsed ? "›" : "‹"}
      </button>
    </div>
  );
}
