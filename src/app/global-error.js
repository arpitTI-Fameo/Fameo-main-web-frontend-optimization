'use client';
// app/global-error.js
// The last line of defence. A throw inside the root layout happens ABOVE
// app/error.js, so only this boundary sees it — and because the layout never
// rendered, this component must supply its own <html> and <body>.

import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('[global error]', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <div
          role="alert"
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: 24,
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
            Something went wrong
          </h2>
          <p style={{ margin: 0, color: '#666', fontSize: 15 }}>
            The page could not be loaded. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 8,
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: '#111',
              color: '#fff',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
          {error?.digest && (
            <code style={{ marginTop: 12, fontSize: 11, color: '#999' }}>
              Reference: {error.digest}
            </code>
          )}
        </div>
      </body>
    </html>
  );
}
