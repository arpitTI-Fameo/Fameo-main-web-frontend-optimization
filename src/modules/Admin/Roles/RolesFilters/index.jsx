"use client";
// modules/Admin/Roles/RolesFilters/index.jsx

import { S } from '../styles';
import { ROLES, ROLE_MAP } from '../constants';

export default function RolesFilters({ users, search, setSearch, roleFilter, setRoleFilter }) {
  return (
    <div style={S.filters}>
      <div style={S.searchWrap}>
        <span style={S.searchIcon}>⌕</span>
        <input style={S.search} placeholder="Search by name or email"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div style={S.roleTabs}>
        {["all", ...ROLES.map(r => r.key)].map(r => {
          const rc = ROLE_MAP[r];
          const count = r === "all" ? users.length : users.filter(u => u.role === r).length;
          const on = roleFilter === r;
          const c = rc?.color || "#1a1208";
        return (
            <button key={r} onClick={() => setRoleFilter(r)} style={{
              ...S.roleTab,
              background: on ? c : "transparent",
              color: on ? "#fff" : "#4a4338",
              borderColor: on ? c : "#e6e1d6",
            }}>
              {rc?.label || "All"}<span style={{ opacity: .65, marginLeft: 5 }}>{count}</span>
            </button>
        );
      })}
    </div>
  </div>
  );
}
