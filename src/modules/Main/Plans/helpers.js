'use client';
import { DEFAULT_LOCALE } from '@/constants/locale';

export const loadRazorpay = () => new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
});

// Money formatter. Backend prices can carry paise (e.g. 2332.2), so show two
// decimals when they do and none when they don't.
export const inr = (n) => {
    const v = Number(n) || 0;
    return v.toLocaleString(DEFAULT_LOCALE, {
        minimumFractionDigits: Number.isInteger(v) ? 0 : 2,
        maximumFractionDigits: 2,
    });
};
