'use client';

import { useState, useEffect, useRef } from 'react';
import { EyeGlyph, MiniCheck } from '../icons';

/* ── live selfie (blink liveness) config ────────────────────────────────── */
const BLINK_FRAME_WIDTH = 480;
const BLINK_FRAME_QUALITY = 0.55;
const FINAL_SELFIE_WIDTH = 960;
const FINAL_SELFIE_QUALITY = 0.78;

/* ── liveness pacing ─────────────────────────────────────────────────────── */
const BLINK_FRAME_COUNT = 16;      // frames across the blink window
const BLINK_FRAME_INTERVAL = 220;  // ms between frames → ~3.5s blink window
const MIN_BLINK_FRAMES = 3;
const OPEN_HOLD_MS = 2500;         // "keep eyes open" hold
const COUNTDOWN_MS = 3000;         // 3-2-1 countdown
const CAPTURE_SETTLE_MS = 500;     // settle before final selfie

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
function dataUrlToBlob(dataUrl) {
  const [header, b64] = dataUrl.split(',');
  const mime = (header.match(/:(.*?);/) || [, 'image/jpeg'])[1];
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/* ── Live Selfie Capture ────────────────────────────────────────────────────
   UNCHANGED — face verification left exactly as it was.
   Phases: loading → ready → open (2.5s) → countdown (3s) → blink (~3.5s)
           → capturing → (parent: checking)
   ------------------------------------------------------------------------ */
const COACH = {
  loading:   { phase: 'PREPARING',  msg: 'Starting your camera…',              hint: '' },
  ready:     { phase: 'READY',      msg: 'Centre your face in the ring',       hint: 'The whole check takes about 10 seconds' },
  open:      { phase: 'STEP 1 OF 3',msg: 'Keep your eyes open',                hint: 'Look straight ahead and hold still' },
  countdown: { phase: 'STEP 2 OF 3',msg: 'Get ready to blink',                 hint: 'At zero: blink and move your head slightly' },
  blink:     { phase: 'STEP 3 OF 3',msg: 'Blink 2–3 times & move your head',   hint: 'Add a small nod or gentle turn — keep it natural' },
  capturing: { phase: 'ALMOST DONE',msg: 'Hold still — capturing',             hint: '' },
};
const TRACK_STEPS = ['EYES OPEN', 'GET READY', 'BLINK'];

export default function LiveSelfieCapture({ onCaptured, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const abortRef = useRef(false);

  const [phase, setPhase] = useState('loading');
  const [camError, setCamError] = useState('');   // fatal — camera unusable
  const [runError, setRunError] = useState('');   // recoverable — retry inline
  const [progress, setProgress] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [flashKey, setFlashKey] = useState(0);

  const stopStream = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
  };

  const startCamera = async () => {
    stopStream(); setPhase('loading'); setCamError(''); setRunError('');
    setProgress(0); setHoldProgress(0); setFrameCount(0); setCountdown(0);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCamError('Camera not supported in this browser. Please use Chrome or Safari.'); return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      video.setAttribute('playsinline', 'true'); video.setAttribute('muted', 'true'); video.muted = true;

      // Kick off playback. A play() rejection here is usually a benign autoplay
      // / interrupt quirk — the stream still renders via the autoPlay attribute,
      // and we confirm real readiness by polling readyState below, so don't
      // treat it as fatal.
      try { await video.play(); } catch { /* non-fatal autoplay/abort */ }

      // Poll for a genuinely decodable frame instead of awaiting onloadedmetadata.
      let warm = false;
      for (let i = 0; i < 50; i += 1) { // ~6s budget
        if (abortRef.current) return;
        if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) { warm = true; break; }
        await sleep(120);
      }
      if (!warm) {
        setCamError('Camera didn\u2019t start streaming. Close any other app using the camera, check the site\u2019s camera permission, and try again.');
        return;
      }
      setPhase('ready');
    } catch (err) {
      const msg = err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError'
        ? 'Camera permission denied. Allow camera access for this site in your browser, then try again.'
        : err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError' ? 'No front camera was found on this device.'
        : err?.name === 'NotReadableError' || err?.name === 'TrackStartError' ? 'Your camera is in use by another app. Close it and try again.'
        : `Couldn\u2019t start the camera${err?.message ? ` (${err.message})` : ''}. Check the site\u2019s camera permission and try again.`;
      setCamError(msg);
    }
  };

  useEffect(() => {
    abortRef.current = false;
    startCamera();
    return () => { abortRef.current = true; stopStream(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* capture a mirrored frame — null if the video has no real pixels yet */
  const captureFrame = (maxWidth, quality) => {
    const video = videoRef.current, canvas = canvasRef.current;
    if (!video || !canvas) return null;
    if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) return null;

    const scale = Math.min(1, maxWidth / video.videoWidth);
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.translate(canvas.width, 0); ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    const url = canvas.toDataURL('image/jpeg', quality);
    if (!url || url.length < 2000) return null; // blank/black frame
    return url;
  };

  const captureFrameWithRetry = async (maxWidth, quality, attempts = 6, gap = 120) => {
    for (let i = 0; i < attempts; i += 1) {
      const f = captureFrame(maxWidth, quality);
      if (f) return f;
      await sleep(gap);
      if (abortRef.current) return null;
    }
    return null;
  };

  const runLiveCheck = async () => {
    if (phase !== 'ready') return;
    setRunError(''); setCamError('');
    try {
      /* STEP 1 — open-eye hold */
      setPhase('open'); setProgress(0); setHoldProgress(0); setFrameCount(0);
      const holdTicks = 10;
      for (let i = 0; i < holdTicks; i += 1) {
        await sleep(OPEN_HOLD_MS / holdTicks);
        if (abortRef.current) return;
        setHoldProgress((i + 1) / holdTicks);
      }

      const openFrame = await captureFrameWithRetry(BLINK_FRAME_WIDTH, BLINK_FRAME_QUALITY);
      if (abortRef.current) return;
      if (!openFrame) throw new Error('No camera image detected. Make sure the lens is not covered and the room is well lit, then try again.');
      const blinkFrames = [openFrame];
      setFrameCount(1);

      /* STEP 2 — countdown */
      setPhase('countdown');
      for (let n = Math.round(COUNTDOWN_MS / 1000); n >= 1; n -= 1) {
        setCountdown(n);
        await sleep(1000);
        if (abortRef.current) return;
      }
      setCountdown(0);

      /* STEP 3 — blink window */
      setPhase('blink');
      setFlashKey(k => k + 1);
      for (let i = 0; i < BLINK_FRAME_COUNT; i += 1) {
        const frame = captureFrame(BLINK_FRAME_WIDTH, BLINK_FRAME_QUALITY);
        if (frame) { blinkFrames.push(frame); setFrameCount(blinkFrames.length); }
        setProgress((i + 1) / BLINK_FRAME_COUNT);
        await sleep(BLINK_FRAME_INTERVAL);
        if (abortRef.current) return;
      }

      /* STEP 4 — final selfie */
      setPhase('capturing');
      await sleep(CAPTURE_SETTLE_MS);
      if (abortRef.current) return;

      const finalFrame = await captureFrameWithRetry(FINAL_SELFIE_WIDTH, FINAL_SELFIE_QUALITY);
      if (abortRef.current) return;
      if (!finalFrame) throw new Error('Could not capture your photo. Please check the lighting and try again.');
      if (blinkFrames.length < MIN_BLINK_FRAMES) {
        throw new Error(`Only ${blinkFrames.length} usable frames were captured. Stay in front of the camera for the full check and try again.`);
      }

      const selfieBlob = dataUrlToBlob(finalFrame);
      const selfieFile = new File([selfieBlob], `fameoselfie_${Date.now()}.jpg`, { type: 'image/jpeg' });

      stopStream();
      onCaptured({ selfieFile, previewUrl: finalFrame, blinkFrames });
    } catch (err) {
      setRunError(err?.message || 'Live capture failed. Please try again.');
      setPhase('ready');
      setProgress(0); setHoldProgress(0); setCountdown(0); setFrameCount(0);
    }
  };

  const coach = COACH[phase] || COACH.ready;
  const running = phase === 'open' || phase === 'countdown' || phase === 'blink' || phase === 'capturing';
  const activeFrame = running;

  /* ring arc progress across the whole sequence */
  const ringProgress = phase === 'open' ? holdProgress * 0.3
    : phase === 'countdown' ? 0.3 + (1 - countdown / (COUNTDOWN_MS / 1000)) * 0.25
    : phase === 'blink' ? 0.55 + progress * 0.4
    : phase === 'capturing' ? 1 : 0;

  const R = 128, C = 2 * Math.PI * R;

  const trackFill = [
    phase === 'open' ? holdProgress : (['countdown', 'blink', 'capturing'].includes(phase) ? 1 : 0),
    phase === 'countdown' ? 1 - countdown / (COUNTDOWN_MS / 1000) : (['blink', 'capturing'].includes(phase) ? 1 : 0),
    phase === 'blink' ? progress : (phase === 'capturing' ? 1 : 0),
  ];
  const activeTrackIdx = phase === 'open' ? 0 : phase === 'countdown' ? 1 : (phase === 'blink' || phase === 'capturing') ? 2 : -1;

  const shutterLabel = camError ? '↻ RESTART CAMERA'
    : phase === 'capturing' ? 'CAPTURING…'
    : phase === 'blink' ? 'BLINK NOW…'
    : phase === 'countdown' ? 'GET READY…'
    : phase === 'open' ? 'HOLD STILL…'
    : runError ? '↻ TRY AGAIN'
    : '👁  START LIVE CHECK';

  return (
    <div className="cam-overlay" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Live selfie verification">
      <div className="cam-modal">

        {/* header + step track */}
        <div className="cam-hdr">
          <div className="cam-hdr-top">
            <span className="cam-hdr-ttl"><i className="cam-live-dot" /> Live selfie check</span>
            <button className="cam-close" onClick={() => { abortRef.current = true; stopStream(); onClose(); }} aria-label="Close">✕</button>
          </div>
          <div className="cam-track" aria-hidden="true">
            {TRACK_STEPS.map((_, i) => (
              <span className="cam-track-seg" key={i}>
                <i style={{ width: `${Math.round(Math.min(1, Math.max(0, trackFill[i])) * 100)}%` }} />
              </span>
            ))}
          </div>
          <div className="cam-track-lbls">
            {TRACK_STEPS.map((s, i) => (
              <span key={s} className={`cam-track-lbl${activeTrackIdx === i ? ' on' : ''}${trackFill[i] >= 1 && activeTrackIdx !== i ? ' done' : ''}`}>{s}</span>
            ))}
          </div>
        </div>

        {/* viewfinder */}
        <div className="cam-vf">
          <video ref={videoRef} autoPlay playsInline muted className="cam-video mirror" />

          {phase === 'open' && !camError && <div className="cam-sweep" aria-hidden="true" />}
          {phase === 'blink' && <div key={flashKey} className="cam-blink-flash" aria-hidden="true" />}

          {/* face ring + progress arc */}
          {!camError && phase !== 'loading' && (
            <div className={`cam-frame${activeFrame ? ' active' : ''}${phase === 'blink' ? ' blink' : ''}`} aria-hidden="true">
              <svg viewBox="0 0 360 480" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="camArc" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFC98F" />
                    <stop offset="55%" stopColor="#DD8164" />
                    <stop offset="100%" stopColor="#D45A79" />
                  </linearGradient>
                  <mask id="camHole">
                    <rect width="360" height="480" fill="#fff" />
                    <ellipse cx="180" cy="210" rx="118" ry="146" fill="#000" />
                  </mask>
                </defs>
                <rect className="vignette" width="360" height="480" mask="url(#camHole)" />
                <ellipse className="ring-glow" cx="180" cy="210" rx="118" ry="146" />
                <ellipse className="ring-bg" cx="180" cy="210" rx="118" ry="146" />
                <circle
                  className="ring-arc" cx="180" cy="210" r={R}
                  strokeDasharray={C} strokeDashoffset={C * (1 - ringProgress)}
                  transform="rotate(-90 180 210) scale(0.92 1.14) translate(15.6 -25.8)"
                />
                <g className="tick">
                  <path d="M62 132 L62 108 L86 108" />
                  <path d="M298 132 L298 108 L274 108" />
                  <path d="M62 288 L62 312 L86 312" />
                  <path d="M298 288 L298 312 L274 312" />
                </g>
              </svg>
            </div>
          )}

          {/* countdown */}
          {phase === 'countdown' && countdown > 0 && (
            <div className="cam-count-wrap">
              <div className="cam-count"><span key={countdown}>{countdown}</span></div>
            </div>
          )}

          {/* blink prompt */}
          {phase === 'blink' && (
            <div className="cam-blinkburst">
              <div className="cam-blinkburst-inner">
                <span className="cam-eye"><EyeGlyph /></span>
                <span className="cam-blinkword">Blink</span>
              </div>
            </div>
          )}

          {/* loading */}
          {phase === 'loading' && !camError && (
            <div className="cam-loading">
              <span className="frg-spin white" style={{ width: 26, height: 26 }} />
              <div className="cam-loading-txt">Starting camera…</div>
            </div>
          )}

          {/* fatal camera error */}
          {camError && (
            <div className="cam-error">
              <div className="cam-error-ico">📷</div>
              <div className="cam-error-txt">{camError}</div>
              <button className="cam-retry" onClick={startCamera}>Restart camera</button>
            </div>
          )}

          {/* coach strip */}
          {!camError && phase !== 'loading' && (
            <div className="cam-coach" aria-live="polite">
              <span className="cam-coach-phase">{coach.phase}</span>
              <span key={phase} className="cam-coach-msg">{coach.msg}</span>
              {coach.hint && <span className="cam-coach-hint">{coach.hint}</span>}
              {(phase === 'blink' || phase === 'capturing') && frameCount > 0 && (
                <span className="cam-coach-frames"><i />{frameCount} FRAMES CAPTURED</span>
              )}
            </div>
          )}
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* inline recoverable error */}
        {runError && !camError && (
          <div className="cam-runerr" role="alert"><span>⚠</span><span>{runError}</span></div>
        )}

        {/* pre-start checklist */}
        {phase === 'ready' && !camError && !runError && (
          <div className="cam-checklist">
            <span className="cam-checkitem"><MiniCheck /> Only your face in frame</span>
            <span className="cam-checkitem"><MiniCheck /> Bright, even lighting</span>
            <span className="cam-checkitem"><MiniCheck /> No sunglasses or hats</span>
            <span className="cam-checkitem"><MiniCheck /> Live camera, not a photo</span>
          </div>
        )}

        <div className="cam-controls">
          <button
            className="cam-shutter"
            onClick={camError ? startCamera : runLiveCheck}
            disabled={!camError && phase !== 'ready'}
          >
            {running && !camError
              ? <><span className="frg-spin white" style={{ width: 13, height: 13 }} />{shutterLabel}</>
              : shutterLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
