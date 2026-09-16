"use client";
// modules/Admin/MediaCenter/MediaCard/index.jsx

import { S } from "../styles";
import { TYPE_COLORS, TYPE_ICONS } from "../constants";
import { fmtSize } from "../helpers";
import { timeAgoNumeric } from '@/utils/relativeTime';

export default function MediaCard({ item, deleteMedia }) {
    const color = TYPE_COLORS[item.type] || "#aaa";
    const icon = TYPE_ICONS[item.type] || "◎";
    return (
        <div style={S.card}>
            <div style={{ ...S.cardThumb, background: color + "18", border: `1.5px solid ${color}33` }}>
                <span style={{ fontSize: 24, color }}>{icon}</span>
            </div>
            <div style={S.cardBody}>
                <p style={S.cardName} title={item.name}>{item.name}</p>
                <p style={S.cardMeta}>{fmtSize(item.sizeBytes || 0)} · {item.uploadedByRole || item.uploadedBy?.role || "—"}</p>
                <p style={S.cardMeta}>{timeAgoNumeric(item.uploadedAt || item.createdAt)}</p>
                {item.attachedTopics?.length > 0 && (
                    <p style={{ ...S.cardMeta, color: "#C9A96E" }}>
                        {item.attachedTopics.length} topic{item.attachedTopics.length > 1 ? "s" : ""} attached
                    </p>
                )}
            </div>
            <div style={S.cardFooter}>
                <span style={{ ...S.typeBadge, color, background: color + "18" }}>{item.type}</span>
                <div style={{ display: "flex", gap: 6 }}>
                    {item.url && item.url !== "#" && (
                        <a href={item.url} target="_blank" rel="noreferrer" style={S.viewBtn}>↗</a>
                    )}
                    <button onClick={() => deleteMedia(item._id)} style={S.deleteBtn}>✕</button>
                </div>
            </div>
        </div>
    );
}
