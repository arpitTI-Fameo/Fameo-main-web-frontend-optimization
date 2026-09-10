// app/api/products/route.js
// Products API proxy route.
// In development: returns mock data.
// In production: proxies to your Express backend.
//
// GET  /api/products              — all products (with optional query params)
// GET  /api/products?category=X   — filter by category
// GET  /api/products?brand=X      — filter by brand
// GET  /api/products?search=X     — search by name
// GET  /api/products?id=X         — single product by id

import { NextResponse } from 'next/server';
import { PRODUCTS } from '@/constants/mockData';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || !process.env.NEXT_PUBLIC_API_URL;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category   = searchParams.get('category');
  const brand      = searchParams.get('brand');
  const search     = searchParams.get('search');
  const id         = searchParams.get('id');

  // ── MOCK mode (development / no backend yet) ──────────────────────────────
  if (USE_MOCK) {
    let results = [...PRODUCTS];

    if (id) {
      const product = results.find((p) => p.id === Number(id) || p.slug === id);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ product });
    }

    if (category && category !== 'all') {
      results = results.filter((p) =>
        p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (brand) {
      results = results.filter((p) =>
        p.name.toLowerCase().includes(brand.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase() === brand.toLowerCase())
      );
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      products: results,
      total:    results.length,
    });
  }

  // ── PRODUCTION mode — proxy to Express backend ────────────────────────────
  try {
    const url    = new URL(`${BACKEND}/api/products`);
    if (category) url.searchParams.set('category', category);
    if (brand)    url.searchParams.set('brand',    brand);
    if (search)   url.searchParams.set('search',   search);
    if (id)       url.searchParams.set('id',       id);

    const res  = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        // Forward auth token if present
        ...(request.headers.get('Authorization')
          ? { Authorization: request.headers.get('Authorization') }
          : {}),
      },
      next: { revalidate: 60 }, // cache for 60 seconds
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to fetch products' },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('[/api/products] Error:', err.message);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}