'use client';
// providers/Providers.jsx
// Single root wrapper used in app/layout.js.
// Add any new global providers here — never clutter layout.js.

export default function Providers({ children }) {
  // Zustand stores are hook-based — no Provider wrapper needed.
  // Add third-party providers here as Fameo grows:
  //   e.g. <QueryClientProvider>, <ToastProvider>, <ThemeProvider>
  return <>{children}</>;
}