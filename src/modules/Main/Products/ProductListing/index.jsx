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
import { useAuthStore } from '@/store/authStore';
import { useAddToCart } from '@/lib/hooks/main/useCart';

import { flyToCart } from '../flyToCart';
import { productHref, toUiProduct } from '../helpers';

import ProductHeader from '@/components/Common/ProductHeader';
import ProductGrid from './ProductGrid';
import PromoBanner from './PromoBanner';
import WhyChoose from './WhyChoose';
import ProductFilter from './ProductFilter';
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

const mockAvailableFilters = {
  brands: [
    { id: 'b1', slug: 'sony', name: 'Sony', productCount: 12 },
    { id: 'b2', slug: 'canon', name: 'Canon', productCount: 8 },
    { id: 'b3', slug: 'nikon', name: 'Nikon', productCount: 5 },
    { id: 'b4', slug: 'fujifilm', name: 'Fujifilm', productCount: 7 },
    { id: 'b5', slug: 'dji', name: 'DJI', productCount: 4 },
    { id: 'b6', slug: 'gopro', name: 'GoPro', productCount: 6 },
    { id: 'b7', slug: 'sigma', name: 'Sigma', productCount: 3 },
    { id: 'b8', slug: 'tamron', name: 'Tamron', productCount: 2 }
  ],
  categories: {
    parents: [
      { id: 'p1', slug: 'cameras', name: 'Cameras', productCount: 40 },
      { id: 'p2', slug: 'lenses', name: 'Lenses', productCount: 30 }
    ],
    leaves: [
      { id: 'c1', slug: 'mirrorless-cameras', name: 'Mirrorless Cameras', productCount: 15 },
      { id: 'c2', slug: 'action-cameras', name: 'Action Cameras', productCount: 10 },
      { id: 'c3', slug: 'dslr-cameras', name: 'DSLR Cameras', productCount: 5 },
      { id: 'c4', slug: 'cine-lenses', name: 'Cine Lenses', productCount: 8 }
    ]
  },
  attributes: [
    {
      id: 'a1', slug: 'size', name: 'Size', type: 'select',
      options: [
        { value: 'XS', productCount: 3 },
        { value: 'S', productCount: 10 },
        { value: 'S/M', productCount: 4 },
        { value: 'M', productCount: 15 },
        { value: 'M/L', productCount: 6 },
        { value: 'L', productCount: 5 },
        { value: 'XL', productCount: 8 },
        { value: 'XXL', productCount: 2 },
        { value: 'One Size', productCount: 12 }
      ]
    },
    {
      id: 'a2', slug: 'colour', name: 'Colour', type: 'color',
      options: [
        { value: 'Black', productCount: 20 },
        { value: 'Grey', productCount: 14 },
        { value: 'White', productCount: 10 },
        { value: 'Beige', productCount: 7 },
        { value: 'Red', productCount: 2 },
        { value: 'Purple', productCount: 4 },
        { value: 'Blue', productCount: 9 },
        { value: 'Green', productCount: 5 }
      ]
    },
    {
      id: 'a3', slug: 'properties', name: 'Properties', type: 'select',
      options: [
        { value: 'Waterproof', productCount: 5 },
        { value: 'Windproof', productCount: 3 },
        { value: 'Lightweight', productCount: 8 },
        { value: 'Breathable', productCount: 7 },
        { value: 'Ventilation', productCount: 4 },
        { value: 'Signature chambers', productCount: 2 },
        { value: 'Water repellent', productCount: 6 },
        { value: 'Insulated', productCount: 9 }
      ]
    }
  ],
  priceRange: {
    min: { originalPrice: 0, salePrice: 0 },
    max: { originalPrice: 1000, salePrice: 399 }
  }
};

export default function ProductListing() {
  const { category: slug } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const brand = searchParams.get('brand') || '';

  const addToCartRaw = useCartStore((s) => s.addToCart);
  const showToast = useUIStore((s) => s.showToast);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const hasWish = useWishlistStore((s) => s.has);

  const isAuth = useAuthStore((s) => Boolean(s.user));
  const { mutateAsync: serverAddToCart } = useAddToCart();

  // The route's category is the pill that starts selected.
  const routeCategory = slugToCategory(slug || '');
  const [category, setCategory] = useState(
    () =>
      PRODUCT_CATEGORIES.find((c) => norm(c) === norm(routeCategory)) ||
      LISTING_ALL_CATEGORY
  );
  const [visibleCount, setVisibleCount] = useState(LISTING_PAGE_SIZE);
  const [sort, setSort] = useState(LISTING_DEFAULT_SORT);
  const [view, setView] = useState(LISTING_VIEWS.GRID);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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

  // A card used to open a full-screen overlay. It now navigates to the real
  // detail route, so the page is linkable, shareable and indexable.
  const openProduct = useCallback((p) => router.push(productHref(p)), [router]);

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
    async (product, sourceEl) => {
      let res;
      if (!isAuth) {
        res = addToCartRaw(product, 1);
      } else {
        try {
          await serverAddToCart({ productId: product.id, quantity: 1 });
          res = { ok: true };
        } catch (error) {
          res = { ok: false, status: 'error' };
          showToast(error.message || 'Could not add to cart', 'error');
          return;
        }
      }

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
    [isAuth, addToCartRaw, serverAddToCart, showToast]
  );

  return (
    <>
      <style>{S}</style>
      <main className="pl-page">
        <ProductHeader
          title={LISTING_HEADER.title}
          subtitle={LISTING_HEADER.subtitle}
          image={LISTING_HEADER.image}
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
          onFilters={() => setIsFilterModalOpen(true)}
        />

        <ProductGrid
          products={products}
          view={view}
          onOpen={openProduct}
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

        <ProductFilter
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          currentFilters={{
            categories: category && category !== LISTING_ALL_CATEGORY ? [norm(category)] : [],
            brands: brand ? [brand] : []
          }}
          availableFilters={mockAvailableFilters}
          onApply={(filters) => {
            if (filters.categories && filters.categories.length > 0) {
              pickCategory(filters.categories[0]); // fallback for simple state
            }
            // In a real app, this would also push URL query params for the other filters
            // to maintain state across reloads.
          }}
        />
      </main>
    </>
  );
}
