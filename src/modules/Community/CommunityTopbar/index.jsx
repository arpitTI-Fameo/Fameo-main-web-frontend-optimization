'use client';
// components/community/CommunityTopbar.js
import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/hooks/useCommunity';
import * as svc from '@/services/community.service';
import { showToast } from '../Toast';
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
