import { S } from '../styles';
import { MODULES } from '../constants';

export default function NotificationsCompose({ form, set, send, sending }) {
  return (
    <div style={S.compose}>
      <h2 style={S.composeTitle}>New Notification</h2>

      <label style={S.label}>Title</label>
      <input style={S.input} value={form.title} onChange={e => set("title", e.target.value)}
        placeholder="Notification title…" />

      <label style={{ ...S.label, marginTop: 14 }}>Body</label>
      <textarea style={S.textarea} value={form.body} onChange={e => set("body", e.target.value)}
        placeholder="Message body…" rows={4} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
        <div>
          <label style={S.label}>Type</label>
          <select style={S.select} value={form.type} onChange={e => set("type", e.target.value)}>
            <option value="newContent">New Content</option>
            <option value="product">Product</option>
            <option value="platformUpdate">Platform Update</option>
          </select>
        </div>
        <div>
          <label style={S.label}>Audience</label>
          <select style={S.select} value={form.audience} onChange={e => set("audience", e.target.value)}>
            <option value="all">All Learners</option>
            <option value="moduleFollowers">Module Followers</option>
            <option value="activeOnly">Active Only</option>
          </select>
        </div>
      </div>

      {form.audience === "moduleFollowers" && (
        <div style={{ marginTop: 12 }}>
          <label style={S.label}>Module</label>
          <select style={S.select} value={form.moduleId || ""} onChange={e => set("moduleId", parseInt(e.target.value))}>
            <option value="">Select module…</option>
            {MODULES.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
        </div>
      )}

      <button onClick={send} disabled={sending} style={{ ...S.sendBtn, opacity: sending ? 0.7 : 1 }}>
        {sending ? "Sending…" : "◉ Send Notification"}
      </button>
    </div>
  );
}
