import { S } from '../styles';

export const STATUS_COLOR = {
    published: ["#7ec87e", "#7ec87e18"],
    draft: ["#C9A96E", "#C9A96E18"],
    review: ["#7eb8d8", "#7eb8d818"],
    archived: ["#aaa", "#aaa22"],
};

export default function TopicEditorTopBar({
    topic,
    router,
    saved,
    preview,
    setPreview,
    save,
    saving,
    canSubmitForReview,
    canPublish
}) {
    const [sc, sbg] = STATUS_COLOR[topic.status] || STATUS_COLOR.draft;

    return (
        <div style={S.topBar}>
            <button onClick={() => router.back()} style={S.backBtn}>← Content OS</button>
            <div style={S.topMid}>
                <span style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, background: sbg, color: sc, fontWeight: 600 }}>
                    {topic.status}
                </span>
                {saved && <span style={{ fontSize: 11, color: "#7ec87e", fontWeight: 500 }}>✓ Saved</span>}
                {topic.title && <span style={{ fontSize: 12, color: "#aaa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 300 }}>{topic.title}</span>}
            </div>
            <div style={S.topActions}>
                <button onClick={() => setPreview(p => !p)} style={S.previewBtn}>
                    {preview ? "Hide Preview" : "Preview"}
                </button>
                <button onClick={() => save()} disabled={saving} style={S.saveBtn}>
                    {saving ? "Saving…" : "Save Draft"}
                </button>
                {canSubmitForReview && topic.status === "draft" && (
                    <button onClick={() => save("review")} style={S.reviewBtn}>Submit for Review</button>
                )}
                {canPublish && topic.status !== "published" && (
                    <button onClick={() => save("published")} style={S.publishBtn}>◉ Publish Live</button>
                )}
                {canPublish && topic.status === "published" && (
                    <button onClick={() => save("draft")} style={{ ...S.reviewBtn, color: "#888", borderColor: "#e8e8e4", background: "#fff" }}>
                        Unpublish
                    </button>
                )}
            </div>
        </div>
    );
}
