
// src/modules/resources/resource.service.js
// Fameo Resources — Service Layer (ES Module)

import { Course, Enrollment, Note } from "./resource.model.js";
import { ApiError }                  from "../../utils/ApiResponse.js";
import redis                         from "../../config/redis.js";

const CACHE_TTL  = 300;  // 5 min
const LIST_CACHE = "resources:courses:list";

/* ─── Redis helpers ───────────────────────────────────────── */
async function getCached(key) {
  try { const v = await redis.get(key); return v ? JSON.parse(v) : null; }
  catch { return null; }
}
async function setCache(key, value, ttl = CACHE_TTL) {
  try { await redis.setEx(key, ttl, JSON.stringify(value)); } catch {}
}
async function delCache(pattern) {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length) await redis.del(keys);
  } catch {}
}

/* ══════════════════════════════════════════════════
   PUBLIC — no auth needed
══════════════════════════════════════════════════ */

export async function listCourses({
  category, search, sortBy = "enrolledCount", limit = 20, page = 1,
}) {
  const cacheKey = `${LIST_CACHE}:${category}:${search}:${sortBy}:${limit}:${page}`;
  const cached   = await getCached(cacheKey);
  if (cached) return cached;

  const filter = { isPublished: true };
  if (category && category !== "All") filter.category = category;
  if (search) filter.$text = { $search: search };

  const sortMap = {
    enrolledCount: { enrolledCount: -1 },
    rating:        { rating: -1 },
    newest:        { createdAt: -1 },
    lessons:       { totalLessons: 1 },
  };

  const [courses, total] = await Promise.all([
    Course.find(filter)
      .select("-chapters.lessons.videoUrl") // never expose video URLs in list
      .sort(sortMap[sortBy] || { enrolledCount: -1 })
      .skip((page - 1) * limit)
      .limit(+limit)
      .lean(),
    Course.countDocuments(filter),
  ]);

  const result = { courses, total, page: +page, pages: Math.ceil(total / limit) };
  await setCache(cacheKey, result);
  return result;
}

export async function getCourseBySlug(slug, userId = null) {
  const cacheKey = `resources:course:${slug}`;
  let course = await getCached(cacheKey);

  if (!course) {
    course = await Course.findOne({ slug, isPublished: true }).lean();
    if (!course) throw new ApiError(404, "Course not found");
    await setCache(cacheKey, course, 600);
  }

  // Check enrollment
  let enrollment = null;
  if (userId) {
    enrollment = await Enrollment.findOne({ userId, courseId: course._id }).lean();
  }

  // Strip videoUrls for unenrolled users — only isFree lessons pass through
  if (!enrollment) {
    course = {
      ...course,
      chapters: course.chapters.map(ch => ({
        ...ch,
        lessons: ch.lessons.map(l => ({
          ...l,
          videoUrl: l.isFree ? l.videoUrl : null,
        })),
      })),
    };
  }

  return { course, enrollment };
}

/* ══════════════════════════════════════════════════
   ENROLLMENT
══════════════════════════════════════════════════ */

export async function enrollCourse(userId, courseSlug) {
  const course = await Course.findOne({ slug: courseSlug, isPublished: true });
  if (!course) throw new ApiError(404, "Course not found");

  const existing = await Enrollment.findOne({ userId, courseId: course._id });
  if (existing) return existing; // already enrolled — idempotent

  const enrollment = await Enrollment.create({
    userId,
    courseId:   course._id,
    courseSlug: course.slug,
  });

  // Increment counter
  await Course.findByIdAndUpdate(course._id, { $inc: { enrolledCount: 1 } });
  return enrollment;
}

export async function updateProgress(userId, courseSlug, lessonId) {
  const course = await Course.findOne({ slug: courseSlug }).lean();
  if (!course) throw new ApiError(404, "Course not found");

  const enrollment = await Enrollment.findOne({ userId, courseId: course._id });
  if (!enrollment) throw new ApiError(403, "Not enrolled in this course");

  if (!enrollment.completedLessons.includes(lessonId)) {
    enrollment.completedLessons.push(lessonId);
  }

  const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
  enrollment.progressPct  = Math.round((enrollment.completedLessons.length / totalLessons) * 100);
  enrollment.lastLessonId = lessonId;

  if (enrollment.progressPct >= 100) {
    enrollment.isCompleted = true;
    enrollment.completedAt = new Date();
  }

  await enrollment.save();
  return enrollment;
}

export async function reviewCourse(userId, courseSlug, rating, reviewText) {
  if (rating < 1 || rating > 5) throw new ApiError(400, "Rating must be 1–5");

  const course = await Course.findOne({ slug: courseSlug });
  if (!course) throw new ApiError(404, "Course not found");

  const enrollment = await Enrollment.findOne({ userId, courseId: course._id });
  if (!enrollment)          throw new ApiError(403, "Not enrolled");
  if (!enrollment.isCompleted) throw new ApiError(400, "Complete the course before reviewing");

  enrollment.rating     = rating;
  enrollment.review     = reviewText;
  enrollment.reviewedAt = new Date();
  await enrollment.save();

  // Recalculate aggregate rating
  const all = await Enrollment.find({
    courseId: course._id,
    rating:   { $exists: true, $ne: null },
  }).select("rating").lean();

  const avg = all.reduce((s, e) => s + e.rating, 0) / all.length;
  await Course.findByIdAndUpdate(course._id, {
    rating:      Math.round(avg * 10) / 10,
    reviewCount: all.length,
  });

  return enrollment;
}

