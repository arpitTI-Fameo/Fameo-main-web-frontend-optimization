'use client';

import { useEffect, useState } from 'react';
import { POOL, EXIT_MS, IDLE_POLL_MS } from '../constants';

let uid = 0;

// ─── One slot: always occupied; new images keep growing over old ────────
// `activeRef` is a shared { current: boolean } owned by the section. When it
// flips false (section off screen or tab hidden) the slot stops pulling new
// images and just re-checks periodically. The rendered stack is left exactly
// as it is, so resuming looks like the churn never stopped.

export default function SlotStack({ slot, index, activeRef }) {
  // stack bottom→top; bottom = current full-size image, top = incoming grower
  const [stack, setStack] = useState(() => [
    { id: ++uid, src: POOL[(index * 3) % POOL.length], phase: 'still' },
  ]);

  useEffect(() => {
    let alive = true;
    const timers = new Set();
    const t = (fn, ms) => {
      const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
      timers.add(id);
      return id;
    };
    const [min, max] = slot.rate;
    let poolCursor = index * 3;

    const cycle = () => {
      if (!alive) return;

      // Paused: don't fetch anything, just check back shortly.
      if (activeRef && !activeRef.current) {
        t(cycle, IDLE_POLL_MS);
        return;
      }

      poolCursor = (poolCursor + 7 + Math.floor(Math.random() * 5)) % POOL.length;
      const layer = { id: ++uid, src: POOL[poolCursor], phase: 'grow' };

      // new image enters from the RIGHT (growing) while the current one
      // starts its EXIT to the LEFT (shrinking) — right→left travel feel,
      // and the slot is never empty so the F shape holds.
      setStack(s => [
        ...s.map(l => (l.phase !== 'exit' ? { ...l, phase: 'exit' } : l)),
        layer,
      ].slice(-3));

      // remove exited layers once their slide-out finishes
      t(() => {
        if (!alive) return;
        setStack(s => {
          const kept = s.filter(l => l.phase !== 'exit');
          return kept.length ? kept : s.slice(-1);
        });
      }, EXIT_MS + 60);

      // schedule the next image — fast, randomized, non-stop
      t(cycle, min + Math.random() * (max - min));
    };

    // staggered start so slots churn out of sync (organic, like the video)
    t(cycle, 200 + index * 130 + Math.random() * 400);

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, [index, slot.rate, activeRef]);

  return (
    <div
      className="ftrail-slot"
      style={{
        left: slot.dx,
        top: slot.dy,
        width: slot.w,
        height: slot.h,
        zIndex: slot.z,
      }}
    >
      {stack.map(layer => (
        <div key={layer.id} className={`ftrail-layer ${layer.phase === 'grow' ? 'grow' : layer.phase === 'exit' ? 'exit' : ''}`}>
          <img src={layer.src} alt="" loading="lazy" decoding="async" draggable={false} />
        </div>
      ))}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
