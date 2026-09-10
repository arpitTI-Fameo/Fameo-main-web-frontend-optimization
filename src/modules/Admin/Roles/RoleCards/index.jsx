"use client";
// modules/Admin/Roles/RoleCards/index.jsx

import { S } from '../styles';
import { ROLES } from '../constants';

export default function RoleCards({ users }) {
  return (
      <>
      <div style={S.sectionLabel}>Role reference</div>
      <div style={S.roleCards}>
        {ROLES.map(r => {
          const count = users.filter(u => u.role === r.key).length;
        return (
            <div key={r.key} style={S.roleCard}>
              <div style={{ ...S.roleRail, background: r.color }} />
              <div style={S.roleCardInner}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                  <span style={{ ...S.roleChip, color: r.color }}>{r.label}</span>
                  <span style={{ ...S.countBadge, background: r.color + "16", color: r.color }}>
                    {count}
                  </span>
                </div>
                <p style={S.roleDesc}>{r.desc}</p>
                <div style={S.permWrap}>
                  {r.permissions.map(p => (
                    <span key={p} style={{ ...S.permPill, color: r.color, borderColor: r.color + "33" }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>
        );
      })}
    </div>
    </>
  );
}
