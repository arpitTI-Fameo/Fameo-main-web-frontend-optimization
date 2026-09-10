// 'use client';
// import { useState, useRef, useEffect } from 'react';
// import { MOCK_NOTIFICATIONS } from '@/constants/community';

// const SEARCH_MOCK = {
//   discussions: [
//     { label: 'Best lighting setup for reels under ₹5000', page: 'home' },
//     { label: 'I got my first brand deal at 10K followers', page: 'home' },
//   ],
//   creators: [
//     { label: 'Rohan Verma · Tech · 156K', userId: 'rohan_verma' },
//     { label: 'Zara Khan · Fashion · 92K', userId: 'zara_khan' },
//   ],
//   events: [
//     { label: 'Brand Deals Masterclass — LIVE', page: 'events' },
//     { label: 'Instagram Algorithm Decoded', page: 'events' },
//   ],
//   spaces: [
//     { label: 'Fashion Creators · 1.2K members', page: 'spaces' },
//     { label: 'Tech Creators · 980 members', page: 'spaces' },
//   ],
// };

// const PAGE_TITLES = {
//   home: 'Community', spaces: 'Spaces',
//   feedback: 'Feedback & Reviews', events: 'Live Events',
//   safety: 'Safety Center', _profile: 'Creator Profile',
// };

// const CAT_ICONS = { discussions: '💬', creators: '👤', events: '🎙️', spaces: '◫' };

// export default function CommunityTopbar({ activePage, onNavigate, onOpenPostModal, onOpenFeedbackModal, isLive }) {
//   const [q, setQ] = useState('');
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [notifOpen, setNotifOpen] = useState(false);
//   const [notifs, setNotifs] = useState(MOCK_NOTIFICATIONS);
//   const notifRef = useRef(null);
//   const searchRef = useRef(null);
//   const unread = notifs.filter(n => n.unread).length;

//   useEffect(() => {
//     const h = e => {
//       if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
//       if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
//     };
//     document.addEventListener('mousedown', h);
//     return () => document.removeEventListener('mousedown', h);
//   }, []);

//   return (
//     <div style={{
//       height: 'var(--cm-topbar-h)', background: 'var(--cm-bg2)',
//       borderBottom: '1px solid var(--cm-border)',
//       display: 'flex', alignItems: 'center', padding: '0 20px 0 24px', gap: 10,
//       position: 'sticky', top: 0, zIndex: 40,
//       boxShadow: '0 1px 0 var(--cm-border), 0 2px 12px rgba(20,20,60,0.04)',
//     }}>
//       {/* Hamburger */}
//       <button id="cm-hamburger" onClick={() => {
//         const s = document.getElementById('cm-sidebar');
//         if (s) s.style.transform = 'translateX(0)';
//         document.getElementById('cm-mob-overlay')?.classList.add('open');
//       }} style={{ display: 'none', width: 36, height: 36, alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cm-text2)', fontSize: 19, borderRadius: 8, flexShrink: 0 }}>
//         ☰
//       </button>

//       {/* Page Title */}
//       <div style={{ fontFamily: 'var(--cm-font-display)', fontSize: 20, fontWeight: 600, color: 'var(--cm-text)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
//         {PAGE_TITLES[activePage] || 'Community'}
//       </div>

