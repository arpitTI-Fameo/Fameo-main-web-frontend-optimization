// services/auth/auth.keys.js
// The single source of query keys for this resource.
//
// Defect #6: a prefetch keyed ['users'] and a hook keyed ['users', params] are
// different cache entries. Hydration silently does nothing, the crawler gets a
// spinner, and nobody notices because there is no error. Both sides import
// from here so they cannot drift.
//
// Rule worth enforcing in review: never pass an array literal as a queryKey.

export const authKeys = {
  all: () => ['auth'],
  me: () => [...authKeys.all(), 'me'],
  session: () => [...authKeys.all(), 'session'],
};
