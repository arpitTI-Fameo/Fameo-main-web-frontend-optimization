import { S } from '../styles';
import { FLAG_META } from '../constants';

export default function SettingsFlags({ flags, toggleFlag, saving }) {
  return (
    <div style={S.section}>
      <h2 style={S.sectionTitle}>Feature Flags</h2>
      <p style={S.sectionSub}>Toggle any flag — learners on active sessions see the change within ~1 second.</p>
      <div style={S.flagsGrid}>
        {Object.entries(FLAG_META).map(([key, meta]) => (
          <div key={key} style={S.flagRow}>
            <div style={{ flex: 1 }}>
              <p style={S.flagLabel}>{meta.label}</p>
              <p style={S.flagDesc}>{meta.desc}</p>
            </div>
            <div style={S.toggleWrap}>
              {saving[key] && <span style={S.savingDot}>…</span>}
              <button onClick={() => toggleFlag(key)} style={{ ...S.toggle, background: flags[key] ? "#C9A96E" : "#e0e0dc" }}>
                <span style={{ ...S.toggleThumb, transform: flags[key] ? "translateX(18px)" : "translateX(2px)" }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
