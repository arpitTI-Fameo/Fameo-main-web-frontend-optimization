import Link from "next/link";
import { S } from '../styles';
import { ADMIN_ROUTES } from "@/constants/routes";

export default function ContentOSHeader({
    isReadOnly,
    isMM,
    visibleModules,
    canPublish,
    canCreate,
    accent
}) {
    return (
        <div style={S.header}>
            <div>
                <h1 style={S.heading}>Content OS</h1>
                <p style={S.sub}>
                    {isReadOnly ? "Read-only view — browse all published topics to assist learners." :
                        isMM ? `Your modules: ${visibleModules.map(m => m.title).join(", ")}` :
                            "All topics across all modules. Publish → live on Learner Hub instantly."}
                </p>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {canPublish && <span style={S.liveNote}>◉ Publish = instant live update</span>}
                {canCreate && (
                    <Link href={ADMIN_ROUTES.CONTENT_NEW_EDIT} style={{ ...S.newBtn, background: accent, color: "#1a1200" }}>
                        + New Topic
                    </Link>
                )}
            </div>
        </div>
    );
}
