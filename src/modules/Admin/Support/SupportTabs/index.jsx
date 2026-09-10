import { S } from '../styles';

export default function SupportTabs({ tab, setTab, openCount }) {
  return (
    <div style={S.tabRow}>
      {[
        { key: "tickets", label: `Open Tickets (${openCount})` },
        { key: "lookup", label: "Learner Lookup" },
        { key: "faq", label: "FAQ Builder" },
      ].map(t => (
        <button key={t.key} onClick={() => setTab(t.key)} style={{
          ...S.tabBtn,
          borderBottom: tab === t.key ? "2px solid #C9A96E" : "2px solid transparent",
          color: tab === t.key ? "#1a1208" : "#aaa",
          fontWeight: tab === t.key ? 500 : 400,
        }}>{t.label}</button>
      ))}
    </div>
  );
}
