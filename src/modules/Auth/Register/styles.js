// modules/Auth/Register/styles.js
// Register-only Tailwind class fragments that dress the shadcn components in
// the steps, plus the keyframes the OTP dialog and the live-selfie camera
// animate with (RegisterContainer renders KEYFRAMES once in a <style>). The
// fragments shared with login — fields, buttons, motion — live in
// @/constants/authUi. Everything expects the `.fameo-theme.fameo-fixed-scale`
// wrapper from AuthShell, so spacing and text utilities are 1:1 px.
//
// Breakpoints: Tailwind's `max-[651px]:` means width < 651px, i.e. the
// handoff's `max-width: 650px`.

import { INPUT, PORTAL_THEME } from '@/constants/authUi';

export const KEYFRAMES = `
  @keyframes frgShake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-3px); } }
  @keyframes frgPulse { 50% { opacity: .35; } }
  @keyframes camLiveDot {
    0% { box-shadow: 0 0 0 0 rgb(233 30 99 / .6); }
    70% { box-shadow: 0 0 0 8px rgb(233 30 99 / 0); }
    100% { box-shadow: 0 0 0 0 rgb(233 30 99 / 0); }
  }
  @keyframes camSweep { 0% { top: -12%; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { top: 96%; opacity: 0; } }
  @keyframes camCountPop { from { opacity: 0; transform: scale(1.7); } 60% { opacity: 1; } to { opacity: 1; transform: scale(1); } }
  @keyframes camEyeBlink { 0%, 36%, 54%, 100% { transform: scaleY(1); } 45% { transform: scaleY(.06); } }
  @keyframes camFlash { 0% { opacity: 1; } 100% { opacity: 0; } }
  @keyframes camCoachIn { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: none; } }
`;

/* ── fields ─────────────────────────────────────────────────────────────── */

// shadcn SelectTrigger. It sizes itself with `data-[size=default]:h-9`, which
// outranks a bare `h-*`, so the height is set on the same variant.
export const SELECT_TRIGGER = `${INPUT} w-full data-[size=default]:h-11.25 data-[placeholder]:text-muted-foreground/60 [&>svg]:size-3.5`;
export const SELECT_CONTENT = `${PORTAL_THEME} max-h-72 rounded-[9px] border-border shadow-fameo-soft`;
export const SELECT_ITEM = 'rounded-md py-2 text-xs focus:bg-accent focus:text-accent-foreground';

// CalendarPicker's trigger is a shadcn outline Button.
export const DATE_TRIGGER = `${INPUT} has-[>svg]:px-3 hover:bg-muted/50 hover:text-foreground [&>svg]:size-4 [&>svg]:text-muted-foreground [&>svg]:transition-[color,scale] [&>svg]:duration-300 focus:[&>svg]:scale-108 focus:[&>svg]:text-primary data-[state=open]:border-primary data-[state=open]:bg-background data-[state=open]:ring-4 data-[state=open]:ring-primary/11 data-[state=open]:[&>svg]:text-primary`;
export const DATE_CONTENT = `${PORTAL_THEME} rounded-xl border-border shadow-fameo-soft`;

// A verified mobile / email field.
export const GROUP_VERIFIED = 'border-[#BFE3CD]';

// The small Verify / Verified button inside a field (InputGroupButton).
export const GROUP_ACTION = [
  'h-7.75 min-w-12.5 overflow-hidden rounded-md bg-accent px-2.25 text-10 font-normal text-brand-text',
  'transition-[background-color,color,scale] duration-300 hover:bg-primary/15 hover:text-brand-text active:scale-95',
  'disabled:opacity-100 [&_svg]:size-3 pointer-coarse:min-h-8.25',
].join(' ');
export const GROUP_ACTION_DONE = 'bg-[#E7F5EC] text-[#1E7447] hover:bg-[#E7F5EC] hover:text-[#1E7447]';
// Layers of the pill share one grid cell and swap by sliding 9px.
export const PILL_LAYER = 'col-start-1 row-start-1 flex items-center justify-center gap-1 transition-[opacity,translate] duration-300 ease-(--frg-ease)';

/* ── buttons ────────────────────────────────────────────────────────────── */

// Round icon Button (remove a file, remove a code).
export const ICON_BUTTON = 'size-6 shrink-0 rounded-full text-muted-foreground hover:bg-background hover:text-foreground [&_svg]:size-3.5';

/* ── choice tiles (ToggleGroupItem) ─────────────────────────────────────── */

export const TILE = [
  'relative h-auto flex-col items-center justify-center border border-border bg-muted/40 font-normal text-muted-foreground shadow-none',
  'transition-[background-color,border-color,color] duration-180 hover:border-primary/30 hover:bg-muted/40 hover:text-muted-foreground',
  'data-[state=on]:border-primary/40 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
].join(' ');

/* ── layout ─────────────────────────────────────────────────────────────── */

// Field grid: two equal columns, stacking on phones.
export const GRID = 'grid grid-cols-2 gap-x-3.5 gap-y-4.25 max-[651px]:gap-x-2.75 max-[651px]:gap-y-3.75';

// Collapsible trigger ("Have a referral code?").
export const DISCLOSURE = 'group flex min-h-7.5 cursor-pointer items-center gap-1.5 py-1.5 text-11 text-brand-muted outline-none focus-visible:underline';
export const DISCLOSURE_MARK = 'size-2 fill-current transition-transform duration-300 ease-(--frg-ease) group-data-[state=open]:rotate-90';
// Collapsible content: height follows Radix's measured size, the inner block
// eases in once it opens.
export const COLLAPSE = 'overflow-hidden data-[state=open]:animate-[collapsible-down_.45s_var(--frg-ease)] data-[state=closed]:animate-[collapsible-up_.3s_var(--frg-ease)]';
export const COLLAPSE_INNER = 'animate-[frgRefIn_.4s_var(--frg-ease)_.08s_both]';

// A single-row list item for documents (outline Button or plain row).
export const ROW = 'flex h-auto min-h-10.75 w-full items-center justify-start gap-2.25 rounded-[9px] border border-border bg-muted/40 px-3 py-2.5 text-11 font-normal text-secondary-foreground shadow-none';

