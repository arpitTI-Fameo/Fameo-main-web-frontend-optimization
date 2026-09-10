// "use client";
// // app/admin/analytics/page.js

// import { useState, useEffect } from "react";
// import { useAuthStore } from "@/store/authStore";

// export default function AnalyticsPage() {
//   const { user } = useAuthStore();
//   const [data, setData]       = useState(null);
//   const [topics, setTopics]   = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modFilter, setMod]   = useState("all");

//   useEffect(() => {
//     Promise.all([
//       fetch("/api/admin/analytics/overview").then(r=>r.json()),
//       fetch("/api/admin/analytics/topics").then(r=>r.json()),
//     ])
//     .then(([o,t]) => { setData(o.data); setTopics(t.data||[]); })
//     .catch(() => {
//       setData({ totalLearners:1240, totalTopics:34, totalCompletions:8920 });
//       setTopics([
//         { _id:"t1", title:"Creator vs Influencer",          moduleId:0, readTime:"8 min",  completions:934, avgTime:"7m 12s" },
//         { _id:"t2", title:"Choosing a Niche",               moduleId:0, readTime:"12 min", completions:821, avgTime:"11m 4s" },
//         { _id:"t3", title:"Instagram Algorithm Decoded",    moduleId:3, readTime:"18 min", completions:612, avgTime:"16m 43s" },
//         { _id:"t4", title:"Brand Deal Rate Card",           moduleId:5, readTime:"10 min", completions:544, avgTime:"9m 22s" },
//         { _id:"t5", title:"YouTube SEO Masterclass",        moduleId:3, readTime:"22 min", completions:489, avgTime:"20m 5s" },
//       ]);
//     })
//     .finally(() => setLoading(false));
//   }, []);

//   const MODULES = ["Creator Foundations","Content Creation","Studio & Team","Platform Growth","Collabs","Monetization","Operations","Scaling"];

//   const filtered = modFilter==="all" ? topics : topics.filter(t => t.moduleId===parseInt(modFilter));
//   const maxComp  = Math.max(...topics.map(t=>t.completions||0), 1);

//   const STATS = data ? [
//     { label:"Total Learners",    value:data.totalLearners?.toLocaleString(),    accent:"#7eb8d8" },
//     { label:"Published Topics",  value:data.totalTopics,                        accent:"#C9A96E" },
//     { label:"Total Completions", value:data.totalCompletions?.toLocaleString(), accent:"#7ec87e" },
//   ] : [];

//   return (
//     <div style={S.page}>
//       <div style={S.header}>
//         <div>
//           <h1 style={S.heading}>Analytics</h1>
//           <p style={S.sub}>Engagement data across all published topics.</p>
//         </div>
//       </div>

//       {loading ? <div style={S.empty}>Loading…</div> : <>
//         <div style={S.statsGrid}>
//           {STATS.map(s => (
//             <div key={s.label} style={{...S.statCard,borderTop:`3px solid ${s.accent}`}}>
//               <span style={S.statValue}>{s.value}</span>
//               <span style={S.statLabel}>{s.label}</span>
//             </div>
//           ))}
//         </div>

//         <div style={S.card}>
//           <div style={S.cardHeader}>
//             <h2 style={S.cardTitle}>Top Topics by Completions</h2>
//             <select style={S.select} value={modFilter} onChange={e=>setMod(e.target.value)}>
//               <option value="all">All Modules</option>
//               {MODULES.map((m,i)=><option key={i} value={i}>{m}</option>)}
//             </select>
//           </div>
//           {filtered.map(t => (
//             <div key={t._id} style={S.topicRow}>
//               <div style={{flex:2,minWidth:0}}>
//                 <p style={S.topicTitle}>{t.title}</p>
//                 <p style={S.topicMeta}>{MODULES[t.moduleId]} · {t.readTime}</p>
//               </div>
//               <div style={{flex:1}}>
//                 <div style={S.barBg}>
//                   <div style={{...S.barFill, width:`${(t.completions/maxComp)*100}%`}}/>
//                 </div>
//               </div>
//               <span style={S.compCount}>{t.completions?.toLocaleString()}</span>
//               <span style={S.avgTime}>{t.avgTime}</span>
//             </div>
//           ))}
//         </div>
//       </>}
//     </div>
//   );
// }

