'use client';
// lib/hooks/main/useAssistant.js
// React binding for the AI Support Bot.
//
// The transcript itself is NOT kept here. It is ephemeral per-visit UI state
// with no server counterpart to invalidate, so it lives in the widget's own
// useState — putting it in the query cache would mean inventing a cache key
// for something that is never refetched.

import { useApiMutation } from '@/lib/query/mutation';
import { askAssistantAction } from '@/lib/services';

// ── Keys ───────────────────────────────────────────────────────────────────
export const assistantKeys = {
  all: () => ['assistant'],
  ask: () => [...assistantKeys.all(), 'ask'],
};

/**
 * Ask the bot a question.
 *
 * No `invalidate`: the answer is not cached server state, so there is nothing
 * to refetch afterwards.
 *
 * `retry: false` is deliberate. The default would silently re-run a
 * 40-second LLM call, so a user who is already waiting waits twice as long
 * before being told it failed — and the second completion is billed too.
 */
export const useAssistantAskMutation = (opts = {}) => useApiMutation({
  mutationKey: assistantKeys.ask(),
  mutationFn: askAssistantAction,
  retry: false,
  ...opts,
});
