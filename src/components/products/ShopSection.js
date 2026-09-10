
// "use client";



// import { useState, useEffect, useRef } from 'react';
// import { inr } from '@/lib/formatCurrency';

// // ─── Category Tiles + Subcategories + Brands ──────────────────────────────────
// const CAT_TILES = [
//   {
//     id:"all", label:"All Products",
//     img:"https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=700&q=80",
//     accent:"#E8405A", subs:[], brands:[],
//   },
//   {
//     id:"Cameras", label:"Cameras",
//     img:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700&q=80",
//     accent:"#E8405A",
//     subs:[
//       { label:"Mirrorless",   img:"https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=300&q=70" },
//       { label:"DSLR",         img:"https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&q=70" },
//       { label:"Action Cams",  img:"https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?w=300&q=70" },
//       { label:"Cinema",       img:"https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=300&q=70" },
//       { label:"Camcorders",   img:"https://images.unsplash.com/photo-1547082299-de196ea013d6?w=300&q=70" },
//       { label:"Instant",      img:"https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=300&q=70" },
//       { label:"Drones",       img:"https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=300&q=70" },
//       { label:"Point & Shoot",img:"https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&q=70" },
//     ],
//     brands:["Sony","Canon","Nikon","Fujifilm","Panasonic","DJI","GoPro","Insta360","Digitek","Blackmagic","Instax","Kodak"],
//   },
//   {
//     id:"Lighting", label:"Lighting",
//     img:"https://images.unsplash.com/photo-1627483262769-04d0a1401487?w=700&q=80",
//     accent:"#E8405A",
//     subs:[
//       { label:"Panel Lights",  img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=70" },
//       { label:"Ring Lights",   img:"https://images.unsplash.com/photo-1627483262769-04d0a1401487?w=300&q=70" },
//       { label:"Softboxes",     img:"https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&q=70" },
//       { label:"Flash Kits",    img:"https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&q=70" },
//       { label:"Streaming",     img:"https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=300&q=70" },
//       { label:"Monolights",    img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=70" },
//       { label:"Shooting Tents",img:"https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&q=70" },
//     ],
//     brands:["Godox","Nanlite","Aputure","Neewer","Profoto","Westcott","Digitek","Bowens"],
//   },
//   {
//     id:"Lenses", label:"Lenses",
//     img:"https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=700&q=80",
//     accent:"#E8405A",
//     subs:[
//       { label:"Mirrorless",   img:"https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=300&q=70" },
//       { label:"DSLR/SLR",    img:"https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&q=70" },
//       { label:"Cine Lenses",  img:"https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=300&q=70" },
//       { label:"Medium Format",img:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=70" },
//     ],
//     brands:["Canon","Nikon","Sony","Sigma","Tamron","Fujifilm","Samyang","ZEISS","Laowa","7artisans","Viltrox","TTArtisan","Irix"],
//   },
//   {
//     id:"Bags & Tripods", label:"Bags & Tripods",
//     img:"https://images.unsplash.com/photo-1547082299-de196ea013d6?w=700&q=80",
//     accent:"#E8405A",
//     subs:[
//       { label:"Backpacks",    img:"https://images.unsplash.com/photo-1547082299-de196ea013d6?w=300&q=70" },
//       { label:"Shoulder Bags",img:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&q=70" },
//       { label:"Trolley Bags", img:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&q=70" },
//       { label:"Tripods",      img:"https://images.unsplash.com/photo-1589384267710-7a170981ca78?w=300&q=70" },
//       { label:"Monopods",     img:"https://images.unsplash.com/photo-1596162954151-cdcb4c0f70fb?w=300&q=70" },
//       { label:"Ball Heads",   img:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=70" },
//     ],
//     brands:["Vanguard","Lowepro","Think Tank","Peak Design","Manfrotto","Gitzo","Benro","Joby","K&F Concept","Zomei"],
//   },
//   {
//     id:"Gimbals", label:"Gimbals",
//     img:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80",
//     accent:"#E8405A",
//     subs:[
//       { label:"Camera Gimbals",img:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&q=70" },
//       { label:"Smartphone",    img:"https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=300&q=70" },
//       { label:"Pocket Gimbals",img:"https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=300&q=70" },
//     ],
//     brands:["DJI","Zhiyun","Moza","FeiyuTech","Hohem","Gudsen","Snoppa"],
//   },
//   {
//     id:"Audio", label:"Audio",
//     img:"https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=700&q=80",
//     accent:"#E8405A",
//     subs:[
//       { label:"Wireless Lavs",img:"https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&q=70" },
//       { label:"Condensers",   img:"https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=300&q=70" },
//       { label:"On-Camera",    img:"https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&q=70" },
//       { label:"Wired Audio",  img:"https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&q=70" },
//     ],
//     brands:["Godox","Hollyland","Rode","Sennheiser","Deity","Mirfak","Digitek","DJI","Saramonic","Tascam"],
//   },
//   {
//     id:"Accessories", label:"Accessories",
//     img:"https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=700&q=80",
//     accent:"#E8405A",
//     subs:[
//       { label:"Camera Straps",img:"https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&q=70" },
//       { label:"Cages & Rigs", img:"https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=300&q=70" },
//       { label:"Memory Cards", img:"https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&q=70" },
//       { label:"Lighting Mods",img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=70" },
//       { label:"Action Cam Acc",img:"https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?w=300&q=70" },
//       { label:"Bag Acc",      img:"https://images.unsplash.com/photo-1547082299-de196ea013d6?w=300&q=70" },
//     ],
//     brands:["SmallRig","Tilta","Peak Design","Sandisk","Lexar","PolarPro","Freewell","Pgytech","Ulanzi","K&F Concept"],
//   },
// ];

// // Price ranges in INR (1 USD = ₹84)
// const PRICE_RANGES = [
//   { label:"All Prices",       min:0,    max:Infinity },
//   { label:"Under ₹16,800",   min:0,    max:200      },
//   { label:"₹16,800–₹42,000", min:200,  max:500      },
//   { label:"₹42,000–₹84,000", min:500,  max:1000     },
//   { label:"₹84,000+",        min:1000, max:Infinity },
// ];

// // ─── Styles — WHITE + ROSE PINK theme ─────────────────────────────────────────
// const SHOP_STYLES = `
//   /* ─── CSS overrides: rose replaces gold, white replaces cream ─── */

//   /* ── Section header ── */
//   .ss-header {
//     padding: 56px 56px 36px;
//     display: flex; align-items: flex-end; justify-content: space-between;
//     border-bottom: 1px solid #EEEEF2;
//     background: #fff;
//   }
//   .ss-eyebrow {
//     font-size: 9px; font-weight: 500; letter-spacing: 0.28em; text-transform: uppercase;
//     color: #E8405A; margin-bottom: 8px;
//     display: flex; align-items: center; gap: 10px;
//   }
//   .ss-eyebrow::before { content:''; width:18px; height:1px; background:#E8405A; opacity:0.6; }
//   .ss-header h2 {
//     font-family:'Cormorant Garamond',serif;
//     font-size: clamp(28px,3.2vw,44px); font-weight:300; line-height:1;
//     color: #111118;
//   }
//   .ss-header h2 em { font-style:italic; color:#E8405A; }
//   .ss-header-right { display:flex; align-items:center; gap:12px; flex-shrink:0; }
//   .ss-count {
//     font-size:10px; letter-spacing:0.14em; text-transform:uppercase;
//     color:#888898; padding:8px 14px;
//     border:1.5px solid #EEEEF2; border-radius:4px; background:#fff;
//   }
//   .ss-view-btns { display:flex; }
//   .ss-vbtn {
//     width:34px; height:34px;
//     border:1.5px solid #EEEEF2;
//     background:#fff; cursor:pointer;
//     display:flex; align-items:center; justify-content:center;
//     margin-right:-1px; transition:all 0.18s;
//     color:#888898;
//   }
//   .ss-vbtn.on  { background:#111118; color:#fff; border-color:#111118; }
//   .ss-vbtn:hover:not(.on) { border-color:#111118; color:#111118; }

//   /* ── Category tiles ── */
//   .ss-tiles-wrap { padding:36px 56px 0; background:#fff; }
//   .ss-tiles-label {
//     font-size:9px; font-weight:500; letter-spacing:0.24em; text-transform:uppercase;
//     color:#888898; margin-bottom:16px;
//   }
//   .ss-tiles {
//     display:grid; grid-template-columns:repeat(8,1fr);
//     gap:1px; background:#EEEEF2;
//   }
//   .ss-tile {
//     position:relative; overflow:hidden; cursor:pointer;
//     aspect-ratio:3/4; background:#F7F7FA;
//     border:none; padding:0;
//   }
//   .ss-tile-img {
//     width:100%; height:100%; object-fit:cover; display:block;
//     transition:transform 0.65s cubic-bezier(0.22,1,0.36,1), filter 0.4s;
//     filter:brightness(0.68) saturate(0.82);
//   }
//   .ss-tile:hover .ss-tile-img,
//   .ss-tile.active .ss-tile-img { transform:scale(1.07); filter:brightness(0.45) saturate(1); }
//   .ss-tile::after {
//     content:''; position:absolute; top:0; left:0; right:0; height:3px;
//     background:#E8405A;
//     transform:scaleX(0); transform-origin:left;
//     transition:transform 0.42s cubic-bezier(0.22,1,0.36,1);
//   }
//   .ss-tile:hover::after, .ss-tile.active::after { transform:scaleX(1); }
//   .ss-tile-info {
//     position:absolute; bottom:0; left:0; right:0;
//     padding:10px 12px 13px;
//     background:linear-gradient(0deg,rgba(17,17,24,0.9) 0%,transparent 100%);
//   }
//   .ss-tile-name {
//     font-family:'Cormorant Garamond',serif;
//     font-size:clamp(9px,0.95vw,13px); font-weight:500;
//     letter-spacing:0.1em; text-transform:uppercase;
//     color:#f0ebe2; line-height:1.2; display:block;
//   }
//   .ss-tile.active .ss-tile-name { color:#f9c0c8; }
//   .ss-tile-dot {
//     position:absolute; top:9px; right:9px;
//     width:6px; height:6px; border-radius:50%;
//     background:#E8405A;
//     opacity:0; transform:scale(0);
//     transition:opacity 0.28s, transform 0.28s;
//   }
//   .ss-tile.active .ss-tile-dot { opacity:1; transform:scale(1); }

//   /* ── Expanded panel ── */
//   .ss-panel {
//     overflow:hidden; max-height:0;
//     transition:max-height 0.6s cubic-bezier(0.22,1,0.36,1);
//     background:#F7F7FA;
//     border-top:1px solid #EEEEF2;
//   }
//   .ss-panel.open { max-height:520px; }

