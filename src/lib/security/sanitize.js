// lib/security/sanitize.js
// One sanitizer for every dangerouslySetInnerHTML in the app.
//
// SAST H-3 / H-4. Two sinks rendered database-sourced HTML with no sanitization
// at all:
//
//   CommunityTopbar.js:398   notification bodies from the backend
//   admin/content/[id]/edit   topic bodies in the editor preview
//
// The admin one is the worse of the pair: it delivers stored XSS to whoever is
// most privileged, in the panel where their session token lives. A single
// poisoned topic body executes in every admin's browser that opens the editor.
//
// `isomorphic-dompurify` is used rather than plain `dompurify` because these
// components render during SSR as well as in the browser, and bare DOMPurify
// needs a DOM. Install it:  npm i isomorphic-dompurify
//
// USAGE — never call DOMPurify directly at a call site; go through these so the
// allowlists stay in one place:
//
//   import { sanitizeRichText } from '@/lib/security/sanitize';
//   <div dangerouslySetInnerHTML={{ __html: sanitizeRichText(topic.body) }} />

import DOMPurify from 'isomorphic-dompurify';

// Any anchor that opens a new tab gets rel="noopener noreferrer".
//
// Without it the opened page receives a `window.opener` handle back to ours and
// can navigate it somewhere else — reverse tabnabbing. Current browsers imply
// noopener for target=_blank, but this content is attacker-influenced (topic
// bodies, notification text) and the guarantee should not depend on which
// browser the reader happens to use.
//
// Registered once at module load, not per call.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('target')) {
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

// Rich text: what a content editor legitimately produces. No <script>, no
// <iframe>, no <style>, no event handlers, no <form>.
const RICH_TEXT = {
  ALLOWED_TAGS: [
    'p', 'br', 'hr', 'span', 'div',
    'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'small', 'sub', 'sup',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'src', 'alt', 'width', 'height', 'colspan', 'rowspan'],
  // Blocks javascript: and data: URLs in href/src.
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|\/|#)/i,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'link', 'base'],
  FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick', 'onmouseover', 'formaction'],
};

// Notifications: short inline messages. Deliberately much tighter than rich
// text — a notification has no business containing images, tables or links to
// arbitrary markup.
const INLINE = {
  ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'span', 'br', 'a'],
  ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|\/|#)/i,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'img'],
  FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick'],
};

/** Editor-authored bodies: topics, articles, long-form content. */
export const sanitizeRichText = (html) =>
  DOMPurify.sanitize(String(html ?? ''), RICH_TEXT);

/** Short inline messages: notifications, toasts, banners. */
export const sanitizeInline = (html) =>
  DOMPurify.sanitize(String(html ?? ''), INLINE);

/**
 * Strip every tag, keeping only text.
 *
 * For content that was never meant to be HTML in the first place. Prefer
 * rendering as plain JSX where you can — reach for this only when a string has
 * to pass through an innerHTML sink you cannot restructure.
 */
export const sanitizeText = (html) =>
  DOMPurify.sanitize(String(html ?? ''), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

export default { sanitizeRichText, sanitizeInline, sanitizeText };
