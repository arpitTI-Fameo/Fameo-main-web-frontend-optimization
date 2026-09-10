"use client";
// components/admin/TopicEditor.js
// Reusable topic editor — used by app/admin/content/[id]/edit/page.js

import { useState } from "react";

const MODULES = [
  "Creator Foundations","Content Creation System","Studio & Team Setup",
  "Platform Growth & Algorithms","Collabs & Community","Monetization & Brand Deals",
  "Creator Operations & Legal","Scaling & Career Growth",
];

export default function TopicEditor({ topic, onChange, accent = "#C9A96E" }) {
  const [tab, setTab] = useState("content");

  const set = (key, val) => onChange({ ...topic, [key]: val });

  const setArrayItem = (key, idx, val) => {
    const arr = [...(topic[key] || [])];
    arr[idx] = val;
    onChange({ ...topic, [key]: arr });
  };
  const addItem    = (key) => onChange({ ...topic, [key]: [...(topic[key] || []), ""] });
  const removeItem = (key, idx) => onChange({ ...topic, [key]: (topic[key] || []).filter((_, i) => i !== idx) });

  return (
    <div style={S.wrap}>
      {/* Tabs */}
      <div style={S.tabRow}>
        {["content", "meta", "media"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            ...S.tabBtn,
            color:       tab === t ? "#1a1208" : "#aaa",
            borderBottom:tab === t ? `2px solid ${accent}` : "2px solid transparent",
            fontWeight:  tab === t ? 500 : 400,
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Content tab */}
      {tab === "content" && (
        <div style={S.tabContent}>
          <input
            style={S.titleInput}
            placeholder="Topic title…"
            value={topic.title || ""}
            onChange={e => set("title", e.target.value)}
          />
          <textarea
            style={S.shortDesc}
            placeholder="Short description (shown in module list)…"
            value={topic.shortDesc || ""}
            onChange={e => set("shortDesc", e.target.value)}
            rows={2}
          />
          <label style={S.label}>Body Content (HTML supported)</label>
          <textarea
            style={S.body}
            placeholder="Write the full article here. HTML tags like <strong>, <ul>, <a> are supported."
            value={topic.body || ""}
            onChange={e => set("body", e.target.value)}
            rows={16}
          />

          <label style={S.label}>Key Takeaways</label>
          {(topic.takeaways || [""]).map((item, i) => (
            <div key={i} style={S.arrayRow}>
              <input style={S.arrayInput} placeholder={`Takeaway ${i + 1}…`} value={item} onChange={e => setArrayItem("takeaways", i, e.target.value)} />
              <button onClick={() => removeItem("takeaways", i)} style={S.removeBtn}>✕</button>
            </div>
          ))}
          <button onClick={() => addItem("takeaways")} style={S.addBtn}>+ Add Takeaway</button>

          <label style={{ ...S.label, marginTop: 20 }}>Action Checklist</label>
          {(topic.checklist || [""]).map((item, i) => (
            <div key={i} style={S.arrayRow}>
              <input style={S.arrayInput} placeholder={`Checklist item ${i + 1}…`} value={item} onChange={e => setArrayItem("checklist", i, e.target.value)} />
              <button onClick={() => removeItem("checklist", i)} style={S.removeBtn}>✕</button>
            </div>
          ))}
          <button onClick={() => addItem("checklist")} style={S.addBtn}>+ Add Item</button>
        </div>
      )}

      {/* Meta tab */}
      {tab === "meta" && (
        <div style={S.tabContent}>
          <div style={S.metaGrid}>
            <div>
              <label style={S.label}>Module</label>
              <select style={S.select} value={topic.moduleId ?? 0} onChange={e => set("moduleId", parseInt(e.target.value))}>
                {MODULES.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={S.label}>Level</label>
              <select style={S.select} value={topic.level || "b"} onChange={e => set("level", e.target.value)}>
                <option value="b">Beginner</option>
                <option value="i">Intermediate</option>
              </select>
            </div>
            <div>
              <label style={S.label}>Read Time</label>
              <input style={S.metaInput} value={topic.readTime || ""} onChange={e => set("readTime", e.target.value)} placeholder="e.g. 8 min" />
            </div>
            <div>
              <label style={S.label}>Product CTA ID (optional)</label>
              <input style={S.metaInput} value={topic.productId || ""} onChange={e => set("productId", e.target.value || null)} placeholder="Product ID from Products page" />
            </div>
          </div>
        </div>
      )}

      {/* Media tab */}
      {tab === "media" && (
        <div style={S.tabContent}>
          <p style={S.mediaHint}>Paste Media IDs from the Media Library to attach files to this topic.</p>
          {(topic.mediaIds || []).length === 0
            ? <p style={{ color: "#bbb", fontSize: 13, marginBottom: 12 }}>No media attached.</p>
            : (topic.mediaIds || []).map(mid => (
              <div key={mid} style={S.mediaRow}>
                <span style={S.mediaId}>{mid}</span>
                <button onClick={() => set("mediaIds", topic.mediaIds.filter(m => m !== mid))} style={S.removeBtn}>✕</button>
              </div>
            ))
          }
          <button onClick={() => {
            const id = prompt("Paste Media ID from Media Library:");
            if (id?.trim()) set("mediaIds", [...(topic.mediaIds || []), id.trim()]);
          }} style={S.addBtn}>+ Attach Media ID</button>
        </div>
      )}
    </div>
  );
}

const S = {
  wrap:       { display:"flex",flexDirection:"column",flex:1 },
  tabRow:     { display:"flex",borderBottom:"1px solid #ededea",background:"#fff",flexShrink:0 },
  tabBtn:     { fontSize:12,padding:"11px 16px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .15s" },
  tabContent: { padding:"20px 24px",flex:1,overflowY:"auto" },
  titleInput: { width:"100%",fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:400,border:"none",outline:"none",color:"#1a1208",marginBottom:12,letterSpacing:"-.01em",background:"transparent" },
  shortDesc:  { width:"100%",fontSize:14,border:"1.5px solid #e8e8e4",borderRadius:8,padding:"10px 14px",outline:"none",fontFamily:"'DM Sans',sans-serif",resize:"vertical",marginBottom:20 },
  label:      { display:"block",fontSize:10,letterSpacing:".1em",textTransform:"uppercase",color:"#aaa",marginBottom:8 },
  body:       { width:"100%",fontSize:13,fontFamily:"monospace",lineHeight:1.7,border:"1.5px solid #e8e8e4",borderRadius:8,padding:"12px 14px",outline:"none",resize:"vertical",marginBottom:20 },
  arrayRow:   { display:"flex",gap:8,marginBottom:6 },
  arrayInput: { flex:1,fontSize:13,padding:"8px 12px",border:"1.5px solid #e8e8e4",borderRadius:6,outline:"none",fontFamily:"'DM Sans',sans-serif" },
  removeBtn:  { fontSize:11,padding:"4px 8px",border:"1.5px solid #e8e8e4",borderRadius:5,background:"#fff",color:"#d49090",cursor:"pointer" },
  addBtn:     { fontSize:11,letterSpacing:".06em",padding:"7px 14px",border:"1.5px dashed #ddd",borderRadius:6,background:"transparent",color:"#aaa",cursor:"pointer",marginTop:4 },
  metaGrid:   { display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 },
  select:     { width:"100%",fontSize:13,padding:"9px 12px",border:"1.5px solid #e8e8e4",borderRadius:8,outline:"none",background:"#fff",fontFamily:"'DM Sans',sans-serif" },
  metaInput:  { width:"100%",fontSize:13,padding:"9px 12px",border:"1.5px solid #e8e8e4",borderRadius:8,outline:"none",fontFamily:"'DM Sans',sans-serif" },
  mediaHint:  { fontSize:13,color:"#aaa",marginBottom:14 },
  mediaRow:   { display:"flex",gap:8,alignItems:"center",marginBottom:6 },
  mediaId:    { fontSize:12,fontFamily:"monospace",color:"#555",background:"#f5f5f2",padding:"4px 10px",borderRadius:4,flex:1 },
};