//   /* Tab bar */
//   .ss-panel-tabs {
//     display:flex; align-items:center;
//     padding:0 56px;
//     border-bottom:1px solid #EEEEF2;
//     gap:0;
//   }
//   .ss-panel-tab {
//     font-size:9px; font-weight:400; letter-spacing:0.2em; text-transform:uppercase;
//     padding:14px 20px 12px; background:none; border:none; cursor:pointer;
//     color:#888898; position:relative; transition:color 0.18s;
//     border-bottom:2px solid transparent; margin-bottom:-1px;
//   }
//   .ss-panel-tab:hover { color:#111118; }
//   .ss-panel-tab.on { color:#111118; border-bottom-color:#E8405A; }
//   .ss-panel-tab-count {
//     display:inline-flex; align-items:center; justify-content:center;
//     margin-left:6px; width:16px; height:16px; border-radius:50%;
//     background:#EEEEF2; font-size:8px; font-weight:500; color:#888898;
//     transition:background 0.18s, color 0.18s;
//   }
//   .ss-panel-tab.on .ss-panel-tab-count { background:#E8405A; color:#fff; }

//   /* Panel heading */
//   .ss-panel-head {
//     padding:20px 56px 0;
//     display:flex; align-items:center; justify-content:space-between;
//   }
//   .ss-panel-heading {
//     font-family:'Cormorant Garamond',serif;
//     font-size:22px; font-weight:300; font-style:italic;
//     color:#111118; line-height:1;
//   }
//   .ss-panel-heading span {
//     font-size:9px; font-style:normal; font-weight:500;
//     letter-spacing:0.2em; text-transform:uppercase;
//     color:#E8405A; margin-right:8px;
//   }
//   .ss-panel-close {
//     width:28px; height:28px; border:1.5px solid #EEEEF2;
//     background:#fff; cursor:pointer; font-size:13px; color:#888898;
//     display:flex; align-items:center; justify-content:center;
//     transition:all 0.18s; flex-shrink:0; border-radius:4px;
//   }
//   .ss-panel-close:hover { background:#111118; color:#fff; border-color:#111118; }

//   /* Tab content */
//   .ss-panel-content { padding:20px 56px 24px; }

//   /* Subcategory cards */
//   .ss-subcat-items { display:flex; gap:10px; flex-wrap:wrap; }
//   .ss-subcat-card {
//     display:flex; flex-direction:column; gap:7px;
//     cursor:pointer; border:none; background:none; padding:0; text-align:left;
//     transition:transform 0.28s cubic-bezier(0.22,1,0.36,1);
//   }
//   .ss-subcat-card:hover { transform:translateY(-3px); }
//   .ss-subcat-card-img {
//     width:clamp(64px,6.5vw,88px); aspect-ratio:1;
//     object-fit:cover; display:block;
//     border:1.5px solid #EEEEF2; border-radius:4px;
//     transition:border-color 0.18s;
//   }
//   .ss-subcat-card:hover .ss-subcat-card-img { border-color:#E8405A; }
//   .ss-subcat-card.sel .ss-subcat-card-img { border-color:#E8405A; outline:2px solid #FDEEF1; }
//   .ss-subcat-card-name {
//     font-size:9px; font-weight:400; letter-spacing:0.12em; text-transform:uppercase;
//     color:#888898; transition:color 0.18s;
//     max-width:clamp(64px,6.5vw,88px); line-height:1.4;
//   }
//   .ss-subcat-card:hover .ss-subcat-card-name,
//   .ss-subcat-card.sel   .ss-subcat-card-name { color:#111118; }

//   /* Brand pills */
//   .ss-brands-grid { display:flex; flex-wrap:wrap; gap:8px; }
//   .ss-brand-pill {
//     font-size:10px; font-weight:400; letter-spacing:0.12em; text-transform:uppercase;
//     padding:7px 16px; border:1.5px solid #EEEEF2;
//     background:#fff; color:#888898;
//     cursor:pointer; transition:all 0.18s; white-space:nowrap;
//     font-family:'Jost',sans-serif; border-radius:4px;
//   }
//   .ss-brand-pill:hover { border-color:#111118; color:#111118; background:#fff; }
//   .ss-brand-pill.sel  { background:#111118; color:#fff; border-color:#111118; }
//   .ss-brand-pill.sel:hover { background:#E8405A; border-color:#E8405A; }

//   /* ── Sticky filter bar ── */
//   .ss-filter-bar {
//     padding:16px 56px;
//     display:flex; align-items:center; justify-content:space-between;
//     flex-wrap:wrap; gap:10px;
//     border-bottom:1px solid #EEEEF2;
//     background:#fff;
//     position:sticky; top:104px; z-index:50;
//     box-shadow:0 2px 12px rgba(17,17,24,0.04);
//   }
//   .ss-filter-left  { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
//   .ss-filter-right { display:flex; align-items:center; gap:10px; }

//   /* Price pills */
//   .ss-price-pills { display:flex; }
//   .ss-price-pill {
//     font-size:9px; font-weight:400; letter-spacing:0.11em; text-transform:uppercase;
//     padding:6px 11px; border:1.5px solid #EEEEF2;
//     margin-right:-1px; background:#fff; color:#888898;
//     cursor:pointer; transition:all 0.16s; white-space:nowrap;
//   }
//   .ss-price-pill:hover { color:#111118; border-color:rgba(17,17,24,0.2); z-index:1; }
//   .ss-price-pill.on { background:#111118; color:#fff; border-color:#111118; z-index:1; }

//   /* In-stock toggle */
//   .ss-stock-btn {
//     display:flex; align-items:center; gap:6px;
//     font-size:9px; font-weight:400; letter-spacing:0.11em; text-transform:uppercase;
//     color:#888898; cursor:pointer;
//     padding:6px 11px; border:1.5px solid #EEEEF2;
//     background:#fff; transition:all 0.16s; border-radius:3px;
//   }
//   .ss-stock-btn.on { background:#111118; color:#fff; border-color:#111118; }
//   .ss-stock-dot { width:5px; height:5px; border-radius:50%; background:#4aab6a; flex-shrink:0; }
//   .ss-sort-label { font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:#888898; }
//   .ss-sort-select {
//     font-family:'Jost',sans-serif; font-size:10px; letter-spacing:0.08em;
//     text-transform:uppercase; padding:6px 11px;
//     border:1.5px solid #EEEEF2; background:#fff; color:#111118;
//     cursor:pointer; outline:none; border-radius:3px; transition:border-color 0.16s;
//   }
//   .ss-sort-select:focus { border-color:#E8405A; }

//   /* Active filter chips */
//   .ss-chips { display:flex; gap:5px; flex-wrap:wrap; align-items:center; }
//   .ss-chip {
//     display:flex; align-items:center; gap:5px;
//     font-size:9px; font-weight:500; letter-spacing:0.1em; text-transform:uppercase;
//     padding:5px 10px; background:#E8405A; color:#fff;
//     border:none; cursor:pointer; border-radius:3px; transition:background 0.18s;
//   }
//   .ss-chip:hover { background:#c42d45; }
//   .ss-chip-x { font-size:11px; line-height:1; }
//   .ss-chips-clear {
//     font-size:9px; font-weight:400; letter-spacing:0.11em; text-transform:uppercase;
//     color:#888898; background:none; border:none; cursor:pointer;
//     padding:5px 6px; text-decoration:underline; text-decoration-color:transparent;
//     transition:all 0.16s;
//   }
//   .ss-chips-clear:hover { color:#E8405A; text-decoration-color:#E8405A; }

//   /* ── Product grid layout ── */
//   .ss-grid-wrap { padding:28px 56px 0; background:#fff; }
//   .ss-grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:#EEEEF2; }
//   .ss-grid-2 { display:grid; grid-template-columns:repeat(2,1fr); gap:1px; background:#EEEEF2; }
//   .ss-grid-1 { display:grid; grid-template-columns:1fr;           gap:1px; background:#EEEEF2; }

//   /* Grid card */
//   .ss-pc {
//     background:#fff; position:relative; overflow:hidden;
//     cursor:pointer; transition:background 0.22s;
//     opacity:0; transform:translateY(22px);
//   }
//   .ss-pc.vis { animation:ssFadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards; }
//   .ss-pc:hover { background:#F7F7FA; }
//   .ss-pc-img {
//     overflow:hidden; background:#F7F7FA; position:relative; transition:background 0.3s;
//   }
//   .ss-grid-3 .ss-pc-img { height:280px; }
//   .ss-grid-2 .ss-pc-img { height:340px; }
//   .ss-pc:hover .ss-pc-img { background:#EEEEF2; }
//   .ss-pc-photo {
//     width:100%; height:100%; object-fit:cover; display:block;
//     transition:transform 0.52s cubic-bezier(0.22,1,0.36,1); will-change:transform;
//   }
//   .ss-pc:hover .ss-pc-photo { transform:scale(1.05); }
//   .ss-pc-lbl {
//     position:absolute; top:0; left:0;
//     font-size:9px; font-weight:500; letter-spacing:0.16em; text-transform:uppercase;
//     padding:5px 12px; background:#fff; color:#111118;
//     border-bottom:1px solid #EEEEF2; border-right:1px solid #EEEEF2;
//   }
//   .ss-pc-lbl.sale  { background:#E8405A; color:#fff; border-color:#E8405A; }
//   .ss-pc-lbl.new-l { background:#111118; color:#fff; border-color:#111118; }
//   .ss-pc-wish {
//     position:absolute; top:10px; right:10px; width:30px; height:30px;
//     background:rgba(255,255,255,0.92); border:1.5px solid #EEEEF2; border-radius:50%;
//     font-size:13px; display:flex; align-items:center; justify-content:center;
//     cursor:pointer; opacity:0; transition:opacity 0.22s, color 0.18s, border-color 0.18s;
//   }
//   .ss-pc:hover .ss-pc-wish { opacity:1; }
//   .ss-pc-wish:hover { color:#E8405A; border-color:#E8405A; }
//   .ss-pc-quick {
//     position:absolute; bottom:0; left:0; right:0; padding:11px;
//     background:#111118; color:#fff;
//     font-size:9px; font-weight:400; letter-spacing:0.2em; text-transform:uppercase;
//     text-align:center; border:none; cursor:pointer;
//     transform:translateY(100%);
//     transition:transform 0.32s cubic-bezier(0.22,1,0.36,1), background 0.18s;
//   }
//   .ss-pc:hover .ss-pc-quick { transform:translateY(0); }
//   .ss-pc-quick:hover { background:#E8405A; }
//   .ss-pc-body { padding:18px 22px 22px; }
//   .ss-pc-cat  { font-size:9px; font-weight:500; letter-spacing:0.2em; text-transform:uppercase; color:#E8405A; margin-bottom:5px; }
//   .ss-pc-name { font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; color:#111118; line-height:1.15; }
//   .ss-pc-sub  { font-size:11px; font-weight:300; color:#888898; margin-top:2px; margin-bottom:10px; }
//   .ss-pc-stars { color:#E8405A; font-size:10px; letter-spacing:2px; margin-right:5px; }
//   .ss-pc-rnum  { font-size:11px; font-weight:500; color:#111118; }
//   .ss-pc-rcnt  { font-size:10px; color:#888898; }
//   .ss-pc-foot {
//     display:flex; align-items:center; justify-content:space-between;
//     padding-top:13px; margin-top:12px; border-top:1px solid #EEEEF2;
//   }
//   .ss-pc-price { font-family:'Cormorant Garamond',serif; font-size:23px; font-weight:400; color:#111118; }
//   .ss-pc-was   { font-size:11px; color:#888898; text-decoration:line-through; margin-left:5px; }
//   .ss-pc-stock { font-size:9px; font-weight:400; letter-spacing:0.1em; text-transform:uppercase; color:#888898; }
//   .ss-pc-stock.low { color:#E8405A; }
//   .ss-pc::after {
//     content:''; position:absolute; bottom:0; left:0; width:0; height:2px;
//     background:#E8405A;
//     transition:width 0.45s cubic-bezier(0.22,1,0.36,1);
//   }
//   .ss-pc:hover::after { width:100%; }

