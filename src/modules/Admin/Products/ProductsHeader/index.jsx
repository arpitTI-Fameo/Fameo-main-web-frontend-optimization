import { S } from '../styles';
import { EMPTY } from '../constants';

export default function ProductsHeader({ setForm }) {
  return (
    <div style={S.header}>
      <div>
        <h1 style={S.heading}>Products & Shop</h1>
        <p style={S.sub}>Manage products. Published products appear as CTAs in topics.</p>
      </div>
      <button onClick={() => setForm({...EMPTY})} style={S.newBtn}>+ New Product</button>
    </div>
  );
}
