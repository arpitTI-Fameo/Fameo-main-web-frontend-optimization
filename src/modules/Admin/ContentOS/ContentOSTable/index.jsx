import Link from "next/link";
import { S } from '../styles';
import { STATUS_CONFIG, MODULES, timeAgo } from '../constants';

export default function ContentOSTable({
    isReadOnly,
    canEdit,
    isMM,
    canApprove,
    canPublish,
    canArchive,
    canDelete,
    selected,
    setSelected,
    filtered,
    loading,
    user,
    role,
    assignedModules,
    changeStatus,
    deleteTopic
}) {
    return (
        <div style={S.table}>
            <div style={S.thead}>
                {!isReadOnly && (
                    <input type="checkbox" style={{ marginRight: 8 }}
                        onChange={e => setSelected(e.target.checked ? new Set(filtered.map(t => t._id)) : new Set())} />
                )}
                <span style={{ flex: 3 }}>Title</span>
                <span style={{ flex: 1 }}>Module</span>
                <span style={{ flex: 1 }}>Status</span>
                <span style={{ flex: 1 }}>Level</span>
                <span style={{ flex: 1 }}>Updated</span>
                <span style={{ flex: isReadOnly ? 0.5 : 1.5 }}>Actions</span>
            </div>

            {loading ? <div style={S.tempty}>Loading…</div> :
                filtered.length === 0 ? <div style={S.tempty}>No topics found</div> :
                    filtered.map(t => {
                        const sc = STATUS_CONFIG[t.status] || STATUS_CONFIG.draft;
                        const mod = MODULES.find(m => m.id === t.moduleId);
                        const isOwn = t.createdByName === user?.name || t.createdById === user?._id;
                        const canEditThis = canEdit && (role !== "moduleMaster" || isOwn || assignedModules?.includes(t.moduleId));

                        return (
                            <div key={t._id} style={{ ...S.trow, background: selected.has(t._id) ? "#f5fbf5" : "#fff" }}>
                                {!isReadOnly && (
                                    <input type="checkbox" checked={selected.has(t._id)} style={{ marginRight: 8 }}
                                        onChange={e => { const n = new Set(selected); e.target.checked ? n.add(t._id) : n.delete(t._id); setSelected(n); }} />
                                )}
                                <div style={{ flex: 3, minWidth: 0 }}>
                                    <span style={S.topicTitle}>{t.title}</span>
                                    <span style={S.topicMeta}>by {t.createdByName || "—"} · {t.readTime}</span>
                                </div>
                                <span style={{ flex: 1, fontSize: 11, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {mod?.title || `Module ${t.moduleId}`}
                                </span>
                                <span style={{ flex: 1 }}>
                                    <span style={{ ...S.statusPill, background: sc.bg, color: sc.color }}>{sc.label}</span>
                                </span>
                                <span style={{ flex: 1, fontSize: 11, color: "#888" }}>
                                    {t.level === "b" ? "Beginner" : "Intermediate"}
                                </span>
                                <span style={{ flex: 1, fontSize: 11, color: "#bbb" }}>{timeAgo(t.updatedAt)}</span>

                                <div style={{ flex: isReadOnly ? 0.5 : 1.5, display: "flex", gap: 4, flexWrap: "wrap" }}>
                                    {/* Read-only preview for all roles */}
                                    <Link href={`/resources/courses/${t.slug || t._id}`} target="_blank" style={{ ...S.actionBtn, color: "#7eb8d8", borderColor: "#7eb8d844" }}>
                                        Preview
                                    </Link>

                                    {/* Edit — not for supportAgent */}
                                    {canEditThis && (
                                        <Link href={`/admin/content/${t._id}/edit`} style={S.actionBtn}>Edit</Link>
                                    )}

                                    {/* Submit for review — moduleMaster only on drafts */}
                                    {isMM && t.status === "draft" && isOwn && (
                                        <button style={{ ...S.actionBtn, color: "#7eb8d8", borderColor: "#7eb8d844" }}
                                            onClick={() => changeStatus(t._id, "review")}>Submit</button>
                                    )}

                                    {/* Approve — contentManager and superAdmin on review items */}
                                    {canApprove && t.status === "review" && (
                                        <button style={{ ...S.actionBtn, color: "#3a7c3a", borderColor: "#7ec87e44" }}
                                            onClick={() => changeStatus(t._id, "published")}>✓ Approve</button>
                                    )}

                                    {/* Publish — superAdmin + contentManager on non-published */}
                                    {canPublish && t.status !== "published" && t.status !== "review" && (
                                        <button style={{ ...S.actionBtn, color: "#3a7c3a", borderColor: "#7ec87e44" }}
                                            onClick={() => changeStatus(t._id, "published")}>Publish</button>
                                    )}

                                    {/* Unpublish */}
                                    {canPublish && t.status === "published" && (
                                        <button style={{ ...S.actionBtn, color: "#888" }}
                                            onClick={() => changeStatus(t._id, "draft")}>Unpublish</button>
                                    )}

                                    {/* Archive */}
                                    {canArchive && t.status !== "archived" && (
                                        <button style={{ ...S.actionBtn, color: "#d49090", borderColor: "#d4909044" }}
                                            onClick={() => changeStatus(t._id, "archived")}>Archive</button>
                                    )}

                                    {/* Delete — superAdmin only */}
                                    {canDelete && (
                                        <button style={{ ...S.actionBtn, color: "#c00", borderColor: "#c0000044" }}
                                            onClick={() => deleteTopic(t._id)}>Delete</button>
                                    )}
                                </div>
                            </div>
                        );
                    })
            }
        </div>
    );
}
