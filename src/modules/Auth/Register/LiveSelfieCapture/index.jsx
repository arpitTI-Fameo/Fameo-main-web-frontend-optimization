'use client';

import { useState, useEffect, useRef } from 'react';
import { CameraOff, CircleCheck, Eye, LoaderCircle, RotateCcw, TriangleAlert, X } from 'lucide-react';

import { Button } from '@/components/ui/shadcn/button';
import { cn } from '@/utils/cn';

import { EyeGlyph } from '../icons';
import { PRIMARY } from '@/constants/authUi';

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
  const mime = (header.match(/:(.*?);/) || ['', 'image/jpeg'])[1];
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

  const shutterLabel = camError ? 'Restart camera'
    : phase === 'capturing' ? 'Capturing…'
    : phase === 'blink' ? 'Blink now…'
    : phase === 'countdown' ? 'Get ready…'
    : phase === 'open' ? 'Hold still…'
    : runError ? 'Try again'
    : 'Start live check';
  const ShutterIcon = camError || runError ? RotateCcw : Eye;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[radial-gradient(900px_700px_at_50%_12%,rgb(20_14_22/.72),rgb(20_14_22/.96))] p-4.5 backdrop-blur-[6px] animate-in fade-in-0 duration-240"
      onClick={e => e.stopPropagation()}
      role="dialog" aria-modal="true" aria-label="Live selfie verification"
    >
      <div className="w-full max-w-117.5 overflow-hidden rounded-[24px] bg-card shadow-[0_40px_100px_rgb(40_20_45/.5),0_0_0_1px_rgb(255_255_255/.06)] animate-in fade-in-0 slide-in-from-bottom-5 zoom-in-97 duration-400">

        {/* header + step track */}
        <div className="border-b border-border/70 px-4.5 pt-3.75 pb-3.25">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2.25 text-17 font-medium tracking-[-.3px] text-foreground">
              <i className="size-1.75 shrink-0 rounded-full bg-primary animate-[camLiveDot_1.9s_ease-out_infinite]" />
              Live selfie check
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7.5 shrink-0 rounded-[9px] bg-accent text-muted-foreground hover:bg-primary/15 hover:text-foreground"
              onClick={() => { abortRef.current = true; stopStream(); onClose(); }}
              aria-label="Close"
            >
              <X aria-hidden="true" className="size-4 stroke-[1.65]" />
            </Button>
          </div>
          <div className="mt-3 flex gap-1.25" aria-hidden="true">
            {TRACK_STEPS.map((_, i) => (
              <span className="relative h-0.75 flex-1 overflow-hidden rounded-[3px] bg-border" key={i}>
                <i
                  className="absolute inset-y-0 left-0 block rounded-[3px] bg-primary transition-[width] duration-250 ease-linear"
                  style={{ width: `${Math.round(Math.min(1, Math.max(0, trackFill[i])) * 100)}%` }}
                />
              </span>
            ))}
          </div>
          <div className="mt-1.5 flex gap-1.25">
            {TRACK_STEPS.map((s, i) => (
              <span
                key={s}
                className={cn(
                  'flex-1 text-center text-[8px] tracking-[.12em] text-muted-foreground/70 uppercase transition-colors duration-250',
                  activeTrackIdx === i && 'font-semibold text-primary',
                  trackFill[i] >= 1 && activeTrackIdx !== i && 'text-chart-3'
                )}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* viewfinder */}
        <div className="relative h-[clamp(400px,60vh,640px)] w-full overflow-hidden bg-[#140E16] [@media(min-height:800px)]:h-[clamp(460px,64vh,720px)]">
          <video ref={videoRef} autoPlay playsInline muted className="block size-full -scale-x-100 object-cover" />

          {phase === 'open' && !camError && (
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 z-4 h-22.5 bg-[linear-gradient(to_bottom,transparent,rgb(255_255_255/.14)_45%,rgb(233_30_99/.3)_55%,transparent)] animate-[camSweep_2.2s_cubic-bezier(.22,1,.36,1)_infinite]" />
          )}
          {phase === 'blink' && (
            <div key={flashKey} aria-hidden="true" className="pointer-events-none absolute inset-0 z-5 bg-[radial-gradient(circle_at_50%_45%,rgb(255_255_255/.35),transparent_62%)] opacity-0 animate-[camFlash_.4s_ease_both]" />
          )}

          {/* face ring + progress arc */}
          {!camError && phase !== 'loading' && (
            <div className="pointer-events-none absolute inset-0 z-3" aria-hidden="true">
              <svg viewBox="0 0 360 480" preserveAspectRatio="xMidYMid slice" className="block size-full">
                <defs>
                  <linearGradient id="camArc" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFC9DA" />
                    <stop offset="55%" stopColor="#F0588A" />
                    <stop offset="100%" stopColor="#E91E63" />
                  </linearGradient>
                  <mask id="camHole">
                    <rect width="360" height="480" fill="#fff" />
                    <ellipse cx="180" cy="210" rx="118" ry="146" fill="#000" />
                  </mask>
                </defs>
                <rect className="fill-[rgb(14_8_16/.52)]" width="360" height="480" mask="url(#camHole)" />
                <ellipse
                  className={cn(
                    'fill-none stroke-primary/35 opacity-0 blur-[6px] transition-opacity duration-350 [stroke-width:10]',
                    activeFrame && 'opacity-100',
                    phase === 'blink' && 'stroke-white/60 opacity-100'
                  )}
                  cx="180" cy="210" rx="118" ry="146"
                />
                <ellipse className="fill-none stroke-white/30 [stroke-width:2.5]" cx="180" cy="210" rx="118" ry="146" />
                <circle
                  className="fill-none transition-[stroke-dashoffset] duration-220 ease-linear [stroke-linecap:round] [stroke-width:4]"
                  stroke="url(#camArc)"
                  cx="180" cy="210" r={R}
                  strokeDasharray={C} strokeDashoffset={C * (1 - ringProgress)}
                  transform="rotate(-90 180 210) scale(0.92 1.14) translate(15.6 -25.8)"
                />
                <g className={cn('fill-none stroke-white/55 [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2.5]', activeFrame && 'stroke-[#FFC9DA]')}>
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
            <div className="pointer-events-none absolute inset-0 z-6 grid place-items-center">
              <div className="grid size-27 place-items-center rounded-full border-2 border-white/25 bg-[rgb(20_14_22/.55)] backdrop-blur-sm">
                <span key={countdown} className="text-[54px] leading-none font-semibold text-white [text-shadow:0_4px_22px_rgb(0_0_0/.6)] animate-[camCountPop_.95s_cubic-bezier(.22,1,.36,1)_both]">
                  {countdown}
                </span>
              </div>
            </div>
          )}

          {/* blink prompt */}
          {phase === 'blink' && (
            <div className="pointer-events-none absolute inset-0 z-6 grid place-items-center">
              <div className="flex flex-col items-center gap-2.5">
                <span className="grid h-12.5 w-19.5 place-items-center drop-shadow-[0_4px_16px_rgb(0_0_0/.55)] animate-[camEyeBlink_1.25s_ease-in-out_infinite]">
                  <EyeGlyph stroke="#FFFFFF" />
                </span>
                <span className="font-serif text-[27px] tracking-[-.01em] text-white italic [text-shadow:0_3px_18px_rgb(0_0_0/.7)]">Blink</span>
              </div>
            </div>
          )}

          {/* loading */}
          {phase === 'loading' && !camError && (
            <div className="absolute inset-0 z-8 flex flex-col items-center justify-center gap-3 bg-[rgb(20_14_22/.82)] p-6.5 text-center">
              <LoaderCircle aria-hidden="true" className="size-6.5 animate-spin text-white" />
              <div className="text-[12.5px] text-white/70">Starting camera…</div>
            </div>
          )}

          {/* fatal camera error */}
          {camError && (
            <div className="absolute inset-0 z-8 flex flex-col items-center justify-center gap-3 bg-[rgb(20_14_22/.82)] p-6.5 text-center">
              <CameraOff aria-hidden="true" className="size-7.5 stroke-[1.65] text-white" />
              <div className="max-w-75 text-[12.5px] leading-[1.65] text-white">{camError}</div>
              <Button type="button" variant="outline" className="mt-1.5 h-auto rounded-[10px] border-white/30 bg-white/10 px-5.5 py-2.5 text-11 font-normal text-white shadow-none hover:bg-white/20 hover:text-white" onClick={startCamera}>
                Restart camera
              </Button>
            </div>
          )}

          {/* coach strip */}
          {!camError && phase !== 'loading' && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-7 flex flex-col items-center gap-1.75 bg-[linear-gradient(to_top,rgb(20_14_22/.94)_30%,rgb(20_14_22/0))] px-4.5 pt-5.5 pb-4" aria-live="polite">
              <span className="text-[9px] font-semibold tracking-[.3em] text-[#FFB8CF] uppercase">{coach.phase}</span>
              <span key={phase} className="text-center text-base leading-[1.3] font-semibold text-white [text-shadow:0_2px_14px_rgb(0_0_0/.7)] animate-[camCoachIn_.32s_cubic-bezier(.22,1,.36,1)_both]">
                {coach.msg}
              </span>
              {coach.hint && <span className="max-w-75 text-center text-xs leading-[1.45] text-white/70">{coach.hint}</span>}
              {(phase === 'blink' || phase === 'capturing') && frameCount > 0 && (
                <span className="mt-0.75 flex items-center gap-1.5 text-[9px] tracking-[.18em] text-white/60">
                  <i className="block size-1.25 rounded-full bg-[#FFB8CF] animate-[frgPulse_1s_ease-in-out_infinite]" />
                  {frameCount} FRAMES CAPTURED
                </span>
              )}
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {/* inline recoverable error */}
        {runError && !camError && (
          <div className="flex items-start gap-2.25 border-t border-primary/20 bg-accent px-4.5 py-3 text-[12.5px] leading-normal text-accent-foreground animate-in fade-in-0 slide-in-from-bottom-2 duration-300" role="alert">
            <TriangleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            <span>{runError}</span>
          </div>
        )}

        {/* pre-start checklist */}
        {phase === 'ready' && !camError && !runError && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 px-4.5 pt-3.5 pb-1">
            {['Only your face in frame', 'Bright, even lighting', 'No sunglasses or hats', 'Live camera, not a photo'].map((t) => (
              <span key={t} className="flex items-center gap-2 text-xs text-secondary-foreground">
                <CircleCheck aria-hidden="true" className="size-3.5 shrink-0 stroke-[1.65] text-primary" />
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="px-4.5 pt-3.5 pb-4.5">
          <Button
            type="button"
            className={cn(PRIMARY, 'min-h-12 w-full gap-2.25 rounded-[14px]')}
            onClick={camError ? startCamera : runLiveCheck}
            disabled={!camError && phase !== 'ready'}
          >
            {running && !camError
              ? <LoaderCircle aria-hidden="true" className="animate-spin" />
              : <ShutterIcon aria-hidden="true" />}
            {shutterLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
