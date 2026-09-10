// // 'use client';
// // import { SPACES } from '@/constants/community';

// // const NAV = [
// //   { id: 'home',     icon: '⊞', label: 'Community Home',      badge: null },
// //   { id: 'spaces',   icon: '◫', label: 'Spaces',              badge: null },
// //   { id: 'feedback', icon: '◎', label: 'Feedback & Reviews',  badge: '12' },
// //   { id: 'events',   icon: '◉', label: 'Live Events',         badge: 'LIVE', live: true },
// //   { id: 'safety',   icon: '⊘', label: 'Safety Center',       badge: null },
// // ];

// // export default function CommunitySidebar({ activePage, onNavigate, user }) {
// //   const u = user || { name: 'Priya Sharma', niche: 'Fashion · 48K', initial: 'P', gradient: 'linear-gradient(135deg,#f07ab8,#d63f7e)' };
// //   const joined = SPACES.filter(s => s.joined);

// //   return (
// //     <nav id="cm-sidebar" style={{
// //       width: 'var(--cm-nav-width)', background: 'var(--cm-bg2)',
// //       borderRight: '1px solid var(--cm-border)', position: 'fixed',
// //       top: 0, left: 0, height: '100vh', zIndex: 50,
// //       display: 'flex', flexDirection: 'column', overflowY: 'auto',
// //       transition: 'transform .28s cubic-bezier(0.22,1,0.36,1)',
// //       boxShadow: 'var(--cm-shadow-sm)',
// //     }}>
// //       {/* Logo */}
// //       <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid var(--cm-border)' }}>
// //         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
// //           <div style={{
// //             width: 36, height: 36, borderRadius: 10, flexShrink: 0,
// //             background: 'var(--cm-grad-accent)',
// //             display: 'flex', alignItems: 'center', justifyContent: 'center',
// //             fontSize: 17, color: '#fff', fontWeight: 700,
// //             boxShadow: 'var(--cm-shadow-accent)',
// //           }}>✦</div>
// //           <div>
// //             <div style={{ fontFamily: 'var(--cm-font-display)', fontSize: 21, fontWeight: 700, color: 'var(--cm-text)', letterSpacing: '-0.01em', lineHeight: 1 }}>
// //               Fam<span style={{ color: 'var(--cm-accent)' }}>eo</span>
// //             </div>
// //             <div style={{ fontSize: 10, color: 'var(--cm-text3)', fontFamily: 'var(--cm-font-ui)', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', marginTop: 1 }}>Community</div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Nav */}
// //       <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
// //         <div style={{ padding: '12px 10px 8px' }}>
// //           <SectionLabel>Navigation</SectionLabel>
// //           {NAV.map(item => (
// //             <NavItem key={item.id} item={item} active={activePage === item.id} onClick={() => onNavigate(item.id)} />
// //           ))}
// //         </div>

// //         <div style={{ padding: '4px 10px 8px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
// //           <SectionLabel>My Spaces</SectionLabel>
// //           <div style={{ flex: 1, overflowY: 'auto' }}>
// //             {joined.map(space => (
// //               <SpaceItem
// //                 key={space.id}
// //                 space={space}
// //                 active={activePage === `space-${space.id}`}
// //                 onClick={() => onNavigate(`space-${space.id}`)}
// //               />
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Profile */}
// //       <div style={{
// //         padding: '12px 14px', borderTop: '1px solid var(--cm-border)',
// //         background: 'var(--cm-bg3)',
// //       }}>
// //         <div
// //           onClick={() => onNavigate('profile-self')}
// //           style={{
// //             display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
// //             padding: '8px 10px', borderRadius: 12,
// //             transition: 'background .15s',
// //           }}
// //           onMouseEnter={e => e.currentTarget.style.background = 'var(--cm-surface2)'}
// //           onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
// //         >
// //           <div style={{
// //             width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
// //             background: u.gradient, display: 'flex', alignItems: 'center',
// //             justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#fff',
// //             boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
// //           }}>{u.initial}</div>
// //           <div style={{ flex: 1, minWidth: 0 }}>
// //             <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cm-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
// //             <div style={{ fontSize: 11, color: 'var(--cm-text3)', marginTop: 1 }}>{u.niche}</div>
// //           </div>
// //           <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--cm-green)', flexShrink: 0, boxShadow: '0 0 0 2px var(--cm-green-soft2)' }} />
// //         </div>
// //       </div>
// //     </nav>
// //   );
// // }

// // function SectionLabel({ children }) {
// //   return (
// //     <div style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--cm-text4)', letterSpacing: '.1em', textTransform: 'uppercase', padding: '0 10px 6px', fontFamily: 'var(--cm-font-ui)' }}>
// //       {children}
// //     </div>
// //   );
// // }

