"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/store/AppContext";

// ─── Mega menu data ───────────────────────────────────────────────────────────
export const MEGA_MENU = {
  Cameras: {
    "Mirrorless Cameras": ["Panasonic","Nikon","Fujifilm","Canon","Sony"],
    "Action Cameras":     ["Digitek","GoPro","Insta360","DJI"],
    "Camcorders":         ["Sony","Panasonic","Canon"],
    "DSLR Cameras":       ["Nikon","Canon"],
    "Medium Format":      ["Fujifilm"],
    "Cinema Cameras":     ["Sony","Blackmagic","DJI"],
    "Instant Camera":     ["Instax","Kodak"],
    "Point & Shoot":      [],
    "Drones":             [],
  },
  Lenses: {
    "Mirrorless Lenses":      ["7artisans","Viltrox","Nikon Z","Canon","Sigma","Samyang","Sony","Tamron","Fujifilm","TTArtisan","ZEISS","Laowa"],
    "DSLR/SLR Lenses":        ["Sony","Samyang","Canon","Nikon","Tamron","Sigma","Irix","Laowa"],
    "Medium Format Lenses":   ["Laowa","Fujifilm","TTArtisan"],
    "Cine Lenses":            ["Samyang","Laowa"],
  },
  "Bags & Tripods": {
    "Camera Bags":        ["Travel Duffel","Backpacks","Shoulder Bags","Trolley Bags","Top Loader"],
    "Tripods & Monopods": ["Tripods","Monopods","Tripods With Head"],
    "Heads":              ["Ball Heads","Pan Heads"],
  },
  Lighting: {
    "Flash":             ["Studio Packs","Camera Flashes","Flash Head","Macro Lights","Studio Flashes & Kits","Hybrid LED & Flashes","Monolights & Kits"],
    "Continuous Lights": ["On-Camera Lights","Chip-on-Board LED","Panel Lights","Focusing Lights","Hybrid Flash LED","Light Wands & Tubes","Streaming Lights","Smartphone Lighting"],
    "Control System":    ["Flash Trigger","Remote Controller"],
    "Shooting Tents":    [],
  },
  Gimbals: {
    "Pocket Gimbals":    [],
    "Camera Gimbals":    [],
    "Smartphone Gimbals":[],
  },
  Audio: {
    "Wired Audio":   ["Digitek","Godox"],
    "Wireless Audio":["Godox","Hollyland","Mirfak","Digitek"],
  },
  Accessories: {
    "Lighting Accessories":       ["Softboxes & Umbrellas","Light Shapers","Light Stands","Gels & Diffusion","Batteries & Chargers","Carrying Bag"],
    "Camera Accessories":         ["Camera Straps","Camera Cage","Cards & Readers","Camera Plates","Camera Cases"],
    "Action Camera Accessories":  ["GoPro","Insta360","Neck Bracket","Remote Control","Mounts","Protection"],
    "Bags & Tripod Accessories":  ["Bag Accessories","Tripod Accessories","Supports & Rig"],
  },
};

const CATEGORIES = Object.keys(MEGA_MENU);

