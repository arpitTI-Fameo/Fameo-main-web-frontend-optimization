// modules/Main/Products/ProductDetails/constants.js
// Dummy catalogue for the product detail page, scoped to this feature.
//
// It deliberately does NOT re-declare the products. @/constants/mockData
// already owns the nine storefront rows (name, category, price, rating,
// images, specs); this file layers the SKU-level record on top of each by id —
// the fields the detail page needs and a listing card never did.
//
// Shape follows the Products service contract (SiteProduct / SiteSku): a group
// carries the variant axes, the SKU carries money, identifiers, dimensions and
// stock. Two deliberate differences from that contract, because this is view
// data and not the wire format:
//   • money is in RUPEES, not paise — every price in this app goes through
//     inr() from @/utils/formatCurrency, which expects rupees.
//   • gstRate is the integer slab (18), never the sheet's "GST 18%" string.

/* ── tabs ─────────────────────────────────────────────────────────────────
   The strip under the gallery. Bodies are assembled per product by
   buildDetailTabs() in ./helpers — only the identity and label live here. */
export const DETAIL_TABS = [
  { id: 'description', label: 'Description'      },
  { id: 'dimensions',  label: 'Dimensions'       },
  { id: 'materials',   label: 'Materials & care' },
  { id: 'shipping',    label: 'Shipping'         },
];

export const [{ id: DETAIL_DEFAULT_TAB }] = DETAIL_TABS;

/* Care and shipping are site-wide policy, not per-product facts — one copy,
   read by every SKU's tab body. */
export const DETAIL_CARE_BODY = [
  'Wipe the housing with a dry microfibre cloth. Solvents lift the matte coating and leave a shine that will not buff out.',
  'Store the kit in its case with the desiccant sachet between shoots. Anything with a glass element should come back to room temperature before the case is opened.',
];

export const DETAIL_SHIPPING = {
  body: [
    'Dispatched from the Bengaluru warehouse. Orders placed before 2pm IST on a working day leave the same evening.',
    'Every parcel ships insured for its full declared value and arrives with a GST invoice in the box and in your account.',
  ],
  specs: [
    { label: 'Courier',  value: 'Blue Dart / Delhivery Surface' },
    { label: 'Packing',  value: 'Double-walled carton, foam cradle' },
    { label: 'Returns',  value: '10-day return, unopened seal' },
    { label: 'Warranty', value: 'Claimed in-app, no receipt needed' },
  ],
};

/* ── section copy ─────────────────────────────────────────────────────── */
export const DETAIL_REVIEWS = {
  title: 'Customer reviews',
  countLabel: (n) => `Based on ${n} reviews`,
};

export const DETAIL_RELATED = {
  title: 'You may also like',
  limit: 4,
};

export const DETAIL_NEWSLETTER = {
  title: 'Stay in the loop',
  subtitle:
    'New arrivals, restocks and stories from the studio — once a month, never more.',
  placeholder: 'Enter your email',
  cta: 'Subscribe',
  done: 'Subscribed',
};

export const DETAIL_ADD_TO_CART = {
  label: 'Add to cart',
  added: 'Added to bag',
};

export const DETAIL_WISHLIST = {
  add: 'Add to wishlist',
  remove: 'Saved to wishlist',
};

/* Star rating is out of five everywhere on the storefront. */
export const DETAIL_MAX_RATING = 5;

