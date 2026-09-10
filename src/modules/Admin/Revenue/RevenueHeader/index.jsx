import { S } from '../styles';

export default function RevenueHeader() {
  return (
    <div style={S.header}>
      <div>
        <h1 style={S.heading}>Revenue</h1>
        <p style={S.sub}>Financial overview. Visible to Super Admin only.</p>
      </div>
      <span style={S.saOnly}>◈ Super Admin</span>
    </div>
  );
}
