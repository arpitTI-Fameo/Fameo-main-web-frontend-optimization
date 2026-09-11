export const subscriptionKeys = {
  all: () => ['subscription'],
  config: () => [...subscriptionKeys.all(), 'config'],
  plans: () => [...subscriptionKeys.all(), 'plans'],
  current: () => [...subscriptionKeys.all(), 'current'],
  membership: () => [...subscriptionKeys.all(), 'membership'],
  history: () => [...subscriptionKeys.all(), 'history'],
  transactions: () => [...subscriptionKeys.all(), 'transactions'],
};
