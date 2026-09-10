// modules/Resources/CourseDetail/helpers.js

/* ─────────────────────────────────────────────────────────────
   Normalise a DB / static course into the shape the UI expects
───────────────────────────────────────────────────────────── */
export function normalizeCourse(c, fallback = {}) {
  const heroThumb =
    c.heroThumb || c.thumbnail || fallback.heroThumb || fallback.thumbnail || "";
  const thumbnail =
    c.thumbnail || c.heroThumb || fallback.thumbnail || fallback.heroThumb || "";

  // Margin notes live in the local constants. When the course comes from the
  // API (which wins here), its sections may be missing `notes` — e.g. the DB
  // was seeded before notes existed. Overlay the local notes, matched by
  // chapter/lesson/section id, so the gutter renders regardless of DB state.
  const noteIndex = {};
  for (const ch of (fallback.chapters || [])) {
    for (const l of (ch.lessons || [])) {
      for (const s of (l.sections || [])) {
        if (Array.isArray(s.notes) && s.notes.length) {
          noteIndex[`${ch.id}|${l.id}|${s.id}`] = s.notes;
        }
      }
    }
  }
  const chapters = (Array.isArray(c.chapters) ? c.chapters : []).map(ch => ({
    ...ch,
    lessons: (ch.lessons || []).map(l => ({
      ...l,
      sections: (l.sections || []).map(s => {
        if (Array.isArray(s.notes) && s.notes.length) return s;
        const fromLocal = noteIndex[`${ch.id}|${l.id}|${s.id}`];
        return fromLocal ? { ...s, notes: fromLocal } : s;
      }),
    })),
  }));

  return {
    ...c,
    id: c.courseId || c._id || c.slug,
    description: c.description || c.subtitle || fallback.description || "",
    subtitle: c.subtitle || fallback.subtitle || "",
    category: c.category || fallback.category || "Growth",
    accent: c.accent || fallback.accent || "#d6367f",
    thumbnail,
    heroThumb,
    tag: c.tag || c.level || fallback.tag || "",
    level: c.level || fallback.level || "Beginner",
    whatYouLearn: Array.isArray(c.whatYouLearn) && c.whatYouLearn.length
      ? c.whatYouLearn
      : (fallback.whatYouLearn || []),
    chapters,
  };
}

/* Split a section body into paragraphs; the first gets the drop cap. */
export const toParagraphs = (body = "") =>
  String(body).split(/\n{2,}|\n/).map(s => s.trim()).filter(Boolean);
