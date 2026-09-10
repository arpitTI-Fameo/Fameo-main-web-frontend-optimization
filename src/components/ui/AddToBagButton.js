'use client';
// components/ui/AddToBagButton.js
// Morphing add-to-bag button.
//
// States: idle → adding → added → idle. The label slides out upward while the
// next one slides in from below, a coral sweep fills the button left-to-right,
// and an SVG checkmark draws itself with a stroke-dashoffset animation. A ripple
// originates from the actual click point rather than the centre.
//
// Style-agnostic: it takes the caller's className so the existing .ss-pc-quick /
// .ss-list-btn / .cs-card-add rules still apply, and layers the effects on top.

import { useCallback, useEffect, useRef, useState } from 'react';

const S = `
  .atb {
    position: relative;
    overflow: hidden;
    isolation: isolate;
    -webkit-tap-highlight-color: transparent;
    transition: transform .18s cubic-bezier(.34,1.56,.64,1);
  }
  .atb:active { transform: scale(.97); }

  /* The coral sweep that fills behind the label on success */
  .atb-sweep {
    position: absolute; inset: 0;
    transform: scaleX(0); transform-origin: left center;
    z-index: -1;
    background: linear-gradient(90deg,#2eaa68 0%,#37c079 100%);
  }
  .atb.is-added .atb-sweep {
    animation: atbSweep .52s cubic-bezier(.65,0,.35,1) forwards;
  }
  .atb.is-error .atb-sweep {
    background: linear-gradient(90deg,#E8A33D 0%,#f0b45c 100%);
    animation: atbSweep .42s cubic-bezier(.65,0,.35,1) forwards;
  }
  @keyframes atbSweep {
    0%   { transform: scaleX(0);   transform-origin: left center;  }
    60%  { transform: scaleX(1);   transform-origin: left center;  }
    100% { transform: scaleX(1);   transform-origin: left center;  }
  }
  .atb.is-added, .atb.is-error {
    color: #fff !important;
    border-color: transparent !important;
  }

  /* Label carousel — old slides up and out, new rises from below */
  .atb-labels { position: relative; display: block; overflow: hidden; }
  .atb-label {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    white-space: nowrap;
  }
  .atb-label.enter { animation: atbIn .34s cubic-bezier(.22,1,.36,1) both; }
  @keyframes atbIn {
    from { transform: translateY(105%); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }

  /* Checkmark draws itself */
  .atb-check { width: 13px; height: 13px; flex-shrink: 0; }
  .atb-check path {
    stroke: currentColor; stroke-width: 2.4; fill: none;
    stroke-linecap: round; stroke-linejoin: round;
    stroke-dasharray: 22; stroke-dashoffset: 22;
    animation: atbDraw .42s cubic-bezier(.65,0,.35,1) .16s forwards;
  }
  @keyframes atbDraw { to { stroke-dashoffset: 0; } }

  /* Three-dot loader for the brief adding state */
  .atb-dots { display: inline-flex; gap: 3px; }
  .atb-dots i {
    width: 3px; height: 3px; border-radius: 50%;
    background: currentColor; display: block;
    animation: atbDot .9s ease-in-out infinite;
  }
  .atb-dots i:nth-child(2) { animation-delay: .15s; }
  .atb-dots i:nth-child(3) { animation-delay: .3s;  }
  @keyframes atbDot {
    0%,100% { opacity: .28; transform: translateY(0);    }
    50%     { opacity: 1;   transform: translateY(-2px); }
  }

  /* Ripple from the click point */
  .atb-ripple {
    position: absolute; border-radius: 50%;
    background: currentColor; opacity: .22;
    transform: scale(0); pointer-events: none;
    animation: atbRipple .62s cubic-bezier(.16,1,.3,1) forwards;
  }
  @keyframes atbRipple { to { transform: scale(2.6); opacity: 0; } }

  @media (prefers-reduced-motion: reduce) {
    .atb, .atb-sweep, .atb-label, .atb-check path, .atb-ripple {
      animation: none !important; transition: none !important;
    }
    .atb.is-added .atb-sweep, .atb.is-error .atb-sweep { transform: scaleX(1); }
    .atb-check path { stroke-dashoffset: 0; }
  }
`;

const Check = () => (
  <svg className="atb-check" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 12.5 L9.5 18 L20 6.5" />
  </svg>
);

const Dots = () => (
  <span className="atb-dots" aria-hidden="true"><i /><i /><i /></span>
);

/**
 * @param {() => any}  onAdd        should return the cartStore result object
 * @param {string}     label        idle label
 * @param {string}     addedLabel
 * @param {string}     className    caller's own button classes
 */
export default function AddToBagButton({
  onAdd,
  label = 'Add to Bag',
  addedLabel = 'Added to Cart',
  className = '',
  disabled = false,
  ...rest
}) {
  const [state, setState]   = useState('idle');   // idle | adding | added | error
  const [errText, setErr]   = useState('');
  const [ripples, setRip]   = useState([]);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const handleClick = useCallback((e) => {
    if (disabled || state === 'adding') return;

    // Ripple anchored to the pointer, not the button centre.
    const r = e.currentTarget.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const id = Date.now();
    setRip((rs) => [...rs, {
      id, size,
      x: e.clientX - r.left - size / 2,
      y: e.clientY - r.top  - size / 2,
    }]);
    timers.current.push(setTimeout(
      () => setRip((rs) => rs.filter((x) => x.id !== id)), 640
    ));

    timers.current.forEach(clearTimeout);
    setState('adding');

    // A beat of "adding" makes the success read as a response rather than an
    // instant flicker — the store update itself is synchronous.
    timers.current.push(setTimeout(() => {
      const res = onAdd?.(e);
      const ok  = res?.ok ?? true;

      if (!ok) {
        setErr(res?.status === 'at-max' ? 'Max stock' : 'Unavailable');
        setState('error');
        timers.current.push(setTimeout(() => setState('idle'), 1700));
        return;
      }

      setState('added');
      timers.current.push(setTimeout(() => setState('idle'), 1900));
    }, 170));
  }, [onAdd, disabled, state]);

  const content =
    state === 'adding' ? <Dots />
  : state === 'added'  ? <><Check />{addedLabel}</>
  : state === 'error'  ? <>{errText}</>
  : label;

  return (
    <>
      <style>{S}</style>
      <button
        {...rest}
        disabled={disabled}
        onClick={handleClick}
        className={`atb ${className}${state === 'added' ? ' is-added' : ''}${state === 'error' ? ' is-error' : ''}`}
      >
        <span className="atb-sweep" aria-hidden="true" />
        <span className="atb-labels">
          <span className="atb-label enter" key={state}>{content}</span>
        </span>
        {ripples.map((r) => (
          <span
            key={r.id}
            className="atb-ripple"
            style={{ width: r.size, height: r.size, left: r.x, top: r.y }}
          />
        ))}
      </button>
    </>
  );
}