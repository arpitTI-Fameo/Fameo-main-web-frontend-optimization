'use client';
// modules/Resources/CourseBrowse/index.jsx

import { COURSE_CATEGORIES } from '@/constants/courses';

import { PILL_ICON } from '../constants';

export default function CourseBrowse({ browseRef, activeCat, setActiveCat, loopRef, browseList, prefetchCourse, openCourse }) {
    return (
    <section className="rp-section rp-browse" ref={browseRef}>
      <div className="rp-pills">
        {COURSE_CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`rp-pill${cat === activeCat ? " active" : ""}`}
            onClick={() => setActiveCat(cat)}
          >
            <span className="ci">{PILL_ICON[cat] || "•"}</span>
            {cat}
          </button>
        ))}
      </div>
      <div className="rp-loop-head">
        <div className="lh">
          <b>{activeCat === "All" ? "Popular now" : activeCat}</b>
          <span className="see" onClick={() => setActiveCat("All")}>See all</span>
        </div>
        <div className="rp-loop-nav">
          <button className="rp-tbtn" onClick={() => loopRef.current?.scrollBy({ left: -560, behavior: "smooth" })} aria-label="Scroll left">←</button>
          <button className="rp-tbtn" onClick={() => loopRef.current?.scrollBy({ left: 560, behavior: "smooth" })} aria-label="Scroll right">→</button>
        </div>
      </div>
      <div className="rp-loop-outer">
        <div className="rp-loop-row" ref={loopRef}>
          {[...browseList, ...browseList, ...browseList].map((c, i) => (
            <div
              key={`${c.id || c.slug}-${i}`}
              className="rp-tcard"
              onMouseEnter={() => prefetchCourse(c)}
              onClick={() => openCourse(c)}
            >
              <img src={c.thumbnail || c.heroThumb} alt={c.title} loading="lazy" draggable="false" />
              {c.badge && (
                <span className="rp-tbadge" style={{ background: c.accent + "26", color: "#fff", border: `1px solid ${c.accent}55` }}>
                  {c.badge}
                </span>
              )}
              <div className="rp-tinfo">
                <div className="tc">{c.category}</div>
                <h4>{c.title}</h4>
                <div className="tm">{[c.stat && `${c.stat} ${c.statLabel}`, c.tag].filter(Boolean).join(" · ").toUpperCase()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    );
}