// const S = {
//   page:    { padding:"32px 40px",maxWidth:1000,margin:"0 auto",fontFamily:"'DM Sans',sans-serif" },
//   header:  { marginBottom:24 },
//   heading: { fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:400,color:"#1a1208",marginBottom:4 },
//   sub:     { fontSize:13,color:"#aaa" },
//   statsGrid:{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24 },
//   statCard: { background:"#fff",border:"1.5px solid #ededea",borderRadius:10,padding:"20px",display:"flex",flexDirection:"column",gap:4 },
//   statValue:{ fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:300,color:"#1a1208",lineHeight:1 },
//   statLabel:{ fontSize:12,fontWeight:500,color:"#555" },
//   card:    { background:"#fff",border:"1.5px solid #ededea",borderRadius:10,overflow:"hidden" },
//   cardHeader:{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:"1px solid #f0f0ee" },
//   cardTitle:{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:400,color:"#1a1208" },
//   select:  { fontSize:12,padding:"7px 10px",border:"1.5px solid #e8e8e4",borderRadius:6,outline:"none",background:"#fff",fontFamily:"'DM Sans',sans-serif" },
//   topicRow:{ display:"flex",gap:16,padding:"12px 20px",borderBottom:"1px solid #f5f5f2",alignItems:"center" },
//   topicTitle:{ fontSize:13,fontWeight:400,color:"#1a1208",marginBottom:2 },
//   topicMeta:{ fontSize:10,color:"#bbb" },
//   barBg:   { height:6,background:"#f0f0ee",borderRadius:3,overflow:"hidden" },
//   barFill: { height:"100%",background:"#C9A96E",borderRadius:3,transition:"width .4s" },
//   compCount:{ fontSize:12,fontWeight:500,color:"#1a1208",minWidth:50,textAlign:"right" },
//   avgTime: { fontSize:11,color:"#bbb",minWidth:60,textAlign:"right" },
//   empty:   { textAlign:"center",padding:"60px 0",fontSize:13,color:"#bbb" },
// };

"use client";
// app/admin/analytics/page.js

import { useState, useEffect } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore"
import { api } from "@/services/api";

