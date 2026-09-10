// modules/Admin/Analytics/styles.js

export const S = {
  page: { padding: "32px 40px", maxWidth: 1000, margin: "0 auto", fontFamily: "'DM Sans',sans-serif" },
  header: { marginBottom: 24 },
  heading: { fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 400, color: "#1a1208", marginBottom: 4 },
  sub: { fontSize: 13, color: "#aaa" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 },
  statCard: { background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, padding: "20px", display: "flex", flexDirection: "column", gap: 4 },
  statValue: { fontFamily: "'Cormorant Garamond',serif", fontSize: 34, fontWeight: 300, color: "#1a1208", lineHeight: 1 },
  statLabel: { fontSize: 12, fontWeight: 500, color: "#555" },
  card: { background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, overflow: "hidden" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #f0f0ee" },
  cardTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 400, color: "#1a1208" },
  select: { fontSize: 12, padding: "7px 10px", border: "1.5px solid #e8e8e4", borderRadius: 6, outline: "none", background: "#fff", fontFamily: "'DM Sans',sans-serif" },
  topicRow: { display: "flex", gap: 16, padding: "12px 20px", borderBottom: "1px solid #f5f5f2", alignItems: "center" },
  topicTitle: { fontSize: 13, fontWeight: 400, color: "#1a1208", marginBottom: 2 },
  topicMeta: { fontSize: 10, color: "#bbb" },
  barBg: { height: 6, background: "#f0f0ee", borderRadius: 3, overflow: "hidden" },
  barFill: { height: "100%", background: "#C9A96E", borderRadius: 3, transition: "width .4s" },
  compCount: { fontSize: 12, fontWeight: 500, color: "#1a1208", minWidth: 50, textAlign: "right" },
  avgTime: { fontSize: 11, color: "#bbb", minWidth: 60, textAlign: "right" },
  empty: { textAlign: "center", padding: "60px 0", fontSize: 13, color: "#bbb" },
};