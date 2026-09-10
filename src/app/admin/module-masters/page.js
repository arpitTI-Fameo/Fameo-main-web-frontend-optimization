"use client";
// app/admin/module-masters/page.js

import { useState, useEffect } from "react";

const MODULES = ["Creator Foundations","Content Creation System","Studio & Team Setup","Platform Growth & Algorithms","Collabs & Community","Monetization & Brand Deals","Creator Operations & Legal","Scaling & Career Growth"];

export default function ModuleMastersPage() {
  const [masters, setMasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState(null);
  const [notif, setNotif]     = useState(null);

  useEffect(() => {
    fetch("/api/admin/module-masters")
      .then(r=>r.json()).then(d=>setMasters(d.data||[]))
      .catch(()=>setMasters([
        { _id:"mm1", name:"Kiran Mehta",   email:"kiran@fameo.in",  assignedModules:[0,1], lastSeen:new Date(Date.now()-3600000).toISOString() },
        { _id:"mm2", name:"Priya Sharma",  email:"priya@fameo.in",  assignedModules:[3,4], lastSeen:new Date(Date.now()-86400000).toISOString() },
        { _id:"mm3", name:"Arjun Reddy",   email:"arjun@fameo.in",  assignedModules:[5],   lastSeen:new Date(Date.now()-172800000).toISOString() },
      ]))
      .finally(()=>setLoading(false));
  },[]);

  const showNotif = (msg) => { setNotif(msg); setTimeout(()=>setNotif(null),3000); };

  const invite = async () => {
    if (!form?.email || !form?.name) return;
    try {
      const res = await fetch("/api/admin/module-masters", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
      const data = await res.json();
      setMasters(prev=>[data.data,...prev]);
      setForm(null);
      showNotif("Module master invited");
    } catch { showNotif("Invite failed"); }
  };

  const updateModules = async (id, mods) => {
    try {
      await fetch(`/api/admin/module-masters/${id}/modules`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({moduleIds:mods}) });
      setMasters(prev=>prev.map(m=>m._id===id?{...m,assignedModules:mods}:m));
      showNotif("Modules updated");
    } catch { showNotif("Update failed"); }
  };

  const revoke = async (id) => {
    if (!confirm("Revoke module master access? They will be downgraded to learner.")) return;
    await fetch(`/api/admin/module-masters/${id}`, {method:"DELETE"});
    setMasters(prev=>prev.filter(m=>m._id!==id));
    showNotif("Access revoked");
  };

  return (
    <div style={S.page}>
      {notif && <div style={S.toast}>{notif}</div>}
      <div style={S.header}>
        <div>
          <h1 style={S.heading}>Module Masters</h1>
          <p style={S.sub}>Invite instructors and assign them to specific modules.</p>
        </div>
        <button onClick={()=>setForm({name:"",email:"",assignedModules:[]})} style={S.inviteBtn}>+ Invite Master</button>
      </div>

      {form && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <h2 style={S.modalTitle}>Invite Module Master</h2>
            {[["name","Full name"],["email","Email address"]].map(([k,l])=>(
              <div key={k} style={{marginBottom:14}}>
                <label style={S.label}>{l}</label>
                <input style={S.input} value={form[k]||""} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder={l}/>
              </div>
            ))}
            <label style={S.label}>Assign Modules</label>
            <div style={S.modGrid}>
              {MODULES.map((m,i)=>(
                <label key={i} style={S.modCheck}>
                  <input type="checkbox" checked={form.assignedModules?.includes(i)||false}
                    onChange={e=>{
                      const mods = e.target.checked ? [...(form.assignedModules||[]),i] : (form.assignedModules||[]).filter(x=>x!==i);
                      setForm(f=>({...f,assignedModules:mods}));
                    }}/>
                  <span style={{fontSize:12,color:"#555"}}>{m}</span>
                </label>
              ))}
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}}>
              <button onClick={()=>setForm(null)} style={S.cancelBtn}>Cancel</button>
              <button onClick={invite} style={S.saveBtn}>Send Invite</button>
            </div>
          </div>
        </div>
      )}

      {loading ? <div style={S.empty}>Loading…</div> :
       <div style={S.list}>
         {masters.map(m=>(
           <div key={m._id} style={S.card}>
             <div style={S.cardLeft}>
               <div style={S.avatar}>{m.name.charAt(0)}</div>
               <div>
                 <p style={S.masterName}>{m.name}</p>
                 <p style={S.masterEmail}>{m.email}</p>
                 <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
                   {(m.assignedModules||[]).map(id=>(
                     <span key={id} style={S.modTag}>{MODULES[id]}</span>
                   ))}
                 </div>
               </div>
             </div>
             <div style={S.cardRight}>
               <p style={S.lastSeen}>Active {timeAgo(m.lastSeen)}</p>
               <div style={{display:"flex",gap:8}}>
                 <button style={S.editBtn} onClick={()=>{
                   const mods = prompt("Enter module IDs (comma separated 0-7):", m.assignedModules?.join(","));
                   if (mods!==null) updateModules(m._id, mods.split(",").map(Number).filter(n=>!isNaN(n)));
                 }}>Edit Modules</button>
                 <button style={S.revokeBtn} onClick={()=>revoke(m._id)}>Revoke</button>
               </div>
             </div>
           </div>
         ))}
       </div>
      }
    </div>
  );
}

