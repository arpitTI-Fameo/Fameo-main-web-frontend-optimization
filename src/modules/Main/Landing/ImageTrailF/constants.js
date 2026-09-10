export const POOL = [
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=520&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=520&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=520&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=520&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=520&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=520&q=80',
  'https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?w=520&q=80',
  'https://images.unsplash.com/photo-1495805442109-bf1cf975750b?w=520&q=80',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=520&q=80',
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=520&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=520&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=520&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=520&q=80',
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=520&q=80',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=520&q=80',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=520&q=80',
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=520&q=80',
  'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=520&q=80',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=520&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=520&q=80',
];

// ─── Fixed F-shaped slot map (offsets from cluster center = cursor) ──────────
// Big tiles form the F (spine + two arms, overlapping like the screenshot),
// tiny satellites blink at the fringes. rate = [min,max] ms between the
// arrival of each NEW covering image in that slot (lower = faster churn).
export const F_SLOTS = [
  // spine (top → bottom) — large overlapping tiles
  { dx: -110, dy: -165, w: 150, h: 175, z: 5, rate: [600, 1000] },
  { dx: -125, dy:  -45, w: 160, h: 170, z: 6, rate: [650, 1050] },
  { dx: -112, dy:   75, w: 148, h: 178, z: 5, rate: [600, 1000] },
  { dx: -122, dy:  190, w: 152, h: 165, z: 4, rate: [650, 1050] },
  // top arm (left → right)
  { dx:    5, dy: -175, w: 132, h: 115, z: 4, rate: [550,  900] },
  { dx:  115, dy: -168, w: 112, h: 130, z: 3, rate: [550,  900] },
  { dx:  205, dy: -175, w:  90, h:  80, z: 2, rate: [520,  850] },
  // middle arm (left → right)
  { dx:    0, dy:  -50, w: 122, h: 138, z: 4, rate: [550,  900] },
  { dx:  100, dy:  -58, w: 100, h:  86, z: 3, rate: [520,  850] },
  // tiny satellites — quick blinking thumbs at the fringes
  { dx: -230, dy: -230, w: 40, h: 32, z: 1, rate: [450,  750] },
  { dx:  260, dy: -110, w: 34, h: 40, z: 1, rate: [450,  750] },
  { dx:  -55, dy:  120, w: 36, h: 44, z: 1, rate: [450,  750] },
  { dx:  -70, dy:  285, w: 38, h: 30, z: 1, rate: [450,  750] },
  { dx:   55, dy:  110, w: 32, h: 38, z: 1, rate: [450,  750] },
  { dx: -245, dy:  120, w: 36, h: 28, z: 1, rate: [450,  750] },
];

export const GROW_MS = 340; // enter-from-right grow duration (matches CSS .34s)
export const EXIT_MS = 380; // exit-to-left shrink duration (matches CSS .38s)
export const EASE    = 0.09; // cursor-follow lag (lower = lazier)

// How long to wait before re-checking whether the section came back on screen.
export const IDLE_POLL_MS = 700;
