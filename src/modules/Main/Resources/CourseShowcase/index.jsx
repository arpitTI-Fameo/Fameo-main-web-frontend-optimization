'use client';
// modules/Resources/CourseShowcase/index.jsx

export default function CourseShowcase({ showPausedRef, showTrackRef, showcase, showIdx, prefetchCourse, openCourse, goShow }) {
    return (
    <section
      className="rp-showcase"
      onMouseEnter={() => { showPausedRef.current = true; }}
      onMouseLeave={() => { showPausedRef.current = false; }}
    >
      <div className="rp-show-track" ref={showTrackRef}>
        {showcase.map((c, i) => (
          <div
            key={c.id || i}
            className={`rp-slide${i === showIdx ? " active" : ""}`}
            onMouseEnter={() => prefetchCourse(c)}
            onClick={() => (i !== showIdx ? goShow(i) : openCourse(c))}
          >
            <img src={c.heroThumb || c.thumbnail} alt={c.title} loading="lazy" draggable="false" />
            <div className="rp-slide-num">
              {String(i + 1).padStart(2, "0")} / {String(showcase.length).padStart(2, "0")}
            </div>
            <div className="rp-slide-info">
              <span className="rp-slide-cat">{c.category}</span>
              <h3>{c.title}</h3>
              <span className="rp-slide-start"><span className="c">▶</span>Start Learning</span>
            </div>
          </div>
        ))}
      </div>
      <div className="rp-show-ctrl">
        <button className="rp-tbtn" onClick={() => goShow(showIdx - 1)} aria-label="Previous">←</button>
        <div className="rp-dots">
          {showcase.map((_, i) => (
            <button
              key={i}
              className={`rp-dot${i === showIdx ? " active" : ""}`}
              onClick={() => goShow(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <button className="rp-tbtn" onClick={() => goShow(showIdx + 1)} aria-label="Next">→</button>
      </div>
    </section>
    );
}
