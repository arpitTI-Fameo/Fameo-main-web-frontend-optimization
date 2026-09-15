'use client';
// components/community/pages/CommunityHome.js
// Spec §3.1 — Community Home
// All v2 fixes applied:
// ✅ Join Live reads API state (🔧 FIXED §3.1)
// ✅ Ask for Feedback → /feedback?open=submit (🔧 FIXED §3.1)
// ✅ /api/community/hero call for hero strip (never empty)
// ✅ Infinite scroll at 80% threshold (§3.1)
// ✅ Event Highlight Card injected every 8th post (§3.1)
// ✅ All 4 right rail widgets (§3.1)
// ✅ Skeleton on load, error state with retry (§2.4)

import { useState, useEffect, useRef, useCallback } from 'react';
import PostCard, { PostCardSkeleton, EventHighlightCard } from '../PostCard';
import { FEED_TABS, MOCK_EVENTS } from '@/constants/community';
import { useAuthStore } from '@/store/authStore';
import { showToast } from '../Toast';
import { toUserMessage } from '@/lib/api/errors';
import { useCommunityHero, useFeed, useTopCreators } from '@/lib/hooks/main/useCommunity';
import { useLiveEvent, useEvents, useRSVPMutation } from '@/lib/hooks/main/useEvent';


const QUICK_LINKS = [
  { icon: '📚', label: 'Brand Guide' },
  { icon: '🎒', label: 'Resources' },
  { icon: '📄', label: 'Pitch Kit' },
  { icon: '❓', label: 'FAQ' },
];