export async function getMyCourses(userId) {
  return Enrollment.find({ userId })
    .populate("courseId", "title slug thumbnail category accent rating totalLessons level")
    .sort({ updatedAt: -1 })
    .lean();
}

/* ══════════════════════════════════════════════════
   NOTES
══════════════════════════════════════════════════ */

export async function getNotes(userId, courseSlug, lessonId = null) {
  const course = await Course.findOne({ slug: courseSlug }).lean();
  if (!course) throw new ApiError(404, "Course not found");
  const filter = { userId, courseId: course._id };
  if (lessonId) filter.lessonId = lessonId;
  return Note.find(filter).sort({ createdAt: -1 }).lean();
}

export async function addNote(userId, courseSlug, lessonId, text) {
  const course = await Course.findOne({ slug: courseSlug }).lean();
  if (!course) throw new ApiError(404, "Course not found");

  const enrollment = await Enrollment.findOne({ userId, courseId: course._id });
  if (!enrollment) throw new ApiError(403, "Not enrolled");

  return Note.create({ userId, courseId: course._id, lessonId, text });
}

export async function deleteNote(userId, noteId) {
  const note = await Note.findOne({ _id: noteId, userId });
  if (!note) throw new ApiError(404, "Note not found");
  await note.deleteOne();
}

/* ══════════════════════════════════════════════════
   ADMIN — course management
══════════════════════════════════════════════════ */

export async function adminListCourses({ status, category, search, limit = 50, page = 1 } = {}) {
  const filter = {};
  if (status && status !== "all") filter.isPublished = status === "published";
  if (category && category !== "All") filter.category = category;
  if (search) filter.$text = { $search: search };

  const [courses, total] = await Promise.all([
    Course.find(filter)
      .select("title slug category isPublished isFeatured enrolledCount rating totalLessons createdAt updatedAt level tag")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(+limit)
      .lean(),
    Course.countDocuments(filter),
  ]);
  return { courses, total };
}

export async function adminGetStats() {
  const [totalCourses, publishedCourses, totalEnrollments, completedEnrollments] = await Promise.all([
    Course.countDocuments(),
    Course.countDocuments({ isPublished: true }),
    Enrollment.countDocuments(),
    Enrollment.countDocuments({ isCompleted: true }),
  ]);

  const topCourses = await Course.find({ isPublished: true })
    .sort({ enrolledCount: -1 })
    .limit(5)
    .select("title slug enrolledCount rating category")
    .lean();

  return {
    totalCourses,
    publishedCourses,
    draftCourses:        totalCourses - publishedCourses,
    totalEnrollments,
    completedEnrollments,
    completionRate: totalEnrollments
      ? Math.round((completedEnrollments / totalEnrollments) * 100)
      : 0,
    topCourses,
  };
}

export async function adminCreateCourse(data, adminId) {
  const existing = await Course.findOne({ slug: data.slug });
  if (existing) throw new ApiError(409, "Slug already exists");
  const course = await Course.create({ ...data, createdBy: adminId, updatedBy: adminId });
  await delCache("resources:courses:list*");
  return course;
}

export async function adminUpdateCourse(courseId, data, adminId) {
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");
  Object.assign(course, { ...data, updatedBy: adminId, updatedAt: new Date() });
  await course.save();
  await delCache(`resources:course:${course.slug}`);
  await delCache("resources:courses:list*");
  return course;
}

export async function adminDeleteCourse(courseId) {
  const course = await Course.findByIdAndDelete(courseId);
  if (!course) throw new ApiError(404, "Course not found");
  await delCache(`resources:course:${course.slug}`);
  await delCache("resources:courses:list*");
  return { message: "Deleted" };
}

export async function adminTogglePublish(courseId, adminId) {
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");
  course.isPublished = !course.isPublished;
  course.updatedBy   = adminId;
  await course.save();
  await delCache(`resources:course:${course.slug}`);
  await delCache("resources:courses:list*");
  return course;
}

export async function adminUpsertLesson(courseId, chapterId, lessonData, adminId) {
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  const chapter = course.chapters.find(c => c.id === chapterId || c._id?.toString() === chapterId);
  if (!chapter) throw new ApiError(404, "Chapter not found");

  const idx = chapter.lessons.findIndex(l => l.id === lessonData.id);
  if (idx >= 0) Object.assign(chapter.lessons[idx], lessonData);
  else chapter.lessons.push(lessonData);

  course.updatedBy = adminId;
  await course.save();
  await delCache(`resources:course:${course.slug}`);
  return course;
}