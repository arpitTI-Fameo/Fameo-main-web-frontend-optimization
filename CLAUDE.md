---
name: nextjs-folder-structure-fix
description: >
  Use whenever the user wants to reorganize, restructure, or clean up the
  folder/directory structure of a Next.js (JavaScript/JSX, no TypeScript)
  project — moving components between app/modules/components, splitting API
  calls into a services layer, separating hooks from fetch logic, or
  centralizing routes/endpoints. Trigger on a single symptom too (e.g. "hooks
  call fetch directly", "components are scattered", "API strings are
  hardcoded") — these are all folder-structure problems. PRODUCTION codebase: enforces zero
  visual/UI changes while allowing the functional code-splitting structure
  requires (e.g. extracting a fetch call into a service function). This is a
  multi-phase migration done step by step — always check the "Current active
  phase" section at the top of the skill body before touching anything, since
  later phases (services/hooks/api extraction, localization, auth cookie
  system, form-validation standardization) are explicitly deferred until the
  user says to move on.
---

# Next.js Folder Structure Fix (multi-phase, step by step)

This skill performs a **physical reorganization** of an existing Next.js **JavaScript** (no TypeScript — `.js`/`.jsx` files, no type-checking step) production codebase into the target architecture below, without changing anything the end user can see or how the app behaves. It is deliberately run **one phase at a time** — do not jump ahead to a later phase just because it's described below. Always re-confirm the current phase with the user before starting work in a new conversation, since the plan evolves.

## Current active phase: `components/` and `modules/` ONLY

**In scope right now:**
- Moving/regrouping files under `components/UI`, `components/Layout`, `components/Common`, and `modules/<Feature>/...` to match the target tree.
- Updating the import paths that break as a result of those moves.
- Fixing obviously-misplaced files — e.g. a generic `Button` currently sitting inside a feature folder moves to `components/UI/Button`; a feature-only component sitting in the shared `components/` folder moves into its `modules/<Feature>` folder.

**Explicitly OUT of scope right now (do not touch, even in passing):**
- `services/`, `api/`, `hooks/` — no extracting fetch/axios calls out of components yet. If a component you're moving happens to contain a raw `fetch`/`axios` call, **leave that call exactly as it is** and just relocate the file. Do not "fix" it as a drive-by.
- `constants/routes.js` / `constants/api-endpoints.js` — leave hardcoded strings alone for now, even if you spot them while moving a file.
- `app/` — no thinning out `page.jsx` files yet.
- `actions/`, `lib/`, `validations/`, `locales/` — not part of this phase.

This is a pure-relocation phase: move the file, fix the imports that reference its new location, change nothing else about its contents. That keeps every diff in this phase trivially reviewable (a file move + import path updates, nothing more) before the riskier functional-extraction phase (services/hooks) starts later.

## Golden rules (non-negotiable)

1. **Zero UI/visual changes.** No JSX markup changes, no className/style changes, no changed prop names on visual components, no changed rendered output. If a diff would change what's on screen, stop and ask — don't do it as part of this skill.
2. **Functional refactor is allowed later, but only once its phase is active.** Eventually, pulling an inline `axios.get(...)` out of a component/hook and into `services/api/*` will be in scope, because "hooks shouldn't know how HTTP works" is a structural rule — and when that phase starts, you must preserve the exact request (method, URL, params, headers, body) and response/error shape. **In the current `components`/`modules` phase, this does not apply** — see "Current active phase" above. Move files as-is; don't extract API calls yet.
3. **This is production code.** Never do a big-bang rename of everything. Migrate in small, verifiable batches (see Workflow), and leave the app buildable and working after every batch.
4. **Out of scope for this pass:** localization/i18n content, the HttpOnly-cookie auth rework, `createServerAction` abstraction internals, Formik/Yup standardization content, and building out the full `sendRequest` gateway's retry/logging policy. You may create the **folders and empty/pass-through files** for these (e.g. `lib/auth/`, `validations/`) so the tree matches the target, but do not implement their business logic unless the user explicitly asks — just move what already exists into the right place.

## Target architecture

```text
src/
├── app/                      # routing + server composition ONLY — thin
│   ├── (auth)/login/page.jsx
│   ├── (dashboard)/
│   │   ├── account/referrals/page.jsx
│   │   └── products/{page.jsx, [id]/page.jsx}
│   └── layout.jsx
│
├── modules/                  # feature UI, one folder per feature
│   ├── Login/{LoginForm, LoginHeader, LoginContainer}/index.jsx
│   ├── ProductDetail/{ProductDetailHero, ProductDetailAdditionalInfo,
│   │                   ProductDetailReviews, ProductDetailQuickLook}/
│   └── ProductListing/{Hero, Filters, ActionBar, Grid}/
│
├── components/                # GENUINELY reusable, not feature-specific
│   ├── UI/{Button, Input, Modal, Select, Table}/
│   ├── Layout/{Navbar, Footer, Sidebar, DashboardLayout, AuthLayout}/
│   └── Common/{EmptyState, ErrorState, LoadingState, Pagination}/
│
├── services/                  # API/business communication
│   ├── api/{api-client.js, api-server.js, request.js, endpoints.js, methods.js, types.js}
│   ├── auth/  ├── product/  ├── referral/  └── user/
│
├── hooks/                      # client-side data access (TanStack Query)
│   └── api/{useProducts.js, useProduct.js, useReferrals.js}
│
├── actions/                    # server actions
│   ├── auth/  ├── product/  └── referral/
│
├── lib/                        # framework/library infra
│   ├── tanstack/{query-client.js, hydration.js}
│   ├── auth/  └── i18n/
│
├── utils/                      # pure reusable utilities, grouped by purpose
│   ├── format/  ├── validation/  ├── api/  ├── date/  └── common/
│
├── validations/                # shared validation schemas
│   ├── auth/  ├── product/  └── referral/
│
├── constants/{routes.js, api-endpoints.js, ...}
├── types/{api/, auth/, product/}
└── locales/{en/, hi/, ...}
```

### Responsibility map (use this to decide where a file belongs)

| Folder | Responsibility | Must NOT contain |
|---|---|---|
| `app/` | route params, prefetch, calling actions, passing data to a module | large JSX, API strings, fetch calls, validation schemas, business logic |
| `modules/` | one feature's UI, composed from its own subcomponents | components used by 2+ unrelated features (→ `components/`) |
| `components/UI` | generic design-system pieces (Button, Modal...) | feature-specific logic |
| `components/Layout` | navbar/footer/sidebar/app shells | page content |
| `services/` | all HTTP calls, grouped by domain | React hooks, JSX |
| `hooks/` | TanStack Query wiring only — calls a service, returns query result | raw `fetch`/`axios` calls |
| `actions/` | server actions (`"use server"`) | client-only state |
| `lib/` | 3rd-party/infra wiring (query client, auth helpers) | feature logic |
| `utils/` | small pure functions, named by what they do, grouped by domain | grab-bag files like `helpers.js`, `misc.js` |
| `constants/` | routes, endpoint strings, enums | logic |
| `types/` (optional in JS) | shared JSDoc typedefs / PropTypes shapes, if the project uses them | runtime code |

If a file doesn't cleanly fit one row, flag it for the user instead of guessing.

## Workflow

### 1. Audit (read-only, no edits yet)
- Walk the existing `src/` (or equivalent) tree.
- Build a table: `current path → detected responsibility → target path`.
- Flag anything ambiguous (e.g. a component that's half-layout, half-feature; a hook that also renders JSX; a util that isn't pure).
- Note every raw `fetch(`, `axios.`, hardcoded route string (`"/account/..."`, `router.push("/...")`), and hardcoded API path — these are the functional-extraction candidates from rule #2.

### 2. Plan and confirm before moving anything
- Present the migration map to the user (old path → new path) grouped into batches (see order below).
- Call out explicitly which moves are "pure file relocation" vs. "relocation + functional extraction" (e.g. "this hook currently calls axios directly — I'll extract that into `services/product/get-products.js` and have the hook call the service instead, same request/response shape").
- Get a go-ahead before batch 1 if the project has no tests/CI safety net; otherwise proceed batch by batch, pausing only if something is ambiguous.

### 3. Establish a baseline
- Confirm git working tree is clean (or ask the user to commit/stash first) so every batch is a reviewable diff.
- Run whatever the project already uses — `next build`, `lint`, existing tests — and record it passes *before* touching anything, so regressions are attributable to this refactor.

### 4. Migrate in batches, smallest blast-radius first

**This phase's batches (do these now):**
1. `components/UI`, `components/Layout`, `components/Common` — move genuinely global/reused components out of feature folders and into the right shared bucket.
2. `modules/` — regroup each feature's components under its own `modules/<Feature>/...` folder, matching the target subtree.

Within each batch, move the pieces with the fewest inbound references first (e.g. a leaf presentational component before the container that wraps several of them), so each step's import fixes stay small and easy to verify.

**Future phases (do NOT start these until the user says so):**
3. `constants/` — centralize routes.js / api-endpoints.js.
4. `types/` — shared contracts.
5. `utils/` — pure functions, grouped by domain.
6. `services/api/` — the request/response gateway and endpoint definitions.
7. `services/<domain>/` — extract raw fetch/axios calls out of components and hooks into domain services (this is where golden rule #2's "functional extraction" applies).
8. `hooks/` — point hooks at the new services instead of calling HTTP directly.
9. `app/` — thin out page.jsx files, once the modules/actions they call already exist in their new homes.
10. `actions/`, `lib/`, `validations/` — move what already exists; create empty folders for what's planned but out of scope.

For each batch:
- Move files (preserve file contents for anything that's a pure relocation).
- Update every import path that referenced the old location (search the whole repo, not just obvious callers — barrel files, dynamic imports, and test files are easy to miss).
- For extraction steps, keep the diff minimal: same variable names and logic where possible, just relocated and wrapped in a named export.
- Re-run `next build` (and `lint`) after the batch. Fix breakage before moving to the next batch.
- Do a quick visual/behavioral sanity pass (or ask the user to) — nothing should render differently.
- Suggest a commit per batch so the user can bisect/revert easily.

### 5. Final verification checklist (for this phase)
- [ ] Build passes with no new errors (no type-checking step since this is a JS project — rely on build + lint + manual/test verification).
- [ ] Every moved file's imports resolve (no orphaned relative paths like `../../../components/...` pointing nowhere).
- [ ] Diff reviewed contains **no** changes to JSX structure, class names, or inline styles — only file location + import path updates.
- [ ] `components/` contains no feature-specific files; `modules/` contains no globally-reused primitives.
- [ ] Any raw `fetch`/`axios` calls inside moved files are untouched — same file contents, new location only.
- [ ] Nothing in `services/`, `hooks/`, `app/`, `constants/` was touched this phase.

Once this phase is fully verified and the user confirms, the next phase (`constants/` + `services/api/` + extracting fetch calls into services) can start — but only when they explicitly say to move on.

## What to do when something doesn't fit

If a file is genuinely both UI and structural (e.g., a component that calls `fetch` inline *and* has feature-specific markup), split the concerns:
- Extract the fetch into `services/`, have the component call a hook/service — this changes *how* data is fetched, not *what* is rendered.
- Leave the JSX exactly as-is, just relocated to its correct `modules/` or `components/` folder.

If you're not sure whether a change would alter visible output, don't make it — ask the user first. When in doubt, favor "move only" over "move + refactor."