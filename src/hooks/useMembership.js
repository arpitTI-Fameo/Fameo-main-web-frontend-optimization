'use client';
// hooks/useMembership.js
// Resolves the signed-in creator's plan and discount rate, for the STOREFRONT.
//
// Replaces the copy-pasted fetch block that lived in both CartClient and
// CheckoutClient. Two things it fixes:
//
//  1. SHAPE. Those blocks read `d.data.discountRate` directly. If the backend
//     answers with `discountPercent: 2`, the rate is undefined → 0 → a paying
//     Popular member is charged full price at checkout while /cart still shows
//     them 2% off. resolveDiscountRate() accepts every shape.
//
//  2. FALLBACK. If /subscriptions/membership 401s, 404s, or times out, the old
//     code left the plan at 'free' forever and the member silently lost their
//     discount. The JWT user object already carries membership.type, so we seed
//     from there first and let the API refine it.
//
// Result is cached per-token for the session so every product card doesn't
// trigger its own request.

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { normalizePlan, resolveDiscountRate, planLabel } from '@/lib/planPricing';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// token → { plan, rate } for the life of the tab
const cache = new Map();
let inflight = null;

const readFromUser = (user) =>
  normalizePlan(
    user?.membership?.type ??
    user?.membership?.plan_code ??
    user?.plan ??
    user?.planCode
  );

export function useMembership() {
  const user  = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  // Seed synchronously from the persisted user so the first paint already shows
  // the member price instead of flashing the full price then correcting itself.
  const seedPlan = readFromUser(user);
  const cached   = token ? cache.get(token) : null;

  const [state, setState] = useState(() =>
    cached ?? { plan: seedPlan, rate: resolveDiscountRate({ type: seedPlan }) }
  );
  const [loading, setLoading] = useState(!cached && !!token);

  // Persisted zustand state rehydrates after mount, so gate anything that would
  // otherwise differ between the server render and the first client render.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!token) {
      setState({ plan: 'free', rate: 0 });
      setLoading(false);
      return;
    }

    const hit = cache.get(token);
    if (hit) { setState(hit); setLoading(false); return; }

    let alive = true;
    setLoading(true);

    inflight = fetch(`${BASE}/api/subscriptions/membership`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const data = d?.data ?? d ?? null;
        // Keep the seeded plan if the endpoint gave us nothing usable — never
        // downgrade a member because a request failed.
        const plan = data ? normalizePlan(data.type ?? data.plan ?? data.plan_code)
                          : seedPlan;
        const rate = data ? resolveDiscountRate(data)
                          : resolveDiscountRate({ type: seedPlan });
        const next = { plan, rate };
        cache.set(token, next);
        if (alive) setState(next);
      })
      .catch(() => {
        // Network/API failure → fall back to the JWT's own tier.
        if (alive) setState({ plan: seedPlan, rate: resolveDiscountRate({ type: seedPlan }) });
      })
      .finally(() => { if (alive) setLoading(false); inflight = null; });

    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const plan = mounted ? state.plan : 'free';
  const rate = mounted ? state.rate : 0;

  return {
    plan,                       // 'free' | 'popular' | 'elite'
    rate,                       // 0 | 0.02 | 0.05
    percent: Math.round(rate * 100),
    meta: planLabel(plan),      // { label, color, icon }
    hasDiscount: rate > 0,
    isMember: plan !== 'free',
    loading,
    ready: mounted,
  };
}

export default useMembership;