// ─── URL helpers ──────────────────────────────────────────────────────────────
/** slugify: "Bags & Tripods" → "bags-tripods" */
export const slug = str =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Build the route for a category, optional subcategory, and optional brand */
export const shopUrl = (category, subcategory = null, brand = null) => {
  let url = `/shop/${slug(category)}`;
  if (subcategory) url += `/${slug(subcategory)}`;
  const params = brand ? `?brand=${encodeURIComponent(brand)}` : "";
  return url + params;
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const NAV_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  :root {
    --cream:#f5f0e8; --cream-deep:#ede7d9;
    --ink:#1a1a14;   --ink-muted:#8a8478;
    --gold:#C9A96E;  --line:rgba(26,26,20,0.09);
  }

  /* ── Shell ── */
  .nb {
    position:fixed; top:0; left:0; right:0; z-index:600;
    background:rgba(245,240,232,0.97); backdrop-filter:blur(18px);
    border-bottom:1px solid var(--line);
    font-family:'Jost',sans-serif;
  }

  /* ── Top row ── */
  .nb-top {
    height:64px; padding:0 56px;
    display:flex; align-items:center; justify-content:space-between;
  }
  .nb-logo {
    font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:400;
    letter-spacing:0.22em; text-transform:uppercase; color:var(--ink);
    background:none; border:none; cursor:pointer; padding:0;
  }
  .nb-logo span { color:var(--gold); }
  .nb-right { display:flex; align-items:center; gap:18px; }
  .nb-icon-btn {
    background:none; border:none; cursor:pointer; padding:4px;
    color:var(--ink-muted); transition:color 0.2s; font-size:15px;
    display:flex; align-items:center;
  }
  .nb-icon-btn:hover { color:var(--ink); }
  .nb-cart {
    font-size:10px; font-weight:300; letter-spacing:0.16em; text-transform:uppercase;
    padding:8px 20px; border:1px solid var(--ink); background:transparent;
    color:var(--ink); cursor:pointer; display:flex; align-items:center; gap:8px;
    transition:all 0.25s;
  }
  .nb-cart:hover { background:var(--ink); color:var(--cream); }
  .nb-badge {
    width:17px; height:17px; border-radius:50%; background:var(--gold);
    color:#fff; font-size:9px; display:flex; align-items:center; justify-content:center;
  }

  /* ── Category bar ── */
  .nb-catbar {
    height:40px; padding:0 56px;
    display:flex; align-items:center;
    border-top:1px solid var(--line);
    position:relative;
  }
  .nb-cat-item { position:relative; }
  .nb-cat-btn {
    font-size:9px; font-weight:300; letter-spacing:0.2em; text-transform:uppercase;
    padding:0 18px; height:40px; line-height:40px;
    background:none; border:none; color:var(--ink-muted);
    cursor:pointer; transition:color 0.2s; white-space:nowrap; position:relative;
  }
  .nb-cat-btn:hover, .nb-cat-btn.act { color:var(--ink); }
  .nb-cat-btn.act::after {
    content:''; position:absolute; bottom:0; left:18px; right:18px;
    height:1px; background:var(--gold);
  }

  /* ── Mega menu panel ── */
  .nb-mega {
    position:fixed; left:0; right:0;
    background:var(--cream);
    border-bottom:2px solid var(--gold);
    box-shadow:0 24px 80px rgba(26,26,20,0.10);
    z-index:599;
    opacity:0; pointer-events:none;
    transform:translateY(-8px);
    transition:opacity 0.28s cubic-bezier(0.22,1,0.36,1),
                transform 0.28s cubic-bezier(0.22,1,0.36,1);
  }
  .nb-mega.open {
    opacity:1; pointer-events:all;
    transform:translateY(0);
  }

  /* Mega inner layout */
  .nb-mega-inner {
    max-width:1400px; margin:0 auto;
    padding:36px 56px 40px;
    display:grid;
    gap:0 28px;
  }

  /* Category hero (left column) */
  .nb-mega-hero {
    grid-column:1; grid-row:1 / span 20;
    width:200px; flex-shrink:0;
    border-right:1px solid var(--line);
    padding-right:28px; padding-top:4px;
  }
  .nb-mega-hero-eyebrow {
    font-size:8px; font-weight:300; letter-spacing:0.3em; text-transform:uppercase;
    color:var(--gold); margin-bottom:8px;
    display:flex; align-items:center; gap:8px;
  }
  .nb-mega-hero-eyebrow::before { content:''; width:14px; height:1px; background:var(--gold); opacity:0.6; }
  .nb-mega-hero-title {
    font-family:'Cormorant Garamond',serif;
    font-size:clamp(22px,2.8vw,34px); font-weight:300; line-height:1.05;
    color:var(--ink); margin-bottom:12px;
  }
  .nb-mega-hero-title em { font-style:italic; color:var(--gold); }
  .nb-mega-hero-desc {
    font-size:11px; font-weight:300; color:var(--ink-muted); line-height:1.75;
    margin-bottom:18px;
  }
  .nb-mega-hero-link {
    font-size:9px; font-weight:300; letter-spacing:0.2em; text-transform:uppercase;
    color:var(--ink); padding:8px 16px; border:1px solid var(--ink);
    background:transparent; cursor:pointer; transition:all 0.22s;
    display:inline-flex; align-items:center; gap:8px;
    font-family:'Jost',sans-serif;
  }
  .nb-mega-hero-link:hover { background:var(--ink); color:var(--cream); }
  .nb-mega-hero-link::after { content:'→'; font-size:11px; }

  /* Groups area */
  .nb-mega-groups {
    display:grid;
    grid-template-columns:repeat(auto-fill, minmax(160px, 1fr));
    gap:28px 24px;
    padding-top:4px;
  }

  /* Each group */
  .nb-mega-group {}
  .nb-mega-group-title {
    font-size:9px; font-weight:300; letter-spacing:0.26em; text-transform:uppercase;
    color:var(--gold); margin-bottom:10px; padding-bottom:8px;
    border-bottom:1px solid var(--line);
    cursor:pointer; transition:color 0.18s;
    background:none; border-left:none; border-right:none; border-top:none;
    text-align:left; width:100%; display:block; font-family:'Jost',sans-serif;
    padding-left:0; padding-right:0;
  }
  .nb-mega-group-title:hover { color:var(--ink); }

  .nb-mega-links { list-style:none; display:flex; flex-direction:column; gap:0; }

  /* Each link item */
  .nb-mega-link-row {
    display:flex; align-items:center; gap:0;
  }
  .nb-mega-link {
    flex:1; font-size:11px; font-weight:300; color:var(--ink-muted);
    text-decoration:none; transition:color 0.15s, padding-left 0.15s;
    padding:4px 0; cursor:pointer; background:none; border:none;
    text-align:left; font-family:'Jost',sans-serif; letter-spacing:0.04em;
    white-space:nowrap;
  }
  .nb-mega-link:hover { color:var(--ink); padding-left:4px; }

  /* Brand pills inside group */
  .nb-mega-brand-row {
    display:flex; flex-wrap:wrap; gap:4px; margin-top:6px;
  }
  .nb-mega-brand {
    font-size:9px; font-weight:300; letter-spacing:0.1em; text-transform:uppercase;
    padding:3px 8px; border:1px solid var(--line);
    background:transparent; color:var(--ink-muted); cursor:pointer;
    transition:all 0.16s; white-space:nowrap; font-family:'Jost',sans-serif;
  }
  .nb-mega-brand:hover { border-color:var(--gold); color:var(--ink); background:var(--cream-deep); }

  /* Mega bottom strip */
  .nb-mega-footer {
    border-top:1px solid var(--line);
    padding:14px 56px;
    display:flex; align-items:center; gap:24px;
    max-width:1400px; margin:0 auto;
  }
  .nb-mega-footer-label {
    font-size:8px; font-weight:300; letter-spacing:0.22em; text-transform:uppercase;
    color:var(--ink-muted); flex-shrink:0;
  }
  .nb-mega-footer-brands { display:flex; flex-wrap:wrap; gap:6px; }
  .nb-mega-footer-brand {
    font-size:9px; font-weight:300; letter-spacing:0.12em; text-transform:uppercase;
    padding:4px 11px; border:1px solid var(--line);
    background:transparent; color:var(--ink-muted); cursor:pointer;
    transition:all 0.18s; font-family:'Jost',sans-serif;
  }
  .nb-mega-footer-brand:hover {
    border-color:var(--ink); color:var(--ink); background:var(--cream-deep);
  }

  /* ── Mobile ── */
  @media(max-width:900px){
    .nb-top { padding:0 20px; }
    .nb-catbar { padding:0 20px; overflow-x:auto; scrollbar-width:none; }
    .nb-catbar::-webkit-scrollbar { display:none; }
    .nb-cat-btn { padding:0 12px; }
    .nb-mega-inner { padding:24px 20px 28px; }
    .nb-mega-hero { display:none; }
    .nb-mega-footer { padding:12px 20px; }
  }
`;

// ─── Category hero descriptions ───────────────────────────────────────────────
const CAT_META = {
  Cameras:         { eyebrow:"Capture",      title:"Every\n<em>frame</em>",    desc:"From mirrorless to cinema — the camera that's right for you." },
  Lenses:          { eyebrow:"Glass",        title:"See it\n<em>sharper</em>", desc:"Primes, zooms and cine glass for every mount and format." },
  "Bags & Tripods":{ eyebrow:"Support",      title:"Carry &\n<em>steady</em>", desc:"Backpacks, shoulder bags, tripods and heads for every shoot." },
  Lighting:        { eyebrow:"Illuminate",   title:"Perfect\n<em>light</em>",  desc:"Panel lights, flash kits, softboxes and streaming setups." },
  Gimbals:         { eyebrow:"Stabilise",    title:"Silky\n<em>motion</em>",   desc:"3-axis gimbals for cameras, phones and pocket shoots." },
  Audio:           { eyebrow:"Record",       title:"Crystal\n<em>sound</em>",  desc:"Wireless lavs, condensers and on-camera solutions." },
  Accessories:     { eyebrow:"Complete it",  title:"Every\n<em>detail</em>",   desc:"Cages, straps, cards, modifiers and more." },
};

// ─── Top brands per category (shown in footer strip of mega) ─────────────────
const CAT_BRANDS = {
  Cameras:         ["Sony","Canon","Nikon","Fujifilm","DJI","GoPro","Panasonic","Blackmagic"],
  Lenses:          ["Canon","Nikon","Sony","Sigma","Tamron","Samyang","ZEISS","Fujifilm"],
  "Bags & Tripods":["Vanguard","Lowepro","Think Tank","Peak Design","Manfrotto","Gitzo"],
  Lighting:        ["Godox","Nanlite","Aputure","Neewer","Profoto","Bowens"],
  Gimbals:         ["DJI","Zhiyun","Moza","FeiyuTech","Hohem"],
  Audio:           ["Godox","Hollyland","Rode","Sennheiser","Deity","Mirfak"],
  Accessories:     ["SmallRig","Tilta","Peak Design","Sandisk","Ulanzi","PolarPro"],
};

// ─── NavBar component ─────────────────────────────────────────────────────────
export default function NavBar() {
  const router   = useRouter();
  const pathname = usePathname();
  const { cartCount } = useCart();

  const [openCat,   setOpenCat]   = useState(null); // category name or null
  const [megaTop,   setMegaTop]   = useState(104);  // px from top
  const navRef    = useRef(null);
  const closeTimer = useRef(null);

  // Position mega below nav
  useEffect(() => {
    if (navRef.current) setMegaTop(navRef.current.offsetHeight);
  }, []);

  const openMenu  = (cat) => { clearTimeout(closeTimer.current); setOpenCat(cat); };
  const closeMenu = ()    => { closeTimer.current = setTimeout(() => setOpenCat(null), 120); };
  const keepOpen  = ()    => { clearTimeout(closeTimer.current); };

  // Close on route change
  useEffect(() => { setOpenCat(null); }, [pathname]);

  // Navigate helpers
  const goCategory = (cat) => {
    router.push(shopUrl(cat));
    setOpenCat(null);
  };
  const goSubcategory = (cat, sub) => {
    router.push(shopUrl(cat, sub));
    setOpenCat(null);
  };
  const goBrand = (cat, brand) => {
    router.push(shopUrl(cat, null, brand));
    setOpenCat(null);
  };
  const goCatBrand = (cat, sub, brand) => {
    router.push(shopUrl(cat, sub, brand));
    setOpenCat(null);
  };

  // Active category from URL
  const activeCatFromPath = CATEGORIES.find(c => pathname?.includes(slug(c)));

  return (
    <>
      <style>{NAV_STYLES}</style>

      <nav ref={navRef} className="nb">
        {/* ── Top row ── */}
        <div className="nb-top">
          <button className="nb-logo" onClick={() => router.push("/")}>
            FA<span>MEO</span>
          </button>
          <div className="nb-right">
            <button className="nb-icon-btn" onClick={() => router.push("/search")} title="Search">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="nb-icon-btn" onClick={() => router.push("/wishlist")} title="Wishlist">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.567 3.067 2 5 2C6.2 2 7.267 2.6 8 3.533C8.733 2.6 9.8 2 11 2C12.933 2 14.5 3.567 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
            </button>
            <button className="nb-cart" onClick={() => router.push("/cart")}>
              Bag <span className="nb-badge">{cartCount}</span>
            </button>
          </div>
        </div>

        {/* ── Category bar ── */}
        <div className="nb-catbar">
          {/* All products */}
          <div className="nb-cat-item">
            <button
              className={`nb-cat-btn${pathname === "/shop" ? " act" : ""}`}
              onClick={() => router.push("/shop")}
            >All</button>
          </div>

          {/* Each category */}
          {CATEGORIES.map(cat => (
            <div
              key={cat}
              className="nb-cat-item"
              onMouseEnter={() => openMenu(cat)}
              onMouseLeave={closeMenu}
            >
              <button
                className={`nb-cat-btn${(activeCatFromPath === cat || openCat === cat) ? " act" : ""}`}
                onClick={() => goCategory(cat)}
              >{cat}</button>
            </div>
          ))}
        </div>
      </nav>

      {/* ── Mega menu (outside nav, full-width) ── */}
      {CATEGORIES.map(cat => {
        const groups = MEGA_MENU[cat];
        const meta   = CAT_META[cat]  || {};
        const brands = CAT_BRANDS[cat] || [];
        const isOpen = openCat === cat;

        return (
          <div
            key={cat}
            className={`nb-mega${isOpen ? " open" : ""}`}
            style={{ top: megaTop }}
            onMouseEnter={keepOpen}
            onMouseLeave={closeMenu}
          >
            <div className="nb-mega-inner"
              style={{ gridTemplateColumns:`200px 1fr` }}
            >
              {/* Left hero column */}
              <div className="nb-mega-hero">
                <p className="nb-mega-hero-eyebrow">{meta.eyebrow}</p>
                {/* SAST L-1. This was a \n -> <br/> substitution piped through
                    dangerouslySetInnerHTML. The titles are static today, but the
                    moment they come from a CMS it becomes an XSS vector - and
                    the substitution never needed innerHTML in the first place.
                    Rendered as JSX now, so the sink is gone rather than guarded. */}
                <h3 className="nb-mega-hero-title">
                  {String(meta.title || cat).split("\n").map((line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))}
                </h3>
                <p className="nb-mega-hero-desc">{meta.desc}</p>
                <button className="nb-mega-hero-link" onClick={() => goCategory(cat)}>
                  Shop All {cat}
                </button>
              </div>

              {/* Right: groups */}
              <div className="nb-mega-groups">
                {Object.entries(groups).map(([groupName, items]) => (
                  <div key={groupName} className="nb-mega-group">
                    {/* Group title → navigate to subcategory */}
                    <button
                      className="nb-mega-group-title"
                      onClick={() => goSubcategory(cat, groupName)}
                    >{groupName}</button>

                    <ul className="nb-mega-links">
                      {items.length === 0 ? (
                        /* No brands: just "Shop All [group]" */
                        <li className="nb-mega-link-row">
                          <button
                            className="nb-mega-link"
                            onClick={() => goSubcategory(cat, groupName)}
                          >Shop All</button>
                        </li>
                      ) : (
                        /* Brand list */
                        <li>
                          <div className="nb-mega-brand-row">
                            {items.map(brand => (
                              <button
                                key={brand}
                                className="nb-mega-brand"
                                onClick={() => goCatBrand(cat, groupName, brand)}
                              >{brand}</button>
                            ))}
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer brand strip */}
            {brands.length > 0 && (
              <div className="nb-mega-footer">
                <span className="nb-mega-footer-label">Top Brands</span>
                <div className="nb-mega-footer-brands">
                  {brands.map(brand => (
                    <button
                      key={brand}
                      className="nb-mega-footer-brand"
                      onClick={() => goBrand(cat, brand)}
                    >{brand}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}