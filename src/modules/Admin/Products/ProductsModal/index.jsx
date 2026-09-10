import { S } from '../styles';

export default function ProductsModal({ form, setForm, save, saving }) {
  if (!form) return null;

  return (
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
  );
}
