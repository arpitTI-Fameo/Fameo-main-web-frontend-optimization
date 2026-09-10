import { S } from '../styles';

export default function ActivityFeed({ activity }) {
  return (
    <div style={S.card}>
      <div style={S.cardHead}><h2 style={S.cardTitle}>Recent Platform Activity</h2></div>
      {activity.map((a, i) => (
        <div key={i} style={S.activityRow}>
          <span style={{ ...S.activityDot, background: a.color }} />
          <div>
            <span style={S.activityAction}>{a.action}</span>
            <span style={S.activityTarget}> — {a.target}</span>
            <div style={S.activityMeta}>{a.user} · {a.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
