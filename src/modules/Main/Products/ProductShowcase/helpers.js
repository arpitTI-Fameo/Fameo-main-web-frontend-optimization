/* ── utils ─────────────────────────────────────────────────────── */
import { DEFAULT_LOCALE } from '@/constants/locale';

export const formatINR = (paise) => {
  if (paise == null) return "—";
  const r = paise / 100;
  return "₹" + r.toLocaleString(DEFAULT_LOCALE, { maximumFractionDigits: r % 1 === 0 ? 0 : 2 });
};
