import Link from "next/link";
import { S } from '../styles';
import { timeAgo } from '../constants';

export default function MySubmissions({ pending, accent }) {
  return (
    <div style={S.card}>
      <div style={S.cardHead}>
        <h2 style={S.cardTitle}>My Submissions</h2>
        <Link href="/admin/content" style={{ ...S.cardLink, color: accent }}>View all →</Link>
      </div>
      {pending.length === 0
        ? <p style={S.empty}>No pending submissions</p>
        : pending.map(item => (
          <div key={item._id} style={S.approvalRow}>
            <span style={{ ...S.typePill, background: "#7eb8d822", color: "#1a4a7a" }}>{item.type}</span>
            <div style={S.approvalInfo}>
              <span style={S.approvalTitle}>{item.title}</span>
              <span style={S.approvalMeta}>Submitted {timeAgo(item.submittedAt)}</span>
            </div>
            <span style={{ fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 3, background: "#7eb8d822", color: "#1a4a7a", fontWeight: 600 }}>
              In Review
            </span>
          </div>
        ))
      }
    </div>
  );
}
