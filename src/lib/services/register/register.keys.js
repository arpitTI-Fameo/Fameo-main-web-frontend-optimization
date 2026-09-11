// services/register/register.keys.js
// Single source of query keys for registration reference data.
//
// Master data is the part of this flow worth caching, and it is exactly where
// defect #6 bites: a prefetch keyed ['states'] and a hook keyed
// ['states', stateId] are different entries, so the prefetch silently does
// nothing. Both sides import from here.

export const registerKeys = {
  all: () => ['register'],

  master: () => [...registerKeys.all(), 'master'],
  states: () => [...registerKeys.master(), 'states'],
  cities: (stateId) => [...registerKeys.master(), 'cities', stateId ?? null],
  categories: () => [...registerKeys.master(), 'categories'],
  professions: (categoryCode) =>
    [...registerKeys.master(), 'professions', categoryCode ?? null],
  pincode: (pin) => [...registerKeys.master(), 'pincode', pin ?? null],

  username: (name) => [...registerKeys.all(), 'username', name ?? null],
  referral: (code) => [...registerKeys.all(), 'referral', code ?? null],
};
