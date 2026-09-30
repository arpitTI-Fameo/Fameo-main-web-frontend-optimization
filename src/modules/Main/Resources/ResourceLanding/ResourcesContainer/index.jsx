"use client";
// modules/Resources/ResourcesContainer/index.jsx

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import FameoPage from '@/components/Layout/FameoPage';

import { useCourseLibrary } from "../../hooks";
import ResourcesHero from "../ResourcesHero";
import MembershipPerks from "../MembershipPerks";
import CourseShowcase from "../CourseShowcase";
import CourseBrowse from "../CourseBrowse";
import CommunityFan from "../CommunityFan";
import MembershipPricing from "../MembershipPricing";
import ResourcesFaq from "../ResourcesFaq";
import ResourcesCta from "../ResourcesCta";
import { SECTION_IDS } from "../constants";
import { ROUTES } from '@/constants/routes';

export default function ResourcesContainer() {
  const router = useRouter();

  const [activeCat, setActiveCat] = useState("All");
  const [goalCat, setGoalCat] = useState(null);
  const [showIdx, setShowIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  const browseRef = useRef(null);
  const showPausedRef = useRef(false);

  /* Live content: published DB courses override the static seed by slug */
  const courses = useCourseLibrary();

  /* derived collections */
  const showcase = courses.slice(0, 6);
  const browseList = (() => {
    const list = activeCat === "All" ? courses : courses.filter(c => c.category === activeCat);
    return list.length ? list : courses;
  })();

  /* Navigate to the dedicated course route (no in-page overlay) */
  const openCourse = (c) => {
    if (!c?.slug) return;
    router.push(ROUTES.COURSE(c.slug));
  };

  /* Prefetch on hover so the course page opens instantly */
  const prefetchCourse = (c) => {
    if (c?.slug) router.prefetch(ROUTES.COURSE(c.slug));
  };

  const pickGoal = (cat) => {
    setGoalCat(cat);
    setActiveCat(cat);
    setTimeout(() => browseRef.current?.scrollIntoView({ behavior: "smooth" }), 340);
  };

  /* In-page jumps for the hero and closing CTA */
  const scrollToSection = useCallback((id) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, []);

  /* ── showcase autoplay ── */
  useEffect(() => {
    const n = Math.min(6, courses.length) || 1;
    const t = setInterval(() => {
      if (!showPausedRef.current) setShowIdx(i => (i + 1) % n);
    }, 4600);
    return () => clearInterval(t);
  }, [courses.length]);

  const goShow = (i) => {
    const n = Math.min(6, courses.length) || 1;
    setShowIdx(((i % n) + n) % n);
  };

  return (
    <FameoPage>
      {/* The page itself uses the bundled Fameo fonts. This import only keeps
          the shared site Footer (font-family: 'DM Sans') rendering as it did
          before the redesign; it is not needed by anything inside this page.
          `href` + `precedence` let React hoist it into <head>: a bare <style>
          in the body is skipped during hydration and throws a mismatch. */}
      <style href="resources-footer-dm-sans" precedence="default">
        {"@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');"}
      </style>

      {/* ── 1 · HERO + LEARNING GOALS ── */}
      <ResourcesHero goalCat={goalCat} pickGoal={pickGoal} scrollToSection={scrollToSection} />

      {/* ── 2 · MEMBERSHIP PERKS ── */}
      <MembershipPerks />

      <section id={SECTION_IDS.courses} className="scroll-mt-24">
        {/* ── 3 · FEATURED CAROUSEL ── */}
        <CourseShowcase
          showPausedRef={showPausedRef}
          showcase={showcase}
          showIdx={showIdx}
          prefetchCourse={prefetchCourse}
          openCourse={openCourse}
          goShow={goShow}
        />

        {/* ── 4 · BROWSE: TOPICS + LIBRARY ── */}
        <CourseBrowse
          browseRef={browseRef}
          activeCat={activeCat}
          setActiveCat={setActiveCat}
          browseList={browseList}
          prefetchCourse={prefetchCourse}
          openCourse={openCourse}
        />
      </section>

      {/* ── 5 · COMMUNITY ── */}
      <CommunityFan />

      {/* ── 6 · MEMBERSHIP ── */}
      <MembershipPricing />

      {/* ── 7 · FAQ ── */}
      <ResourcesFaq openFaq={openFaq} setOpenFaq={setOpenFaq} />

      {/* ── 8 · CTA ── */}
      <ResourcesCta scrollToSection={scrollToSection} />
    </FameoPage>
  );
}
