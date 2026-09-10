'use client';
// hooks/usePortalData.js
// ─────────────────────────────────────────────────────────────────────────────
// Tiny fetch hook used by every portal page. Gives you { data, loading, error,
// refetch } so loading and error states are handled the same way everywhere.
//
// Because the components read from this hook rather than importing mock data
// directly, swapping mocks for the real API is a change in portal.service.js
// only — nothing here or in the pages changes.
//
//   const { data, loading, error, refetch } = usePortalData(getWallet);
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react';

export function usePortalData(fetcher, deps = []) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Keeps the latest fetcher without making it a dependency of the effect.
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      setData(result);
    } catch (err) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, refetch: load };
}

// Loads several endpoints at once and returns them keyed by name.
//   const { data, loading } = usePortalDataMap({ wallet: getWallet, txns: getTransactions });
export function usePortalDataMap(fetcherMap, deps = []) {
  const [data, setData]       = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const mapRef = useRef(fetcherMap);
  mapRef.current = fetcherMap;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const entries = Object.entries(mapRef.current);
      const results = await Promise.all(entries.map(([, fn]) => fn()));
      setData(Object.fromEntries(entries.map(([key], i) => [key, results[i]])));
    } catch (err) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, refetch: load };
}
