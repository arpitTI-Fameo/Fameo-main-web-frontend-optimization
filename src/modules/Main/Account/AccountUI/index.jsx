'use client';
// modules/Account/AccountUI/index.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Shared design tokens + presentational primitives for every /account page.
//
// These match the look already established in account/profile/page.js:
// Cormorant Garamond headings, DM Sans body, gold (#C9A96E) on ink (#1a1208),
// 1.5px #ece8de borders and 10px radii. Import from here so the whole account
// section stays visually consistent.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Tokens ──────────────────────────────────────────────────────────────────
export const INK     = '#1a1208';
export const GOLD    = '#C9A96E';
export const LINE    = '#ece8de';
export const MUTED   = '#8a8275';
export const FAINT   = '#a8a092';
export const EMPTY   = '#c8c2b4';
export const SURFACE = '#fff';

export const GREEN     = '#2f7030';
export const GREEN_BG  = '#6cae6c22';
export const AMBER     = '#8a6a1e';
export const AMBER_BG  = GOLD + '22';
export const RED       = '#9a3030';
export const RED_BG    = '#c0505022';
export const SLATE     = '#5a6b7a';
export const SLATE_BG  = '#5a6b7a1a';

export const FONT_BODY    = "'DM Sans',sans-serif";
export const FONT_DISPLAY = "'Cormorant Garamond',serif";

// ─── Formatters ──────────────────────────────────────────────────────────────

