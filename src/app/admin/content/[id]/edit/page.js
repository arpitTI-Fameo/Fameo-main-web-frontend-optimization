"use client";
// app/admin/content/[id]/edit/page.js  — [id]="new" for new topics
 
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { api } from "@/services/api";
// SAST H-4 — stored XSS delivered to admins in the panel where their session
// token lives. Highest-value target in the app; sanitize before rendering.
import { sanitizeRichText } from "@/lib/security/sanitize";
 
const MODULES = [
  {id:0,title:"Creator Foundations"},{id:1,title:"Content Creation System"},
  {id:2,title:"Studio & Team Setup"},{id:3,title:"Platform Growth & Algorithms"},
  {id:4,title:"Collabs & Community"},{id:5,title:"Monetization & Brand Deals"},
  {id:6,title:"Creator Operations & Legal"},{id:7,title:"Scaling & Career Growth"},
];
 
const EMPTY = { title:"",shortDesc:"",moduleId:0,level:"b",readTime:"5 min",body:"",checklist:[""],takeaways:[""],status:"draft",mediaIds:[],productId:"" };
 
export default function TopicEditor({ params }) {
  const { id }   = use(params);
  const isNew    = id === "new";
  const router   = useRouter();
  const { user } = useAdminAuthStore();
 
  const isMM               = user?.role === "moduleMaster";
  const canPublish         = ["superAdmin","contentManager"].includes(user?.role);
  const canSubmitForReview = isMM;
  const assignedModules    = isMM ? (user?.assignedModules || []) : null;
 
  // Modules this role can assign topics to
  const availableModules = assignedModules
    ? MODULES.filter(m => assignedModules.includes(m.id))
    : MODULES;
 
  const [topic, setTopic]     = useState(EMPTY);
  const [showPicker, setShowPicker]       = useState(false);
  const [attachedMedia, setAttachedMedia] = useState({});  // id → {name,type} for display
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [preview, setPreview] = useState(false);
  const [tab, setTab]         = useState("content");
  const [toast, setToast]     = useState(null);
 
  const showToast = (msg, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000); };
 
  useEffect(() => {
    if (isNew) {
      // Default moduleId to first assigned module for moduleMaster
      if (assignedModules?.length) setTopic(t => ({ ...t, moduleId: assignedModules[0] }));
      return;
    }
    api.get(`/admin/content/${id}`)
      .then(d => {
        const t = d?.data?.topic || EMPTY;
        // Block moduleMaster from editing outside assigned modules
        if (isMM && assignedModules && !assignedModules.includes(t.moduleId)) {
          alert("You don't have access to edit this topic.");
          router.replace("/admin/content");
          return;
        }
        setTopic(t);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, isNew]);
 
  const set = (k, v) => setTopic(t => ({...t,[k]:v}));
  const setArr = (k,i,v) => setTopic(t => { const a=[...t[k]]; a[i]=v; return {...t,[k]:a}; });
  const addArr = (k) => setTopic(t => ({...t,[k]:[...t[k],""]}));
  const remArr = (k,i) => setTopic(t => ({...t,[k]:t[k].filter((_,j)=>j!==i)}));
 
  const save = async (overrideStatus) => {
    if (!topic.title.trim()) { showToast("Title is required", false); return; }
    setSaving(true);
    const payload = { ...topic };
    if (overrideStatus) payload.status = overrideStatus;
    try {
      const url    = isNew ? "/admin/content" : `/admin/content/${id}`;
      const method = isNew ? "post" : "put";
      const data   = await api[method](url, payload);
      const saved_ = data?.data?.topic;
      if (saved_) setTopic(saved_);
      setSaved(true); setTimeout(()=>setSaved(false),2000);
      if (isNew && saved_?._id) router.replace(`/admin/content/${saved_._id}/edit`);
      showToast(
        overrideStatus==="published" ? "Published live ◉ — visible on Learner Hub instantly" :
        overrideStatus==="review"    ? "Submitted for review — awaiting approval" :
        "Draft saved"
      );
    } catch(e) { showToast(e.message||"Save failed", false); }
    setSaving(false);
  };
 
  if (loading) return (
    <div style={{padding:40,fontFamily:"'DM Sans',sans-serif",color:"#aaa",display:"flex",alignItems:"center",gap:10}}>
      <span style={{color:"#C9A96E"}}>◈</span> Loading topic…
    </div>
  );
 
  const STATUS_COLOR = {
    published: ["#7ec87e","#7ec87e18"],
    draft:     ["#C9A96E","#C9A96E18"],
    review:    ["#7eb8d8","#7eb8d818"],
    archived:  ["#aaa","#aaa22"],
  };
  const [sc, sbg] = STATUS_COLOR[topic.status] || STATUS_COLOR.draft;
 
  return (
    <div style={S.page}>
      {toast && <div style={{...S.toast,background:toast.ok?"#7ec87e":"#d49090"}}>{toast.msg}</div>}
 
      {/* Top bar */}
      <div style={S.topBar}>
        <button onClick={()=>router.back()} style={S.backBtn}>← Content OS</button>
        <div style={S.topMid}>
          <span style={{fontSize:10,letterSpacing:".1em",textTransform:"uppercase",padding:"3px 8px",borderRadius:4,background:sbg,color:sc,fontWeight:600}}>
            {topic.status}
          </span>
          {saved && <span style={{fontSize:11,color:"#7ec87e",fontWeight:500}}>✓ Saved</span>}
          {topic.title && <span style={{fontSize:12,color:"#aaa",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:300}}>{topic.title}</span>}
        </div>
        <div style={S.topActions}>
          <button onClick={()=>setPreview(p=>!p)} style={S.previewBtn}>
            {preview ? "Hide Preview" : "Preview"}
          </button>
          <button onClick={()=>save()} disabled={saving} style={S.saveBtn}>
            {saving ? "Saving…" : "Save Draft"}
          </button>
          {canSubmitForReview && topic.status==="draft" && (
            <button onClick={()=>save("review")} style={S.reviewBtn}>Submit for Review</button>
          )}
          {canPublish && topic.status!=="published" && (
            <button onClick={()=>save("published")} style={S.publishBtn}>◉ Publish Live</button>
          )}
          {canPublish && topic.status==="published" && (
            <button onClick={()=>save("draft")} style={{...S.reviewBtn,color:"#888",borderColor:"#e8e8e4",background:"#fff"}}>
              Unpublish
            </button>
          )}
        </div>
      </div>
 
      <div style={{...S.layout, gridTemplateColumns:preview?"1fr 1fr":"1fr"}}>
        {/* ── Editor pane ── */}
        <div style={S.editorPane}>
          <div style={S.tabRow}>
            {["content","meta","media"].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{
                ...S.tabBtn,
                borderBottom: tab===t ? "2px solid #C9A96E" : "2px solid transparent",
                color:        tab===t ? "#1a1208" : "#aaa",
                fontWeight:   tab===t ? 500 : 400,
              }}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
 
          {/* Content tab */}
          {tab==="content" && (
            <div style={S.tabBody}>
              <input style={S.titleInput} placeholder="Topic title…"
                value={topic.title} onChange={e=>set("title",e.target.value)}/>
              <textarea style={S.descInput} rows={2}
                placeholder="Short description (shown in module list)…"
                value={topic.shortDesc} onChange={e=>set("shortDesc",e.target.value)}/>
 
              <label style={S.label}>Body Content <span style={{color:"#bbb",fontWeight:400,textTransform:"none",letterSpacing:0}}>(HTML supported)</span></label>
              <textarea style={S.bodyInput} rows={16}
                placeholder="Write the full article here…"
                value={topic.body} onChange={e=>set("body",e.target.value)}/>
 
              <label style={S.label}>Key Takeaways</label>
              {topic.takeaways.map((v,i)=>(
                <div key={i} style={S.arrRow}>
                  <input style={S.arrInput} placeholder={`Takeaway ${i+1}…`}
                    value={v} onChange={e=>setArr("takeaways",i,e.target.value)}/>
                  <button onClick={()=>remArr("takeaways",i)} style={S.remBtn}>✕</button>
                </div>
              ))}
              <button onClick={()=>addArr("takeaways")} style={S.addBtn}>+ Add Takeaway</button>
 
              <label style={{...S.label,marginTop:20}}>Action Checklist</label>
              {topic.checklist.map((v,i)=>(
                <div key={i} style={S.arrRow}>
                  <input style={S.arrInput} placeholder={`Checklist item ${i+1}…`}
                    value={v} onChange={e=>setArr("checklist",i,e.target.value)}/>
                  <button onClick={()=>remArr("checklist",i)} style={S.remBtn}>✕</button>
                </div>
              ))}
              <button onClick={()=>addArr("checklist")} style={S.addBtn}>+ Add Item</button>
            </div>
          )}
 
          {/* Meta tab */}
          {tab==="meta" && (
            <div style={S.tabBody}>
              <div style={S.metaGrid}>
                <div>
                  <label style={S.label}>Module</label>
                  <select style={S.metaSel} value={topic.moduleId}
                    onChange={e=>set("moduleId",parseInt(e.target.value))}>
                    {availableModules.map(m=><option key={m.id} value={m.id}>{m.title}</option>)}
                  </select>
                  {isMM && <p style={{fontSize:10,color:"#bbb",marginTop:4}}>Only your assigned modules are shown.</p>}
                </div>
                <div>
                  <label style={S.label}>Level</label>
                  <select style={S.metaSel} value={topic.level} onChange={e=>set("level",e.target.value)}>
                    <option value="b">Beginner</option>
                    <option value="i">Intermediate</option>
                  </select>
                </div>
                <div>
                  <label style={S.label}>Read Time</label>
                  <input style={S.metaInput} value={topic.readTime}
                    onChange={e=>set("readTime",e.target.value)} placeholder="e.g. 8 min"/>
                </div>
                <div>
                  <label style={S.label}>Product CTA ID <span style={{color:"#bbb",fontWeight:400,textTransform:"none",letterSpacing:0}}>(optional)</span></label>
                  <input style={S.metaInput} value={topic.productId||""}
                    onChange={e=>set("productId",e.target.value||null)} placeholder="Product ID"/>
                </div>
              </div>
 
              {/* Workflow note for moduleMaster */}
              {isMM && (
                <div style={{marginTop:20,padding:"12px 14px",background:"#7eb8d818",border:"1px solid #7eb8d844",borderRadius:8,fontSize:12,color:"#1a4a7a"}}>
                  ◎ As a Module Master, use <strong>Submit for Review</strong> — your topics go to the Content Manager for approval before publishing.
                </div>
              )}
            </div>
          )}
 
          {/* Media tab */}
          {tab==="media" && (
            <div style={S.tabBody}>
              <p style={{fontSize:13,color:"#aaa",marginBottom:16,lineHeight:1.6}}>
                Attach media from the Media Center. Each file (video, image, PDF) linked here
                will be rendered after the first H2 heading in the article.
              </p>
              {(topic.mediaIds||[]).length === 0 && (
                <p style={{fontSize:12,color:"#bbb",marginBottom:12}}>No media attached yet.</p>
              )}
              {(topic.mediaIds||[]).map(mid=>(
                <div key={mid} style={S.arrRow}>
                  <span style={{fontSize:12,fontFamily:"monospace",color:"#555",background:"#f5f5f2",padding:"8px 12px",borderRadius:6,flex:1}}>
                    {attachedMedia[mid] ? `${attachedMedia[mid].name} (${attachedMedia[mid].type})` : mid}
                  </span>
                  <button onClick={()=>set("mediaIds",(topic.mediaIds||[]).filter(m=>m!==mid))} style={S.remBtn}>✕ Remove</button>
                </div>
              ))}
              <button onClick={()=>setShowPicker(true)} style={S.addBtn}>◉ Browse Media Center</button>
              {showPicker && (
                <MediaPicker
                  selectedIds={topic.mediaIds||[]}
                  onClose={()=>setShowPicker(false)}
                  onSelect={(m)=>{
                    if(!(topic.mediaIds||[]).includes(m._id)){
                      set("mediaIds",[...(topic.mediaIds||[]),m._id]);
                      setAttachedMedia(prev=>({...prev,[m._id]:{name:m.name,type:m.type}}));
                    }
                    setShowPicker(false);
                  }}
                />
              )}
            </div>
          )}
        </div>
 
        {/* ── Preview pane ── */}
        {preview && (
          <div style={S.previewPane}>
            <div style={{fontSize:9,letterSpacing:".18em",textTransform:"uppercase",color:"#bbb",marginBottom:20}}>
              ◎ Learner Preview — exactly as it appears on Learner Hub
            </div>
            <div style={{fontSize:10,letterSpacing:".1em",textTransform:"uppercase",color:"#C9A96E",marginBottom:8}}>
              {MODULES.find(m=>m.id===topic.moduleId)?.title}
            </div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:400,color:"#1a1208",marginBottom:10,letterSpacing:"-.015em",lineHeight:1.1}}>
              {topic.title || "Untitled"}
            </h1>
            <p style={{fontSize:14,color:"#777",marginBottom:12,lineHeight:1.7}}>{topic.shortDesc}</p>
            <div style={{display:"flex",gap:8,fontSize:11,color:"#bbb",marginBottom:16}}>
              <span>{topic.level==="b"?"Beginner":"Intermediate"}</span>
              <span>·</span>
              <span>{topic.readTime}</span>
            </div>
            <hr style={{border:"none",borderTop:"1px solid #ededea",marginBottom:20}}/>
            <div style={{fontSize:14,lineHeight:1.8,color:"#444"}}
              dangerouslySetInnerHTML={{__html:sanitizeRichText(topic.body)||"<p style='color:#bbb'>Body will appear here…</p>"}}/>
            {topic.takeaways?.filter(Boolean).length > 0 && (
              <div style={{background:"#C9A96E0a",border:"1.5px solid #C9A96E33",borderRadius:10,padding:"16px 18px",marginTop:24}}>
                <strong style={{fontSize:13,color:"#1a1208",display:"block",marginBottom:8}}>Key Takeaways</strong>
                {topic.takeaways.filter(Boolean).map((t,i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginTop:8,alignItems:"flex-start"}}>
                    <span style={{color:"#C9A96E",fontSize:10,marginTop:3}}>◈</span>
                    <span style={{fontSize:13,color:"#555",lineHeight:1.6}}>{t}</span>
                  </div>
                ))}
              </div>
            )}
            {topic.checklist?.filter(Boolean).length > 0 && (
              <div style={{marginTop:20,padding:"16px 18px",border:"1.5px solid #ededea",borderRadius:10}}>
                <strong style={{fontSize:13,color:"#1a1208",display:"block",marginBottom:8}}>Action Checklist</strong>
                {topic.checklist.filter(Boolean).map((c,i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginTop:6,alignItems:"center"}}>
                    <span style={{width:14,height:14,border:"1.5px solid #ddd",borderRadius:3,flexShrink:0,display:"inline-block"}}/>
                    <span style={{fontSize:13,color:"#555"}}>{c}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
 
const S = {
  page:       { display:"flex",flexDirection:"column",height:"100vh",fontFamily:"'DM Sans',sans-serif",overflow:"hidden" },
  toast:      { position:"fixed",top:20,right:20,zIndex:999,padding:"12px 20px",borderRadius:8,color:"#fff",fontSize:13,fontWeight:500,boxShadow:"0 4px 20px rgba(0,0,0,.15)" },
  topBar:     { display:"flex",alignItems:"center",gap:12,padding:"10px 24px",background:"#fff",borderBottom:"1px solid #ededea",flexShrink:0 },
  backBtn:    { fontSize:12,color:"#888",background:"none",border:"none",cursor:"pointer",letterSpacing:".04em",flexShrink:0 },
  topMid:     { flex:1,display:"flex",alignItems:"center",gap:10,minWidth:0 },
  topActions: { display:"flex",gap:8,flexShrink:0 },
  previewBtn: { fontSize:11,padding:"7px 14px",border:"1.5px solid #e8e8e4",borderRadius:6,background:"#fff",color:"#555",cursor:"pointer" },
  saveBtn:    { fontSize:11,padding:"7px 14px",border:"1.5px solid #e8e8e4",borderRadius:6,background:"#fff",color:"#1a1208",cursor:"pointer",fontWeight:500 },
  reviewBtn:  { fontSize:11,padding:"7px 14px",border:"1.5px solid #7eb8d844",borderRadius:6,background:"#7eb8d818",color:"#7eb8d8",cursor:"pointer",fontWeight:500 },
  publishBtn: { fontSize:11,padding:"7px 16px",border:"none",borderRadius:6,background:"#C9A96E",color:"#1a1200",cursor:"pointer",fontWeight:600 },
  layout:     { display:"grid",flex:1,overflow:"hidden" },
  editorPane: { overflow:"auto",borderRight:"1px solid #ededea",display:"flex",flexDirection:"column" },
  tabRow:     { display:"flex",padding:"0 24px",borderBottom:"1px solid #ededea",background:"#fff",flexShrink:0 },
  tabBtn:     { fontSize:12,padding:"12px 16px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .15s" },
  tabBody:    { padding:"20px 24px",flex:1,overflowY:"auto" },
  titleInput: { width:"100%",fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:400,border:"none",outline:"none",color:"#1a1208",marginBottom:12,letterSpacing:"-.01em",background:"transparent" },
  descInput:  { width:"100%",fontSize:14,border:"1.5px solid #e8e8e4",borderRadius:8,padding:"10px 14px",outline:"none",fontFamily:"'DM Sans',sans-serif",resize:"vertical",marginBottom:20 },
  label:      { display:"block",fontSize:10,letterSpacing:".1em",textTransform:"uppercase",color:"#aaa",marginBottom:8,fontWeight:500 },
  bodyInput:  { width:"100%",fontSize:13,fontFamily:"monospace",lineHeight:1.7,border:"1.5px solid #e8e8e4",borderRadius:8,padding:"12px 14px",outline:"none",resize:"vertical",marginBottom:20 },
  arrRow:     { display:"flex",gap:8,marginBottom:6 },
  arrInput:   { flex:1,fontSize:13,padding:"8px 12px",border:"1.5px solid #e8e8e4",borderRadius:6,outline:"none",fontFamily:"'DM Sans',sans-serif" },
  remBtn:     { fontSize:11,padding:"4px 8px",border:"1.5px solid #e8e8e4",borderRadius:5,background:"#fff",color:"#d49090",cursor:"pointer",flexShrink:0 },
  addBtn:     { fontSize:11,letterSpacing:".06em",padding:"7px 14px",border:"1.5px dashed #ddd",borderRadius:6,background:"transparent",color:"#aaa",cursor:"pointer",marginTop:4 },
  metaGrid:   { display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 },
  metaSel:    { width:"100%",fontSize:13,padding:"9px 12px",border:"1.5px solid #e8e8e4",borderRadius:8,outline:"none",background:"#fff",fontFamily:"'DM Sans',sans-serif" },
  metaInput:  { width:"100%",fontSize:13,padding:"9px 12px",border:"1.5px solid #e8e8e4",borderRadius:8,outline:"none",fontFamily:"'DM Sans',sans-serif" },
  previewPane:{ overflow:"auto",padding:"32px 36px",background:"#fff" },
};