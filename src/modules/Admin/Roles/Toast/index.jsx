"use client";
// modules/Admin/Roles/Toast/index.jsx

import { S } from '../styles';

export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{ ...S.toast, background: toast.ok ? "#1a1208" : "#9a3030" }}>
      <span style={{ color: toast.ok ? "#9ad49a" : "#f0c4c4" }}>{toast.ok ? "✓" : "✕"}</span>
      {toast.msg}
    </div>
  );
}
