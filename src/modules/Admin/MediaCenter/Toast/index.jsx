"use client";
// modules/Admin/MediaCenter/Toast/index.jsx

import { S } from "../styles";

export default function Toast({ toast }) {
    if (!toast) return null;
    return <div style={{ ...S.toast, background: toast.ok ? "#7ec87e" : "#d49090" }}>{toast.msg}</div>;
}