/* ── SKU records, keyed by the mockData product id ────────────────────── */
export const DETAIL_SKUS = {
  1: {
    sku: 'FMO-LUM-PRO-18D',
    brand: 'Fameo Studio',
    manufacturer: 'Fameo Instruments Pvt. Ltd.',
    countryOfOrigin: 'IN',
    gstRate: 18,
    unit: 'numbers',
    leadTime: 'Delivered in 2–4 working days',
    identifiers: { model: 'LP-18D', hsn: '94054090', ean: '8901938472013', globalProductNumber: 'GP-40118203' },
    dimensions: { length: 46, width: 46, height: 180, unit: 'cm' },
    weight: '3.2 kg',
    packedWeight: '5.4 kg',
    variantAxes: [
      {
        id: 'finish',
        label: 'Finish',
        type: 'swatch',
        values: [
          { value: 'graphite', label: 'Graphite', hex: '#3A3A3D' },
          { value: 'ivory',    label: 'Ivory',    hex: '#EDE7DC' },
          { value: 'bronze',   label: 'Bronze',   hex: '#A9722F' },
        ],
      },
      {
        id: 'kit',
        label: 'Kit',
        type: 'pill',
        values: [
          { value: 'head',  label: 'Head only' },
          { value: 'stand', label: '+ C-stand' },
          { value: 'case',  label: '+ Flight case' },
        ],
      },
    ],
    highlights: [
      'Flicker-free down to 1/8000s shutter',
      'Stepless 2700K–6500K on one dial',
      'Free white-glove setup in metros',
      '3-year driver warranty',
    ],
    description: [
      'The Lumière Pro is built around a die-cast aluminium yoke and a driver board that holds its colour point as the panel heats — the reason the last hour of a shoot still matches the first.',
      'Dual 18-inch rings sit on a stepless Kelvin dial that moves silently from candlelight to daylight, with a remote dimmer that reaches the head from across the floor.',
    ],
    materials: [
      { label: 'Housing',  value: 'Die-cast aluminium, matte anodised' },
      { label: 'Diffuser', value: 'Opal PMMA, 92% transmission' },
      { label: 'Yoke',     value: 'Steel, powder-coated' },
      { label: 'Cable',    value: '5m braided, locking IEC' },
    ],
    ratingBreakdown: { 5: 78, 4: 16, 3: 4, 2: 1, 1: 1 },
    reviews: [
      { id: 'r1', rating: 5, title: 'Worth every rupee', body: 'Sturdy, beautifully made, and the colour is exactly where the dial says it is. Two of us had it assembled in about ten minutes.', author: 'Maya R.' },
      { id: 'r2', rating: 5, title: 'My set finally looks finished', body: 'The diffusion is soft without being flat and it does not pill under the camera. Delivery team was careful and tidy.', author: 'Theo B.' },
      { id: 'r3', rating: 4, title: 'Lovely light, slow delivery', body: 'The unit itself is excellent and very even. Shipping took longer than the estimate, but support kept me updated.', author: 'Priya N.' },
    ],
    related: [3, 9, 5],
  },

  2: {
    sku: 'FMO-VLV-XM-CRD',
    brand: 'Velvet Audio',
    manufacturer: 'Velvet Acoustics Co.',
    countryOfOrigin: 'JP',
    gstRate: 18,
    unit: 'numbers',
    leadTime: 'Delivered in 2–3 working days',
    identifiers: { model: 'VXM-1', hsn: '85181000', upc: '019283746510', asin: 'B0CX41KQ7P' },
    dimensions: { length: 5.2, width: 5.2, height: 18.4, unit: 'cm' },
    weight: '540 g',
    packedWeight: '1.3 kg',
    variantAxes: [
      {
        id: 'colour',
        label: 'Colour',
        type: 'swatch',
        values: [
          { value: 'midnight', label: 'Midnight', hex: '#1B1B20' },
          { value: 'pearl',    label: 'Pearl',    hex: '#E8E6E1' },
        ],
      },
      {
        id: 'bundle',
        label: 'Bundle',
        type: 'pill',
        values: [
          { value: 'mic',  label: 'Mic only' },
          { value: 'arm',  label: '+ Boom arm' },
          { value: 'full', label: '+ Arm & shield' },
        ],
      },
    ],
    highlights: [
      'USB-C and XLR on the same body',
      'Shock mount and pop filter included',
      '-10dB pad for loud sources',
      '2-year capsule warranty',
    ],
    description: [
      'A large-diaphragm cardioid capsule tuned for speech, hung in an internal shock cradle so desk knocks never reach the recording.',
      'One body, two paths: USB-C straight into an edit, or XLR into an interface when the session grows. The pad handles anything you can shout at it.',
    ],
    materials: [
      { label: 'Capsule', value: '34mm gold-sputtered diaphragm' },
      { label: 'Body',    value: 'Zinc alloy, brushed' },
      { label: 'Grille',  value: 'Triple-layer steel mesh' },
      { label: 'Mount',   value: 'Internal elastomer cradle' },
    ],
    ratingBreakdown: { 5: 74, 4: 19, 3: 5, 2: 1, 1: 1 },
    reviews: [
      { id: 'r1', rating: 5, title: 'Broadcast clean out of the box', body: 'No interface, no processing, and it already sounds like the podcast I wanted to make. The pad saved a very loud guest.', author: 'Devin K.' },
      { id: 'r2', rating: 5, title: 'The shock mount is the story', body: 'I type through half my recordings and none of it lands on the track. That alone justified the upgrade.', author: 'Anika S.' },
      { id: 'r3', rating: 4, title: 'Great mic, short cable', body: 'Sound is genuinely excellent. The supplied USB-C cable is a metre shorter than I needed on a standing desk.', author: 'Rahul M.' },
    ],
    related: [6, 1, 7],
  },

  3: {
    sku: 'FMO-AUR-ELT-6090',
    brand: 'Fameo Studio',
    manufacturer: 'Fameo Instruments Pvt. Ltd.',
    countryOfOrigin: 'CN',
    gstRate: 18,
    unit: 'numbers',
    leadTime: 'Delivered in 3–5 working days',
    identifiers: { model: 'AE-6090', hsn: '94054090', ean: '8901938472099' },
    dimensions: { length: 90, width: 60, height: 22, unit: 'cm' },
    weight: '4.1 kg',
    packedWeight: '7.2 kg',
    variantAxes: [
      {
        id: 'mount',
        label: 'Mount',
        type: 'pill',
        values: [
          { value: 'bowens', label: 'Bowens S' },
          { value: 'profoto', label: 'Profoto' },
        ],
      },
      {
        id: 'size',
        label: 'Size',
        type: 'pill',
        values: [
          { value: '60x90',  label: '60×90cm' },
          { value: '90x120', label: '90×120cm' },
          { value: 'strip',  label: '30×140 strip' },
        ],
      },
    ],
    highlights: [
      '2,048 LEDs, CRI 97+',
      'Barndoors and grid in the box',
      'Opens and folds like an umbrella',
      'Free delivery over ₹4,999',
    ],
    description: [
      'A bi-colour panel behind a two-stop diffusion stack, so the wash reaches the subject already soft — no bounce board, no second stand.',
      'The frame opens like an umbrella and locks, which means a one-person set-up in under a minute and a fold-down that fits the supplied case.',
    ],
    materials: [
      { label: 'Frame',      value: 'Fibreglass ribs, steel hub' },
      { label: 'Skin',       value: 'Heat-resistant nylon, silver lined' },
      { label: 'Diffusion',  value: 'Two removable layers' },
      { label: 'Speed ring', value: 'Cast aluminium, rotating' },
    ],
    ratingBreakdown: { 5: 69, 4: 22, 3: 6, 2: 2, 1: 1 },
    reviews: [
      { id: 'r1', rating: 5, title: 'One-minute set-up, genuinely', body: 'I time it now. Out of the bag and lit in about fifty seconds, on my own, every time.', author: 'Nadia F.' },
      { id: 'r2', rating: 4, title: 'Beautiful light, heavy head', body: 'The quality is not in question. Pair it with a proper stand — my light one could not hold it at full extension.', author: 'Joel T.' },
      { id: 'r3', rating: 5, title: 'Skin tones look right', body: 'Switched from a cheap panel and the difference in how faces render is immediate. The grid is a real grid, not a token one.', author: 'Simran B.' },
    ],
    related: [1, 5, 9],
  },

  4: {
    sku: 'FMO-OBS-RAIL-100',
    brand: 'Obsidian Motion',
    manufacturer: 'Obsidian Motion Systems',
    countryOfOrigin: 'TH',
    gstRate: 18,
    unit: 'numbers',
    leadTime: 'Delivered in 4–6 working days',
    identifiers: { model: 'OR-100M', hsn: '90065900', asin: 'B0D2M8YV3T' },
    dimensions: { length: 104, width: 14, height: 11, unit: 'cm' },
    weight: '2.8 kg',
    packedWeight: '5.9 kg',
    variantAxes: [
      {
        id: 'length',
        label: 'Rail length',
        type: 'pill',
        values: [
          { value: '60',  label: '60cm' },
          { value: '100', label: '100cm' },
          { value: '150', label: '150cm' },
        ],
      },
      {
        id: 'drive',
        label: 'Drive',
        type: 'pill',
        values: [
          { value: 'manual', label: 'Manual' },
          { value: 'motor',  label: 'Motorised' },
        ],
      },
    ],
    highlights: [
      'Silent belt drive, 1–60 cm/s',
      '2kg payload at full extension',
      'App-controlled ramps and loops',
      '8-hour internal battery',
    ],
    description: [
      'A carbon-fibre track on sealed bearings, driven by a belt quiet enough to sit inside a dialogue take without the mic finding it.',
      'Speed, easing and loop points are set in the app and stored on the head, so the same move repeats exactly across a whole day of coverage.',
    ],
    materials: [
      { label: 'Track',    value: '3K carbon fibre, 25mm' },
      { label: 'Carriage', value: 'Anodised aluminium, sealed bearings' },
      { label: 'Belt',     value: 'Steel-cored polyurethane' },
      { label: 'Feet',     value: 'Rubber-damped, 3/8" threaded' },
    ],
    ratingBreakdown: { 5: 71, 4: 20, 3: 6, 2: 2, 1: 1 },
    reviews: [
      { id: 'r1', rating: 5, title: 'Repeatable moves change everything', body: 'Setting a loop once and getting the identical pass on every take has cut an hour off my product days.', author: 'Farhan A.' },
      { id: 'r2', rating: 5, title: 'Silent is not marketing here', body: 'Recorded a slow push right next to the lav and there is nothing on the track. Genuinely impressive.', author: 'Lena W.' },
      { id: 'r3', rating: 4, title: 'Superb, but pack the case', body: 'Rock solid in use. The carbon rail deserves more protection than the soft sleeve it ships with.', author: 'Ishaan G.' },
    ],
    related: [9, 8, 7],
  },

  5: {
    sku: 'FMO-SAGE-CNV-5PK',
    brand: 'Sage Studio Goods',
    manufacturer: 'Sage Textiles',
    countryOfOrigin: 'IN',
    gstRate: 12,
    unit: 'set',
    leadTime: 'Delivered in 2–4 working days',
    identifiers: { model: 'SC-5', hsn: '63079090', ean: '8901938471221' },
    dimensions: { length: 300, width: 300, height: 2, unit: 'cm' },
    weight: '1.1 kg each',
    packedWeight: '6.8 kg',
    variantAxes: [
      {
        id: 'palette',
        label: 'Palette',
        type: 'swatch',
        values: [
          { value: 'sage',   label: 'Sage',   hex: '#9AA88B' },
          { value: 'clay',   label: 'Clay',   hex: '#C08A6B' },
          { value: 'slate',  label: 'Slate',  hex: '#6B7178' },
          { value: 'bone',   label: 'Bone',   hex: '#E6DFD2' },
        ],
      },
      {
        id: 'count',
        label: 'Set',
        type: 'pill',
        values: [
          { value: '3', label: '3 backdrops' },
          { value: '5', label: '5 backdrops' },
        ],
      },
    ],
    highlights: [
      'Triple-washed, wrinkle-resistant muslin',
      'Five art-directed creator tones',
      'Carry bag per backdrop',
      'Machine washable at 30°C',
    ],
    description: [
      'Five backdrops art-directed with working creators, in tones chosen to sit behind skin without casting onto it.',
      'Triple-washed muslin holds a matte surface and drops flat from the rod after an hour, so there is no steaming before a shoot.',
    ],
    materials: [
      { label: 'Cloth',   value: '200 GSM triple-wash muslin' },
      { label: 'Finish',  value: 'Matte, non-reflective' },
      { label: 'Header',  value: 'Sewn 8cm rod pocket' },
      { label: 'Washing', value: 'Machine, 30°C, no bleach' },
    ],
    ratingBreakdown: { 5: 66, 4: 24, 3: 7, 2: 2, 1: 1 },
    reviews: [
      { id: 'r1', rating: 5, title: 'The colours are the point', body: 'Every one of the five is usable. Nothing in the set is the odd shade you never hang.', author: 'Aarohi P.' },
      { id: 'r2', rating: 4, title: 'Drops flat, eventually', body: 'Creases fell out overnight rather than in an hour, but no steaming needed and the matte finish is lovely.', author: 'Marcus D.' },
      { id: 'r3', rating: 5, title: 'Survives the washing machine', body: 'Third wash in and the colour has not shifted. For the price that is more than I expected.', author: 'Zoya H.' },
    ],
    related: [3, 1, 8],
  },

  6: {
    sku: 'FMO-PHN-LAV-DUO',
    brand: 'Velvet Audio',
    manufacturer: 'Velvet Acoustics Co.',
    countryOfOrigin: 'CN',
    gstRate: 18,
    unit: 'set',
    leadTime: 'Delivered in 2–3 working days',
    identifiers: { model: 'PL-D2', hsn: '85181000', upc: '019283746998' },
    dimensions: { length: 4.4, width: 2.6, height: 1.2, unit: 'cm' },
    weight: '21 g per transmitter',
    packedWeight: '680 g',
    variantAxes: [
      {
        id: 'colour',
        label: 'Colour',
        type: 'swatch',
        values: [
          { value: 'black', label: 'Black', hex: '#222225' },
          { value: 'sand',  label: 'Sand',  hex: '#D9C9AE' },
        ],
      },
      {
        id: 'channels',
        label: 'Channels',
        type: 'pill',
        values: [
          { value: '1', label: 'Single TX' },
          { value: '2', label: 'Dual TX' },
        ],
      },
    ],
    highlights: [
      '250m line-of-sight range',
      '10-hour transmitter battery',
      '48kHz / 24-bit internal backup',
      'Magnetic clip, no pin needed',
    ],
    description: [
      'Two transmitters and one receiver that pair the moment the case opens, with a charging case that carries three further refills.',
      'Each transmitter records its own 48kHz backup to internal memory, so a dropout on the wireless link never costs you the interview.',
    ],
    materials: [
      { label: 'Shell',   value: 'Polycarbonate, soft-touch' },
      { label: 'Clip',    value: 'Neodymium magnet pair' },
      { label: 'Battery', value: 'Li-po, USB-C case charging' },
      { label: 'Wind',    value: 'Two furry shields included' },
    ],
    ratingBreakdown: { 5: 72, 4: 20, 3: 5, 2: 2, 1: 1 },
    reviews: [
      { id: 'r1', rating: 5, title: 'Backup recording saved a shoot', body: 'Lost the link crossing a car park and the internal file was perfect. That feature alone is the whole purchase.', author: 'Kabir S.' },
      { id: 'r2', rating: 5, title: 'Magnets beat pins', body: 'No holes in the talent’s shirt, no fiddling. Clips on in a second and holds through a walking interview.', author: 'Helena V.' },
      { id: 'r3', rating: 4, title: 'Range is honest', body: 'The 250m claim is line-of-sight and they say so. Through two walls it is far less, which is fine — just plan for it.', author: 'Tomás L.' },
    ],
    related: [2, 7, 4],
  },

  7: {
    sku: 'FMO-AXS-DUO-3AX',
    brand: 'Axis Robotics',
    manufacturer: 'Axis Robotics Ltd.',
    countryOfOrigin: 'CN',
    gstRate: 18,
    unit: 'numbers',
    leadTime: 'Delivered in 3–5 working days',
    identifiers: { model: 'AX-D3', hsn: '90079900', asin: 'B0CZ7L4NQ2' },
    dimensions: { length: 26, width: 19, height: 31, unit: 'cm' },
    weight: '1.4 kg',
    packedWeight: '3.1 kg',
    variantAxes: [
      {
        id: 'colour',
        label: 'Colour',
        type: 'swatch',
        values: [
          { value: 'graphite', label: 'Graphite', hex: '#3A3A3D' },
          { value: 'silver',   label: 'Silver',   hex: '#C9C9CC' },
        ],
      },
      {
        id: 'kit',
        label: 'Kit',
        type: 'pill',
        values: [
          { value: 'core',  label: 'Core' },
          { value: 'combo', label: 'Combo + grip' },
          { value: 'pro',   label: 'Pro + case' },
        ],
      },
    ],
    highlights: [
      'Balances in under 60 seconds',
      '3.6kg payload, full-frame ready',
      '14-hour swappable batteries',
      'Fold-flat frame, cabin legal',
    ],
    description: [
      'Three axes with locking arms, so the balance you set survives the trip in the bag and the gimbal is live the moment it unfolds.',
      'A 3.6kg payload covers a full-frame body with a fast zoom, and the swappable cells keep it running past any single shoot day.',
    ],
    materials: [
      { label: 'Arms',     value: 'Magnesium alloy, locking' },
      { label: 'Grip',     value: 'Textured TPE over aluminium' },
      { label: 'Motors',   value: 'Brushless, encoder-tracked' },
      { label: 'Battery',  value: '2× swappable 18650 cells' },
    ],
    ratingBreakdown: { 5: 70, 4: 21, 3: 6, 2: 2, 1: 1 },
    reviews: [
      { id: 'r1', rating: 5, title: 'Locking arms are the upgrade', body: 'Balance once, fold it, unfold it a week later and it is still right. My old gimbal never managed that.', author: 'Ritika J.' },
      { id: 'r2', rating: 4, title: 'Strong, slightly heavy', body: 'Handles my body and 24-70 without complaint. After two hours handheld you do feel the weight.', author: 'Owen C.' },
      { id: 'r3', rating: 5, title: 'Batteries outlast me', body: 'Full wedding day on one set of cells with the spare untouched. Charging over USB-C in the car is a nice touch.', author: 'Meera K.' },
    ],
    related: [4, 9, 8],
  },

  8: {
    sku: 'FMO-APX-CRB-TRP',
    brand: 'Apex Supply',
    manufacturer: 'Apex Supply Works',
    countryOfOrigin: 'VN',
    gstRate: 18,
    unit: 'numbers',
    leadTime: 'Delivered in 3–5 working days',
    identifiers: { model: 'AC-4S', hsn: '90079200', ean: '8901938470045' },
    dimensions: { length: 48, width: 12, height: 12, unit: 'cm' },
    weight: '1.6 kg',
    packedWeight: '2.9 kg',
    variantAxes: [
      {
        id: 'finish',
        label: 'Finish',
        type: 'swatch',
        values: [
          { value: 'carbon', label: 'Carbon', hex: '#2E2E31' },
          { value: 'olive',  label: 'Olive',  hex: '#6E7A55' },
        ],
      },
      {
        id: 'head',
        label: 'Head',
        type: 'pill',
        values: [
          { value: 'ball',  label: 'Ball head' },
          { value: 'fluid', label: 'Fluid head' },
          { value: 'none',  label: 'Legs only' },
        ],
      },
    ],
    highlights: [
      '8-layer carbon legs, 12kg load',
      'Folds to 48cm — fits a daypack',
      'Centre column converts to monopod',
      'Twist locks sealed against grit',
    ],
    description: [
      'Eight-layer carbon legs that damp vibration instead of ringing with it, which is what a long exposure on a windy roof actually needs.',
      'The centre column unthreads into a full monopod, so one bag covers the tripod day and the run-and-gun day without a second purchase.',
    ],
    materials: [
      { label: 'Legs',     value: '8-layer carbon fibre, 28mm' },
      { label: 'Locks',    value: 'Sealed twist, three-section' },
      { label: 'Head',     value: 'Aluminium ball, Arca plate' },
      { label: 'Feet',     value: 'Rubber, spiked set included' },
    ],
    ratingBreakdown: { 5: 68, 4: 23, 3: 6, 2: 2, 1: 1 },
    reviews: [
      { id: 'r1', rating: 5, title: 'Finally a tripod I actually carry', body: 'The folded length is the whole point. It lives in the daypack now instead of at home.', author: 'Sanjay V.' },
      { id: 'r2', rating: 5, title: 'Steady in real wind', body: 'Thirty-second exposures on an exposed headland came back sharp. The spiked feet earn their place.', author: 'Cara M.' },
      { id: 'r3', rating: 4, title: 'Great legs, average plate', body: 'Legs and locks are excellent. I swapped the supplied Arca plate for a longer one almost immediately.', author: 'Neel R.' },
    ],
    related: [4, 9, 7],
  },

  9: {
    sku: 'FMO-NOIR-PRM-35',
    brand: 'Noir Optics',
    manufacturer: 'Noir Optics GmbH',
    countryOfOrigin: 'JP',
    gstRate: 18,
    unit: 'numbers',
    leadTime: 'Delivered in 2–4 working days',
    identifiers: { model: 'NP-35F14', hsn: '90021100', asin: 'B0D5R9WK1M', globalProductNumber: 'GP-40119977' },
    dimensions: { length: 7.6, width: 7.6, height: 9.8, unit: 'cm' },
    weight: '620 g',
    packedWeight: '1.4 kg',
    variantAxes: [
      {
        id: 'mount',
        label: 'Mount',
        type: 'pill',
        values: [
          { value: 'e',  label: 'Sony E' },
          { value: 'rf', label: 'Canon RF' },
          { value: 'z',  label: 'Nikon Z' },
          { value: 'l',  label: 'L-Mount' },
        ],
      },
      {
        id: 'focal',
        label: 'Focal length',
        type: 'pill',
        values: [
          { value: '35', label: '35mm f/1.4' },
          { value: '50', label: '50mm f/1.4' },
          { value: '85', label: '85mm f/1.4' },
        ],
      },
    ],
    highlights: [
      'Weather-sealed to IP52',
      'Declicked aperture ring for video',
      '11-blade rounded diaphragm',
      '5-year optical warranty',
    ],
    description: [
      'Eleven elements in nine groups, two of them aspherical, corrected so the f/1.4 frame is usable wide open rather than a party trick.',
      'The aperture ring declicks with a switch on the barrel, which is the difference between a stills lens and one you can pull exposure on mid-take.',
    ],
    materials: [
      { label: 'Barrel',  value: 'Machined aluminium, brass mount' },
      { label: 'Glass',   value: '11 elements / 9 groups, 2 aspherical' },
      { label: 'Coating', value: 'Nano multi-layer, fluorine front' },
      { label: 'Sealing', value: 'Gasketed mount, IP52' },
    ],
    ratingBreakdown: { 5: 80, 4: 14, 3: 4, 2: 1, 1: 1 },
    reviews: [
      { id: 'r1', rating: 5, title: 'Sharp wide open, finally', body: 'I bought f/1.4 to shoot at f/1.4 and this is the first prime at the price that lets me. Rendering is gorgeous.', author: 'Arjun D.' },
      { id: 'r2', rating: 5, title: 'The declick sold it', body: 'Pulling aperture through a window-lit take without a stepped jump is exactly what I needed. Build feels like metal, because it is.', author: 'Sofia N.' },
      { id: 'r3', rating: 4, title: 'Excellent, and heavy', body: 'Optically superb and properly sealed. It is not a light lens — on a gimbal you will notice the 620g.', author: 'Vikram T.' },
    ],
    related: [4, 8, 1],
  },
};
