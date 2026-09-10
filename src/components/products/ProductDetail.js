'use client';
// components/products/ProductDetail.js
// Premium editorial product detail — full-screen overlay that slides in from
// the right. Sticky gallery on the left, a calm flowing info column on the
// right. Sections appear only when the product actually has that data, so it
// looks intentional for both rich mock products and lean live products.

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { inr } from '@/lib/formatCurrency';
import { useWishlistStore } from '@/store/wishlistStore';
import { MAIN_NAV_LINKS } from '@/constants/megaMenu';
import PlanPrice from '@/components/products/PlanPrice';
import { useMembership } from '@/hooks/useMembership';
import { memberUnitPrice } from '@/lib/planPricing';

const S = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

.pdp-overlay{
  --paper:#FBFAF7; --ink:#14131A; --muted:#8B8792; --line:#E9E5DE;
  --rose:#E8405A; --rose-dk:#c42d45; --surf:#F1EEE8; --deep:#131218;
  --grad-btn:linear-gradient(135deg,#FFC98F 20%,#DD8164 58%,#D45A79 88%);
  --accent:#DD8164; --accent-deep:#D45A79;
  position:fixed; inset:0; z-index:800; background:var(--paper);
  pointer-events:none; overflow:hidden; transform:translateX(100%);
  transition:transform .66s cubic-bezier(.19,1,.22,1);
  font-family:'Jost',sans-serif; color:var(--ink);
}
.pdp-overlay.open{ transform:translateX(0); pointer-events:all; }
.pdp-overlay *{ box-sizing:border-box; }

.pdp-nav{
  position:absolute; top:0; left:0; right:0; z-index:10; height:68px;
  padding:0 clamp(20px,4vw,56px); display:flex; align-items:center; justify-content:space-between;
  background:rgba(251,250,247,.86); backdrop-filter:blur(14px); border-bottom:1px solid var(--line);
}
.pdp-back{ display:flex; align-items:center; gap:11px; background:none; border:none; cursor:pointer;
  font-size:10px; font-weight:500; letter-spacing:.2em; text-transform:uppercase; color:var(--muted); transition:color .2s; }
.pdp-back:hover{ color:var(--accent-deep); }
.pdp-back-arr{ width:22px; height:1px; background:currentColor; position:relative; transition:width .3s; }
.pdp-back:hover .pdp-back-arr{ width:30px; }
.pdp-back-arr::before{ content:''; position:absolute; left:0; top:-3px; width:6px; height:6px;
  border-left:1px solid currentColor; border-bottom:1px solid currentColor; transform:rotate(45deg); }
.pdp-nav-center{ display:flex; align-items:center; gap:34px; }
.pdp-logo{ font-family:'Cormorant Garamond',serif; font-size:19px; font-weight:400; letter-spacing:.24em; text-transform:uppercase; color:var(--ink); text-decoration:none; }
.pdp-logo span{ background:var(--grad-btn); -webkit-background-clip:text; background-clip:text; color:transparent; }
.pdp-links{ display:flex; align-items:center; gap:26px; }
.pdp-link{
  font-size:10px; font-weight:500; letter-spacing:.18em; text-transform:uppercase; color:var(--muted);
  text-decoration:none; position:relative; padding:4px 0; transition:color .2s;
}
.pdp-link::after{ content:''; position:absolute; left:0; bottom:0; width:0; height:1px; background:var(--grad-btn); transition:width .3s cubic-bezier(.19,1,.22,1); }
.pdp-link:hover{ color:var(--ink); }
.pdp-link:hover::after{ width:100%; }
@media (max-width:760px){ .pdp-links{ display:none; } }
.pdp-nav-add{ font-size:9px; font-weight:500; letter-spacing:.18em; text-transform:uppercase;
  padding:10px 22px; border:1px solid transparent; background:var(--grad-btn); color:#fff; cursor:pointer; border-radius:2px;
  transition:filter .22s; }
.pdp-nav-add:hover{ filter:brightness(1.06) saturate(1.1); }

.pdp-body{ display:flex; height:100vh; padding-top:68px; }

.pdp-left{ width:54%; flex-shrink:0; position:relative; background:var(--surf); border-right:1px solid var(--line); overflow:hidden; }
.pdp-cat{ position:absolute; top:20px; left:22px; z-index:6; font-size:9px; font-weight:500; letter-spacing:.22em;
  text-transform:uppercase; color:var(--muted); background:var(--paper); padding:6px 13px; border-radius:2px; }
.pdp-count{ position:absolute; top:22px; right:24px; z-index:6; font-size:10px; font-weight:500; letter-spacing:.14em; color:var(--muted); }
.pdp-count b{ color:var(--ink); }
.pdp-stage{ position:absolute; inset:0; }
.pdp-slide{ position:absolute; inset:0; opacity:0; transform:scale(1.05);
  transition:opacity .8s cubic-bezier(.19,1,.22,1),transform 1.1s cubic-bezier(.19,1,.22,1); }
.pdp-slide.active{ opacity:1; transform:scale(1); }
.pdp-slide img{ width:100%; height:100%; object-fit:cover; display:block; }
.pdp-noimg{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
  background:linear-gradient(150deg,#ECE8E0,#F5F2EC); }
.pdp-noimg span{ font-family:'Cormorant Garamond',serif; font-size:clamp(60px,10vw,140px); font-weight:300; color:#D8D2C7; }
.pdp-thumbs{ position:absolute; bottom:26px; left:26px; right:26px; display:flex; gap:8px; z-index:6; }
.pdp-thumb{ flex:1; max-width:74px; aspect-ratio:1; border:1px solid var(--line); background:var(--paper); cursor:pointer;
  overflow:hidden; border-radius:2px; padding:0; transition:border-color .22s,transform .22s; }
.pdp-thumb img{ width:100%; height:100%; object-fit:cover; display:block; }
.pdp-thumb.active{ border-color:var(--rose); }
.pdp-thumb:hover{ transform:translateY(-2px); }

.pdp-right{ flex:1; overflow-y:auto; scrollbar-width:none; }
.pdp-right::-webkit-scrollbar{ display:none; }
.pdp-inner{ padding:clamp(40px,5vw,72px) clamp(24px,4vw,64px) 96px; max-width:640px; }

.pdp-rev{ opacity:0; transform:translateY(20px);
  transition:opacity .8s cubic-bezier(.19,1,.22,1),transform .8s cubic-bezier(.19,1,.22,1); }
.pdp-rev.in{ opacity:1; transform:none; }
@media (prefers-reduced-motion: reduce){ .pdp-rev{ opacity:1 !important; transform:none !important; } }

.pdp-eyebrow{ font-size:10px; font-weight:500; letter-spacing:.28em; text-transform:uppercase;
  margin:0 0 16px; display:flex; align-items:center; gap:12px; background:var(--grad-btn); -webkit-background-clip:text; background-clip:text; color:transparent; }
.pdp-eyebrow::after{ content:''; width:34px; height:2px; background:var(--grad-btn); }
.pdp-tagline{ font-family:'Cormorant Garamond',serif; font-style:italic; font-weight:300; font-size:clamp(18px,2vw,24px); margin:0; line-height:1; background:var(--grad-btn); -webkit-background-clip:text; background-clip:text; color:transparent; }
.pdp-name{ font-family:'Cormorant Garamond',serif; font-weight:300; font-size:clamp(38px,5.4vw,68px); line-height:1; letter-spacing:-.01em; margin:6px 0 0; }

.pdp-meta-row{ display:flex; align-items:center; gap:14px; flex-wrap:wrap; margin:22px 0 0; }
.pdp-stars{ color:var(--accent-deep); font-size:12px; letter-spacing:2px; }
.pdp-rval{ font-family:'Cormorant Garamond',serif; font-size:16px; }
.pdp-rcnt{ font-size:11px; color:var(--muted); }
.pdp-div{ width:1px; height:12px; background:var(--line); }
.pdp-stock{ display:flex; align-items:center; gap:6px; font-size:11px; color:var(--muted); }
.pdp-stock-dot{ width:6px; height:6px; border-radius:50%; background:#4caf50; }
.pdp-stock-dot.low{ background:var(--accent-deep); animation:pdpPulse 1.4s ease infinite; }
@keyframes pdpPulse{ 0%,100%{opacity:1} 50%{opacity:.35} }

.pdp-price-row{ display:flex; align-items:baseline; gap:14px; margin:26px 0 0; }
.pdp-price{ font-family:'Cormorant Garamond',serif; font-size:clamp(30px,4vw,46px); font-weight:400; }
.pdp-orig{ font-size:17px; color:var(--muted); text-decoration:line-through; }
.pdp-save{ font-size:9px; font-weight:500; letter-spacing:.14em; text-transform:uppercase; padding:4px 11px; background:var(--grad-btn); color:#fff; border-radius:2px; }

.pdp-desc{ font-size:14px; font-weight:300; line-height:1.85; color:var(--muted); margin:26px 0 0; }

.pdp-cta{ display:flex; gap:10px; align-items:stretch; margin:34px 0 0; }
.pdp-add{ flex:1; font-size:10px; font-weight:500; letter-spacing:.18em; text-transform:uppercase; padding:16px 32px;
  background:var(--grad-btn); color:#fff; border:1px solid transparent; cursor:pointer; border-radius:2px; transition:filter .22s; }
.pdp-add:hover{ filter:brightness(1.06) saturate(1.1); }
.pdp-heart{ width:52px; flex-shrink:0; border:1px solid var(--line); background:transparent; color:var(--muted); cursor:pointer;
  font-size:18px; border-radius:2px; transition:border-color .2s,color .2s; }
.pdp-heart:hover,.pdp-heart.on{ border-color:var(--accent-deep); color:var(--accent-deep); }

.pdp-rule{ height:1px; background:var(--line); margin:52px 0; }

.pdp-block-label{ font-size:9px; font-weight:500; letter-spacing:.28em; text-transform:uppercase; margin:0 0 8px; background:var(--grad-btn); -webkit-background-clip:text; background-clip:text; color:transparent; }
.pdp-block-title{ font-family:'Cormorant Garamond',serif; font-weight:300; font-size:clamp(26px,3.4vw,40px); line-height:1.1; margin:0 0 28px; }
.pdp-block-title em{ font-style:italic; background:var(--grad-btn); -webkit-background-clip:text; background-clip:text; color:transparent; }

.pdp-feats{ list-style:none; margin:0; padding:0; }
.pdp-feat{ display:flex; align-items:center; gap:20px; padding:18px 0; border-top:1px solid var(--line); }
.pdp-feat:last-child{ border-bottom:1px solid var(--line); }
.pdp-feat-num{ font-family:'Cormorant Garamond',serif; font-size:26px; font-weight:300; color:var(--accent); opacity:.6; width:34px; flex-shrink:0; }
.pdp-feat-txt{ font-family:'Cormorant Garamond',serif; font-size:19px; }

.pdp-specs{ display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--line); border:1px solid var(--line); border-radius:2px; overflow:hidden; }
.pdp-spec{ background:var(--paper); padding:18px 20px; }
.pdp-spec-k{ font-size:9px; font-weight:500; letter-spacing:.2em; text-transform:uppercase; color:var(--accent-deep); margin:0 0 6px; }
.pdp-spec-v{ font-family:'Cormorant Garamond',serif; font-size:18px; }

.pdp-assur{ margin-top:8px; }
.pdp-assur-row{ display:flex; justify-content:space-between; align-items:center; gap:16px; padding:15px 0; border-top:1px solid var(--line); }
.pdp-assur-row:last-child{ border-bottom:1px solid var(--line); }
.pdp-assur-k{ font-size:10px; font-weight:500; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); }
.pdp-assur-v{ font-size:13px; color:var(--ink); text-align:right; }

.pdp-final{ margin-top:56px; }
.pdp-final-big{ font-family:'Cormorant Garamond',serif; font-weight:300; font-size:clamp(34px,5vw,60px); line-height:.98; margin:0 0 28px; }
.pdp-final-big em{ font-style:italic; background:var(--grad-btn); -webkit-background-clip:text; background-clip:text; color:transparent; }
.pdp-final-btn{ width:100%; font-size:10px; font-weight:500; letter-spacing:.18em; text-transform:uppercase; padding:17px;
  background:var(--grad-btn); color:#fff; border:1px solid transparent; cursor:pointer; border-radius:2px; transition:filter .22s; }
.pdp-final-btn:hover{ filter:brightness(1.06) saturate(1.1); }

@media (max-width:900px){
  .pdp-body{ flex-direction:column; height:auto; min-height:100vh; overflow-y:auto; }
  .pdp-left{ width:100%; height:56vh; position:sticky; top:68px; }
  .pdp-right{ overflow:visible; }
  .pdp-inner{ max-width:none; }
}
`;

export default function ProductDetail({ product, onClose, onAddToCart }) {
  // Add to Bag here closed the overlay and nothing else — same silent-add
  // problem as the grid. Show a confirmation on the button before it goes away.
  const [added, setAdded] = useState(false);
  const { rate, isMember } = useMembership();

  const handleAdd = () => {
    const res = onAddToCart?.(product);
    if (res?.ok === false) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  // Price on the CTA should be what the member actually pays.
  const ctaPrice = (p) => inr(isMember ? memberUnitPrice(p, rate) : p);

  const [activeImg, setActiveImg] = useState(0);
  const rightRef = useRef(null);
  const innerRef = useRef(null);
  const { toggle, has } = useWishlistStore();

  const images   = Array.isArray(product?.images) ? product.images.filter(Boolean) : [];
  const hasImgs  = images.length > 0;
  const rating   = Number(product?.rating) || 0;
  const reviews  = Number(product?.reviews) || 0;
  const features = Array.isArray(product?.features) ? product.features.filter(Boolean) : [];
  const specs    = product?.specs && typeof product.specs === 'object' ? Object.entries(product.specs) : [];
  const original = product?.original && product.original > product?.price ? product.original : null;
  const savings  = original ? original - product.price : 0;
  const stock    = product?.stock;

  useEffect(() => {
    setActiveImg(0);
    if (rightRef.current) rightRef.current.scrollTop = 0;
  }, [product?.id]);

  useEffect(() => {
    if (!product || images.length < 2) return;
    const t = setInterval(() => setActiveImg((i) => (i + 1) % images.length), 4200);
    return () => clearInterval(t);
  }, [product?.id, images.length]);

  useEffect(() => {
    const inner = innerRef.current;
    const scroller = rightRef.current;
    if (!inner || !product) return;
    const targets = Array.from(inner.querySelectorAll('.pdp-rev'));
    const show = (el) => el.classList.add('in');
    if (typeof IntersectionObserver === 'undefined') { targets.forEach(show); return; }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } }),
      { root: scroller, threshold: 0.12 }
    );
    const h = scroller?.clientHeight || window.innerHeight;
    targets.forEach((el) => { if (el.offsetTop < h * 1.1) show(el); else io.observe(el); });
    const safety = setTimeout(() => targets.forEach(show), 1400);
    return () => { io.disconnect(); clearTimeout(safety); };
  }, [product?.id]);

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  if (!product) return null;

  const isWished = has(product.id);
  const eyebrow = [product.category, product.brand].filter(Boolean).join(' · ');

  return (
    <>
      <style>{S}</style>
      <div className="pdp-overlay open" role="dialog" aria-modal="true" aria-label={product.name}>

        <div className="pdp-nav">
          <button className="pdp-back" onClick={onClose}>
            <span className="pdp-back-arr" /> Back
          </button>

          <div className="pdp-nav-center">
            <Link href="/" className="pdp-logo" onClick={onClose}>FA<span>MEO</span></Link>
            <nav className="pdp-links">
              {MAIN_NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="pdp-link" onClick={onClose}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <button className="pdp-nav-add" onClick={handleAdd}>{added ? 'Added ✓' : 'Add to Bag'}</button>
        </div>

        <div className="pdp-body">

          <div className="pdp-left">
            {product.category && <span className="pdp-cat">{product.category}</span>}
            {hasImgs && images.length > 1 && (
              <span className="pdp-count"><b>{String(activeImg + 1).padStart(2, '0')}</b> / {String(images.length).padStart(2, '0')}</span>
            )}
            {hasImgs ? (
              <>
                <div className="pdp-stage">
                  {images.map((img, i) => (
                    <div key={i} className={`pdp-slide${activeImg === i ? ' active' : ''}`}>
                      <img src={img} alt={`${product.name} view ${i + 1}`} />
                    </div>
                  ))}
                </div>
                {images.length > 1 && (
                  <div className="pdp-thumbs">
                    {images.map((img, i) => (
                      <button key={i} className={`pdp-thumb${activeImg === i ? ' active' : ''}`} onClick={() => setActiveImg(i)} aria-label={`Image ${i + 1}`}>
                        <img src={img} alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="pdp-noimg"><span>{(product.name || 'F').charAt(0).toUpperCase()}</span></div>
            )}
          </div>

          <div className="pdp-right" ref={rightRef}>
            <div className="pdp-inner" ref={innerRef}>

              {eyebrow && <p className="pdp-eyebrow pdp-rev">{eyebrow}</p>}
              {product.tagline && <p className="pdp-tagline pdp-rev">{product.tagline}</p>}
              <h1 className="pdp-name pdp-rev">{product.name}</h1>

              {(rating > 0 || stock != null) && (
                <div className="pdp-meta-row pdp-rev">
                  {rating > 0 && (
                    <>
                      <span className="pdp-stars">{'★'.repeat(Math.round(rating))}</span>
                      <span className="pdp-rval">{rating.toFixed(1)}</span>
                      {reviews > 0 && <><span className="pdp-div" /><span className="pdp-rcnt">{reviews.toLocaleString()} reviews</span></>}
                      <span className="pdp-div" />
                    </>
                  )}
                  {stock != null && (
                    <span className="pdp-stock">
                      <span className={`pdp-stock-dot${stock <= 10 ? ' low' : ''}`} />
                      {stock <= 10 ? `${stock} left` : 'In stock'}
                    </span>
                  )}
                </div>
              )}

              <div className="pdp-price-row pdp-rev">
                <span className="pdp-price"><PlanPrice price={product.price} size="lg" /></span>
                {original && (
                  <>
                    <span className="pdp-orig">{inr(original)}</span>
                    <span className="pdp-save">Save {inr(savings)}</span>
                  </>
                )}
              </div>

              {product.desc && <p className="pdp-desc pdp-rev">{product.desc}</p>}

              <div className="pdp-cta pdp-rev">
                <button className="pdp-add" onClick={handleAdd}>{added ? 'Added to bag ✓' : `Add to Bag — ${ctaPrice(product.price)}`}</button>
                <button
                  className={`pdp-heart${isWished ? ' on' : ''}`}
                  onClick={() => toggle(product)}
                  aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  {isWished ? '\u2665' : '\u2661'}
                </button>
              </div>

              {features.length > 0 && (
                <>
                  <div className="pdp-rule pdp-rev" />
                  <div className="pdp-rev">
                    <p className="pdp-block-label">Key Features</p>
                    <h2 className="pdp-block-title">Built for creators<br />who demand <em>more.</em></h2>
                    <ul className="pdp-feats">
                      {features.map((f, i) => (
                        <li className="pdp-feat" key={i}>
                          <span className="pdp-feat-num">{String(i + 1).padStart(2, '0')}</span>
                          <span className="pdp-feat-txt">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {specs.length > 0 && (
                <>
                  <div className="pdp-rule pdp-rev" />
                  <div className="pdp-rev">
                    <p className="pdp-block-label">Specifications</p>
                    <h2 className="pdp-block-title">Every detail <em>considered.</em></h2>
                    <div className="pdp-specs">
                      {specs.map(([k, v]) => (
                        <div className="pdp-spec" key={k}>
                          <p className="pdp-spec-k">{k}</p>
                          <p className="pdp-spec-v">{String(v)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="pdp-rule pdp-rev" />
              <div className="pdp-rev pdp-assur">
                <p className="pdp-block-label">The Fameo Promise</p>
                <h2 className="pdp-block-title">Buy with <em>confidence.</em></h2>
                <div className="pdp-assur-row"><span className="pdp-assur-k">Delivery</span><span className="pdp-assur-v">48-hour express \u00b7 free over \u20b916,800</span></div>
                <div className="pdp-assur-row"><span className="pdp-assur-k">Returns</span><span className="pdp-assur-v">30-day, hassle-free</span></div>
                <div className="pdp-assur-row"><span className="pdp-assur-k">Warranty</span><span className="pdp-assur-v">12-month Creator Guarantee</span></div>
                <div className="pdp-assur-row"><span className="pdp-assur-k">Support</span><span className="pdp-assur-v">Staffed by working creators</span></div>
              </div>

              <div className="pdp-rev pdp-final">
                <h2 className="pdp-final-big">Ready to<br />level <em>up?</em></h2>
                <button className="pdp-final-btn" onClick={handleAdd}>{added ? 'Added to bag ✓' : `Add to Bag — ${ctaPrice(product.price)}`}</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}