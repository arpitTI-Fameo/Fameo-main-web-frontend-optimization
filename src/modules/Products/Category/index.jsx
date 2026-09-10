'use client';
// modules/Products/Category/index.jsx
// Category listing page — /products/cameras, /products/lighting, etc.
// The category strip in ProductsSubNav pushes here, so this route must exist
// or every category click 404s.
//
// Slug → category name: 'bags-tripods' → 'Bags & Tripods'. We match against
// PRODUCT_CATEGORIES so display casing/spacing is exact, then fetch by category.

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { getStorefrontProducts } from '@/services/fameoProducts.service';

import ProductGrid   from '../ProductGrid';
import ProductDetail from '../ProductDetail';
import { toUiProduct } from '../helpers';
import { slugToCategory } from './helpers';

export default function Category() {
  const { category: slug } = useParams();
  const searchParams       = useSearchParams();
  const brand              = searchParams.get('brand') || '';

  const addToCart = useCartStore((s) => s.addToCart);

  const categoryName = slugToCategory(slug || '');

  const [products,        setProducts]        = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

    getStorefrontProducts({ limit: 200 })
      .then((data) => {
        if (!alive) return;
        let list = (data?.products || []).map(toUiProduct);
        // Filter by category client-side (forgiving of casing/spacing)
        list = list.filter((p) => norm(p.category) === norm(categoryName));
        if (brand) {
          list = list.filter(
            (p) =>
              norm(p.brand) === norm(brand) ||
              norm(p.name).includes(norm(brand))
          );
        }
        setProducts(list);
      })
      .catch((e) => {
        console.error('Failed to load category products:', e);
        if (alive) setError('Could not load products. Please try again.');
      })
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [categoryName, brand]);

  return (
    <div style={{ paddingTop: 108, minHeight: '70vh', background: '#fff' }}>
      <header
        style={{
          padding: '48px 56px 28px',
          borderBottom: '1px solid #EEEEF2',
        }}
      >
        <p
          style={{
            fontFamily: 'Jost, sans-serif', fontSize: 9, fontWeight: 500,
            letterSpacing: '.28em', textTransform: 'uppercase', color: '#E8405A',
            marginBottom: 10,
          }}
        >
          Category
        </p>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(34px,5vw,60px)', fontWeight: 300, color: '#111118',
            lineHeight: 1,
          }}
        >
          {categoryName}
          {brand ? ` · ${brand}` : ''}
        </h1>
      </header>

      {loading && (
        <p style={{ padding: 56, color: '#888898', fontFamily: 'Jost, sans-serif' }}>
          Loading products…
        </p>
      )}

      {!loading && error && (
        <p style={{ padding: 56, color: '#c42d45', fontFamily: 'Jost, sans-serif' }}>
          {error}
        </p>
      )}

      {!loading && !error && products.length === 0 && (
        <p style={{ padding: 56, color: '#888898', fontFamily: 'Jost, sans-serif' }}>
          No products found in {categoryName} yet.
        </p>
      )}

      {!loading && !error && products.length > 0 && (
        <ProductGrid
          products={products}
          initialCategory="all"
          onProductClick={setSelectedProduct}
          addToCart={addToCart}
        />
      )}

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
}
