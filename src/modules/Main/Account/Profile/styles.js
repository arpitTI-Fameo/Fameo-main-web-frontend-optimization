export const INK  = "#1a1208";
export const GOLD = "#C9A96E";


export const S = {
  page:        { maxWidth: 880, margin: "0 auto", padding: "36px 32px", fontFamily: "'DM Sans',sans-serif", color: INK },
  centered:    { minHeight: "50vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'DM Sans',sans-serif", color: "#8a8275", fontSize: 14 },

  hero:        { display: "flex", alignItems: "center", gap: 24, padding: "4px 0 28px", borderBottom: "1.5px solid #ece8de", marginBottom: 28 },
  eyebrow:     { display: "block", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: GOLD, fontWeight: 600, marginBottom: 6 },
  name:        { fontFamily: "'Cormorant Garamond',serif", fontSize: 34, fontWeight: 500, color: INK, margin: 0, lineHeight: 1.05 },
  username:    { fontSize: 13.5, color: "#7a7264", margin: "4px 0 0" },
  badgeRow:    { display: "flex", flexWrap: "wrap", gap: 7, marginTop: 12 },
  statusChip:  { fontSize: 10.5, letterSpacing: ".04em", fontWeight: 600, padding: "3px 9px", borderRadius: 20 },

  section:     { marginBottom: 26 },
  sectionLabel:{ fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "#8a8275", fontWeight: 600, marginBottom: 12 },
  grid:        { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 },

  field:       { background: "#fff", border: "1.5px solid #ece8de", borderRadius: 10, padding: "12px 14px" },
  fieldLabel:  { display: "block", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#a8a092", fontWeight: 600, marginBottom: 5 },
  fieldValue:  { display: "block", fontSize: 14, color: INK, fontWeight: 500, wordBreak: "break-word" },
  empty:       { color: "#c8c2b4" },

  docRow:      { display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: "#fff", border: "1.5px solid #ece8de", borderRadius: 10, textDecoration: "none" },
  docIcon:     { fontSize: 16, color: GOLD },
  docName:     { display: "block", fontSize: 13.5, color: INK, fontWeight: 500 },
  docTag:      { display: "block", fontSize: 11, color: "#8a8275", textTransform: "capitalize", marginTop: 1 },
  docOpen:     { fontSize: 11.5, color: GOLD, fontWeight: 600, whiteSpace: "nowrap" },
};