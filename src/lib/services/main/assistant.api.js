'use client';
// services/main/assistant.api.js
// The AI Support Bot service: every assistant HTTP call in one place.
//
// Separate from chat.api.js on purpose. That file is the community chat on the
// main API (rooms, DMs, uploads); this is a different upstream with a
// different contract behind a different BFF. Merging them would mean one
// module whose calls silently go to two backends.
//
// This one throws ApiError rather than returning createServerAction's
// { code, result } envelope, which is what CLAUDE.md §2a asks for: the widget
// renders failures in a bubble via toUserMessage(err), and that function needs
// a real ApiError to tell a timeout from a rate limit. The envelope flattens
// both into an opaque object and the UI can only say "something went wrong".

import { clientFetch } from '@/lib/api/client/fetcher';
import { BFF_ASSISTANT_BASE } from '@/lib/api/config';
import { assistantEndpoints } from '@/lib/api/endpoints';

/**
 * A retrieval pass plus an LLM completion. Measured at 20–40s against the
 * current deployment, so the shared 15s default would abort a request that was
 * going to answer. Named rather than inlined because the BFF route's
 * maxDuration has to stay above it.
 */
export const ASSISTANT_TIMEOUT = 60_000;

/**
 * Ask the support bot a question.
 *
 * @param {{ query: string }} payload
 * @returns {Promise<{
 *   answer: string,
 *   sources: Array<{ source_id: string, score: number, metadata: {
 *     document_name: string, page: number, section: string | null } }>,
 *   confidence: { level: 'HIGH'|'MEDIUM'|'LOW', score: number },
 *   usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number },
 * }>}
 * @throws {import('@/lib/api/errors').ApiError}
 */
export const askAssistantAction = ({ query }) =>
  clientFetch(assistantEndpoints.chat(), {
    method: 'POST',
    body: JSON.stringify({ query }),
    base: BFF_ASSISTANT_BASE,
    timeout: ASSISTANT_TIMEOUT,
  });
