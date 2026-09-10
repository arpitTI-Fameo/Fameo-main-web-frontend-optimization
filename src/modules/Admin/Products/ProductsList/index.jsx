import { S } from '../styles';
import { TYPE_COLOR } from '../constants';

export default function ProductsList({ loading, products, setForm, toggleStatus }) {
  if (loading) return <div style={S.empty}>Loading…</div>;

  return (
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
  );
}
