'use client';
// modules/Main/Products/ProductDetails/index.jsx
// Product detail page — /products/[category]/[slug].
//
// Thin orchestrator, the same shape as ProductListing: it resolves the product
// from the route, owns every piece of page state (variant selection, quantity,
// open tab), wires the cart and wishlist stores, and hands plain props to the
// sections. Every section below is presentational and holds no store of its own.
//
// The catalogue is dummy data from ./constants for now. When the products
// service is wired, only findDetailProduct() and this component's first few
// lines change — a hook from @/lib/hooks/main/useProduct replaces the lookup
// and the sections keep their props.

import { useCallback, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { ROUTES } from '@/constants/routes';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { useWishlistStore } from '@/store/wishlistStore';

import { flyToCart } from '../flyToCart';
import { productHref } from '../helpers';

import NewsletterBand from './NewsletterBand';
import ProductBreadcrumbs from './ProductBreadcrumbs';
import ProductGallery from './ProductGallery';
import ProductReviews from './ProductReviews';
import ProductSummary from './ProductSummary';
import ProductTabs from './ProductTabs';
import RelatedProducts from './RelatedProducts';
import { DETAIL_DEFAULT_TAB, DETAIL_RELATED } from './constants';
import {
  buildDetailTabs,
  defaultVariantSelection,
  findDetailProduct,
  ratingBars,
  relatedProducts,
} from './helpers';
import { S } from './styles';

export default function ProductDetails() {
  const { slug } = useParams();
  const router = useRouter();

  const addToCartRaw = useCartStore((s) => s.addToCart);
  const showToast = useUIStore((s) => s.showToast);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const hasWish = useWishlistStore((s) => s.has);

  // AddToBagButton fires its onAdd inside a timeout, by which point React has
  // already nulled the event's currentTarget — so the flight animation reads
  // its source element from a ref rather than from the click.
  const topRef = useRef(null);

  const product = useMemo(() => findDetailProduct(slug), [slug]);

  const tabs = useMemo(() => buildDetailTabs(product), [product]);
  const bars = useMemo(() => ratingBars(product?.ratingBreakdown), [product]);
  const related = useMemo(
    () => relatedProducts(product, DETAIL_RELATED.limit),
    [product]
  );

  // Keyed off the product id so a move to a related item resets the picker,
  // the quantity and the open tab in one go rather than carrying them over.
  const [selection, setSelection] = useState(() =>
    defaultVariantSelection(product?.variantAxes)
  );
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState(DETAIL_DEFAULT_TAB);
  const [shownId, setShownId] = useState(product?.id);

  if (product && product.id !== shownId) {
    setShownId(product.id);
    setSelection(defaultVariantSelection(product.variantAxes));
    setQuantity(1);
    setTab(DETAIL_DEFAULT_TAB);
  }

  const pickVariant = useCallback((axisId, value) => {
    setSelection((prev) => ({ ...prev, [axisId]: value }));
  }, []);

  const openProduct = useCallback(
    (p) => router.push(productHref(p)),
    [router]
  );

  // Shared by the main CTA and the related rail. Returns the store's result so
  // AddToBagButton can show its error state instead of a silent no-op.
  const addToCart = useCallback(
    (item, qty = 1, sourceEl = null) => {
      const res = addToCartRaw(item, qty);

      if (res?.status === 'at-max') {
        showToast(`Only ${res.max} in stock — your bag already has them all.`, 'warn');
        return res;
      }
      if (res?.status === 'unavailable') {
        showToast(`${item?.name || 'This item'} is currently unavailable.`, 'error');
        return res;
      }
      if (res?.ok) {
        const img =
          sourceEl?.tagName === 'IMG' ? sourceEl : sourceEl?.querySelector?.('img') || null;
        flyToCart(img || sourceEl, {
          imageUrl: item?.thumb || item?.image || item?.images?.[0],
        });
      }
      return res;
    },
    [addToCartRaw, showToast]
  );

  if (!product) return null;

  const crumbs = [
    { label: 'Home', href: ROUTES.HOME },
    { label: product.category, href: ROUTES.CATEGORY(product.categorySlug) },
    { label: product.name },
  ];

  return (
    <>
      <style>{S}</style>
      <main className="pdp">
        <div className="pdp-inner">
          <ProductBreadcrumbs items={crumbs} />

          <div className="pdp-top" ref={topRef}>
            <ProductGallery
              images={product.images}
              name={product.name}
              badge={product.tag}
              isWished={hasWish(product.id)}
              onWishlist={() => toggleWish(product)}
            />

            <ProductSummary
              product={product}
              selection={selection}
              onVariant={pickVariant}
              quantity={quantity}
              onQuantity={setQuantity}
              onAddToCart={() => addToCart(product, quantity, topRef.current)}
              isWished={hasWish(product.id)}
              onWishlist={() => toggleWish(product)}
            />
          </div>
        </div>

        <ProductTabs tabs={tabs} active={tab} onSelect={setTab} />

        <div className="pdp-band">
          <ProductReviews
            rating={product.rating}
            count={product.reviewCount}
            bars={bars}
            reviews={product.reviews}
          />
        </div>

        <RelatedProducts
          products={related}
          onOpen={openProduct}
          onAddToCart={(p, el) => addToCart(p, 1, el)}
          onWishlist={toggleWish}
          isWished={hasWish}
        />

        <NewsletterBand />
      </main>
    </>
  );
}
