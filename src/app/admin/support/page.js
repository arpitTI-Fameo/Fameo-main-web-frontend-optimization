// "use client";
// // app/admin/support/page.js
// import { useState } from "react";
// export default function SupportPage() {
//   const [tickets] = useState([
//     { _id:"s1", subject:"Can't access Module 3",    learner:"Aarav Sharma",  status:"open",     created:new Date(Date.now()-3600000).toISOString()   },
//     { _id:"s2", subject:"Video not loading",         learner:"Priya Nair",    status:"open",     created:new Date(Date.now()-7200000).toISOString()   },
//     { _id:"s3", subject:"Certificate not received",  learner:"Rohit Verma",   status:"resolved", created:new Date(Date.now()-86400000).toISOString()  },
//     { _id:"s4", subject:"Wrong price shown",         learner:"Sneha K.",      status:"open",     created:new Date(Date.now()-172800000).toISOString() },
//   ]);
//   const [active, setActive] = useState(null);
//   const [reply, setReply]   = useState("");

//   return (
//     <div style={S.page}>
//       <div style={S.header}>
//         <h1 style={S.heading}>Support</h1>
//         <p style={S.sub}>{tickets.filter(t=>t.status==="open").length} open tickets</p>
//       </div>
//       <div style={S.layout}>
//         <div style={S.ticketList}>
//           {tickets.map(t=>(
//             <div key={t._id} onClick={()=>setActive(t)} style={{...S.ticket, background:active?._id===t._id?"#fef9f0":"#fff", borderLeft:active?._id===t._id?"3px solid #C9A96E":"3px solid transparent"}}>
//               <div style={S.ticketTop}>
//                 <span style={S.ticketSubject}>{t.subject}</span>
//                 <span style={{...S.statusDot, background:t.status==="open"?"#d49090":"#7ec87e"}}/>
//               </div>
//               <p style={S.ticketMeta}>{t.learner} · {timeAgo(t.created)}</p>
//             </div>
//           ))}
//         </div>
//         <div style={S.ticketDetail}>
//           {!active ? <div style={S.emptyDetail}>Select a ticket</div> : <>
//             <h2 style={S.detailTitle}>{active.subject}</h2>
//             <p style={S.detailMeta}>From <strong>{active.learner}</strong> · {timeAgo(active.created)}</p>
//             <div style={S.replyBox}>
//               <textarea style={S.replyInput} value={reply} onChange={e=>setReply(e.target.value)} placeholder="Type your reply…" rows={4}/>
//               <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:10}}>
//                 <button style={S.resolveBtn} onClick={()=>setActive(null)}>Mark Resolved</button>
//                 <button style={S.replyBtn} onClick={()=>{ alert("Reply sent!"); setReply(""); }}>Send Reply</button>
//               </div>
//             </div>
//           </>}
//         </div>
//       </div>
//     </div>
//   );
// }
// function timeAgo(iso){const d=Math.floor((Date.now()-new Date(iso))/60000);if(d<60)return `${d}m ago`;if(d<1440)return `${Math.floor(d/60)}h ago`;return `${Math.floor(d/1440)}d ago`;}
// const S={
//   page:{padding:"32px 40px",maxWidth:1100,margin:"0 auto",fontFamily:"'DM Sans',sans-serif"},
//   header:{marginBottom:24},
//   heading:{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:400,color:"#1a1208",marginBottom:4},
//   sub:{fontSize:13,color:"#aaa"},
//   layout:{display:"grid",gridTemplateColumns:"300px 1fr",gap:16,height:"calc(100vh - 220px)"},
//   ticketList:{background:"#fff",border:"1.5px solid #ededea",borderRadius:10,overflow:"auto"},
//   ticket:{padding:"14px 16px",borderBottom:"1px solid #f5f5f2",cursor:"pointer",transition:"background .1s",borderLeft:"3px solid transparent"},
//   ticketTop:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4},
//   ticketSubject:{fontSize:12,fontWeight:500,color:"#1a1208"},
//   statusDot:{width:7,height:7,borderRadius:"50%",flexShrink:0},
//   ticketMeta:{fontSize:10,color:"#bbb"},
//   ticketDetail:{background:"#fff",border:"1.5px solid #ededea",borderRadius:10,padding:"24px"},
//   emptyDetail:{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",fontSize:13,color:"#bbb"},
//   detailTitle:{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:400,color:"#1a1208",marginBottom:6},
//   detailMeta:{fontSize:12,color:"#aaa",marginBottom:20},
//   replyBox:{},
//   replyInput:{width:"100%",fontSize:13,padding:"12px",border:"1.5px solid #e8e8e4",borderRadius:8,outline:"none",resize:"vertical",fontFamily:"'DM Sans',sans-serif"},
//   resolveBtn:{fontSize:11,padding:"8px 16px",border:"1.5px solid #7ec87e44",background:"#7ec87e18",color:"#3a7c3a",borderRadius:6,cursor:"pointer"},
//   replyBtn:{fontSize:11,padding:"8px 16px",background:"#1a1208",color:"#F0E8D6",border:"none",borderRadius:6,cursor:"pointer",fontWeight:500},
// };

