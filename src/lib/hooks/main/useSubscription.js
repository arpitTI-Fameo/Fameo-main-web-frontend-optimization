'use client';

import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { subscriptionKeys } from '@/lib/services/subscription/subscription.keys';
import {
  cancelSubscription, createRazorpayOrder, getMembership, getPlans, getSubscriptionConfig, getSubscriptionHistory, resumeSubscription, setAutoRenew, verifyRazorpayPayment,
  getCurrentSubscription,
} from '@/lib/services/subscription/subscription.client';

// Re-exported so components import everything subscription-related from this
// hook module. The implementations live in the service layer, where the
// multi-step Razorpay checkout belongs.
export { purchasePlan, newCheckoutAttemptId } from '@/lib/services/subscription/subscription.client';
import { quoteMarketingCoupon } from '@/lib/services/subscription/subscription.client';

export const useSubscriptionConfig = (opts = {}) => useQuery({
  queryKey: subscriptionKeys.config(),
  queryFn: getSubscriptionConfig,
  ...opts,
});

export const usePlans = (opts = {}) => useQuery({
  queryKey: subscriptionKeys.plans(),
  queryFn: getPlans,
  ...opts,
});

export const useCurrentSubscription = (opts = {}) => useQuery({
  queryKey: subscriptionKeys.current(),
  queryFn: getCurrentSubscription,
  ...opts,
});

export const useMembership = (opts = {}) => useQuery({
  queryKey: subscriptionKeys.membership(),
  queryFn: getMembership,
  ...opts,
});

export const useSubscriptionHistory = (opts = {}) => useQuery({
  queryKey: subscriptionKeys.history(),
  queryFn: getSubscriptionHistory,
  ...opts,
});

export const useCreateRazorpayOrderMutation = (opts = {}) => useApiMutation({
  mutationFn: createRazorpayOrder,
  ...opts,
});

export const useVerifyRazorpayPaymentMutation = (opts = {}) => useApiMutation({
  mutationFn: verifyRazorpayPayment,
  invalidate: [subscriptionKeys.current()],
  ...opts,
});

export const useCancelSubscriptionMutation = (opts = {}) => useApiMutation({
  mutationFn: cancelSubscription,
  invalidate: [subscriptionKeys.current()],
  ...opts,
});

export const useResumeSubscriptionMutation = (opts = {}) => useApiMutation({
  mutationFn: resumeSubscription,
  invalidate: [subscriptionKeys.current()],
  ...opts,
});

export const useSetAutoRenewMutation = (opts = {}) => useApiMutation({
  mutationFn: setAutoRenew,
  invalidate: [subscriptionKeys.current()],
  ...opts,
});

export const useQuoteMarketingCouponMutation = (opts = {}) => useApiMutation({
  mutationFn: quoteMarketingCoupon,
  ...opts,
});
