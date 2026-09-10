"use client";
// modules/Admin/Roles/Modal/PasswordModal/index.jsx

import { useState } from "react";

import { M } from '../../styles';

/* ── Change Password Modal ── */
export default function PasswordModal({ onClose, user, onSave }) {
  const [pw, setPw] = useState("");
  const [confirm, setConf] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    if (pw.length < 8) { setErr("Password must be at least 8 characters"); return; }
    if (pw !== confirm) { setErr("Passwords don't match"); return; }
    setSaving(true);
    await onSave(user._id, pw);
    setSaving(false);
  };

  return (
    <div style={M.overlay} onMouseDown={onClose}>
      <div style={{ ...M.box, maxWidth: 400 }} onMouseDown={e => e.stopPropagation()}>
        <div style={M.header}>
          <div>
            <span style={M.eyebrow}>{user.email}</span>
            <h3 style={M.title}>Change password</h3>
          </div>
          <button onClick={onClose} style={M.close}>✕</button>
        </div>
        <p style={M.body}>
          Set a new password for <strong>{user.name}</strong>. They'll use it the next time they log in.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={M.label}>New password</label>
            <input style={M.input} type="password" value={pw}
              onChange={e => setPw(e.target.value)} placeholder="Min 8 characters" />
          </div>
          <div>
            <label style={M.label}>Confirm password</label>
            <input style={M.input} type="password" value={confirm}
              onChange={e => setConf(e.target.value)} placeholder="Repeat password" />
          </div>
          {err && <p style={M.err}>{err}</p>}
        </div>
        <div style={M.footer}>
          <button style={M.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={{ ...M.primaryBtn, opacity: saving ? 0.7 : 1 }} onClick={submit} disabled={saving}>
            {saving ? "Saving…" : "Update password"}
          </button>
        </div>
      </div>
    </div>
  );
}
