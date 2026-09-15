// tests/codemap.test.js
//
// Keeps docs/CODEMAP.md honest.
//
// CLAUDE.md tells the agent to read the codemap instead of browsing the repo,
// and §5 requires regenerating it before reporting done. A checklist item that
// nothing enforces gets skipped, and a stale codemap is worse than none: it
// confidently answers "does this exist?" with last week's answer, which is how
// a second `formatINR` gets written.
//
// This compares the COMMITTED file against a fresh scan. The timestamp line is
// ignored — only the content that answers a question has to match.

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';

import { codemap } from '../scripts/gen-codemap.mjs';

const committed = existsSync(codemap.path) ? readFileSync(codemap.path, 'utf8') : '';

// src/app/ is rendered as a ROUTE TABLE (file paths), not as importable exports.
// Route files export `page`, `layout`, `metadata` and HTTP handlers that no other
// module imports, so listing them by name would add ~120 rows of noise to the
// thing an agent has to read. They are checked as routes instead, below.
const importable = codemap.modules.filter((m) => !m.imp.startsWith('@/app/'));

describe('docs/CODEMAP.md is current', () => {
  it('exists', () => {
    expect(committed, 'run `npm run codemap`').not.toBe('');
  });

  it('lists every module that exports something', () => {
    const missing = importable
      .map((m) => m.imp)
      .filter((imp) => !committed.includes(`\`${imp}\``));

    expect(missing, 'modules missing from the codemap — run `npm run codemap`').toEqual([]);
  });

  it('lists every exported name', () => {
    // Spot-checking a sample would let a whole area rot; check them all.
    const missing = [];
    for (const m of importable) {
      for (const name of m.names) {
        if (!committed.includes(`\`${name}\``)) missing.push(`${name} (${m.imp})`);
      }
    }

    expect(missing, 'exports missing from the codemap — run `npm run codemap`').toEqual([]);
  });

  it('lists every route file', () => {
    const routes = codemap.modules
      .filter((m) => m.imp.startsWith('@/app/'))
      .map((m) => m.imp.replace('@/app', ''));

    const missing = routes.filter((r) => !committed.includes(r));
    expect(missing, 'routes missing from the codemap — run `npm run codemap`').toEqual([]);
  });

  it('reports the same duplicate counts as a fresh scan', () => {
    const read = (label) => {
      const m = committed.match(new RegExp(`### ${label}[^(]*\\((\\d+)\\)`));
      return m ? Number(m[1]) : null;
    };

    expect(read('Cross-layer')).toBe(codemap.counts.crossLayer);
    expect(read('Repeated across modules')).toBe(codemap.counts.inModules);
    expect(read('Near-synonyms')).toBe(codemap.counts.nearDupes);
  });
});

describe('the codemap stays readable', () => {
  it('does not regress past the duplicate count recorded here', () => {
    // CLAUDE.md §5: the Possible duplicates section must not grow. These are the
    // counts at the time the codemap was introduced. LOWERING them is the goal;
    // if a change legitimately raises one, change the number here deliberately
    // and say why in the commit — do not let it drift up unnoticed.
    const BASELINE = { crossLayer: 17, inModules: 9, nearDupes: 38 };

    expect(codemap.counts.crossLayer).toBeLessThanOrEqual(BASELINE.crossLayer);
    expect(codemap.counts.inModules).toBeLessThanOrEqual(BASELINE.inModules);
    expect(codemap.counts.nearDupes).toBeLessThanOrEqual(BASELINE.nearDupes);
  });
});
