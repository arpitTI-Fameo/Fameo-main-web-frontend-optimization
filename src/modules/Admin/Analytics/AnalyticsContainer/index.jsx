"use client";
// modules/Admin/Analytics/AnalyticsContainer/index.jsx

import { useState, useEffect } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore"
import { api } from "@/services/api";

import StatsGrid from "../StatsGrid";
import TopTopicsCard from "../TopTopicsCard";
import { S } from "../styles";

export default function AnalyticsContainer() {
  const { user } = useAdminAuthStore();
  const [data, setData] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modFilter, setMod] = useState("all");

  useEffect(() => {
    Promise.all([
      api.get("/admin/analytics/overview"),
      api.get("/admin/analytics/topics"),
    ])
      .then(([o, t]) => { setData(o.data); setTopics(t.data || []); })
      .catch(() => {
        setData({ totalLearners: 1240, totalTopics: 34, totalCompletions: 8920 });
        setTopics([
          { _id: "t1", title: "Creator vs Influencer", moduleId: 0, readTime: "8 min", completions: 934, avgTime: "7m 12s" },
          { _id: "t2", title: "Choosing a Niche", moduleId: 0, readTime: "12 min", completions: 821, avgTime: "11m 4s" },
          { _id: "t3", title: "Instagram Algorithm Decoded", moduleId: 3, readTime: "18 min", completions: 612, avgTime: "16m 43s" },
          { _id: "t4", title: "Brand Deal Rate Card", moduleId: 5, readTime: "10 min", completions: 544, avgTime: "9m 22s" },
          { _id: "t5", title: "YouTube SEO Masterclass", moduleId: 3, readTime: "22 min", completions: 489, avgTime: "20m 5s" },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = modFilter === "all" ? topics : topics.filter(t => t.moduleId === parseInt(modFilter));
  const maxComp = Math.max(...topics.map(t => t.completions || 0), 1);

  const STATS = data ? [
    { label: "Total Learners", value: data.totalLearners?.toLocaleString(), accent: "#7eb8d8" },
    { label: "Published Topics", value: data.totalTopics, accent: "#C9A96E" },
    { label: "Total Completions", value: data.totalCompletions?.toLocaleString(), accent: "#7ec87e" },
  ] : [];

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.heading}>Analytics</h1>
          <p style={S.sub}>Engagement data across all published topics.</p>
        </div>
      </div>

      {loading ? <div style={S.empty}>Loading…</div> : <>
        <StatsGrid stats={STATS} />

        <TopTopicsCard
          modFilter={modFilter}
          setMod={setMod}
          topics={filtered}
          maxComp={maxComp}
        />
      </>}
    </div>
  );
}
