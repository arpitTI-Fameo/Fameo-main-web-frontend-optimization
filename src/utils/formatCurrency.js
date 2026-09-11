// // lib/formatCurrency.js
// // Single source of truth for all currency formatting.
// // All prices in the app are stored in USD and displayed as INR.

// const USD_TO_INR = 84;

// /**
//  * Convert USD to INR and format as ₹ string.
//  * @param {number} usd
//  * @returns {string} e.g. "₹29,316"
//  */
// export const inr = (usd) =>
//   `₹${(usd * USD_TO_INR).toLocaleString('en-IN')}`;

// /**
//  * Format a raw INR amount (already in rupees).
//  * @param {number} amount
//  * @returns {string} e.g. "₹1,29,000"
//  */
// export const formatINR = (amount) =>
//   `₹${amount.toLocaleString('en-IN')}`;

// export default inr;
// lib/formatCurrency.js
// Single source of truth for all currency formatting.
// All prices in the app are stored in USD and displayed as INR.

// Prices across the app are now real INR (rupees) from the products backend.
// (Previously the mock data was authored in a pseudo-USD unit and converted
//  here; that 84x multiply is wrong for real data, so it's disabled.)
const USD_TO_INR = 1;

/**
 * Convert USD to INR and format as ₹ string.
 * @param {number} usd
 * @returns {string} e.g. "₹29,316"
 */
export const inr = (usd) =>
  `₹${(usd * USD_TO_INR).toLocaleString('en-IN')}`;

/**
 * Format a raw INR amount (already in rupees).
 * @param {number} amount
 * @returns {string} e.g. "₹1,29,000"
 */
export const formatINR = (amount) =>
  `₹${amount.toLocaleString('en-IN')}`;

export default inr;