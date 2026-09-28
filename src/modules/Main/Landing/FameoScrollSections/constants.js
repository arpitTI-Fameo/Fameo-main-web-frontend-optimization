export const SHARED_PRODUCT = { img: '/assets/landing/useCases/products.png', title: 'Products', label: 'STEADYONE', saved: true };

export const RAIL_CARDS = [
  { img: '/assets/landing/useCases/resources.jpg', title: 'Resource Kit', label: 'ZOYA F.' },
  { img: '/assets/landing/useCases/community.jpg', title: 'Community', label: 'ARMAN S.' },
  { img: '/assets/landing/useCases/podcast.jpg', title: 'Podcasts', label: 'MEHER K.' },
  SHARED_PRODUCT,
];

export const GRID_PRODUCTS = [
  SHARED_PRODUCT,
  { img: '/assets/landing/products/product-02-tee.png', title: 'Creator Tee', label: 'PLAIN LABS' },
  { img: '/assets/landing/products/product-03-runner.png', title: 'Runner 360', label: 'STRIDE CO' },
  { img: '/assets/landing/products/product-05-daypack.png', title: 'Trail Daypack', label: 'NORTH LOOM' },
  { img: '/assets/landing/products/product-06-microphone.png', title: 'Studio Mic Kit', label: 'WAVEFORM' },
  { img: '/assets/landing/products/product-07-headphones.png', title: 'Monitor Headphones', label: 'LUMEN AUDIO', saved: true },
  { img: '/assets/landing/products/product-04-shell.png', title: 'Monsoon Shell', label: 'MONSOON LAB' },
  { img: '/assets/landing/products/product-08-extra.png', title: 'Field Hoodie 02', label: 'HOUSE OF STITCH' },
];

/* intro statement — split into words so each can light up on scroll */
export const INTRO_COPY = [
  { t: 'Fameo is a new network to find and collab with' },
  { t: 'verified creators.', box: true },
  { t: 'Follow the ones you trust, save favourites, plan shoots together and grow your reach — without the DMs into the void.' },
];
export const INTRO_WORDS = INTRO_COPY.flatMap(s =>
  s.t.split(' ').map(w => ({ w, box: !!s.box }))
);

/* kinetic word bands — "Grow / your / reach" with per-letter scatter */
export const KINETIC_BANDS = [
  { word: 'Grow', band: 'lime' },
  { word: 'your', band: '' },
  { word: 'reach', band: 'lime alt' },
];
/* star doodle that draws in when the "Grow" band centers (from the HTML) */
export const GROW_STAR = 'M60 10 L70 44 L104 46 L76 64 L88 100 L60 78 L32 100 L44 64 L16 46 L50 44 Z';

/* ── hand-drawn doodles cycling around "reach" ───────────────────────────
   Each: viewBox, one or more stroke paths (drawn in via pathLength), and
   a position relative to the word (em units, so they scale with it).    */
export const TASTE_DOODLES = [
  { /* flower / star burst */
    viewBox: '0 0 100 100',
    pos: { top: '-0.62em', left: '0.08em', width: '0.72em', height: '0.72em' },
    paths: [
      'M50 12 C40 30 28 36 14 38 C30 44 38 52 42 68 C50 54 60 46 84 44 C66 38 58 30 50 12 Z',
      'M46 40 a6 6 0 1 0 9 4',
    ],
  },
  { /* tangled scribble — bottom-left */
    viewBox: '0 0 100 100',
    pos: { left: '-0.78em', bottom: '-0.32em', width: '0.82em', height: '0.82em' },
    paths: [
      'M10 60 C20 30 55 30 60 50 C64 66 30 74 22 58 C14 42 44 34 58 44 C74 54 60 78 36 72 C18 68 12 74 30 80',
    ],
  },
  { /* swoosh arc — sweeping off the final letter */
    viewBox: '0 0 100 100',
    pos: { right: '-0.92em', top: '-0.5em', width: '1em', height: '1em' },
    paths: [
      'M8 72 C40 80 78 62 92 22',
      'M92 22 C86 27 80 29 73 29 M92 22 C91 30 92 37 95 43',
    ],
  },
  { /* thread weaving through the letters, with a loop */
    viewBox: '0 0 300 100',
    pos: { left: '0.12em', bottom: '-0.42em', width: '2.6em', height: '0.86em' },
    paths: [
      'M6 30 C60 70 120 20 160 55 C176 70 200 74 208 60 C214 48 196 44 190 56 C184 70 220 78 294 60',
      'M150 90 l7 -12 M167 92 l2 -13',
    ],
  },
  { /* noodle bowl + chopsticks — left of the word */
    viewBox: '0 0 100 120',
    pos: { left: '-1.05em', top: '-0.25em', width: '0.95em', height: '1.15em' },
    paths: [
      'M18 70 C18 94 82 94 82 70 C87 66 88 59 83 57 C60 48 30 50 17 57 C12 60 13 67 18 70 Z',
      'M30 62 C40 52 62 54 68 62 C58 68 40 68 34 60 C44 50 66 50 70 58',
      'M44 8 L52 58 M59 6 L56 56',
    ],
  },
];

export const COLLECTIONS = [
  {
    name: 'Wedding Reels',
    by: 'Zoya Fernandes',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1800&q=80',
  },
  {
    name: 'Street Style Delhi',
    by: 'Arman Sheikh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1800&q=80',
  },
  {
    name: 'Home Studio Setups',
    by: 'Kabir Anand',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1800&q=80',
  },
  {
    name: 'Mumbai Food Crawl',
    by: 'Meher Kapoor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1800&q=80',
  },
  {
    name: 'Sunrise Rides',
    by: 'Ishaan Verma',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1800&q=80',
  },
  {
    name: 'Camera Bag Essentials',
    by: 'Priya Nair',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1800&q=80',
  },
  {
    name: 'Monsoon Blooms',
    by: 'Sana Qureshi',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1800&q=80',
  },
  {
    name: 'Festival Fits',
    by: 'Rohan Iyer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1800&q=80',
  },
  {
    name: 'Dream Studios',
    by: 'Tara Menon',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1800&q=80',
  },
];

/* ── outro "O" cycle — doodle art and photos alternate inside the O ─────── */
export const O_MEDIA = [
  { t: 'd', i: 4 },  // noodle bowl doodle
  { t: 'i', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { t: 'd', i: 0 },  // flower burst
  { t: 'i', src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
  { t: 'd', i: 1 },  // tangled scribble
  { t: 'i', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' },
  { t: 'd', i: 2 },  // swoosh
  { t: 'i', src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80' },
];

/* ── CSS ─────────────────────────────────────────────────────────────────── */
