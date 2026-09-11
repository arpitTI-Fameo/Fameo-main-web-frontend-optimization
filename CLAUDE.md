# API Architecture Migration Guide

A working reference implementation plus a phased plan for rolling it across an existing Next 15 codebase.

Everything in `src/` is drop-in. Paths assume the `@/*` → `src/*` alias.

---

## What actually changes, and why

| # | Current | Problem | New |
|---|---|---|---|
| 1 | `cookies()` called synchronously | Throws in Next 15 | `await cookies()` in `lib/auth/session.ts` |
| 2 | `response.headers.set()` in middleware | Server Components never see those values | `NextResponse.next({ request: { headers } })` |
| 3 | `x-tenant-id` read from request header | Any client can spoof a tenant | Tenant derived from host |
| 4 | httpOnly cookie + `getCookie()` in JS | Contradiction — one of the two is a lie | httpOnly only, BFF proxy attaches the token |
| 5 | Axios on the server | No Data Cache, no `revalidateTag`, no ISR, no request memoization | Native `fetch` both sides |
| 6 | Prefetch key `['users']`, hook key `['users', params]` | Hydration silently dead, crawler sees a spinner | Shared `userKeys` factory |
| 7 | Prefetch caches full envelope, hook expects `.result` | Shape mismatch | Envelope unwrapped in one place |
| 8 | `throw` inside `onSuccess` | Does not route to `onError` in v5 | Failure detection in `mutationFn` |
| 9 | `string[]` invalidation keys | Matches nothing | `QueryKey[]` |
| 10 | `if (response.code)` | `code: 0` reads as failure | Explicit `isSuccessEnvelope()` |
| 11 | `staleTime: 0` default | Client refetches on mount, prefetch wasted | `staleTime: 60_000` + singleton client |
| 12 | Flat endpoint enum | Cannot express `/products/:id` | Endpoint functions |
| 13 | No metadata / sitemap / JSON-LD | Nothing in place for SEO | `lib/seo/` + `app/sitemap.ts` + `app/robots.ts` |
| 14 | Toasts in interceptor *and* `onError` | Double toasts | Errors thrown; UI decides |
| 15 | No module boundaries | Server code importable from client | `server-only` / `"use client"` guards |

---

## The one idea the whole thing rests on

**Split every request by trust boundary, not by convenience.**

```
                         ┌─────────────────────────────────────┐
  PUBLIC  /products/:slug│ publicFetch                         │
  (crawlers, everyone)   │ native fetch + revalidate + tags    │
                         │ → static / ISR, no cookies          │
                         └─────────────────────────────────────┘

                         ┌─────────────────────────────────────┐
  PRIVATE /dashboard     │ privateFetch (RSC prefetch)         │
  (signed-in user)       │ + clientFetch → /api/bff (browser)  │
                         │ → no-store, cookie forwarded        │
                         └─────────────────────────────────────┘
```

Touch a cookie on a public page and it becomes dynamic — you lose static generation, your TTFB goes up, and crawl budget suffers. That single rule is worth more to SEO than everything else in this document.

---

## Files, in dependency order

```
src/
├── lib/
│   ├── api/
│   │   ├── config.ts              env validation, cookie name, BFF base
│   │   ├── errors.ts              ApiError + toUserMessage
│   │   ├── core.ts                isomorphic fetch, envelope unwrap, timeouts
│   │   ├── endpoints.ts           URLs + cache tags + revalidate windows
│   │   ├── server/
│   │   │   ├── context.ts         reads middleware-injected headers
│   │   │   └── fetcher.ts         publicFetch / privateFetch
│   │   └── client/fetcher.ts      clientFetch → BFF
│   ├── auth/session.ts            async cookie helpers
│   ├── query/
│   │   ├── query-client.ts        singleton + sane defaults
│   │   └── mutation.ts            useApiMutation
│   └── seo/
│       ├── metadata.ts            baseMetadata + buildMetadata
│       └── json-ld.tsx            Product / BreadcrumbList
├── providers/query-provider.tsx
├── services/<resource>/
│   ├── <r>.types.ts               shared shapes — the drift guard
│   ├── <r>.keys.ts                single source of query keys
│   ├── <r>.server.ts              server-only, cached or private
│   └── <r>.client.ts              queryOptions + hooks + mutations
├── middleware.ts
└── app/
    ├── api/bff/[...path]/route.ts proxy, attaches token server-side
    ├── api/auth/{login,logout}/route.ts
    ├── api/revalidate/route.ts    webhook → revalidateTag
    ├── sitemap.ts, robots.ts, layout.tsx
    ├── products/[slug]/page.tsx   public pattern
    └── (dashboard)/users/         private prefetch + hydrate pattern
```