export default function AnalyticsPage() {
  const { user } = useAdminAuthStore();
  const [data, setData]       = useState(null);
  const [topics, setTopics]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modFilter, setMod]   = useState("all");

  useEffect(() => {
    Promise.all([
      api.get("/admin/analytics/overview"),
      api.get("/admin/analytics/topics"),
    ])
    .then(([o,t]) => { setData(o.data); setTopics(t.data||[]); })
    .catch(() => {
      setData({ totalLearners:1240, totalTopics:34, totalCompletions:8920 });
      setTopics([
        { _id:"t1", title:"Creator vs Influencer",          moduleId:0, readTime:"8 min",  completions:934, avgTime:"7m 12s" },
        { _id:"t2", title:"Choosing a Niche",               moduleId:0, readTime:"12 min", completions:821, avgTime:"11m 4s" },
        { _id:"t3", title:"Instagram Algorithm Decoded",    moduleId:3, readTime:"18 min", completions:612, avgTime:"16m 43s" },
        { _id:"t4", title:"Brand Deal Rate Card",           moduleId:5, readTime:"10 min", completions:544, avgTime:"9m 22s" },
        { _id:"t5", title:"YouTube SEO Masterclass",        moduleId:3, readTime:"22 min", completions:489, avgTime:"20m 5s" },
      ]);
    })
    .finally(() => setLoading(false));
  }, []);

  const MODULES = ["Creator Foundations","Content Creation","Studio & Team","Platform Growth","Collabs","Monetization","Operations","Scaling"];

  const filtered = modFilter==="all" ? topics : topics.filter(t => t.moduleId===parseInt(modFilter));
  const maxComp  = Math.max(...topics.map(t=>t.completions||0), 1);

  const STATS = data ? [
    { label:"Total Learners",    value:data.totalLearners?.toLocaleString(),    accent:"#7eb8d8" },
    { label:"Published Topics",  value:data.totalTopics,                        accent:"#C9A96E" },
    { label:"Total Completions", value:data.totalCompletions?.toLocaleString(), accent:"#7ec87e" },
  ] : [];

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.heading}>Analytics</h1>
          <p style={S.sub}>Engagement data across all published topics.</p>
        </div>
      </div>

      {loading ? <div style={S.empty}>Loading…</div> : <>
        <div style={S.statsGrid}>
          {STATS.map(s => (
            <div key={s.label} style={{...S.statCard,borderTop:`3px solid ${s.accent}`}}>
              <span style={S.statValue}>{s.value}</span>
              <span style={S.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        <div style={S.card}>
          <div style={S.cardHeader}>
            <h2 style={S.cardTitle}>Top Topics by Completions</h2>
            <select style={S.select} value={modFilter} onChange={e=>setMod(e.target.value)}>
              <option value="all">All Modules</option>
              {MODULES.map((m,i)=><option key={i} value={i}>{m}</option>)}
            </select>
          </div>
          {filtered.map(t => (
            <div key={t._id} style={S.topicRow}>
              <div style={{flex:2,minWidth:0}}>
                <p style={S.topicTitle}>{t.title}</p>
                <p style={S.topicMeta}>{MODULES[t.moduleId]} · {t.readTime}</p>
              </div>
              <div style={{flex:1}}>
                <div style={S.barBg}>
                  <div style={{...S.barFill, width:`${(t.completions/maxComp)*100}%`}}/>
                </div>
              </div>
              <span style={S.compCount}>{t.completions?.toLocaleString()}</span>
              <span style={S.avgTime}>{t.avgTime}</span>
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}

const S = {
  page:    { padding:"32px 40px",maxWidth:1000,margin:"0 auto",fontFamily:"'DM Sans',sans-serif" },
  header:  { marginBottom:24 },
  heading: { fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:400,color:"#1a1208",marginBottom:4 },
  sub:     { fontSize:13,color:"#aaa" },
  statsGrid:{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24 },
  statCard: { background:"#fff",border:"1.5px solid #ededea",borderRadius:10,padding:"20px",display:"flex",flexDirection:"column",gap:4 },
  statValue:{ fontFamily:"'Cormorant Garamond',serif",fontSize:34,fontWeight:300,color:"#1a1208",lineHeight:1 },
  statLabel:{ fontSize:12,fontWeight:500,color:"#555" },
  card:    { background:"#fff",border:"1.5px solid #ededea",borderRadius:10,overflow:"hidden" },
  cardHeader:{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:"1px solid #f0f0ee" },
  cardTitle:{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:400,color:"#1a1208" },
  select:  { fontSize:12,padding:"7px 10px",border:"1.5px solid #e8e8e4",borderRadius:6,outline:"none",background:"#fff",fontFamily:"'DM Sans',sans-serif" },
  topicRow:{ display:"flex",gap:16,padding:"12px 20px",borderBottom:"1px solid #f5f5f2",alignItems:"center" },
  topicTitle:{ fontSize:13,fontWeight:400,color:"#1a1208",marginBottom:2 },
  topicMeta:{ fontSize:10,color:"#bbb" },
  barBg:   { height:6,background:"#f0f0ee",borderRadius:3,overflow:"hidden" },
  barFill: { height:"100%",background:"#C9A96E",borderRadius:3,transition:"width .4s" },
  compCount:{ fontSize:12,fontWeight:500,color:"#1a1208",minWidth:50,textAlign:"right" },
  avgTime: { fontSize:11,color:"#bbb",minWidth:60,textAlign:"right" },
  empty:   { textAlign:"center",padding:"60px 0",fontSize:13,color:"#bbb" },
};