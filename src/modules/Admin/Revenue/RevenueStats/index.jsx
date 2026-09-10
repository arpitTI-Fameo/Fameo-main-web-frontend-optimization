import { S } from '../styles';

export default function RevenueStats({ data }) {
  if (!data) return null;

  const STATS = [
    { label:"Revenue MTD",    value:data.mtd,          sub:"this month",     accent:"#C9A96E" },
    { label:"Revenue YTD",    value:data.ytd,          sub:"this year",      accent:"#7ec87e" },
    { label:"Transactions",   value:data.transactions, sub:"total purchases", accent:"#7eb8d8" },
  ];

  return (
    <div style={S.statsGrid}>
      {STATS.map(s => (
        <div key={s.label} style={{...S.statCard, borderTop:`3px solid ${s.accent}`}}>
          <span style={S.statValue}>{s.value}</span>
          <span style={S.statLabel}>{s.label}</span>
          <span style={S.statSub}>{s.sub}</span>
        </div>
      ))}
    </div>
  );
}
