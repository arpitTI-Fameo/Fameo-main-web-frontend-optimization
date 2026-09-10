import Link from "next/link";
import { S } from '../styles';

export default function StatCards({ statCards }) {
  return (
    <div style={S.statsGrid}>
      {statCards.map(c => (
        <Link key={c.label} href={c.href || "#"} style={{ ...S.statCard, borderTop: `3px solid ${c.accent}`, textDecoration: "none" }}>
          <span style={S.statValue}>{c.value ?? "—"}</span>
          <span style={S.statLabel}>{c.label}</span>
          <span style={S.statSub}>{c.sub}</span>
        </Link>
      ))}
    </div>
  );
}