Two service examples are included on purpose: `products` is the public/SEO pattern, `users` is the authenticated pattern. Every other resource copies one of them.

---

## Rolling it out

Do not rewrite everything at once. The old axios instance can run alongside the new layer for as long as you need.

### Phase 1 — Stop the bleeding (half a day)

The Next 15 bugs are live defects. Ship these first, on their own.

1. Drop in `lib/api/config.ts`, `lib/api/errors.ts`, `lib/auth/session.ts`.
2. Replace `middleware.ts` wholesale.
3. Find every `cookies()` / `headers()` call and await it:
   ```bash
   grep -rn "cookies()\|headers()" src/ --include="*.ts" --include="*.tsx"
   ```
4. Delete `getClientToken` and every import of it. If something breaks, that code was reading a token it should never have had.

**Verify:** `x-store-id` is non-null inside a Server Component. Before this change it was always null.

### Phase 2 — The request core (one day)

5. Add `core.ts`, `endpoints.ts`, `server/context.ts`, `server/fetcher.ts`, `client/fetcher.ts`, the BFF route, and the auth routes.
6. **Edit `isSuccessEnvelope()` in `core.ts` to match your backend.** It is the only place in the codebase that defines success. Get it right here and every call site is correct.
7. Point login at `/api/auth/login` so the token lands in an httpOnly cookie.

**Verify:** `document.cookie` in DevTools shows no token. A `/api/bff/...` call still returns data.

### Phase 3 — Query layer (one day)

8. Add `query-client.ts`, `query-provider.tsx`, `mutation.ts`. Wrap the root layout.
9. Migrate `useGenericMutation` call sites to `useApiMutation`, converting keys from `["users"]` to `userKeys.lists()`.

### Phase 4 — Resource by resource (ongoing)

For each resource, in order of traffic:

- `<r>.types.ts` → `<r>.keys.ts` → `<r>.server.ts` → `<r>.client.ts`
- Public data goes in `publicFetch` with a `revalidate` and tags. Private goes in `privateFetch`.
- Delete the old `*.api.ts` / `*.hooks.ts` pair once nothing imports it.

Convert highest-traffic public pages first — that is where the caching win shows up.

### Phase 5 — SEO (half a day)

10. `baseMetadata` in the root layout, `metadataBase` set.
11. `generateMetadata` on every public route, with a canonical.
12. `app/sitemap.ts`, `app/robots.ts`, JSON-LD on product and article pages.
13. Wire the `/api/revalidate` webhook from your backend's publish flow.

---

## Verifying it worked

```bash
# 1. Are public pages actually static?
npm run build
# Look for ● (SSG) or ISR on /products/[slug]. An ƒ means something in
# that path touched cookies() or headers() and you lost the cache.

# 2. Is hydration real?
# Load /dashboard/users with the Network tab open. There must be NO request
# for the user list on mount — the data came down inside the HTML.

# 3. Is the token invisible?
document.cookie   // must not contain the session token

# 4. Does request memoization work?
# A page calling getProduct() in both generateMetadata and the component
# should produce ONE upstream call, not two.

# 5. Does tag invalidation work?
curl -X POST https://yoursite.com/api/revalidate \
  -H "x-revalidate-secret: $REVALIDATE_SECRET" \
  -H "content-type: application/json" \
  -d '{"tags":["product:some-slug"]}'
```

---

## Things people get wrong after adopting this

