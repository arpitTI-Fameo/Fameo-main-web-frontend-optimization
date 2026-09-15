#!/usr/bin/env node
// scripts/gen-codemap.mjs
//
// Generates docs/CODEMAP.md — the index an agent reads instead of browsing the
// repo. One line per module, listing what it exports and how to import it.
//
//   node scripts/gen-codemap.mjs
//
// Plain JS/JSX only. No TypeScript, no parser dependency: the export forms in
// this codebase are regular enough that regex is honest here, and a build-time
// dependency for a docs file is not worth it. Anything it cannot parse shows up
// in the "Unparsed exports" count at the bottom rather than being silently lost.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'docs', 'CODEMAP.md');

const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'icons']);

// ── Walk ─────────────────────────────────────────────────────────────────────

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(js|jsx|mjs)$/.test(entry)) out.push(full);
  }
  return out;
}

// ── Parse ────────────────────────────────────────────────────────────────────

const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

const PATTERNS = [
  [/^export const\s+([A-Za-z_$][\w$]*)/gm, 'const'],
  [/^export let\s+([A-Za-z_$][\w$]*)/gm, 'const'],
  [/^export (?:async )?function\s+([A-Za-z_$][\w$]*)/gm, 'fn'],
  [/^export class\s+([A-Za-z_$][\w$]*)/gm, 'class'],
];

function parseExports(code) {
  const named = new Map(); // name -> kind

  for (const [re, kind] of PATTERNS) {
    for (const m of code.matchAll(re)) named.set(m[1], kind);
  }

  // export { a, b as c }
  for (const m of code.matchAll(/^export\s*\{([^}]*)\}(?!\s*from)/gm)) {
    for (const part of m[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim();
      if (name && /^[A-Za-z_$][\w$]*$/.test(name)) named.set(name, 're-export');
    }
  }

  // export { a } from './x'   /   export * from './x'
  const reExports = [];
  for (const m of code.matchAll(/^export\s*(?:\*|\{[^}]*\})\s*from\s*['"]([^'"]+)['"]/gm)) {
    reExports.push(m[1]);
  }

  // default
  let def = null;
  const defFn = code.match(/^export default (?:async )?function\s*([A-Za-z_$][\w$]*)?/m);
  const defExpr = code.match(/^export default\s+([A-Za-z_$][\w$]*)\s*;?\s*$/m);
  if (defFn) def = defFn[1] || '(anonymous)';
  else if (defExpr) def = defExpr[1];
  else if (/^export default\s/m.test(code)) def = '(expression)';

  return { named, reExports, def };
}

// ── Canonical homes ──────────────────────────────────────────────────────────
// Order matters: the first prefix that matches wins, so the most specific
// paths are listed first.

const AREAS = [
  ['src/constants', 'Constants — shared literal values, enums, config maps'],
  ['src/utils', 'Utils — pure functions, no React, no network'],
  ['src/store', 'Stores — Zustand client state'],
  ['src/providers', 'Providers — React context wiring'],
  ['src/lib/api/server', 'lib/api/server — SERVER ONLY. Origins, proxy, fetchers, rate limit'],
  ['src/lib/api/client', 'lib/api/client — browser transport'],
  ['src/lib/api', 'lib/api — request core, endpoints, errors, schemas'],
  ['src/lib/auth', 'lib/auth — session cookies, route gating'],
  ['src/lib/security', 'lib/security — JWT, sanitizer, guards, redirects'],
  ['src/lib/query', 'lib/query — TanStack client + mutation wrapper'],
  ['src/lib/seo', 'lib/seo — metadata, JSON-LD'],
  ['src/lib/hooks', 'lib/hooks — React hooks (component → HOOK → service → request)'],
  ['src/lib/services', 'lib/services — ALL network calls live here'],
  ['src/components/Layout', 'components/Layout — page shell, nav, wrappers'],
  ['src/components/ui', 'components/ui — generic presentational primitives'],
  ['src/components/admin', 'components/admin — shared admin widgets'],
  ['src/components', 'components — shared composed components'],
  ['src/modules', 'modules/<Area>/<Feature> — feature-scoped UI and logic'],
  ['src/app', 'app — routing only. Composition, no business logic'],
];

const areaFor = (rel) => AREAS.find(([p]) => rel === p || rel.startsWith(p + '/'))?.[1] ?? 'Other';

