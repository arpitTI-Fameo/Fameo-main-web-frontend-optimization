# API Architecture Migration Guide

> Moved here from `CLAUDE.md` when the agent rules took that file over.
> This is the REFERENCE for how the API layer is built. `CLAUDE.md` links to it.

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