function timeAgo(iso) {
  const d=Math.floor((Date.now()-new Date(iso))/60000);
  if(d<60) return `${d}m ago`; if(d<1440) return `${Math.floor(d/60)}h ago`; return `${Math.floor(d/1440)}d ago`;
}

const S = {
  page:    { padding:"32px 40px",maxWidth:900,margin:"0 auto",fontFamily:"'DM Sans',sans-serif" },
  toast:   { position:"fixed",top:20,right:20,zIndex:999,padding:"12px 20px",borderRadius:8,color:"#fff",fontSize:13,fontWeight:500,background:"#7ec87e" },
  header:  { display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24 },
  heading: { fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:400,color:"#1a1208",marginBottom:4 },
  sub:     { fontSize:13,color:"#aaa" },
  inviteBtn:{ fontSize:11,letterSpacing:".1em",textTransform:"uppercase",padding:"10px 20px",background:"#1a1208",color:"#F0E8D6",border:"none",borderRadius:6,cursor:"pointer",fontWeight:500 },
  overlay: { position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center" },
  modal:   { background:"#fff",borderRadius:12,padding:"28px 32px",width:"100%",maxWidth:480,maxHeight:"90vh",overflowY:"auto" },
  modalTitle:{ fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:400,color:"#1a1208",marginBottom:20 },
  label:   { display:"block",fontSize:10,letterSpacing:".1em",textTransform:"uppercase",color:"#aaa",marginBottom:6 },
  input:   { width:"100%",fontSize:13,padding:"9px 12px",border:"1.5px solid #e8e8e4",borderRadius:8,outline:"none",fontFamily:"'DM Sans',sans-serif" },
  modGrid: { display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:4 },
  modCheck:{ display:"flex",alignItems:"center",gap:6,cursor:"pointer" },
  cancelBtn:{ fontSize:11,padding:"9px 18px",border:"1.5px solid #e8e8e4",borderRadius:6,background:"#fff",color:"#555",cursor:"pointer" },
  saveBtn: { fontSize:11,padding:"9px 20px",background:"#1a1208",color:"#F0E8D6",border:"none",borderRadius:6,cursor:"pointer",fontWeight:500 },
  list:    { display:"flex",flexDirection:"column",gap:12 },
  card:    { background:"#fff",border:"1.5px solid #ededea",borderRadius:10,padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:20 },
  cardLeft:{ display:"flex",gap:14,flex:1,minWidth:0 },
  avatar:  { width:40,height:40,borderRadius:"50%",background:"#C9A96E18",color:"#C9A96E",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:500,flexShrink:0 },
  masterName:{ fontSize:14,fontWeight:500,color:"#1a1208",marginBottom:2 },
  masterEmail:{ fontSize:12,color:"#aaa" },
  modTag:  { fontSize:9,padding:"2px 8px",background:"#f0f0ee",borderRadius:20,color:"#555",letterSpacing:".04em" },
  cardRight:{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:10,flexShrink:0 },
  lastSeen:{ fontSize:11,color:"#bbb" },
  editBtn: { fontSize:10,padding:"5px 12px",border:"1.5px solid #e8e8e4",borderRadius:5,background:"#fff",cursor:"pointer",color:"#555" },
  revokeBtn:{ fontSize:10,padding:"5px 12px",border:"1.5px solid #d4909044",background:"#d4909018",color:"#9a3030",borderRadius:5,cursor:"pointer" },
  empty:   { textAlign:"center",padding:"60px 0",fontSize:13,color:"#bbb" },
};
