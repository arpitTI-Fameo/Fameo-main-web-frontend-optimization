"use client";
// components/Layout/AdminShell/AdminSidebar/RoleBadge/index.jsx

import { S } from "../../styles";

export default function RoleBadge({ collapsed, rc }) {
  if (collapsed) return null;
  return (
    <div style={{ ...S.roleBadge, background: rc.accent + "18", border: `1px solid ${rc.accent}33` }}>
      <span style={{ ...S.roleDot, background: rc.accent }} />
      <span style={{ ...S.roleLabel, color: rc.accent }}>{rc.label}</span>
    </div>
  );
}
