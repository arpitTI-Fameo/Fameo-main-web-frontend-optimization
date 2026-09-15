import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import {
  purchasePlan,
  newCheckoutAttemptId,
  getSubscriptionConfigAction,
  getPlansAction,
  getCurrentSubscriptionAction,
  getMembershipAction,
  getSubscriptionHistoryAction,
  createRazorpayOrderAction,
  verifyRazorpayPaymentAction,
  cancelSubscriptionAction,
  resumeSubscriptionAction,
  setAutoRenewAction,
  quoteMarketingCouponAction
} from '@/lib/services';

// ── Keys ───────────────────────────────────────────────────────────────────
export const subscriptionKeys = {
  all: () => ['subscription'],
  config: () => [...subscriptionKeys.all(), 'config'],
  plans: () => [...subscriptionKeys.all(), 'plans'],
  current: () => [...subscriptionKeys.all(), 'current'],
  membership: () => [...subscriptionKeys.all(), 'membership'],
  history: () => [...subscriptionKeys.all(), 'history'],
  transactions: () => [...subscriptionKeys.all(), 'transactions'],
};


// Re-exported so components keep one import point for the subscription flow.
// The implementations live in the service layer, where the multi-step Razorpay
// checkout belongs.
export { purchasePlan, newCheckoutAttemptId };

export const useSubscriptionConfig = (opts = {}) => useQuery({

  queryKey: subscriptionKeys.config(),
  queryFn: async () => {
    const response = await getSubscriptionConfigAction();
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const usePlans = (opts = {}) => useQuery({

  queryKey: subscriptionKeys.plans(),
  queryFn: async () => {
    const response = await getPlansAction();
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useCurrentSubscription = (opts = {}) => useQuery({

  queryKey: subscriptionKeys.current(),
  queryFn: async () => {
    const response = await getCurrentSubscriptionAction();
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useMembership = (opts = {}) => useQuery({

  queryKey: subscriptionKeys.membership(),
  queryFn: async () => {
    const response = await getMembershipAction();
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useSubscriptionHistory = (opts = {}) => useQuery({

  queryKey: subscriptionKeys.history(),
  queryFn: async () => {
    const response = await getSubscriptionHistoryAction();
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useCreateRazorpayOrderMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await createRazorpayOrderAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});

export const useVerifyRazorpayPaymentMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await verifyRazorpayPaymentAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  invalidate: [subscriptionKeys.current()],
  ...opts,
});

export const useCancelSubscriptionMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await cancelSubscriptionAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  invalidate: [subscriptionKeys.current()],
  ...opts,
});

export const useResumeSubscriptionMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await resumeSubscriptionAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  invalidate: [subscriptionKeys.current()],
  ...opts,
});

export const useSetAutoRenewMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await setAutoRenewAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  invalidate: [subscriptionKeys.current()],
  ...opts,
});

export const useQuoteMarketingCouponMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await quoteMarketingCouponAction(...args);
    if (!response.code) throw response;
    return response.result;
  },
  ...opts,
});
