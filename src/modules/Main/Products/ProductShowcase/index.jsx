'use client';
import { useState } from "react";

/*
  ProductShowcase — shop-the-scene, maikasui-style, for the Fameo main web
  ─────────────────────────────────────────────────────────────────────────
  • YOUR video plays as the hero scene; "+" markers sit on the real products
    in the shot (mic, headphones, keyboard, lights) — like maikasui.com
  • Click a "+" (or a row below) → full product detail: description,
    features, plan pricing, add to cart
  • All money is PAISE (integer) → formatted with formatINR()

  SETUP:
    1. Put the video at  public/videos/creator-desk.mp4  (file provided)
    2. Drop this file in  modules/Products/ProductShowcase/index.jsx

  WIRE TO LIVE DATA:
    'use client';
    const { products, loading } = useLiveProducts();
    const { addItem } = useServerCart();
    <ProductShowcase
      products={products} loading={loading}
      onAddToCart={(p) => addItem(p.id, 1)}
      sceneHotspots={[ { x: 64.5, y: 50, tip: "the mic", productId: "<id>" }, ... ]}
    />
  If a hotspot's productId matches a live product id, clicking it opens that
  product. Without props, the built-in demo catalog below is shown.

  (In this chat preview the video file isn't reachable, so the hero falls
   back to a still frame from your video — the "+" markers still work.
   In your app, the video plays and loops.)
*/

import SceneHero from './SceneHero';
import ProductDetail from './ProductDetail';
import { DEMO_PRODUCTS, DEMO_HOTSPOTS } from './constants';
import { CSS } from './styles';

/* ── main export ───────────────────────────────────────────────── */
export default function ProductShowcase({
  products,
  loading = false,
  onAddToCart,
  videoSrc = "/videos/creator-desk.mp4",
  sceneHotspots,
  title = "shop the setup",
  intro = "Everything in this frame is in the Fameo store — at your plan's member price. Tap a marker on the scene, or browse the list below.",
}) {
  const items = products?.length ? products : DEMO_PRODUCTS;
  const allHotspots = sceneHotspots?.length ? sceneHotspots : DEMO_HOTSPOTS;
  // Only keep markers that resolve to a real product (by id, else by position).
  // With 2 live products, this shows 2 markers instead of 5 dead ones.
  const hotspots = allHotspots
    .map((h, i) => ({ h, product: items.find((x) => String(x.id) === String(h.productId)) || items[i] }))
    .filter((r) => r.product)
    .map((r) => r.h);
  const [active, setActive] = useState(null);

  // Open the product a marker points at — by id when it matches, otherwise by
  // the marker's position in the list (so live products without demo ids work).
  const openHotspot = (h, i) => {
    const p = items.find((x) => String(x.id) === String(h.productId)) || items[i];
    if (p) setActive(p);
  };

  return (
    <section className="ps-root">
      <style>{CSS}</style>

      <SceneHero videoSrc={videoSrc} hotspots={hotspots} onPick={openHotspot} />

      {loading && <div className="ps-loading">loading the shelf…</div>}

      {active && (
        <ProductDetail product={active} onClose={() => setActive(null)} onAddToCart={onAddToCart} />
      )}
    </section>
  );
}
