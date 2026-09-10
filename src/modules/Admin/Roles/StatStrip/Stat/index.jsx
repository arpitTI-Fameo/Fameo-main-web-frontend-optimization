"use client";
// modules/Admin/Roles/StatStrip/Stat/index.jsx

import { S } from '../../styles';

export default function Stat({ n, label, tone }) {
  return (
    <div style={S.stat}>
      <span style={{ ...S.statNum, color: tone || "#1a1208" }}>{n}</span>
      <span style={S.statLabel}>{label}</span>
    </div>
  );
}
