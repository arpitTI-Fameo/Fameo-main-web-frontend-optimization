import { S } from '../styles';

export default function RevenueTable({ breakdown }) {
  return (
    <div style={S.card}>
      <h2 style={S.cardTitle}>Revenue by Product</h2>
      <div style={S.tableHead}><span style={{flex:2}}>Product</span><span>Type</span><span>Units</span><span>Revenue</span></div>
      {breakdown?.map(row => (
        <div key={row.product} style={S.tableRow}>
          <span style={{flex:2,fontSize:13,color:"#1a1208"}}>{row.product}</span>
          <span style={{fontSize:11,color:"#aaa"}}>{row.type}</span>
          <span style={{fontSize:12,color:"#555"}}>{row.units}</span>
          <span style={{fontSize:13,fontWeight:500,color:"#1a1208"}}>{row.revenue}</span>
        </div>
      ))}
    </div>
  );
}
