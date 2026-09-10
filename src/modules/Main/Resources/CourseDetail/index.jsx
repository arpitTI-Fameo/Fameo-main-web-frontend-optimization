"use client";
// modules/Resources/CourseDetail/index.jsx
// Editorial course + lesson experience for /resources/courses/[courseSlug]

import { useState, useEffect, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { getCourseBySlug } from "@/constants/courses";

import CourseOverview from './CourseOverview';
import LessonView from './LessonView';
import { normalizeCourse } from './helpers';
import { CSS } from './styles';

export default function CourseDetail({ params }) {
  const { courseSlug } = use(params);
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessonId, setLessonId] = useState(null);   // null = overview

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let resolved = null;
      const stat = getCourseBySlug(courseSlug);
      try {
        const res = await fetch(`${API_BASE}/api/courses/${courseSlug}`);
        const data = await res.json();
        const db = data?.data?.course;
        if (db?.chapters?.length) resolved = normalizeCourse(db, stat || {});
      } catch { /* API unreachable */ }
      if (!resolved && stat) {
        resolved = normalizeCourse(stat);
      }
      if (!cancelled) { setCourse(resolved); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [courseSlug, API_BASE]);

  /* hide the site nav for this immersive route */
  useEffect(() => {
    document.body.classList.add("cx-open");
    return () => document.body.classList.remove("cx-open");
  }, []);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [lessonId]);

  const allLessons = useMemo(
    () => (course?.chapters || []).flatMap(ch =>
      (ch.lessons || []).map(l => ({ ...l, chapter: ch }))
    ), [course]
  );

  if (loading) {
    return (<><style>{CSS}</style><div className="cx-state"><p>◈ Loading course…</p></div></>);
  }
  if (!course || !allLessons.length) {
    return (
      <><style>{CSS}</style>
        <div className="cx-state">
          <p>Course not found or not yet published.</p>
          <button onClick={() => router.push("/resources")}>← Back to Learning Center</button>
        </div></>
    );
  }

  const lesson = lessonId ? allLessons.find(l => l.id === lessonId) : null;

  return (
    <>
      <style>{CSS}</style>
      {lesson ? (
        <LessonView
          course={course}
          lesson={lesson}
          allLessons={allLessons}
          onNav={setLessonId}
          onBackToCourse={() => setLessonId(null)}
          onHome={() => router.push("/resources")}
        />
      ) : (
        <CourseOverview
          course={course}
          allLessons={allLessons}
          onOpenLesson={setLessonId}
          onHome={() => router.push("/resources")}
        />
      )}
    </>
  );
}
