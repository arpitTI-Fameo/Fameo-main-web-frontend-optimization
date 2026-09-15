'use client';
// modules/Products/ProductsContainer/index.jsx
// Products page — thin orchestrator.
// Composes the module's own components. Does NOT contain inline nav or mega menu.
// ProductsSubNav renders via app/(main)/products/layout.js above this page.

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { flyToCart } from '@/utils/flyToCart';
import {
  PRODUCTS, HERO_SLIDES, TESTIMONIALS,
  PROMISES, MARQUEE_WORDS,
} from '@/constants/mockData';
import { PRODUCT_BRANDS } from '@/constants/megaMenu';
import { useStorefrontProducts } from '@/lib/hooks/main/useProduct';

import ProductDetail from '../ProductDetail';
import ShopSection from '../ShopSection';
import ProductShowcase from '../ProductShowcase';
import CollectionShowcase from '../CollectionShowcase';
import { BESTSELLERS } from '../constants';
import { toUiProduct } from '../helpers';
import { S } from '../styles';

export default function ProductsContainer() {
  const addToCartRaw = useCartStore((s) => s.addToCart);
  const showToast = useUIStore((s) => s.showToast);
  // Read inside the callback so the memo doesn't need to change identity.
  const usingMockDataRef = useRef(false);

  // Every "Add to Bag" on this page routed straight into the zustand store and
  // nothing else happened — no drawer, no toast, no animation. CartDrawer was
  // mounted in products/layout.js but openCartDrawer() was never called from
  // anywhere in the codebase, and uiStore.showToast() had no renderer. This
  // wrapper is now the single entry point: it adds, surfaces the failure cases
  // that used to be silent, and opens the drawer so the result is visible.
  const addToCart = useCallback((product, qty = 1, sourceEl = null) => {
    if (usingMockDataRef.current) {
      showToast('Catalogue is still loading — please try again in a moment.', 'error');
      return { ok: false, status: 'unavailable' };
    }

    const res = addToCartRaw(product, qty);

    if (res?.status === 'at-max') {
      showToast(`Only ${res.max} in stock — your bag already has them all.`, 'warn');
      return res;
    }
    if (res?.status === 'unavailable') {
      showToast(`${product?.name || 'This item'} is currently unavailable.`, 'error');
      return res;
    }
    if (res?.ok) {
      // Arc the product image into the bag icon in the nav.
      //
      // The drawer deliberately does NOT open here. Auto-opening covered the
      // flight path, hid the bag icon the parcel was flying toward, and forced
      // the shopper to dismiss a panel just to keep browsing. The flight, the
      // badge pulse and the button morph are the confirmation — the drawer is
      // something the shopper opens when they choose to.
      const img =
        sourceEl?.tagName === 'IMG'
          ? sourceEl
          : sourceEl?.querySelector?.('img') || null;

      flyToCart(img || sourceEl, {
        imageUrl: product?.thumb || product?.image || product?.images?.[0],
      });
    }
    return res;
  }, [addToCartRaw, showToast]);

  const [loaded, setLoaded] = useState(false);
  const [pageVis, setPageVis] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [promVis, setPromVis] = useState(false);
  const [testVis, setTestVis] = useState(false);
  const [ctaVis, setCtaVis] = useState(false);
  // Live products from the products backend;
  const { data } = useStorefrontProducts();
  const rawProducts = data?.products || [];
  const liveProducts = rawProducts.length ? rawProducts.map(toUiProduct) : null;

  // When the products backend is unreachable we fall back to mock data so the
  // page isn't empty — but mock rows have numeric ids the products API has never
  // heard of. Adding one and checking out failed at syncCartToServer with a
  // confusing "Could not reserve". Flag the fallback so Add to Bag refuses
  // cleanly instead.
  const usingMockData = !liveProducts;
  const allProducts = liveProducts || PRODUCTS;
  usingMockDataRef.current = usingMockData;

  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const ribbonRef = useRef(null);
  const bsTrackRef = useRef(null);
  const promRef = useRef(null);
  const testRef = useRef(null);
  const ctaRef = useRef(null);
  const heroTimer = useRef(null);

  // Loader
  useEffect(() => {
    const t1 = setTimeout(() => setLoaded(true), 2600);
    const t2 = setTimeout(() => setPageVis(true), 3100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Hero auto-advance
  useEffect(() => {
    heroTimer.current = setInterval(
      () => setHeroSlide((s) => (s + 1) % HERO_SLIDES.length),
      5200
    );
    return () => clearInterval(heroTimer.current);
  }, []);

  const goSlide = useCallback((idx) => {
    clearInterval(heroTimer.current);
    setHeroSlide(idx);
    heroTimer.current = setInterval(
      () => setHeroSlide((s) => (s + 1) % HERO_SLIDES.length),
      5200
    );
  }, []);

  // Custom cursor
  useEffect(() => {
    let rx = 0, ry = 0, mx = 0, my = 0, raf;
    const mv = (e) => { mx = e.clientX; my = e.clientY; };
    const tick = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx}px,${my}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px,${ry}px)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', mv);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', mv); cancelAnimationFrame(raf); };
  }, []);

  // Drag-to-scroll for ribbon tracks
  const makeRibbonDrag = useCallback((elRef) => {
    const el = elRef.current;
    if (!el) return () => { };
    let dragging = false, sx = 0, stx = 0, ctx = 0;
    const getTx = () => new DOMMatrix(window.getComputedStyle(el).transform).m41;
    const pause = () => { ctx = getTx(); el.style.animationPlayState = 'paused'; el.style.transform = `translateX(${ctx}px)`; };
    const resume = () => { if (!dragging) { el.style.transform = ''; el.style.animationPlayState = 'running'; } };
    const onDown = (e) => { dragging = true; sx = e.pageX; stx = ctx; pause(); };
    const onMove = (e) => { if (!dragging) return; ctx = stx + (e.pageX - sx); el.style.transform = `translateX(${ctx}px)`; };
    const onUp = () => { dragging = false; resume(); };
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  useEffect(() => {
    if (!pageVis) return;
    const c1 = makeRibbonDrag(ribbonRef);
    const c2 = makeRibbonDrag(bsTrackRef);
    return () => { c1(); c2(); };
  }, [pageVis, makeRibbonDrag]);

  // Section scroll observers
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        if (e.target === promRef.current) setPromVis(true);
        if (e.target === testRef.current) setTestVis(true);
        if (e.target === ctaRef.current) setCtaVis(true);
      }),
      { threshold: 0.1 }
    );
    [promRef, testRef, ctaRef].forEach((r) => r.current && obs.observe(r.current));
    return () => obs.disconnect();
  }, [pageVis]);

  const rBadge = (t) =>
    t === 'Sale' ? 'r-badge sale' : t === 'New' ? 'r-badge new-b' : 'r-badge';

  const ribbonProducts = [...allProducts, ...allProducts];
  const bestsellers = liveProducts ? liveProducts.slice(0, 6) : BESTSELLERS;
  const bsProducts = [...bestsellers, ...bestsellers];
  const brandsDouble = [...PRODUCT_BRANDS, ...PRODUCT_BRANDS];

  return (
    <>
      <style>{S}</style>
      <div ref={dotRef} className="c-dot" aria-hidden="true" />
      <div ref={ringRef} className="c-ring" aria-hidden="true" />

      {/* Loader */}
      <div id="pld" className={loaded ? 'hidden' : ''} aria-hidden="true">
        <div className="l-ornaments">
          <span>❦</span><span>✦</span><span>✤</span><span>✦</span><span>❦</span>
        </div>
        <div className="l-logo">FA<span>MEO</span></div>
        <div className="l-rule" />
        <div className="l-sub">Creator Store · Est. 2025</div>
        <div className="l-prog" />
      </div>

      <div className={`page${pageVis ? ' vis' : ''}`}>

        {/* Shop-the-scene video showcase (replaces the old hero slider) */}
        <div className="showcase-hero">
          <ProductShowcase
            products={rawProducts}
            loading={!liveProducts}
            onAddToCart={(p, el) => addToCart(toUiProduct(p), 1, el)}
          />
        </div>

        {/* Premium editorial sections after the hero */}
        <CollectionShowcase
          products={allProducts}
          onProductClick={setSelectedProduct}
          onAddToCart={(p, el) => addToCart(p, 1, el)}
        />

        {/* Shop section — category tiles + filters + product grid */}
        <ShopSection
          products={allProducts}
          onProductClick={setSelectedProduct}
          addToCart={addToCart}
        />

        {/* Marquee */}
        <div className="mq" aria-hidden="true">
          <div className="mq-t">
            {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((item, i) => (
              <div className="mq-i" key={i}><span className="mq-d" />{item}</div>
            ))}
          </div>
        </div>

        {/* Brands scroll */}
        <section className="brands-section">
          <div className="brands-header">
            <p className="brands-eyebrow">Our Partners</p>
            <h2 className="brands-title">Trusted Brands</h2>
          </div>
          <div className="brands-track-outer">
            <div className="brands-track">
              {brandsDouble.map((b, i) => (
                <div key={`brand-${i}`} className="brand-item">
                  <span className="brand-name">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Promises */}
        <div ref={promRef} className={`prom${promVis ? ' vis' : ''}`}>
          {PROMISES.map((pr) => (
            <div className="prom-i" key={pr.title}>
              <span className="prom-ico">{pr.icon}</span>
              <h4 className="prom-ttl">{pr.title}</h4>
              <p className="prom-desc">{pr.desc}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div ref={testRef} className={`test${testVis ? ' vis' : ''}`}>
          <h2 className="test-hd">Loved by <em>creators</em></h2>
          <div className="test-g">
            {TESTIMONIALS.map((t, i) => (
              <div className="t-c" key={i}>
                <div className="t-s">★★★★★</div>
                <p className="t-t">"{t.text}"</p>
                <div className="t-r">
                  <div className="t-av">{t.init}</div>
                  <div><p className="t-n">{t.name}</p><p className="t-h">{t.handle}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div ref={ctaRef} className={`cta${ctaVis ? ' vis' : ''}`}>
          <div>
            <p className="cta-ey">Creator Club</p>
            <h2 className="cta-ttl">Early access.<br />Creator prices.</h2>
            <p className="cta-sb">Join 9,000+ creators getting exclusive drops before anyone else.</p>
          </div>
          <div className="cta-form">
            <input className="cta-inp" placeholder="Your email address" type="email" />
            <button className="cta-btn">Join the Creator Club</button>
            <p className="cta-note">No spam. Exclusive drops only.</p>
          </div>
        </div>

        {/* Footer */}
        <footer>
          <p>© 2025 Fameo · Trendlance Innovations</p>
          <ul className="f-l">
            <li><a href="#">Shop</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </footer>

      </div>

      {/* Product detail overlay */}
      <ProductDetail
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={() => {
          if (!selectedProduct) return { ok: false };
          const res = addToCart(selectedProduct, 1);
          // Don't yank the overlay away instantly — the old code closed it in
          // the same tick, so the "Added ✓" confirmation never had a frame to
          // render and the click felt like it did nothing. Hold briefly, then
          // close so the drawer underneath is visible.
          if (res?.ok) setTimeout(() => setSelectedProduct(null), 900);
          return res;
        }}
      />
    </>
  );
}
