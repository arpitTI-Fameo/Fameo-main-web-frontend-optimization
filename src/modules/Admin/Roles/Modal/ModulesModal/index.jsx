"use client";
// modules/Admin/Roles/Modal/ModulesModal/index.jsx

import { useState } from "react";

import { M } from '../../styles';

/* ── Assign Modules Modal (Module Master only) ── */
export default function ModulesModal({ onClose, user, onSave }) {
  const MODULES = [
    "Creator Foundations", "Content Creation System", "Studio & Team Setup",
    "Platform Growth & Algorithms", "Collabs & Community", "Monetization & Brand Deals",
    "Creator Operations & Legal", "Scaling & Career Growth",
  ];
  const ACCENT = "#6aa8cf";
  const [selected, setSelected] = useState(new Set(user.assignedModules || []));
  const [saving, setSaving] = useState(false);

  const toggle = (i) => {
    const n = new Set(selected);
    n.has(i) ? n.delete(i) : n.add(i);
    setSelected(n);
  };

  const save = async () => {
    setSaving(true);
    await onSave(user._id, [...selected]);
    setSaving(false);
    onClose();
  };

  return (
    <div style={M.overlay} onMouseDown={onClose}>
      <div style={{ ...M.box, maxWidth: 480 }} onMouseDown={e => e.stopPropagation()}>
        <div style={M.header}>
          <div>
            <span style={M.eyebrow}>Module Master</span>
            <h3 style={M.title}>Assign modules — {user.name}</h3>
          </div>
          <button onClick={onClose} style={M.close}>✕</button>
        </div>
        <p style={M.body}>
          Module Masters can only create and edit content in the modules you assign here.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {MODULES.map((m, i) => {
            const on = selected.has(i);
            return (
              <label key={i} style={{
                display: "flex", alignItems: "center", gap: 11, padding: "10px 12px",
                borderRadius: 8, cursor: "pointer",
                background: on ? ACCENT + "14" : "#fbfaf6",
                border: `1.5px solid ${on ? ACCENT + "55" : "#ece8de"}`,
                transition: "all .15s",
              }}>
                <input type="checkbox" checked={on} onChange={() => toggle(i)}
                  style={{ width: 15, height: 15, cursor: "pointer", accentColor: ACCENT }} />
                <span style={{ fontSize: 12.5, color: on ? "#1a4a7a" : "#5e564a", fontWeight: on ? 500 : 400 }}>
                  <span style={{ fontSize: 10, color: ACCENT, fontWeight: 700, marginRight: 8, letterSpacing: ".08em", fontVariantNumeric: "tabular-nums" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {m}
                </span>
              </label>
            );
          })}
        </div>
        <p style={{ fontSize: 11, color: "#a8a092", marginTop: 11 }}>{selected.size} of {MODULES.length} modules selected</p>
        <div style={M.footer}>
          <button style={M.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={{ ...M.primaryBtn, opacity: saving ? 0.7 : 1 }} onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save modules"}
          </button>
        </div>
      </div>
    </div>
  );
}
