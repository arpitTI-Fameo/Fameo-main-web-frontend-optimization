import 'server-only';
// lib/api/server/origins.js
// The three upstream origins. Server-only, by construction.
//
// These used to live in lib/api/config.js alongside BFF_BASE. config.js is
// imported by client components, so every origin in it was inlined into the
// client bundle by Next — which is exactly the failure mode CLAUDE.md calls
// out: "Putting NEXT_PUBLIC_ on the API origin. Then the upstream is in the
// bundle and the BFF is pointless."
//
// Splitting them into a `server-only` module makes that leak a BUILD ERROR
// rather than a convention nobody remembers. If a client component ever
// imports this file, the build fails with a clear message.
//
// Set these in the environment WITHOUT a NEXT_PUBLIC_ prefix:
//   API_ORIGIN, PRODUCTS_ORIGIN, APP_ORIGIN

const trim = (v) => v.replace(/\/+$/, '');

/** Main API (auth, community, orders, resources…). */
export const API_ORIGIN = trim(process.env.API_ORIGIN || 'http://localhost:5000');

/** Products backend. Shares JWT_SECRET with the main API. */
export const PRODUCTS_ORIGIN = trim(process.env.PRODUCTS_ORIGIN || 'http://localhost:5001/api');

/** The "app" backend the registration flow talks to. */
export const APP_ORIGIN = trim(process.env.APP_ORIGIN || 'https://uat-api.fameo.info');

/**
 * AI Support Bot backend (RAG over the Fameo knowledge base).
 *
 * Deliberately NOT in the fail-fast list below. The other three are load-
 * bearing — the site cannot serve a page without them, so pointing at
 * localhost in production is a bug worth refusing to boot over. The assistant
 * is one optional widget: if this is unset the widget degrades to an error
 * message in its own bubble and every other page is unaffected. Hard-failing
 * the whole server over it would be the larger outage.
 *
 * Set ASSISTANT_ORIGIN (no NEXT_PUBLIC_ prefix) to the deployed bot.
 */
export const ASSISTANT_ORIGIN = trim(
  process.env.ASSISTANT_ORIGIN || 'https://cc71-14-99-74-6.ngrok-free.app'
);

// Fail loudly in production rather than silently pointing at localhost.
//
// Deliberately skipped during `next build`. A build runs with NODE_ENV
// =production but WITHOUT the deployment's runtime secrets, so throwing here
// would make a correctly-configured deploy fail to build. The check still runs
// on the server that actually serves traffic, which is where it matters.
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

if (process.env.NODE_ENV === 'production' && !isBuildPhase) {
  const missing = [
    !process.env.API_ORIGIN && 'API_ORIGIN',
    !process.env.PRODUCTS_ORIGIN && 'PRODUCTS_ORIGIN',
    !process.env.APP_ORIGIN && 'APP_ORIGIN',
  ].filter(Boolean);

  if (missing.length) {
    throw new Error(
      `Missing upstream origin env var(s): ${missing.join(', ')}. ` +
      'Requests would fall back to a development default. Refusing to start.'
    );
  }
}
