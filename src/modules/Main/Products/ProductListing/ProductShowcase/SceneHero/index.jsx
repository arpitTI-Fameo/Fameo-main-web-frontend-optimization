'use client';
// modules/Main/Products/ProductListing/ProductShowcase/SceneHero/index.jsx
// The shop-the-scene hero. The strip along the bottom is a ruler of one whole
// day: wherever the playhead sits decides which clip owns the frame, so the
// store opens in the light the visitor is actually shopping in. Drag the ruler
// to travel the day; "now" walks it back to the wall clock.

import { useCallback, useEffect, useRef, useState } from "react";

import { CLOCK_TICK_MS, DEFAULT_MINUTES, POSTER, SCENES } from '../constants';
import { minutesNow, sceneAt, wrapMinutes } from '../helpers';
import TimeRuler from './TimeRuler';

export default function SceneHero({ scenes = SCENES, onPick }) {
  // The server has no idea what time it is where the visitor is. Reading a
  // real clock here would render one time on the server and another in the
  // browser, which React reports as a hydration mismatch — so first paint is a
  // fixed hour and the effect below corrects it to local time on mount.
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES);
  const [live, setLive] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [broken, setBroken] = useState({});
  const videos = useRef({});

  const scene = sceneAt(minutes, scenes) || scenes[0];
  const activeId = scene?.id;

  // While the playhead is live it follows the wall clock, which is also what
  // pulls the real local time in on mount.
  useEffect(() => {
    if (!live) return undefined;
    setMinutes(minutesNow());
    const id = setInterval(() => setMinutes(minutesNow()), CLOCK_TICK_MS);
    return () => clearInterval(id);
  }, [live]);

  // Only the scene on screen plays. The rest stay parked at opacity 0 so the
  // crossfade has something to fade to without four clips decoding at once.
  useEffect(() => {
    Object.entries(videos.current).forEach(([id, v]) => {
      if (!v) return;
      if (id !== activeId) { v.pause(); return; }
      if (!playing) { v.pause(); return; }
      const p = v.play();
      // Autoplay can still be refused (muted playback usually isn't, but a
      // battery-saver profile will). Nothing to recover — the frame holds.
      if (p?.catch) p.catch(() => {});
    });
  }, [activeId, playing]);

  const scrub = useCallback((m) => { setLive(false); setMinutes(wrapMinutes(m)); }, []);
  const goLive = useCallback(() => { setLive(true); setMinutes(minutesNow()); }, []);
  const togglePlay = useCallback(() => setPlaying((p) => !p), []);

  return (
    <div className="ps-scene">
      <div className="ps-scene-frame">

        {scenes.map((s) => (
          <div
            key={s.id}
            className={`ps-layer${s.id === activeId ? ' is-on' : ''}`}
            style={{ background: s.bg }}
            aria-hidden={s.id !== activeId}
          >
            {broken[s.id] ? (
              <img src={POSTER} alt={s.alt} />
            ) : (
              <video
                ref={(el) => { videos.current[s.id] = el; }}
                src={s.video}
                // Only the scene in frame is worth the bandwidth; the others
                // fetch headers now and the rest when their hour comes round.
                preload={s.id === activeId ? 'auto' : 'metadata'}
                muted
                loop
                playsInline
                aria-label={s.alt}
                onError={() => setBroken((b) => ({ ...b, [s.id]: true }))}
              />
            )}
          </div>
        ))}

        {(scene?.hotspots || []).map((h, i) => (
          <button
            key={`${activeId}-${h.productId || i}`}
            className="ps-plus"
            style={{ left: `${h.x}%`, top: `${h.y}%`, animationDelay: `${i * 0.9}s` }}
            data-tip={h.tip}
            onClick={() => onPick(h)}
            aria-label={`View ${h.tip}`}
          >
            +
          </button>
        ))}

        <span className="ps-frame" aria-hidden="true" />

        <TimeRuler
          minutes={minutes}
          live={live}
          place={scene?.place}
          chip={scene?.chip}
          playing={playing}
          onScrub={scrub}
          onNow={goLive}
          onTogglePlay={togglePlay}
        />
      </div>
    </div>
  );
}
