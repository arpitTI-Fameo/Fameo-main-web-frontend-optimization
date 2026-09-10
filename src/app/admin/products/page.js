"use client";
// app/admin/products/page.js

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

const EMPTY = { name:"", price:"", description:"", buyUrl:"", type:"course", status:"draft" };

export default function ProductsPage() {
  const { user }   = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState(null); // null = closed, {} = new/edit
  const [saving, setSaving]     = useState(false);
  const [notif, setNotif]       = useState(null);

  useEffect(() => {
    fetch("/api/admin/products")
      .then(r => r.json())
      .then(d => setProducts(d.data || []))
      .catch(() => setProducts([
        { _id:"p1", name:"Reels Masterclass",          price:"₹1,499", type:"course",   status:"published", purchases:234, description:"Master Reels from hook to CTA." },
        { _id:"p2", name:"Brand Deal Template Pack",   price:"₹799",   type:"template", status:"published", purchases:187, description:"10 email templates that convert." },
        { _id:"p3", name:"Creator Finance Guide",      price:"₹499",   type:"ebook",    status:"draft",     purchases:0,   description:"Tax & finance for Indian creators." },
      ]))
      .finally(() => setLoading(false));
  }, []);

  const showNotif = (msg, ok=true) => { setNotif({msg,ok}); setTimeout(()=>setNotif(null),3000); };

  const save = async () => {
    setSaving(true);
    try {
      const isNew = !form._id;
      const url   = isNew ? "/api/admin/products" : `/api/admin/products/${form._id}`;
      const method= isNew ? "POST" : "PUT";
      const res   = await fetch(url, { method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
      const data  = await res.json();
      if (isNew) setProducts(prev => [data.data, ...prev]);
      else setProducts(prev => prev.map(p => p._id===form._id ? data.data : p));
      setForm(null);
      showNotif(isNew ? "Product created" : "Product updated");
    } catch { showNotif("Save failed", false); }
    setSaving(false);
  };

  const toggleStatus = async (id, current) => {
    const status = current==="published" ? "draft" : "published";
    try {
      await fetch(`/api/admin/products/${id}/status`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({status}) });
      setProducts(prev => prev.map(p => p._id===id ? {...p,status} : p));
      showNotif(status==="published" ? "Product published live" : "Product unpublished");
    } catch { showNotif("Update failed", false); }
  };

  const TYPE_COLOR = { course:"#7eb8d8", template:"#C9A96E", ebook:"#b89fd4", other:"#aaa" };

  return (
    <div style={S.page}>
      {notif && <div style={{...S.toast,background:notif.ok?"#7ec87e":"#d49090"}}>{notif.msg}</div>}

      <div style={S.header}>
        <div>
          <h1 style={S.heading}>Products & Shop</h1>
          <p style={S.sub}>Manage products. Published products appear as CTAs in topics.</p>
        </div>
        <button onClick={() => setForm({...EMPTY})} style={S.newBtn}>+ New Product</button>
      </div>

      {/* Form modal */}
      {form && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <h2 style={S.modalTitle}>{form._id ? "Edit Product" : "New Product"}</h2>
            {[["name","Product name"],["price","Price (e.g. ₹1,499)"],["description","Short description"],["buyUrl","Checkout URL"]].map(([key,label]) => (
              <div key={key} style={{marginBottom:14}}>
                <label style={S.label}>{label}</label>
                <input style={S.input} value={form[key]||""} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={label}/>
              </div>
            ))}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <div>
                <label style={S.label}>Type</label>
                <select style={S.select} value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                  {["course","template","ebook","other"].map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Status</label>
                <select style={S.select} value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
              <button onClick={()=>setForm(null)} style={S.cancelBtn}>Cancel</button>
              <button onClick={save} disabled={saving} style={S.saveBtn}>{saving?"Saving…":"Save Product"}</button>
            </div>
          </div>
        </div>
      )}

      {loading ? <div style={S.empty}>Loading…</div> :
       <div style={S.table}>
         <div style={S.thead}>
           <span style={{flex:2}}>Product</span>
           <span>Type</span><span>Price</span><span>Purchases</span><span>Status</span><span>Actions</span>
         </div>
         {products.map(p => (
           <div key={p._id} style={S.trow}>
             <div style={{flex:2}}>
               <p style={S.productName}>{p.name}</p>
               <p style={S.productDesc}>{p.description}</p>
             </div>
             <span style={{...S.typePill, color:TYPE_COLOR[p.type]||"#aaa", background:(TYPE_COLOR[p.type]||"#aaa")+"18"}}>{p.type}</span>
             <span style={S.cell}>{p.price}</span>
             <span style={S.cell}>{p.purchases}</span>
             <span>
               <span style={{...S.statusPill, background:p.status==="published"?"#7ec87e18":"#ededea", color:p.status==="published"?"#3a7c3a":"#aaa"}}>
                 {p.status}
               </span>
             </span>
             <div style={{display:"flex",gap:6}}>
               <button style={S.actionBtn} onClick={()=>setForm({...p})}>Edit</button>
               <button style={{...S.actionBtn, color:p.status==="published"?"#888":"#3a7c3a", borderColor:p.status==="published"?"#ddd":"#7ec87e44"}}
                 onClick={()=>toggleStatus(p._id, p.status)}>
                 {p.status==="published"?"Unpublish":"Publish"}
               </button>
             </div>
           </div>
         ))}
       </div>
      }
    </div>
  );
}

const S = {
  page:    { padding:"32px 40px",maxWidth:1100,margin:"0 auto",fontFamily:"'DM Sans',sans-serif" },
  toast:   { position:"fixed",top:20,right:20,zIndex:999,padding:"12px 20px",borderRadius:8,color:"#fff",fontSize:13,fontWeight:500 },
  header:  { display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24 },
  heading: { fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:400,color:"#1a1208",marginBottom:4 },
  sub:     { fontSize:13,color:"#aaa" },
  newBtn:  { fontSize:11,letterSpacing:".1em",textTransform:"uppercase",padding:"10px 20px",background:"#1a1208",color:"#F0E8D6",border:"none",borderRadius:6,cursor:"pointer",fontWeight:500 },
  overlay: { position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center" },
  modal:   { background:"#fff",borderRadius:12,padding:"28px 32px",width:"100%",maxWidth:500,maxHeight:"90vh",overflowY:"auto" },
  modalTitle:{ fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:400,color:"#1a1208",marginBottom:20 },
  label:   { display:"block",fontSize:10,letterSpacing:".1em",textTransform:"uppercase",color:"#aaa",marginBottom:6 },
  input:   { width:"100%",fontSize:13,padding:"9px 12px",border:"1.5px solid #e8e8e4",borderRadius:8,outline:"none",fontFamily:"'DM Sans',sans-serif" },
  select:  { width:"100%",fontSize:13,padding:"9px 12px",border:"1.5px solid #e8e8e4",borderRadius:8,outline:"none",background:"#fff",fontFamily:"'DM Sans',sans-serif" },
  cancelBtn:{ fontSize:11,padding:"9px 18px",border:"1.5px solid #e8e8e4",borderRadius:6,background:"#fff",color:"#555",cursor:"pointer" },
  saveBtn:  { fontSize:11,padding:"9px 20px",background:"#1a1208",color:"#F0E8D6",border:"none",borderRadius:6,cursor:"pointer",fontWeight:500 },
  table:   { background:"#fff",border:"1.5px solid #ededea",borderRadius:10,overflow:"hidden" },
  thead:   { display:"flex",gap:16,padding:"10px 16px",background:"#fafaf8",borderBottom:"1px solid #ededea",fontSize:10,letterSpacing:".1em",textTransform:"uppercase",color:"#aaa",alignItems:"center" },
  trow:    { display:"flex",gap:16,padding:"14px 16px",borderBottom:"1px solid #f5f5f2",alignItems:"center" },
  productName:{ fontSize:13,fontWeight:400,color:"#1a1208",marginBottom:2 },
  productDesc:{ fontSize:11,color:"#bbb" },
  typePill:{ fontSize:9,letterSpacing:".1em",textTransform:"uppercase",padding:"3px 8px",borderRadius:4,fontWeight:600,whiteSpace:"nowrap" },
  cell:    { fontSize:12,color:"#555" },
  statusPill:{ fontSize:9,letterSpacing:".1em",textTransform:"uppercase",padding:"3px 8px",borderRadius:4,fontWeight:600 },
  actionBtn:{ fontSize:10,padding:"5px 10px",border:"1.5px solid #e8e8e4",borderRadius:5,background:"#fff",cursor:"pointer",color:"#555" },
  empty:   { textAlign:"center",padding:"60px 0",fontSize:13,color:"#bbb" },
};