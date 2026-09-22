'use client';
// modules/Main/Assistant/index.jsx
// FAMEO — AI support widget.
//
// A launcher pinned bottom-right that opens a chat panel over the page. It
// asks the RAG support bot one question at a time and renders the answer with
// the knowledge-base pages it was drawn from.
//
// The transcript is per-visit and lives here. It is deliberately not persisted:
// answers are generated, so a restored transcript would show yesterday's
// wording as though it were current, and nothing in it is worth the storage.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAssistantAskMutation } from '@/lib/hooks/main/useAssistant';
import { toUserMessage } from '@/lib/api/errors';

import { BOT, STARTER_PROMPTS, MAX_QUERY_LENGTH, CONFIDENCE_TONE, FALLBACK_ERROR } from './constants';
import { parseAnswer, sourceLabel, topSources, nextMessageId } from './helpers';
import { S } from './styles';
import { BotAvatar, ChatIcon, ChevronIcon, CloseIcon, MenuIcon, SendIcon } from './icons';

/* ── Rendered answer ──────────────────────────────────────────────────────
   The model's reply is Markdown-ish. It is parsed into a block description
   and mapped to elements here, so the text can never become markup. */
function AnswerBody({ text }) {
  const blocks = useMemo(() => parseAnswer(text), [text]);

  const runs = (list) =>
    list.map((run, i) => {
      if (run.type === 'bold') return <strong key={i}>{run.value}</strong>;
      if (run.type === 'cite') return <span key={i} className="asst-cite">{run.value}</span>;
      return <span key={i}>{run.value}</span>;
    });

  // A reply with no parseable block (an empty answer) still needs to say
  // something, or the bubble renders as an empty box.
  if (!blocks.length) return <p>{text || FALLBACK_ERROR}</p>;

  return blocks.map((block, i) =>
    block.type === 'ul' ? (
      <ul key={i}>
        {block.items.map((item, j) => <li key={j}>{runs(item)}</li>)}
      </ul>
    ) : (
      <p key={i}>{runs(block.runs)}</p>
    )
  );
}

/* ── Confidence + citations ─────────────────────────────────────────────── */
function AnswerMeta({ confidence, sources }) {
  const [open, setOpen] = useState(false);
  const shown = useMemo(() => topSources(sources), [sources]);
  const level = confidence?.level;

  if (!level && !shown.length) return null;

  return (
    <div className="asst-meta">
      {level ? (
        <span className={`asst-conf is-${CONFIDENCE_TONE[level] || 'low'}`}>
          <i className="asst-dot" />
          {level} confidence
        </span>
      ) : null}

      {shown.length ? (
        <>
          <button
            type="button"
            className="asst-srctoggle"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {shown.length === 1 ? '1 source' : `${shown.length} sources`}
            <ChevronIcon />
          </button>
          {open ? (
            <ul className="asst-srclist">
              {shown.map((source) => (
                <li key={source.source_id}>{sourceLabel(source)}</li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

/* ── Widget ───────────────────────────────────────────────────────────────
   Exported as SupportAssistant. Mounted once in app/(main)/layout.js. */
export default function SupportAssistant() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([]);

  const logRef = useRef(null);
  const inputRef = useRef(null);

  const ask = useAssistantAskMutation();
  const { mutate, isPending, reset: resetMutation } = ask;

  const append = useCallback((message) => {
    setMessages((prev) => [...prev, { id: nextMessageId(), ...message }]);
  }, []);

  // Pin to the newest message. `isPending` is a dependency because the typing
  // indicator appearing changes the scroll height too, and without it the
  // indicator renders just below the fold.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, isPending, open]);

  // Opening the panel should land the caret in the box — the whole interaction
  // is typing a question.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const submit = (e) => {
    e.preventDefault();

    const query = draft.trim();
    // A second question while one is in flight would race the first answer
    // into the wrong place in the transcript.
    if (!query || isPending) return;

    append({ role: 'user', text: query });
    setDraft('');

    mutate(
      { query },
      {
        onSuccess: (data) => {
          append({
            role: 'bot',
            text: data?.answer || '',
            sources: data?.sources,
            confidence: data?.confidence,
          });
        },
        // The failure belongs in the transcript rather than in a toast: it is
        // an answer to the question just asked, and it has to sit under it.
        onError: (err) => {
          append({ role: 'bot', text: toUserMessage(err), isError: true });
        },
      }
    );
  };

  const startNew = () => {
    setMessages([]);
    setDraft('');
    resetMutation();
    inputRef.current?.focus();
  };

  const askStarter = (prompt) => {
    setDraft(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="asst-root">
      <style>{S}</style>

      {open ? (
        <section className="asst-panel" aria-label={BOT.name}>
          <header className="asst-head">
            <div>
              <h2 className="asst-title">{BOT.name}</h2>
              <span className="asst-status">
                {isPending ? 'Looking that up…' : 'Answers from the Fameo help centre'}
              </span>
            </div>
            <button
              type="button"
              className="asst-headbtn"
              onClick={startNew}
              aria-label="Start a new conversation"
              title="Start a new conversation"
            >
              <MenuIcon />
            </button>
          </header>

          {/* Announced politely: an answer can take half a minute, and someone
              on a screen reader needs to hear it land without losing focus. */}
          <div className="asst-log" ref={logRef} role="log" aria-live="polite">
            <div className="asst-row">
              <BotAvatar className="asst-avatar" />
              <div className="asst-bubble">
                <span className="asst-who">
                  {BOT.name} <span>{BOT.org}</span>
                </span>
                <p>{BOT.greeting}</p>
              </div>
            </div>

            {messages.length === 0 ? (
              <div className="asst-starters">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="asst-starter"
                    onClick={() => askStarter(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}

            {messages.map((message) =>
              message.role === 'user' ? (
                <div key={message.id} className="asst-row is-user">
                  <div className="asst-bubble">{message.text}</div>
                </div>
              ) : (
                <div key={message.id} className="asst-row">
                  <BotAvatar className="asst-avatar" />
                  <div className="asst-bubble">
                    <AnswerBody text={message.text} />
                    {message.isError ? null : (
                      <AnswerMeta confidence={message.confidence} sources={message.sources} />
                    )}
                  </div>
                </div>
              )
            )}

            {isPending ? (
              <p className="asst-typing">
                typing<i />
                <i />
                <i />
              </p>
            ) : null}
          </div>

          <form className="asst-form" onSubmit={submit}>
            <label className="asst-sr" htmlFor="asst-input">
              Ask the Fameo assistant a question
            </label>
            <input
              id="asst-input"
              ref={inputRef}
              className="asst-input"
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Send message..."
              maxLength={MAX_QUERY_LENGTH}
              disabled={isPending}
              autoComplete="off"
            />
            <button
              type="submit"
              className="asst-send"
              disabled={isPending || !draft.trim()}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="asst-launcher"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close the support chat' : 'Open the support chat'}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  );
}
