import { S } from '../styles';
import { TYPE_COLOR, timeAgo } from '../constants';

export default function NotificationsHistory({ sent }) {
  return (
    <div style={S.history}>
      <h2 style={S.composeTitle}>Sent Notifications</h2>
      {sent.length === 0 ? (
        <p style={{ fontSize: 13, color: "#bbb", textAlign: "center", paddingTop: 40 }}>No notifications sent yet</p>
      ) : sent.map(n => (
        <div key={n._id} style={S.sentCard}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ ...S.typeDot, background: (TYPE_COLOR[n.type] || "#aaa") + "22", color: TYPE_COLOR[n.type] || "#aaa" }}>
              {n.type}
            </span>
            <span style={{ fontSize: 10, color: "#bbb" }}>{timeAgo(n.sentAt)}</span>
          </div>
          <p style={S.sentTitle}>{n.title}</p>
          {n.body && <p style={{ fontSize: 12, color: "#888", marginTop: 4, lineHeight: 1.5 }}>{n.body}</p>}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 10, color: "#bbb" }}>{n.audience}</span>
            {n.openRate != null && (
              <span style={{ fontSize: 11, color: "#7ec87e", fontWeight: 500 }}>{n.openRate}% opened</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
