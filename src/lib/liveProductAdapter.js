// lib/liveProductAdapter.js
// Maps a Fameo Products backend row → the PRODUCTS shape your main web UI
// already renders (ShopSection / ProductCard / ProductDetail).
// Backend money is paise; your UI shows rupees.

const rupees = (paise) => (paise == null ? 0 : Math.round(paise) / 100);

export const adaptLiveProduct = (p) => {
  const mainImg = p.images?.find((i) => i.is_main)?.url || p.images?.[0]?.url || null;
  return {
    id: p.id,
    slug: p.id,
    category: p.category,                 // filters build from data, so real categories flow through
    subcategory: p.subcategory,
    name: p.name,
    tagline: p.subcategory || p.brand || '',
    brand: p.brand || '',
    price: rupees(p.listed_price),        // rupees for your inr() helper
    original: null,
    tag: null,
    rating: 4.8,                          // ratings not tracked yet — static placeholder
    reviews: 0,
    desc: p.specs?.description || '',
    longDesc: p.specs?.description || '',
    features: p.specs?.features || [],
    specs: typeof p.specs === 'object' ? p.specs : {},
    images: (p.images || []).map((i) => i.url),
    image: mainImg,
    thumb: mainImg,
    emoji: '📦',                          // fallback where the UI expects an emoji
    stock: p.available_stock ?? 99,
    available: p.status === 'live',
    related: [],
  };
};
