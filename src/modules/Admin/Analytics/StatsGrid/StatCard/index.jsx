"use client";
// modules/Admin/Analytics/StatsGrid/StatCard/index.jsx

import { S } from "../../styles";

export default function StatCard({ stat }) {
  return (
    <div style={{ ...S.statCard, borderTop: `3px solid ${stat.accent}` }}>
      <span style={S.statValue}>{stat.value}</span>
      <span style={S.statLabel}>{stat.label}</span>
    </div>
  );
}
