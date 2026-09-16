"use client";
// modules/Admin/Archive/ArchiveCard/index.jsx

import { S } from "../styles";
import { MODULES } from "../constants";
import { daysAgo } from '@/utils/relativeTime';

export default function ArchiveCard({ item, isSuperAdmin, restore, permanentDelete }) {
    return (
        <div style={S.card}>
            <div style={S.cardLeft}>
                <div style={S.archiveDot} />
                <div>
                    <p style={S.cardTitle}>{item.title}</p>
                    <p style={S.cardMeta}>
                        {MODULES[item.moduleId] || `Module ${item.moduleId}`} ·{" "}
                        {item.level === "b" ? "Beginner" : "Intermediate"} · {item.readTime}
                    </p>
                    <p style={S.cardMeta}>
                        Archived {daysAgo(item.updatedAt)} · by {item.createdByName || item.createdBy || "—"}
                    </p>
                </div>
            </div>
            <div style={S.cardActions}>
                <button style={S.restoreBtn} onClick={() => restore(item._id)}>↺ Restore</button>
                {isSuperAdmin && (
                    <button style={S.deleteBtn} onClick={() => permanentDelete(item._id)}>✕ Delete forever</button>
                )}
            </div>
        </div>
    );
}
