import { S } from '../styles';
import { MediaPicker } from "@/components/admin/MediaPicker";

export default function TopicEditorPane({
    topic,
    set,
    setArr,
    addArr,
    remArr,
    tab,
    setTab,
    availableModules,
    isMM,
    attachedMedia,
    setAttachedMedia,
    showPicker,
    setShowPicker
}) {
    return (
        <div style={S.editorPane}>
            <div style={S.tabRow}>
                {["content", "meta", "media"].map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{
                        ...S.tabBtn,
                        borderBottom: tab === t ? "2px solid #C9A96E" : "2px solid transparent",
                        color: tab === t ? "#1a1208" : "#aaa",
                        fontWeight: tab === t ? 500 : 400,
                    }}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content tab */}
            {tab === "content" && (
                <div style={S.tabBody}>
                    <input style={S.titleInput} placeholder="Topic title…"
                        value={topic.title} onChange={e => set("title", e.target.value)} />
                    <textarea style={S.descInput} rows={2}
                        placeholder="Short description (shown in module list)…"
                        value={topic.shortDesc} onChange={e => set("shortDesc", e.target.value)} />

                    <label style={S.label}>Body Content <span style={{ color: "#bbb", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(HTML supported)</span></label>
                    <textarea style={S.bodyInput} rows={16}
                        placeholder="Write the full article here…"
                        value={topic.body} onChange={e => set("body", e.target.value)} />

                    <label style={S.label}>Key Takeaways</label>
                    {topic.takeaways.map((v, i) => (
                        <div key={i} style={S.arrRow}>
                            <input style={S.arrInput} placeholder={`Takeaway ${i + 1}…`}
                                value={v} onChange={e => setArr("takeaways", i, e.target.value)} />
                            <button onClick={() => remArr("takeaways", i)} style={S.remBtn}>✕</button>
                        </div>
                    ))}
                    <button onClick={() => addArr("takeaways")} style={S.addBtn}>+ Add Takeaway</button>

                    <label style={{ ...S.label, marginTop: 20 }}>Action Checklist</label>
                    {topic.checklist.map((v, i) => (
                        <div key={i} style={S.arrRow}>
                            <input style={S.arrInput} placeholder={`Checklist item ${i + 1}…`}
                                value={v} onChange={e => setArr("checklist", i, e.target.value)} />
                            <button onClick={() => remArr("checklist", i)} style={S.remBtn}>✕</button>
                        </div>
                    ))}
                    <button onClick={() => addArr("checklist")} style={S.addBtn}>+ Add Item</button>
                </div>
            )}

            {/* Meta tab */}
            {tab === "meta" && (
                <div style={S.tabBody}>
                    <div style={S.metaGrid}>
                        <div>
                            <label style={S.label}>Module</label>
                            <select style={S.metaSel} value={topic.moduleId}
                                onChange={e => set("moduleId", parseInt(e.target.value))}>
                                {availableModules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                            </select>
                            {isMM && <p style={{ fontSize: 10, color: "#bbb", marginTop: 4 }}>Only your assigned modules are shown.</p>}
                        </div>
                        <div>
                            <label style={S.label}>Level</label>
                            <select style={S.metaSel} value={topic.level} onChange={e => set("level", e.target.value)}>
                                <option value="b">Beginner</option>
                                <option value="i">Intermediate</option>
                            </select>
                        </div>
                        <div>
                            <label style={S.label}>Read Time</label>
                            <input style={S.metaInput} value={topic.readTime}
                                onChange={e => set("readTime", e.target.value)} placeholder="e.g. 8 min" />
                        </div>
                        <div>
                            <label style={S.label}>Product CTA ID <span style={{ color: "#bbb", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                            <input style={S.metaInput} value={topic.productId || ""}
                                onChange={e => set("productId", e.target.value || null)} placeholder="Product ID" />
                        </div>
                    </div>

                    {isMM && (
                        <div style={{ marginTop: 20, padding: "12px 14px", background: "#7eb8d818", border: "1px solid #7eb8d844", borderRadius: 8, fontSize: 12, color: "#1a4a7a" }}>
                            ◎ As a Module Master, use <strong>Submit for Review</strong> — your topics go to the Content Manager for approval before publishing.
                        </div>
                    )}
                </div>
            )}

            {/* Media tab */}
            {tab === "media" && (
                <div style={S.tabBody}>
                    <p style={{ fontSize: 13, color: "#aaa", marginBottom: 16, lineHeight: 1.6 }}>
                        Attach media from the Media Center. Each file (video, image, PDF) linked here
                        will be rendered after the first H2 heading in the article.
                    </p>
                    {(topic.mediaIds || []).length === 0 && (
                        <p style={{ fontSize: 12, color: "#bbb", marginBottom: 12 }}>No media attached yet.</p>
                    )}
                    {(topic.mediaIds || []).map(mid => (
                        <div key={mid} style={S.arrRow}>
                            <span style={{ fontSize: 12, fontFamily: "monospace", color: "#555", background: "#f5f5f2", padding: "8px 12px", borderRadius: 6, flex: 1 }}>
                                {attachedMedia[mid] ? `${attachedMedia[mid].name} (${attachedMedia[mid].type})` : mid}
                            </span>
                            <button onClick={() => set("mediaIds", (topic.mediaIds || []).filter(m => m !== mid))} style={S.remBtn}>✕ Remove</button>
                        </div>
                    ))}
                    <button onClick={() => setShowPicker(true)} style={S.addBtn}>◉ Browse Media Center</button>
                    {showPicker && (
                        <MediaPicker
                            selectedIds={topic.mediaIds || []}
                            onClose={() => setShowPicker(false)}
                            onSelect={(m) => {
                                if (!(topic.mediaIds || []).includes(m._id)) {
                                    set("mediaIds", [...(topic.mediaIds || []), m._id]);
                                    setAttachedMedia(prev => ({ ...prev, [m._id]: { name: m.name, type: m.type } }));
                                }
                                setShowPicker(false);
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
