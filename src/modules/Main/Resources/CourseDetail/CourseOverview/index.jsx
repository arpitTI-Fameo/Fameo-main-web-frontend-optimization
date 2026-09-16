'use client';
// modules/Resources/CourseDetail/CourseOverview/index.jsx

import { useState, useEffect } from "react";
import { COURSES } from "@/constants/courses";

import Footer from '../Footer';
import { HERO_FALLBACK, QUOTES } from '../constants';
import { useReveals } from '../hooks';
import { ROUTES } from '@/constants/routes';

export default function CourseOverview({ course, allLessons, onOpenLesson, onHome }) {
  const [sticky, setSticky] = useState(false);
  useReveals([course.slug]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setSticky(y > window.innerHeight * 0.55 &&
          y < document.body.scrollHeight - window.innerHeight * 2);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const words = course.title.split(" ");
  const half = Math.ceil(words.length / 2);
  const lines = [words.slice(0, half).join(" "), words.slice(half).join(" ")].filter(Boolean);

  const nextCourses = COURSES.filter(c => c.slug !== course.slug).slice(0, 3);
  const meta = `${allLessons.length} LESSON${allLessons.length === 1 ? "" : "S"} · ${String(course.level).toUpperCase()}`;
  const jump = () => document.getElementById("cx-curriculum")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="cx is-course">
      {/* <Nav scrolled={scrolled} crumbLabel="LEARNING CENTER" onCrumb={onHome} onHome={onHome} /> */}

      {/* HERO */}
      <header
        className="cx-hero"
        style={{
          position: "relative",
          height: "62vh",
          minHeight: "520px",
          width: "100%",
          display: "block",
          overflow: "hidden",
          flex: "none",
          background: "linear-gradient(135deg,#efe7f3,#f6eef5 55%,#f3e9ef)",
        }}
      >
        <img
          className="cx-hero-bg"
          src={course.heroThumb || course.thumbnail || HERO_FALLBACK}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center right",
            display: "block",
            maxWidth: "none",
            filter: "saturate(.94) contrast(1.02) brightness(1.06)",
          }}
          onError={(e) => {
            if (e.currentTarget.src !== HERO_FALLBACK) e.currentTarget.src = HERO_FALLBACK;
          }}
        />
        <div className="cx-hero-veil" />
        <div
          className="cx-hero-content"
          style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 2 }}
        >
          <div className="cx-chips"><span className="cx-chip">{course.level}</span></div>
          <h1>{lines.map((l, i) => <span className="line" key={i}><span>{l}</span></span>)}</h1>
          <p className="cx-promise">{course.subtitle || course.description}</p>
          <div className="cx-hero-actions">
            <button className="cx-btn cx-btn-primary" onClick={jump}>
              START LEARNING <span className="arr">→</span>
            </button>
          </div>
        </div>
        <div className="cx-scroll">SCROLL<div className="wheel" /></div>
      </header>

      {/* ABOUT + WHAT YOU'LL LEARN */}
      <section className="cx-section cx-about">
        <div className="cx-about-copy cx-reveal">
          <p>{course.subtitle || course.title}</p>
          <div className="note">{course.description}</div>
        </div>
        <div>
          <div className="cx-sec-label cx-reveal">WHAT YOU&apos;LL LEARN</div>
          <div className="cx-learn-grid" data-stagger="110">
            {course.whatYouLearn.map((item, i) => (
              <div className="cx-learn" data-child key={i}><div className="chk">✓</div>{item}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CURRICULUM */}
      <section className="cx-section cx-curr" id="cx-curriculum">
        <div className="cx-sec-label cx-reveal">CURRICULUM</div>
        <div className="cx-curr-head cx-reveal">
          <h2>{course.title}</h2>
          <span className="cm">{meta}</span>
        </div>
        <div data-stagger="160">
          {course.chapters.map((ch, ci) => (
            <div key={ch.id}>
              <div className="cx-grp" style={{ marginTop: ci === 0 ? 8 : undefined }}>
                <span className="n">{String(ci + 1).padStart(2, "0")}</span>{ch.title}
              </div>
              {(ch.lessons || []).map(l => {
                const n = allLessons.findIndex(x => x.id === l.id) + 1;
                const topics = (l.sections || []).map(s => s.heading).slice(0, 4);
                return (
                  <button
                    key={l.id}
                    className={`cx-lesson${n === allLessons.length ? " last" : ""}`}
                    data-child
                    onClick={() => onOpenLesson(l.id)}
                  >
                    <div className="cx-lthumb">
                      <img src={l.thumb} alt="" />
                      <span className="lnum">{String(n).padStart(2, "0")}</span>
                    </div>
                    <div>
                      <div className="lk">{ch.title}</div>
                      <h3>{l.title}</h3>
                      <div className="cx-topics">
                        {topics.map(t => <span className="cx-topic" key={t}>{t}</span>)}
                      </div>
                    </div>
                    <div className="cx-lright">
                      <span className="dur">LESSON {String(n).padStart(2, "0")}</span>
                      <div className="play">▶</div>
                    </div>
                    <div className="cx-bar" />
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* QUOTE */}
      <section className="cx-quote cx-reveal">
        <p>&ldquo;{QUOTES[0]}&rdquo;</p>
        <div className="who">FAMEO · {String(course.category).toUpperCase()} TEAM</div>
      </section>

      {/* NEXT COURSES */}
      {nextCourses.length > 0 && (
        <section className="cx-section cx-next-wrap">
          <div className="cx-sec-label cx-reveal">CONTINUE YOUR PATH</div>
          <div className="cx-next-grid" data-stagger="130">
            {nextCourses.map(c => (
              <a className="cx-ncard" data-child key={c.slug} href={ROUTES.COURSE(c.slug)}>
                <img src={c.heroThumb || c.thumbnail} alt="" />
                <div className="cx-ninfo">
                  <div className="nc">{c.category}</div>
                  <h4>{c.title}</h4>
                  <span className="go">→</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* STICKY CTA */}
      <div className={`cx-sticky${sticky ? " on" : ""}`}>
        <div>
          <div className="t">{course.title}</div>
          <div className="m">{meta}</div>
        </div>
        <button className="cx-btn cx-btn-primary" onClick={jump}>START <span className="arr">→</span></button>
      </div>

      <Footer />
    </div>
  );
}
