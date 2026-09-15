// eslint.config.mjs — production lint policy
//
// Two tiers, on purpose:
//
//   ERROR  — things that are broken or will break. CI blocks on these, and the
//            count is kept at zero. Adding one should stop a merge.
//   WARN   — existing debt and stylistic issues. Visible, tracked by
//            `npm run lint:report`, but not a gate. Today that is ~550 findings
//            across the codebase; erroring on them would make the gate useless
//            because nobody can act on it in one pass.
//
// The rule that matters most here is `no-undef`. This is a JavaScript codebase
// with no type checker, and eslint-config-next does NOT enable it — so a typo'd
// or unimported identifier was only discovered when the page crashed at
// runtime. Enabling it found four real crashes on the first run.

import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import globals from 'globals';

// eslint-config-next registers react, react-hooks, import, jsx-a11y and
// @next/next inside its OWN config objects. In flat config a rule can only be
// configured in a block that also declares its plugin, so collect them here and
// re-declare them on the override block below. This avoids adding the plugins
// as direct dependencies and keeps versions in lockstep with Next.
const nextPlugins = Object.assign({}, ...nextVitals.map((b) => b.plugins || {}));

export default defineConfig([
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'dist/**',
    'coverage/**',
    'node_modules/**',
    'public/**',
    'next-env.d.ts',
    '*.min.js',
  ]),

  ...nextVitals,

  {
    name: 'fameo/language',
    files: ['**/*.{js,jsx,mjs,cjs}'],
    plugins: nextPlugins,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      // Required for no-undef to be usable: without these every `window`,
      // `document`, `process` and `fetch` would be reported.
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2024,
      },
    },
    // eslint-plugin-react cannot find the React version in a project that has
    // no JSX pragma config, and warns on every run. Pinning it silences the
    // noise and makes version-aware rules accurate instead of guessing.
    settings: {
      react: { version: 'detect' },
    },
    linterOptions: {
      // A disable comment that no longer suppresses anything is itself a
      // finding — it hides the rule silently re-firing later.
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      // ── Tier 1: correctness. Keep at zero. ──────────────────────────────
      'no-undef': 'error',
      'no-const-assign': 'error',
      'no-dupe-args': 'error',
      'no-dupe-keys': 'error',
      'no-dupe-class-members': 'error',
      'no-duplicate-case': 'error',
      'no-func-assign': 'error',
      'no-import-assign': 'error',
      'no-obj-calls': 'error',
      'no-self-assign': 'error',
      'no-self-compare': 'error',
      'no-sparse-arrays': 'error',
      'no-unreachable': 'error',
      'no-unsafe-negation': 'error',
      'no-unsafe-optional-chaining': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',
      'no-cond-assign': ['error', 'always'],
      'no-fallthrough': 'error',
      // Duplicate imports of the same module drift apart during refactors.
      'no-duplicate-imports': 'error',

      // React correctness that is a real bug, not a preference.
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-key': 'error',
      'react/no-direct-mutation-state': 'error',
      'react-hooks/rules-of-hooks': 'error',

      // Client-side navigation: an <a> to an internal route does a full reload.
      '@next/next/no-html-link-for-pages': 'error',

      // ── Tier 2: debt. Visible, not blocking. ────────────────────────────
      // Unused code. ~460 findings today, largely imports left behind by the
      // services/hooks restructure. Worth cleaning, not worth blocking on.
      'no-unused-vars': 'off',

      // React Compiler-era rules from eslint-plugin-react-hooks v6. They flag
      // legitimate patterns in pre-existing code (setState in an effect, etc.)
      // and reworking ~80 sites is its own project.
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/globals': 'off',

      // Cosmetic / migration-sized.
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'off',
      'import/no-anonymous-default-export': 'off',

      // ── Hygiene ─────────────────────────────────────────────────────────
      'no-debugger': 'error',
      // console.error/warn are used deliberately for diagnostics in this
      // codebase; only bare console.log is discouraged.
      'no-console': 'off',
      eqeqeq: ['warn', 'smart'],
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },

  {
    // Server-only code: Node globals, no browser ones. Catches a stray
    // `window` or `localStorage` in a route handler or server fetcher, which
    // throws at request time rather than at build time.
    //
    // Flat config MERGES languageOptions.globals with earlier blocks instead of
    // replacing them, so the browser set has to be switched off explicitly —
    // listing only the Node globals here would silently leave `window` defined.
    // globals.node is spread afterwards so genuinely shared names (fetch,
    // console, URL, Response, AbortController…) stay available.
    name: 'fameo/server',
    files: [
      'src/app/api/**/*.{js,jsx}',
      'src/lib/api/server/**/*.js',
      'src/lib/auth/**/*.js',
      'src/middleware.js',
    ],
    languageOptions: {
      globals: {
        ...Object.fromEntries(Object.keys(globals.browser).map((k) => [k, 'off'])),
        ...globals.node,
        ...globals.es2024,
      },
    },
  },

  {
    // Config files are CommonJS-ish tooling, not app code.
    name: 'fameo/tooling',
    files: ['*.config.{js,mjs,cjs}', 'scripts/**/*.{js,mjs,cjs}'],
    rules: {
      'no-console': 'off',
      'import/no-anonymous-default-export': 'off',
    },
  },
]);
