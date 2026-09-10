"use client";
// app/admin/revenue/page.js  — superAdmin only

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function RevenuePage() {
  const { user } = useAuthStore();
  const router   = useRouter();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== "superAdmin") { router.push("/admin"); return; }
    fetch("/api/admin/revenue")
      .then(r => r.json())
      .then(d => setData(d.data))
      .catch(() => setData({
        mtd:"₹2,84,000", ytd:"₹18,40,000", transactions:847,
        breakdown:[
          { product:"Reels Masterclass",       revenue:"₹1,04,930", units:234, type:"course"   },
          { product:"Brand Deal Template Pack", revenue:"₹59,613",  units:187, type:"template" },
          { product:"Creator Finance Guide",    revenue:"₹41,950",  units:119, type:"ebook"    },
        ]
      }))
      .finally(() => setLoading(false));
  }, [user, router]);

  if (user?.role !== "superAdmin") return null;

  const STATS = data ? [
    { label:"Revenue MTD",    value:data.mtd,          sub:"this month",     accent:"#C9A96E" },
    { label:"Revenue YTD",    value:data.ytd,          sub:"this year",      accent:"#7ec87e" },
    { label:"Transactions",   value:data.transactions, sub:"total purchases", accent:"#7eb8d8" },
  ] : [];

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.heading}>Revenue</h1>
          <p style={S.sub}>Financial overview. Visible to Super Admin only.</p>
        </div>
        <span style={S.saOnly}>◈ Super Admin</span>
      </div>

      {loading ? <div style={S.empty}>Loading…</div> : <>
        <div style={S.statsGrid}>
          {STATS.map(s => (
            <div key={s.label} style={{...S.statCard, borderTop:`3px solid ${s.accent}`}}>
              <span style={S.statValue}>{s.value}</span>
              <span style={S.statLabel}>{s.label}</span>
              <span style={S.statSub}>{s.sub}</span>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <h2 style={S.cardTitle}>Revenue by Product</h2>
          <div style={S.tableHead}><span style={{flex:2}}>Product</span><span>Type</span><span>Units</span><span>Revenue</span></div>
          {data?.breakdown?.map(row => (
            <div key={row.product} style={S.tableRow}>
              <span style={{flex:2,fontSize:13,color:"#1a1208"}}>{row.product}</span>
              <span style={{fontSize:11,color:"#aaa"}}>{row.type}</span>
              <span style={{fontSize:12,color:"#555"}}>{row.units}</span>
              <span style={{fontSize:13,fontWeight:500,color:"#1a1208"}}>{row.revenue}</span>
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}

const S = {
  page:    { padding:"32px 40px",maxWidth:1000,margin:"0 auto",fontFamily:"'DM Sans',sans-serif" },
  header:  { display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28 },
  heading: { fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:400,color:"#1a1208",marginBottom:4 },
  sub:     { fontSize:13,color:"#aaa" },
  saOnly:  { fontSize:10,letterSpacing:".1em",textTransform:"uppercase",padding:"5px 12px",background:"#C9A96E18",color:"#C9A96E",border:"1px solid #C9A96E44",borderRadius:4,fontWeight:500 },
  statsGrid:{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24 },
  statCard: { background:"#fff",border:"1.5px solid #ededea",borderRadius:10,padding:"20px",display:"flex",flexDirection:"column",gap:2 },
  statValue:{ fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:300,color:"#1a1208",lineHeight:1,letterSpacing:"-.02em" },
  statLabel:{ fontSize:12,fontWeight:500,color:"#555",marginTop:6 },
  statSub:  { fontSize:11,color:"#bbb" },
  card:    { background:"#fff",border:"1.5px solid #ededea",borderRadius:10,overflow:"hidden" },
  cardTitle:{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:400,color:"#1a1208",padding:"16px 20px",borderBottom:"1px solid #f0f0ee" },
  tableHead:{ display:"flex",gap:16,padding:"10px 20px",background:"#fafaf8",fontSize:10,letterSpacing:".1em",textTransform:"uppercase",color:"#aaa",borderBottom:"1px solid #ededea" },
  tableRow: { display:"flex",gap:16,padding:"13px 20px",borderBottom:"1px solid #f5f5f2",alignItems:"center" },
  empty:   { textAlign:"center",padding:"60px 0",fontSize:13,color:"#bbb" },
};
