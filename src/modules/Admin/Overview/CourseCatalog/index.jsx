import Link from "next/link";
import { S } from '../styles';
import { ADMIN_ROUTES, ROUTES } from "@/constants/routes";

export default function CourseCatalog({ catalog, canEditCourses, accent, togglePublishCourse, toggleFeatureCourse }) {
  return (
    <div style={{ ...S.card, marginBottom: 24 }}>
      <div style={S.cardHead}>
        <h2 style={S.cardTitle}>Course Catalog <span style={{ fontSize: 13, color: "#bbb", fontWeight: 400, fontFamily: "'DM Sans',sans-serif" }}>({catalog.length})</span></h2>
        <Link href={ADMIN_ROUTES.COURSES} style={{ ...S.cardLink, color: accent }}>Manage all →</Link>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))" }}>
        {catalog.map((c, i) => {
          const sc = c._static ? ["Static", "#C9A96E", "#C9A96E18"]
            : c.isPublished ? ["◉ Live", "#3a7c3a", "#7ec87e18"]
              : ["Draft", "#888", "#f5f5f2"];
          return (
            <div key={c._id || c.id} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
              borderBottom: "1px solid #f5f5f2",
              borderRight: (i % 2 === 0) ? "1px solid #f5f5f2" : "none",
              background: c._static ? "#fffdf8" : "#fff",
            }}>
              <div style={{
                width: 42, height: 28, borderRadius: 3, flexShrink: 0,
                backgroundImage: `url(${c.thumbnail})`,
                backgroundSize: "cover", backgroundPosition: "center",
                border: "1px solid #ededea",
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 12, fontWeight: 400, color: "#1a1208", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {c.title}
                </span>
                <span style={{ fontSize: 10, color: "#bbb" }}>
                  {c.category} · {c.totalLessons || c.lessons || 0} lessons · {c.level}
                </span>
              </div>
              <div style={{ display: "flex", gap: 4, flexShrink: 0, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                <span style={{ fontSize: 9, letterSpacing: ".08em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 3, background: sc[2], color: sc[1], fontWeight: 600 }}>
                  {sc[0]}
                </span>
                <Link href={ROUTES.COURSE(c.slug)} target="_blank" style={S.catBtn}>↗</Link>
                {canEditCourses && (
                  <>
                    <Link href={ADMIN_ROUTES.COURSES} style={{ ...S.catBtn, color: accent }}>Edit</Link>
                    <button onClick={() => togglePublishCourse(c)} style={{
                      ...S.catBtn,
                      color: c.isPublished ? "#888" : "#3a7c3a",
                      borderColor: c.isPublished ? "#e8e8e4" : "#7ec87e44",
                    }}>
                      {c.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <button onClick={() => toggleFeatureCourse(c)} style={{
                      ...S.catBtn,
                      color: c.isFeatured ? "#b89fd4" : "#888",
                      borderColor: c.isFeatured ? "#b89fd444" : "#e8e8e4",
                    }}>
                      {c.isFeatured ? "★" : "☆"}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ padding: "10px 16px", fontSize: 11, color: "#aaa", borderTop: "1px solid #f5f5f2", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Publish / Feature work right here · open the manager to edit chapters &amp; lessons</span>
        <Link href={ADMIN_ROUTES.COURSES} style={{ color: accent, textDecoration: "none", fontWeight: 500, fontSize: 11 }}>
          Open Course Manager →
        </Link>
      </div>
    </div>
  );
}
