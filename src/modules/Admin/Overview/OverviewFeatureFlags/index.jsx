import { S } from '../styles';
import { FLAG_LABELS } from '../constants';

export default function OverviewFeatureFlags({ flags, flagSaving, toggleFlag, accent }) {
  return (
    <div style={S.card}>
      <div style={S.cardHead}>
        <h2 style={S.cardTitle}>Feature Flags</h2>
        <span style={S.liveNote}>◉ Live — changes reflect instantly on Learner Hub</span>
      </div>
      <div style={S.flagsGrid}>
        {Object.entries(FLAG_LABELS).map(([key, label]) => (
          <div key={key} style={S.flagRow}>
            <span style={S.flagLabel}>{label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {flagSaving[key] && <span style={{ fontSize: 10, color: "#bbb" }}>…</span>}
              <button onClick={() => toggleFlag(key)} style={{ ...S.toggle, background: flags[key] ? accent : "#ddd" }}>
                <span style={{ ...S.toggleThumb, transform: flags[key] ? "translateX(18px)" : "translateX(2px)" }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
