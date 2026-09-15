# Agent rules — Fameo web (Next.js 16, plain JavaScript / JSX, no TypeScript)

Read this file fully. It is short on purpose. Follow it literally.

---

## 0. Start of every session

1. Read `docs/CODEMAP.md`. It lists every exported constant, util, hook,
   service and component in this repo, with its import path.
2. Do **not** browse the repo "to see what's there." The codemap is that answer.
3. If the codemap header timestamp looks old, run `npm run codemap`
   and read the fresh one. Never guess at what exists.

Reference docs, read only when the task touches them:

- `docs/API-ARCHITECTURE.md` — how the API layer is built and why.
- `docs/API-ARCHITECTURE-SUPERSEDED.md` — kept as a record. Do not follow it.

---

## 1. Never create what already exists

Before writing **any** new constant, helper, hook, service function or component:

- Search `docs/CODEMAP.md` for the name **and its synonyms**.
  `ROLES` → also check `USER_ROLES`, `ROLE_TYPES`, `ACCESS_LEVELS`, `roles`.
- Search by **value**, not only by name:
  `rg -n "'admin'" src/constants/ src/modules/ src/utils/`
- Search by **shape**: a `formatDate` may exist as `toDisplayDate`,
  `dateLabel`, or live inside a component file.

Then:

| Result | Action |
| --- | --- |
| Exact match exists | Import it. Do not re-declare, re-export, or "copy for clarity". |
| Close match exists | Extend the existing one. Ask before forking it. |
| Genuinely nothing | Create it — in the canonical home from §2. |

**Proof-of-search rule:** you may not introduce a new shared value without first
stating, in one line, the search you ran and what it returned. Example:

> Searched CODEMAP + `rg "STATUS" src/constants/` → no match. Creating `src/constants/order.js`.

No proof line = do not create the value. Reuse or ask instead.

---

## 2. Canonical homes — nothing goes anywhere else

Paths are real. The `@/` alias maps to `src/`.

```
src/constants/            shared literal values, enums, config maps
src/utils/                pure functions, no React, no network
src/store/                Zustand client state
src/providers/            React context wiring

src/lib/api/              request core, endpoints, errors, schemas
src/lib/api/client/       browser transport (clientFetch) — BROWSER ONLY
src/lib/api/server/       origins, BFF proxy, fetchers, rate limit — SERVER ONLY
src/lib/auth/             session cookies, gated-route lists
src/lib/security/         JWT verify, sanitizer, API guards, safe redirect
src/lib/query/            TanStack query client + useApiMutation
src/lib/seo/              metadata builder, JSON-LD
src/lib/hooks/main/       React hooks for the creator app
src/lib/hooks/admin/      React hooks for the admin panel
src/lib/hooks/custome/    cross-cutting hooks (sic — existing spelling)
src/lib/services/<domain>/ ALL network calls

src/components/ui/        generic presentational primitives
src/components/Layout/    page shell, nav, wrappers
src/components/admin/     shared admin widgets
src/components/           shared composed components

src/modules/Main/<Feature>/    creator-app features
src/modules/Admin/<Feature>/   admin-panel features
src/modules/Auth/<Feature>/    login / register / OTP

src/app/                  routing, thin. Composition only, no business logic.
```

Inside a module folder the house convention is:

```
index.jsx      the component
styles.js      exports S or CSS (a local style object — never promote these)
constants.js   values scoped to this feature only
helpers.js     pure functions scoped to this feature only
icons/         inline SVG components
```

Hard rules:

- A literal used in **two or more** files belongs in `src/constants/`. Never inline it twice.
- `modules/Main/X` must not import from `modules/Admin/Y`, and no module may import
  from a sibling module. If both need it, it is shared — promote it to
  `src/components/`, `src/utils/`, or `src/constants/`.
- No business logic in `src/app/`. **No `fetch` outside `src/lib/services/`.**
- Import shared code by its real path. Do not create new barrel (`index.js`)
  files unless explicitly asked.

---

## 2a. The API call chain — not negotiable

```
component → hook (lib/hooks/) → service (lib/services/) → transport → upstream
```

- A component never calls a service directly, and never calls `fetch`.
- The browser transport is `clientFetch` → `/api/bff/*`. It carries no token:
  the BFF attaches the session from an httpOnly cookie server-side and **strips
  any `Authorization` header the caller sends**.
- A Server Component uses `publicFetch` / `privateFetch` from
  `@/lib/api/server/fetcher`, or a `*.server.js` service. It must **never** call
  `clientFetch` — that would make the server issue an HTTP request to itself.
- URLs live in `@/lib/api/endpoints` as functions. Never build one inline.
- Query keys come from a `*.keys.js` factory. Never write an array literal as a
  `queryKey`; a prefetch and a hook that disagree is silent dead hydration.
- Services **throw** `ApiError`. They never swallow. The UI calls
  `toUserMessage(err)`; route errors land in the nearest `error.js`.

Security invariants, enforced by `tests/architecture.test.js`:

- No token in `localStorage` / `sessionStorage`, ever. No `document.cookie` session writes.
- Upstream origins live only in `@/lib/api/server/origins` (marked `server-only`).
  Never put an API origin behind `NEXT_PUBLIC_`.
- `cookies()` returns a Promise — always `await` it. Only `@/lib/auth/session`
  touches the cookie store.
- Never navigate to a raw query-string value; use `safeRedirect`.

---

## 3. Scope discipline

- Do exactly the task asked. No opportunistic refactors, renames, or "small cleanups".
- **No UI or visual changes** under any circumstances unless the task is explicitly a UI task.
  No JSX markup changes, no `className`/`style` changes, no changed rendered output.
- If a required change falls outside the stated scope, stop and ask. Do not proceed.
- This is plain JS/JSX. Never add TypeScript, `.ts`/`.tsx` files, type annotations,
  or `tsc` commands. Verify with `npm run build` and `npm run lint`.
- This is **production code**. Migrate in small, verifiable batches. Never do a
  big-bang rename.

---

## 4. Token discipline

- Read the smallest thing that answers the question: codemap → `rg` with line numbers → single file.
- Never `cat` a whole file when you need one function. Never print a full directory tree.
- Never echo back a file you just edited. Show the diff only.
- Do not re-read a file you already read this session unless you changed it.
- Do not restate the plan before every step. Plan once, then execute.

---

## 5. Before you report done

- [ ] No new value duplicates one already in `docs/CODEMAP.md`
- [ ] Every file sits in its canonical home from §2
- [ ] No cross-`modules/` imports introduced
- [ ] No `fetch` outside `src/lib/services/`; no service called straight from a component
- [ ] No UI/visual change unless that was the task
- [ ] No TypeScript introduced
- [ ] `npm run codemap` re-run; its **Possible duplicates** section is
      no longer than before your change
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run test` passes
- [ ] `npm run build` passes

`npm run verify` runs lint + test + build in one go.