//   /* List card */
//   .ss-list {
//     background:#fff; display:flex; align-items:stretch;
//     cursor:pointer; transition:background 0.22s;
//     opacity:0; transform:translateY(14px);
//   }
//   .ss-list.vis { animation:ssFadeUp 0.52s cubic-bezier(0.22,1,0.36,1) forwards; }
//   .ss-list:hover { background:#F7F7FA; }
//   .ss-list-img { width:160px; flex-shrink:0; overflow:hidden; background:#F7F7FA; position:relative; }
//   .ss-list-img img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.5s cubic-bezier(0.22,1,0.36,1); }
//   .ss-list:hover .ss-list-img img { transform:scale(1.05); }
//   .ss-list-body { flex:1; padding:22px 26px; display:flex; align-items:center; justify-content:space-between; gap:20px; }
//   .ss-list-left { flex:1; }
//   .ss-list-cat  { font-size:9px; font-weight:500; letter-spacing:0.18em; text-transform:uppercase; color:#E8405A; margin-bottom:5px; }
//   .ss-list-name { font-family:'Cormorant Garamond',serif; font-size:21px; font-weight:500; letter-spacing:0.06em; text-transform:uppercase; color:#111118; }
//   .ss-list-sub  { font-size:11px; font-weight:300; color:#888898; margin-top:2px; margin-bottom:8px; }
//   .ss-list-desc { font-size:12px; font-weight:300; color:#3a3a44; line-height:1.7; max-width:360px; }
//   .ss-list-right { text-align:right; flex-shrink:0; }
//   .ss-list-price { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:400; color:#111118; }
//   .ss-list-was   { font-size:11px; color:#888898; text-decoration:line-through; margin-top:2px; }
//   .ss-list-stock { font-size:9px; font-weight:400; letter-spacing:0.1em; text-transform:uppercase; color:#888898; display:block; margin-top:5px; }
//   .ss-list-stock.low { color:#E8405A; }
//   .ss-list-btn {
//     margin-top:12px; padding:9px 18px;
//     font-family:'Jost',sans-serif; font-size:9px; font-weight:400; letter-spacing:0.18em; text-transform:uppercase;
//     background:#111118; color:#fff; border:none; cursor:pointer;
//     border-radius:4px; transition:background 0.18s;
//   }
//   .ss-list-btn:hover { background:#E8405A; }

//   /* Empty state */
//   .ss-empty { padding:72px 56px; text-align:center; background:#fff; }
//   .ss-empty-icon  { font-size:32px; color:#E8405A; margin-bottom:14px; display:block; }
//   .ss-empty-title { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:300; color:#111118; margin-bottom:8px; }
//   .ss-empty-sub   { font-size:12px; font-weight:300; color:#888898; margin-bottom:22px; }
//   .ss-empty-btn   {
//     font-size:10px; font-weight:400; letter-spacing:0.18em; text-transform:uppercase;
//     padding:11px 26px; background:#111118; color:#fff; border:none; cursor:pointer;
//     border-radius:4px; transition:background 0.18s;
//   }
//   .ss-empty-btn:hover { background:#E8405A; }

//   /* Load more */
//   .ss-load-more { padding:44px 56px 0; display:flex; align-items:center; justify-content:center; gap:18px; }
//   .ss-load-more-line { flex:1; height:1px; background:#EEEEF2; }
//   .ss-load-more-btn {
//     font-size:9px; font-weight:400; letter-spacing:0.22em; text-transform:uppercase;
//     padding:11px 30px; border:1.5px solid #EEEEF2; background:#fff;
//     color:#888898; cursor:pointer; border-radius:4px; transition:all 0.18s; white-space:nowrap;
//   }
//   .ss-load-more-btn:hover { background:#111118; color:#fff; border-color:#111118; }

//   @keyframes ssFadeUp { to { opacity:1; transform:translateY(0); } }

//   /* ── Responsive ── */
//   @media(max-width:1200px){ .ss-tiles{ grid-template-columns:repeat(4,1fr); } }
//   @media(max-width:1100px){
//     .ss-header,.ss-tiles-wrap,.ss-panel-head,.ss-panel-tabs,.ss-panel-content,
//     .ss-filter-bar,.ss-grid-wrap,.ss-load-more { padding-left:28px!important; padding-right:28px!important; }
//     .ss-grid-3 { grid-template-columns:repeat(2,1fr); }
//     .ss-header { flex-direction:column; align-items:flex-start; gap:14px; }
//   }
//   @media(max-width:640px){
//     .ss-header,.ss-tiles-wrap,.ss-panel-head,.ss-panel-tabs,.ss-panel-content,
//     .ss-filter-bar,.ss-grid-wrap,.ss-load-more { padding-left:16px!important; padding-right:16px!important; }
//     .ss-grid-3,.ss-grid-2 { grid-template-columns:1fr; }
//     .ss-tiles { grid-template-columns:repeat(2,1fr); }
//     .ss-panel.open { max-height:680px; }
//     .ss-subcat-items { gap:8px; }
//     .ss-list-body  { flex-direction:column; align-items:flex-start; }
//     .ss-list-right { text-align:left; }
//   }
// `;

// // ─── ShopSection component ────────────────────────────────────────────────────
// /**
//  * Props
//  *  products       Product[]   – full unfiltered product array
//  *  onProductClick (p) => void – open product detail overlay
//  *  addToCart      (p, qty)    – add item to cart
//  */
// export default function ShopSection({ products = [], onProductClick, addToCart }) {
//   const [shopCat,      setShopCat]      = useState("all");
//   const [shopSub,      setShopSub]      = useState(null);
//   const [shopBrand,    setShopBrand]    = useState(null);
//   const [panelTab,     setPanelTab]     = useState("sub");
//   const [priceRange,   setPriceRange]   = useState(0);
//   const [inStockOnly,  setInStockOnly]  = useState(false);
//   const [sort,         setSort]         = useState("featured");
//   const [viewMode,     setViewMode]     = useState("3");
//   const [visibleCount, setVisibleCount] = useState(9);
//   const [cardVis,      setCardVis]      = useState(new Set());

//   const cardRefs = useRef([]);

//   // IntersectionObserver — card fade-in
//   useEffect(() => {
//     const obs = new IntersectionObserver(
//       es => es.forEach(e => {
//         if (e.isIntersecting) setCardVis(p => new Set([...p, e.target.dataset.ssid]));
//       }),
//       { threshold: 0.07 }
//     );
//     cardRefs.current.forEach(el => el && obs.observe(el));
//     return () => obs.disconnect();
//   }, [shopCat, shopBrand, priceRange, inStockOnly, sort, visibleCount]);

//   // Reset page count on filter change
//   useEffect(() => { setVisibleCount(9); }, [shopCat, shopBrand, priceRange, inStockOnly, sort]);

//   // ── Derived ──
//   const activeTile = CAT_TILES.find(c => c.id === shopCat) || CAT_TILES[0];
//   const panelOpen  = shopCat !== "all" && (activeTile.subs.length > 0 || activeTile.brands.length > 0);

//   const filtered = products
//     .filter(p => {
//       if (shopCat !== "all" && p.category !== shopCat) return false;
//       if (shopBrand && !(p.brand === shopBrand || p.name.toLowerCase().includes(shopBrand.toLowerCase()))) return false;
//       const pr = PRICE_RANGES[priceRange];
//       if (p.price < pr.min || p.price > pr.max) return false;
//       if (inStockOnly && p.stock <= 0) return false;
//       return true;
//     })
//     .sort((a, b) =>
//       sort === "price-asc"  ? a.price - b.price  :
//       sort === "price-desc" ? b.price - a.price  :
//       sort === "rating"     ? b.rating - a.rating : 0
//     );

//   const visible    = filtered.slice(0, visibleCount);
//   const hasFilters = shopCat !== "all" || shopBrand !== null || priceRange !== 0 || inStockOnly;
//   const gridClass  = viewMode === "list" ? "ss-grid-1" : viewMode === "2" ? "ss-grid-2" : "ss-grid-3";

//   const clearFilters = () => {
//     setShopCat("all"); setShopSub(null); setShopBrand(null);
//     setPriceRange(0); setInStockOnly(false); setSort("featured");
//   };

//   const selectCat = (catId) => {
//     if (shopCat === catId) {
//       setShopCat("all"); setShopSub(null); setShopBrand(null);
//     } else {
//       setShopCat(catId); setShopSub(null); setShopBrand(null);
//       setPanelTab("sub");
//     }
//   };

//   const lblClass = t =>
//     t === "Sale" ? "ss-pc-lbl sale" : t === "New" ? "ss-pc-lbl new-l" : "ss-pc-lbl";

//   return (
//     <>
//       <style>{SHOP_STYLES}</style>

//       {/* ── Section header ── */}
//       <div className="ss-header">
//         <div>
//           <p className="ss-eyebrow">Browse the Store</p>
//           <h2>Creator <em>Essentials</em></h2>
//         </div>
//         <div className="ss-header-right">
//           <span className="ss-count">{filtered.length} products</span>
//           <div className="ss-view-btns">
//             <button className={`ss-vbtn${viewMode === "3" ? " on" : ""}`} onClick={() => setViewMode("3")} title="3-column">
//               <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
//                 <rect x="0"    y="0"    width="3.5" height="3.5" fill="currentColor"/>
//                 <rect x="4.75" y="0"    width="3.5" height="3.5" fill="currentColor"/>
//                 <rect x="9.5"  y="0"    width="3.5" height="3.5" fill="currentColor"/>
//                 <rect x="0"    y="4.75" width="3.5" height="3.5" fill="currentColor"/>
//                 <rect x="4.75" y="4.75" width="3.5" height="3.5" fill="currentColor"/>
//                 <rect x="9.5"  y="4.75" width="3.5" height="3.5" fill="currentColor"/>
//                 <rect x="0"    y="9.5"  width="3.5" height="3.5" fill="currentColor"/>
//                 <rect x="4.75" y="9.5"  width="3.5" height="3.5" fill="currentColor"/>
//                 <rect x="9.5"  y="9.5"  width="3.5" height="3.5" fill="currentColor"/>
//               </svg>
//             </button>
//             <button className={`ss-vbtn${viewMode === "2" ? " on" : ""}`} onClick={() => setViewMode("2")} title="2-column">
//               <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
//                 <rect x="0"   y="0"   width="5.5" height="5.5" fill="currentColor"/>
//                 <rect x="7.5" y="0"   width="5.5" height="5.5" fill="currentColor"/>
//                 <rect x="0"   y="7.5" width="5.5" height="5.5" fill="currentColor"/>
//                 <rect x="7.5" y="7.5" width="5.5" height="5.5" fill="currentColor"/>
//               </svg>
//             </button>
//             <button className={`ss-vbtn${viewMode === "list" ? " on" : ""}`} onClick={() => setViewMode("list")} title="List">
//               <svg width="13" height="11" viewBox="0 0 13 11" fill="none">
//                 <rect x="0" y="0"   width="13" height="2" fill="currentColor"/>
//                 <rect x="0" y="4.5" width="13" height="2" fill="currentColor"/>
//                 <rect x="0" y="9"   width="13" height="2" fill="currentColor"/>
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ── Category photo tiles ── */}
//       <div className="ss-tiles-wrap">
//         <p className="ss-tiles-label">Browse by category</p>
//         <div className="ss-tiles">
//           {CAT_TILES.map(cat => (
//             <button
//               key={cat.id}
//               className={`ss-tile${shopCat === cat.id ? " active" : ""}`}
//               style={{ "--tile-accent": cat.accent }}
//               onClick={() => selectCat(cat.id)}
//             >
//               <img className="ss-tile-img" src={cat.img} alt={cat.label} loading="lazy" />
//               <div className="ss-tile-dot" />
//               <div className="ss-tile-info">
//                 <span className="ss-tile-name">{cat.label}</span>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ── Expanded panel — subcategories + brands ── */}
//       <div className={`ss-panel${panelOpen ? " open" : ""}`}>
//         <div className="ss-panel-head">
//           <p className="ss-panel-heading">
//             <span>Browsing</span>
//             {activeTile.label}
//           </p>
//           <button
//             className="ss-panel-close"
//             onClick={() => { setShopCat("all"); setShopSub(null); setShopBrand(null); }}
//             title="Close"
//           >✕</button>
//         </div>

