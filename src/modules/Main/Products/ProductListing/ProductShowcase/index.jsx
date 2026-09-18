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

  • The bottom strip is a ruler of one whole day. Where the playhead sits
    decides which clip is on screen, and it starts on the visitor's own
    local time — so the shop is lit the way their room is.

  SETUP:
    1. Clips live in  public/videos/  — one per scene, see SCENES in
       ./constants.js (morning, afternoon, evening, creator-desk at night)
    2. Marker x/y in SCENES are percentages of the frame; nudge them until
       each "+" sits on its product in that clip

  WIRE TO LIVE DATA:
    'use client';
    const { products, loading } = useLiveProducts();
    const { addItem } = useServerCart();
    <ProductShowcase
      products={products} loading={loading}
      onAddToCart={(p) => addItem(p.id, 1)}
    />
  A marker whose productId matches a live product opens that product;
  otherwise it falls back to the product at the marker's position in the
  list, and a marker that resolves to nothing is dropped rather than left
  on the frame as a dead "+". Without props, the demo catalog is shown.
*/

import SceneHero from './SceneHero';
import ProductDetail from './ProductDetail';
import { DEMO_PRODUCTS, SCENES } from './constants';
import { CSS } from './styles';

/* ── main export ───────────────────────────────────────────────── */
export default function ProductShowcase({
  products,
  loading = false,
  onAddToCart,
  scenes = SCENES,
  title = "shop the setup",
  intro = "Everything in this frame is in the Fameo store — at your plan's member price. Tap a marker on the scene, or browse the list below.",
}) {
  const items = products?.length ? products : DEMO_PRODUCTS;

  // Resolve every marker to a product once, here, so the hero only renders
  // what survived. With two live products a scene shows two markers instead
  // of five that open nothing.
  const dressed = scenes.map((s) => ({
    ...s,
    hotspots: s.hotspots
      .map((h, i) => ({
        ...h,
        product: items.find((x) => String(x.id) === String(h.productId)) || items[i],
      }))
      .filter((h) => h.product),
  }));

  const [active, setActive] = useState(null);

  return (
    <section className="ps-root">
      <style>{CSS}</style>

      <SceneHero scenes={dressed} onPick={(h) => setActive(h.product)} />

      {loading && <div className="ps-loading">loading the shelf…</div>}

      {active && (
        <ProductDetail product={active} onClose={() => setActive(null)} onAddToCart={onAddToCart} />
      )}
    </section>
  );
}