const importPath = (rel) =>
  '@/' + rel.replace(/^src\//, '').replace(/\.(js|jsx|mjs)$/, '').replace(/\/index$/, '');

// ── Duplicate detection ──────────────────────────────────────────────────────

// Normalise a name so near-synonyms collide: USER_ROLES / userRoles / ROLE ->
// "role". This is what catches a second ROLES constant before it is written.
const STOP = ['get', 'set', 'use', 'is', 'to', 'the', 'all', 'list', 'default'];

function normalise(name) {
  const n = name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_\-]/g, ' ')
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w && !STOP.includes(w))
    .map((w) => w.replace(/(ies)$/, 'y').replace(/s$/, ''))
    .sort()
    .join('');
  return n || name.toLowerCase();
}

// ── Build ────────────────────────────────────────────────────────────────────

const files = walk(SRC).sort();

const modules = [];
let unparsed = 0;

for (const abs of files) {
  const rel = relative(ROOT, abs).split(sep).join('/');
  const raw = readFileSync(abs, 'utf8');
  const code = stripComments(raw);
  const { named, reExports, def } = parseExports(code);

  if (named.size === 0 && !def && reExports.length === 0) continue;
  if (/^export default\s/m.test(code) && def === '(expression)') unparsed += 1;

  modules.push({
    rel,
    area: areaFor(rel),
    imp: importPath(rel),
    names: [...named.keys()],
    kinds: named,
    def,
    reExports,
  });
}

// ── What counts as a duplicate ───────────────────────────────────────────────
//
// This section is only useful if it stays small enough to read. Two exclusions
// keep the signal up:
//
//   styles.js   Every module exports a local style object called `S` or `CSS`.
//               That is the house convention, not 40 duplicate constants.
//   re-exports  `export { X } from './x'` is deliberate plumbing, not a second
//               definition of X.
//
// Everything else is reported, split by severity:
//
//   Cross-layer   the same name in a SHARED home (utils/constants/lib) and in a
//                 module — i.e. someone rebuilt a shared helper locally. Fix by
//                 importing the shared one.
//   In modules    the same name in several modules and nowhere shared — a
//                 promotion candidate for utils/ or constants/.

const SHARED_PREFIXES = ['@/constants/', '@/utils/', '@/lib/', '@/store/', '@/components/'];
const isShared = (imp) => SHARED_PREFIXES.some((p) => imp.startsWith(p));
const isStyles = (rel) => /\/styles\.(js|jsx)$/.test(rel);

const byName = new Map();
const byNorm = new Map();

for (const m of modules) {
  // app/ route files export page/layout/handler components; they are never
  // imported by other code, so they cannot be "duplicates" in any useful sense.
  if (m.rel.startsWith('src/app/')) continue;
  if (isStyles(m.rel)) continue;

  for (const name of m.names) {
    if (m.kinds.get(name) === 're-export') continue;

    if (!byName.has(name)) byName.set(name, []);
    byName.get(name).push(m.imp);

    const n = normalise(name);
    if (!byNorm.has(n)) byNorm.set(n, new Set());
    byNorm.get(n).add(`${name} → ${m.imp}`);
  }
}

const allDupes = [...byName.entries()]
  .map(([name, paths]) => [name, [...new Set(paths)]])
  .filter(([, paths]) => paths.length > 1)
  .sort(([a], [b]) => a.localeCompare(b));

const crossLayer = allDupes.filter(([, paths]) => paths.some(isShared));
const inModules = allDupes.filter(([, paths]) => !paths.some(isShared));
const exactDupes = allDupes;

const nearDupes = [...byNorm.entries()]
  .filter(([, set]) => {
    if (set.size < 2) return false;
    // Already reported as an exact duplicate — do not report twice.
    const names = [...set].map((s) => s.split(' → ')[0]);
    return new Set(names).size > 1;
  })
  .sort(([a], [b]) => a.localeCompare(b));

// ── Emit ─────────────────────────────────────────────────────────────────────

const lines = [];
const P = (s = '') => lines.push(s);

const totalExports = modules.reduce((n, m) => n + m.names.length + (m.def ? 1 : 0), 0);

P('# CODEMAP');
P();
P(`<!-- GENERATED by scripts/gen-codemap.mjs — do not edit by hand. -->`);
P(`Generated: ${new Date().toISOString()}`);
P(`Modules: ${modules.length} · Exports: ${totalExports}`);
P();
P('Every exported value in `src/`, with the path to import it from.');
P('Search this file before creating anything. See `CLAUDE.md` §1.');
P();
P('`default` marks the default export. Everything else is named.');
P();

