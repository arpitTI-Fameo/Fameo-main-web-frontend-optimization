"use client";
// modules/Admin/Analytics/TopTopicsCard/index.jsx

import TopicRow from "./TopicRow";
import { S } from "../styles";
import { MODULES } from "../constants";

export default function TopTopicsCard({ modFilter, setMod, topics, maxComp }) {
  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <h2 style={S.cardTitle}>Top Topics by Completions</h2>
        <select style={S.select} value={modFilter} onChange={e => setMod(e.target.value)}>
          <option value="all">All Modules</option>
          {MODULES.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>
      </div>
      {topics.map(t => (
        <TopicRow key={t._id} topic={t} maxComp={maxComp} />
      ))}
    </div>
  );
}
