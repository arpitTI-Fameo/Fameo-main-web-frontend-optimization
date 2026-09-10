"use client";
// modules/Admin/Roles/Modal/CreateUserModal/index.jsx

import { useState } from "react";

import { S, M } from '../../styles';
import { ROLES } from '../../constants';

/* ── Create User Modal ── */
export default function CreateUserModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "contentManager" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const activeRole = ROLES.find(r => r.key === form.role);

  const submit = async () => {
    if (!form.name.trim()) { setErr("Enter the user's name"); return; }
    if (!form.email.trim()) { setErr("Enter an email address"); return; }
    if (form.password.length < 8) { setErr("Password must be at least 8 characters"); return; }
    setSaving(true);
    setErr("");
    await onCreate(form);
    setSaving(false);
  };

  return (
    <div style={M.overlay} onMouseDown={onClose}>
      <div style={M.box} onMouseDown={e => e.stopPropagation()}>
        <div style={M.header}>
          <div>
            <span style={M.eyebrow}>New account</span>
            <h3 style={M.title}>Create user</h3>
          </div>
          <button onClick={onClose} style={M.close}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={M.label}>Full name</label>
            <input style={M.input} value={form.name}
              onChange={e => set("name", e.target.value)} placeholder="Priya Sharma" />
          </div>
          <div>
            <label style={M.label}>Email address</label>
            <input style={M.input} type="email" value={form.email}
              onChange={e => set("email", e.target.value)} placeholder="priya@fameo.in" />
          </div>
          <div>
            <label style={M.label}>Password <span style={M.hint}>min 8 characters</span></label>
            <input style={M.input} type="password" value={form.password}
              onChange={e => set("password", e.target.value)} placeholder="Set a starting password" />
          </div>
          <div>
            <label style={M.label}>Role</label>
            <select style={M.select} value={form.role} onChange={e => set("role", e.target.value)}>
              {ROLES.filter(r => r.key !== "learner").map(r => (
                <option key={r.key} value={r.key}>{r.label}</option>
              ))}
            </select>
            {activeRole && (
              <div style={{ ...M.roleNote, borderColor: activeRole.color + "33", background: activeRole.color + "0c" }}>
                <span style={{ ...S.roleChip, color: activeRole.color, fontSize: 10 }}>{activeRole.label}</span>
                <p style={{ fontSize: 11.5, color: "#7a7264", margin: "4px 0 0", lineHeight: 1.5 }}>{activeRole.desc}</p>
              </div>
            )}
          </div>
          {err && <p style={M.err}>{err}</p>}
        </div>

        <div style={M.footer}>
          <button style={M.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={{ ...M.primaryBtn, opacity: saving ? 0.7 : 1 }} onClick={submit} disabled={saving}>
            {saving ? "Creating…" : "Create user"}
          </button>
        </div>
      </div>
    </div>
  );
}
