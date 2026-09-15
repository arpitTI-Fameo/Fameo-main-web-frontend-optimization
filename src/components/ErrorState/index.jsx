'use client';
// components/ErrorState.jsx
// The one thing every error.js boundary renders.
//
// Before these boundaries existed, an ApiError thrown during render took the
// whole route down to a blank page. The API layer is deliberately built to
// throw — CLAUDE.md: "Let ApiError throw. Server Components route it to
// error.tsx" — which only works if a boundary is actually there to catch it.
//
// What the user sees comes from toUserMessage(), so a 500 never leaks an
// internal message or a stack trace. The digest is shown because it is the one
// string that ties a user's report to a server log line.

import { toUserMessage } from '@/lib/api/errors';
import Link from 'next/link';

export function ErrorState({ error, reset, title = 'Something went wrong' }) {
  const message = toUserMessage(error);

  return (
    <div
      role="alert"
      style={{
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: '48px 24px',
        textAlign: 'center',
        fontFamily: '"DM Sans", system-ui, sans-serif',
      }}
    >
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{title}</h2>

      <p style={{ margin: 0, maxWidth: 420, color: '#666', fontSize: 15, lineHeight: 1.5 }}>
        {message}
      </p>

      <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {typeof reset === 'function' && (
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid #ddd',
              background: '#111',
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        )}
        <Link
          href="/"
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: '1px solid #ddd',
            background: '#fff',
            color: '#111',
            fontSize: 14,
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          Return Home
        </Link>
      </div>

      {error?.digest && (
        <code style={{ marginTop: 12, fontSize: 11, color: '#999' }}>
          Reference: {error.digest}
        </code>
      )}
    </div>
  );
}

export default ErrorState;
