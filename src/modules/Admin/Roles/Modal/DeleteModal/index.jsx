"use client";
// modules/Admin/Roles/Modal/DeleteModal/index.jsx

import { useState } from "react";

import { M } from '../../styles';

/* ── Delete User Modal ── */
export default function DeleteModal({ onClose, user, onConfirm }) {
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const expected = user.email.split("@")[0];
  const match = confirm === expected;

  const submit = async () => {
    if (!match) return;
    setSaving(true);
    await onConfirm(user._id);
    setSaving(false);
  };

  return (
    <div style={M.overlay} onMouseDown={onClose}>
      <div style={{ ...M.box, maxWidth: 420 }} onMouseDown={e => e.stopPropagation()}>
        <div style={M.header}>
          <h3 style={{ ...M.title, color: "#9a3030" }}>Delete user</h3>
          <button onClick={onClose} style={M.close}>✕</button>
        </div>
        <div style={M.danger}>
          This permanently deletes <strong>{user.name}</strong>'s account, content submissions,
          progress, and session history. This can't be undone.
        </div>
        <p style={{ ...M.body, marginBottom: 10 }}>
          Type <code style={M.code}>{expected}</code> to confirm:
        </p>
        <input style={M.input} value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder={expected} />
        <div style={M.footer}>
          <button style={M.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={{
            ...M.primaryBtn,
            background: "#9a3030",
            opacity: !match ? 0.4 : saving ? 0.7 : 1,
            cursor: !match ? "not-allowed" : "pointer",
          }} onClick={submit} disabled={!match || saving}>
            {saving ? "Deleting…" : "Delete forever"}
          </button>
        </div>
      </div>
    </div>
  );
}
