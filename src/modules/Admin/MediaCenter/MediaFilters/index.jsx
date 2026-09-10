"use client";
// modules/Admin/MediaCenter/MediaFilters/index.jsx

import { S } from "../styles";
import { FILTER_TYPES } from "../constants";

export default function MediaFilters({ filter, setFilter, search, setSearch, count }) {
    return (
        <div style={S.filters}>
            {FILTER_TYPES.map(t => (
                <button key={t} onClick={() => setFilter(t)} style={{
                    ...S.filterPill,
                    background: filter === t ? "#1a1208" : "transparent",
                    color: filter === t ? "#F0E8D6" : "#777",
                    border: filter === t ? "1.5px solid #1a1208" : "1.5px solid #e8e8e4",
                }}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
            ))}
            <input style={S.search} placeholder="Search files…" value={search} onChange={e => setSearch(e.target.value)} />
            <span style={S.count}>{count} files</span>
        </div>
    );
}
