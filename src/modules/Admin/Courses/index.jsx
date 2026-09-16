"use client";
// app/admin/courses/page.js
// Full course management — add, edit, delete, publish/unpublish
// API: /api/courses/admin/*

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { useAdminCourses, useCreateAdminCourseMutation, useTogglePublishAdminCourseMutation, useToggleFeatureAdminCourseMutation, useDeleteAdminCourseMutation, useUpdateAdminCourseMutation } from "@/lib/hooks/admin/useCourses";
import { getAdminCourseAction } from '@/lib/services/admin/courses.service';
import { useSocket } from "@/lib/hooks/custome/useSocket";
import { COURSES as STATIC_COURSES } from "@/constants/courses";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { CONTENT_APPROVER_ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

const CATEGORIES = ["Foundations", "Content", "Setup", "Growth", "Monetization", "Operations", "Scaling", "Analytics", "Mindset"];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"];

export default function CoursesAdmin() {
    const { user } = useAdminAuthStore();
    const isSA = user?.role === "superAdmin";
    const canEdit = CONTENT_APPROVER_ROLES.includes(user?.role);

    const [search, setSearch] = useState("");
    const [catFilter, setCat] = useState("all");
    const [toast, setToast] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);

    const showToast = (msg, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3000);
    };

    const coursesQuery = useAdminCourses();
    const createCourseMutation = useCreateAdminCourseMutation();
    const togglePublishCourseMutation = useTogglePublishAdminCourseMutation();
    const toggleFeatureCourseMutation = useToggleFeatureAdminCourseMutation();
    const deleteCourseMutation = useDeleteAdminCourseMutation();

    const loading = coursesQuery.isPending;

    let courses = [];
    if (!coursesQuery.error && coursesQuery.data) {
        const dbCourses = coursesQuery.data?.data?.courses || coursesQuery.data?.data || [];
        const dbSlugs = new Set(dbCourses.map(c => c.slug));
        const staticOnly = STATIC_COURSES
            .filter(c => !dbSlugs.has(c.slug))
            .map(c => ({
                ...c,
                _id: c.id,
                isPublished: false,
                isFeatured: false,
                enrolledCount: c.enrolled || 0,
                totalLessons: c.lessons || 0,
                updatedAt: new Date().toISOString(),
                _static: true,
            }));
        courses = [...dbCourses, ...staticOnly];
    } else if (coursesQuery.error) {
        courses = STATIC_COURSES.map(c => ({
            ...c,
            _id: c.id,
            isPublished: true,
            isFeatured: false,
            enrolledCount: c.enrolled || 0,
            totalLessons: c.lessons || 0,
            updatedAt: new Date().toISOString(),
            _static: true,
        }));
    }

    // Live sync
    useSocket({
        "course:published": () => coursesQuery.refetch(),
        "course:unpublished": () => coursesQuery.refetch(),
        "course:deleted": () => coursesQuery.refetch(),
        "course:updated": () => coursesQuery.refetch(),
    });

    const filtered = Array.isArray(courses) ? courses.filter(c => {
        if (catFilter !== "all" && c.category !== catFilter) return false;
        if (search && !c.title?.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    }) : [];

    const dbCount = courses.filter(c => !c._static).length;
    const staticCount = courses.filter(c => c._static).length;

    const togglePublish = async (course) => {
        let target = course;
        // Static seed course → migrate to DB first, then act on the new DB record
        if (course._static) {
            target = await migrateToDb(course, { silent: true });
            if (!target?._id) { showToast("Couldn't save course to DB", false); return; }
        }
        try {
            const data = await togglePublishCourseMutation.togglePublish(target._id);
            showToast(data?.data?.isPublished ? "Published live ◉" : "Unpublished");
        } catch { showToast("Failed", false); return; }
        coursesQuery.refetch(); // reconcile state + drop the migrated static duplicate
    };

    const toggleFeatured = async (course) => {
        let target = course;
        if (course._static) {
            target = await migrateToDb(course, { silent: true });
            if (!target?._id) { showToast("Couldn't save course to DB", false); return; }
        }
        try {
            await toggleFeatureCourseMutation.toggleFeature(target._id);
            showToast("Featured status updated");
        } catch { showToast("Failed", false); return; }
        coursesQuery.refetch();
    };

    const deleteCourse = async (id) => {
        try {
            await deleteCourseMutation.deleteCourse(id);
            coursesQuery.refetch();
            setDeleting(null);
            showToast("Course deleted");
        } catch { showToast("Delete failed", false); }
    };

    const migrateToDb = async (course, { silent = false } = {}) => {
        try {
            const { _static, _id, updatedAt, ...payload } = course;
            const data = await createCourseMutation.createCourse({
                ...payload,
                courseId: course.id || course.slug,
                enrolled: course.enrolled || course.enrolledCount || 0,
                lessons: course.lessons || course.totalLessons || 0,
                rating: course.rating || 0,
                reviews: course.reviews || course.reviewCount || 0,
                isPublished: false,
            });
            if (!silent) { showToast("Course saved to database ◉"); coursesQuery.refetch(); }
            return data?.data?.course || null;
        } catch (e) {
            if (!silent) { showToast("Migration failed", false); coursesQuery.refetch(); }
            return null;
        }
    };

    // Migrate ALL static courses at once
    const migrateAll = async () => {
        const statics = courses.filter(c => c._static);
        if (statics.length === 0) { showToast("All courses already in DB ◉"); return; }
        showToast(`Migrating ${statics.length} courses…`);
        for (const c of statics) await migrateToDb(c).catch(() => { });
        coursesQuery.refetch();
        showToast(`${statics.length} courses migrated to DB ◉`);
    };

    return (
        <div style={S.page}>
            {toast && <div style={{ ...S.toast, background: toast.ok ? "#7ec87e" : "#d49090" }}>{toast.msg}</div>}

            {/* Header */}
            <div style={S.header}>
                <div>
                    <h1 style={S.heading}>Course Catalog</h1>
                    <p style={S.sub}>
                        {dbCount} in database · {staticCount} static
                        {staticCount > 0 && <span style={{ color: "#C9A96E" }}> — click "Save to DB" or migrate all</span>}
                    </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    {canEdit && staticCount > 0 && (
                        <button onClick={migrateAll} style={S.migrateBtn}>
                            ↑ Migrate All to DB ({staticCount})
                        </button>
                    )}
                    {canEdit && (
                        <button onClick={() => { setEditing(null); setShowForm(true); }} style={S.newBtn}>
                            + New Course
                        </button>
                    )}
                </div>
            </div>

            {/* DB status banner */}
            {staticCount > 0 && (
                <div style={S.infoBanner}>
                    <span style={{ fontWeight: 500 }}>◈ {staticCount} courses</span> are loaded from{" "}
                    <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: 3 }}>constants/courses.js</code>{" "}
                    and shown as <strong>Static</strong>. Click <strong>Save to DB</strong> on each or{" "}
                    <strong>Migrate All</strong> to make them fully editable.
                </div>
            )}

            {/* Filters */}
            <div style={S.filters}>
                <input style={S.search} placeholder="Search courses…"
                    value={search} onChange={e => setSearch(e.target.value)} />
                <select style={S.select} value={catFilter} onChange={e => setCat(e.target.value)}>
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div style={{ display: "flex", gap: 8, marginLeft: "auto", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#bbb" }}>{filtered.length} courses</span>
                </div>
            </div>

            {/* Table */}
            <div style={S.table}>
                <div style={S.thead}>
                    <span style={{ width: 52, flexShrink: 0 }} />
                    <span style={{ flex: 3 }}>Course</span>
                    <span style={{ flex: 1 }}>Category</span>
                    <span style={{ flex: 1 }}>Level</span>
                    <span style={{ flex: "0 0 70px", textAlign: "center" }}>Lessons</span>
                    <span style={{ flex: "0 0 80px", textAlign: "center" }}>Enrolled</span>
                    <span style={{ flex: "0 0 80px", textAlign: "center" }}>Status</span>
                    <span style={{ flex: 2 }}>Actions</span>
                </div>

                {loading ? (
                    <div style={S.empty}>Loading…</div>
                ) : filtered.length === 0 ? (
                    <div style={S.empty}>No courses found</div>
                ) : filtered.map(c => (
                    <div key={c._id || c.id} style={{
                        ...S.trow,
                        background: c._static ? "#fffdf8" : "#fff",
                    }}>
                        {/* Thumbnail */}
                        <div style={{
                            width: 52, height: 34, borderRadius: 4, flexShrink: 0,
                            backgroundImage: `url(${c.thumbnail})`,
                            backgroundSize: "cover", backgroundPosition: "center",
                            border: "1px solid #ededea",
                        }} />

                        {/* Title + subtitle */}
                        <div style={{ flex: 3, minWidth: 0 }}>
                            <span style={S.courseTitle}>{c.title}</span>
                            <span style={S.courseSub}>
                                {c._static && <span style={{ color: "#C9A96E", marginRight: 4 }}>◈ static</span>}
                                {c.subtitle?.slice(0, 55)}{c.subtitle?.length > 55 ? "…" : ""}
                            </span>
                        </div>

                        <span style={{ flex: 1, fontSize: 11, color: "#888" }}>{c.category}</span>
                        <span style={{ flex: 1, fontSize: 11, color: "#888" }}>{c.level}</span>

                        <span style={{ flex: "0 0 70px", fontSize: 11, color: "#888", textAlign: "center" }}>
                            {c.totalLessons || c.lessons || "—"}
                        </span>
                        <span style={{ flex: "0 0 80px", fontSize: 11, color: "#888", textAlign: "center" }}>
                            {(c.enrolledCount || c.enrolled || 0).toLocaleString()}
                        </span>

                        {/* Status pill */}
                        <span style={{ flex: "0 0 80px", textAlign: "center" }}>
                            {c._static ? (
                                <span style={{ ...S.pill, background: "#C9A96E18", color: "#C9A96E" }}>Static</span>
                            ) : c.isPublished ? (
                                <span style={{ ...S.pill, background: "#7ec87e18", color: "#3a7c3a" }}>◉ Live</span>
                            ) : (
                                <span style={{ ...S.pill, background: "#f5f5f2", color: "#888" }}>Draft</span>
                            )}
                        </span>

                        {/* Actions */}
                        <div style={{ flex: 2, display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
                            <Link href={ROUTES.COURSE(c.slug)} target="_blank"
                                style={{ ...S.btn, color: "#7eb8d8", borderColor: "#7eb8d844" }}>
                                Preview ↗
                            </Link>

                            {/* All courses — Edit/Publish/Feature. Static rows auto-migrate to DB on first action */}
                            {canEdit && (
                                <>
                                    <button style={S.btn} onClick={() => { setEditing(c); setShowForm(true); }}>
                                        Edit
                                    </button>
                                    <button style={{
                                        ...S.btn,
                                        color: c.isPublished ? "#888" : "#3a7c3a",
                                        borderColor: c.isPublished ? "#e8e8e4" : "#7ec87e44",
                                    }} onClick={() => togglePublish(c)}>
                                        {c.isPublished ? "Unpublish" : "Publish"}
                                    </button>
                                    <button style={{
                                        ...S.btn,
                                        color: c.isFeatured ? "#b89fd4" : "#888",
                                        borderColor: c.isFeatured ? "#b89fd444" : "#e8e8e4",
                                    }} onClick={() => toggleFeatured(c)}>
                                        {c.isFeatured ? "★ Featured" : "☆ Feature"}
                                    </button>
                                </>
                            )}

                            {/* Static courses — save to DB */}
                            {canEdit && c._static && (
                                <button style={{ ...S.btn, color: "#C9A96E", borderColor: "#C9A96E44" }}
                                    onClick={() => migrateToDb(c)}>
                                    Save to DB
                                </button>
                            )}

                            {/* Delete — superAdmin + DB courses only */}
                            {isSA && !c._static && (
                                <button style={{ ...S.btn, color: "#d49090", borderColor: "#d4909044" }}
                                    onClick={() => setDeleting(c)}>
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Delete confirm modal */}
            {deleting && (
                <div style={S.modalOverlay}>
                    <div style={S.modalBox}>
                        <h3 style={S.modalTitle}>Delete Course?</h3>
                        <p style={S.modalText}>
                            "{deleting.title}" will be permanently deleted including all enrollment and progress data.
                            This cannot be undone.
                        </p>
                        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
                            <button style={S.cancelBtn} onClick={() => setDeleting(null)}>Cancel</button>
                            <button style={S.deleteBtn} onClick={() => deleteCourse(deleting._id)}>Delete Forever</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Course form modal */}
            {showForm && (
                <CourseForm
                    course={editing}
                    onClose={() => { setShowForm(false); setEditing(null); }}
                    onSaved={() => {
                        setShowForm(false);
                        setEditing(null);
                        coursesQuery.refetch();
                        showToast(editing ? "Course updated ◉" : "Course created ◉");
                    }}
                    showToast={showToast}
                />
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   Course Form — create / edit
───────────────────────────────────────────────────────────── */
function CourseForm({ course, onClose, onSaved, showToast }) {
    const isNew = !course || course._static;
    const [saving, setSaving] = useState(false);
    const [tab, setTab] = useState("basic");  // basic | content | chapters | media

    const createCourseMutation = useCreateAdminCourseMutation();
    const updateCourseMutation = useUpdateAdminCourseMutation();

    const [form, setForm] = useState({
        title: course?.title || "",
        subtitle: course?.subtitle || "",
        slug: course?.slug || "",
        category: course?.category || "Growth",
        level: course?.level || "Beginner",
        tag: course?.tag || "",
        badge: course?.badge || "",
        accent: course?.accent || "#C9A96E",
        thumbnail: course?.thumbnail || "",
        heroThumb: course?.heroThumb || "",
        description: course?.description || "",
        duration: course?.duration || "",
        stat: course?.stat || "",
        statLabel: course?.statLabel || "",
        whatYouLearn: (course?.whatYouLearn || []).join("\n"),
        isFeatured: course?.isFeatured || false,
        isPublished: course?.isPublished || false,
    });

    // ── Chapters & lessons — the full course content, editable end-to-end.
    //    Static courses already carry chapters; DB list rows don't (the list
    //    endpoint strips them), so fetch the full course once when editing.
    const [chapters, setChapters] = useState(course?.chapters || []);
    const [chaptersLoading, setChLoading] = useState(false);
    const [openChapter, setOpenChapter] = useState(0);

    useEffect(() => {
        if (!course || course._static || course.chapters?.length) return;
        setChLoading(true);
        getAdminCourseAction(course._id)
            .then(d => setChapters(d?.data?.course?.chapters || []))
            .catch(() => showToast("Couldn't load chapters", false))
            .finally(() => setChLoading(false));
    }, []);

    // chapter helpers
    const updateChapter = (ci, key, val) =>
        setChapters(chs => chs.map((c, i) => i === ci ? { ...c, [key]: val } : c));
    const addChapter = () =>
        setChapters(chs => {
            const next = [...chs, {
                id: `ch${Date.now()}`, number: String(chs.length + 1).padStart(2, "0"),
                title: "", badge: "", duration: "", lessons: [],
            }];
            setOpenChapter(next.length - 1);
            return next;
        });
    const removeChapter = (ci) => {
        if (!confirm("Remove this chapter and all its lessons?")) return;
        setChapters(chs => chs.filter((_, i) => i !== ci));
    };
    const moveChapter = (ci, dir) =>
        setChapters(chs => {
            const j = ci + dir;
            if (j < 0 || j >= chs.length) return chs;
            const next = [...chs];
            [next[ci], next[j]] = [next[j], next[ci]];
            setOpenChapter(j);
            return next;
        });

    // lesson helpers
    const updateLesson = (ci, li, key, val) =>
        setChapters(chs => chs.map((c, i) => i !== ci ? c : {
            ...c, lessons: c.lessons.map((l, j) => j === li ? { ...l, [key]: val } : l),
        }));
    const addLesson = (ci) =>
        setChapters(chs => chs.map((c, i) => i !== ci ? c : {
            ...c, lessons: [...(c.lessons || []), {
                id: `${ci + 1}.${(c.lessons?.length || 0) + 1}-${Date.now()}`,
                title: "", type: "video", duration: "", thumb: "",
                description: "", takeaways: [], done: false,
            }],
        }));
    const removeLesson = (ci, li) =>
        setChapters(chs => chs.map((c, i) => i !== ci ? c : {
            ...c, lessons: c.lessons.filter((_, j) => j !== li),
        }));
    const moveLesson = (ci, li, dir) =>
        setChapters(chs => chs.map((c, i) => {
            if (i !== ci) return c;
            const j = li + dir;
            if (j < 0 || j >= c.lessons.length) return c;
            const next = [...c.lessons];
            [next[li], next[j]] = [next[j], next[li]];
            return { ...c, lessons: next };
        }));

    // section helpers — sections hold the actual lesson content
    const updateSection = (ci, li, si, key, val) =>
        setChapters(chs => chs.map((c, i) => i !== ci ? c : {
            ...c, lessons: c.lessons.map((l, j) => j !== li ? l : {
                ...l, sections: (l.sections || []).map((s, k) => k === si ? { ...s, [key]: val } : s),
            }),
        }));
    const addSection = (ci, li) =>
        setChapters(chs => chs.map((c, i) => i !== ci ? c : {
            ...c, lessons: c.lessons.map((l, j) => j !== li ? l : {
                ...l, sections: [...(l.sections || []), {
                    id: `s${(l.sections?.length || 0) + 1}-${Date.now()}`,
                    heading: "", image: "", body: "", keyPoints: [],
                }],
            }),
        }));
    const removeSection = (ci, li, si) =>
        setChapters(chs => chs.map((c, i) => i !== ci ? c : {
            ...c, lessons: c.lessons.map((l, j) => j !== li ? l : {
                ...l, sections: l.sections.filter((_, k) => k !== si),
            }),
        }));
    const moveSection = (ci, li, si, dir) =>
        setChapters(chs => chs.map((c, i) => {
            if (i !== ci) return c;
            return {
                ...c, lessons: c.lessons.map((l, j) => {
                    if (j !== li) return l;
                    const k = si + dir;
                    if (k < 0 || k >= (l.sections?.length || 0)) return l;
                    const next = [...l.sections];
                    [next[si], next[k]] = [next[k], next[si]];
                    return { ...l, sections: next };
                })
            };
        }));

    // Media picker — pickTarget says which field receives the chosen file's URL
    const [pickTarget, setPickTarget] = useState(null);
    const handleMediaPick = (m) => {
        const url = m?.url || "";
        if (!pickTarget || !url) { setPickTarget(null); return; }
        const t = pickTarget;
        if (t.kind === "form") set(t.field, url);
        if (t.kind === "lesson") updateLesson(t.ci, t.li, "thumb", url);
        if (t.kind === "section") updateSection(t.ci, t.li, t.si, "image", url);
        setPickTarget(null);
    };

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    // Auto-slug from title for new courses
    useEffect(() => {
        if (isNew && form.title && !form.slug) {
            set("slug", form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
        }
    }, [form.title]);

    const save = async () => {
        if (!form.title.trim()) { showToast("Title required", false); return; }
        if (!form.slug.trim()) { showToast("Slug required", false); return; }
        setSaving(true);
        try {
            const payload = {
                ...form,
                whatYouLearn: form.whatYouLearn.split("\n").map(s => s.trim()).filter(Boolean),
                chapters: chapters.map(c => ({
                    ...c,
                    lessons: (c.lessons || []).map(l => ({
                        ...l,
                        takeaways: (l.takeaways || []).map(s => (s || "").trim()).filter(Boolean),
                        sections: (l.sections || []).map(sec => ({
                            ...sec,
                            keyPoints: (sec.keyPoints || []).map(s => (s || "").trim()).filter(Boolean),
                        })),
                    })),
                })),
            };
            if (isNew) {
                await createCourseMutation.createCourse(payload);
            } else {
                await updateCourseMutation.updateCourse({ id: course._id, form: payload });
            }
            onSaved();
        } catch (e) {
            showToast(e.message || "Save failed", false);
        }
        setSaving(false);
    };

    const TABS = ["basic", "content", "chapters", "media"];
    const totalLessonCount = chapters.reduce((a, c) => a + (c.lessons?.length || 0), 0);

    return (
        <div style={S.modalOverlay}>
            <div style={{ ...S.modalBox, maxWidth: 720, maxHeight: "92vh", overflowY: "auto", padding: 0 }}>
                {/* Form header */}
                <div style={{ padding: "20px 24px 0", borderBottom: "1px solid #ededea" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <h3 style={S.modalTitle}>{isNew ? "New Course" : `Edit — ${course.title}`}</h3>
                        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#aaa" }}>✕</button>
                    </div>
                    <div style={{ display: "flex", gap: 0 }}>
                        {TABS.map(t => (
                            <button key={t} onClick={() => setTab(t)} style={{
                                fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase",
                                padding: "8px 16px", border: "none", background: "transparent",
                                cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
                                color: tab === t ? "#1a1208" : "#aaa",
                                borderBottom: tab === t ? "2px solid #C9A96E" : "2px solid transparent",
                                fontWeight: tab === t ? 500 : 400,
                            }}>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ padding: "20px 24px" }}>
                    {/* ── BASIC TAB */}
                    {tab === "basic" && (
                        <div style={S.formGrid}>
                            <div style={{ gridColumn: "1/-1" }}>
                                <label style={S.label}>Course Title *</label>
                                <input style={S.input} value={form.title}
                                    onChange={e => set("title", e.target.value)}
                                    placeholder="e.g. Creator Foundations" />
                            </div>

                            <div style={{ gridColumn: "1/-1" }}>
                                <label style={S.label}>Subtitle</label>
                                <input style={S.input} value={form.subtitle}
                                    onChange={e => set("subtitle", e.target.value)}
                                    placeholder="Short tagline shown under title…" />
                            </div>

                            <div>
                                <label style={S.label}>Slug * <span style={S.labelNote}>(URL path — auto-generated)</span></label>
                                <input style={S.input} value={form.slug}
                                    onChange={e => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                                    placeholder="creator-foundations" />
                            </div>

                            <div>
                                <label style={S.label}>Accent Color</label>
                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <input type="color" value={form.accent}
                                        onChange={e => set("accent", e.target.value)}
                                        style={{ width: 40, height: 36, border: "1.5px solid #e8e8e4", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                                    <input style={{ ...S.input, flex: 1 }} value={form.accent}
                                        onChange={e => set("accent", e.target.value)}
                                        placeholder="#C9A96E" />
                                </div>
                            </div>

                            <div>
                                <label style={S.label}>Category</label>
                                <select style={S.select2} value={form.category}
                                    onChange={e => set("category", e.target.value)}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={S.label}>Level</label>
                                <select style={S.select2} value={form.level}
                                    onChange={e => set("level", e.target.value)}>
                                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={S.label}>Tag <span style={S.labelNote}>(pill on card)</span></label>
                                <input style={S.input} value={form.tag}
                                    onChange={e => set("tag", e.target.value)}
                                    placeholder="e.g. Mandatory, Template, Masterclass" />
                            </div>

                            <div>
                                <label style={S.label}>Badge</label>
                                <input style={S.input} value={form.badge}
                                    onChange={e => set("badge", e.target.value)}
                                    placeholder="e.g. All Creators, Intermediate" />
                            </div>

                            <div>
                                <label style={S.label}>Duration</label>
                                <input style={S.input} value={form.duration}
                                    onChange={e => set("duration", e.target.value)}
                                    placeholder="e.g. 107 min" />
                            </div>

                            <div>
                                <label style={S.label}>Stat + Label <span style={S.labelNote}>(shown on card overlay)</span></label>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <input style={{ ...S.input, width: 80 }} value={form.stat}
                                        onChange={e => set("stat", e.target.value)} placeholder="10×" />
                                    <input style={{ ...S.input, flex: 1 }} value={form.statLabel}
                                        onChange={e => set("statLabel", e.target.value)} placeholder="reach" />
                                </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <input type="checkbox" id="chk-pub" checked={form.isPublished}
                                    onChange={e => set("isPublished", e.target.checked)}
                                    style={{ width: 14, height: 14, cursor: "pointer" }} />
                                <label htmlFor="chk-pub" style={{ fontSize: 12, color: "#555", cursor: "pointer" }}>
                                    Publish immediately after save
                                </label>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <input type="checkbox" id="chk-feat" checked={form.isFeatured}
                                    onChange={e => set("isFeatured", e.target.checked)}
                                    style={{ width: 14, height: 14, cursor: "pointer" }} />
                                <label htmlFor="chk-feat" style={{ fontSize: 12, color: "#555", cursor: "pointer" }}>
                                    Mark as Featured (shown in hero)
                                </label>
                            </div>
                        </div>
                    )}

                    {/* ── CONTENT TAB */}
                    {tab === "content" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                                <label style={S.label}>Description</label>
                                <textarea style={{ ...S.input, resize: "vertical" }} rows={4}
                                    value={form.description}
                                    onChange={e => set("description", e.target.value)}
                                    placeholder="Full course description shown on course page…" />
                            </div>
                            <div>
                                <label style={S.label}>
                                    What You'll Learn{" "}
                                    <span style={S.labelNote}>(one item per line — shows as checklist)</span>
                                </label>
                                <textarea style={{ ...S.input, resize: "vertical", fontFamily: "monospace", fontSize: 12 }} rows={8}
                                    value={form.whatYouLearn}
                                    onChange={e => set("whatYouLearn", e.target.value)}
                                    placeholder={"Define your creator identity and long-term positioning\nUnderstand the psychology of audience retention\nMaster platform-specific algorithm mechanics"} />
                                <span style={{ fontSize: 10, color: "#bbb", marginTop: 4, display: "block" }}>
                                    {form.whatYouLearn.split("\n").filter(Boolean).length} items
                                </span>
                            </div>
                        </div>
                    )}

                    {/* ── CHAPTERS TAB — full end-to-end content editing */}
                    {tab === "chapters" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {chaptersLoading ? (
                                <p style={{ fontSize: 13, color: "#aaa", padding: "20px 0", textAlign: "center" }}>
                                    <span style={{ color: "#C9A96E" }}>◈</span> Loading chapters…
                                </p>
                            ) : (
                                <>
                                    <p style={{ fontSize: 11, color: "#aaa" }}>
                                        {chapters.length} chapters · {totalLessonCount} lessons — this is exactly what learners
                                        see on the Resources page. Changes apply on Save.
                                    </p>

                                    {chapters.map((ch, ci) => (
                                        <div key={ch.id || ci} style={{ border: "1.5px solid #ededea", borderRadius: 10, overflow: "hidden" }}>
                                            {/* chapter header */}
                                            <div style={{
                                                display: "flex", alignItems: "center", gap: 8, padding: "10px 12px",
                                                background: "#fafaf8", cursor: "pointer"
                                            }}
                                                onClick={() => setOpenChapter(openChapter === ci ? -1 : ci)}>
                                                <span style={{ fontSize: 11, color: "#C9A96E", fontWeight: 600, flexShrink: 0 }}>
                                                    {ch.number || String(ci + 1).padStart(2, "0")}
                                                </span>
                                                <span style={{
                                                    flex: 1, fontSize: 13, color: ch.title ? "#1a1208" : "#bbb",
                                                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                                                }}>
                                                    {ch.title || "Untitled chapter"}
                                                </span>
                                                <span style={{ fontSize: 10, color: "#bbb", flexShrink: 0 }}>{ch.lessons?.length || 0} lessons</span>
                                                <button onClick={e => { e.stopPropagation(); moveChapter(ci, -1); }} style={S.miniBtn} title="Move up">↑</button>
                                                <button onClick={e => { e.stopPropagation(); moveChapter(ci, 1); }} style={S.miniBtn} title="Move down">↓</button>
                                                <button onClick={e => { e.stopPropagation(); removeChapter(ci); }} style={{ ...S.miniBtn, color: "#d49090" }} title="Delete chapter">✕</button>
                                                <span style={{ fontSize: 10, color: "#bbb" }}>{openChapter === ci ? "▾" : "▸"}</span>
                                            </div>

                                            {/* chapter body */}
                                            {openChapter === ci && (
                                                <div style={{ padding: "12px 12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
                                                    <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 130px 100px", gap: 8 }}>
                                                        <input style={S.input} value={ch.number || ""} placeholder="01"
                                                            onChange={e => updateChapter(ci, "number", e.target.value)} />
                                                        <input style={S.input} value={ch.title || ""} placeholder="Chapter title…"
                                                            onChange={e => updateChapter(ci, "title", e.target.value)} />
                                                        <input style={S.input} value={ch.badge || ""} placeholder="Badge"
                                                            onChange={e => updateChapter(ci, "badge", e.target.value)} />
                                                        <input style={S.input} value={ch.duration || ""} placeholder="45 min"
                                                            onChange={e => updateChapter(ci, "duration", e.target.value)} />
                                                    </div>

                                                    {/* lessons */}
                                                    {(ch.lessons || []).map((l, li) => (
                                                        <div key={l.id || li} style={{
                                                            border: "1px dashed #e2e2de", borderRadius: 8,
                                                            padding: "10px 10px 12px", background: "#fff"
                                                        }}>
                                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 80px auto auto auto", gap: 6, marginBottom: 6 }}>
                                                                <input style={S.input} value={l.title || ""} placeholder={`Lesson ${li + 1} title…`}
                                                                    onChange={e => updateLesson(ci, li, "title", e.target.value)} />
                                                                <select style={S.select2} value={l.type || "video"}
                                                                    onChange={e => updateLesson(ci, li, "type", e.target.value)}>
                                                                    <option value="video">Video</option>
                                                                    <option value="image">Image</option>
                                                                    <option value="text">Text</option>
                                                                </select>
                                                                <input style={S.input} value={l.duration || ""} placeholder="8 min"
                                                                    onChange={e => updateLesson(ci, li, "duration", e.target.value)} />
                                                                <button onClick={() => moveLesson(ci, li, -1)} style={S.miniBtn} title="Move up">↑</button>
                                                                <button onClick={() => moveLesson(ci, li, 1)} style={S.miniBtn} title="Move down">↓</button>
                                                                <button onClick={() => removeLesson(ci, li)} style={{ ...S.miniBtn, color: "#d49090" }} title="Remove lesson">✕</button>
                                                            </div>
                                                            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 6, marginBottom: 6 }}>
                                                                <input style={S.input} value={l.thumb || ""}
                                                                    placeholder="Thumbnail URL (optional)…"
                                                                    onChange={e => updateLesson(ci, li, "thumb", e.target.value)} />
                                                                <button style={S.miniBtn} title="Pick from Media Center"
                                                                    onClick={() => setPickTarget({ kind: "lesson", ci, li })}>◉ Media</button>
                                                            </div>
                                                            <textarea style={{ ...S.input, resize: "vertical", marginBottom: 8 }} rows={2}
                                                                value={l.intro || ""}
                                                                placeholder="Lesson intro — opening paragraph shown in the reader…"
                                                                onChange={e => updateLesson(ci, li, "intro", e.target.value)} />

                                                            {/* sections — the full lesson content */}
                                                            {(l.sections || []).map((sec, si) => (
                                                                <div key={sec.id || si} style={{
                                                                    border: "1px solid #eee", borderRadius: 6,
                                                                    padding: "8px 8px 10px", marginBottom: 6, background: "#fbfbf9"
                                                                }}>
                                                                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 6, marginBottom: 6 }}>
                                                                        <input style={S.input} value={sec.heading || ""} placeholder={`Section ${si + 1} heading…`}
                                                                            onChange={e => updateSection(ci, li, si, "heading", e.target.value)} />
                                                                        <button onClick={() => moveSection(ci, li, si, -1)} style={S.miniBtn} title="Move up">↑</button>
                                                                        <button onClick={() => moveSection(ci, li, si, 1)} style={S.miniBtn} title="Move down">↓</button>
                                                                        <button onClick={() => removeSection(ci, li, si)} style={{ ...S.miniBtn, color: "#d49090" }} title="Remove section">✕</button>
                                                                    </div>
                                                                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 6, marginBottom: 6 }}>
                                                                        <input style={S.input} value={sec.image || ""} placeholder="Section image URL (optional)…"
                                                                            onChange={e => updateSection(ci, li, si, "image", e.target.value)} />
                                                                        <button style={S.miniBtn} title="Pick from Media Center"
                                                                            onClick={() => setPickTarget({ kind: "section", ci, li, si })}>◉ Media</button>
                                                                    </div>
                                                                    <textarea style={{ ...S.input, resize: "vertical", marginBottom: 6 }} rows={4}
                                                                        value={sec.body || ""}
                                                                        placeholder="Section body — the main lesson text. Blank line = new paragraph…"
                                                                        onChange={e => updateSection(ci, li, si, "body", e.target.value)} />
                                                                    <textarea style={{ ...S.input, resize: "vertical", fontFamily: "monospace", fontSize: 11 }} rows={3}
                                                                        value={(sec.keyPoints || []).join("\n")}
                                                                        placeholder={"Key points — one per line"}
                                                                        onChange={e => updateSection(ci, li, si, "keyPoints", e.target.value.split("\n"))} />
                                                                </div>
                                                            ))}
                                                            <button onClick={() => addSection(ci, li)} style={S.addDashedBtn}>+ Add Section</button>
                                                        </div>
                                                    ))}

                                                    <button onClick={() => addLesson(ci)} style={S.addDashedBtn}>+ Add Lesson</button>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <button onClick={addChapter} style={{ ...S.addDashedBtn, padding: "10px" }}>+ Add Chapter</button>
                                </>
                            )}
                        </div>
                    )}

                    {/* ── MEDIA TAB */}
                    {tab === "media" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                                <label style={S.label}>Thumbnail URL <span style={S.labelNote}>(used on course cards)</span></label>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 6 }}>
                                    <input style={S.input} value={form.thumbnail}
                                        onChange={e => set("thumbnail", e.target.value)}
                                        placeholder="https://images.unsplash.com/…?w=900&q=90" />
                                    <button style={S.miniBtn} onClick={() => setPickTarget({ kind: "form", field: "thumbnail" })}>◉ Media</button>
                                </div>
                                {form.thumbnail && (
                                    <img src={form.thumbnail} alt="" style={{
                                        width: "100%", height: 100, objectFit: "cover",
                                        borderRadius: 6, marginTop: 8, border: "1px solid #ededea"
                                    }} />
                                )}
                            </div>
                            <div>
                                <label style={S.label}>Hero Thumbnail URL <span style={S.labelNote}>(larger — for hero banner on resources page)</span></label>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 6 }}>
                                    <input style={S.input} value={form.heroThumb}
                                        onChange={e => set("heroThumb", e.target.value)}
                                        placeholder="https://images.unsplash.com/…?w=1400&q=90" />
                                    <button style={S.miniBtn} onClick={() => setPickTarget({ kind: "form", field: "heroThumb" })}>◉ Media</button>
                                </div>
                                {form.heroThumb && (
                                    <img src={form.heroThumb} alt="" style={{
                                        width: "100%", height: 80, objectFit: "cover",
                                        borderRadius: 6, marginTop: 8, border: "1px solid #ededea"
                                    }} />
                                )}
                            </div>
                            <div>
                                <p style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6 }}>
                                    ◈ Edit chapters and lessons in the <strong>Chapters</strong> tab — full course
                                    content is editable end to end and goes live on the Resources page when published.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: "14px 24px", borderTop: "1px solid #ededea",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "#fafaf8"
                }}>
                    <span style={{ fontSize: 11, color: "#bbb" }}>
                        {isNew ? "New course — will be saved as Draft unless publish is checked" : "Changes auto-save to database"}
                    </span>
                    <div style={{ display: "flex", gap: 10 }}>
                        <button style={S.cancelBtn} onClick={onClose}>Cancel</button>
                        <button
                            style={{ ...S.saveFormBtn, opacity: saving ? 0.7 : 1 }}
                            onClick={save}
                            disabled={saving}>
                            {saving ? "Saving…" : isNew ? "Create Course" : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Media Center picker — fills whichever field opened it */}
            {pickTarget && (
                <MediaPicker
                    onSelect={handleMediaPick}
                    onClose={() => setPickTarget(null)}
                />
            )}
        </div>
    );
}

/* ─── Styles ──────────────────────────────────────────────── */
const S = {
    page: { padding: "32px 40px", maxWidth: 1300, margin: "0 auto", fontFamily: "'DM Sans',sans-serif" },
    toast: { position: "fixed", top: 20, right: 20, zIndex: 9999, padding: "12px 20px", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,.15)" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
    heading: { fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 400, color: "#1a1208", marginBottom: 4 },
    sub: { fontSize: 13, color: "#aaa" },
    newBtn: { fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", padding: "10px 20px", background: "#1a1208", color: "#F0E8D6", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, flexShrink: 0 },
    migrateBtn: { fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", padding: "10px 20px", background: "#C9A96E18", color: "#C9A96E", border: "1.5px solid #C9A96E44", borderRadius: 6, cursor: "pointer", fontWeight: 500, flexShrink: 0 },
    infoBanner: { background: "#C9A96E0a", border: "1px solid #C9A96E33", borderRadius: 8, padding: "10px 16px", fontSize: 12, color: "#7a5a1a", marginBottom: 16, lineHeight: 1.6 },
    filters: { display: "flex", gap: 10, marginBottom: 16, alignItems: "center" },
    search: { fontSize: 12, padding: "8px 14px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", width: 240, fontFamily: "'DM Sans',sans-serif" },
    select: { fontSize: 12, padding: "8px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", background: "#fff", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" },
    table: { background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, overflow: "hidden" },
    thead: { display: "flex", alignItems: "center", padding: "10px 16px", background: "#fafaf8", borderBottom: "1px solid #ededea", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#aaa", gap: 12 },
    trow: { display: "flex", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid #f5f5f2", gap: 12, transition: "background .1s" },
    empty: { padding: "40px 0", textAlign: "center", fontSize: 13, color: "#bbb" },
    courseTitle: { display: "block", fontSize: 13, fontWeight: 400, color: "#1a1208", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
    courseSub: { display: "block", fontSize: 10, color: "#bbb", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
    pill: { fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 3, fontWeight: 600 },
    btn: { fontSize: 10, padding: "4px 10px", border: "1.5px solid #e8e8e4", borderRadius: 5, background: "#fff", cursor: "pointer", color: "#555", textDecoration: "none", letterSpacing: ".03em", whiteSpace: "nowrap", fontFamily: "'DM Sans',sans-serif" },
    // Modal
    modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
    modalBox: { background: "#fff", borderRadius: 12, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
    modalTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400, color: "#1a1208" },
    modalText: { fontSize: 13, color: "#666", lineHeight: 1.6, marginTop: 8 },
    cancelBtn: { fontSize: 12, padding: "9px 18px", border: "1.5px solid #e8e8e4", borderRadius: 6, background: "#fff", cursor: "pointer", color: "#555" },
    deleteBtn: { fontSize: 12, padding: "9px 18px", border: "none", borderRadius: 6, background: "#d49090", cursor: "pointer", color: "#fff", fontWeight: 500 },
    saveFormBtn: { fontSize: 12, padding: "9px 20px", border: "none", borderRadius: 6, background: "#1a1208", cursor: "pointer", color: "#F0E8D6", fontWeight: 500, transition: "opacity .2s" },
    // Form
    formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
    label: { display: "block", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#aaa", marginBottom: 6, fontWeight: 500 },
    labelNote: { color: "#bbb", fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 9 },
    input: { width: "100%", fontSize: 13, padding: "9px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", fontFamily: "'DM Sans',sans-serif" },
    miniBtn: { fontSize: 11, padding: "3px 8px", border: "1.5px solid #e8e8e4", borderRadius: 5, background: "#fff", cursor: "pointer", color: "#888", flexShrink: 0, fontFamily: "'DM Sans',sans-serif" },
    addDashedBtn: { fontSize: 11, letterSpacing: ".06em", padding: "8px 14px", border: "1.5px dashed #ddd", borderRadius: 6, background: "transparent", color: "#aaa", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" },
    select2: { width: "100%", fontSize: 13, padding: "9px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", background: "#fff", fontFamily: "'DM Sans',sans-serif", cursor: "pointer" },
};