//         <div className="ss-panel-tabs">
//           {activeTile.subs.length > 0 && (
//             <button
//               className={`ss-panel-tab${panelTab === "sub" ? " on" : ""}`}
//               onClick={() => setPanelTab("sub")}
//             >
//               Subcategories
//               <span className="ss-panel-tab-count">{activeTile.subs.length}</span>
//             </button>
//           )}
//           {activeTile.brands.length > 0 && (
//             <button
//               className={`ss-panel-tab${panelTab === "brand" ? " on" : ""}`}
//               onClick={() => setPanelTab("brand")}
//             >
//               Brands
//               <span className="ss-panel-tab-count">{activeTile.brands.length}</span>
//             </button>
//           )}
//         </div>

//         <div className="ss-panel-content">
//           {panelTab === "sub" && activeTile.subs.length > 0 && (
//             <div className="ss-subcat-items">
//               {activeTile.subs.map(sub => (
//                 <button
//                   key={sub.label}
//                   className={`ss-subcat-card${shopSub === sub.label ? " sel" : ""}`}
//                   onClick={() => setShopSub(shopSub === sub.label ? null : sub.label)}
//                 >
//                   <img className="ss-subcat-card-img" src={sub.img} alt={sub.label} loading="lazy" />
//                   <span className="ss-subcat-card-name">{sub.label}</span>
//                 </button>
//               ))}
//             </div>
//           )}

//           {panelTab === "brand" && activeTile.brands.length > 0 && (
//             <div className="ss-brands-grid">
//               {activeTile.brands.map(brand => (
//                 <button
//                   key={brand}
//                   className={`ss-brand-pill${shopBrand === brand ? " sel" : ""}`}
//                   onClick={() => setShopBrand(shopBrand === brand ? null : brand)}
//                 >
//                   {brand}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Sticky filter + sort bar ── */}
//       <div className="ss-filter-bar">
//         <div className="ss-filter-left">

//           {/* Price range pills */}
//           <div className="ss-price-pills">
//             {PRICE_RANGES.map((pr, idx) => (
//               <button
//                 key={pr.label}
//                 className={`ss-price-pill${priceRange === idx ? " on" : ""}`}
//                 onClick={() => setPriceRange(idx)}
//               >{pr.label}</button>
//             ))}
//           </div>

//           {/* In-stock toggle */}
//           <button
//             className={`ss-stock-btn${inStockOnly ? " on" : ""}`}
//             onClick={() => setInStockOnly(s => !s)}
//           >
//             <span className="ss-stock-dot" />
//             In Stock Only
//           </button>

//           {/* Active filter chips */}
//           {hasFilters && (
//             <div className="ss-chips">
//               {shopCat !== "all" && (
//                 <button className="ss-chip" onClick={() => { setShopCat("all"); setShopSub(null); setShopBrand(null); }}>
//                   {shopCat} <span className="ss-chip-x">×</span>
//                 </button>
//               )}
//               {shopBrand && (
//                 <button className="ss-chip" onClick={() => setShopBrand(null)}>
//                   {shopBrand} <span className="ss-chip-x">×</span>
//                 </button>
//               )}
//               {priceRange !== 0 && (
//                 <button className="ss-chip" onClick={() => setPriceRange(0)}>
//                   {PRICE_RANGES[priceRange].label} <span className="ss-chip-x">×</span>
//                 </button>
//               )}
//               {inStockOnly && (
//                 <button className="ss-chip" onClick={() => setInStockOnly(false)}>
//                   In Stock <span className="ss-chip-x">×</span>
//                 </button>
//               )}
//               <button className="ss-chips-clear" onClick={clearFilters}>Clear all</button>
//             </div>
//           )}
//         </div>

//         <div className="ss-filter-right">
//           <span className="ss-sort-label">Sort</span>
//           <select
//             className="ss-sort-select"
//             value={sort}
//             onChange={e => setSort(e.target.value)}
//           >
//             <option value="featured">Featured</option>
//             <option value="price-asc">Price: Low → High</option>
//             <option value="price-desc">Price: High → Low</option>
//             <option value="rating">Top Rated</option>
//           </select>
//         </div>
//       </div>

//       {/* ── Product grid / list ── */}
//       <div className="ss-grid-wrap">
//         {visible.length === 0 ? (
//           <div className="ss-empty">
//             <span className="ss-empty-icon">◇</span>
//             <h3 className="ss-empty-title">No products found</h3>
//             <p className="ss-empty-sub">Try adjusting your filters or browse all categories.</p>
//             <button className="ss-empty-btn" onClick={clearFilters}>Clear Filters</button>
//           </div>

//         ) : viewMode === "list" ? (
//           <div className={gridClass}>
//             {visible.map((p, i) => (
//               <div
//                 key={p.id}
//                 ref={el => cardRefs.current[i] = el}
//                 data-ssid={p.id}
//                 className={`ss-list${cardVis.has(String(p.id)) ? " vis" : ""}`}
//                 style={{ animationDelay:`${i * 0.05}s` }}
//                 onClick={() => onProductClick && onProductClick(p)}
//               >
//                 <div className="ss-list-img">
//                   <img src={p.thumb} alt={p.name} loading="lazy" />
//                   <span className={lblClass(p.tag)} style={{fontSize:"8px"}}>{p.tag}</span>
//                 </div>
//                 <div className="ss-list-body">
//                   <div className="ss-list-left">
//                     <p className="ss-list-cat">{p.category}</p>
//                     <h3 className="ss-list-name">{p.name}</h3>
//                     <p className="ss-list-sub">{p.tagline}</p>
//                     <p className="ss-list-desc">{p.desc}</p>
//                     <div style={{display:"flex",alignItems:"center",gap:"4px",marginTop:"8px"}}>
//                       <span className="ss-pc-stars">{"★".repeat(Math.floor(p.rating))}</span>
//                       <span className="ss-pc-rnum" style={{fontSize:"11px"}}>{p.rating}</span>
//                       <span className="ss-pc-rcnt">({p.reviews.toLocaleString()})</span>
//                     </div>
//                   </div>
//                   <div className="ss-list-right">
//                     <div className="ss-list-price">{inr(p.price)}</div>
//                     {p.original && <div className="ss-list-was">{inr(p.original)}</div>}
//                     <span className={`ss-list-stock${p.stock <= 10 ? " low" : ""}`}>
//                       {p.stock <= 10 ? `${p.stock} left` : "In Stock"}
//                     </span>
//                     <button
//                       className="ss-list-btn"
//                       onClick={e => { e.stopPropagation(); addToCart && addToCart(p, 1); }}
//                     >Add to Bag</button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//         ) : (
//           <div className={gridClass}>
//             {visible.map((p, i) => (
//               <div
//                 key={p.id}
//                 ref={el => cardRefs.current[i] = el}
//                 data-ssid={p.id}
//                 className={`ss-pc${cardVis.has(String(p.id)) ? " vis" : ""}`}
//                 style={{ animationDelay:`${(i % 3) * 0.08}s` }}
//                 onClick={() => onProductClick && onProductClick(p)}
//               >
//                 <div className="ss-pc-img">
//                   <img className="ss-pc-photo" src={p.thumb} alt={p.name} loading="lazy" />
//                   <span className={lblClass(p.tag)}>{p.tag}</span>
//                   <button className="ss-pc-wish" onClick={e => e.stopPropagation()}>♡</button>
//                   <button
//                     className="ss-pc-quick"
//                     onClick={e => { e.stopPropagation(); addToCart && addToCart(p, 1); }}
//                   >Add to Bag</button>
//                 </div>
//                 <div className="ss-pc-body">
//                   <p className="ss-pc-cat">{p.category}</p>
//                   <h3 className="ss-pc-name">{p.name}</h3>
//                   <p className="ss-pc-sub">{p.tagline}</p>
//                   <div style={{display:"flex",alignItems:"center",gap:"4px",marginBottom:"10px"}}>
//                     <span className="ss-pc-stars">{"★".repeat(Math.floor(p.rating))}</span>
//                     <span className="ss-pc-rnum">{p.rating}</span>
//                     <span className="ss-pc-rcnt">({p.reviews.toLocaleString()})</span>
//                   </div>
//                   <div className="ss-pc-foot">
//                     <div style={{display:"flex",alignItems:"baseline",gap:"4px"}}>
//                       <span className="ss-pc-price">{inr(p.price)}</span>
//                       {p.original && <span className="ss-pc-was">{inr(p.original)}</span>}
//                     </div>
//                     <span className={`ss-pc-stock${p.stock <= 10 ? " low" : ""}`}>
//                       {p.stock <= 10 ? `${p.stock} left` : "In Stock"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Load more */}
//         {visibleCount < filtered.length && (
//           <div className="ss-load-more">
//             <div className="ss-load-more-line" />
//             <button
//               className="ss-load-more-btn"
//               onClick={() => setVisibleCount(n => n + 9)}
//             >
//               Load More · {filtered.length - visibleCount} remaining
//             </button>
//             <div className="ss-load-more-line" />
//           </div>
//         )}
//       </div>
//     </>
//   );
// }


"use client";



import { useState, useEffect, useRef, useCallback } from 'react';
import { inr } from '@/lib/formatCurrency';
import PlanPrice from '@/components/products/PlanPrice';
import AddToBagButton from '@/components/ui/AddToBagButton';
import { useMembership } from '@/hooks/useMembership';

