'use client';
// modules/Main/Products/ProductListing/index.jsx
// Product listing page — /products/[category].
//
// Thin orchestrator: it owns the data (via the storefront hook), the selected
// category, pagination and the cart/wishlist wiring, then hands plain props
// down to each section. The sections themselves are presentational.

import { useCallback, useMemo, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';

import { PRODUCT_CATEGORIES } from '@/constants/megaMenu';
import { ROUTES } from '@/constants/routes';
import { useStorefrontProducts } from '@/lib/hooks/main/useProduct';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { useWishlistStore } from '@/store/wishlistStore';

import ProductDetail from '../ProductDetails/ProductDetail';
import { flyToCart } from '../flyToCart';
import { toUiProduct } from '../helpers';

import ListingHeader from './ListingHeader';
import ProductGrid from './ProductGrid';
import PromoBanner from './PromoBanner';
import WhyChoose from './WhyChoose';
import {
  LISTING_ALL_CATEGORY,
  LISTING_BREADCRUMBS,
  LISTING_DEFAULT_SORT,
  LISTING_HEADER,
  LISTING_PAGE_SIZE,
  LISTING_SORT_OPTIONS,
  LISTING_VIEWS,
  PROMO_BANNER,
  WHY_CHOOSE,
} from './constants';
import { slugToCategory, sortProducts } from './helpers';
import { S } from './styles';

// Forgiving compare — 'Bags & Tripods' and 'bags-tripods' must match.
const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

export default function ProductListing() {
  const { category: slug } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const brand = searchParams.get('brand') || '';

  const addToCartRaw = useCartStore((s) => s.addToCart);
  const showToast = useUIStore((s) => s.showToast);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const hasWish = useWishlistStore((s) => s.has);

  // The route's category is the pill that starts selected.
  const routeCategory = slugToCategory(slug || '');
  const [category, setCategory] = useState(
    () =>
      PRODUCT_CATEGORIES.find((c) => norm(c) === norm(routeCategory)) ||
      LISTING_ALL_CATEGORY
  );
  const [visibleCount, setVisibleCount] = useState(LISTING_PAGE_SIZE);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sort, setSort] = useState(LISTING_DEFAULT_SORT);
  const [view, setView] = useState(LISTING_VIEWS.GRID);

  const { data, isLoading, error: apiError } = useStorefrontProducts({ limit: 200 });

  const products = useMemo(() => {
    const list = (data?.products || []).map(toUiProduct);
    const matches = list.filter((p) => {
      if (category !== LISTING_ALL_CATEGORY && norm(p.category) !== norm(category)) {
        return false;
      }
      if (brand && norm(p.brand) !== norm(brand) && !norm(p.name).includes(norm(brand))) {
        return false;
      }
      return true;
    });
    return sortProducts(matches, sort);
  }, [data, category, brand, sort]);

  const pickCategory = useCallback((c) => {
    setCategory(c);
    setVisibleCount(LISTING_PAGE_SIZE);
  }, []);

  // Re-sorting reshuffles the whole list, so start the page count over —
  // otherwise "Showing 1–24" would describe a different first page.
  const pickSort = useCallback((value) => {
    setSort(value);
    setVisibleCount(LISTING_PAGE_SIZE);
  }, []);

  const addToCart = useCallback(
    (product, sourceEl) => {
      const res = addToCartRaw(product, 1);

      if (res?.status === 'at-max') {
        showToast(`Only ${res.max} in stock — your bag already has them all.`, 'warn');
        return;
      }
      if (res?.status === 'unavailable') {
        showToast(`${product?.name || 'This item'} is currently unavailable.`, 'error');
        return;
      }
      if (res?.ok) {
        // Arc the product shot into the bag icon in the nav.
        const img =
          sourceEl?.tagName === 'IMG' ? sourceEl : sourceEl?.querySelector?.('img') || null;
        flyToCart(img || sourceEl, {
          imageUrl: product?.thumb || product?.image || product?.images?.[0],
        });
      }
    },
    [addToCartRaw, showToast]
  );

  return (
    <>
      <style>{S}</style>
      <main className="pl-page">
        <ListingHeader
          title={LISTING_HEADER.title}
          subtitle={LISTING_HEADER.subtitle}
          breadcrumbs={LISTING_BREADCRUMBS}
          shown={visibleCount}
          total={products.length}
          categories={PRODUCT_CATEGORIES}
          active={category}
          onSelect={pickCategory}
          sortOptions={LISTING_SORT_OPTIONS}
          sort={sort}
          onSortChange={pickSort}
          view={view}
          onViewChange={setView}
        />

        <ProductGrid
          products={products}
          view={view}
          onOpen={setSelectedProduct}
          onAddToCart={addToCart}
          onWishlist={toggleWish}
          isWished={hasWish}
          visibleCount={visibleCount}
          onLoadMore={() => setVisibleCount((n) => n + LISTING_PAGE_SIZE)}
          loading={isLoading}
          error={apiError?.message || null}
        />

        <WhyChoose
          title={WHY_CHOOSE.title}
          subtitle={WHY_CHOOSE.subtitle}
          features={WHY_CHOOSE.features}
          image={WHY_CHOOSE.image}
          imageAlt={WHY_CHOOSE.imageAlt}
        />

        <PromoBanner
          image={PROMO_BANNER.image}
          imageAlt=""
          titleTop={PROMO_BANNER.titleTop}
          titleBottom={PROMO_BANNER.titleBottom}
          subtitle={PROMO_BANNER.subtitle}
          ctaLabel={PROMO_BANNER.ctaLabel}
          onCta={() => router.push(ROUTES.PRODUCTS)}
        />
      </main>

      <ProductDetail
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={() => {
          if (!selectedProduct) return { ok: false };
          const res = addToCartRaw(selectedProduct, 1);
          if (res?.ok) setTimeout(() => setSelectedProduct(null), 900);
          return res;
        }}
      />
    </>
  );
}
