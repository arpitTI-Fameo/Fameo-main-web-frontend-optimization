/* ── utils ─────────────────────────────────────────────────────── */
import { DEFAULT_LOCALE } from '@/constants/locale';
import { MINUTES_PER_DAY } from './constants';

export const formatINR = (paise) => {
  if (paise == null) return "—";
  const r = paise / 100;
  return "₹" + r.toLocaleString(DEFAULT_LOCALE, { maximumFractionDigits: r % 1 === 0 ? 0 : 2 });
};

/* ── the day clock ─────────────────────────────────────────────── */

/* Minutes past midnight, wrapped into a single day. Scrubbing off either
   end of the ruler comes back round instead of stopping dead. */
export const wrapMinutes = (m) => ((m % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;

export const minutesNow = (d = new Date()) => d.getHours() * 60 + d.getMinutes();

export const formatClock = (minutes) => {
  const m = wrapMinutes(Math.round(minutes));
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
};

/* Which scene owns a given minute. Scenes are listed in clock order and
   each runs until the next one starts, so this walks forward and keeps the
   last window it passed. The fallback is the final scene, not the first:
   anything before the earliest `from` is still inside last night. */
export const sceneAt = (minutes, scenes) => {
  if (!scenes?.length) return null;
  const m = wrapMinutes(minutes);
  let found = scenes[scenes.length - 1];
  for (const s of scenes) if (m >= s.from) found = s;
  return found;
};
