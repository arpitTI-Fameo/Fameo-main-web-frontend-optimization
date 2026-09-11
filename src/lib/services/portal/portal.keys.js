export const portalKeys = {
  all: () => ['portal'],
  activity: () => [...portalKeys.all(), 'activity'],
  wallet: () => [...portalKeys.all(), 'wallet'],
  referrals: () => [...portalKeys.all(), 'referrals'],
  transactions: () => [...portalKeys.all(), 'transactions'],
};