- **Adding `cookies()` "just for a feature flag" on a public page.** The route silently goes dynamic. Check the build output after any change to a public route.
- **Caching a `privateFetch` response.** Never. One shared cache entry across users is a data breach, not a bug.
- **Inventing a query key inline** instead of using the factory. Within a week the prefetch and the hook disagree again. Lint rule worth adding: no array literal passed directly as `queryKey`.
- **Catching errors in the service layer.** Let `ApiError` throw. Server Components route it to `error.tsx`, TanStack routes it to `error`, and the UI calls `toUserMessage`. Swallowing it at the service layer is what produced the original `try { ... } catch { return null }`.
- **Putting `NEXT_PUBLIC_` on the API origin.** Then the upstream is in the bundle and the BFF is pointless.

---

## Dependencies

```bash
npm i @tanstack/react-query
npm i -D @tanstack/react-query-devtools server-only
```

`axios`, `cookies-next` and `js-cookie` can all be removed once Phase 4 finishes.

---

## Honest scoring

| Area | Before | After |
|---|---|---|
| Next 15 compatibility | broken | correct |
| SSR / hydration | broken | correct |
| Caching + ISR | none | tag-based, targeted |
| SEO | absent | metadata, canonicals, sitemap, JSON-LD |
| Security | token readable, tenant spoofable | httpOnly + BFF, host-derived tenant |
| Type safety | `any` throughout | generic end to end |
| Consistency | drift between call sites | enforced by shared keys and types |

Two things this does **not** give you, and you should decide about them deliberately:

- **Runtime response validation.** Add `zod` and parse in `unwrap()` if your backend contract is not stable. It costs a few ms per request and catches an entire class of production bug.
- **Token refresh.** There is no refresh flow here. If your access tokens are short-lived, add a refresh attempt inside the BFF route on a 401 — that is the correct place for it, since it is the only code that holds the cookie.



# API Architecture & Implementation Guide

This document outlines the API architecture adapted for a **single-repo Next.js application** (web-only). It incorporates best practices for server-side prefetching, secure token management, middleware ID injection, consistent enumerations, error handling, and robust TanStack integrations.

## 1. Directory Structure (Web-Only)

Since this is not a monorepo, everything will reside inside your Next.js `src` directory under `services/` or `lib/`.

```text
src/
└── services/
    ├── api/
    │   ├── auth/
    │   │   ├── auth.api.ts      # API actions (fetch/axios calls)
    │   │   └── auth.hooks.ts    # Tanstack Query Hooks
    │   ├── product/
    │   │   ├── product.api.ts
    │   │   └── product.hooks.ts
    ├── shared/
    │   ├── apiEndpoints.ts      # Enums for URLs & Methods
    │   ├── apiHandler.ts        # Core Axios/Fetch wrapper
    │   ├── errorService.ts      # Standardized error handling & toasts
    │   ├── interceptors.ts      # Axios interceptors (Auth & Error parsing)
    │   └── http.ts              # Axios instance configuration
    ├── hooks/
    │   └── useGenericMutation.ts # Reusable mutation wrapper
    └── utils/
        ├── action.ts            # Generic API wrapper (createServerAction)
        └── authUtils.ts         # Token extractors (Server & Client)
```

## 2. Enums for Consistency

To maintain absolute consistency, avoid hardcoding URLs or HTTP methods. Maintain strict enumerations for everything.

### `shared/apiEndpoints.ts`
```typescript
export enum MethodTypesEnum {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export enum API_ENDPOINTS {
  // Auth
  USER_LOGIN = "/v1/auth/user/login",
  USER_SIGNUP = "/v1/auth/user/signup",
  
  // Users
  GET_ALL_USERS = "/v1/user/get-all-users",
  CREATE_USER = "/v1/user/create-user",
  UPDATE_USER = "/v1/auth/user/update-user",
  
  // Products
  GET_PRODUCTS = "/v1/products",
}
```

## 3. Secure Token Management & Server-Side Execution

Instead of `js-cookie` (client-side), store the token securely in **HTTP-only cookies**. 

### `utils/authUtils.ts` (Next.js App Router)
```typescript
import { cookies } from "next/headers";
import { getCookie } from "cookies-next"; 

export const getServerToken = () => {
  try {
    const cookieStore = cookies();
    return cookieStore.get("UBT_USER_TOKEN")?.value;
  } catch (error) {
    return null; 
  }
};

export const getClientToken = () => {
  return getCookie("UBT_USER_TOKEN");
};
```

## 4. Axios Setup & Interceptors

