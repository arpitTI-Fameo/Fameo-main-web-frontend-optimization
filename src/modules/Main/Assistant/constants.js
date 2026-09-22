// modules/Main/Assistant/constants.js
// Values scoped to the support widget. Nothing here is used by another
// feature, which is why it is not in src/constants/.

/** How the bot introduces itself. Mirrors the "<name> from <org>" header line. */
export const BOT = {
  name: 'Fameo Assistant',
  org: 'from Support',
  greeting:
    'Hello there — ask me anything about Fameo and I will answer from our help centre.',
};

/**
 * Starter questions, shown only while the transcript is empty.
 *
 * An empty chat box is the hardest thing in the widget to answer: people do
 * not know what it knows. These are three things the knowledge base actually
 * covers, so the first answer is a good one.
 */
export const STARTER_PROMPTS = [
  'How do I reset my password?',
  'How do I start earning on Fameo?',
  'My payment is showing as pending — why?',
];

/** Upstream rejects nothing, but an essay is a slow, expensive way to get a bad answer. */
export const MAX_QUERY_LENGTH = 500;

/** Enough to show where an answer came from; the API returns ten, most of them noise. */
export const MAX_SOURCES_SHOWN = 3;

/** Confidence badge palette, keyed by the level the API returns. */
export const CONFIDENCE_TONE = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

/** Shown in a bot bubble when the call fails and there is nothing to render. */
export const FALLBACK_ERROR =
  'I could not reach the help centre just now. Please try again in a moment.';
