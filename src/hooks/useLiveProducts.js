// 'use client';
// // hooks/useLiveProducts.js
// // Live product feed from the Fameo Products backend — the SAME backend the
// // admin dashboard manages. When staff approve, edit, freeze, or archive a
// // product in the admin, this hook picks it up:
// //   • on page load
// //   • whenever the tab regains focus
// //   • every `pollMs` milliseconds (default 60s) while the tab is visible
// //
// // Env: NEXT_PUBLIC_PRODUCTS_API_URL=http://localhost:5000/api

// import { useCallback, useEffect, useRef, useState } from 'react';
// import { adaptLiveProduct } from '@/lib/liveProductAdapter';

// const API = process.env.NEXT_PUBLIC_PRODUCTS_API_URL || 'http://localhost:5000/api';

// export function useLiveProducts({ pollMs = 60000, params = {} } = {}) {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const timer = useRef(null);

//   const fetchProducts = useCallback(async () => {
//     try {
//       const qs = new URLSearchParams({ status: 'live', limit: 100, ...params });
//       const res = await fetch(`${API}/products?${qs}`);
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
//       setProducts((data.products || []).map(adaptLiveProduct));
//       setError(null);
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [JSON.stringify(params)]);

//   useEffect(() => {
//     fetchProducts();

//     const onFocus = () => fetchProducts();
//     window.addEventListener('focus', onFocus);
//     document.addEventListener('visibilitychange', onFocus);

//     if (pollMs > 0) {
//       timer.current = setInterval(() => {
//         if (document.visibilityState === 'visible') fetchProducts();
//       }, pollMs);
//     }
//     return () => {
//       window.removeEventListener('focus', onFocus);
//       document.removeEventListener('visibilitychange', onFocus);
//       if (timer.current) clearInterval(timer.current);
//     };
//   }, [fetchProducts, pollMs]);

//   const bestsellers = products.slice(0, 6);
//   return { products, bestsellers, loading, error, refresh: fetchProducts };
// }



'use client';
// hooks/useLiveProducts.js
// Live product feed from the Fameo Products backend — the SAME backend the
// admin dashboard manages. When staff approve, edit, freeze, or archive a
// product in the admin, this hook picks it up:
//   • on page load
//   • whenever the tab regains focus
//   • every `pollMs` milliseconds (default 60s) while the tab is visible
//
// Env: NEXT_PUBLIC_PRODUCTS_API_URL=http://localhost:5000/api

import { useCallback, useEffect, useRef, useState } from 'react';
import { adaptLiveProduct } from '@/lib/liveProductAdapter';

// NOTE: this defaulted to :5000 while services/fameoProducts.service.js defaulted
// to :5001 for the SAME env var — and :5000 is also the default for
// NEXT_PUBLIC_API_URL (the main backend). With the env var unset, product fetches
// and cart calls hit two different servers. Aligned on :5001 to match the
// products service; set NEXT_PUBLIC_PRODUCTS_API_URL explicitly in .env.local.
const API = process.env.NEXT_PUBLIC_PRODUCTS_API_URL || 'http://localhost:5001/api';

export function useLiveProducts({ pollMs = 60000, params = {} } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timer = useRef(null);

  const fetchProducts = useCallback(async () => {
    try {
      const qs = new URLSearchParams({ status: 'live', limit: 100, ...params });
      const res = await fetch(`${API}/products?${qs}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      setProducts((data.products || []).map(adaptLiveProduct));
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchProducts();

    const onFocus = () => fetchProducts();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);

    if (pollMs > 0) {
      timer.current = setInterval(() => {
        if (document.visibilityState === 'visible') fetchProducts();
      }, pollMs);
    }
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
      if (timer.current) clearInterval(timer.current);
    };
  }, [fetchProducts, pollMs]);

  const bestsellers = products.slice(0, 6);
  return { products, bestsellers, loading, error, refresh: fetchProducts };
}