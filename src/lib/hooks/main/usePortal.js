import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import {
  getPortalProfileAction,
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
    return await getPortalProfileAction();
  }, ...opts
});

export const useActivity = (limit = 10, opts = {}) => useQuery({
  queryKey: [...portalKeys.activity(), limit], queryFn: async () => {
    return await getActivityAction(limit);
  }, ...opts
});

export const useSubscription = (opts = {}) => useQuery({
  queryKey: portalKeys.subscription(), queryFn: async () => {
    return await getSubscriptionAction();
  }, ...opts
});

export const useInvoices = (opts = {}) => useQuery({
  queryKey: portalKeys.invoices(), queryFn: async () => {
    return await getInvoicesAction();
  }, ...opts
});

export const usePortalProducts = (opts = {}) => useQuery({
  queryKey: portalKeys.products(), queryFn: async () => {
    return await getPortalProductsAction();
  }, ...opts
});

export const useNotifications = (opts = {}) => useQuery({
  queryKey: portalKeys.notifications(), queryFn: async () => {
    return await getNotificationsAction();
  }, ...opts
});

export const useReferrals = (opts = {}) => useQuery({
  queryKey: portalKeys.referrals(), queryFn: async () => {
    return await getReferralsAction();
  }, ...opts
});

export const useWallet = (opts = {}) => useQuery({
  queryKey: portalKeys.wallet(), queryFn: async () => {
    return await getWalletAction();
  }, ...opts
});

export const useTransactions = (opts = {}) => useQuery({
  queryKey: portalKeys.transactions(), queryFn: async () => {
    return await getTransactionsAction();
  }, ...opts
});

export const useShareCouponMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    return await shareCouponAction(...args);
  }, invalidate: [portalKeys.referrals()], ...opts
});

export const useBuyWithWalletMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    return await buyWithWalletAction(...args);
  }, invalidate: [portalKeys.wallet(), portalKeys.transactions()], ...opts
});

export const useCancelSubscriptionMutation = (opts = {}) => useApiMutation({
  mutationFn: async (...args) => {
    return await cancelSubscriptionAction(...args);
  }, invalidate: [portalKeys.subscription()], ...opts
});
