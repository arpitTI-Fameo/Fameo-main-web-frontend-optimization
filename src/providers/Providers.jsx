'use client';
// providers/Providers.jsx
// Single root wrapper used in app/layout.js.
// Add any new global providers here — never clutter layout.js.

import QueryProvider from './query-provider';

export default function Providers({ children }) {
  // Zustand stores are hook-based — no Provider wrapper needed.
  return <QueryProvider>{children}</QueryProvider>;
}
