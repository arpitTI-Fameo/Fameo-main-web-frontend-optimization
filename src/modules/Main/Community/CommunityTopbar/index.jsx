'use client';
// components/community/CommunityTopbar.js
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useNotifications } from '@/lib/hooks/main/usePortal';
import { useCommunitySearch, useReadNotificationsMutation } from '@/lib/hooks/main/useCommunity';
import { useLiveEvent } from '@/lib/hooks/main/useEvent';
import { showToast } from '../Toast';
// SAST H-3 — notification bodies come from the backend and were rendered raw.
import { sanitizeInline } from '@/lib/security/sanitize';

const PAGE_TITLES = {
  home: 'Community', spaces: 'Spaces', feedback: 'Feedback & Reviews',
  events: 'Live Events', moderation: 'Safety Center', safety: 'Safety Center', profile: 'Profile',
};

export default function CommunityTopbar({ activePage, onNavigate, onOpenPost, onOpenFeedback, onHamburger }) {
  const { user, token } = useAuthStore();
  const [searchVal, setSearchVal] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { data: notifsRes } = useNotifications({ enabled: !!token });
  const notifs = Array.isArray(notifsRes?.data) ? notifsRes.data : Array.isArray(notifsRes) ? notifsRes : [];
  const unread = notifs.filter(n => !n.read).length;
  const { mutateAsync: markAllRead } = useReadNotificationsMutation();
  const searchRef = useRef(null);
  const notifRef = useRef(null);

  // Use debounced value for query
  const [debouncedQ, setDebouncedQ] = useState(searchVal);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(searchVal), 300);
    return () => clearTimeout(timer);
  }, [searchVal]);

  const { data: searchResults, isFetching: searching } = useCommunitySearch(debouncedQ, { enabled: debouncedQ.length > 1 });
  const { data: liveEvent } = useLiveEvent();

  // Close dropdowns on outside click
  useEffect(() => {
    function handle(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  function handleSearch(val) {
    setSearchVal(val);
    setSearchOpen(true);
  }

  function handleJoinLive() {
    if (liveEvent) {
      onNavigate('events');
      showToast('🎧 Entering live room — ' + (liveEvent.title || 'Live'), 'success');
    } else {
      onNavigate('events');
      showToast('📅 No live event now. Showing upcoming events.', 'info');
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
              {searching ? (
                <div style={{ padding: 16, textAlign: 'center', color: 'var(--cm-text3)', fontSize: 13 }}>Searching…</div>
              ) : debouncedQ.length > 1 && (searchResults?.data?.length > 0 || searchResults?.length > 0) ? (
                <div>
                  {(searchResults?.data || searchResults).map(r => (
                    <Link key={r.id} href={r.type === 'user' ? `/community/user/${r.id}` : `/community/space/${r.id}`} style={{ textDecoration: 'none' }} onClick={() => setSearchOpen(false)}>
                      <div className="cm-search-result" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 14, width: 18 }}>{r.type === 'user' ? '👤' : '◫'}</span>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--cm-text)' }}>{r.name || r.title}</div>
                          {r.type && <div style={{ fontSize: 11, color: 'var(--cm-text3)' }}>{r.type === 'user' ? `@${r.handle}` : r.members ? `${r.members} members` : ''}</div>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : debouncedQ.length > 1 ? (
                <div style={{ padding: 16, textAlign: 'center', color: 'var(--cm-text3)', fontSize: 13 }}>No results found</div>
              ) : (
                /* Static suggestions when no query */
                <>
                  <div className="cm-search-cat">Discussions</div>
                  <div className="cm-search-result" onClick={() => setSearchOpen(false)}><span style={{ fontSize: 14, width: 18 }}>💬</span>Best lighting setup for reels under ₹5000</div>
                  <div className="cm-search-result" onClick={() => setSearchOpen(false)}><span style={{ fontSize: 14, width: 18 }}>💬</span>I got my first brand deal at 10K followers</div>
                  <div className="cm-search-cat">Events</div>
                  <div className="cm-search-result" onClick={() => { onNavigate('events'); setSearchOpen(false); }}><span style={{ fontSize: 14, width: 18 }}>🎙️</span>Brand Deals Masterclass — LIVE NOW</div>
                  <div className="cm-search-cat">Spaces</div>
                  <div className="cm-search-result" onClick={() => { onNavigate('spaces'); setSearchOpen(false); }}><span style={{ fontSize: 14, width: 18 }}>◫</span>Fashion Creators Space — 1.2K members</div>
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
                <span style={{ fontSize: 11, color: 'var(--cm-accent2)', cursor: 'pointer', fontWeight: 400 }}
                  onClick={e => { e.stopPropagation(); markAllRead(); }}>Mark all read</span>
              </div>

              {notifs.length === 0 ? (
                /* Static fallback notifs */
                <>
                  <div className="cm-notif-item unread">
                    <span style={{ fontSize: 18 }}>🎙️</span>
                    <div style={{ flex: 1 }}>
                      <div className="cm-notif-body"><strong style={{ color: 'var(--cm-text)' }}>Brand Deals Masterclass</strong> is live now — 540 listening</div>
                      <div className="cm-notif-time">2 min ago</div>
                    </div>
                  </div>
                  <div className="cm-notif-item unread">
                    <span style={{ fontSize: 18 }}>◎</span>
                    <div style={{ flex: 1 }}>
                      <div className="cm-notif-body"><strong style={{ color: 'var(--cm-text)' }}>Rohan Verma</strong> reviewed your reel draft — 4.2/5 stars</div>
                      <div className="cm-notif-time">1 hr ago</div>
                    </div>
                  </div>
                  <div className="cm-notif-item">
                    <span style={{ fontSize: 18 }}>👥</span>
                    <div style={{ flex: 1 }}>
                      <div className="cm-notif-body"><strong style={{ color: 'var(--cm-text)' }}>Zara Khan</strong> started following you</div>
                      <div className="cm-notif-time">3 hrs ago</div>
                    </div>
                  </div>
                </>
              ) : notifs.map((n, i) => (
                <div key={i} className={`cm-notif-item${!n.read ? ' unread' : ''}`}>
                  <span style={{ fontSize: 18 }}>{n.icon || '🔔'}</span>
                  <div style={{ flex: 1 }}>
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
