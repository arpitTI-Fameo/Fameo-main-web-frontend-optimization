import 'server-only';
// lib/services/main/prefetch.server.js
// Server-side twins of the *.api.js actions that pages prefetch.
//
// Why these exist rather than reusing the .api.js actions directly:
//
// Those actions run on lib/api/apiHandler.js, which is the BROWSER transport —
// it targets /api/bff with a relative URL. Called from a Server Component that
// either fails outright (a relative URL has nothing to resolve against) or, in
// an earlier revision that bolted on an absolute prefix, made the server issue
// an HTTP request to its own BFF. That version also forwarded
// `cookies().toString()` on a Promise, so the header was the literal string
// "[object Promise]" and every SSR prefetch reached the upstream
// unauthenticated — it silently returned nothing and the client refetched.
//
// These go straight to the upstream, one hop, correctly authenticated.
//
// The return shape MATCHES sendRequest's `{ code, status, error, result }`
// envelope on purpose: the hooks do `if (!response.code) throw response;
// return response.result`, and a prefetched cache entry has to look identical
// to what the client would have fetched or hydration hands the component a
// shape it does not recognise.

import { publicFetch, privateFetch } from '@/lib/api/server/fetcher';
import { PRODUCTS_ORIGIN } from '@/lib/api/server/origins';
import {
  subscriptionEndpoints,
  communityEndpoints,
  revalidate,
} from '@/lib/api/endpoints';

/**
 * Run a server fetch and wrap it in the action envelope.
 *
 * A failed prefetch must never take the page down: the client will refetch on
 * mount and render its own error state. This mirrors sendRequest's catch.
 */
async function envelope(run) {
  try {
    return { code: true, status: 200, error: null, result: await run() };
  } catch (error) {
    return {
      code: false,
      status: error?.status || 500,
      error: error?.message || 'Failed to fetch',
      result: null,
    };
  }
}

/**
 * Membership plans — /plans is a PUBLIC route and the plan list is identical
 * for every visitor, so this is a publicFetch with a revalidate window. Using
 * privateFetch here would make the page dynamic for no benefit.
 */
export const getPlansServer = () =>
  envelope(() =>
    publicFetch(subscriptionEndpoints.plans(), { revalidate: revalidate.master }),
  );

/**
 * Storefront products. The upstream path is public, but /products sits behind
 * the auth gate and the listing may carry per-user fields, so it is fetched
 * per request and never shared-cached.
 */
export const getStorefrontProductsServer = (params = {}) => {
  const qs = new URLSearchParams({ limit: 50, ...params });
  return envelope(() =>
    privateFetch(`${PRODUCTS_ORIGIN}/public/products?${qs}`),
  );
};

/** Community spaces. Per-user (membership decides visibility) — never cached. */
export const getSpacesServer = () =>
  envelope(() => privateFetch(communityEndpoints.spaces()));
