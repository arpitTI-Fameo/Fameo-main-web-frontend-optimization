import Link from "next/link";
import { S } from '../styles';
import { timeAgo } from '@/utils/relativeTime';
import { ADMIN_ROUTES } from "@/constants/routes";

export default function PendingApprovals({ pending, accent, approveItem, rejectItem }) {
  return (
    <div style={S.card}>
      <div style={S.cardHead}>
        <h2 style={S.cardTitle}>Pending Approvals</h2>
        <Link href={ADMIN_ROUTES.APPROVAL} style={{ ...S.cardLink, color: accent }}>View all →</Link>
      </div>
      {pending.length === 0
        ? <p style={S.empty}>All caught up ✓</p>
        : pending.map(item => (
          <div key={item._id} style={S.approvalRow}>
            <span style={{ ...S.typePill, background: item.type === "topic" ? "#7ec87e22" : "#C9A96E22", color: item.type === "topic" ? "#3a7c3a" : "#7a5a1a" }}>{item.type}</span>
            <div style={S.approvalInfo}>
              <span style={S.approvalTitle}>{item.title}</span>
              <span style={S.approvalMeta}>by {item.submittedByName} · {timeAgo(item.submittedAt)}</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => approveItem(item._id)} style={{ ...S.approveBtn, background: accent + "22", color: accent, border: `1px solid ${accent}44` }}>✓</button>
              <button onClick={() => rejectItem(item._id)} style={{ ...S.approveBtn, background: "#d4909022", color: "#d49090", border: "1px solid #d4909044" }}>✕</button>
            </div>
          </div>
        ))
      }
    </div>
  );
}
