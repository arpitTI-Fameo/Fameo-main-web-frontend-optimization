import { sanitizeRichText } from "@/lib/security/sanitize";
import { S } from '../styles';
import { MODULES } from '../../constants';

export default function TopicPreviewPane({ topic }) {
    return (
        <div style={S.previewPane}>
            <div style={{ fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "#bbb", marginBottom: 20 }}>
                ◎ Learner Preview — exactly as it appears on Learner Hub
            </div>
            <div style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#C9A96E", marginBottom: 8 }}>
                {MODULES.find(m => m.id === topic.moduleId)?.title}
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 400, color: "#1a1208", marginBottom: 10, letterSpacing: "-.015em", lineHeight: 1.1 }}>
                {topic.title || "Untitled"}
            </h1>
            <p style={{ fontSize: 14, color: "#777", marginBottom: 12, lineHeight: 1.7 }}>{topic.shortDesc}</p>
            <div style={{ display: "flex", gap: 8, fontSize: 11, color: "#bbb", marginBottom: 16 }}>
                <span>{topic.level === "b" ? "Beginner" : "Intermediate"}</span>
                <span>·</span>
                <span>{topic.readTime}</span>
            </div>
            <hr style={{ border: "none", borderTop: "1px solid #ededea", marginBottom: 20 }} />
            <div style={{ fontSize: 14, lineHeight: 1.8, color: "#444" }}
                dangerouslySetInnerHTML={{ __html: sanitizeRichText(topic.body) || "<p style='color:#bbb'>Body will appear here…</p>" }} />
            {topic.takeaways?.filter(Boolean).length > 0 && (
                <div style={{ background: "#C9A96E0a", border: "1.5px solid #C9A96E33", borderRadius: 10, padding: "16px 18px", marginTop: 24 }}>
                    <strong style={{ fontSize: 13, color: "#1a1208", display: "block", marginBottom: 8 }}>Key Takeaways</strong>
                    {topic.takeaways.filter(Boolean).map((t, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "flex-start" }}>
                            <span style={{ color: "#C9A96E", fontSize: 10, marginTop: 3 }}>◈</span>
                            <span style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{t}</span>
                        </div>
                    ))}
                </div>
            )}
            {topic.checklist?.filter(Boolean).length > 0 && (
                <div style={{ marginTop: 20, padding: "16px 18px", border: "1.5px solid #ededea", borderRadius: 10 }}>
                    <strong style={{ fontSize: 13, color: "#1a1208", display: "block", marginBottom: 8 }}>Action Checklist</strong>
                    {topic.checklist.filter(Boolean).map((c, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
                            <span style={{ width: 14, height: 14, border: "1.5px solid #ddd", borderRadius: 3, flexShrink: 0, display: "inline-block" }} />
                            <span style={{ fontSize: 13, color: "#555" }}>{c}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
