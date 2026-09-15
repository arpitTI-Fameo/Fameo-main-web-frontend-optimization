
// NOTE: DISPLAY FALLBACKS only, used when the backend hasn't supplied
// billing_options. Real prices + billing_id come from Plan.billing_options.
// For the 12-month tab to price correctly, the backend must return a 12-month
// billing option per plan (see BILLING_IDS).
export const PRICES = {
    // pro:     { 1: 799,   3: 2037,  6: 3835,  12: 7195  },
    popular: { 1: 1599, 3: 4077, 6: 7675, 12: 14391 },
    elite: { 1: 3199, 3: 8157, 6: 15355, 12: 28791 },
};
export const BILLING_IDS = {
    // pro:     { 1: 3, 3: 2, 6: 1, 12: ? },
    popular: { 1: 6, 3: 5, 6: 4 /* , 12: ? */ },
    elite: { 1: 9, 3: 8, 6: 7 /* , 12: ? */ },
};
export const FROM_LABELS = {
    '/products': 'the Creator Store',
    '/community': 'the Community',
    '/talent-hire': 'Talent Hire',
};


export const DURATIONS = [
    { months: 1, label: '1 Month' },
    { months: 3, label: '3 Months', badge: '-15%' },
    { months: 6, label: '6 Months', badge: '-20%' },
    { months: 12, label: '12 Months', badge: '-25%' },
];

// Savings vs paying month-to-month, by duration. DISPLAY ONLY — reconcile with
// the real backend discounts on each billing option.
export const SAVE_PCT = { 1: 0, 3: 15, 6: 20, 12: 25 };
