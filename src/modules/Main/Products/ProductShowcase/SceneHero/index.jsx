'use client';
// modules/Products/ProductShowcase/SceneHero/index.jsx

import { useRef, useState } from "react";

import { POSTER } from '../constants';

/* ── the scene: your video + hotspots ──────────────────────────── */
export default function SceneHero({ videoSrc, hotspots, onPick }) {
  const videoRef = useRef(null);
  const [videoOk, setVideoOk] = useState(true);
  const [playing, setPlaying] = useState(true);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  return (
    <div className="ps-scene">
      <div className="ps-scene-frame">
        {videoOk ? (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={POSTER}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoOk(false)}
          />
        ) : (
          <img src={POSTER} alt="Creator desk setup" />
        )}

        {hotspots.map((h, i) => (
          <button
            key={i}
            className="ps-plus"
            style={{ left: `${h.x}%`, top: `${h.y}%`, animationDelay: `${i * 0.9}s` }}
            data-tip={h.tip}
            onClick={() => onPick(h, i)}
            aria-label={`View ${h.tip}`}
          >
            +
          </button>
        ))}

        <span className="ps-frame" aria-hidden="true" />
        {videoOk && (
          <button className="ps-playpause" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
            {playing ? "❚❚" : "▶"}
          </button>
        )}
      </div>
    </div>
  );
}
