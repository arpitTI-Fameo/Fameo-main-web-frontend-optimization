// modules/Resources/helpers.js

/* ─────────────────────────────────────────────────────────────
   Normalise a DB / static course into the shape the UI expects
───────────────────────────────────────────────────────────── */
export function normalizeCourse(c) {
  return {
    ...c,
    id: c.courseId || c._id || c.slug,
    description: c.description || c.subtitle || "",
    subtitle: c.subtitle || "",
    category: c.category || "Growth",
    accent: c.accent || "#C9A96E",
    thumbnail: c.thumbnail || c.heroThumb || "",
    heroThumb: c.heroThumb || c.thumbnail || "",
    tag: c.tag || c.level || "",
    badge: c.badge || "",
    stat: c.stat || "",
    statLabel: c.statLabel || "",
    level: c.level || "",
    chapters: Array.isArray(c.chapters) ? c.chapters : [],
  };
}
