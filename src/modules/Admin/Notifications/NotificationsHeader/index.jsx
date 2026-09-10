import { S } from '../styles';

export default function NotificationsHeader() {
  return (
    <div style={S.header}>
      <h1 style={S.heading}>Notifications</h1>
      <p style={S.sub}>Broadcast messages to all learners or module followers.</p>
    </div>
  );
}