const EMIT_ORDER = [
  ...AREAS.map(([, label]) => label),
  // Anything at the src/ root (middleware.js) or in a folder AREAS does not
  // name. Emitted last so nothing can be silently dropped from the map.
  'Other',
];

for (const label of EMIT_ORDER) {
  const group = modules.filter((m) => m.area === label);
  if (!group.length) continue;

  P(`## ${label}`);
  P();

  // app/ is routing: list the routes, not their exports.
  if (label.startsWith('app —')) {
    P('| Route file | Kind |');
    P('| --- | --- |');
    for (const m of group) {
      const kind = m.rel.endsWith('/route.js')
        ? 'API handler'
        : m.rel.split('/').pop().replace('.js', '');
      P(`| \`${m.rel.replace('src/app', '')}\` | ${kind} |`);
    }
    P();
    continue;
  }

  P('| Import from | Exports |');
  P('| --- | --- |');
  for (const m of group) {
    const parts = [];
    if (m.def) parts.push(`**default**${m.def !== '(anonymous)' && m.def !== '(expression)' ? ` (${m.def})` : ''}`);
    parts.push(...m.names.map((n) => `\`${n}\``));
    if (m.reExports.length) parts.push(`_re-exports: ${m.reExports.map((r) => `\`${r}\``).join(', ')}_`);
    P(`| \`${m.imp}\` | ${parts.join(', ') || '—'} |`);
  }
  P();
}

P('---');
P();
P('## Possible duplicates');
P();
P('Two kinds of hit. Neither is automatically a bug — read before acting.');
P();
P(`### Cross-layer — a shared value rebuilt locally (${crossLayer.length})`);
P();
P('The same name exists in a shared home AND somewhere else. Import the shared');
P('one; delete the local copy. These are the real hits.');
P();
if (!crossLayer.length) {
  P('None.');
} else {
  P('| Name | Exported from |');
  P('| --- | --- |');
  for (const [name, paths] of crossLayer) {
    const marked = paths.map((p) => (isShared(p) ? `**\`${p}\`**` : `\`${p}\``));
    P(`| \`${name}\` | ${marked.join(', ')} |`);
  }
}
P();
P(`### Repeated across modules — promotion candidates (${inModules.length})`);
P();
P('Defined in several modules and nowhere shared. Per CLAUDE.md §2, a value used');
P('in two or more files belongs in `constants/` or `utils/`.');
P();
if (!inModules.length) {
  P('None.');
} else {
  P('| Name | Copies | Exported from |');
  P('| --- | --- | --- |');
  for (const [name, paths] of inModules) {
    P(`| \`${name}\` | ${paths.length} | ${paths.map((p) => `\`${p}\``).join(', ')} |`);
  }
}
P();
P(`### Near-synonyms (${nearDupes.length})`);
P();
P('Names that reduce to the same concept once casing, separators, plurals and');
P('common prefixes (`get`, `use`, `is`) are stripped. This is the section that');
P('catches a second `ROLES` about to be written as `USER_ROLES`.');
P();
if (!nearDupes.length) {
  P('None.');
} else {
  P('| Concept | Variants |');
  P('| --- | --- |');
  for (const [concept, set] of nearDupes) {
    P(`| \`${concept}\` | ${[...set].map((s) => `\`${s}\``).join('<br>')} |`);
  }
}
P();
P('---');
P();
P(`_Default exports whose name could not be resolved: ${unparsed}._`);
P();

// Importable summary, so tests can assert the committed map is current without
// re-implementing the scan. See tests/codemap.test.js.
export const codemap = {
  path: OUT,
  markdown: lines.join('\n'),
  modules: modules.map((m) => ({ imp: m.imp, names: m.names, def: m.def })),
  counts: {
    modules: modules.length,
    exports: totalExports,
    crossLayer: crossLayer.length,
    inModules: inModules.length,
    nearDupes: nearDupes.length,
  },
};

// Only write when run as a script, never on import.
const runAsScript =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (runAsScript) {
  mkdirSync(join(ROOT, 'docs'), { recursive: true });
  writeFileSync(OUT, codemap.markdown);

  console.log(`docs/CODEMAP.md written`);
  console.log(`  modules            ${modules.length}`);
  console.log(`  exports            ${totalExports}`);
  console.log(`  cross-layer dupes  ${crossLayer.length}`);
  console.log(`  module repeats     ${inModules.length}`);
  console.log(`  near-synonyms      ${nearDupes.length}`);
}
