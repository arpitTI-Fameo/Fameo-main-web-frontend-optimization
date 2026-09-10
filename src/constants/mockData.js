// // ─── Products ─────────────────────────────────────────────────────────────────
// export const PRODUCTS = [
//   {
//     id: 1, category: "Studio", name: "LUMIÈRE PRO", tagline: "Ring System",
//     price: 349, original: 420, tag: "Bestseller", rating: 4.9, reviews: 2841,
//     desc: "Dual 18-inch rings with stepless kelvin control, smartphone mount, and remote dimmer.",
//     longDesc: "The Lumière Pro is built for creators who refuse to compromise on light quality. Dual 18-inch rings engineered in aircraft-grade aluminium deliver a seamless, shadow-free output that flatters every skin tone. The stepless Kelvin dial moves silently from warm candlelight to crisp daylight.",
//     features: ["18-inch dual ring", "2700K–6500K", "Remote dimmer", "360° mount"],
//     specs: { Width: "46 cm", Height: "180 cm", Weight: "3.2 kg", Output: "5500 lux @ 1m" },
//     images: ["💡", "🌟", "🔦", "✨"], emoji: "💡", stock: 12, related: [2, 3, 9],
//   },
//   {
//     id: 2, category: "Audio", name: "VELVET XM", tagline: "Condenser Microphone",
//     price: 289, original: null, tag: "New", rating: 4.8, reviews: 1204,
//     desc: "Cardioid condenser with integrated shock mount, pop filter, USB-C + XLR dual output.",
//     longDesc: "The Velvet XM captures your voice the way it deserves to be heard. A large-diaphragm cardioid capsule tuned for broadcast clarity makes every word feel deliberate.",
//     features: ["Cardioid pattern", "USB-C + XLR", "Integrated shock", "-10dB pad"],
//     specs: { Frequency: "20Hz–20kHz", SNR: "80dB (A)", Pattern: "Cardioid", Connectivity: "USB-C + XLR" },
//     images: ["🎙️", "🎵", "🎧", "🎤"], emoji: "🎙️", stock: 28, related: [6, 7, 1],
//   },
//   {
//     id: 3, category: "Lighting", name: "AURA ELITE", tagline: "Softbox System",
//     price: 189, original: 240, tag: "Sale", rating: 4.7, reviews: 876,
//     desc: "60×90cm bi-colour softbox with ballast, barndoors, and carrying case.",
//     longDesc: "The Aura Elite wraps your subject in cinema-grade light. A 60×90cm bi-colour panel with 2,048 LEDs produces a seamless wash. Bowens mount, barndoors, and case included.",
//     features: ["60×90cm panel", "Bi-colour 3200–5600K", "Bowens mount", "Barndoors incl."],
//     specs: { Panel: "60×90 cm", LEDs: "2048 units", Mount: "Bowens", CRI: "97+" },
//     images: ["☀️", "🌅", "💫", "🌄"], emoji: "☀️", stock: 7, related: [1, 5, 9],
//   },
//   {
//     id: 4, category: "Studio", name: "OBSIDIAN RAIL", tagline: "Camera Slider",
//     price: 529, original: null, tag: "Pro", rating: 4.9, reviews: 634,
//     desc: "1m motorised carbon-fibre slider with smartphone control and silent belt drive.",
//     longDesc: "The Obsidian Rail moves your camera with film-set precision. Carbon-fibre track, silent belt drive, 1–60cm/s speed range, app-controlled. 2kg payload capacity.",
//     features: ["1m carbon rail", "Motorised belt", "App control", "2kg payload"],
//     specs: { Length: "100 cm", Payload: "2 kg", Speed: "1–60 cm/s", Battery: "8 hrs" },
//     images: ["🎬", "📽️", "🎥", "🎞️"], emoji: "🎬", stock: 5, related: [1, 9, 8],
//   },
//   {
//     id: 5, category: "Accessories", name: "SAGE CANVAS", tagline: "Backdrop Collection",
//     price: 149, original: 180, tag: "Bundle", rating: 4.6, reviews: 2190,
//     desc: "Premium muslin backdrops in 5 curated creator tones — 3×3m, wrinkle-resistant.",
//     longDesc: "Five backdrops, five moods. Art-directed with 12 working creators. Triple-washed muslin, wrinkle-resistant, each 3×3m with its own carry bag.",
//     features: ["5 backdrop tones", "3×3m each", "Muslin weave", "Carry bag"],
//     specs: { Size: "3×3 m each", Material: "Triple-wash muslin", Quantity: "5 backdrops", Finish: "Matte" },
//     images: ["🖼️", "🎨", "🖌️", "🌿"], emoji: "🖼️", stock: 34, related: [3, 9, 1],
//   },
//   {
//     id: 6, category: "Audio", name: "PHANTOM LAV", tagline: "Wireless Microphone",
//     price: 219, original: null, tag: "Wireless", rating: 4.8, reviews: 987,
//     desc: "48kHz dual-channel wireless lav system. 250m range, 10-hour battery.",
//     longDesc: "Two transmitters, one receiver, 250m range, 10-hour battery. 48kHz/24-bit broadcast-ready audio in a system lighter than your phone.",
//     features: ["250m range", "10-hr battery", "48kHz/24-bit", "Magnetic clip"],
//     specs: { Range: "250 m LOS", Battery: "10 hrs TX / 12 hrs RX", Sample: "48kHz / 24-bit", Weight: "21g per TX" },
//     images: ["🎤", "📻", "🔊", "🎼"], emoji: "🎤", stock: 19, related: [2, 7, 4],
//   },
//   {
//     id: 7, category: "Software", name: "FLOWEDIT", tagline: "Annual Suite",
//     price: 99, original: 180, tag: "Software", rating: 4.7, reviews: 3420,
//     desc: "AI-powered video editing suite with auto-captions, brand kit, 4K export.",
//     longDesc: "AI auto-captions in 42 languages at 98.6% accuracy. Brand kit across every project. 4K 60fps export to YT, IG, TT, and X in one click.",
//     features: ["AI auto-captions", "Brand kit", "4K 60fps export", "Multi-platform"],
//     specs: { Languages: "42", Export: "4K 60fps", Platforms: "YT, IG, TT, X", Storage: "500 GB cloud" },
//     images: ["💻", "⌨️", "🖥️", "📱"], emoji: "💻", stock: 999, related: [2, 6, 9],
//   },
//   {
//     id: 8, category: "Wellness", name: "THRONE CHAIR", tagline: "Ergonomic Studio",
//     price: 489, original: 560, tag: "Ergonomic", rating: 4.9, reviews: 1102,
//     desc: "Lumbar-adaptive mesh chair with 4D armrests, recline lock, and headrest.",
//     longDesc: "Lumbar zone adapts to your spine in real time. 4D armrests eliminate shoulder fatigue. 135° recline lock. Built to last a decade.",
//     features: ["4D armrests", "Lumbar adaptive", "135° recline", "Headrest incl."],
//     specs: { Width: "67 cm", Seat: "42–52 cm H", Recline: "90°–135°", Warranty: "5 years" },
//     images: ["🪑", "✦", "◈", "◉"], emoji: "🪑", stock: 8, related: [9, 7, 5],
//   },
//   {
//     id: 9, category: "Studio", name: "NOIR DESK", tagline: "Organiser System",
//     price: 129, original: null, tag: "Aesthetic", rating: 4.8, reviews: 4320,
//     desc: "Matte-black aluminium desk system with cable routing, monitor riser, phone stand.",
//     longDesc: "Aerospace-grade 6061 aluminium, CNC-machined to ±0.1mm. Integrated cable routing. Monitor riser lifts 14cm. Nothing wobbles, nothing shows.",
//     features: ["Aluminium build", "Cable routing", "Monitor riser", "Phone stand"],
//     specs: { Material: "6061 aluminium", Finish: "Matte black", Riser: "14 cm lift", Load: "25 kg" },
//     images: ["🖤", "◇", "▪", "◼"], emoji: "🖤", stock: 22, related: [8, 1, 7],
//   },
// ];

