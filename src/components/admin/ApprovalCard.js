"use client";
// components/admin/ApprovalCard.js
// Reusable card used in overview + approvals pages

import { useState } from "react";

const TYPE_COLOR = {
  topic:   { bg:"#7ec87e22", color:"#3a7c3a" },
  product: { bg:"#C9A96E22", color:"#7a5a1a" },
  media:   { bg:"#7eb8d822", color:"#1a4a7a" },
};

export default function ApprovalCard({ item, onApprove, onReject, onChanges, compact = false }) {
  const [loading, setLoading] = useState(false);
  const tc = TYPE_COLOR[item.type] || { bg:"#eee", color:"#555" };

  const handle = async (action) => {
    setLoading(true);
    try {
      if (action === "approve")  await onApprove?.(item._id);
      if (action === "reject")   await onReject?.(item._id);
      if (action === "changes") {
        const notes = prompt("What changes are needed?");
        if (notes) await onChanges?.(item._id, notes);
      }
    } finally { setLoading(false); }
  };

  if (compact) return (
    <div style={SC.row}>
      <span style={{ ...SC.typePill, background:tc.bg, color:tc.color }}>{item.type}</span>
      <div style={SC.info}>
        <span style={SC.title}>{item.title}</span>
        <span style={SC.meta}>by {item.submittedByName} · {timeAgo(item.submittedAt)}</span>
      </div>
      <div style={SC.actions}>
        <button disabled={loading} onClick={() => handle("approve")} style={SC.btnA}>✓</button>
        <button disabled={loading} onClick={() => handle("reject")}  style={SC.btnR}>✕</button>
      </div>
    </div>
  );

  return (
    <div style={SF.card}>
      <div style={SF.top}>
        <span style={{ ...SF.typePill, background:tc.bg, color:tc.color }}>{item.type}</span>
        <span style={SF.time}>{timeAgo(item.submittedAt)}</span>
      </div>
      <h3 style={SF.title}>{item.title}</h3>
      <p style={SF.meta}>Submitted by <strong>{item.submittedByName}</strong> ({item.submittedByRole})</p>
      {item.notes && <p style={SF.notes}>Notes: {item.notes}</p>}
      <div style={SF.actions}>
        <button disabled={loading} onClick={() => handle("approve")} style={SF.btnApprove}>✓ Approve</button>
        <button disabled={loading} onClick={() => handle("changes")} style={SF.btnChanges}>Request Changes</button>
        <button disabled={loading} onClick={() => handle("reject")}  style={SF.btnReject}>✕ Reject</button>
      </div>
    </div>
  );
}

function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (d < 1) return "just now"; if (d < 60) return `${d}m ago`;
  if (d < 1440) return `${Math.floor(d/60)}h ago`; return `${Math.floor(d/1440)}d ago`;
}

// Compact styles
const SC = {
  row:     { display:"flex",alignItems:"center",gap:10,padding:"11px 20px",borderBottom:"1px solid #f5f5f2" },
  typePill:{ fontSize:9,letterSpacing:".1em",textTransform:"uppercase",padding:"2px 7px",borderRadius:3,fontWeight:600,flexShrink:0 },
  info:    { flex:1,minWidth:0 },
  title:   { display:"block",fontSize:12,fontWeight:400,color:"#1a1208",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:1 },
  meta:    { display:"block",fontSize:10,color:"#bbb" },
  actions: { display:"flex",gap:5,flexShrink:0 },
  btnA:    { fontSize:11,padding:"4px 8px",border:"1.5px solid #7ec87e44",background:"#7ec87e18",color:"#3a7c3a",borderRadius:4,cursor:"pointer",fontWeight:600 },
  btnR:    { fontSize:11,padding:"4px 8px",border:"1.5px solid #d4909044",background:"#d4909018",color:"#9a3030",borderRadius:4,cursor:"pointer",fontWeight:600 },
};

// Full card styles
const SF = {
  card:       { background:"#fff",border:"1.5px solid #ededea",borderRadius:10,padding:"18px 20px" },
  top:        { display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 },
  typePill:   { fontSize:9,letterSpacing:".1em",textTransform:"uppercase",padding:"3px 8px",borderRadius:3,fontWeight:600 },
  time:       { fontSize:10,color:"#bbb" },
  title:      { fontSize:15,fontWeight:400,color:"#1a1208",marginBottom:6 },
  meta:       { fontSize:12,color:"#aaa",marginBottom:6 },
  notes:      { fontSize:11,color:"#C9A96E",fontStyle:"italic",marginBottom:10 },
  actions:    { display:"flex",gap:8,marginTop:12 },
  btnApprove: { fontSize:11,padding:"7px 14px",border:"1.5px solid #7ec87e44",background:"#7ec87e18",color:"#3a7c3a",borderRadius:6,cursor:"pointer",fontWeight:500 },
  btnChanges: { fontSize:11,padding:"7px 14px",border:"1.5px solid #C9A96E44",background:"#C9A96E18",color:"#7a5a1a",borderRadius:6,cursor:"pointer" },
  btnReject:  { fontSize:11,padding:"7px 14px",border:"1.5px solid #d4909044",background:"#d4909018",color:"#9a3030",borderRadius:6,cursor:"pointer" },
};