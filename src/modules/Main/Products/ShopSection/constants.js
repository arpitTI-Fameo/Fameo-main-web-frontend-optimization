// ─── Category Tiles + Subcategories + Brands ──────────────────────────────────
export const CAT_TILES = [
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
export const PRICE_RANGES = [
  { label:"All Prices",       min:0,    max:Infinity },
  { label:"Under ₹16,800",   min:0,    max:200      },
  { label:"₹16,800–₹42,000", min:200,  max:500      },
  { label:"₹42,000–₹84,000", min:500,  max:1000     },
  { label:"₹84,000+",        min:1000, max:Infinity },
];
