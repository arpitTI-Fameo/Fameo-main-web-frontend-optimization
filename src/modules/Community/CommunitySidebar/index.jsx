'use client';
// components/community/CommunitySidebar.js
import { useChatRooms } from '@/hooks/useCommunity';
import { SPACES_DATA } from '@/constants/community';

const NAV = [
  { id:'home',       icon:'⊞', label:'Community Home'                         },
  { id:'spaces',     icon:'◫', label:'Spaces'                                 },
  { id:'feedback',   icon:'◎', label:'Feedback & Reviews', badge:'12', badgeCls:'red'   },
  { id:'events',     icon:'◉', label:'Live Events',        badge:'LIVE',badgeCls:'green'},
  { id:'moderation', icon:'⊘', label:'Safety Center'                          },
];

const BOTTOM_NAV = [
  { id:'chat',    icon:'💬', label:'Messages'  },
  { id:'podcast', icon:'🎙️', label:'Podcasts'   },
];

export default function CommunitySidebar({ activePage, onNavigate, onOpenProfile, sidebarOpen, user }) {
  const u = user || {
    name:'Priya Sharma', role:'Fashion · 48K followers',
    initial:'P', grad:'linear-gradient(135deg,#6366f1,#a855f7)', id:'priya_sharma',
  };

  // Live unread count for chat badge
  const { totalUnread } = useChatRooms();
  const joined = Object.values(SPACES_DATA).filter(s => s.joined);

  return (
    <nav className={`cm-sidebar${sidebarOpen ? ' open' : ''}`}>

      {/* ── Logo ── */}
      <div className="cm-sidebar-logo">
        <div className="cm-logo-mark">
          <div className="cm-logo-icon">✦</div>
          <div className="cm-logo-text">Creator<span>Hub</span></div>
        </div>
      </div>

      {/* ── Main Nav ── */}
      <div style={{ padding:'8px' }}>
        <div className="cm-sidebar-section">Community</div>
        {NAV.map(n => (
          <a key={n.id}
            className={`cm-nav-item${activePage === n.id ? ' active' : ''}`}
            onClick={() => onNavigate(n.id)}
            style={{ cursor:'pointer' }}>
            <span className="cm-nav-icon">{n.icon}</span>
            {n.label}
            {n.badge && (
              <span className={`cm-nav-badge${n.badgeCls === 'green' ? ' green' : ''}`}>
                {n.badge}
              </span>
            )}
          </a>
        ))}
      </div>

      {/* ── My Spaces ── */}
      <div className="cm-sidebar-section" style={{ paddingLeft:20 }}>My Spaces</div>
      <div className="cm-sidebar-spaces">
        {joined.map(sp => (
          <div key={sp.id} className="cm-space-item" onClick={() => onNavigate('spaces')}>
            <div className="cm-space-dot" style={{ background:sp.color, boxShadow:`0 0 6px ${sp.color}` }} />
            {sp.name.replace('✦ ','')}
          </div>
        ))}
      </div>

      {/* ── Chat + Podcast (bottom section) ── */}
      <div style={{ padding:'8px', marginTop:'auto' }}>
        <div className="cm-sidebar-section">Studio</div>
        {BOTTOM_NAV.map(n => (
          <a key={n.id}
            className={`cm-nav-item${activePage === n.id ? ' active' : ''}`}
            onClick={() => onNavigate(n.id)}
            style={{ cursor:'pointer' }}>
            <span className="cm-nav-icon">{n.icon}</span>
            {n.label}
            {/* Live unread badge on Messages */}
            {n.id === 'chat' && totalUnread > 0 && (
              <span className="cm-nav-badge">{totalUnread > 99 ? '99+' : totalUnread}</span>
            )}
          </a>
        ))}
      </div>

      {/* ── Profile ── */}
      <div className="cm-sidebar-profile">
        <div className="cm-avatar"
          style={{ width:32, height:32, fontSize:13, background:u.grad, cursor:'pointer' }}
          onClick={() => onOpenProfile?.(u.id, u.name, u.role?.split(' · ')[0])}>
          {u.initial}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="cm-profile-name"
            onClick={() => onOpenProfile?.(u.id, u.name, u.role?.split(' · ')[0])}>
            {u.name}
          </div>
          <div className="cm-profile-role">{u.role}</div>
        </div>
      </div>
    </nav>
  );
}
