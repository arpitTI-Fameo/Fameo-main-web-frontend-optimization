import { S } from '../styles';
import { INTEG_LABELS } from '../constants';

export default function SettingsIntegrations({ integrations }) {
  return (
    <div style={S.section}>
      <h2 style={S.sectionTitle}>Integrations</h2>
      <div style={S.integGrid}>
        {Object.entries(INTEG_LABELS).map(([key, label]) => {
          const cfg = integrations[key] || {};
          return (
            <div key={key} style={S.integCard}>
              <div style={S.integTop}>
                <span style={S.integLabel}>{label}</span>
                <span style={{ ...S.integStatus, color: cfg.connected ? "#3a7c3a" : "#d49090", background: cfg.connected ? "#7ec87e18" : "#d4909018" }}>
                  {cfg.connected ? "Connected" : "Not connected"}
                </span>
              </div>
              {cfg.keyId && <p style={S.integDetail}>Key: {cfg.keyId.slice(0, 12)}…</p>}
              {cfg.bucketName && <p style={S.integDetail}>Bucket: {cfg.bucketName}</p>}
              <button style={S.integBtn}>{cfg.connected ? "Reconfigure" : "Connect"}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
