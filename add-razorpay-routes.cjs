#!/usr/bin/env node
/*
 * add-razorpay-routes.js
 *
 * Adds the Razorpay order/verify routes to YOUR services/subscription.service.js
 * without replacing the file, so exports like getTransactions survive.
 *
 * Run from the repo root:
 *     node add-razorpay-routes.js
 *
 * Safe to run twice — it detects work already applied and skips it.
 * Writes a .bak alongside the original before touching anything.
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join('services', 'subscription.service.js');

const ENDPOINT_ANCHOR = "verifyPayment:  '/subscriptions/verify-payment',";
const ENDPOINT_ADDITION = `
  // Current flow — Web Subscription & Referral Discount Integration §4, §6.
  // The pair above is legacy: §6 forbids calling it after a Razorpay success.
  razorpayOrder:  '/subscriptions/razorpay/order',
  razorpayVerify: '/subscriptions/razorpay/verify',`;

const EXPORTS_ADDITION = `

// ─── Razorpay (current flow) ────────────────────────────────────────────────
// §4: send ONLY billing_id + idempotency_key. No plan_id, coupon, discount,
// duration or amount — the backend prices the order and applies any referral
// benefit linked to the authenticated user.
export const createRazorpayOrder = ({ billing_id, idempotency_key }) =>
  call(ENDPOINTS.razorpayOrder, {
    method: 'POST',
    body: { billing_id, idempotency_key },
  });

// §6: the only thing that activates a subscription. Payment is not complete
// until this succeeds.
export const verifyRazorpayPayment = ({
  razorpay_order_id, razorpay_payment_id, razorpay_signature,
}) =>
  call(ENDPOINTS.razorpayVerify, {
    method: 'POST',
    body: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
  });

// §4: 8–100 chars, letters/numbers/underscores/hyphens. One key per checkout
// ATTEMPT, reused on retry of that same attempt.
export const newCheckoutAttemptId = () => {
  const uuid = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : \`\${Date.now()}-\${Math.random().toString(36).slice(2)}-\${Math.random().toString(36).slice(2)}\`;
  return \`web_checkout_\${uuid.replace(/-/g, '_')}\`.slice(0, 100);
};
`;

function fail(msg) {
  console.error(`\n  ✗ ${msg}\n`);
  process.exit(1);
}

if (!fs.existsSync(FILE)) {
  fail(`${FILE} not found. Run this from the repo root.`);
}

const original = fs.readFileSync(FILE, 'utf8');
let out = original;
const done = [];
const skipped = [];

// The additions reference call() and ENDPOINTS. If the live file renamed
// either, stop rather than write something that won't compile.
if (!/\bfunction call\s*\(|\bconst call\s*=/.test(original)) {
  fail("No call() helper found — your file's structure differs from what this patch expects. Apply the two additions by hand instead.");
}
if (!/export const ENDPOINTS\s*=/.test(original)) {
  fail('No exported ENDPOINTS object found. Apply the two additions by hand instead.');
}

// 1. endpoints
if (original.includes('razorpayOrder:')) {
  skipped.push('ENDPOINTS entries (already present)');
} else {
  const count = original.split(ENDPOINT_ANCHOR).length - 1;
  if (count !== 1) {
    fail(`Expected exactly one active "${ENDPOINT_ANCHOR}" line, found ${count}. Apply by hand.`);
  }
  out = out.replace(ENDPOINT_ANCHOR, ENDPOINT_ANCHOR + ENDPOINT_ADDITION);
  done.push('ENDPOINTS.razorpayOrder + ENDPOINTS.razorpayVerify');
}

// 2. exports — appended at end of file so nothing existing shifts
if (original.includes('export const createRazorpayOrder')) {
  skipped.push('Razorpay exports (already present)');
} else {
  out = out.trimEnd() + '\n' + EXPORTS_ADDITION;
  done.push('createRazorpayOrder, verifyRazorpayPayment, newCheckoutAttemptId');
}

if (!done.length) {
  console.log('\n  Nothing to do — this file is already patched.\n');
  process.exit(0);
}

fs.writeFileSync(`${FILE}.bak`, original);
fs.writeFileSync(FILE, out);

console.log(`\n  ✓ Patched ${FILE}`);
done.forEach((d) => console.log(`      added:   ${d}`));
skipped.forEach((d) => console.log(`      skipped: ${d}`));
console.log(`\n  Backup written to ${FILE}.bak`);

// Report the export surface so you can eyeball that nothing vanished.
const exportNames = [...out.matchAll(/^export (?:const|class|function)\s+(\w+)/gm)].map((m) => m[1]);
console.log(`\n  Exports now in the file (${exportNames.length}):`);
console.log(`      ${exportNames.join(", ")}\n`);
