// modules/Admin/Roles/styles.js

export const KEYFRAMES = `
@keyframes toastIn { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
@keyframes modalIn { from { opacity:0; transform:translateY(10px) scale(.99) } to { opacity:1; transform:translateY(0) scale(1) } }
@media (prefers-reduced-motion: reduce) { * { animation:none !important } }
`;

/* ── Styles ── */
export const INK = "#1a1208";
export const GOLD = "#C9A96E";

export const S = {
  page: { padding: "36px 44px", maxWidth: 1320, margin: "0 auto", fontFamily: "'DM Sans',sans-serif", color: INK, background: "#FAF7F0", minHeight: "100vh" },
  toast: { position: "fixed", top: 22, right: 22, zIndex: 9999, padding: "12px 20px", borderRadius: 9, color: "#F0E8D6", fontSize: 13, fontWeight: 500, boxShadow: "0 10px 34px rgba(26,18,8,.28)", display: "flex", alignItems: "center", gap: 9, animation: "toastIn .25s ease" },

  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 22 },
  eyebrow: { display: "block", fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: GOLD, fontWeight: 600, marginBottom: 7 },
  heading: { fontFamily: "'Cormorant Garamond',serif", fontSize: 34, fontWeight: 500, color: INK, margin: 0, lineHeight: 1 },
  newBtn: { fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", padding: "11px 22px", background: INK, color: "#F0E8D6", border: "none", borderRadius: 7, cursor: "pointer", fontWeight: 500, fontFamily: "'DM Sans',sans-serif", transition: "transform .12s" },

  statStrip: { display: "flex", alignItems: "center", gap: 0, background: "#fff", border: "1.5px solid #ece8de", borderRadius: 12, padding: "16px 8px", marginBottom: 30, boxShadow: "0 1px 2px rgba(26,18,8,.03)" },
  stat: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "0 12px" },
  statNum: { fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 600, lineHeight: 1, fontVariantNumeric: "tabular-nums" },
  statLabel: { fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "#8a8275", fontWeight: 600 },
  statDiv: { width: 1, height: 34, background: "#ece8de" },

  sectionLabel: { fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "#8a8275", fontWeight: 600, marginBottom: 12 },
  roleCards: { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 32 },
  roleCard: { display: "flex", background: "#fff", border: "1.5px solid #ece8de", borderRadius: 11, overflow: "hidden", boxShadow: "0 1px 2px rgba(26,18,8,.03)" },
  roleRail: { width: 4, flexShrink: 0 },
  roleCardInner: { padding: "14px 15px", flex: 1, minWidth: 0 },
  roleChip: { fontSize: 12, fontWeight: 600, letterSpacing: ".01em" },
  countBadge: { fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 20, fontVariantNumeric: "tabular-nums", minWidth: 12, textAlign: "center" },
  roleDesc: { fontSize: 11, color: "#6b6456", lineHeight: 1.55, margin: "0 0 11px", minHeight: 34 },
  permWrap: { display: "flex", flexWrap: "wrap", gap: 5 },
  permPill: { fontSize: 9, letterSpacing: ".06em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 5, fontWeight: 600, border: "1px solid" },

  filters: { display: "flex", gap: 14, marginBottom: 18, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" },
  searchWrap: { position: "relative", display: "flex", alignItems: "center" },
  searchIcon: { position: "absolute", left: 13, fontSize: 15, color: "#b8b0a2", pointerEvents: "none" },
  search: { fontSize: 13, padding: "10px 14px 10px 34px", border: "1.5px solid #ddd6c8", borderRadius: 9, outline: "none", width: 260, fontFamily: "'DM Sans',sans-serif", background: "#fff", color: INK },
  roleTabs: { display: "flex", gap: 6, flexWrap: "wrap" },
  roleTab: { fontSize: 10.5, letterSpacing: ".04em", padding: "7px 14px", border: "1.5px solid", borderRadius: 22, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .15s", fontWeight: 500, fontVariantNumeric: "tabular-nums" },

  table: { background: "#fff", border: "1.5px solid #ece8de", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(26,18,8,.04)" },
  thead: { display: "flex", alignItems: "center", padding: "12px 20px 12px 24px", background: "#f3efe5", borderBottom: "1.5px solid #e6e1d6", fontSize: 9.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#7a7264", gap: 12, fontWeight: 600 },
  trow: { position: "relative", display: "flex", alignItems: "center", padding: "13px 20px 13px 24px", borderBottom: "1px solid #f4f1e9", gap: 12, transition: "background .12s" },
  rowRail: { position: "absolute", left: 0, top: 0, bottom: 0, width: 3 },
  empty: { textAlign: "center", padding: "56px 20px", fontSize: 13.5, color: "#a8a092", background: "#fff", border: "1.5px solid #ece8de", borderRadius: 12, lineHeight: 1.6 },

  avatar: { width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13.5, fontWeight: 600, flexShrink: 0, border: "1.5px solid" },
  userName: { display: "flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 500, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  youTag: { fontSize: 8.5, letterSpacing: ".1em", textTransform: "uppercase", color: GOLD, background: GOLD + "18", padding: "2px 6px", borderRadius: 4, fontWeight: 600 },
  userEmail: { display: "block", fontSize: 11.5, color: "#7a7264", marginTop: 1 },

  roleSelect: { fontSize: 11.5, padding: "6px 11px", border: "1.5px solid", borderRadius: 7, fontFamily: "'DM Sans',sans-serif", fontWeight: 500, outline: "none", maxWidth: "100%" },
  modulesBtn: { fontSize: 11, padding: "6px 12px", border: "1.5px solid #6aa8cf44", borderRadius: 7, background: "#6aa8cf0c", color: "#1a4a7a", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 500 },
  dash: { fontSize: 12, color: "#c8c2b4" },
  statusPill: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 9.5, letterSpacing: ".08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 20, fontWeight: 600 },
  statusDot: { width: 5, height: 5, borderRadius: "50%" },
  metaCell: { flex: 1, fontSize: 12, color: "#6b6456", fontVariantNumeric: "tabular-nums" },
  actionBtn: { fontSize: 10.5, padding: "6px 12px", border: "1.5px solid #ddd6c8", borderRadius: 7, background: "#fff", cursor: "pointer", color: "#4a4338", fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap", fontWeight: 500, transition: "all .12s" },
};

export const M = {
  overlay: { position: "fixed", inset: 0, background: "rgba(26,18,8,0.5)", backdropFilter: "blur(3px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  box: { background: "#fffdf9", borderRadius: 14, padding: "26px", width: "100%", maxWidth: 520, boxShadow: "0 24px 70px rgba(26,18,8,0.32)", border: "1px solid #ece8de", animation: "modalIn .22s cubic-bezier(.22,1,.36,1)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 },
  eyebrow: { display: "block", fontSize: 9.5, letterSpacing: ".18em", textTransform: "uppercase", color: "#a8a092", fontWeight: 600, marginBottom: 5 },
  title: { fontFamily: "'Cormorant Garamond',serif", fontSize: 23, fontWeight: 500, color: INK, margin: 0, lineHeight: 1.1 },
  close: { background: "none", border: "none", fontSize: 17, cursor: "pointer", color: "#b8b0a2", lineHeight: 1, padding: 4 },
  body: { fontSize: 13, color: "#7a7264", lineHeight: 1.65, marginBottom: 16 },
  label: { display: "block", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "#a8a092", marginBottom: 7, fontWeight: 600 },
  hint: { color: "#c0b9aa", fontWeight: 400, textTransform: "none", letterSpacing: 0, marginLeft: 6 },
  input: { width: "100%", fontSize: 13.5, padding: "10px 13px", border: "1.5px solid #e6e1d6", borderRadius: 9, outline: "none", fontFamily: "'DM Sans',sans-serif", background: "#fff", color: INK, boxSizing: "border-box" },
  select: { width: "100%", fontSize: 13.5, padding: "10px 13px", border: "1.5px solid #e6e1d6", borderRadius: 9, outline: "none", background: "#fff", fontFamily: "'DM Sans',sans-serif", cursor: "pointer", color: INK, boxSizing: "border-box" },
  roleNote: { marginTop: 9, padding: "10px 12px", borderRadius: 9, border: "1px solid" },
  err: { fontSize: 12, color: "#9a3030", margin: 0, background: "#9a30300d", padding: "8px 12px", borderRadius: 7, border: "1px solid #9a303022" },
  danger: { background: "#9a30300d", border: "1px solid #9a303026", borderRadius: 9, padding: "13px 15px", marginBottom: 16, fontSize: 12.5, color: "#8a2828", lineHeight: 1.6 },
  code: { background: "#f4f1e9", padding: "2px 7px", borderRadius: 4, fontSize: 12.5, color: INK, fontFamily: "ui-monospace,monospace" },
  footer: { display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22, paddingTop: 18, borderTop: "1px solid #ece8de" },
  cancelBtn: { fontSize: 12, padding: "10px 18px", border: "1.5px solid #e6e1d6", borderRadius: 7, background: "#fff", cursor: "pointer", color: "#6b6456", fontWeight: 500, fontFamily: "'DM Sans',sans-serif" },
  primaryBtn: { fontSize: 12, padding: "10px 22px", border: "none", borderRadius: 7, background: INK, cursor: "pointer", color: "#F0E8D6", fontWeight: 500, fontFamily: "'DM Sans',sans-serif", transition: "opacity .2s" },
};