// ─── Category Tiles + Subcategories + Brands ──────────────────────────────────
const CAT_TILES = [
  {
    id:"all", label:"All Products",
    img:"https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=700&q=80",
    accent:"#E8405A", subs:[], brands:[],
  },
  {
    id:"Cameras", label:"Cameras",
    img:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700&q=80",
    accent:"#E8405A",
    subs:[
      { label:"Mirrorless",   img:"https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=300&q=70" },
      { label:"DSLR",         img:"https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&q=70" },
      { label:"Action Cams",  img:"https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?w=300&q=70" },
      { label:"Cinema",       img:"https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=300&q=70" },
      { label:"Camcorders",   img:"https://images.unsplash.com/photo-1547082299-de196ea013d6?w=300&q=70" },
      { label:"Instant",      img:"https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=300&q=70" },
      { label:"Drones",       img:"https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=300&q=70" },
      { label:"Point & Shoot",img:"https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&q=70" },
    ],
    brands:["Sony","Canon","Nikon","Fujifilm","Panasonic","DJI","GoPro","Insta360","Digitek","Blackmagic","Instax","Kodak"],
  },
  {
    id:"Lighting", label:"Lighting",
    img:"https://images.unsplash.com/photo-1627483262769-04d0a1401487?w=700&q=80",
    accent:"#E8405A",
    subs:[
      { label:"Panel Lights",  img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=70" },
      { label:"Ring Lights",   img:"https://images.unsplash.com/photo-1627483262769-04d0a1401487?w=300&q=70" },
      { label:"Softboxes",     img:"https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&q=70" },
      { label:"Flash Kits",    img:"https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&q=70" },
      { label:"Streaming",     img:"https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=300&q=70" },
      { label:"Monolights",    img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=70" },
      { label:"Shooting Tents",img:"https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&q=70" },
    ],
    brands:["Godox","Nanlite","Aputure","Neewer","Profoto","Westcott","Digitek","Bowens"],
  },
  {
    id:"Lenses", label:"Lenses",
    img:"https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=700&q=80",
    accent:"#E8405A",
    subs:[
      { label:"Mirrorless",   img:"https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=300&q=70" },
      { label:"DSLR/SLR",    img:"https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&q=70" },
      { label:"Cine Lenses",  img:"https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?w=300&q=70" },
      { label:"Medium Format",img:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=70" },
    ],
    brands:["Canon","Nikon","Sony","Sigma","Tamron","Fujifilm","Samyang","ZEISS","Laowa","7artisans","Viltrox","TTArtisan","Irix"],
  },
  {
    id:"Bags & Tripods", label:"Bags & Tripods",
    img:"https://images.unsplash.com/photo-1547082299-de196ea013d6?w=700&q=80",
    accent:"#E8405A",
    subs:[
      { label:"Backpacks",    img:"https://images.unsplash.com/photo-1547082299-de196ea013d6?w=300&q=70" },
      { label:"Shoulder Bags",img:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&q=70" },
      { label:"Trolley Bags", img:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&q=70" },
      { label:"Tripods",      img:"https://images.unsplash.com/photo-1589384267710-7a170981ca78?w=300&q=70" },
      { label:"Monopods",     img:"https://images.unsplash.com/photo-1596162954151-cdcb4c0f70fb?w=300&q=70" },
      { label:"Ball Heads",   img:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=70" },
    ],
    brands:["Vanguard","Lowepro","Think Tank","Peak Design","Manfrotto","Gitzo","Benro","Joby","K&F Concept","Zomei"],
  },
  {
    id:"Gimbals", label:"Gimbals",
    img:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80",
    accent:"#E8405A",
    subs:[
      { label:"Camera Gimbals",img:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&q=70" },
      { label:"Smartphone",    img:"https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=300&q=70" },
      { label:"Pocket Gimbals",img:"https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=300&q=70" },
    ],
    brands:["DJI","Zhiyun","Moza","FeiyuTech","Hohem","Gudsen","Snoppa"],
  },
  {
    id:"Audio", label:"Audio",
    img:"https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=700&q=80",
    accent:"#E8405A",
    subs:[
      { label:"Wireless Lavs",img:"https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&q=70" },
      { label:"Condensers",   img:"https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=300&q=70" },
      { label:"On-Camera",    img:"https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&q=70" },
      { label:"Wired Audio",  img:"https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&q=70" },
    ],
    brands:["Godox","Hollyland","Rode","Sennheiser","Deity","Mirfak","Digitek","DJI","Saramonic","Tascam"],
  },
  {
    id:"Accessories", label:"Accessories",
    img:"https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=700&q=80",
    accent:"#E8405A",
    subs:[
      { label:"Camera Straps",img:"https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&q=70" },
      { label:"Cages & Rigs", img:"https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=300&q=70" },
      { label:"Memory Cards", img:"https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&q=70" },
      { label:"Lighting Mods",img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=70" },
      { label:"Action Cam Acc",img:"https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?w=300&q=70" },
      { label:"Bag Acc",      img:"https://images.unsplash.com/photo-1547082299-de196ea013d6?w=300&q=70" },
    ],
    brands:["SmallRig","Tilta","Peak Design","Sandisk","Lexar","PolarPro","Freewell","Pgytech","Ulanzi","K&F Concept"],
  },
];

// Price ranges in INR (1 USD = ₹84)
const PRICE_RANGES = [
  { label:"All Prices",       min:0,    max:Infinity },
  { label:"Under ₹16,800",   min:0,    max:200      },
  { label:"₹16,800–₹42,000", min:200,  max:500      },
  { label:"₹42,000–₹84,000", min:500,  max:1000     },
  { label:"₹84,000+",        min:1000, max:Infinity },
];

// ─── Styles — WHITE + ROSE PINK theme ─────────────────────────────────────────
const SHOP_STYLES = `
  /* ─── CSS overrides: rose replaces gold, white replaces cream ─── */

  /* ── Section header ── */
  .ss-header {
    padding: 56px 56px 36px;
    display: flex; align-items: flex-end; justify-content: space-between;
    border-bottom: 1px solid #EEEEF2;
    background: #fff;
  }
  .ss-eyebrow {
    font-size: 9px; font-weight: 500; letter-spacing: 0.28em; text-transform: uppercase;
    color: #E8405A; margin-bottom: 8px;
    display: flex; align-items: center; gap: 10px;
  }
  .ss-eyebrow::before { content:''; width:18px; height:1px; background:#E8405A; opacity:0.6; }
  .ss-header h2 {
    font-family:'Cormorant Garamond',serif;
    font-size: clamp(28px,3.2vw,44px); font-weight:300; line-height:1;
    color: #111118;
  }
  .ss-header h2 em { font-style:italic; color:#E8405A; }
  .ss-header-right { display:flex; align-items:center; gap:12px; flex-shrink:0; }
  .ss-count {
    font-size:10px; letter-spacing:0.14em; text-transform:uppercase;
    color:#888898; padding:8px 14px;
    border:1.5px solid #EEEEF2; border-radius:4px; background:#fff;
  }
  .ss-view-btns { display:flex; }
  .ss-vbtn {
    width:34px; height:34px;
    border:1.5px solid #EEEEF2;
    background:#fff; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    margin-right:-1px; transition:all 0.18s;
    color:#888898;
  }
  .ss-vbtn.on  { background:#111118; color:#fff; border-color:#111118; }
  .ss-vbtn:hover:not(.on) { border-color:#111118; color:#111118; }

  /* ── Category tiles ── */
  .ss-tiles-wrap { padding:36px 56px 0; background:#fff; }
  .ss-tiles-label {
    font-size:9px; font-weight:500; letter-spacing:0.24em; text-transform:uppercase;
    color:#888898; margin-bottom:16px;
  }
  .ss-tiles {
    display:grid; grid-template-columns:repeat(8,1fr);
    gap:1px; background:#EEEEF2;
  }
  .ss-tile {
    position:relative; overflow:hidden; cursor:pointer;
    aspect-ratio:3/4; background:#F7F7FA;
    border:none; padding:0;
  }
  .ss-tile-img {
    width:100%; height:100%; object-fit:cover; display:block;
    transition:transform 0.65s cubic-bezier(0.22,1,0.36,1), filter 0.4s;
    filter:brightness(0.68) saturate(0.82);
  }
  .ss-tile:hover .ss-tile-img,
  .ss-tile.active .ss-tile-img { transform:scale(1.07); filter:brightness(0.45) saturate(1); }
  .ss-tile::after {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background:#E8405A;
    transform:scaleX(0); transform-origin:left;
    transition:transform 0.42s cubic-bezier(0.22,1,0.36,1);
  }
  .ss-tile:hover::after, .ss-tile.active::after { transform:scaleX(1); }
  .ss-tile-info {
    position:absolute; bottom:0; left:0; right:0;
    padding:10px 12px 13px;
    background:linear-gradient(0deg,rgba(17,17,24,0.9) 0%,transparent 100%);
  }
  .ss-tile-name {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(9px,0.95vw,13px); font-weight:500;
    letter-spacing:0.1em; text-transform:uppercase;
    color:#f0ebe2; line-height:1.2; display:block;
  }
  .ss-tile.active .ss-tile-name { color:#f9c0c8; }
  .ss-tile-dot {
    position:absolute; top:9px; right:9px;
    width:6px; height:6px; border-radius:50%;
    background:#E8405A;
    opacity:0; transform:scale(0);
    transition:opacity 0.28s, transform 0.28s;
  }
  .ss-tile.active .ss-tile-dot { opacity:1; transform:scale(1); }

  /* ── Expanded panel ── */
  .ss-panel {
    overflow:hidden; max-height:0;
    transition:max-height 0.6s cubic-bezier(0.22,1,0.36,1);
    background:#F7F7FA;
    border-top:1px solid #EEEEF2;
  }
  .ss-panel.open { max-height:520px; }

  /* Tab bar */
  .ss-panel-tabs {
    display:flex; align-items:center;
    padding:0 56px;
    border-bottom:1px solid #EEEEF2;
    gap:0;
  }
  .ss-panel-tab {
    font-size:9px; font-weight:400; letter-spacing:0.2em; text-transform:uppercase;
    padding:14px 20px 12px; background:none; border:none; cursor:pointer;
    color:#888898; position:relative; transition:color 0.18s;
    border-bottom:2px solid transparent; margin-bottom:-1px;
  }
  .ss-panel-tab:hover { color:#111118; }
  .ss-panel-tab.on { color:#111118; border-bottom-color:#E8405A; }
  .ss-panel-tab-count {
    display:inline-flex; align-items:center; justify-content:center;
    margin-left:6px; width:16px; height:16px; border-radius:50%;
    background:#EEEEF2; font-size:8px; font-weight:500; color:#888898;
    transition:background 0.18s, color 0.18s;
  }
  .ss-panel-tab.on .ss-panel-tab-count { background:#E8405A; color:#fff; }

  /* Panel heading */
  .ss-panel-head {
    padding:20px 56px 0;
    display:flex; align-items:center; justify-content:space-between;
  }
  .ss-panel-heading {
    font-family:'Cormorant Garamond',serif;
    font-size:22px; font-weight:300; font-style:italic;
    color:#111118; line-height:1;
  }
  .ss-panel-heading span {
    font-size:9px; font-style:normal; font-weight:500;
    letter-spacing:0.2em; text-transform:uppercase;
    color:#E8405A; margin-right:8px;
  }
  .ss-panel-close {
    width:28px; height:28px; border:1.5px solid #EEEEF2;
    background:#fff; cursor:pointer; font-size:13px; color:#888898;
    display:flex; align-items:center; justify-content:center;
    transition:all 0.18s; flex-shrink:0; border-radius:4px;
  }
  .ss-panel-close:hover { background:#111118; color:#fff; border-color:#111118; }

  /* Tab content */
  .ss-panel-content { padding:20px 56px 24px; }

  /* Subcategory cards */
  .ss-subcat-items { display:flex; gap:10px; flex-wrap:wrap; }
  .ss-subcat-card {
    display:flex; flex-direction:column; gap:7px;
    cursor:pointer; border:none; background:none; padding:0; text-align:left;
    transition:transform 0.28s cubic-bezier(0.22,1,0.36,1);
  }
  .ss-subcat-card:hover { transform:translateY(-3px); }
  .ss-subcat-card-img {
    width:clamp(64px,6.5vw,88px); aspect-ratio:1;
    object-fit:cover; display:block;
    border:1.5px solid #EEEEF2; border-radius:4px;
    transition:border-color 0.18s;
  }
  .ss-subcat-card:hover .ss-subcat-card-img { border-color:#E8405A; }
  .ss-subcat-card.sel .ss-subcat-card-img { border-color:#E8405A; outline:2px solid #FDEEF1; }
  .ss-subcat-card-name {
    font-size:9px; font-weight:400; letter-spacing:0.12em; text-transform:uppercase;
    color:#888898; transition:color 0.18s;
    max-width:clamp(64px,6.5vw,88px); line-height:1.4;
  }
  .ss-subcat-card:hover .ss-subcat-card-name,
  .ss-subcat-card.sel   .ss-subcat-card-name { color:#111118; }

  /* Brand pills */
  .ss-brands-grid { display:flex; flex-wrap:wrap; gap:8px; }
  .ss-brand-pill {
    font-size:10px; font-weight:400; letter-spacing:0.12em; text-transform:uppercase;
    padding:7px 16px; border:1.5px solid #EEEEF2;
    background:#fff; color:#888898;
    cursor:pointer; transition:all 0.18s; white-space:nowrap;
    font-family:'Jost',sans-serif; border-radius:4px;
  }
  .ss-brand-pill:hover { border-color:#111118; color:#111118; background:#fff; }
  .ss-brand-pill.sel  { background:#111118; color:#fff; border-color:#111118; }
  .ss-brand-pill.sel:hover { background:#E8405A; border-color:#E8405A; }

  /* ── Sticky filter bar ── */
  .ss-filter-bar {
    padding:16px 56px;
    display:flex; align-items:center; justify-content:space-between;
    flex-wrap:wrap; gap:10px;
    border-bottom:1px solid #EEEEF2;
    background:#fff;
    position:sticky; top:104px; z-index:50;
    box-shadow:0 2px 12px rgba(17,17,24,0.04);
  }
  .ss-filter-left  { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .ss-filter-right { display:flex; align-items:center; gap:10px; }

  /* Price pills */
  .ss-price-pills { display:flex; }
  .ss-price-pill {
    font-size:9px; font-weight:400; letter-spacing:0.11em; text-transform:uppercase;
    padding:6px 11px; border:1.5px solid #EEEEF2;
    margin-right:-1px; background:#fff; color:#888898;
    cursor:pointer; transition:all 0.16s; white-space:nowrap;
  }
  .ss-price-pill:hover { color:#111118; border-color:rgba(17,17,24,0.2); z-index:1; }
  .ss-price-pill.on { background:#111118; color:#fff; border-color:#111118; z-index:1; }

  /* In-stock toggle */
  .ss-stock-btn {
    display:flex; align-items:center; gap:6px;
    font-size:9px; font-weight:400; letter-spacing:0.11em; text-transform:uppercase;
    color:#888898; cursor:pointer;
    padding:6px 11px; border:1.5px solid #EEEEF2;
    background:#fff; transition:all 0.16s; border-radius:3px;
  }
  .ss-stock-btn.on { background:#111118; color:#fff; border-color:#111118; }
  .ss-stock-dot { width:5px; height:5px; border-radius:50%; background:#4aab6a; flex-shrink:0; }
  .ss-sort-label { font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:#888898; }
  .ss-sort-select {
    font-family:'Jost',sans-serif; font-size:10px; letter-spacing:0.08em;
    text-transform:uppercase; padding:6px 11px;
    border:1.5px solid #EEEEF2; background:#fff; color:#111118;
    cursor:pointer; outline:none; border-radius:3px; transition:border-color 0.16s;
  }
  .ss-sort-select:focus { border-color:#E8405A; }

  /* Active filter chips */
  .ss-chips { display:flex; gap:5px; flex-wrap:wrap; align-items:center; }
  .ss-chip {
    display:flex; align-items:center; gap:5px;
    font-size:9px; font-weight:500; letter-spacing:0.1em; text-transform:uppercase;
    padding:5px 10px; background:#E8405A; color:#fff;
    border:none; cursor:pointer; border-radius:3px; transition:background 0.18s;
  }
  .ss-chip:hover { background:#c42d45; }
  .ss-chip-x { font-size:11px; line-height:1; }
  .ss-chips-clear {
    font-size:9px; font-weight:400; letter-spacing:0.11em; text-transform:uppercase;
    color:#888898; background:none; border:none; cursor:pointer;
    padding:5px 6px; text-decoration:underline; text-decoration-color:transparent;
    transition:all 0.16s;
  }
  .ss-chips-clear:hover { color:#E8405A; text-decoration-color:#E8405A; }

  /* ── Product grid layout ── */
  .ss-grid-wrap { padding:28px 56px 0; background:#fff; }
  .ss-grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:#EEEEF2; }
  .ss-grid-2 { display:grid; grid-template-columns:repeat(2,1fr); gap:1px; background:#EEEEF2; }
  .ss-grid-1 { display:grid; grid-template-columns:1fr;           gap:1px; background:#EEEEF2; }

  /* Grid card */
  .ss-pc {
    background:#fff; position:relative; overflow:hidden;
    cursor:pointer; transition:background 0.22s;
    opacity:0; transform:translateY(22px);
  }
  .ss-pc.vis { animation:ssFadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards; }
  .ss-pc:hover { background:#F7F7FA; }
  .ss-pc-img {
    overflow:hidden; background:#F7F7FA; position:relative; transition:background 0.3s;
  }
  .ss-grid-3 .ss-pc-img { height:280px; }
  .ss-grid-2 .ss-pc-img { height:340px; }
  .ss-pc:hover .ss-pc-img { background:#EEEEF2; }
  .ss-pc-photo {
    width:100%; height:100%; object-fit:cover; display:block;
    transition:transform 0.52s cubic-bezier(0.22,1,0.36,1); will-change:transform;
  }
  .ss-pc:hover .ss-pc-photo { transform:scale(1.05); }
  .ss-pc-lbl {
    position:absolute; top:0; left:0;
    font-size:9px; font-weight:500; letter-spacing:0.16em; text-transform:uppercase;
    padding:5px 12px; background:#fff; color:#111118;
    border-bottom:1px solid #EEEEF2; border-right:1px solid #EEEEF2;
  }
  .ss-pc-lbl.sale  { background:#E8405A; color:#fff; border-color:#E8405A; }
  .ss-pc-lbl.new-l { background:#111118; color:#fff; border-color:#111118; }
  .ss-pc-wish {
    position:absolute; top:10px; right:10px; width:30px; height:30px;
    background:rgba(255,255,255,0.92); border:1.5px solid #EEEEF2; border-radius:50%;
    font-size:13px; display:flex; align-items:center; justify-content:center;
    cursor:pointer; opacity:0; transition:opacity 0.22s, color 0.18s, border-color 0.18s;
  }
  .ss-pc:hover .ss-pc-wish { opacity:1; }
  .ss-pc-wish:hover { color:#E8405A; border-color:#E8405A; }
  .ss-pc-quick {
    position:absolute; bottom:0; left:0; right:0; padding:11px;
    background:#111118; color:#fff;
    font-size:9px; font-weight:400; letter-spacing:0.2em; text-transform:uppercase;
    text-align:center; border:none; cursor:pointer;
    transform:translateY(100%);
    transition:transform 0.32s cubic-bezier(0.22,1,0.36,1), background 0.18s;
  }
  .ss-pc:hover .ss-pc-quick { transform:translateY(0); }
  .ss-pc-quick:hover { background:#E8405A; }
  .ss-pc-body { padding:18px 22px 22px; }
  .ss-pc-cat  { font-size:9px; font-weight:500; letter-spacing:0.2em; text-transform:uppercase; color:#E8405A; margin-bottom:5px; }
  .ss-pc-name { font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:500; letter-spacing:0.08em; text-transform:uppercase; color:#111118; line-height:1.15; }
  .ss-pc-sub  { font-size:11px; font-weight:300; color:#888898; margin-top:2px; margin-bottom:10px; }
  .ss-pc-stars { color:#E8405A; font-size:10px; letter-spacing:2px; margin-right:5px; }
  .ss-pc-rnum  { font-size:11px; font-weight:500; color:#111118; }
  .ss-pc-rcnt  { font-size:10px; color:#888898; }
  .ss-pc-foot {
    display:flex; align-items:center; justify-content:space-between;
    padding-top:13px; margin-top:12px; border-top:1px solid #EEEEF2;
  }
  .ss-pc-price { font-family:'Cormorant Garamond',serif; font-size:23px; font-weight:400; color:#111118; }
  .ss-pc-was   { font-size:11px; color:#888898; text-decoration:line-through; margin-left:5px; }
  .ss-pc-stock { font-size:9px; font-weight:400; letter-spacing:0.1em; text-transform:uppercase; color:#888898; }
  .ss-pc-stock.low { color:#E8405A; }
  .ss-pc::after {
    content:''; position:absolute; bottom:0; left:0; width:0; height:2px;
    background:#E8405A;
    transition:width 0.45s cubic-bezier(0.22,1,0.36,1);
  }
  .ss-pc:hover::after { width:100%; }

  /* List card */
  .ss-list {
    background:#fff; display:flex; align-items:stretch;
    cursor:pointer; transition:background 0.22s;
    opacity:0; transform:translateY(14px);
  }
  .ss-list.vis { animation:ssFadeUp 0.52s cubic-bezier(0.22,1,0.36,1) forwards; }
  .ss-list:hover { background:#F7F7FA; }
  .ss-list-img { width:160px; flex-shrink:0; overflow:hidden; background:#F7F7FA; position:relative; }
  .ss-list-img img { width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.5s cubic-bezier(0.22,1,0.36,1); }
  .ss-list:hover .ss-list-img img { transform:scale(1.05); }
  .ss-list-body { flex:1; padding:22px 26px; display:flex; align-items:center; justify-content:space-between; gap:20px; }
  .ss-list-left { flex:1; }
  .ss-list-cat  { font-size:9px; font-weight:500; letter-spacing:0.18em; text-transform:uppercase; color:#E8405A; margin-bottom:5px; }
  .ss-list-name { font-family:'Cormorant Garamond',serif; font-size:21px; font-weight:500; letter-spacing:0.06em; text-transform:uppercase; color:#111118; }
  .ss-list-sub  { font-size:11px; font-weight:300; color:#888898; margin-top:2px; margin-bottom:8px; }
  .ss-list-desc { font-size:12px; font-weight:300; color:#3a3a44; line-height:1.7; max-width:360px; }
  .ss-list-right { text-align:right; flex-shrink:0; }
  .ss-list-price { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:400; color:#111118; }
  .ss-list-was   { font-size:11px; color:#888898; text-decoration:line-through; margin-top:2px; }
  .ss-list-stock { font-size:9px; font-weight:400; letter-spacing:0.1em; text-transform:uppercase; color:#888898; display:block; margin-top:5px; }
  .ss-list-stock.low { color:#E8405A; }
  .ss-list-btn {
    margin-top:12px; padding:9px 18px;
    font-family:'Jost',sans-serif; font-size:9px; font-weight:400; letter-spacing:0.18em; text-transform:uppercase;
    background:#111118; color:#fff; border:none; cursor:pointer;
    border-radius:4px; transition:background 0.18s;
  }
  .ss-list-btn:hover { background:#E8405A; }

  /* Empty state */
  .ss-empty { padding:72px 56px; text-align:center; background:#fff; }
  .ss-empty-icon  { font-size:32px; color:#E8405A; margin-bottom:14px; display:block; }
  .ss-empty-title { font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:300; color:#111118; margin-bottom:8px; }
  .ss-empty-sub   { font-size:12px; font-weight:300; color:#888898; margin-bottom:22px; }
  .ss-empty-btn   {
    font-size:10px; font-weight:400; letter-spacing:0.18em; text-transform:uppercase;
    padding:11px 26px; background:#111118; color:#fff; border:none; cursor:pointer;
    border-radius:4px; transition:background 0.18s;
  }
  .ss-empty-btn:hover { background:#E8405A; }

  /* Load more */
  .ss-load-more { padding:44px 56px 0; display:flex; align-items:center; justify-content:center; gap:18px; }
  .ss-load-more-line { flex:1; height:1px; background:#EEEEF2; }
  .ss-load-more-btn {
    font-size:9px; font-weight:400; letter-spacing:0.22em; text-transform:uppercase;
    padding:11px 30px; border:1.5px solid #EEEEF2; background:#fff;
    color:#888898; cursor:pointer; border-radius:4px; transition:all 0.18s; white-space:nowrap;
  }
  .ss-load-more-btn:hover { background:#111118; color:#fff; border-color:#111118; }

  @keyframes ssFadeUp { to { opacity:1; transform:translateY(0); } }

  /* ── Responsive ── */
  @media(max-width:1200px){ .ss-tiles{ grid-template-columns:repeat(4,1fr); } }
  @media(max-width:1100px){
    .ss-header,.ss-tiles-wrap,.ss-panel-head,.ss-panel-tabs,.ss-panel-content,
    .ss-filter-bar,.ss-grid-wrap,.ss-load-more { padding-left:28px!important; padding-right:28px!important; }
    .ss-grid-3 { grid-template-columns:repeat(2,1fr); }
    .ss-header { flex-direction:column; align-items:flex-start; gap:14px; }
  }
  @media(max-width:640px){
    .ss-header,.ss-tiles-wrap,.ss-panel-head,.ss-panel-tabs,.ss-panel-content,
    .ss-filter-bar,.ss-grid-wrap,.ss-load-more { padding-left:16px!important; padding-right:16px!important; }
    .ss-grid-3,.ss-grid-2 { grid-template-columns:1fr; }
    .ss-tiles { grid-template-columns:repeat(2,1fr); }
    .ss-panel.open { max-height:680px; }
    .ss-subcat-items { gap:8px; }
    .ss-list-body  { flex-direction:column; align-items:flex-start; }
    .ss-list-right { text-align:left; }
  }

  /* ── Add-to-bag feedback ── */
  .ss-pc-quick.added, .ss-list-btn.added {
    background:#2eaa68 !important; border-color:#2eaa68 !important; color:#fff !important;
    animation: ssPop .34s cubic-bezier(.34,1.56,.64,1);
  }
  .ss-pc-quick.maxed, .ss-list-btn.maxed {
    background:#E8A33D !important; border-color:#E8A33D !important; color:#fff !important;
  }
  @keyframes ssPop {
    0%   { transform: scale(1);    }
    45%  { transform: scale(1.06); }
    100% { transform: scale(1);    }
  }
  /* The quick-add button only appeared on hover, so on touch devices there was
     no way to add from the grid at all. */
  @media (hover: none) {
    .ss-pc-quick { transform:none !important; opacity:1 !important; }
  }

  /* ── Member pricing banner ── */
  .ss-plan-banner {
    margin:0 56px 18px; padding:11px 16px;
    display:flex; align-items:center; gap:10px;
    border:1px solid rgba(232,69,122,.18); background:#FDEFE6;
    border-radius:3px;
  }
  .ss-plan-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
  .ss-plan-txt {
    font-family:'Jost',sans-serif; font-size:10px; font-weight:300;
    letter-spacing:.14em; text-transform:uppercase; color:#3a3a44;
  }
  .ss-plan-badge {
    font-family:'Jost',sans-serif; font-size:9px; font-weight:500;
    letter-spacing:.2em; text-transform:uppercase;
    padding:3px 10px; border:1px solid; border-radius:2px;
  }
  @media(max-width:900px) { .ss-plan-banner { margin-left:28px; margin-right:28px; } }
  @media(max-width:640px) { .ss-plan-banner { margin-left:16px; margin-right:16px; } }
`;

// ─── ShopSection component ────────────────────────────────────────────────────
/**
 * Props
 *  products       Product[]   – full unfiltered product array
 *  onProductClick (p) => void – open product detail overlay
 *  addToCart      (p, qty)    – add item to cart
 */
export default function ShopSection({ products = [], onProductClick, addToCart }) {
  // Per-card "Added ✓" state. The Add to Bag buttons used to call addToCart()
  // and return — no state change, no animation, no confirmation. The button
  // looked exactly the same before and after the click, which is why it read as
  // "nothing happened".
  const addTimers = useRef({});

  const { isMember, percent, meta } = useMembership();

  // Hands the card's image to addToCart so lib/flyToCart.js can arc it into the
  // bag icon. Walks up to the card root and lets the flight helper find the img.
  const handleAdd = useCallback((e, p) => {
    e.stopPropagation();
    if (!addToCart) return { ok: false };

    const card =
      e.currentTarget.closest('.ss-pc') ||
      e.currentTarget.closest('.ss-list-row') ||
      e.currentTarget;

    return addToCart(p, 1, card);
  }, [addToCart]);

  useEffect(() => () => {
    Object.values(addTimers.current).forEach(clearTimeout);
  }, []);

  const [shopCat,      setShopCat]      = useState("all");
  const [shopSub,      setShopSub]      = useState(null);
  const [shopBrand,    setShopBrand]    = useState(null);
  const [panelTab,     setPanelTab]     = useState("sub");
  const [priceRange,   setPriceRange]   = useState(0);
  const [inStockOnly,  setInStockOnly]  = useState(false);
  const [sort,         setSort]         = useState("featured");
  const [viewMode,     setViewMode]     = useState("3");
  const [visibleCount, setVisibleCount] = useState(9);
  const [cardVis,      setCardVis]      = useState(new Set());

  const cardRefs = useRef([]);

  // IntersectionObserver — card fade-in
  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => {
        if (e.isIntersecting) setCardVis(p => new Set([...p, e.target.dataset.ssid]));
      }),
      { threshold: 0.07 }
    );
    cardRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, [shopCat, shopBrand, priceRange, inStockOnly, sort, visibleCount]);

  // Reset page count on filter change
  useEffect(() => { setVisibleCount(9); }, [shopCat, shopBrand, priceRange, inStockOnly, sort]);

  // ── Derived ──
  const activeTile = CAT_TILES.find(c => c.id === shopCat) || CAT_TILES[0];
  const panelOpen  = shopCat !== "all" && (activeTile.subs.length > 0 || activeTile.brands.length > 0);

  const filtered = products
    .filter(p => {
      if (shopCat !== "all" && p.category !== shopCat) return false;
      if (shopBrand && !(p.brand === shopBrand || p.name.toLowerCase().includes(shopBrand.toLowerCase()))) return false;
      const pr = PRICE_RANGES[priceRange];
      if (p.price < pr.min || p.price > pr.max) return false;
      if (inStockOnly && p.stock <= 0) return false;
      return true;
    })
    .sort((a, b) =>
      sort === "price-asc"  ? a.price - b.price  :
      sort === "price-desc" ? b.price - a.price  :
      sort === "rating"     ? b.rating - a.rating : 0
    );

  const visible    = filtered.slice(0, visibleCount);
  const hasFilters = shopCat !== "all" || shopBrand !== null || priceRange !== 0 || inStockOnly;
  const gridClass  = viewMode === "list" ? "ss-grid-1" : viewMode === "2" ? "ss-grid-2" : "ss-grid-3";

  const clearFilters = () => {
    setShopCat("all"); setShopSub(null); setShopBrand(null);
    setPriceRange(0); setInStockOnly(false); setSort("featured");
  };

  const selectCat = (catId) => {
    if (shopCat === catId) {
      setShopCat("all"); setShopSub(null); setShopBrand(null);
    } else {
      setShopCat(catId); setShopSub(null); setShopBrand(null);
      setPanelTab("sub");
    }
  };

  const lblClass = t =>
    t === "Sale" ? "ss-pc-lbl sale" : t === "New" ? "ss-pc-lbl new-l" : "ss-pc-lbl";

  return (
    <>
      <style>{SHOP_STYLES}</style>

      {/* ── Section header ── */}
      <div className="ss-header">
        <div>
          <p className="ss-eyebrow">Browse the Store</p>
          <h2>Creator <em>Essentials</em></h2>
        </div>
        <div className="ss-header-right">
          <span className="ss-count">{filtered.length} products</span>
          <div className="ss-view-btns">
            <button className={`ss-vbtn${viewMode === "3" ? " on" : ""}`} onClick={() => setViewMode("3")} title="3-column">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <rect x="0"    y="0"    width="3.5" height="3.5" fill="currentColor"/>
                <rect x="4.75" y="0"    width="3.5" height="3.5" fill="currentColor"/>
                <rect x="9.5"  y="0"    width="3.5" height="3.5" fill="currentColor"/>
                <rect x="0"    y="4.75" width="3.5" height="3.5" fill="currentColor"/>
                <rect x="4.75" y="4.75" width="3.5" height="3.5" fill="currentColor"/>
                <rect x="9.5"  y="4.75" width="3.5" height="3.5" fill="currentColor"/>
                <rect x="0"    y="9.5"  width="3.5" height="3.5" fill="currentColor"/>
                <rect x="4.75" y="9.5"  width="3.5" height="3.5" fill="currentColor"/>
                <rect x="9.5"  y="9.5"  width="3.5" height="3.5" fill="currentColor"/>
              </svg>
            </button>
            <button className={`ss-vbtn${viewMode === "2" ? " on" : ""}`} onClick={() => setViewMode("2")} title="2-column">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <rect x="0"   y="0"   width="5.5" height="5.5" fill="currentColor"/>
                <rect x="7.5" y="0"   width="5.5" height="5.5" fill="currentColor"/>
                <rect x="0"   y="7.5" width="5.5" height="5.5" fill="currentColor"/>
                <rect x="7.5" y="7.5" width="5.5" height="5.5" fill="currentColor"/>
              </svg>
            </button>
            <button className={`ss-vbtn${viewMode === "list" ? " on" : ""}`} onClick={() => setViewMode("list")} title="List">
              <svg width="13" height="11" viewBox="0 0 13 11" fill="none">
                <rect x="0" y="0"   width="13" height="2" fill="currentColor"/>
                <rect x="0" y="4.5" width="13" height="2" fill="currentColor"/>
                <rect x="0" y="9"   width="13" height="2" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Category photo tiles ── */}
      <div className="ss-tiles-wrap">
        <p className="ss-tiles-label">Browse by category</p>
        <div className="ss-tiles">
          {CAT_TILES.map(cat => (
            <button
              key={cat.id}
              className={`ss-tile${shopCat === cat.id ? " active" : ""}`}
              style={{ "--tile-accent": cat.accent }}
              onClick={() => selectCat(cat.id)}
            >
              <img className="ss-tile-img" src={cat.img} alt={cat.label} loading="lazy" />
              <div className="ss-tile-dot" />
              <div className="ss-tile-info">
                <span className="ss-tile-name">{cat.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Expanded panel — subcategories + brands ── */}
      <div className={`ss-panel${panelOpen ? " open" : ""}`}>
        <div className="ss-panel-head">
          <p className="ss-panel-heading">
            <span>Browsing</span>
            {activeTile.label}
          </p>
          <button
            className="ss-panel-close"
            onClick={() => { setShopCat("all"); setShopSub(null); setShopBrand(null); }}
            title="Close"
          >✕</button>
        </div>

        <div className="ss-panel-tabs">
          {activeTile.subs.length > 0 && (
            <button
              className={`ss-panel-tab${panelTab === "sub" ? " on" : ""}`}
              onClick={() => setPanelTab("sub")}
            >
              Subcategories
              <span className="ss-panel-tab-count">{activeTile.subs.length}</span>
            </button>
          )}
          {activeTile.brands.length > 0 && (
            <button
              className={`ss-panel-tab${panelTab === "brand" ? " on" : ""}`}
              onClick={() => setPanelTab("brand")}
            >
              Brands
              <span className="ss-panel-tab-count">{activeTile.brands.length}</span>
            </button>
          )}
        </div>

        <div className="ss-panel-content">
          {panelTab === "sub" && activeTile.subs.length > 0 && (
            <div className="ss-subcat-items">
              {activeTile.subs.map(sub => (
                <button
                  key={sub.label}
                  className={`ss-subcat-card${shopSub === sub.label ? " sel" : ""}`}
                  onClick={() => setShopSub(shopSub === sub.label ? null : sub.label)}
                >
                  <img className="ss-subcat-card-img" src={sub.img} alt={sub.label} loading="lazy" />
                  <span className="ss-subcat-card-name">{sub.label}</span>
                </button>
              ))}
            </div>
          )}

          {panelTab === "brand" && activeTile.brands.length > 0 && (
            <div className="ss-brands-grid">
              {activeTile.brands.map(brand => (
                <button
                  key={brand}
                  className={`ss-brand-pill${shopBrand === brand ? " sel" : ""}`}
                  onClick={() => setShopBrand(shopBrand === brand ? null : brand)}
                >
                  {brand}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky filter + sort bar ── */}
      <div className="ss-filter-bar">
        <div className="ss-filter-left">

          {/* Price range pills */}
          <div className="ss-price-pills">
            {PRICE_RANGES.map((pr, idx) => (
              <button
                key={pr.label}
                className={`ss-price-pill${priceRange === idx ? " on" : ""}`}
                onClick={() => setPriceRange(idx)}
              >{pr.label}</button>
            ))}
          </div>

          {/* In-stock toggle */}
          <button
            className={`ss-stock-btn${inStockOnly ? " on" : ""}`}
            onClick={() => setInStockOnly(s => !s)}
          >
            <span className="ss-stock-dot" />
            In Stock Only
          </button>

          {/* Active filter chips */}
          {hasFilters && (
            <div className="ss-chips">
              {shopCat !== "all" && (
                <button className="ss-chip" onClick={() => { setShopCat("all"); setShopSub(null); setShopBrand(null); }}>
                  {shopCat} <span className="ss-chip-x">×</span>
                </button>
              )}
              {shopBrand && (
                <button className="ss-chip" onClick={() => setShopBrand(null)}>
                  {shopBrand} <span className="ss-chip-x">×</span>
                </button>
              )}
              {priceRange !== 0 && (
                <button className="ss-chip" onClick={() => setPriceRange(0)}>
                  {PRICE_RANGES[priceRange].label} <span className="ss-chip-x">×</span>
                </button>
              )}
              {inStockOnly && (
                <button className="ss-chip" onClick={() => setInStockOnly(false)}>
                  In Stock <span className="ss-chip-x">×</span>
                </button>
              )}
              <button className="ss-chips-clear" onClick={clearFilters}>Clear all</button>
            </div>
          )}
        </div>

        <div className="ss-filter-right">
          <span className="ss-sort-label">Sort</span>
          <select
            className="ss-sort-select"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* ── Product grid / list ── */}
      {/* Member pricing banner — makes it obvious the prices below are already
          discounted. Previously a Popular/Elite member had no on-page signal at
          all that their plan was doing anything. */}
      {isMember && percent > 0 && (
        <div className="ss-plan-banner">
          <span className="ss-plan-dot" style={{ background: meta.color }} />
          <span className="ss-plan-badge" style={{ color: meta.color, borderColor: meta.color }}>
            {meta.icon} {meta.label}
          </span>
          <span className="ss-plan-txt">
            Your {percent}% member price is shown on every product below
          </span>
        </div>
      )}

      <div className="ss-grid-wrap">
        {visible.length === 0 ? (
          <div className="ss-empty">
            <span className="ss-empty-icon">◇</span>
            <h3 className="ss-empty-title">No products found</h3>
            <p className="ss-empty-sub">Try adjusting your filters or browse all categories.</p>
            <button className="ss-empty-btn" onClick={clearFilters}>Clear Filters</button>
          </div>

        ) : viewMode === "list" ? (
          <div className={gridClass}>
            {visible.map((p, i) => (
              <div
                key={p.id}
                ref={el => cardRefs.current[i] = el}
                data-ssid={p.id}
                className={`ss-list${cardVis.has(String(p.id)) ? " vis" : ""}`}
                style={{ animationDelay:`${i * 0.05}s` }}
                onClick={() => onProductClick && onProductClick(p)}
              >
                <div className="ss-list-img">
                  <img src={p.thumb} alt={p.name} loading="lazy" />
                  <span className={lblClass(p.tag)} style={{fontSize:"8px"}}>{p.tag}</span>
                </div>
                <div className="ss-list-body">
                  <div className="ss-list-left">
                    <p className="ss-list-cat">{p.category}</p>
                    <h3 className="ss-list-name">{p.name}</h3>
                    <p className="ss-list-sub">{p.tagline}</p>
                    <p className="ss-list-desc">{p.desc}</p>
                    <div style={{display:"flex",alignItems:"center",gap:"4px",marginTop:"8px"}}>
                      <span className="ss-pc-stars">{"★".repeat(Math.floor(p.rating ?? 0))}</span>
                      <span className="ss-pc-rnum" style={{fontSize:"11px"}}>{p.rating}</span>
                      <span className="ss-pc-rcnt">({(p.reviews ?? 0).toLocaleString()})</span>
                    </div>
                  </div>
                  <div className="ss-list-right">
                    <div className="ss-list-price"><PlanPrice price={p.price} /></div>
                    {p.original && <div className="ss-list-was">{inr(p.original)}</div>}
                    <span className={`ss-list-stock${p.stock <= 10 ? " low" : ""}`}>
                      {p.stock <= 10 ? `${p.stock} left` : "In Stock"}
                    </span>
                    <AddToBagButton
                      className="ss-list-btn"
                      onAdd={e => handleAdd(e, p)}
                      disabled={p.stock === 0}
                      label={p.stock === 0 ? 'Sold out' : 'Add to Bag'}
                      addedLabel="Added to Cart"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

        ) : (
          <div className={gridClass}>
            {visible.map((p, i) => (
              <div
                key={p.id}
                ref={el => cardRefs.current[i] = el}
                data-ssid={p.id}
                className={`ss-pc${cardVis.has(String(p.id)) ? " vis" : ""}`}
                style={{ animationDelay:`${(i % 3) * 0.08}s` }}
                onClick={() => onProductClick && onProductClick(p)}
              >
                <div className="ss-pc-img">
                  <img className="ss-pc-photo" src={p.thumb} alt={p.name} loading="lazy" />
                  <span className={lblClass(p.tag)}>{p.tag}</span>
                  <button className="ss-pc-wish" onClick={e => e.stopPropagation()}>♡</button>
                  <AddToBagButton
                    className="ss-pc-quick"
                    onAdd={e => handleAdd(e, p)}
                    disabled={p.stock === 0}
                    label={p.stock === 0 ? 'Sold out' : 'Add to Bag'}
                    addedLabel="Added to Cart"
                  />
                </div>
                <div className="ss-pc-body">
                  <p className="ss-pc-cat">{p.category}</p>
                  <h3 className="ss-pc-name">{p.name}</h3>
                  <p className="ss-pc-sub">{p.tagline}</p>
                  {/* rating/reviews are null on live backend rows — Math.floor(null)
                      is 0 and (null).toLocaleString() throws, so guard both. */}
                  {p.rating != null && (
                    <div style={{display:"flex",alignItems:"center",gap:"4px",marginBottom:"10px"}}>
                      <span className="ss-pc-stars">{"★".repeat(Math.floor(p.rating))}</span>
                      <span className="ss-pc-rnum">{p.rating}</span>
                      <span className="ss-pc-rcnt">({(p.reviews ?? 0).toLocaleString()})</span>
                    </div>
                  )}
                  <div className="ss-pc-foot">
                    <div style={{display:"flex",alignItems:"baseline",gap:"4px"}}>
                      <span className="ss-pc-price"><PlanPrice price={p.price} /></span>
                      {p.original && <span className="ss-pc-was">{inr(p.original)}</span>}
                    </div>
                    <span className={`ss-pc-stock${p.stock <= 10 ? " low" : ""}`}>
                      {p.stock <= 10 ? `${p.stock} left` : "In Stock"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load more */}
        {visibleCount < filtered.length && (
          <div className="ss-load-more">
            <div className="ss-load-more-line" />
            <button
              className="ss-load-more-btn"
              onClick={() => setVisibleCount(n => n + 9)}
            >
              Load More · {filtered.length - visibleCount} remaining
            </button>
            <div className="ss-load-more-line" />
          </div>
        )}
      </div>
    </>
  );
}