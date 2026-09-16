"use client";
// modules/Admin/Roles/UserTable/UserRow/index.jsx

import { S } from '../../styles';
import { ROLES } from '../../constants';
import { lastSeenAgo } from '../../helpers';

export default function UserRow({ u, rc, isSelf, changeRole, setModal }) {
  return (
    <div key={u._id}
      style={{ ...S.trow, background: u.isActive ? "transparent" : "#fdfbf6" }}
      onMouseEnter={e => e.currentTarget.style.background = "#faf6ed"}
      onMouseLeave={e => e.currentTarget.style.background = u.isActive ? "transparent" : "#fdfbf6"}>
      <div style={{ ...S.rowRail, background: u.isActive ? rc.color : "#b8b0a0" }} />

      {/* User info */}
      <div style={{ flex: 2.5, display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
        <div style={{ ...S.avatar, background: rc.color + "1e", color: rc.color, borderColor: rc.color + "3a" }}>
          {u.name?.charAt(0).toUpperCase()}
        </div>
        <div style={{ minWidth: 0 }}>
          <span style={S.userName}>
            {u.name}{isSelf && <span style={S.youTag}>you</span>}
          </span>
          <span style={S.userEmail}>{u.email}</span>
        </div>
      </div>

      {/* Role selector */}
      <div style={{ flex: 1.5 }}>
        <select value={u.role} disabled={isSelf}
          style={{
            ...S.roleSelect,
            borderColor: rc.color + "66",
            borderLeftWidth: 4,
            borderLeftColor: rc.color,
            color: "#2a2118",
            background: isSelf ? "#faf8f2" : "#fff",
            cursor: isSelf ? "not-allowed" : "pointer",
          }}
          onChange={e => changeRole(u._id, e.target.value)}>
          {ROLES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
        </select>
      </div>

      {/* Assigned modules */}
      <div style={{ flex: 1.5, minWidth: 0 }}>
        {u.role === "moduleMaster" ? (
          <button onClick={() => setModal({ type: "modules", user: u })} style={S.modulesBtn}>
            {u.assignedModules?.length > 0
              ? `${u.assignedModules.length} module${u.assignedModules.length > 1 ? "s" : ""}`
              : "Assign modules"}
            <span style={{ fontSize: 10, marginLeft: 5, opacity: .7 }}>✎</span>
          </button>
        ) : (
          <span style={S.dash}>—</span>
        )}
      </div>

      {/* Active status */}
      <div style={{ flex: 1 }}>
        <span style={{
          ...S.statusPill,
          background: u.isActive ? "#6cae6c22" : "#c93a3a18",
          color: u.isActive ? "#2f7030" : "#a82c2c",
        }}>
          <span style={{ ...S.statusDot, background: u.isActive ? "#3a7c3a" : "#9a3030" }} />
          {u.isActive ? "Active" : "Disabled"}
        </span>
      </div>

      <span style={S.metaCell}>{lastSeenAgo(u.lastSeen)}</span>
      <span style={S.metaCell}>{lastSeenAgo(u.createdAt)}</span>

      {/* Actions */}
      <div style={{ flex: 2, display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
        {!isSelf && (
          <>
            <button style={S.actionBtn}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#6aa8cf"; e.currentTarget.style.color = "#1a4a7a"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e6e1d6"; e.currentTarget.style.color = "#6b6456"; }}
              onClick={() => setModal({ type: "password", user: u })}>
              Password
            </button>
            <button style={{
              ...S.actionBtn,
              color: u.isActive ? "#9a5050" : "#3a7c3a",
              borderColor: u.isActive ? "#d4909055" : "#6cae6c55",
            }} onClick={() => setModal({ type: "access", user: u })}>
              {u.isActive ? "Disable" : "Enable"}
            </button>
            <button style={{ ...S.actionBtn, color: "#a83232", borderColor: "#c0000033" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#a832320d"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
              onClick={() => setModal({ type: "delete", user: u })}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
