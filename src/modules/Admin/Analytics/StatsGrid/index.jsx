"use client";
// modules/Admin/Analytics/StatsGrid/index.jsx

import StatCard from "./StatCard";
import { S } from "../styles";

export default function StatsGrid({ stats }) {
  return (
    <div style={S.statsGrid}>
      {stats.map(s => (
        <StatCard key={s.label} stat={s} />
      ))}
    </div>
  );
}
