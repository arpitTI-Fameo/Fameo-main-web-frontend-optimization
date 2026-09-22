// app/api/bff-assistant/[...path]/route.js
// BFF for the AI Support Bot backend.
//
// It carries NO credential. The bot answers from a public knowledge base and
// authenticates nothing, so forwarding the session token would hand a user's
// credential to a third service for no reason — `credential: 'none'` makes
// that explicit rather than leaving it to a default.
//
// It still goes through the BFF rather than being called from the browser,
// for the two reasons every other upstream does: the origin stays out of the
// client bundle, and the rate limiter sits in front of it. The second one is
// load-bearing here — every call downstream is a paid LLM completion, so an
// open endpoint is someone else's bill.

import { ASSISTANT_ORIGIN } from '@/lib/api/server/origins';
import { createProxy } from '@/lib/api/server/proxy';
import { LIMITS } from '@/lib/api/server/rate-limit';

const proxy = createProxy(ASSISTANT_ORIGIN, {
  credential: 'none',
  rateLimit: LIMITS.assistant,
  // Its own counter. Without this the assistant's tight limit would be
  // applied to the budget every other BFF route spends from, and a page
  // that had already made 20 ordinary API calls would be cut off.
  bucket: 'assistant',
  // ngrok free tunnels serve an HTML interstitial instead of the API response
  // when the request looks like a browser — and this one does, because the
  // proxy forwards the caller's User-Agent. Without this the client gets a
  // page of markup where it expected JSON. Harmless against a non-ngrok
  // origin, which simply ignores an unknown header.
  headers: { 'ngrok-skip-browser-warning': 'true' },
});

export const POST = proxy;
export const GET = proxy;

export const dynamic = 'force-dynamic';

// A RAG answer is a retrieval plus an LLM completion and routinely takes 20–40
// seconds. The platform default of 15s would cut off a request that was going
// to succeed, so the function is given room to finish.
export const maxDuration = 60;