"use client";
// app/admin/support/page.js
// Support Agent + SuperAdmin — full ticket management with FAQ builder

import { useState, useEffect, useCallback } from "react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { api } from "@/services/api";
import { useSocket } from "@/hooks/useSocket";

const PRIORITY_COLOR = { high: "#d49090", medium: "#C9A96E", low: "#7eb8d8" };
const STATUS_COLOR   = { open: "#d49090", inProgress: "#C9A96E", resolved: "#7ec87e", closed: "#aaa" };

function timeAgo(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (d < 60) return `${d}m ago`;
  if (d < 1440) return `${Math.floor(d/60)}h ago`;
  return `${Math.floor(d/1440)}d ago`;
}

export default function SupportPage() {
  const { user } = useAdminAuthStore();
  const role = user?.role;

  const [tickets, setTickets]     = useState([]);
  const [faqs, setFaqs]           = useState([]);
  const [active, setActive]       = useState(null);
  const [reply, setReply]         = useState("");
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState("tickets"); // tickets | faq | lookup
  const [filterStatus, setFilter] = useState("open");
  const [searchQuery, setSearch]  = useState("");
  const [lookupResult, setLookup] = useState(null);
  const [lookupQuery, setLookupQ] = useState("");
  const [looking, setLooking]     = useState(false);
  const [sending, setSending]     = useState(false);
  const [toast, setToast]         = useState(null);
  const [newFaq, setNewFaq]       = useState({ question: "", answer: "" });

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

  const loadTickets = useCallback(async () => {
    try {
      const data = await api.get(`/admin/support/tickets?status=${filterStatus}`);
      setTickets(data?.data?.tickets || []);
    } catch {
      setTickets([
        { _id:"s1", subject:"Can't access Module 3",    learnerName:"Aarav Sharma",  learnerEmail:"aarav@example.com",  status:"open",       priority:"high",   created:new Date(Date.now()-3600000).toISOString(),   messages:[{from:"learner",text:"I paid but can't access module 3.",time:new Date(Date.now()-3600000).toISOString()}] },
        { _id:"s2", subject:"Video not loading",         learnerName:"Priya Nair",    learnerEmail:"priya@example.com",  status:"open",       priority:"medium", created:new Date(Date.now()-7200000).toISOString(),   messages:[{from:"learner",text:"Videos freeze at 2 minutes.",time:new Date(Date.now()-7200000).toISOString()}] },
        { _id:"s3", subject:"Certificate not received",  learnerName:"Rohit Verma",   learnerEmail:"rohit@example.com",  status:"resolved",   priority:"low",    created:new Date(Date.now()-86400000).toISOString(),  messages:[] },
        { _id:"s4", subject:"Wrong price shown",         learnerName:"Sneha Kumar",   learnerEmail:"sneha@example.com",  status:"open",       priority:"high",   created:new Date(Date.now()-172800000).toISOString(), messages:[{from:"learner",text:"The checkout shows ₹4999 but the landing page says ₹2999.",time:new Date(Date.now()-172800000).toISOString()}] },
        { _id:"s5", subject:"Progress not saving",       learnerName:"Ravi Patel",    learnerEmail:"ravi@example.com",   status:"inProgress", priority:"medium", created:new Date(Date.now()-259200000).toISOString(), messages:[] },
      ]);
    }
    setLoading(false);
  }, [filterStatus]);

  const loadFaqs = useCallback(async () => {
    try {
      const data = await api.get("/admin/support/faqs");
      setFaqs(data?.data?.faqs || []);
    } catch {
      setFaqs([
        { _id:"f1", question:"How do I access my enrolled courses?", answer:"Go to Resources → My Courses. All your enrolled courses appear there with progress tracking.", category:"Access" },
        { _id:"f2", question:"Can I download videos for offline viewing?", answer:"Currently, videos are streaming only. Offline downloads are on our roadmap for Q3 2025.", category:"Content" },
        { _id:"f3", question:"How do I get my certificate?", answer:"Complete all lessons in a course and click 'Claim Certificate' on the course completion screen.", category:"Certificates" },
      ]);
    }
  }, []);

  useEffect(() => { loadTickets(); }, [loadTickets]);
  useEffect(() => { if (tab === "faq") loadFaqs(); }, [tab, loadFaqs]);

  // Live — new ticket arrives
  useSocket({ "support:ticket_created": loadTickets, "support:ticket_updated": loadTickets });

  const sendReply = async () => {
    if (!reply.trim() || !active) return;
    setSending(true);
    try {
      await api.post(`/admin/support/tickets/${active._id}/reply`, { message: reply });
      setActive(prev => ({ ...prev, messages: [...(prev.messages||[]), { from:"admin", text:reply, time:new Date().toISOString() }] }));
      setReply("");
      showToast("Reply sent");
    } catch {
      showToast("Send failed", false);
    }
    setSending(false);
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/support/tickets/${id}`, { status });
      setTickets(prev => prev.map(t => t._id === id ? { ...t, status } : t));
      if (active?._id === id) setActive(prev => ({ ...prev, status }));
      showToast(status === "resolved" ? "Ticket resolved" : `Status: ${status}`);
    } catch { showToast("Update failed", false); }
  };

  const lookupLearner = async () => {
    if (!lookupQuery.trim()) return;
    setLooking(true);
    try {
      const data = await api.get(`/admin/contacts?search=${encodeURIComponent(lookupQuery)}&limit=5`);
      setLookup(data?.data?.users || []);
    } catch {
      setLookup([{ _id:"u1", name:"Aarav Sharma", email:"aarav@example.com", role:"learner", createdAt:new Date().toISOString(), orderCount:2 }]);
    }
    setLooking(false);
  };

  const addFaq = async () => {
    if (!newFaq.question || !newFaq.answer) return alert("Question and answer required");
    try {
      const data = await api.post("/admin/support/faqs", newFaq);
      setFaqs(prev => [data?.data || { ...newFaq, _id: Date.now().toString(), category:"General" }, ...prev]);
      setNewFaq({ question: "", answer: "" });
      showToast("FAQ added");
    } catch { showToast("Failed", false); }
  };

  const filteredTickets = tickets.filter(t => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (searchQuery && !t.subject.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !t.learnerName?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const openCount = tickets.filter(t => t.status === "open").length;

  return (
    <div style={S.page}>
      {toast && <div style={{ ...S.toast, background: toast.ok ? "#7ec87e" : "#d49090" }}>{toast.msg}</div>}

      <div style={S.header}>
        <div>
          <h1 style={S.heading}>Support Center</h1>
          <p style={S.sub}>{openCount} open tickets · Learner support queue</p>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:11, color:"#7ec87e", fontWeight:500 }}>◉ Live updates</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={S.tabRow}>
        {[
          { key:"tickets", label:`Open Tickets (${openCount})` },
          { key:"lookup",  label:"Learner Lookup" },
          { key:"faq",     label:"FAQ Builder" },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            ...S.tabBtn,
            borderBottom: tab === t.key ? "2px solid #C9A96E" : "2px solid transparent",
            color:        tab === t.key ? "#1a1208" : "#aaa",
            fontWeight:   tab === t.key ? 500 : 400,
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── TICKETS TAB ── */}
      {tab === "tickets" && (
        <div>
          {/* Filters */}
          <div style={S.filters}>
            <input style={S.search} placeholder="Search tickets…" value={searchQuery}
              onChange={e => setSearch(e.target.value)} />
            <select style={S.select} value={filterStatus} onChange={e => setFilter(e.target.value)}>
              <option value="open">Open</option>
              <option value="inProgress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
              <option value="all">All</option>
            </select>
          </div>

          <div style={S.layout}>
            {/* Ticket list */}
            <div style={S.ticketList}>
              {loading ? <div style={S.empty}>Loading…</div> :
               filteredTickets.length === 0 ? <div style={S.empty}>No tickets</div> :
               filteredTickets.map(t => (
                 <div key={t._id} onClick={() => setActive(t)}
                   style={{ ...S.ticket, background: active?._id===t._id ? "#fef9f0":"#fff", borderLeft: active?._id===t._id ? "3px solid #C9A96E":"3px solid transparent" }}>
                   <div style={S.ticketTop}>
                     <span style={S.ticketSubject}>{t.subject}</span>
                     <span style={{ ...S.priorityDot, background: PRIORITY_COLOR[t.priority] || "#aaa" }} title={t.priority} />
                   </div>
                   <p style={S.ticketMeta}>{t.learnerName} · {timeAgo(t.created)}</p>
                   <span style={{ ...S.statusBadge, background: (STATUS_COLOR[t.status]||"#aaa")+"22", color: STATUS_COLOR[t.status]||"#aaa" }}>
                     {t.status}
                   </span>
                 </div>
               ))
              }
            </div>

            {/* Ticket detail */}
            <div style={S.ticketDetail}>
              {!active ? (
                <div style={S.emptyDetail}>
                  <span style={{ fontSize: 24, marginBottom: 8 }}>◎</span>
                  <span>Select a ticket to view details</span>
                </div>
              ) : (
                <>
                  <div style={S.detailHeader}>
                    <div>
                      <h2 style={S.detailTitle}>{active.subject}</h2>
                      <p style={S.detailMeta}>
                        From <strong>{active.learnerName}</strong>
                        {active.learnerEmail && ` — ${active.learnerEmail}`}
                        {" · "}{timeAgo(active.created)}
                      </p>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      {active.status === "open" && (
                        <button style={S.inProgressBtn} onClick={() => updateStatus(active._id,"inProgress")}>
                          → In Progress
                        </button>
                      )}
                      {active.status !== "resolved" && (
                        <button style={S.resolveBtn} onClick={() => updateStatus(active._id,"resolved")}>
                          ✓ Resolve
                        </button>
                      )}
                      {active.status !== "closed" && (
                        <button style={S.closeBtn} onClick={() => updateStatus(active._id,"closed")}>
                          Close
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Message thread */}
                  <div style={S.messages}>
                    {(active.messages||[]).length === 0 ? (
                      <p style={{ fontSize:13, color:"#bbb", textAlign:"center", padding:"20px 0" }}>No messages yet</p>
                    ) : (active.messages||[]).map((m, i) => (
                      <div key={i} style={{ ...S.message, alignSelf: m.from==="admin"?"flex-end":"flex-start" }}>
                        <div style={{ ...S.messageBubble, background: m.from==="admin"?"#1a1208":"#f5f5f2", color: m.from==="admin"?"#F0E8D6":"#1a1208" }}>
                          {m.text}
                        </div>
                        <span style={S.messageTime}>{m.from==="admin"?"You":"Learner"} · {timeAgo(m.time)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Reply box */}
                  {active.status !== "resolved" && active.status !== "closed" && (
                    <div style={S.replyBox}>
                      <textarea style={S.replyInput} value={reply}
                        onChange={e => setReply(e.target.value)}
                        placeholder="Type your reply…" rows={3} />
                      <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:8 }}>
                        <button style={S.replyBtn} disabled={sending || !reply.trim()} onClick={sendReply}>
                          {sending ? "Sending…" : "Send Reply →"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── LEARNER LOOKUP TAB ── */}
      {tab === "lookup" && (
        <div style={S.lookupSection}>
          <p style={{ fontSize:13, color:"#aaa", marginBottom:16 }}>
            Search learner profiles by name or email to diagnose support issues.
          </p>
          <div style={{ display:"flex", gap:10, marginBottom:20 }}>
            <input style={{ ...S.search, flex:1 }} placeholder="Name or email…"
              value={lookupQuery} onChange={e => setLookupQ(e.target.value)}
              onKeyDown={e => e.key==="Enter" && lookupLearner()} />
            <button style={S.lookupBtn} onClick={lookupLearner} disabled={looking}>
              {looking ? "Searching…" : "Search"}
            </button>
          </div>

          {lookupResult && (
            lookupResult.length === 0 ? <p style={{ fontSize:13, color:"#bbb" }}>No learners found</p> :
            lookupResult.map(u => (
              <div key={u._id} style={S.learnerCard}>
                <div style={S.learnerAvatar}>
                  {u.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div style={{ flex:1 }}>
                  <p style={S.learnerName}>{u.name}</p>
                  <p style={S.learnerEmail}>{u.email}</p>
                  <div style={{ display:"flex", gap:12, marginTop:6 }}>
                    <span style={S.learnerStat}>Joined {new Date(u.createdAt).toLocaleDateString("en-IN")}</span>
                    <span style={S.learnerStat}>Orders: {u.orderCount || 0}</span>
                    <span style={S.learnerStat}>Role: {u.role}</span>
                  </div>
                </div>
                <button style={S.ticketForLearnerBtn}
                  onClick={() => { setTab("tickets"); setSearch(u.name); }}>
                  View Tickets →
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── FAQ BUILDER TAB ── */}
      {tab === "faq" && (
        <div style={S.faqSection}>
          {/* Add new FAQ */}
          <div style={S.faqForm}>
            <h2 style={S.sectionTitle}>Add Auto-Response</h2>
            <label style={S.label}>Question</label>
            <input style={S.input} value={newFaq.question}
              onChange={e => setNewFaq(f => ({ ...f, question: e.target.value }))}
              placeholder="Common learner question…" />
            <label style={{ ...S.label, marginTop: 12 }}>Answer</label>
            <textarea style={S.textarea} value={newFaq.answer}
              onChange={e => setNewFaq(f => ({ ...f, answer: e.target.value }))}
              placeholder="Clear, helpful answer…" rows={4} />
            <button style={S.addFaqBtn} onClick={addFaq}>+ Add FAQ</button>
          </div>

          {/* FAQ list */}
          <div style={S.faqList}>
            <h2 style={S.sectionTitle}>Existing FAQs ({faqs.length})</h2>
            {faqs.length === 0 ? <p style={{ fontSize:13, color:"#bbb" }}>No FAQs yet</p> :
             faqs.map(f => (
               <div key={f._id} style={S.faqCard}>
                 <div style={S.faqQ}>Q: {f.question}</div>
                 <div style={S.faqA}>A: {f.answer}</div>
                 {f.category && <span style={S.faqCategory}>{f.category}</span>}
               </div>
             ))
            }
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  page:           { padding: "32px 40px", maxWidth: 1200, margin: "0 auto", fontFamily: "'DM Sans',sans-serif" },
  toast:          { position: "fixed", top: 20, right: 20, zIndex: 999, padding: "12px 20px", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,.15)" },
  header:         { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  heading:        { fontFamily: "'Cormorant Garamond',serif", fontSize: 30, fontWeight: 400, color: "#1a1208", marginBottom: 4 },
  sub:            { fontSize: 13, color: "#aaa" },
  tabRow:         { display: "flex", borderBottom: "1px solid #ededea", marginBottom: 20 },
  tabBtn:         { fontSize: 12, padding: "10px 18px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .15s" },
  filters:        { display: "flex", gap: 10, marginBottom: 16 },
  search:         { fontSize: 12, padding: "8px 14px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", fontFamily: "'DM Sans',sans-serif" },
  select:         { fontSize: 12, padding: "8px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", background: "#fff", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" },
  layout:         { display: "grid", gridTemplateColumns: "300px 1fr", gap: 16, height: "calc(100vh - 300px)", minHeight: 500 },
  ticketList:     { background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, overflow: "auto" },
  ticket:         { padding: "12px 14px", borderBottom: "1px solid #f5f5f2", cursor: "pointer", transition: "background .1s", borderLeft: "3px solid transparent" },
  ticketTop:      { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  ticketSubject:  { fontSize: 12, fontWeight: 500, color: "#1a1208", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex:1, marginRight:8 },
  priorityDot:    { width: 7, height: 7, borderRadius: "50%", flexShrink: 0 },
  ticketMeta:     { fontSize: 10, color: "#bbb", marginBottom: 4 },
  statusBadge:    { fontSize: 9, letterSpacing: ".08em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 3, fontWeight: 600 },
  empty:          { textAlign: "center", padding: "40px 0", fontSize: 13, color: "#bbb" },
  ticketDetail:   { background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, padding: "20px", display: "flex", flexDirection: "column", overflow: "auto" },
  emptyDetail:    { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 13, color: "#bbb", gap: 8 },
  detailHeader:   { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 16, flexWrap: "wrap" },
  detailTitle:    { fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400, color: "#1a1208", marginBottom: 4 },
  detailMeta:     { fontSize: 12, color: "#aaa" },
  inProgressBtn:  { fontSize: 11, padding: "7px 14px", border: "1.5px solid #C9A96E44", background: "#C9A96E18", color: "#7a5a1a", borderRadius: 6, cursor: "pointer" },
  resolveBtn:     { fontSize: 11, padding: "7px 14px", border: "1.5px solid #7ec87e44", background: "#7ec87e18", color: "#3a7c3a", borderRadius: 6, cursor: "pointer", fontWeight: 500 },
  closeBtn:       { fontSize: 11, padding: "7px 14px", border: "1.5px solid #e8e8e4", background: "#fff", color: "#888", borderRadius: 6, cursor: "pointer" },
  messages:       { flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 10, padding: "12px 0", marginBottom: 12 },
  message:        { display: "flex", flexDirection: "column", maxWidth: "75%", gap: 3 },
  messageBubble:  { padding: "10px 14px", borderRadius: 10, fontSize: 13, lineHeight: 1.5 },
  messageTime:    { fontSize: 10, color: "#bbb" },
  replyBox:       { borderTop: "1px solid #ededea", paddingTop: 12, flexShrink: 0 },
  replyInput:     { width: "100%", fontSize: 13, padding: "10px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", resize: "none", fontFamily: "'DM Sans',sans-serif" },
  replyBtn:       { fontSize: 11, padding: "9px 20px", background: "#1a1208", color: "#F0E8D6", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500 },
  lookupSection:  { maxWidth: 700 },
  lookupBtn:      { fontSize: 12, padding: "8px 20px", background: "#1a1208", color: "#F0E8D6", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 500 },
  learnerCard:    { display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, marginBottom: 10 },
  learnerAvatar:  { width: 36, height: 36, borderRadius: "50%", background: "#C9A96E22", color: "#C9A96E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, flexShrink: 0 },
  learnerName:    { fontSize: 13, fontWeight: 500, color: "#1a1208", marginBottom: 2 },
  learnerEmail:   { fontSize: 11, color: "#888" },
  learnerStat:    { fontSize: 10, color: "#bbb" },
  ticketForLearnerBtn: { fontSize: 11, padding: "7px 14px", border: "1.5px solid #e8e8e4", borderRadius: 6, background: "#fff", cursor: "pointer", color: "#555", flexShrink: 0 },
  faqSection:     { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },
  sectionTitle:   { fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 400, color: "#1a1208", marginBottom: 14 },
  faqForm:        { background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, padding: "20px" },
  faqList:        { background: "#fff", border: "1.5px solid #ededea", borderRadius: 10, padding: "20px", overflowY: "auto", maxHeight: 600 },
  label:          { display: "block", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#aaa", marginBottom: 6 },
  input:          { width: "100%", fontSize: 13, padding: "9px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", fontFamily: "'DM Sans',sans-serif" },
  textarea:       { width: "100%", fontSize: 13, padding: "9px 12px", border: "1.5px solid #e8e8e4", borderRadius: 8, outline: "none", resize: "vertical", fontFamily: "'DM Sans',sans-serif" },
  addFaqBtn:      { marginTop: 12, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", padding: "9px 18px", background: "#1a1208", color: "#F0E8D6", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500 },
  faqCard:        { padding: "14px 0", borderBottom: "1px solid #f5f5f2" },
  faqQ:           { fontSize: 12, fontWeight: 500, color: "#1a1208", marginBottom: 6 },
  faqA:           { fontSize: 12, color: "#666", lineHeight: 1.5 },
  faqCategory:    { display: "inline-block", marginTop: 6, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 3, background: "#C9A96E18", color: "#C9A96E", fontWeight: 600 },
};