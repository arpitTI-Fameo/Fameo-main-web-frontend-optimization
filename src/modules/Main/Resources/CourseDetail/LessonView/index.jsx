'use client';
// modules/Resources/CourseDetail/LessonView/index.jsx

import { useState, useEffect } from "react";

import Footer from '../Footer';
import { QUOTES } from '../constants';
import { toParagraphs } from '../helpers';
import { useReveals } from '../hooks';

export default function LessonView({ course, lesson, allLessons, onNav, onBackToCourse, onHome }) {
  const [progress, setProgress] = useState(0);
  const [activeSec, setActiveSec] = useState(0);
  useReveals([lesson.id]);

  const idx = allLessons.findIndex(l => l.id === lesson.id);
  const prev = idx > 0 ? allLessons[idx - 1] : null;
  const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;
  const sections = lesson.sections || [];
  const chIdx = course.chapters.findIndex(c => c.id === lesson.chapter?.id) + 1;

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const h = document.documentElement;
        setProgress((h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100);
        let cur = 0;
        sections.forEach((_, i) => {
          const el = document.getElementById(`cx-s${i}`);
          if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) cur = i;
        });
        setActiveSec(cur);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections.length, lesson.id]);  

  const jumpTo = i => e => {
    e.preventDefault();
    document.getElementById(`cx-s${i}`)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="cx is-lesson">
      <div className="cx-progress"><b style={{ width: `${progress}%` }} /></div>
      {/* <Nav scrolled crumbLabel={String(course.title).toUpperCase()} onCrumb={onBackToCourse} onHome={onHome} /> */}

      <div className="cx-sheet">
        <div className="cx-page">

          {/* TOC RAIL */}
          <aside className="cx-toc">
            <div className="tl">IN THIS LESSON</div>
            {sections.map((s, i) => (
              <a key={s.id || i} href={`#cx-s${i}`} className={i === activeSec ? "on" : ""} onClick={jumpTo(i)}>
                <i>{String(i + 1).padStart(2, "0")}</i>{s.heading}
              </a>
            ))}
          </aside>

          {/* ARTICLE */}
          <article className="cx-article">
            <div className="cx-kicker" style={{ color: course.accent }}>
              {lesson.chapter?.title} <span>· LESSON {chIdx}.{idx + 1}</span>
            </div>
            <h1>{lesson.title}</h1>
            <p className="cx-standfirst">{lesson.intro}</p>
            <div className="cx-meta-row">
              <span className="m">{course.category}</span><span className="sep" />
              <span className="m">Lesson {idx + 1} of {allLessons.length}</span><span className="sep" />
              <span className="m">{course.level} · Self-paced</span>
            </div>

            {sections.map((sec, si) => {
              const paras = toParagraphs(sec.body);
              const img = sec.image || (si === 0 ? lesson.thumb : null);
              return (
                <section className={`cx-sect cx-rv${sec.notes?.length ? " has-note" : ""}`} id={`cx-s${si}`} key={sec.id || si}>
                  {sec.notes?.length > 0 && (
                    <div className="cx-notes" style={{ "--note-accent": course.accent }}>
                      {sec.notes.map((nt, ni) => (
                        <aside className="cx-note" key={ni}>
                          {nt.label && <div className="cx-note-label">{nt.label}</div>}
                          <p>{nt.text}</p>
                        </aside>
                      ))}
                    </div>
                  )}
                  <h2 data-n={String(si + 1).padStart(2, "0")}>{sec.heading}</h2>

                  {img && (
                    <figure className="cx-figure">
                      <img src={img} alt="" />
                      <figcaption>{sec.heading}</figcaption>
                    </figure>
                  )}

                  {paras.map((p, pi) => (
                    <p key={pi} className={pi === 0 ? "cx-dropcap" : undefined}>{p}</p>
                  ))}

                  {sec.keyPoints?.length > 0 && (
                    <div className="cx-keypts">
                      <div className="kh">KEY POINTS</div>
                      {sec.keyPoints.map((pt, pi) => <div className="kp" key={pi}>{pt}</div>)}
                    </div>
                  )}

                  {si === sections.length - 1 && sections.length > 1 && (
                    <div className="cx-pull">&ldquo;{QUOTES[(idx + 1) % QUOTES.length]}&rdquo;</div>
                  )}
                </section>
              );
            })}

            {/* LESSON NAV */}
            <div className="cx-lesson-nav cx-rv">
              <button className="cx-lnav prev" disabled={!prev} onClick={() => prev && onNav(prev.id)}>
                ← PREVIOUS
              </button>
              <button className="cx-lnav next" disabled={!next} onClick={() => next && onNav(next.id)}>
                NEXT <span className="a">→</span>
              </button>
            </div>

            {next && (
              <div className="cx-upnext cx-rv">
                <div className="ul">UP NEXT</div>
                <button className="cx-up-card" onClick={() => onNav(next.id)}>
                  <div className="ut"><img src={next.thumb} alt="" /></div>
                  <div>
                    <div className="uk" style={{ color: course.accent }}>
                      LESSON {idx + 2} · {next.chapter?.title}
                    </div>
                    <h4>{next.title}</h4>
                  </div>
                  <span className="ua">→</span>
                </button>
              </div>
            )}
          </article>

          <div aria-hidden="true" />
        </div>
      </div>

      <Footer />
    </div>
  );
}
