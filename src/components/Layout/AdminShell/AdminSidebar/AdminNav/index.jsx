"use client";
// components/Layout/AdminShell/AdminSidebar/AdminNav/index.jsx

import NavItem from "./NavItem";
import { S } from "../../styles";
import { SECTION_LABELS } from "../../constants";
import { ADMIN_ROUTES } from "@/constants/routes";

export default function AdminNav({ sections, pathname, collapsed, rc, pendingCount }) {
  return (
    <nav style={S.nav}>
      {Object.entries(sections).map(([sec, items]) => (
        <div key={sec} style={S.navSec}>
          {!collapsed && <span style={S.secLabel}>{SECTION_LABELS[sec]}</span>}
          {items.map(item => {
            const active = pathname === item.href ||
              (item.href !== ADMIN_ROUTES.ROOT && pathname.startsWith(item.href));
            return (
              <NavItem
                key={item.href}
                item={item}
                active={active}
                collapsed={collapsed}
                rc={rc}
                pendingCount={pendingCount}
              />
            );
          })}
        </div>
      ))}
    </nav>
  );
}