// // ─── Mock orders ──────────────────────────────────────────────────────────────
// export const MOCK_ORDERS = [
//   {
//     id: "FAM-2025-0041", date: "2025-03-08", status: "delivered", total: 638,
//     items: [
//       { productId: 1, qty: 1, price: 349 },
//       { productId: 9, qty: 1, price: 129 },
//       { productId: 7, qty: 1, price: 99  },
//     ],
//     shipping: { name: "Nagi Kumar", address: "12 Creator Lane", city: "Hyderabad", state: "Telangana", pin: "500081", country: "India" },
//     tracking: [
//       { label: "Order Placed",      date: "Mar 8, 2:14 PM",  done: true  },
//       { label: "Payment Confirmed", date: "Mar 8, 2:15 PM",  done: true  },
//       { label: "Packed",            date: "Mar 9, 10:30 AM", done: true  },
//       { label: "Dispatched",        date: "Mar 9, 3:00 PM",  done: true  },
//       { label: "Out for Delivery",  date: "Mar 11, 9:00 AM", done: true  },
//       { label: "Delivered",         date: "Mar 11, 1:22 PM", done: true  },
//     ],
//     courier: "BlueDart Express", awb: "BD7291048233",
//   },
//   {
//     id: "FAM-2025-0038", date: "2025-03-01", status: "shipped", total: 778,
//     items: [
//       { productId: 4, qty: 1, price: 529 },
//       { productId: 6, qty: 1, price: 219 },
//     ],
//     shipping: { name: "Nagi Kumar", address: "12 Creator Lane", city: "Hyderabad", state: "Telangana", pin: "500081", country: "India" },
//     tracking: [
//       { label: "Order Placed",      date: "Mar 1, 11:00 AM", done: true  },
//       { label: "Payment Confirmed", date: "Mar 1, 11:01 AM", done: true  },
//       { label: "Packed",            date: "Mar 2, 9:00 AM",  done: true  },
//       { label: "Dispatched",        date: "Mar 2, 4:30 PM",  done: true  },
//       { label: "Out for Delivery",  date: "Expected Mar 13", done: false },
//       { label: "Delivered",         date: "Expected Mar 14", done: false },
//     ],
//     courier: "FedEx Priority", awb: "FX9920014477",
//   },
//   {
//     id: "FAM-2025-0029", date: "2025-02-18", status: "delivered", total: 289,
//     items: [{ productId: 2, qty: 1, price: 289 }],
//     shipping: { name: "Nagi Kumar", address: "12 Creator Lane", city: "Hyderabad", state: "Telangana", pin: "500081", country: "India" },
//     tracking: [
//       { label: "Order Placed",      date: "Feb 18, 9:00 AM",  done: true },
//       { label: "Payment Confirmed", date: "Feb 18, 9:01 AM",  done: true },
//       { label: "Packed",            date: "Feb 19, 8:00 AM",  done: true },
//       { label: "Dispatched",        date: "Feb 19, 2:00 PM",  done: true },
//       { label: "Out for Delivery",  date: "Feb 21, 8:30 AM",  done: true },
//       { label: "Delivered",         date: "Feb 21, 11:45 AM", done: true },
//     ],
//     courier: "BlueDart Express", awb: "BD6110294801",
//   },
// ];

