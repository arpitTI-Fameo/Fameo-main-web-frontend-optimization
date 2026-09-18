'use client';
// modules/Products/ProductDetail/index.jsx
// Premium editorial product detail — full-screen overlay that slides in from
// the right. Sticky gallery on the left, a calm flowing info column on the
// right. Sections appear only when the product actually has that data, so it
// looks intentional for both rich mock products and lean live products.

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { inr } from '@/utils/formatCurrency';
import { useWishlistStore } from '@/store/wishlistStore';
import { MAIN_NAV_LINKS } from '@/constants/megaMenu';
import PlanPrice from '../PlanPrice';
import { useMembership } from '@/lib/hooks/custome/useMembership';
import { memberUnitPrice } from '@/utils/planPricing';

import { S } from './styles';


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

  const images = Array.isArray(product?.images) ? product.images.filter(Boolean) : [];
  const hasImgs = images.length > 0;
  const rating = Number(product?.rating) || 0;
  const reviews = Number(product?.reviews) || 0;
  const features = Array.isArray(product?.features) ? product.features.filter(Boolean) : [];
  const specs = product?.specs && typeof product.specs === 'object' ? Object.entries(product.specs) : [];
  const original = product?.original && product.original > product?.price ? product.original : null;
  const savings = original ? original - product.price : 0;
  const stock = product?.stock;

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
