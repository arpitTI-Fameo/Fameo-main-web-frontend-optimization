"use client";
// modules/Admin/Approval/ApprovalTabs/index.jsx

import { S } from "../styles";
import { STATUS_TABS } from "../constants";

export default function ApprovalTabs({ tab, setTab, accent }) {
  return (
    <div style={S.tabRow}>
      {STATUS_TABS.map(t => (
        <button key={t} onClick={() => setTab(t)} style={{
          ...S.tabBtn,
          borderBottom: tab === t ? `2px solid ${accent}` : "2px solid transparent",
          color: tab === t ? "#1a1208" : "#aaa",
          fontWeight: tab === t ? 500 : 400,
        }}>
          {t.charAt(0).toUpperCase() + t.slice(1).replace(/([A-Z])/g, " $1")}
        </button>
      ))}
    </div>
  );
}
