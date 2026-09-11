'use client';

import { useQuery } from '@tanstack/react-query';
import { useApiMutation } from '@/lib/query/mutation';
import { portalKeys, getProfile, getActivity, getSubscription, getInvoices, getPortalProducts, getNotifications, getReferrals, getWallet, getTransactions, shareCoupon, buyWithWallet, cancelSubscription } from '@/lib/services/portal/portal.client';

export const useProfile = (opts = {}) => useQuery({ queryKey: portalKeys.profile(), queryFn: getProfile, ...opts });

export const useActivity = (limit = 10, opts = {}) => useQuery({ queryKey: [...portalKeys.activity(), limit], queryFn: () => getActivity(limit), ...opts });

export const useSubscription = (opts = {}) => useQuery({ queryKey: portalKeys.subscription(), queryFn: getSubscription, ...opts });

export const useInvoices = (opts = {}) => useQuery({ queryKey: portalKeys.invoices(), queryFn: getInvoices, ...opts });

export const usePortalProducts = (opts = {}) => useQuery({ queryKey: portalKeys.products(), queryFn: getPortalProducts, ...opts });

export const useNotifications = (opts = {}) => useQuery({ queryKey: portalKeys.notifications(), queryFn: getNotifications, ...opts });

export const useReferrals = (opts = {}) => useQuery({ queryKey: portalKeys.referrals(), queryFn: getReferrals, ...opts });

export const useWallet = (opts = {}) => useQuery({ queryKey: portalKeys.wallet(), queryFn: getWallet, ...opts });

export const useTransactions = (opts = {}) => useQuery({ queryKey: portalKeys.transactions(), queryFn: getTransactions, ...opts });

export const useShareCouponMutation = (opts = {}) => useApiMutation({ mutationFn: shareCoupon, invalidate: [portalKeys.referrals()], ...opts });

export const useBuyWithWalletMutation = (opts = {}) => useApiMutation({ mutationFn: buyWithWallet, invalidate: [portalKeys.wallet(), portalKeys.transactions()], ...opts });

export const useCancelSubscriptionMutation = (opts = {}) => useApiMutation({ mutationFn: cancelSubscription, invalidate: [portalKeys.subscription()], ...opts });