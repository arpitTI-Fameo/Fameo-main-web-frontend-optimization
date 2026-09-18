'use client';
// modules/Main/Products/ProductListing/ProductShowcase/SceneHero/TimeRuler/index.jsx
// The 24-hour ruler under the scene. Ticks run the whole width — midnight at
// the left edge, midnight again at the right — and a soft mask keeps only the
// ones near the playhead legible, so the strip reads as a scale being pulled
// past a fixed point rather than as a progress bar.

import { useCallback, useMemo, useRef, useState } from 'react';

import { MINUTES_PER_DAY, RULER_STEP_MIN, SCRUB_STEP_MIN } from '../../constants';
import { formatClock } from '../../helpers';

/**
 * Props
 *  minutes  number            – playhead, minutes past midnight
 *  live     boolean           – playhead is tracking the wall clock
 *  place    string            – label beside the time, e.g. "Mumbai, India"
 *  chip     'ink' | 'paper'   – how the strip reads against this footage
 *  playing  boolean           – the scene video is running
 *  onScrub  (minutes) => void – caller wraps the value into the day
 */
export default function TimeRuler({
  minutes,
  live,
  place,
  chip,
  playing,
  onScrub,
  onNow,
  onTogglePlay,
}) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const ticks = useMemo(() => {
    const out = [];
    for (let m = 0; m < MINUTES_PER_DAY; m += RULER_STEP_MIN) out.push(m);
    return out;
  }, []);

  // One number drives the whole strip: the mask centre, the playhead tick and
  // the clock chip all read this custom property off the root.
  const pct = Math.min(100, Math.max(0, (minutes / MINUTES_PER_DAY) * 100));

  const seek = useCallback((clientX) => {
    const el = trackRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width) return;
    const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    onScrub(Math.round(ratio * MINUTES_PER_DAY));
  }, [onScrub]);

  const onPointerDown = (e) => {
    // Capture on the track, so a drag that leaves the frame keeps scrubbing
    // instead of stopping the moment the pointer clears the video.
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDragging(true);
    seek(e.clientX);
  };

  const endDrag = () => setDragging(false);

  // Buttons, not a `dragging` flag: pointer capture means the release can
  // land outside the track, and this never misses that.
  const onPointerMove = (e) => { if (e.buttons & 1) seek(e.clientX); };

  const onKeyDown = (e) => {
    const step = e.shiftKey ? 60 : SCRUB_STEP_MIN;
    if (e.key === 'ArrowLeft') { e.preventDefault(); onScrub(minutes - step); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); onScrub(minutes + step); }
    else if (e.key === 'Home') { e.preventDefault(); onScrub(0); }
    else if (e.key === 'End') { e.preventDefault(); onScrub(MINUTES_PER_DAY - 1); }
  };

  return (
    <div
      className={`ps-strip${dragging ? ' is-dragging' : ''}`}
      data-chip={chip}
      style={{ '--ps-play': `${pct}%` }}
    >
      <div className="ps-strip-row">

        <div className="ps-ruler">
          <p className="ps-clock">
            {place ? `${place} — ` : ''}{formatClock(minutes)}
          </p>

          <div
            ref={trackRef}
            className="ps-ruler-track"
            role="slider"
            tabIndex={0}
            aria-label="Time of day"
            aria-valuemin={0}
            aria-valuemax={MINUTES_PER_DAY - 1}
            aria-valuenow={Math.round(minutes)}
            aria-valuetext={formatClock(minutes)}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={onKeyDown}
          >
            <div className="ps-ruler-ticks" aria-hidden="true">
              {ticks.map((m) => (
                <span
                  key={m}
                  className={`ps-tick${m % 360 === 0 ? ' is-major' : m % 60 === 0 ? ' is-hour' : ''}`}
                  style={{ left: `${(m / MINUTES_PER_DAY) * 100}%` }}
                />
              ))}
            </div>
            <span className="ps-head" aria-hidden="true" />
          </div>
        </div>

        <div className="ps-strip-controls">
          <button
            type="button"
            className="ps-playpause"
            onClick={onTogglePlay}
            aria-label={playing ? 'Pause the scene' : 'Play the scene'}
          >
            {playing ? '❚❚' : '▶'}
          </button>
          <button
            type="button"
            className="ps-now"
            onClick={onNow}
            disabled={live}
            aria-label="Back to the current time"
          >
            now
          </button>
        </div>

      </div>
    </div>
  );
}
