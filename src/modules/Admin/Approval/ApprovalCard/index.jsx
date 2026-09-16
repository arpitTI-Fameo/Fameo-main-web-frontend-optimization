"use client";
// modules/Admin/Approval/ApprovalCard/index.jsx

import { S } from "../styles";
import { TYPE_COLOR } from "../constants";
import { timeAgo } from '@/utils/relativeTime';

export default function ApprovalCard({ item, tab, accent, review }) {
  const [bg, color] = TYPE_COLOR[item.type] || ["#eee", "#555"];
  return (
    <div style={S.card}>
      <div style={S.cardLeft}>
        <span style={{ ...S.typePill, background: bg, color }}>{item.type}</span>
        <div>
          <p style={S.cardTitle}>{item.title}</p>
          <p style={S.cardMeta}>
            Submitted by <strong>{item.submittedByName}</strong> · {timeAgo(item.submittedAt)}
          </p>
          {item.notes && <p style={S.cardNotes}>Notes: {item.notes}</p>}
        </div>
      </div>

      {tab === "pending" && (
        <div style={S.cardActions}>
          <button style={S.btnApprove} onClick={() => review(item._id, "approved")}>✓ Approve</button>
          <button style={S.btnChanges} onClick={() => {
            const n = prompt("What changes are needed?");
            if (n) review(item._id, "changesRequested", n);
          }}>Request Changes</button>
          <button style={S.btnReject} onClick={() => review(item._id, "rejected")}>✕ Reject</button>
        </div>
      )}
      {tab !== "pending" && (
        <span style={{
          ...S.statusBadge,
          color: tab === "approved" ? "#3a7c3a" : tab === "rejected" ? "#c44" : accent,
        }}>
          {tab}
        </span>
      )}
    </div>
  );
}
