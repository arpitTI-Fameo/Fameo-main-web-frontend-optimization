import { DEFAULT_LOCALE } from '@/constants/locale';

export const fmtINR = (n) => `₹${Number(n || 0).toLocaleString(DEFAULT_LOCALE)}`;
export const fmtDate = (d) => d ? new Date(d).toLocaleDateString(DEFAULT_LOCALE, { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
export const fmtShort = (d) => d ? new Date(d).toLocaleDateString(DEFAULT_LOCALE, { day: 'numeric', month: 'short', year: 'numeric' }) : '—';