// // function NavItem({ item, active, onClick }) {
// //   return (
// //     <div
// //       onClick={onClick}
// //       style={{
// //         display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
// //         marginBottom: 2, borderRadius: 10, cursor: 'pointer',
// //         background: active ? 'var(--cm-accent-soft2)' : 'transparent',
// //         color: active ? 'var(--cm-accent)' : 'var(--cm-text2)',
// //         fontWeight: active ? 600 : 400, fontSize: 13.5,
// //         fontFamily: 'var(--cm-font)',
// //         transition: 'all .15s',
// //         position: 'relative',
// //       }}
// //       onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--cm-surface)'; e.currentTarget.style.color = 'var(--cm-text)'; } }}
// //       onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--cm-text2)'; } }}
// //     >
// //       {active && (
// //         <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, borderRadius: 2, background: 'var(--cm-accent)' }} />
// //       )}
// //       <span style={{ fontSize: 17, width: 22, textAlign: 'center', flexShrink: 0, opacity: active ? 1 : 0.65 }}>{item.icon}</span>
// //       <span style={{ flex: 1 }}>{item.label}</span>
// //       {item.badge && (
// //         <span style={{
// //           fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
// //           background: item.live ? 'var(--cm-red)' : 'var(--cm-accent-soft2)',
// //           color: item.live ? '#fff' : 'var(--cm-accent)',
// //           fontFamily: 'var(--cm-font-ui)', letterSpacing: '.03em',
// //           boxShadow: item.live ? '0 2px 8px rgba(224,43,75,0.3)' : 'none',
// //         }}>{item.badge}</span>
// //       )}
// //     </div>
// //   );
// // }

// // function SpaceItem({ space, active, onClick }) {
// //   return (
// //     <div
// //       onClick={onClick}
// //       style={{
// //         display: 'flex', alignItems: 'center', gap: 9, padding: '7px 12px',
// //         borderRadius: 9, cursor: 'pointer', fontSize: 12.5, transition: 'all .15s',
// //         color: active ? 'var(--cm-text)' : 'var(--cm-text2)',
// //         background: active ? 'var(--cm-surface2)' : 'transparent',
// //         marginBottom: 1,
// //       }}
// //       onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--cm-surface)'; e.currentTarget.style.color = 'var(--cm-text)'; } }}
// //       onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--cm-text2)'; } }}
// //     >
// //       <div style={{
// //         width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
// //         background: space.color,
// //         boxShadow: active ? `0 0 0 2px ${space.color}40` : 'none',
// //       }} />
// //       <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{space.name}</span>
// //     </div>
// //   );
// // }
// 'use client';
// // components/community/CommunitySidebar.js
// import { SPACES_DATA } from '@/constants/community';

// const NAV = [
//   { id:'home',       icon:'⊞', label:'Community Home'     },
//   { id:'spaces',     icon:'◫', label:'Spaces'             },
//   { id:'feedback',   icon:'◎', label:'Feedback & Reviews', badge:'12',   badgeCls:'red'   },
//   { id:'events',     icon:'◉', label:'Live Events',        badge:'LIVE', badgeCls:'green' },
//   { id:'moderation', icon:'⊘', label:'Safety Center'      },
// ];

// export default function CommunitySidebar({ activePage, onNavigate, onOpenProfile, sidebarOpen, user }) {
//   const u = user || { name:'Priya Sharma', role:'Fashion · 48K followers', initial:'P', grad:'linear-gradient(135deg,#6366f1,#a855f7)', id:'priya_sharma' };
//   const joined = Object.values(SPACES_DATA).filter(s => s.joined);

//   return (
//     <nav className={`cm-sidebar${sidebarOpen ? ' open' : ''}`}>

//       {/* Logo */}
//       <div className="cm-sidebar-logo">
//         <div className="cm-logo-mark">
//           <div className="cm-logo-icon">✦</div>
//           <div className="cm-logo-text">Creator<span>Hub</span></div>
//         </div>
//       </div>

//       {/* Nav items */}
//       <div style={{ padding:'8px' }}>
//         <div className="cm-sidebar-section">Community</div>
//         {NAV.map(n => (
//           <a key={n.id} className={`cm-nav-item${activePage===n.id?' active':''}`} onClick={() => onNavigate(n.id)} style={{ cursor:'pointer' }}>
//             <span className="cm-nav-icon">{n.icon}</span>
//             {n.label}
//             {n.badge && <span className={`cm-nav-badge${n.badgeCls==='green'?' green':''}`}>{n.badge}</span>}
//           </a>
//         ))}
//       </div>

//       {/* My Spaces */}
//       <div className="cm-sidebar-section" style={{ paddingLeft:20 }}>My Spaces</div>
//       <div className="cm-sidebar-spaces">
//         {joined.map(sp => (
//           <div key={sp.id} className="cm-space-item" onClick={() => onNavigate('spaces')}>
//             <div className="cm-space-dot" style={{ background:sp.color, boxShadow:`0 0 6px ${sp.color}` }} />
//             {sp.name.replace('✦ ','')}
//           </div>
//         ))}
//       </div>

//       {/* Profile */}
//       <div className="cm-sidebar-profile">
//         <div className="cm-avatar" style={{ width:32, height:32, fontSize:13, background:u.grad, cursor:'pointer' }}
//           onClick={() => onOpenProfile?.(u.id, u.name, u.role?.split(' · ')[0])}>
//           {u.initial}
//         </div>
//         <div style={{ flex:1, minWidth:0 }}>
//           <div className="cm-profile-name" onClick={() => onOpenProfile?.(u.id, u.name, u.role?.split(' · ')[0])}>{u.name}</div>
//           <div className="cm-profile-role">{u.role}</div>
//         </div>
//       </div>
//     </nav>
//   );
// }


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