// ₹1,149.50 — hides decimals when the amount is whole.
export function inr(value) {
  if (value === null || value === undefined) return '—';
  const n = Number(value);
  if (Number.isNaN(n)) return '—';
  return `₹${n.toLocaleString('en-IN', {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

// '2026-07-04' → '4 Jul'. Leaves non-date strings alone.
export function shortDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// ─── Status → chip colours ───────────────────────────────────────────────────
const STATUS_MAP = {
  active:     { bg: GREEN_BG, fg: GREEN, label: 'Active' },
  released:   { bg: GREEN_BG, fg: GREEN, label: 'Released' },
  subscribed: { bg: GREEN_BG, fg: GREEN, label: 'Subscribed' },
  paid:       { bg: GREEN_BG, fg: GREEN, label: 'Paid' },
  done:       { bg: GREEN_BG, fg: GREEN, label: 'Verified' },
  credit:     { bg: GREEN_BG, fg: GREEN, label: 'Credit' },
  holding:    { bg: AMBER_BG, fg: AMBER, label: 'Holding' },
  hold:       { bg: AMBER_BG, fg: AMBER, label: 'On hold' },
  pending:    { bg: AMBER_BG, fg: AMBER, label: 'Pending' },
  no_sub:     { bg: AMBER_BG, fg: AMBER, label: 'No sub yet' },
  shared:     { bg: SLATE_BG, fg: SLATE, label: 'Shared' },
  rejected:   { bg: RED_BG,   fg: RED,   label: 'Rejected' },
  debit:      { bg: RED_BG,   fg: RED,   label: 'Debit' },
};

export function statusMeta(status) {
  return STATUS_MAP[status] || { bg: '#c0b9aa22', fg: MUTED, label: status || '—' };
}

// ─── Chip ────────────────────────────────────────────────────────────────────
export function Chip({ bg, fg, children, style }) {
  return (
    <span style={{
      display: 'inline-block',
      fontSize: 10.5, letterSpacing: '.04em', fontWeight: 600,
      padding: '3px 9px', borderRadius: 20,
      background: bg || '#c0b9aa22',
      color: fg || MUTED,
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {children}
    </span>
  );
}

// Chip driven straight off a status string.
export function StatusChip({ status }) {
  const { bg, fg, label } = statusMeta(status);
  return <Chip bg={bg} fg={fg}>{label}</Chip>;
}

// ─── Section ─────────────────────────────────────────────────────────────────
// The uppercase letterspaced label + content block used across account pages.
export function Section({ title, action, children, style }) {
  return (
    <div style={{ marginBottom: 26, ...style }}>
      {(title || action) && (
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'baseline', gap: 12, marginBottom: 12,
        }}>
          <div style={{
            fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase',
            color: MUTED, fontWeight: 600,
          }}>
            {title}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, style }) {
  return (
    <div style={{
      background: SURFACE,
      border: `1.5px solid ${LINE}`,
      borderRadius: 10,
      padding: '16px 18px',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Stat tile ───────────────────────────────────────────────────────────────
export function StatTile({ label, value, color }) {
  return (
    <Card style={{ padding: '13px 15px' }}>
      <span style={{
        display: 'block', fontSize: 10, letterSpacing: '.1em',
        textTransform: 'uppercase', color: FAINT, fontWeight: 600, marginBottom: 6,
      }}>
        {label}
      </span>
      <span style={{
        display: 'block',
        fontFamily: FONT_DISPLAY,
        fontSize: 26, fontWeight: 600, lineHeight: 1,
        color: color || INK,
      }}>
        {value}
      </span>
    </Card>
  );
}

// ─── Page heading ────────────────────────────────────────────────────────────
export function PageTitle({ eyebrow, title, subtitle, action }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'flex-end', gap: 16, flexWrap: 'wrap',
      paddingBottom: 20, borderBottom: `1.5px solid ${LINE}`, marginBottom: 26,
    }}>
      <div>
        {eyebrow && (
          <span style={{
            display: 'block', fontSize: 10, letterSpacing: '.18em',
            textTransform: 'uppercase', color: GOLD, fontWeight: 600, marginBottom: 6,
          }}>
            {eyebrow}
          </span>
        )}
        <h1 style={{
          fontFamily: FONT_DISPLAY, fontSize: 34, fontWeight: 500,
          color: INK, margin: 0, lineHeight: 1.05,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 13.5, color: MUTED, margin: '6px 0 0' }}>{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

// ─── Buttons ─────────────────────────────────────────────────────────────────
const btnBase = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
  padding: '10px 18px', borderRadius: 10,
  fontSize: 12.5, fontWeight: 600, letterSpacing: '.03em',
  fontFamily: FONT_BODY, cursor: 'pointer',
  border: '1.5px solid transparent',
  textDecoration: 'none', transition: 'opacity .15s',
};

export function Button({ variant = 'primary', block, disabled, style, children, ...rest }) {
  const variants = {
    primary: { background: INK, color: '#fff', borderColor: INK },
    gold:    { background: GOLD, color: '#fff', borderColor: GOLD },
    ghost:   { background: 'transparent', color: INK, borderColor: LINE },
    danger:  { background: 'transparent', color: RED, borderColor: '#d9b4b4' },
  };
  return (
    <button
      disabled={disabled}
      style={{
        ...btnBase,
        ...variants[variant],
        width: block ? '100%' : undefined,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

// Anchor styled to match Button (for next/link).
export function linkButtonStyle(variant = 'primary', block) {
  const variants = {
    primary: { background: INK, color: '#fff', borderColor: INK },
    gold:    { background: GOLD, color: '#fff', borderColor: GOLD },
    ghost:   { background: 'transparent', color: INK, borderColor: LINE },
  };
  return { ...btnBase, ...variants[variant], width: block ? '100%' : undefined };
}

// ─── Table ───────────────────────────────────────────────────────────────────
// Scrolls horizontally on narrow screens instead of overflowing.
export function Table({ head, children }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} style={{
                textAlign: 'left', fontSize: 10, letterSpacing: '.1em',
                textTransform: 'uppercase', color: FAINT, fontWeight: 600,
                padding: '0 10px 10px', whiteSpace: 'nowrap',
                borderBottom: `1.5px solid ${LINE}`,
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export const tdStyle = {
  padding: '13px 10px',
  borderBottom: `1px solid ${LINE}`,
  fontSize: 13, color: INK, whiteSpace: 'nowrap',
};

// ─── Loading / error / empty ─────────────────────────────────────────────────
export function Loading({ label = 'Loading…' }) {
  return (
    <div style={{
      minHeight: '40vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 8,
      fontFamily: FONT_BODY, color: MUTED, fontSize: 14,
    }}>
      <span style={{ color: GOLD, fontSize: 18 }}>◈</span> {label}
    </div>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <Card style={{ borderColor: '#e0c4c4', background: '#fdf6f6' }}>
      <p style={{ fontSize: 13.5, color: RED, margin: 0 }}>
        {message || "Couldn't load this data."}
      </p>
      {onRetry && (
        <Button variant="ghost" onClick={onRetry} style={{ marginTop: 12, padding: '7px 14px' }}>
          Try again
        </Button>
      )}
    </Card>
  );
}

export function Empty({ children = 'Nothing here yet.' }) {
  return (
    <div style={{
      textAlign: 'center', padding: '32px 16px',
      color: EMPTY, fontSize: 13, fontFamily: FONT_BODY,
    }}>
      {children}
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
export function Skeleton({ height = 14, width = '100%', style }) {
  return (
    <div style={{
      height, width, borderRadius: 6,
      background: `linear-gradient(90deg, ${LINE} 25%, #f6f3ec 37%, ${LINE} 63%)`,
      backgroundSize: '400% 100%',
      animation: 'fa-shimmer 1.3s ease-in-out infinite',
      ...style,
    }} />
  );
}

export function SkeletonTiles({ count = 4 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: 12,
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} style={{ padding: '13px 15px' }}>
          <Skeleton height={10} width="60%" style={{ marginBottom: 10 }} />
          <Skeleton height={22} width="75%" />
        </Card>
      ))}
    </div>
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────────
export function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 26, left: '50%', transform: 'translateX(-50%)',
      background: INK, color: '#fff',
      padding: '11px 22px', borderRadius: 22,
      fontSize: 13, fontFamily: FONT_BODY, zIndex: 100,
      boxShadow: '0 8px 28px rgba(26,18,8,.25)',
    }}>
      {message}
    </div>
  );
}
