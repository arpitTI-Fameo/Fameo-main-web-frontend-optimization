// app/api/bff-products/[...path]/route.js
// BFF for the products backend (fameo-products-backend).
//
// A separate route rather than a prefix inside /api/bff, so an upstream path
// that happens to start with /products cannot be mistaken for a routing hint.

import { PRODUCTS_ORIGIN } from '@/lib/api/server/origins';
import { createProxy } from '@/lib/api/server/proxy';

const proxy = createProxy(PRODUCTS_ORIGIN);

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;

export const dynamic = 'force-dynamic';