//       {/* Search */}
//       {activePage === 'home' && (
//         <div ref={searchRef} style={{ flex: 1, maxWidth: 380, position: 'relative', marginLeft: 8 }}>
//           <div style={{ position: 'relative' }}>
//             <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--cm-text3)', fontSize: 14, pointerEvents: 'none' }}>🔍</span>
//             <input
//               value={q}
//               onChange={e => { setQ(e.target.value); if (e.target.value) setSearchOpen(true); }}
//               onFocus={() => setSearchOpen(true)}
//               placeholder="Search discussions, creators, events…"
//               style={{
//                 width: '100%', height: 38, background: 'var(--cm-bg3)',
//                 border: '1.5px solid var(--cm-border2)', borderRadius: 10,
//                 padding: '0 14px 0 38px', fontSize: 13.5, color: 'var(--cm-text)',
//                 fontFamily: 'var(--cm-font)', outline: 'none', transition: 'all .2s',
//               }}
//               onFocus={e => { e.target.style.borderColor = 'var(--cm-accent)'; e.target.style.boxShadow = '0 0 0 3px var(--cm-accent-soft)'; }}
//               onBlur={e => { e.target.style.borderColor = 'var(--cm-border2)'; e.target.style.boxShadow = 'none'; setTimeout(() => setSearchOpen(false), 180); }}
//             />
//           </div>
//           {searchOpen && (
//             <div className="cm-slide-down" style={{
//               position: 'absolute', top: 46, left: 0, right: 0,
//               background: 'var(--cm-bg2)', border: '1px solid var(--cm-border2)',
//               borderRadius: 14, boxShadow: 'var(--cm-shadow-lg)', zIndex: 500, overflow: 'hidden',
//             }}>
//               {Object.entries(SEARCH_MOCK).map(([cat, items]) => (
//                 <div key={cat}>
//                   <div style={{ padding: '8px 14px 3px', fontSize: 9.5, fontWeight: 700, color: 'var(--cm-text4)', textTransform: 'uppercase', letterSpacing: '.08em', fontFamily: 'var(--cm-font-ui)' }}>{cat}</div>
//                   {items.map((item, i) => (
//                     <div key={i} onClick={() => { if (item.page) onNavigate(item.page); setSearchOpen(false); setQ(''); }}
//                       style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', cursor: 'pointer', fontSize: 13.5, color: 'var(--cm-text2)', transition: 'background .1s' }}
//                       onMouseEnter={e => { e.currentTarget.style.background = 'var(--cm-surface)'; e.currentTarget.style.color = 'var(--cm-text)'; }}
//                       onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--cm-text2)'; }}
//                     >
//                       <span style={{ fontSize: 15, width: 20, textAlign: 'center', opacity: 0.6, flexShrink: 0 }}>{CAT_ICONS[cat]}</span>
//                       {item.label}
//                     </div>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Action buttons */}
//       <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
//         {activePage === 'home' && (
//           <>
//             <Btn
//               onClick={() => { onNavigate('events'); }}
//               style={{ background: 'var(--cm-grad-live)', color: '#fff', boxShadow: '0 4px 16px rgba(224,43,75,0.3)', animation: 'cm-pulse-live 2.2s infinite' }}
//             >
//               <span className="cm-live-dot" style={{ color: '#fff' }} /> Join Live
//             </Btn>
//             <Btn
//               onClick={() => { onNavigate('feedback'); onOpenFeedbackModal?.(); }}
//               style={{ background: 'var(--cm-grad-green)', color: '#fff', boxShadow: '0 4px 16px rgba(10,173,101,0.25)' }}
//             >
//               ◎ Ask Feedback
//             </Btn>
//             <Btn
//               onClick={onOpenPostModal}
//               style={{ background: 'var(--cm-grad-accent)', color: '#fff', boxShadow: 'var(--cm-shadow-accent)' }}
//             >
//               ✦ Start Discussion
//             </Btn>
//           </>
//         )}

//         {/* Notification Bell */}
//         <div ref={notifRef} style={{ position: 'relative' }}>
//           <button
//             onClick={() => setNotifOpen(v => !v)}
//             style={{
//               width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
//               background: notifOpen ? 'var(--cm-surface2)' : 'var(--cm-surface)',
//               border: '1.5px solid var(--cm-border2)', borderRadius: 10,
//               cursor: 'pointer', fontSize: 17, position: 'relative', transition: 'all .15s',
//             }}
//             onMouseEnter={e => { e.currentTarget.style.background = 'var(--cm-surface2)'; e.currentTarget.style.borderColor = 'var(--cm-border3)'; }}
//             onMouseLeave={e => { e.currentTarget.style.background = notifOpen ? 'var(--cm-surface2)' : 'var(--cm-surface)'; e.currentTarget.style.borderColor = 'var(--cm-border2)'; }}
//           >
//             🔔
//             {unread > 0 && (
//               <div style={{
//                 position: 'absolute', top: 5, right: 5, width: 9, height: 9,
//                 background: 'var(--cm-red)', borderRadius: '50%',
//                 border: '2px solid var(--cm-bg2)',
//                 boxShadow: '0 0 0 2px rgba(224,43,75,0.2)',
//               }} />
//             )}
//           </button>