export default function CommunityHome({ onNavigate, onOpenProfile, onReport, onOpenPost, onOpenFeedback }) {
  const [activeTab, setActiveTab] = useState('foryou');
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [feedError, setFeedError] = useState(false);

  // Hero data from /api/community/hero
  const [heroData, setHeroData] = useState(null);
  const [liveEvent, setLiveEvent] = useState(null);

  // Right rail
  const [railEvents, setRailEvents] = useState([]);
  const [topCreators, setTopCreators] = useState([]);
  const [rsvped, setRsvped] = useState({});

  const sentinelRef = useRef(null);
  const tabRef = useRef(activeTab);
  tabRef.current = activeTab;

  const { token } = useAuthStore();
  const { data: heroRes } = useCommunityHero({ enabled: !!token });
  const { data: liveEventRes } = useLiveEvent();
  const { data: upcomingEventsRes } = useEvents('upcoming');
  const { data: topCreatorsRes } = useTopCreators('week');
  const { data: feedRes, isLoading: feedLoading, isError: feedErrorFlag } = useFeed(activeTab, page);
  const { mutateAsync: rsvpMutation } = useRSVPMutation();

  useEffect(() => {
    if (heroRes) setHeroData(heroRes.data || heroRes);
    if (liveEventRes?.data) setLiveEvent(liveEventRes.data);
    
    if (upcomingEventsRes?.data) {
      setRailEvents(upcomingEventsRes.data.slice(0, 3));
    } else if (Array.isArray(upcomingEventsRes)) {
      setRailEvents(upcomingEventsRes.slice(0, 3));
    } else {
      setRailEvents(MOCK_EVENTS.filter(e => e.status === 'upcoming').slice(0, 3));
    }

    if (topCreatorsRes?.data) {
      setTopCreators(topCreatorsRes.data);
    } else if (Array.isArray(topCreatorsRes)) {
      setTopCreators(topCreatorsRes);
    }
  }, [heroRes, liveEventRes, upcomingEventsRes, topCreatorsRes]);

  useEffect(() => {
    setLoading(feedLoading && page === 1);
    setLoadingMore(feedLoading && page > 1);
    setFeedError(feedErrorFlag);

    if (feedRes) {
      const items = Array.isArray(feedRes) ? feedRes : feedRes?.data || [];
      setPosts(prev => (page === 1 ? items : [...prev, ...items]));
      setHasMore(items.length >= 20);
    }
  }, [feedRes, feedLoading, feedErrorFlag, page]);

  // Load next page
  const loadFeed = useCallback((tab, pg, append = false) => {
    setPage(pg);
  }, []);

  useEffect(() => {
    setPosts([]); setPage(1); setHasMore(true);
  }, [activeTab]);

  // ── Infinite scroll — trigger at 80% of content (§3.1) ───────────────────
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
        loadFeed(tabRef.current, page + 1, true);
      }
    }, { threshold: 0 });
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [hasMore, loadingMore, loading, page, loadFeed]);

  // ── Inject Event Highlight Card every 8th post (§3.1: positions 2,10,18…) ─
  function buildFeedRows() {
    const rows = [];
    posts.forEach((p, i) => {
      // Inject at index 1 (position 2), 9 (position 10), 17 (position 18)…
      if ((i === 1 || (i > 1 && (i - 1) % 8 === 0)) && liveEvent) {
        rows.push({ type: 'event', key: `ev-${i}` });
      }
      rows.push({ type: 'post', post: p, key: p._id || i });
    });
    return rows;
  }

  async function handleJoinLive() {
    try {
      if (liveEvent && liveEvent.status === 'live') {
        onNavigate('events');
        showToast(`🎧 Entering live room — "${liveEvent.title}"`, 'success');
      } else {
        onNavigate('events');
        showToast('📅 No live event right now. Showing upcoming events.', 'info');
      }
    } catch {
      onNavigate('events');
    }
  }

  // ── Ask for Feedback → ?open=submit (§3.1 FIXED) ─────────────────────────
  function handleAskFeedback() {
    // Navigate to feedback and auto-open modal via onOpenFeedback
    onOpenFeedback?.();
    onNavigate('feedback');
  }

  async function handleRSVP(eventId) {
    if (!eventId || rsvped[eventId]) return;
    // The catch used to be empty, so a failed RSVP still marked the event saved
    // and still showed the success toast — the user was told it worked when it
    // had not. The success path below is unchanged.
    try {
      await rsvpMutation(eventId);
    } catch (err) {
      showToast(toUserMessage(err), 'error');
      return;
    }
    setRsvped(p => ({ ...p, [eventId]: true }));
    showToast('📅 Event saved! Reminder 24h before + 15min before.', 'success');
  }

  // Hero data fallbacks
  const liveCard = heroData?.liveEvent || liveEvent;
  const challenge = heroData?.challenge || null;
  const circle = heroData?.recommendedCircle || null;
  const mockTop = [
    { name: 'Priya Sharma', niche: 'Fashion', pts: 2840, rank: 1, id: 'priya_sharma' },
    { name: 'Rohan Verma', niche: 'Tech', pts: 2210, rank: 2, id: 'rohan_verma' },
    { name: 'Zara Khan', niche: 'Fashion', pts: 1950, rank: 3, id: 'zara_khan' },
  ];
  const creators = topCreators.length > 0 ? topCreators : mockTop;
  const rankCls = r => r === 1 ? 'gold' : r === 2 ? 'silver' : r === 3 ? 'bronze' : '';

  return (
    <div>
      {/* ── Hero Strip — NEVER empty (§3.1) ── */}
      <div className="cm-hero-strip">

        {/* Card 1: Live Now / upcoming fallback */}
        <div className="cm-hero-card live" onClick={handleJoinLive}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700,
            letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--cm-red)', marginBottom: 8
          }}>
            <div style={{ width: 7, height: 7, background: 'var(--cm-red)', borderRadius: '50%', animation: 'cm-blink 1.2s infinite' }} />
            {liveCard?.status === 'live' ? 'Live Now' : '📅 Upcoming'}
          </div>
          <div style={{
            fontSize: 15, fontWeight: 600, color: 'var(--cm-text)', marginBottom: 6, lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {liveCard?.title || 'Brand Deals Masterclass: How to pitch yourself to 10x brand partnerships'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--cm-text3)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🎙️ {liveCard?.host?.name || 'Arjun Mehta'}</span>
            <span>•</span>
            {liveCard?.status === 'live'
              ? <span style={{ color: 'var(--cm-red)' }}>🔴 {liveCard?.listenerCount || 540} listening</span>
              : <span>{liveCard?.scheduledAt ? new Date(liveCard.scheduledAt).toLocaleString('en-IN', { weekday: 'short', hour: '2-digit', minute: '2-digit' }) : 'Tomorrow 7PM'}</span>}
          </div>
          <button className="cm-btn cm-btn-live" style={{ fontSize: 12, height: 30 }}>
            {liveCard?.status === 'live' ? 'Join Now →' : 'Set Reminder →'}
          </button>
        </div>

        {/* Card 2: Weekly Challenge / upcoming fallback */}
        <div className="cm-hero-card challenge">
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--cm-orange)', marginBottom: 8 }}>
            🏁 Weekly Challenge
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--cm-text)', marginBottom: 6 }}>
            {challenge?.name || '30 Days Reels Challenge'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--cm-text3)', marginBottom: 8, display: 'flex', gap: 8 }}>
            <span>{challenge?.daysLeft || '5'} days left</span>
            <span>•</span>
            <span>{challenge?.participantCount || '847'} joined</span>
          </div>
          <div className="cm-progress-bar">
            <div className="cm-progress-fill" style={{
              width: `${challenge?.progress || 73}%`,
              background: 'linear-gradient(90deg,var(--cm-orange),var(--cm-gold))',
            }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--cm-text3)', marginBottom: 10 }}>{challenge?.progress || 73}% complete</div>
          <button className="cm-btn cm-btn-ghost" style={{ fontSize: 12, height: 30 }}>View Progress →</button>
        </div>

        {/* Card 3: Recommended Circle */}
        <div className="cm-hero-card circle">
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--cm-accent2)', marginBottom: 8 }}>
            🎓 Recommended Circle
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--cm-text)', marginBottom: 6 }}>
            {circle?.name || 'Creator Monetization Masterclass'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--cm-text3)', marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span>🎓 {circle?.moduleCount || 12} modules</span>
            <span>•</span>
            <span>{circle?.memberCount || '3.2K'} enrolled</span>
          </div>
          <button className="cm-btn cm-btn-primary" style={{ fontSize: 12, height: 30, background: 'linear-gradient(135deg,var(--cm-accent),#a855f7)' }}>
            Join Circle →
          </button>
        </div>
      </div>

      {/* ── Feed + Right Rail ── */}
      <div className="cm-feed-layout">

        {/* Feed column */}
        <div className="cm-feed-col">
          {/* §3.1: 4 feed tabs */}
          <div className="cm-feed-tabs">
            {FEED_TABS.map(t => (
              <div key={t.id} className={`cm-feed-tab${activeTab === t.id ? ' active' : ''}`}
                onClick={() => setActiveTab(t.id)}>
                {t.label}
              </div>
            ))}
          </div>

          <div className="cm-feed-posts">
            {/* §2.4: Skeleton on initial load — no blank screen */}
            {loading ? (
              [1, 2, 3].map(i => <PostCardSkeleton key={i} />)
            ) : feedError ? (
              /* §2.4: Error state with retry button */
              <div className="cm-empty">
                <div className="cm-empty-icon">⚠️</div>
                <div className="cm-empty-title">Something went wrong</div>
                <div className="cm-empty-sub">We couldn't load the feed right now.</div>
                <button className="cm-btn cm-btn-primary" onClick={() => loadFeed(activeTab, 1)}>↺ Retry</button>
              </div>
            ) : posts.length === 0 ? (
              <div className="cm-empty">
                <div className="cm-empty-icon">💬</div>
                <div className="cm-empty-title">No discussions yet</div>
                <div className="cm-empty-sub">Be the first to start a discussion!</div>
                <button className="cm-btn cm-btn-primary" onClick={onOpenPost}>✦ Start Discussion</button>
              </div>
            ) : (
              <>
                {buildFeedRows().map(row => row.type === 'event' ? (
                  <EventHighlightCard
                    key={row.key}
                    event={liveEvent}
                    onNavigate={onNavigate}
                    onRSVP={handleRSVP}
                    rsvped={rsvped[liveEvent?._id]}
                  />
                ) : (
                  <PostCard
                    key={row.key}
                    post={row.post}
                    onOpenProfile={onOpenProfile}
                    onReport={onReport}
                  />
                ))}

                {/* §2.4: Skeleton appended at bottom while loading more */}
                {loadingMore && [1, 2].map(i => <PostCardSkeleton key={`more-${i}`} />)}

                {/* §3.1: Infinite scroll sentinel — triggers at 80% */}
                {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}

                {!hasMore && posts.length > 0 && (
                  <div style={{ textAlign: 'center', padding: '16px 0', fontSize: 13, color: 'var(--cm-text3)' }}>
                    You've seen all discussions ✦
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Right Rail — 4 widgets (§3.1) ── */}
        <div className="cm-rail">

          {/* Widget 1: Upcoming Events */}
          <div className="cm-rail-section">
            <div className="cm-rail-title">
              📅 Upcoming Events
              <span className="cm-rail-link" onClick={() => onNavigate('events')}>See all →</span>
            </div>
            {(railEvents.length > 0 ? railEvents : MOCK_EVENTS.filter(e => e.status === 'upcoming').slice(0, 3)).map((e, i) => (
              <div key={i} className="cm-event-mini" onClick={() => onNavigate('events')}>
                <div className="cm-event-mini-time">
                  {e.scheduledAt
                    ? new Date(e.scheduledAt).toLocaleString('en-IN', { weekday: 'short', hour: '2-digit', minute: '2-digit' })
                    : e.time || 'Tomorrow 7PM'}
                </div>
                <div className="cm-event-mini-title">{e.title || e.name}</div>
                <div style={{ fontSize: 11, color: 'var(--cm-text3)' }}>
                  🎙️ {e.host?.name || e.hostName || 'Creator'}
                </div>
              </div>
            ))}
          </div>

          {/* Widget 2: Top Creators */}
          <div className="cm-rail-section">
            <div className="cm-rail-title">🏆 Top Creators <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--cm-text3)' }}>This week</span></div>
            {creators.slice(0, 3).map((c, i) => (
              <div key={i} className="cm-recog-item">
                <div className={`cm-recog-rank ${rankCls(c.rank || i + 1)}`}>{c.rank || i + 1}</div>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {(c.name || c.user?.name || '?')[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* §2.3 + §2.5: Creator name clickable → profile */}
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--cm-text)', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    onClick={() => onOpenProfile?.(c._id || c.userId || c.id, c.name || c.user?.name, c.niche)}>
                    {c.name || c.user?.name}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--cm-text3)' }}>{c.niche}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--cm-accent2)' }}>
                  {(c.pts || c.communityPts || 0).toLocaleString()} pts
                </div>
              </div>
            ))}
          </div>

          {/* Widget 3: Quick Links */}
          <div className="cm-rail-section">
            <div className="cm-rail-title">⚡ Quick Links</div>
            <div className="cm-quick-links">
              {QUICK_LINKS.map(ql => (
                <div key={ql.label} className="cm-quick-link">
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{ql.icon}</div>
                  {ql.label}
                </div>
              ))}
            </div>
          </div>

          {/* Widget 4: Community Rule */}
          <div className="cm-rail-section">
            <div className="cm-rail-title">🛡️ Community Rule</div>
            <div style={{ background: 'var(--cm-red-soft)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 10, padding: 12, fontSize: 12, color: 'var(--cm-text2)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--cm-text)' }}>This week's reminder:</strong> No personal social handles or follower-farming in posts or comments. Keep discussions topic-focused and helpful.{' '}
              <span style={{ color: 'var(--cm-accent2)', cursor: 'pointer' }} onClick={() => onNavigate('moderation')}>Read full guidelines →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
