"use client";
// components/admin/MediaPicker.js
// Modal to browse media library and pick a file to attach

import { useState, useEffect } from "react";
import { api } from "@/services/api";

const TYPE_ICONS = { video: "▶", image: "◉", pdf: "◇", graphic: "◈" };
const TYPE_COLORS = { video: "#7eb8d8", image: "#b89fd4", pdf: "#d49090", graphic: "#C9A96E" };

export function MediaPicker({ onSelect, onClose, selectedIds = [] }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/media?limit=200")
      .then(d => setMedia(d?.data?.media || []))
      .catch(() => setMedia([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = media.filter(m => {
    if (filter !== "all" && m.type !== filter) return false;
    if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const fmtSize = (b = 0) => b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${(b / 1024).toFixed(0)} KB`;

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={S.header}>
          <h2 style={S.title}>Media Library</h2>
          <button onClick={onClose} style={S.closeBtn}>✕</button>
        </div>

        <div style={S.filters}>
          {["all", "video", "image", "pdf", "graphic"].map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{ ...S.pill, background: filter === t ? "#1a1208" : "transparent", color: filter === t ? "#F0E8D6" : "#777", border: filter === t ? "1.5px solid #1a1208" : "1.5px solid #e8e8e4" }}>
              {t}
            </button>
          ))}
          <input style={S.search} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div style={S.grid}>
          {loading && <p style={{ fontSize: 12, color: "#bbb", gridColumn: "1/-1", textAlign: "center", padding: "20px 0" }}>Loading media…</p>}
          {!loading && filtered.length === 0 && (
            <p style={{ fontSize: 12, color: "#bbb", gridColumn: "1/-1", textAlign: "center", padding: "20px 0" }}>
              No media found — upload files in the Media Center first.
            </p>
          )}
          {filtered.map(m => {
            const color = TYPE_COLORS[m.type] || "#aaa";
            const selected = selectedIds.includes(m._id);
            return (
              <div key={m._id} onClick={() => onSelect(m)} style={{ ...S.item, border: `1.5px solid ${selected ? color : "#ededea"}`, background: selected ? color + "0a" : "#fff" }}>
                {m.type === "image" && m.url ? (
                  <div style={{ ...S.thumb, backgroundImage: `url(${m.url})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                ) : (
                  <div style={{ ...S.thumb, background: color + "18" }}>
                    <span style={{ fontSize: 20, color }}>{TYPE_ICONS[m.type] || "◎"}</span>
                  </div>
                )}
                <p style={S.itemName}>{m.name}</p>
                <p style={S.itemSize}>{fmtSize(m.sizeBytes)}</p>
                {selected && <span style={{ ...S.checkMark, color }}>✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const S = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 600, display: "flex", alignItems: "center", justifyContent: "center" },
  modal: { background: "#fff", borderRadius: 12, width: "90%", maxWidth: 720, maxHeight: "80vh", display: "flex", flexDirection: "column", overflow: "hidden" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #ededea" },
  title: { fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400, color: "#1a1208" },
  closeBtn: { background: "none", border: "none", fontSize: 16, cursor: "pointer", color: "#aaa" },
  filters: { display: "flex", gap: 6, padding: "14px 24px", borderBottom: "1px solid #ededea", flexWrap: "wrap", alignItems: "center" },
  pill: { fontSize: 10, letterSpacing: ".06em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 40, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" },
  search: { fontSize: 12, padding: "6px 10px", border: "1.5px solid #e8e8e4", borderRadius: 6, outline: "none", marginLeft: "auto", width: 160, fontFamily: "'DM Sans',sans-serif" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12, padding: "20px 24px", overflowY: "auto" },
  item: { borderRadius: 8, overflow: "hidden", cursor: "pointer", position: "relative", transition: "all .15s" },
  thumb: { height: 80, display: "flex", alignItems: "center", justifyContent: "center" },
  itemName: { fontSize: 11, fontWeight: 400, color: "#1a1208", padding: "6px 8px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  itemSize: { fontSize: 10, color: "#bbb", padding: "2px 8px 8px" },
  checkMark: { position: "absolute", top: 8, right: 8, fontSize: 12, fontWeight: 700 },
};