'use client';
// hooks/useMembership.js
// Resolves the signed-in creator's plan and discount rate, for the STOREFRONT.
// Refactored to use TanStack Query for caching and background refetching.

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { normalizePlan, resolveDiscountRate, planLabel } from '@/utils/planPricing';
import { useMembership as useMembershipApi } from '@/lib/hooks/main/useSubscription';

const readFromUser = (user) =>
  normalizePlan(
    user?.membership?.type ??
    user?.membership?.plan_code ??
    user?.plan ??
    user?.planCode
  );

export function useMembership() {
  const user = useAuthStore((s) => s.user);
  const key  = user?._id ?? user?.id ?? user?.username ?? null;

  // Seed synchronously from the persisted user so the first paint already shows
  // the member price instead of flashing the full price then correcting itself.
  const seedPlan = readFromUser(user);

  const { data, isLoading } = useMembershipApi({
    enabled: Boolean(key),
    retry: false,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes instead of building a manual Map
  });

  // Persisted zustand state rehydrates after mount, so gate anything that would
  // otherwise differ between the server render and the first client render.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Use the API data if available, otherwise fallback to JWT seed
  const planRaw = data ? (data.type ?? data.plan ?? data.plan_code) : seedPlan;
  const resolvedPlan = normalizePlan(planRaw);
  
  const plan = mounted && key ? resolvedPlan : 'free';
  const rateRaw = data ? resolveDiscountRate(data) : resolveDiscountRate({ type: seedPlan });
  const rate = mounted && key ? rateRaw : 0;

  return {
    plan,                       // 'free' | 'popular' | 'elite'
    rate,                       // 0 | 0.02 | 0.05
    percent: Math.round(rate * 100),
    meta: planLabel(plan),      // { label, color, icon }
    hasDiscount: rate > 0,
    isMember: plan !== 'free',
    loading: isLoading,
    ready: mounted,
  };
}

export default useMembership;