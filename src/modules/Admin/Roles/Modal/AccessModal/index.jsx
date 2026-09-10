"use client";
// modules/Admin/Roles/Modal/AccessModal/index.jsx

import { useState } from "react";

import { M } from '../../styles';

/* ── Toggle Access Modal ── */
export default function AccessModal({ onClose, user, onConfirm }) {
  const [saving, setSaving] = useState(false);
  const disabling = user.isActive;

  const confirm = async () => {
    setSaving(true);
    await onConfirm(user._id, user.isActive);
    setSaving(false);
    onClose();
  };

  return (
    <div style={M.overlay} onMouseDown={onClose}>
      <div style={{ ...M.box, maxWidth: 420 }} onMouseDown={e => e.stopPropagation()}>
        <div style={M.header}>
          <h3 style={M.title}>{disabling ? "Remove access" : "Restore access"}</h3>
          <button onClick={onClose} style={M.close}>✕</button>
        </div>
        <p style={M.body}>
          {disabling ? (
            <>
              <strong>{user.name}</strong> will be logged out immediately and won't be able to log in.
              Their data stays intact, and you can re-enable access any time.
            </>
          ) : (
            <>
              Restore login access for <strong>{user.name}</strong>. They'll be able to log in with their existing password.
            </>
          )}
        </p>
        <div style={M.footer}>
          <button style={M.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={{
            ...M.primaryBtn,
            background: disabling ? "#9a3030" : "#3a7c3a",
            opacity: saving ? 0.7 : 1,
          }} onClick={confirm} disabled={saving}>
            {saving ? "Working…" : disabling ? "Remove access" : "Restore access"}
          </button>
        </div>
      </div>
    </div>
  );
}