//           {notifOpen && (
//             <div className="cm-scale-in" style={{
//               position: 'absolute', top: 48, right: 0, width: 340,
//               background: 'var(--cm-bg2)', border: '1px solid var(--cm-border2)',
//               borderRadius: 18, boxShadow: 'var(--cm-shadow-xl)', zIndex: 500, overflow: 'hidden',
//             }}>
//               <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid var(--cm-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                 <div>
//                   <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--cm-text)', fontFamily: 'var(--cm-font)' }}>Notifications</span>
//                   {unread > 0 && <span style={{ marginLeft: 8, fontSize: 10.5, background: 'var(--cm-accent-soft2)', color: 'var(--cm-accent)', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{unread} new</span>}
//                 </div>
//                 <span onClick={() => setNotifs(p => p.map(n => ({ ...n, unread: false })))} style={{ fontSize: 12, color: 'var(--cm-accent)', cursor: 'pointer', fontWeight: 600 }}>Mark all read</span>
//               </div>
//               {notifs.map(n => (
//                 <div key={n.id} style={{
//                   padding: '12px 18px', borderBottom: '1px solid var(--cm-border)',
//                   display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer',
//                   background: n.unread ? 'rgba(214,63,126,0.03)' : 'transparent',
//                   transition: 'background .12s',
//                 }}
//                 onMouseEnter={e => e.currentTarget.style.background = 'var(--cm-surface)'}
//                 onMouseLeave={e => e.currentTarget.style.background = n.unread ? 'rgba(214,63,126,0.03)' : 'transparent'}
//                 >
//                   <span style={{ fontSize: 20, flexShrink: 0 }}>{n.icon}</span>
//                   <div style={{ flex: 1 }}>
//                     <div style={{ fontSize: 13, color: 'var(--cm-text2)', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: n.body }} />
//                     <div style={{ fontSize: 11, color: 'var(--cm-text4)', marginTop: 3 }}>{n.time}</div>
//                   </div>
//                   {n.unread && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--cm-accent)', flexShrink: 0, marginTop: 5 }} />}
//                 </div>
//               ))}
//               <div style={{ padding: '10px 18px', textAlign: 'center' }}>
//                 <span style={{ fontSize: 12.5, color: 'var(--cm-accent)', cursor: 'pointer', fontWeight: 500 }}>View all notifications →</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function Btn({ children, onClick, style: s }) {
//   return (
//     <button onClick={onClick} style={{
//       display: 'inline-flex', alignItems: 'center', gap: 7,
//       padding: '0 16px', height: 38, borderRadius: 10,
//       fontSize: 13.5, fontWeight: 600, cursor: 'pointer', border: 'none',
//       fontFamily: 'var(--cm-font)', transition: 'all .15s', flexShrink: 0,
//       ...s,
//     }}
//     onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
//     onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
//     >
//       {children}
//     </button>
//   );
// }

'use client';
// components/community/CommunityTopbar.js
import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/hooks/useCommunity';
import * as svc from '@/services/community.service';
import { showToast } from './ui/Toast';
// SAST H-3 — notification bodies come from the backend and were rendered raw.
import { sanitizeInline } from '@/lib/security/sanitize';

const PAGE_TITLES = {
  home:'Community', spaces:'Spaces', feedback:'Feedback & Reviews',
  events:'Live Events', moderation:'Safety Center', safety:'Safety Center', profile:'Profile',
};

