// tests/architecture.test.js
//
// Guard rails, not unit tests. Each case here encodes a rule from CLAUDE.md
// that was violated at least once in this codebase's history and would be
// invisible if it came back — no build error, no failing page, just a quietly
// weaker system.
//
// These read the source tree directly rather than importing it, because the
// thing being asserted is a property of the FILES, not of runtime behaviour.

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src');

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(js|jsx|mjs)$/.test(entry)) out.push(full);
  }
  return out;
}

/**
 * Comments describe what the code USED to do. Several files here carry a
 * deliberate write-up of the exact pattern being banned ("this used to call
 * document.cookie = ..."), so matching against raw text would flag the
 * documentation instead of the defect. Every rule below tests `code`.
 */
const stripComments = (src) =>
  src
    .replace(/\/\*[\s\S]*?\*\//g, '')  // block comments
    .replace(/^\s*\/\/.*$/gm, '');       // whole-line comments

const FILES = walk(SRC).map((path) => {
  const body = readFileSync(path, 'utf8');
  return {
    path,
    rel: relative(ROOT, path),
    body,
    code: stripComments(body),
  };
});

/**
 * A file is server-side if it SAYS so — `import 'server-only'` is the real
 * guarantee (it fails the build when pulled into a client bundle), whereas a
 * path convention is just a habit. Route handlers and middleware never run in
 * the browser either, so they qualify by location.
 */
const isServerFile = (f) =>
  /^import ['"]server-only['"];/m.test(f.body) ||
  f.rel.startsWith('src/app/api/') ||
  f.rel === 'src/middleware.js';

describe('the upstream origins never reach the browser', () => {
  it('lib/api/server/origins.js is marked server-only', () => {
    const origins = FILES.find((f) => f.rel === 'src/lib/api/server/origins.js');
    expect(origins).toBeDefined();
    expect(origins.body).toMatch(/^import ['"]server-only['"];/m);
  });

  it('only server files import it', () => {
    const offenders = FILES
      .filter((f) => /from ['"].*server\/origins['"]/.test(f.code))
      .filter((f) => !isServerFile(f))
      .map((f) => f.rel);

    expect(offenders).toEqual([]);
  });

  it('no NEXT_PUBLIC_ variable holds a REST API origin', () => {
    // NEXT_PUBLIC_ is inlined into the client bundle. An origin there makes the
    // BFF pointless — CLAUDE.md lists this as a top "things people get wrong".
    // NEXT_PUBLIC_SOCKET_URL is the one sanctioned exception: a WebSocket
    // upgrade cannot be proxied through a route handler.
    const offenders = FILES
      .filter((f) => /NEXT_PUBLIC_(API_URL|PRODUCTS_API_URL|REFERRAL_API_URL|APP_BACKEND)/.test(f.code))
      .map((f) => f.rel);

    expect(offenders).toEqual([]);
  });

  it('no source file hardcodes an upstream API host', () => {
    const offenders = FILES
      .filter((f) => !isServerFile(f))
      // /api/ is the giveaway: a link to a policy page on the same host is
      // fine, an API call to it is not.
      .filter((f) => /https?:\/\/[^'"`\s]*(uat-api|railway\.app)[^'"`\s]*\/api\//.test(f.code))
      .map((f) => f.rel);

    expect(offenders).toEqual([]);
  });
});

describe('no credential is reachable from client JavaScript', () => {
  it('nothing reads a session token out of web storage', () => {
    const TOKEN_KEYS = /(localStorage|sessionStorage)\s*\.\s*getItem\(\s*['"](fameo_token|fameo_refresh|fameo_app_token)['"]/;
    const offenders = FILES.filter((f) => TOKEN_KEYS.test(f.code)).map((f) => f.rel);
    expect(offenders).toEqual([]);
  });

  it('nothing writes a token into web storage', () => {
    const WRITES = /(localStorage|sessionStorage)\s*\.\s*setItem\(\s*['"](fameo_token|fameo_refresh|fameo_app_token)['"]/;
    const offenders = FILES.filter((f) => WRITES.test(f.code)).map((f) => f.rel);
    expect(offenders).toEqual([]);
  });

  it('nothing writes a session cookie via document.cookie', () => {
    // A script-written cookie is not a credential the server can trust, and a
    // browser silently ignores a script write to an httpOnly name.
    const offenders = FILES
      .filter((f) => /document\.cookie\s*=/.test(f.code))
      .filter((f) => /fameo_(token|session|app_session)/.test(f.code))
      .map((f) => f.rel);

    expect(offenders).toEqual([]);
  });
});

describe('the session cookie is handled in exactly one place', () => {
  it('only lib/auth/session.js reads or writes the cookie store', () => {
    const offenders = FILES
      .filter((f) => f.rel !== 'src/lib/auth/session.js')
      .filter((f) => /\bcookies\(\)/.test(f.code))
      // middleware uses request.cookies, a different (Edge) API.
      .filter((f) => f.rel !== 'src/middleware.js')
      .map((f) => f.rel);

    expect(offenders).toEqual([]);
  });

  it('cookies() is always awaited — calling it synchronously throws in Next 15+', () => {
    const offenders = FILES
      .filter((f) => /(?<!await\s)\bcookies\(\)\s*\./.test(f.code))
      .map((f) => f.rel);

    expect(offenders).toEqual([]);
  });
});

describe('every route has an error boundary above it', () => {
  it('the root and global boundaries exist', () => {
    expect(FILES.some((f) => f.rel === 'src/app/error.js')).toBe(true);
    expect(FILES.some((f) => f.rel === 'src/app/global-error.js')).toBe(true);
  });

  it('each top-level route group has its own boundary', () => {
    for (const seg of ['src/app/(main)/error.js', 'src/app/(auth)/error.js', 'src/app/admin/error.js']) {
      expect(FILES.some((f) => f.rel === seg)).toBe(true);
    }
  });
});

describe('response schemas are loose', () => {
  it('schemas.js never uses z.object, which silently strips unknown keys', () => {
    const schemas = FILES.find((f) => f.rel === 'src/lib/api/schemas.js');
    expect(schemas).toBeDefined();

    expect(schemas.code).not.toMatch(/\bz\.object\(/);
  });
});
