'use client';
// components/navbar/ProductsSubNav.js
// Products-only second tier nav — category strip with mega menu + bag button.
// Rendered in app/(main)/products/layout.js so it ONLY shows on /products/* routes.

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { PRODUCT_CATEGORIES, PRODUCT_MEGA_MENU } from '@/constants/megaMenu';
import { ROUTES } from '@/constants/routes';
import { useCartStore, useHydratedCart } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';


const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  /* ── strip shell ── */
  .psn-wrap {
    position: sticky; top: 0; margin-top: 84px; z-index: 500;
    background: #ffffff;
    --grad-btn: linear-gradient(135deg,#FFC98F 20%,#DD8164 58%,#D45A79 88%);
    --accent: #DD8164; --accent-deep: #D45A79;
  }
  .psn-strip {
    height: 44px; padding: 0 52px;
    display: flex; align-items: stretch;
    background: #ffffff;
    border-bottom: 1px solid #EEEEF2;
    overflow: visible;
    position: relative;
  }

  /* rose accent line at bottom */
  .psn-strip::after {
    content:''; position:absolute; bottom:0; left:0; right:0; height:1.5px;
    background:linear-gradient(90deg,transparent 0%,#DD8164 20%,#D45A79 80%,transparent 100%);
    opacity:.5; pointer-events:none;
  }

  /* ── category items ── */
  .psn-cats {
    display: flex; align-items: stretch; flex: 1;
  }

  .psn-item { position:relative; display:flex; align-items:stretch; }

  .psn-btn {
    font-family:'Jost',sans-serif; font-size:9px; font-weight:400;
    letter-spacing:.22em; text-transform:uppercase;
    padding:0 18px; height:44px; line-height:44px;
    background:none; border:none;
    color:#888898; cursor:pointer;
    white-space:nowrap; display:flex; align-items:center; gap:6px;
    position:relative; transition:color .18s;
  }
  .psn-btn::before {
    content:''; position:absolute; bottom:0; left:18px; right:18px;
    height:2px; background:var(--grad-btn);
    transform:scaleX(0); transform-origin:center;
    transition:transform .28s cubic-bezier(.22,1,.36,1);
    border-radius:2px 2px 0 0;
  }
  .psn-btn:hover, .psn-btn.act { color:#111118; }
  .psn-btn:hover::before, .psn-btn.act::before { transform:scaleX(1); }
  .psn-chev { font-size:7px; opacity:.4; transition:transform .2s, opacity .2s; display:inline-block; }
  .psn-item:hover .psn-chev, .psn-btn.act .psn-chev { transform:rotate(180deg); opacity:.85; }

  /* ── bag button ── */
  .psn-bag-wrap {
    display: flex; align-items: center; margin-left: auto; padding-left: 16px;
    flex-shrink: 0;
  }
  .psn-bag {
    display: flex; align-items: center; gap: 8px;
    font-family:'Jost',sans-serif; font-size:9px; font-weight:400;
    letter-spacing:.18em; text-transform:uppercase;
    padding: 7px 16px 7px 12px;
    border: 1.5px solid #EEEEF2;
    background: #ffffff; color: #111118;
    cursor: pointer; border-radius: 3px;
    transition: border-color .22s, background .22s, color .22s;
  }
  .psn-bag:hover { border-color:transparent; background:var(--grad-btn); color:#fff; }
  .psn-bag:hover .psn-bag-badge { background:rgba(255,255,255,.28); }
  .psn-bag-icon { font-size:13px; color:#888898; transition:color .22s; }
  .psn-bag:hover .psn-bag-icon { color:#fff; }
  .psn-bag-badge {
    min-width:17px; height:17px; border-radius:9px;
    background:var(--grad-btn); color:#fff;
    font-size:9px; display:flex; align-items:center;
    justify-content:center; padding:0 3px;
    transition:background .22s;
  }

  /* ── mega menu ── */
  .psn-mega {
    position:absolute; top:44px; left:0;
    min-width:720px; max-width:900px;
    background:#fff;
    border-top:2px solid #D45A79;
    border-left:1px solid #EEEEF2;
    border-right:1px solid #EEEEF2;
    border-bottom:1px solid #EEEEF2;
    display:none; z-index:700; overflow:hidden;
    box-shadow:0 24px 64px rgba(17,17,24,.12),0 4px 16px rgba(212,90,121,.08);
  }
  .psn-item:hover .psn-mega { display:flex; flex-direction:column; }

  .psn-mega-inner { display:flex; width:100%; }

  /* dark left accent */
  .psn-mega-accent {
    width:180px; flex-shrink:0; background:#111118;
    padding:32px 24px; display:flex; flex-direction:column; justify-content:space-between;
  }
  .psn-mega-cat {
    font-family:'Cormorant Garamond',serif; font-size:28px;
    font-weight:300; color:#fff; line-height:1.05; letter-spacing:.04em;
  }
  .psn-mega-cat em { display:block; font-style:italic; background:linear-gradient(135deg,#FFC98F 20%,#DD8164 58%,#D45A79 88%);-webkit-background-clip:text;background-clip:text;color:transparent; }
  .psn-mega-rule { width:24px; height:2px; background:var(--grad-btn); margin:16px 0; }
  .psn-mega-sub {
    font-family:'Jost',sans-serif; font-size:9px; font-weight:300;
    letter-spacing:.2em; text-transform:uppercase;
    color:rgba(255,255,255,.28); line-height:1.6;
  }

  /* right link grid */
  .psn-mega-grid {
    flex:1; padding:28px 32px;
    display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr));
    gap:20px 24px; overflow:hidden;
  }
  .psn-grp-title {
    font-family:'Jost',sans-serif; font-size:8px; font-weight:500;
    letter-spacing:.26em; text-transform:uppercase; color:#D45A79;
    margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid #EEEEF2;
    display:flex; align-items:center; gap:7px;
  }
  .psn-grp-title::before {
    content:''; width:4px; height:4px; border-radius:50%;
    background:var(--grad-btn); flex-shrink:0;
  }
  .psn-mega-links { list-style:none; display:flex; flex-direction:column; gap:5px; }
  .psn-mega-links a {
    font-family:'Jost',sans-serif; font-size:11px; font-weight:300;
    color:#888898; text-decoration:none; letter-spacing:.04em;
    display:flex; align-items:center; gap:6px;
    transition:color .15s, padding-left .2s;
  }
  .psn-mega-links a::before {
    content:'—'; font-size:8px; opacity:0; transition:opacity .15s;
    color:#D45A79; flex-shrink:0;
  }
  .psn-mega-links a:hover { color:#111118; padding-left:4px; }
  .psn-mega-links a:hover::before { opacity:1; }

  /* footer bar */
  .psn-mega-foot {
    border-top:1px solid #EEEEF2; padding:12px 32px;
    display:flex; align-items:center; justify-content:space-between;
    background:#F7F7FA;
  }
  .psn-mega-cta {
    font-family:'Jost',sans-serif; font-size:8px; font-weight:400;
    letter-spacing:.22em; text-transform:uppercase;
    background:linear-gradient(135deg,#FFC98F 20%,#DD8164 58%,#D45A79 88%);-webkit-background-clip:text;background-clip:text;color:transparent;
    border:none; cursor:pointer;
    display:flex; align-items:center; gap:8px; padding:0;
    transition:gap .2s;
  }
  .psn-mega-cta:hover { gap:14px; }
  .psn-mega-note {
    font-family:'Jost',sans-serif; font-size:9px; font-weight:300;
    letter-spacing:.14em; color:#888898;
  }

  .psn-bag-badge.bump { animation: psnBump .5s cubic-bezier(.34,1.56,.64,1); }
  @keyframes psnBump {
    0%   { transform: scale(1);   }
    35%  { transform: scale(1.5); }
    100% { transform: scale(1);   }
  }

  @media(max-width:1100px) { .psn-strip { padding-left:28px; padding-right:28px; } }
  @media(max-width:640px) {
    .psn-strip { padding-left:16px; padding-right:16px; overflow-x:auto; scrollbar-width:none; }
    .psn-strip::-webkit-scrollbar { display:none; }
    .psn-bag span.psn-bag-label { display:none; }
  }
`;

export default function ProductsSubNav() {
  const router   = useRouter();
  const pathname = usePathname();

  // Cart count comes from persisted (localStorage) state, which the server
  // can't know — useHydratedCart returns 0 until rehydration completes so the
  // server and client markup agree.
  const { count: cartCount } = useHydratedCart();
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);
  const lastAdded      = useCartStore((s) => s.lastAdded);

  // Pulse the badge whenever something lands in the bag. The count was already
  // updating, but a digit quietly changing in the corner was the only feedback
  // an "Add to Bag" click produced — easy to miss entirely.
  const [bump, setBump] = useState(false);
  useEffect(() => {
    if (!lastAdded?.at) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 520);
    return () => clearTimeout(t);
  }, [lastAdded?.at]);

  const getActive = () => {
    const seg = pathname.split('/')[2];
    if (!seg || seg === 'item' || seg === 'brand') return 'All';
    const match = PRODUCT_CATEGORIES.find(
      (c) => c.toLowerCase().replace(/\s/g, '-') === seg
    );
    return match || 'All';
  };

  const [active, setActive] = useState(getActive);
  useEffect(() => { setActive(getActive()); }, [pathname]);

  const handleCategoryClick = (cat) => {
    setActive(cat);
    if (cat === 'All') {
      router.push(ROUTES.PRODUCTS);
    } else {
      router.push(`${ROUTES.PRODUCTS}/${cat.toLowerCase().replace(/\s+/g, '-')}`);
    }
  };

  return (
    <>
      <style>{S}</style>
      <div className="psn-wrap">
        <div className="psn-strip" role="navigation" aria-label="Product categories">

          {/* Category buttons */}
          <div className="psn-cats">
            {PRODUCT_CATEGORIES.map((cat) => (
              <div key={cat} className="psn-item">
                <button
                  className={`psn-btn${active === cat ? ' act' : ''}`}
                  onClick={() => handleCategoryClick(cat)}
                  aria-haspopup={!!PRODUCT_MEGA_MENU[cat]}
                  aria-current={active === cat ? 'true' : undefined}
                >
                  {cat}
                  {PRODUCT_MEGA_MENU[cat] && <span className="psn-chev">▾</span>}
                </button>

                {/* Mega menu */}
                {PRODUCT_MEGA_MENU[cat] && (
                  <div className="psn-mega" role="region" aria-label={`${cat} submenu`}>
                    <div className="psn-mega-inner">

                      {/* Dark accent column */}
                      <div className="psn-mega-accent">
                        <div>
                          <p className="psn-mega-cat">
                            {cat.split(' ')[0]}
                            {cat.split(' ')[1] && <em>{cat.split(' ').slice(1).join(' ')}</em>}
                          </p>
                          <div className="psn-mega-rule" />
                          <p className="psn-mega-sub">Premium gear<br />for verified<br />creators</p>
                        </div>
                        <div style={{ fontSize: 18, color: '#D45A79', opacity: .5 }}>◈</div>
                      </div>

                      {/* Link grid */}
                      <div className="psn-mega-grid">
                        {Object.entries(PRODUCT_MEGA_MENU[cat]).map(([group, items]) => (
                          <div key={group}>
                            <div className="psn-grp-title">{group}</div>
                            <ul className="psn-mega-links">
                              {items.length === 0
                                ? <li><a href="#">All {group}</a></li>
                                : items.map((item) => (
                                    <li key={item}>
                                      <a href={`${ROUTES.PRODUCTS}/${cat.toLowerCase().replace(/\s+/g, '-')}?brand=${item.toLowerCase()}`}>
                                        {item}
                                      </a>
                                    </li>
                                  ))
                              }
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="psn-mega-foot">
                      <button
                        className="psn-mega-cta"
                        onClick={() => handleCategoryClick(cat)}
                      >
                        Browse all {cat} →
                      </button>
                      <span className="psn-mega-note">
                        {Object.values(PRODUCT_MEGA_MENU[cat]).flat().length}+ products available
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bag button — right side */}
          <div className="psn-bag-wrap">
            <button
              className="psn-bag"
              // data-cart-anchor is the flight target for lib/flyToCart.js —
              // the product image arcs into this element and it pulses on
              // arrival. If the attribute goes missing the flight is skipped
              // gracefully and the toast still fires.
              data-cart-anchor=""
              // Open the drawer instead of navigating away — a full page change
              // just to check the bag loses the browsing position.
              onClick={() => (cartCount > 0 ? openCartDrawer() : router.push('/cart'))}
              aria-label={`Shopping bag, ${cartCount} items`}
            >
              <span className="psn-bag-icon">◻</span>
              <span className="psn-bag-label">Bag</span>
              <span className={`psn-bag-badge${bump ? ' bump' : ''}`}>{cartCount}</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}