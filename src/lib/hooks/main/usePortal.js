import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import {
  getProfileAction,
  getActivityAction,
  getSubscriptionAction,
  getInvoicesAction,
  getPortalProductsAction,
  getNotificationsAction,
  getReferralsAction,
  getWalletAction,
  getTransactionsAction,
  shareCouponAction,
  buyWithWalletAction,
  cancelSubscriptionAction
} from '@/lib/services';

// ── Keys ───────────────────────────────────────────────────────────────────
export const portalKeys = {
  all: ['portal'],
  profile: () => [...portalKeys.all, 'profile'],
  activity: () => [...portalKeys.all, 'activity'],
  subscription: () => [...portalKeys.all, 'subscription'],
  invoices: () => [...portalKeys.all, 'invoices'],
  products: () => [...portalKeys.all, 'products'],
  notifications: () => [...portalKeys.all, 'notifications'],
  referrals: () => [...portalKeys.all, 'referrals'],
  wallet: () => [...portalKeys.all, 'wallet'],
  transactions: () => [...portalKeys.all, 'transactions'],
};


export const useProfile = (opts = {}) => useQuery({
  queryKey: portalKeys.profile(), queryFn: async () => {
    const response = await getProfileAction();
    if (!response.code) throw response;
    return response.result;
  }, ...opts
});

export const useActivity = (limit = 10, opts = {}) => useQuery({
  queryKey: [...portalKeys.activity(), limit], queryFn: async () => {
    const response = await getActivityAction(limit);
    if (!response.code) throw response;
    return response.result;
  }, ...opts
});

export const useSubscription = (opts = {}) => useQuery({
  queryKey: portalKeys.subscription(), queryFn: async () => {
    const response = await getSubscriptionAction();
    if (!response.code) throw response;
    return response.result;
  }, ...opts
});

export const useInvoices = (opts = {}) => useQuery({
  queryKey: portalKeys.invoices(), queryFn: async () => {
    const response = await getInvoicesAction();
    if (!response.code) throw response;
    return response.result;
  }, ...opts
});

export const usePortalProducts = (opts = {}) => useQuery({
  queryKey: portalKeys.products(), queryFn: async () => {
    const response = await getPortalProductsAction();
    if (!response.code) throw response;
    return response.result;
  }, ...opts
});

export const useNotifications = (opts = {}) => useQuery({
  queryKey: portalKeys.notifications(), queryFn: async () => {
    const response = await getNotificationsAction();
    if (!response.code) throw response;
    return response.result;
  }, ...opts
});

export const useReferrals = (opts = {}) => useQuery({
  queryKey: portalKeys.referrals(), queryFn: async () => {
    const response = await getReferralsAction();
    if (!response.code) throw response;
    return response.result;
  }, ...opts
});

export const useWallet = (opts = {}) => useQuery({
  queryKey: portalKeys.wallet(), queryFn: async () => {
    const response = await getWalletAction();
    if (!response.code) throw response;
    return response.result;
  }, ...opts
});

export const useTransactions = (opts = {}) => useQuery({
  queryKey: portalKeys.transactions(), queryFn: async () => {
    const response = await getTransactionsAction();
    if (!response.code) throw response;
    return response.result;
  }, ...opts
});

export const useShareCouponMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await shareCouponAction(...args);
    if (!response.code) throw response;
    return response.result;
  }, invalidate: [portalKeys.referrals()], ...opts
});

export const useBuyWithWalletMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await buyWithWalletAction(...args);
    if (!response.code) throw response;
    return response.result;
  }, invalidate: [portalKeys.wallet(), portalKeys.transactions()], ...opts
});

export const useCancelSubscriptionMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    const response = await cancelSubscriptionAction(...args);
    if (!response.code) throw response;
    return response.result;
  }, invalidate: [portalKeys.subscription()], ...opts
});
