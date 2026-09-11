"use client";
// modules/Resources/ResourcesContainer/index.jsx

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { COURSES } from "@/constants/courses";
import { useCourses } from '@/lib/hooks/main/useResource';

import ResourcesHero from "../ResourcesHero";
import MembershipPerks from "../MembershipPerks";
import StatementReveal from "../StatementReveal";
import CourseShowcase from "../CourseShowcase";
import CourseBrowse from "../CourseBrowse";
import CommunityFan from "../CommunityFan";
import MembershipPricing from "../MembershipPricing";
import ResourcesFaq from "../ResourcesFaq";
import ResourcesCta from "../ResourcesCta";
import { normalizeCourse } from "../helpers";
import { CSS } from "../styles";

export default function ResourcesContainer() {
  const router = useRouter();

  const [courses, setCourses] = useState(COURSES);
  const [activeCat, setActiveCat] = useState("All");
  const [goalCat, setGoalCat] = useState(null);
  const [showIdx, setShowIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  const stRef = useRef(null);
  const showTrackRef = useRef(null);
  const loopRef = useRef(null);
  const browseRef = useRef(null);
  const showPaused = useRef(false);
  const loopPaused = useRef(false);

  /* Live content: published DB courses override the static seed by slug */
  const { data } = useCourses({ limit: 100 });
  useEffect(() => {
    const dbCourses = Array.isArray(data) ? data : data?.data?.courses || [];
    if (!dbCourses.length) return;
    const dbBySlug = new Map(dbCourses.map(c => [c.slug, c]));
    const merged = [
      ...dbCourses.map(c => normalizeCourse(c)),
      ...COURSES.filter(c => !dbBySlug.has(c.slug)),
    ];
    setCourses(merged);
  }, [data]);

  /* derived collections */
  const showcase = courses.slice(0, 6);
  const browseList = (() => {
    const list = activeCat === "All" ? courses : courses.filter(c => c.category === activeCat);
    return list.length ? list : courses;
  })();

  /* Navigate to the dedicated course route (no in-page overlay) */
  const openCourse = (c) => {
    if (!c?.slug) return;
    router.push(`/resources/courses/${c.slug}`);
  };

  /* Prefetch on hover so the course page opens instantly */
  const prefetchCourse = (c) => {
    if (c?.slug) router.prefetch(`/resources/courses/${c.slug}`);
  };

  const pickGoal = (cat) => {
    setGoalCat(cat);
    setActiveCat(cat);
    setTimeout(() => browseRef.current?.scrollIntoView({ behavior: "smooth" }), 340);
  };

  /* ── statement scroll reveal ── */
  useEffect(() => {
    const el = stRef.current;
    if (!el) return;
    const words = [...el.querySelectorAll(".rp-w")];
    const update = () => {
      const r = el.getBoundingClientRect();
      const start = window.innerHeight * 0.85, end = window.innerHeight * 0.35;
      const p = Math.min(Math.max((start - r.top) / (start - end), 0), 1);
      const lit = Math.floor(p * words.length);
      words.forEach((w, i) => w.classList.toggle("lit", i < lit || p >= 1));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  /* ── showcase carousel layout ── */
  const layoutShow = useCallback((i) => {
    const track = showTrackRef.current;
    if (!track || !track.children.length) return;
    const first = track.children[0].getBoundingClientRect();
    const step = first.width + 28;                 // slide + 14px margin each side
    const center = (window.innerWidth - first.width) / 2;
    track.style.transform = `translateX(${center - i * step - 14}px)`;
  }, []);

  useEffect(() => { layoutShow(showIdx); }, [showIdx, courses, layoutShow]);
  useEffect(() => {
    const onResize = () => layoutShow(showIdx);
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
    };
  }, [showIdx, layoutShow]);

  useEffect(() => {
    const n = Math.min(6, courses.length) || 1;
    const t = setInterval(() => {
      if (!showPaused.current) setShowIdx(i => (i + 1) % n);
    }, 4600);
    return () => clearInterval(t);
  }, [courses.length]);

  const goShow = (i) => {
    const n = Math.min(6, courses.length) || 1;
    setShowIdx(((i % n) + n) % n);
  };

  /* ── browse infinite auto-loop ── */
  useEffect(() => {
    const row = loopRef.current;
    if (!row) return;
    row.scrollLeft = 0;
    let raf, last = 0;
    const tick = (t) => {
      if (!last) last = t;
      const dt = t - last; last = t;
      if (!loopPaused.current) {
        row.scrollLeft += dt * 0.045;
        const w = row.scrollWidth / 3;
        if (w > 0 && row.scrollLeft >= w * 2) row.scrollLeft -= w;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const enter = () => { loopPaused.current = true; };
    const leave = () => { loopPaused.current = false; };
    const inEv = ["mouseenter", "touchstart", "pointerdown"];
    const outEv = ["mouseleave", "touchend", "pointerup"];
    inEv.forEach(e => row.addEventListener(e, enter, { passive: true }));
    outEv.forEach(e => row.addEventListener(e, leave, { passive: true }));
    return () => {
      cancelAnimationFrame(raf);
      inEv.forEach(e => row.removeEventListener(e, enter));
      outEv.forEach(e => row.removeEventListener(e, leave));
    };
  }, [activeCat, courses]);

  /* ── scroll reveals ── */
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add("shown");
        if (el.dataset.stagger) {
          el.querySelectorAll("[data-child]").forEach((c, i) =>
            setTimeout(() => c.classList.add("shown"), i * 130));
        }
        io.unobserve(el);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".rp-reveal,.rp-fan,[data-stagger]").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [courses]);
  return (
    <>
      <style>{CSS}</style>

      <div className="rp">

        {/* ── 1 · SPLIT HERO ── */}
        <ResourcesHero goalCat={goalCat} pickGoal={pickGoal} />

        {/* ── 2 · MEMBERSHIP PERKS ── */}
        <MembershipPerks />

        {/* ── 3 · STATEMENT REVEAL ── */}
        <StatementReveal stRef={stRef} />

        {/* ── 4 · SHOWCASE CAROUSEL ── */}
        <CourseShowcase
          showPaused={showPaused}
          showTrackRef={showTrackRef}
          showcase={showcase}
          showIdx={showIdx}
          prefetchCourse={prefetchCourse}
          openCourse={openCourse}
          goShow={goShow}
        />

        {/* ── 5 · BROWSE: PILLS + AUTO-LOOP ── */}
        <CourseBrowse
          browseRef={browseRef}
          activeCat={activeCat}
          setActiveCat={setActiveCat}
          loopRef={loopRef}
          browseList={browseList}
          prefetchCourse={prefetchCourse}
          openCourse={openCourse}
        />

        {/* ── 6 · COMMUNITY FAN ── */}
        <CommunityFan />

        {/* ── 7 · MEMBERSHIP / PRICING ── */}
        <MembershipPricing />

        {/* ── 8 · FAQ ── */}
        <ResourcesFaq openFaq={openFaq} setOpenFaq={setOpenFaq} />

        {/* ── 9 · CTA ── */}
        <ResourcesCta />

      </div>
    </>
  );
}
