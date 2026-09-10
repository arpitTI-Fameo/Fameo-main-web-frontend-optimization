"use client";
// modules/Admin/MediaCenter/MediaHeader/index.jsx

import { S } from "../styles";

export default function MediaHeader({ total, fileRef, uploading, handleUpload }) {
    return (
        <div style={S.header}>
            <div>
                <h1 style={S.heading}>Media Center</h1>
                <p style={S.sub}>All uploaded files across all modules. {total} files total.</p>
            </div>
            <div style={S.headerActions}>
                <input ref={fileRef} type="file" accept="image/*,video/*,.pdf" style={{ display: "none" }} onChange={handleUpload} />
                <button onClick={() => fileRef.current?.click()} disabled={uploading} style={S.uploadBtn}>
                    {uploading ? "Uploading…" : "+ Upload File"}
                </button>
            </div>
        </div>
    );
}