export default function CommunityTopbar({ activePage, onNavigate, onOpenPost, onOpenFeedback, onHamburger }) {
  const [searchVal, setSearchVal]     = useState('');
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [notifOpen, setNotifOpen]     = useState(false);
  const { notifs, unread, markAllRead } = useNotifications();
  const searchRef  = useRef(null);
  const notifRef   = useRef(null);
  const searchTimer = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handle(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (notifRef.current  && !notifRef.current.contains(e.target))  setNotifOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  function handleSearch(val) {
    setSearchVal(val);
    clearTimeout(searchTimer.current);
    if (!val.trim()) { setSearchResults(null); return; }
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await svc.search(val);
        setSearchResults(res);
      } catch { setSearchResults(null); }
    }, 350);
  }

  async function handleJoinLive() {
    try {
      const live = await svc.getLiveEvent();
      if (live) {
        onNavigate('events');
        showToast('🎧 Entering live room — ' + live.title, 'success');
      } else {
        onNavigate('events');
        showToast('📅 No live event now. Showing upcoming events.', 'info');
      }
    } catch {
      onNavigate('events');
    }
  }

  const isHome = activePage === 'home';

  return (
    <div className="cm-topbar">
      <button className="cm-hamburger" onClick={onHamburger}>☰</button>
      <div className="cm-topbar-title">{PAGE_TITLES[activePage] || 'Community'}</div>

      {/* Search — only on home page */}
      {isHome && (
        <div className="cm-topbar-search" ref={searchRef}>
          <span className="cm-search-icon">🔍</span>
          <input
            className="cm-search-input"
            placeholder="Search discussions, creators, events…"
            value={searchVal}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => setSearchOpen(true)}
          />
          {searchOpen && (
            <div className="cm-search-drop cm-slide-down">
              {searchResults ? (
                <>
                  {searchResults.discussions?.length > 0 && (
                    <>
                      <div className="cm-search-cat">Discussions</div>
                      {searchResults.discussions.slice(0,3).map((d,i) => (
                        <div key={i} className="cm-search-result" onClick={() => setSearchOpen(false)}>
                          <span style={{ fontSize:14, width:18 }}>💬</span>{d.title}
                        </div>
                      ))}
                    </>
                  )}
                  {searchResults.spaces?.length > 0 && (
                    <>
                      <div className="cm-search-cat">Spaces</div>
                      {searchResults.spaces.slice(0,2).map((s,i) => (
                        <div key={i} className="cm-search-result" onClick={() => { onNavigate('spaces'); setSearchOpen(false); }}>
                          <span style={{ fontSize:14, width:18 }}>◫</span>{s.name}
                        </div>
                      ))}
                    </>
                  )}
                </>
              ) : (
                /* Static suggestions when no query */
                <>
                  <div className="cm-search-cat">Discussions</div>
                  <div className="cm-search-result" onClick={() => setSearchOpen(false)}><span style={{ fontSize:14, width:18 }}>💬</span>Best lighting setup for reels under ₹5000</div>
                  <div className="cm-search-result" onClick={() => setSearchOpen(false)}><span style={{ fontSize:14, width:18 }}>💬</span>I got my first brand deal at 10K followers</div>
                  <div className="cm-search-cat">Events</div>
                  <div className="cm-search-result" onClick={() => { onNavigate('events'); setSearchOpen(false); }}><span style={{ fontSize:14, width:18 }}>🎙️</span>Brand Deals Masterclass — LIVE NOW</div>
                  <div className="cm-search-cat">Spaces</div>
                  <div className="cm-search-result" onClick={() => { onNavigate('spaces'); setSearchOpen(false); }}><span style={{ fontSize:14, width:18 }}>◫</span>Fashion Creators Space — 1.2K members</div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <div className="cm-topbar-actions">
        {isHome && (
          <>
            <button className="cm-btn cm-btn-live" onClick={handleJoinLive}>
              <div className="cm-live-dot" /> Join Live
            </button>
            <button className="cm-btn cm-btn-feedback" onClick={onOpenFeedback}>◎ Ask Feedback</button>
            <button className="cm-btn cm-btn-primary" onClick={onOpenPost}>✦ Start Discussion</button>
          </>
        )}

        {/* Notification bell */}
        <div className="cm-notif-bell" ref={notifRef} onClick={() => setNotifOpen(v => !v)}>
          🔔
          {unread > 0 && <div className="cm-notif-dot" />}

          {notifOpen && (
            <div className="cm-notif-panel cm-scale-in">
              <div className="cm-notif-header">
                Notifications
                <span style={{ fontSize:11, color:'var(--cm-accent2)', cursor:'pointer', fontWeight:400 }}
                  onClick={e => { e.stopPropagation(); markAllRead(); }}>Mark all read</span>
              </div>

              {notifs.length === 0 ? (
                /* Static fallback notifs */
                <>
                  <div className="cm-notif-item unread">
                    <span style={{ fontSize:18 }}>🎙️</span>
                    <div style={{ flex:1 }}>
                      <div className="cm-notif-body"><strong style={{ color:'var(--cm-text)' }}>Brand Deals Masterclass</strong> is live now — 540 listening</div>
                      <div className="cm-notif-time">2 min ago</div>
                    </div>
                  </div>
                  <div className="cm-notif-item unread">
                    <span style={{ fontSize:18 }}>◎</span>
                    <div style={{ flex:1 }}>
                      <div className="cm-notif-body"><strong style={{ color:'var(--cm-text)' }}>Rohan Verma</strong> reviewed your reel draft — 4.2/5 stars</div>
                      <div className="cm-notif-time">1 hr ago</div>
                    </div>
                  </div>
                  <div className="cm-notif-item">
                    <span style={{ fontSize:18 }}>👥</span>
                    <div style={{ flex:1 }}>
                      <div className="cm-notif-body"><strong style={{ color:'var(--cm-text)' }}>Zara Khan</strong> started following you</div>
                      <div className="cm-notif-time">3 hrs ago</div>
                    </div>
                  </div>
                </>
              ) : notifs.map((n, i) => (
                <div key={i} className={`cm-notif-item${!n.read ? ' unread' : ''}`}>
                  <span style={{ fontSize:18 }}>{n.icon || '🔔'}</span>
                  <div style={{ flex:1 }}>
                    <div className="cm-notif-body" dangerouslySetInnerHTML={{ __html: sanitizeInline(n.message) }} />
                    <div className="cm-notif-time">{n.timeAgo || new Date(n.createdAt).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}