// // ─── Status display config ────────────────────────────────────────────────────
// export const STATUS_CONFIG = {
//   delivered:  { label: "Delivered",  color: "#4a9e6a", bg: "rgba(74,158,106,0.1)"   },
//   shipped:    { label: "Shipped",    color: "#C9A96E", bg: "rgba(201,169,110,0.12)" },
//   processing: { label: "Processing", color: "#7a7aff", bg: "rgba(122,122,255,0.1)"  },
//   cancelled:  { label: "Cancelled",  color: "#b55a28", bg: "rgba(181,90,40,0.1)"    },
// };

// constants/mockData.js
// Temporary static seed data used until backend API is connected.
// When backend is live: delete this file and update services/ to fetch from API.

export const PRODUCTS = [
  { id:1,  category:'Lighting',      name:'LUMIÈRE PRO',   tagline:'Ring System',           price:349,  original:420, tag:'Bestseller', rating:4.9, reviews:2841, stock:12,
    desc:'Dual 18-inch rings with stepless kelvin control, smartphone mount, and remote dimmer.',
    longDesc:'The Lumière Pro is built for creators who refuse to compromise on light quality. Dual 18-inch rings engineered in aircraft-grade aluminium deliver a seamless, shadow-free output that flatters every skin tone.',
    features:['18-inch dual ring','2700K–6500K','Remote dimmer','360° mount'],
    specs:{ Width:'46 cm', Height:'180 cm (stand)', Weight:'3.2 kg', Output:'5500 lux @ 1m' },
    images:['https://images.unsplash.com/photo-1627483262769-04d0a1401487?w=800&q=80','https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80','https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80','https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&q=80'],
    thumb:'https://images.unsplash.com/photo-1627483262769-04d0a1401487?w=600&q=80' },

  { id:2,  category:'Audio',         name:'VELVET XM',     tagline:'Condenser Microphone',  price:289,  original:null,tag:'New',        rating:4.8, reviews:1204, stock:28,
    desc:'Cardioid condenser with integrated shock mount, pop filter, USB-C + XLR dual output.',
    longDesc:'The Velvet XM captures your voice the way it deserves to be heard. A large-diaphragm cardioid capsule tuned for broadcast clarity.',
    features:['Cardioid pattern','USB-C + XLR','Integrated shock','-10dB pad'],
    specs:{ Frequency:'20Hz–20kHz', SNR:'80dB (A)', Pattern:'Cardioid', Connectivity:'USB-C + XLR' },
    images:['https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&q=80','https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80','https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&q=80','https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&q=80'],
    thumb:'https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=600&q=80' },

  { id:3,  category:'Lighting',      name:'AURA ELITE',    tagline:'Softbox System',        price:189,  original:240, tag:'Sale',       rating:4.7, reviews:876,  stock:7,
    desc:'60×90cm bi-colour softbox with ballast, barndoors, and carrying case.',
    longDesc:'The Aura Elite wraps your subject in cinema-grade light. A 60×90cm bi-colour panel with 2,048 LEDs produces a seamless wash.',
    features:['60×90cm panel','Bi-colour 3200–5600K','Bowens mount','Barndoors incl.'],
    specs:{ Panel:'60×90 cm', LEDs:'2048 units', Mount:'Bowens', CRI:'97+' },
    images:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80','https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80','https://images.unsplash.com/photo-1471897488648-5eae4ac6686b?w=800&q=80','https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80'],
    thumb:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },

  { id:4,  category:'Cameras',       name:'OBSIDIAN RAIL', tagline:'Camera Slider',         price:529,  original:null,tag:'Pro',        rating:4.9, reviews:634,  stock:5,
    desc:'1m motorised carbon-fibre slider with smartphone control and silent belt drive.',
    longDesc:'The Obsidian Rail moves your camera with film-set precision. Carbon-fibre track, silent belt drive, 1–60cm/s speed range.',
    features:['1m carbon rail','Motorised belt','App control','2kg payload'],
    specs:{ Length:'100 cm', Payload:'2 kg', Speed:'1–60 cm/s', Battery:'8 hrs' },
    images:['https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=800&q=80','https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=800&q=80','https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80','https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?w=800&q=80'],
    thumb:'https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=600&q=80' },

  { id:5,  category:'Accessories',   name:'SAGE CANVAS',   tagline:'Backdrop Collection',   price:149,  original:180, tag:'Bundle',     rating:4.6, reviews:2190, stock:34,
    desc:'Premium muslin backdrops in 5 curated creator tones — 3×3m, wrinkle-resistant.',
    longDesc:'Five backdrops. Five moods. Art-directed with 12 working creators. Triple-washed muslin, wrinkle-resistant.',
    features:['5 backdrop tones','3×3m each','Muslin weave','Carry bag'],
    specs:{ Size:'3×3 m each', Material:'Triple-wash muslin', Quantity:'5 backdrops', Finish:'Matte' },
    images:['https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80','https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80','https://images.unsplash.com/photo-1612347903706-4c5e54f17faf?w=800&q=80'],
    thumb:'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80' },

  { id:6,  category:'Audio',         name:'PHANTOM LAV',   tagline:'Wireless Microphone',   price:219,  original:null,tag:'Wireless',   rating:4.8, reviews:987,  stock:19,
    desc:'48kHz dual-channel wireless lav system. 250m range, 10-hour battery.',
    longDesc:'The Phantom Lav was engineered for creators who never stop moving. 250m range, 10-hour battery, 48kHz/24-bit.',
    features:['250m range','10-hr battery','48kHz/24-bit','Magnetic clip'],
    specs:{ Range:'250 m LOS', Battery:'10 hrs TX / 12 hrs RX', Sample:'48kHz / 24-bit', Weight:'21g per TX' },
    images:['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80','https://images.unsplash.com/photo-1583394293214-0b3843ef42f3?w=800&q=80','https://images.unsplash.com/photo-1615655096345-61a54750068d?w=800&q=80','https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80'],
    thumb:'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&q=80' },

  { id:7,  category:'Gimbals',       name:'AXIS DUO',      tagline:'3-Axis Camera Gimbal',  price:379,  original:450, tag:'Bestseller', rating:4.9, reviews:3420, stock:9,
    desc:'AI-powered 3-axis stabilisation, 14hr battery, app control for mirrorless and DSLR.',
    longDesc:'The Axis Duo redefines what a gimbal can do. AI subject tracking keeps your frame locked on any subject.',
    features:['AI subject tracking','14hr battery','Mirrorless + DSLR','Timelapse mode'],
    specs:{ Payload:'3 kg', Battery:'14 hrs', Axes:'3-axis', Weight:'1.1 kg' },
    images:['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80','https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=800&q=80','https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&q=80','https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80'],
    thumb:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80' },

  { id:8,  category:'Bags & Tripods',name:'APEX CARBON',   tagline:'Carbon Fibre Tripod',   price:489,  original:560, tag:'Pro',        rating:4.9, reviews:1102, stock:8,
    desc:'Carbon fibre 5-section travel tripod. 18kg load. Ships with ball head.',
    longDesc:'The Apex Carbon is the last tripod you will ever buy. Aerospace-grade carbon fibre, 18kg load, 165cm max height.',
    features:['5-section fold','18kg load','Ball head incl.','1.2kg body'],
    specs:{ Material:'Carbon fibre', Load:'18 kg', Height:'165 cm max', Weight:'1.2 kg' },
    images:['https://images.unsplash.com/photo-1589384267710-7a170981ca78?w=800&q=80','https://images.unsplash.com/photo-1596162954151-cdcb4c0f70fb?w=800&q=80','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80','https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80'],
    thumb:'https://images.unsplash.com/photo-1589384267710-7a170981ca78?w=600&q=80' },

  { id:9,  category:'Cameras',       name:'NOIR PRIME',    tagline:'Mirrorless Body',       price:1299, original:null,tag:'New',        rating:4.8, reviews:4320, stock:22,
    desc:'36MP full-frame mirrorless. 120fps 4K. Dual card slots. IP55 weather sealing.',
    longDesc:'The Noir Prime is every photographer\'s endgame body. 36MP BSI CMOS, 4K 120fps, dual card slots.',
    features:['36MP full-frame','4K 120fps','Dual card slots','IP55 sealed'],
    specs:{ Sensor:'36MP BSI CMOS', Video:'4K 120fps', ISO:'100–51200', Weight:'658g' },
    images:['https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=800&q=80','https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80','https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80','https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=800&q=80'],
    thumb:'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=600&q=80' },
];

export const HERO_SLIDES = [
  { img:'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=1800&q=90', eyebrow:'New Arrival · 2025', title:'Cinema-Grade\nMirrorless',  sub:'Sony, Canon, Nikon & Fujifilm in one store.', cta:'Shop Cameras'     },
  { img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1800&q=90', eyebrow:'Studio Lighting',   title:'Light Like\nthe Pros',       sub:'Panel lights, softboxes, flash kits and more.', cta:'Explore Lighting' },
  { img:'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1800&q=90', eyebrow:'Creator Essentials', title:'Every Tool\nYou Need',       sub:'Gimbals, audio, bags — built for the field.',   cta:'Shop All'         },
];

export const TESTIMONIALS = [
  { text:'The ring light alone transformed my content. Brands started reaching out within two weeks of upgrading.', name:'Priya Sharma', handle:'@priyacreates · 1.2M', init:'P' },
  { text:'The gimbal changed everything. My footage went from amateur to agency-ready overnight.',                  name:'Marcus Webb',   handle:'@marcuswebb · 890K',   init:'M' },
  { text:'Every product tested by a working creator. Not just aesthetic — functional excellence.',                  name:'Zara Okonkwo',  handle:'@zaraokonkwo · 2.1M',  init:'Z' },
];

export const PROMISES = [
  { icon:'◈', title:'48hr Delivery',    desc:'Express shipping on all orders.'      },
  { icon:'◇', title:'Creator Verified', desc:'Tested by 100+ active creators.'      },
  { icon:'◉', title:'Free Returns',     desc:'30-day hassle-free returns.'           },
  { icon:'◎', title:'Creator Support',  desc:'Staffed by active creators.'           },
];

export const MARQUEE_WORDS = [
  'Studio Essentials','Brand Partnerships','Content Creation','Lighting & Audio',
  'Aesthetic Setup','Creator Economy','Influencer Tools','Premium Quality',
  'Verified Gear','Fast Dispatch',
];

export const MOCK_ORDERS = [
  {
    id: 'ORD-2025-001',
    date: '2025-03-10',
    status: 'delivered',
    total: 349,
    items: [{ productId: 1, qty: 1, price: 349 }],
    courier: 'BlueDart Express',
    awb: 'BD1234567890',
    tracking: [
      { label: 'Order Placed',      date: '10 Mar, 9:00 AM',  done: true  },
      { label: 'Payment Confirmed', date: '10 Mar, 9:05 AM',  done: true  },
      { label: 'Packed',            date: '10 Mar, 3:00 PM',  done: true  },
      { label: 'Dispatched',        date: '11 Mar, 10:00 AM', done: true  },
      { label: 'Out for Delivery',  date: '12 Mar, 8:00 AM',  done: true  },
      { label: 'Delivered',         date: '12 Mar, 2:30 PM',  done: true  },
    ],
  },
];