For robust error handling and token injection, configure Axios interceptors. This ensures every request—client or server—automatically picks up the right tokens and gracefully catches errors.

### `shared/interceptors.ts`
```typescript
import axios from "axios";
import { getServerToken, getClientToken } from "../utils/authUtils";
import { ErrorService } from "./errorService";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Request Interceptor
http.interceptors.request.use(async (config) => {
  const isServer = typeof window === "undefined";
  const token = isServer ? getServerToken() : getClientToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Attach middleware injected headers if on server
  if (isServer) {
    const { headers } = await import("next/headers");
    const storeId = headers().get("x-store-id");
    if (storeId) config.headers["x-store-id"] = storeId;
  }

  return config;
});

// Response Interceptor
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const isServer = typeof window === "undefined";
    
    // Global Error Handling
    if (!isServer && error.response) {
      if (error.response.status === 401) {
        ErrorService.sendErrorMessage("Session expired. Please log in.");
        // optionally trigger logout
      }
    }
    
    return Promise.reject(error);
  }
);
```

## 5. Middleware for Dynamic IDs
Pass multiple IDs (e.g., Tenant ID, Store ID) via middleware.

### `middleware.ts` (Next.js Root)
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  const storeId = request.cookies.get('store-id')?.value || 'default-store';
  const tenantId = request.headers.get('x-tenant-id') || 'default-tenant';

  response.headers.set('x-store-id', storeId);
  response.headers.set('x-tenant-id', tenantId);

  return response;
}
```

## 6. TanStack Query: Mutations, Queries & Prefetching

### Naming Conventions
- **API Actions**: `[actionName]Action`
- **Query Hooks**: `use[QueryName]`
- **Mutation Hooks**: `use[ActionName]Mutation`

### Generic Mutation (`hooks/useGenericMutation.ts`)
For `POST`, `PUT`, `PATCH`, `DELETE` operations, rely on `useGenericMutation` to keep your code DRY.

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorService } from "../shared/errorService";

export function useGenericMutation<T>(
  mutationFn: (...args: any[]) => Promise<any>,
  queryKeysToInvalidate: string[]
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (response) => {
      if (response.code) {
        // Automatically refresh queries dependent on this data
        queryClient.invalidateQueries({ queryKey: queryKeysToInvalidate });
      } else {
        ErrorService.handleResponse(response);
        throw response;
      }
    },
    onError: (error) => {
      // Handled by the interceptor or ErrorService, but can add custom UI logic here
      ErrorService.handleError(error);
    }
  });
}
```

### Hook Implementations (`auth.hooks.ts`)
```typescript
import { useQuery } from "@tanstack/react-query";
import { useGenericMutation } from "../hooks/useGenericMutation";
import { getAllUsersAction, createUserAction } from "./auth.api";

// GET - Query
export const useGetAllUsers = (params: any) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const response = await getAllUsersAction(params);
      if (!response.code) throw response;
      return response.result;
    },
  });
};

// POST/PUT/DELETE - Mutation
export const useCreateUserMutation = () => {
  // Pass the action and the query key to invalidate ("users")
  return useGenericMutation(createUserAction, ["users"]);
};
```

### Server-Side Prefetching Example (`page.tsx`)
```tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getAllUsersAction } from '@/services/api/auth/auth.api';

export default async function UsersPage() {
  const queryClient = new QueryClient();

  // Prefetch on the server (Uses HTTP-only cookies automatically via Interceptors)
  await queryClient.prefetchQuery({
    queryKey: ['users'],
    queryFn: () => getAllUsersAction({ /* params */ }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersClientComponent />
    </HydrationBoundary>
  );
}
```

## 7. Comprehensive Error Handling (`ErrorService`)
The `ErrorService` acts as the bridge between raw API responses and User-facing UI.

1. **Server Side (`isServer = true`)**: Suppress all toast notifications. Structure the error and return it so Server Components can decide to render Error boundaries or fallback UI.
2. **Client Side (`isServer = false`)**: Invoke `react-toastify` for validation errors (`400`), unauthorized (`401`), and server faults (`500`). 
3. **Interceptors**: Use the Axios response interceptor for catastrophic global errors (like a forcibly expired token), leaving `ErrorService` to handle domain-level messaging returned by your API structure (e.g. `response.data.message`).
