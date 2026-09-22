// modules/Main/Assistant/helpers.js
// Pure functions scoped to the support widget. No React, no network.
//
// The answer comes back as light Markdown — paragraphs, `* ` bullets,
// `**bold**`, and inline `[Source: Doc, Page 1]` citations. It is rendered by
// turning it into a DESCRIPTION of the content, which index.jsx maps to real
// elements. No HTML string is ever built, so there is nothing for
// dangerouslySetInnerHTML to do and no sanitiser to get wrong — the model's
// output cannot become markup.

import { MAX_SOURCES_SHOWN } from './constants';

const BULLET = /^\s*[*-]\s+/;
const CITATION = /\[Source:\s*([^\]]+)\]/g;
const BOLD = /\*\*([^*]+)\*\*/g;

/**
 * Split one line into text / bold / citation runs.
 *
 * @param {string} line
 * @returns {Array<{ type: 'text'|'bold'|'cite', value: string }>}
 */
export function parseInline(line) {
  const runs = [];

  // Citations first: they are the outer syntax and may contain no markup.
  let last = 0;
  const pushText = (chunk) => {
    if (!chunk) return;
    let cursor = 0;
    for (const m of chunk.matchAll(BOLD)) {
      if (m.index > cursor) runs.push({ type: 'text', value: chunk.slice(cursor, m.index) });
      runs.push({ type: 'bold', value: m[1] });
      cursor = m.index + m[0].length;
    }
    if (cursor < chunk.length) runs.push({ type: 'text', value: chunk.slice(cursor) });
  };

  for (const m of line.matchAll(CITATION)) {
    pushText(line.slice(last, m.index));
    runs.push({ type: 'cite', value: m[1].trim() });
    last = m.index + m[0].length;
  }
  pushText(line.slice(last));

  return runs;
}

/**
 * Turn an answer into an ordered list of blocks.
 *
 * Consecutive bullet lines collapse into one list, so `* a\n* b` renders as a
 * two-item list rather than two one-item lists with a gap between them.
 *
 * @param {string} answer
 * @returns {Array<{ type: 'p', runs: any[] } | { type: 'ul', items: any[][] }>}
 */
export function parseAnswer(answer) {
  if (typeof answer !== 'string' || !answer.trim()) return [];

  const blocks = [];
  for (const raw of answer.split('\n')) {
    const line = raw.trim();
    if (!line) continue;

    if (BULLET.test(line)) {
      const runs = parseInline(line.replace(BULLET, ''));
      const tail = blocks[blocks.length - 1];
      if (tail?.type === 'ul') tail.items.push(runs);
      else blocks.push({ type: 'ul', items: [runs] });
    } else {
      blocks.push({ type: 'p', runs: parseInline(line) });
    }
  }
  return blocks;
}

/**
 * One readable line per source.
 *
 * `section` is often null, and sometimes a fragment of a page header like
 * "FAMEO\nP" — a newline inside a label breaks the layout, so it is flattened
 * and dropped when it is too short to mean anything.
 */
export function sourceLabel(source) {
  const meta = source?.metadata || {};
  const parts = [meta.document_name || 'Knowledge base'];
  if (meta.page) parts.push(`p.${meta.page}`);

  const section = typeof meta.section === 'string'
    ? meta.section.replace(/\s+/g, ' ').trim()
    : '';
  if (section.length > 4) parts.push(section);

  return parts.join(' · ');
}

/**
 * The top few distinct sources.
 *
 * The API returns ten, ranked, and several routinely point at the same page of
 * the same document — listing those verbatim reads as though the answer had
 * three separate citations when it has one.
 */
export function topSources(sources) {
  if (!Array.isArray(sources)) return [];

  const seen = new Set();
  const out = [];
  for (const source of sources) {
    const meta = source?.metadata || {};
    const key = `${meta.document_name || ''}#${meta.page ?? ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(source);
    if (out.length === MAX_SOURCES_SHOWN) break;
  }
  return out;
}

/** Monotonic id for React keys. Message text is not unique — two "hi"s collide. */
let seq = 0;
export const nextMessageId = () => {
  seq += 1;
  return `m${seq}`;
};
