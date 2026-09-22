'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { ROUTES } from '@/constants/routes';

import ProductHeader from '@/components/Common/ProductHeader';
import ProductCard from '@/components/Common/ProductCard';
import { flyToCart } from '@/modules/Main/Products/flyToCart';
import { productHref } from '@/modules/Main/Products/helpers';

import { S } from './styles';

export default function Favorites() {
  const router = useRouter();
  
  const items = useWishlistStore((s) => s.items);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const hasWish = useWishlistStore((s) => s.has);

  const addToCartRaw = useCartStore((s) => s.addToCart);
  const showToast = useUIStore((s) => s.showToast);

  const openProduct = useCallback((p) => {
    router.push(productHref(p));
  }, [router]);

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
        const img = sourceEl?.tagName === 'IMG' ? sourceEl : sourceEl?.querySelector?.('img') || null;
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
      <div className="fav-page">
        <ProductHeader
          title="Your Wishlist"
          subtitle="Everything you've saved for later."
          image="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1000&q=80"
          breadcrumbs={[
            { label: 'Home', href: ROUTES.HOME },
            { label: 'Favorites' }
          ]}
        />

        <section className="fav-content">
          <div className="fav-inner">
            {items.length === 0 ? (
              <div className="fav-empty">
                <div className="fav-empty-icon">♡</div>
                <h2>Your wishlist is empty</h2>
                <p>Save items you love and they will appear here.</p>
                <Link href={ROUTES.PRODUCTS} className="fav-empty-cta">
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="fav-grid">
                {items.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpen={openProduct}
                    onAddToCart={addToCart}
                    onWishlist={toggleWish}
                    isWished={hasWish(product.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
