import { S } from '../styles';

export default function SupportHeader({ openCount }) {
  return (
    <div style={S.header}>
      <div>
        <h1 style={S.heading}>Support Center</h1>
        <p style={S.sub}>{openCount} open tickets · Learner support queue</p>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#7ec87e", fontWeight: 500 }}>◉ Live updates</span>
      </div>
    </div>
  );
}
