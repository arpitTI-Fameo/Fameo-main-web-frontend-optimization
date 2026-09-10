/* ── utils ─────────────────────────────────────────────────────── */
export const formatINR = (paise) => {
  if (paise == null) return "—";
  const r = paise / 100;
  return "₹" + r.toLocaleString("en-IN", { maximumFractionDigits: r % 1 === 0 ? 0 : 2 });
};
