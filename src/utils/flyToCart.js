// lib/flyToCart.js
// Premium "add to bag" flight animation.
//
// Clones the product image and arcs it into the bag icon, then pulses the bag.
// Built on the Web Animations API — no library, no React re-renders, and it
// runs entirely on the compositor (transform + opacity only) so it stays at
// 60fps even while the cart store is updating and the drawer is mounting.
//
// The arc is produced with the classic two-element trick: an outer wrapper
// translates on X with an ease-out curve while an inner element translates on Y
// with an ease-in curve. Composed, they trace a natural parabola — far better
// than a linear tween and far cheaper than animating along an offset-path.

const ANCHOR_SELECTOR = '[data-cart-anchor]';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Find the bag icon to fly into. Returns null if it isn't on screen. */
const getAnchor = () => {
  const el = document.querySelector(ANCHOR_SELECTOR);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  // Anchor scrolled out of view — skip the flight, the toast still fires.
  if (r.bottom < 0 || r.top > window.innerHeight) return null;
  return el;
};

/** Ripple + squash-stretch pulse on the bag once the parcel lands. */
export const pulseCartAnchor = () => {
  const anchor = getAnchor();
  if (!anchor || prefersReducedMotion()) return;

  // Squash-and-stretch: the bag compresses under the parcel's weight, then
  // rebounds. Non-uniform scaling is what makes it feel like it received
  // something with mass rather than just blinking.
  anchor.animate(
    [
      { transform: 'scale(1, 1)' },
      { transform: 'scale(1.34, 0.82)', offset: 0.22 },
      { transform: 'scale(0.88, 1.18)', offset: 0.44 },
      { transform: 'scale(1.08, 0.95)', offset: 0.64 },
      { transform: 'scale(0.98, 1.02)', offset: 0.82 },
      { transform: 'scale(1, 1)' },
    ],
    { duration: 720, easing: 'cubic-bezier(.34,1.56,.64,1)' }
  );

  const c = anchor.getBoundingClientRect();
  const cx = c.left + c.width / 2;
  const cy = c.top + c.height / 2;

  // Spark burst — six hairline shards flung outward on a spring. Subtle enough
  // to read as a flourish rather than confetti.
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6 + Math.random() * 0.4;
    const dist  = 22 + Math.random() * 14;
    const spark = document.createElement('span');
    Object.assign(spark.style, {
      position: 'fixed', left: `${cx}px`, top: `${cy}px`,
      width: '2px', height: '2px', borderRadius: '50%',
      background: i % 2 ? '#E8457A' : '#DD8164',
      pointerEvents: 'none', zIndex: 10002,
    });
    document.body.appendChild(spark);
    spark.animate(
      [
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        {
          transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0)`,
          opacity: 0,
        },
      ],
      { duration: 560 + Math.random() * 180, easing: 'cubic-bezier(.16,1,.3,1)' }
    ).addEventListener('finish', () => spark.remove());
  }

  // Expanding hairline ring — reads as "received" without being loud.
  const ring = document.createElement('span');
  Object.assign(ring.style, {
    position: 'fixed',
    left: `${cx}px`,
    top: `${cy}px`,
    width: '10px',
    height: '10px',
    marginLeft: '-5px',
    marginTop: '-5px',
    borderRadius: '50%',
    border: '1.5px solid #DD8164',
    pointerEvents: 'none',
    zIndex: 10002,
  });
  document.body.appendChild(ring);

  ring
    .animate(
      [
        { transform: 'scale(1)', opacity: 0.9 },
        { transform: 'scale(5.5)', opacity: 0 },
      ],
      { duration: 700, easing: 'cubic-bezier(.16,1,.3,1)' }
    )
    .addEventListener('finish', () => ring.remove());
};

/**
 * Fly a product image into the bag.
 *
 * @param {HTMLElement} sourceEl  the element to launch from (the product image)
 * @param {{ imageUrl?: string }} opts
 * @returns {Promise<void>} resolves when the parcel lands
 */
export function flyToCart(sourceEl, { imageUrl } = {}) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !sourceEl) return resolve();

    const anchor = getAnchor();
    // No anchor (mobile layout, scrolled away) or reduced motion → land instantly
    // so the caller's toast/drawer sequencing is unaffected.
    if (!anchor || prefersReducedMotion()) {
      pulseCartAnchor();
      return resolve();
    }

    const from = sourceEl.getBoundingClientRect();
    const to   = anchor.getBoundingClientRect();
    if (!from.width || !from.height) return resolve();

    const src =
      imageUrl ||
      (sourceEl.tagName === 'IMG' ? sourceEl.src : null) ||
      sourceEl.querySelector('img')?.src;

    // ── Outer wrapper: owns the X translation ────────────────────────────────
    const wrap = document.createElement('div');
    Object.assign(wrap.style, {
      position: 'fixed',
      left: `${from.left}px`,
      top: `${from.top}px`,
      width: `${from.width}px`,
      height: `${from.height}px`,
      pointerEvents: 'none',
      zIndex: 10001,
      willChange: 'transform',
    });

    // ── Inner: owns the Y translation, scale, rotation and the visual ────────
    const inner = document.createElement('div');
    Object.assign(inner.style, {
      width: '100%',
      height: '100%',
      borderRadius: '4px',
      overflow: 'hidden',
      background: '#F7F7FA',
      boxShadow: '0 18px 44px rgba(17,17,24,.28), 0 0 0 1px rgba(255,255,255,.6)',
      willChange: 'transform, opacity',
    });

    if (src) {
      const img = document.createElement('img');
      img.src = src;
      Object.assign(img.style, {
        width: '100%', height: '100%', objectFit: 'cover', display: 'block',
      });
      inner.appendChild(img);
    } else {
      inner.style.background =
        'linear-gradient(135deg,#DD8164 0%,#E8457A 100%)';
    }

    // Soft radial glow travelling with the parcel — gives it presence against
    // busy product photography without a hard border.
    const glow = document.createElement('div');
    Object.assign(glow.style, {
      position: 'absolute', inset: '-40%',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(221,129,100,.42) 0%, rgba(232,69,122,.16) 45%, transparent 70%)',
      filter: 'blur(10px)',
      zIndex: '-1',
    });

    wrap.appendChild(glow);
    wrap.appendChild(inner);
    document.body.appendChild(wrap);

    // The source card recoils slightly — the image "leaves", so the space it
    // came from reacts. Small, but it's what sells the parcel as a real object.
    const card = sourceEl.closest?.('.ss-pc, .cs-card, .ss-list-row, .ps-sheet') || sourceEl;
    card.animate?.(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(.972)', offset: 0.35 },
        { transform: 'scale(1)' },
      ],
      { duration: 520, easing: 'cubic-bezier(.34,1.56,.64,1)' }
    );

    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);

    const DURATION = 780;

    // X: decelerating — the parcel covers most horizontal distance early.
    const ax = wrap.animate(
      [{ transform: 'translateX(0)' }, { transform: `translateX(${dx}px)` }],
      { duration: DURATION, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' }
    );

    // Y: accelerating — gravity. Combined with the X curve this is the arc.
    // Scale and rotation ride along on the same element.
    const ay = inner.animate(
      [
        { transform: 'translateY(0) scale(1) rotate(0deg)',            opacity: 1 },
        { transform: `translateY(${dy * 0.42}px) scale(.62) rotate(-7deg)`, opacity: 1, offset: 0.55 },
        { transform: `translateY(${dy}px) scale(.16) rotate(-14deg)`,  opacity: 0.15 },
      ],
      { duration: DURATION, easing: 'cubic-bezier(.55,.06,.68,.19)', fill: 'forwards' }
    );

    // ── Vapour trail: a few ghosts that fade as the parcel passes ────────────
    const trails = [];
    [0.18, 0.34, 0.5].forEach((delay, i) => {
      const t = inner.cloneNode(true);
      Object.assign(t.style, {
        position: 'absolute', inset: '0', boxShadow: 'none',
        opacity: String(0.22 - i * 0.05), filter: 'blur(1.5px)',
      });
      wrap.appendChild(t);
      trails.push(
        t.animate(
          [
            { transform: 'translateY(0) scale(1)', opacity: 0.22 - i * 0.05 },
            { transform: `translateY(${dy}px) scale(.16)`, opacity: 0 },
          ],
          {
            duration: DURATION,
            delay: -delay * 120,
            easing: 'cubic-bezier(.55,.06,.68,.19)',
            fill: 'forwards',
          }
        )
      );
    });

    glow.animate(
      [
        { opacity: 0, transform: 'scale(.6)' },
        { opacity: 1, transform: 'scale(1)', offset: 0.25 },
        { opacity: 0, transform: 'scale(.2)' },
      ],
      { duration: DURATION, easing: 'ease-out', fill: 'forwards' }
    );

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      wrap.remove();
      pulseCartAnchor();
      resolve();
    };

    ay.addEventListener('finish', finish);
    // Belt and braces — if the tab is backgrounded mid-flight WAAPI may never
    // fire `finish`, which would leave the clone stuck on the page.
    setTimeout(finish, DURATION + 240);

    void ax; void trails;
  });
}

export default flyToCart;