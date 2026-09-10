import { S } from '../styles';

export default function SettingsHeader() {
  return (
    <div style={S.header}>
      <div>
        <h1 style={S.heading}>Platform Settings</h1>
        <p style={S.sub}>Feature flags and integrations. Changes go live immediately to all learners.</p>
      </div>
      <span style={S.saOnly}>◈ Super Admin Only</span>
    </div>
  );
}
