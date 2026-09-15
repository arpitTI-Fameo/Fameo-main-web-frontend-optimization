// vitest.config.mjs
// Unit tests for the API layer's pure logic.
//
// Scope is deliberate: this covers the code every request in the app passes
// through — envelope detection, error mapping, the rate limiter, the response
// schemas. Those are the pieces where a regression is silent and universal.
// Component rendering is not covered here and would need jsdom + Testing
// Library on top.

import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // `server-only` is a build-time guard, not runtime behaviour. Under test
      // there is no client bundle to protect, so it resolves to a no-op.
      'server-only': fileURLToPath(new URL('./tests/stubs/server-only.js', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    clearMocks: true,
  },
});
