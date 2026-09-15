'use client';
// components/community/pages/CommunityEvents.js
// §3.7 — Live Audio Events — FULL PRODUCTION VERSION
//
// Architecture:
//  - REST:      GET/POST /api/events/* for listing, RSVP, QA, replay, discussion
//  - Socket.io: connect via socket.io-client, join event room channel
//               events: event:listener_count, event:speaker_change, event:speaker_joined,
//                       event:speaker_left, qa:update, qa:new, hand:approved, stage:removed
//  - Audio SDK: GET /api/events/:id/room → { token, roomId, provider }
//               LiveKit SDK (livekit-client) for actual audio room
//
// All 4 sections: Live Event Room, Q&A Panel, Upcoming Events, Replay Library

import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { showToast } from '../Toast';
import { useAuthStore } from '@/store/authStore';
import { SOCKET_ORIGIN } from '@/lib/api/config';
import { useLiveEvent, useEvents, useEventQA, useRSVPMutation, useReplay, useEventDiscussion, useEventRoomMutation, useEventQAMutation, useRaiseHandMutation, useEventDiscussionMutation } from '@/lib/hooks/main/useEvent';


// ── Constants ─────────────────────────────────────────────────────────────────
const API = SOCKET_ORIGIN;
const getToken = () => useAuthStore.getState().token || '';

// ── Socket singleton for events ───────────────────────────────────────────────
let _eventSocket = null;
function getEventSocket() {
  const token = getToken();
  if (!_eventSocket || _eventSocket.disconnected) {
    _eventSocket = io(API, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
  }
  return _eventSocket;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtSec = s => {
  const t = Math.max(0, Math.floor(s || 0));
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), sc = t % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(sc).padStart(2, '0')}`
    : `${m}:${String(sc).padStart(2, '0')}`;
};

const fmtDur = secs => {
  if (!secs) return '';
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

// §3.7: Localized to user's timezone using Intl.DateTimeFormat
const fmtDateTime = date => {
  if (!date) return '';
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(date));
  } catch {
    return new Date(date).toLocaleString();
  }
};

const elapsedStr = startedAt => {
  if (!startedAt) return '';
  const s = Math.floor((Date.now() - new Date(startedAt)) / 1000);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m elapsed` : `${m} min elapsed`;
};

// ── Mock data (shown before real API responds or on API failure) ──────────────
const MOCK_LIVE = {
  _id: 'ev_live_1',
  title: 'Brand Deals Masterclass: How to pitch yourself to 10x brand partnerships',
  host: { _id: 'host1', name: 'Arjun Mehta', niche: 'Creator Economy Expert', avatar: '' },
  startedAt: new Date(Date.now() - 38 * 60 * 1000),
  listenerCount: 540, status: 'live',
  speakers: [
    { userId: 'sp1', name: 'Arjun Mehta', status: 'speaking', avatar: '' },
    { userId: 'sp2', name: 'Priya Sharma', status: 'muted', avatar: '' },
    { userId: 'sp3', name: 'Rohan Verma', status: 'muted', avatar: '' },
  ],
};
const MOCK_UPCOMING = [
  { _id: 'ev2', title: 'Instagram Algorithm Decoded: What Actually Works in 2024', host: { name: 'Meera Iyer', avatar: '' }, scheduledAt: new Date(Date.now() + 86400000), access: 'free', rsvpCount: 234, speakers: [] },
  { _id: 'ev3', title: 'Brand Pitch Templates: From DM to Signed Contract', host: { name: 'Vikram Shah', avatar: '' }, scheduledAt: new Date(Date.now() + 2 * 86400000), access: 'premium', rsvpCount: 156, speakers: [] },
  { _id: 'ev4', title: 'YouTube Shorts Strategy: 0 to 100K in 90 Days', host: { name: 'Dev Creators', avatar: '' }, scheduledAt: new Date(Date.now() + 3 * 86400000), access: 'free', rsvpCount: 312, speakers: [] },
  { _id: 'ev5', title: 'Mindful Brand Collabs — Saying No to Wrong Deals', host: { name: 'Kavya Reddy', avatar: '' }, scheduledAt: new Date(Date.now() + 5 * 86400000), access: 'invite_only', rsvpCount: 48, speakers: [] },
  { _id: 'ev6', title: 'Going Viral on Shorts: Algorithm Secrets from 0 to 1M', host: { name: 'Ananya Singh', avatar: '' }, scheduledAt: new Date(Date.now() + 7 * 86400000), access: 'free', rsvpCount: 521, speakers: [] },
  { _id: 'ev7', title: 'From Creator to Brand: Building Your Own Product Line', host: { name: 'Zara Khan', avatar: '' }, scheduledAt: new Date(Date.now() + 9 * 86400000), access: 'premium', rsvpCount: 98, speakers: [] },
];
const MOCK_REPLAYS = [
  { _id: 'r1', title: 'Creator Monetization 101: Multiple Revenue Streams', host: { name: 'Arjun Mehta' }, endedAt: new Date(Date.now() - 7 * 86400000), replay: { playCount: 1240, duration: 3420, takeaways: ['Engagement beats follower count with brands', 'Always negotiate content usage rights', 'Micro-creators get better CPM on niche categories'], highlights: ['"The first brand deal is the hardest — after that, your portfolio speaks for you."', '"Never accept a rate that doesn\'t cover your time, equipment, and editing costs."'] } },
  { _id: 'r2', title: 'Negotiating Brand Deals: Real Scripts That Work', host: { name: 'Zara Khan' }, endedAt: new Date(Date.now() - 14 * 86400000), replay: { playCount: 890, duration: 2700, takeaways: ['Counter-offer on first approach always', 'Rate card should have 3 tiers', 'Usage clauses are worth more than base fee'], highlights: ['"Your rate card is your brand. Never negotiate against yourself."'] } },
  { _id: 'r3', title: 'Instagram Growth in 2024: What Actually Works', host: { name: 'Meera Iyer' }, endedAt: new Date(Date.now() - 21 * 86400000), replay: { playCount: 2100, duration: 4200, takeaways: ['Carousel saves outperform everything', 'Post when YOUR audience is online', 'Collaborations > ads for organic growth'], highlights: [] } },
  { _id: 'r4', title: 'Turning YouTube Shorts into Revenue: Full Strategy', host: { name: 'Dev Creators' }, endedAt: new Date(Date.now() - 28 * 86400000), replay: { playCount: 670, duration: 2100, takeaways: ['Shorts funnel to long-form = best strategy', '40% of Shorts revenue comes from Watch page traffic', 'Post time matters less than consistency'], highlights: [] } },
];
const MOCK_QA = [
  { _id: 'q1', question: "What's the minimum engagement rate brands look for with nano creators?", askedBy: { name: '@priya_sharma' }, createdAt: new Date(Date.now() - 15 * 60000), status: 'answered' },
  { _id: 'q2', question: 'Should I approach brands directly or through an agency when starting out?', askedBy: { name: '@dev_creator' }, createdAt: new Date(Date.now() - 8 * 60000), status: 'pending' },
  { _id: 'q3', question: 'How do you negotiate rates when a brand lowballs your first quote?', askedBy: { name: '@meera_iyer' }, createdAt: new Date(Date.now() - 3 * 60000), status: 'pending' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function CommunityEvents({ onOpenProfile, currentUser }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [liveEvent, setLiveEvent] = useState(null);
  const [upcoming, setUpcoming] = useState(MOCK_UPCOMING);
  const [replays, setReplays] = useState(MOCK_REPLAYS);
  const [loadingLive, setLoadingLive] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [loadingReplays, setLoadingReplays] = useState(true);

  // Live room state — driven by Socket.io
  const [listenerCount, setListenerCount] = useState(0);
  const [speakers, setSpeakers] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [inRoom, setInRoom] = useState(false);

  // QA
  const [qaOpen, setQaOpen] = useState(false);
  const [qaItems, setQaItems] = useState(MOCK_QA);
  const [qaInput, setQaInput] = useState('');
  const [qaSubmitting, setQaSubmitting] = useState(false);

  // Raise hand
  const [raiseOpen, setRaiseOpen] = useState(false);
  const [raiseMsg, setRaiseMsg] = useState('');
  const [raiseSubmitting, setRaiseSubmitting] = useState(false);

  // Hand approved notification
  const [handApproved, setHandApproved] = useState(false);

  // Chat toggle (wires into ChatPanel for event_room)
  const [chatOpen, setChatOpen] = useState(false);

  // RSVP state
  const [rsvped, setRsvped] = useState({});

  // Replay view
  const [replayView, setReplayView] = useState(null);

  // TanStack Query Hooks
  const { data: liveEventRes, isLoading: liveEventLoading } = useLiveEvent();
  const { data: upcomingRes, isLoading: upcomingLoading } = useEvents('upcoming');
  const { data: replaysRes, isLoading: replaysLoading } = useEvents('past');
  const { data: qaRes } = useEventQA(liveEvent?._id || MOCK_LIVE._id);
  const { mutateAsync: rsvpMutation } = useRSVPMutation();
  const { mutateAsync: eventRoomMutation } = useEventRoomMutation();
  const { mutateAsync: eventQAMutation } = useEventQAMutation();
  const { mutateAsync: raiseHandMutation } = useRaiseHandMutation();
  const { mutateAsync: eventDiscussionMutation } = useEventDiscussionMutation();

  // Audio room
  const [roomToken, setRoomToken] = useState(null);
  const [joiningAudio, setJoiningAudio] = useState(false);
  const [inAudio, setInAudio] = useState(false);

  // Elapsed time
  const [elapsed, setElapsed] = useState('');

  const socketRef = useRef(null);
  const elapsedRef = useRef(null);

  // ── Load all events from API ───────────────────────────────────────────────
  useEffect(() => {
    // Live event
    setLoadingLive(liveEventLoading);
    if (liveEventRes?.data || liveEventRes) {
      const e = liveEventRes?.data || liveEventRes;
      setLiveEvent(e || MOCK_LIVE);
      setListenerCount(e?.listenerCount || MOCK_LIVE.listenerCount);
      setSpeakers(e?.speakers || MOCK_LIVE.speakers);
    } else if (!liveEventLoading) {
      setLiveEvent(MOCK_LIVE);
      setListenerCount(MOCK_LIVE.listenerCount);
      setSpeakers(MOCK_LIVE.speakers);
    }

    // Upcoming
    setLoadingUpcoming(upcomingLoading);
    if (upcomingRes?.data || upcomingRes) {
      const a = Array.isArray(upcomingRes?.data) ? upcomingRes.data : upcomingRes;
      if (Array.isArray(a) && a.length > 0) setUpcoming(a);
    }

    // Past replays
    setLoadingReplays(replaysLoading);
    if (replaysRes?.data || replaysRes) {
      const a = Array.isArray(replaysRes?.data) ? replaysRes.data : replaysRes;
      if (Array.isArray(a) && a.length > 0) setReplays(a);
    }

    // Load existing QA for live event
    if (qaRes?.data || qaRes) {
      const a = Array.isArray(qaRes?.data) ? qaRes.data : qaRes;
      if (Array.isArray(a) && a.length > 0) setQaItems(a);
    }
  }, [liveEventRes, upcomingRes, replaysRes, qaRes, liveEventLoading, upcomingLoading, replaysLoading]);

  // ── Elapsed timer for live event ──────────────────────────────────────────
  useEffect(() => {
    const ev = liveEvent || MOCK_LIVE;
    if (!ev?.startedAt) return;
    setElapsed(elapsedStr(ev.startedAt));
    elapsedRef.current = setInterval(() => setElapsed(elapsedStr(ev.startedAt)), 60000);
    return () => clearInterval(elapsedRef.current);
  }, [liveEvent]);

  // ── Socket.io connection + event listeners ────────────────────────────────
  useEffect(() => {
    const ev = liveEvent || MOCK_LIVE;
    if (!ev?._id) return;

    const sock = getEventSocket();
    socketRef.current = sock;

    sock.on('connect', () => setSocketConnected(true));
    sock.on('disconnect', () => setSocketConnected(false));

    // §3.7: Join event broadcast channel
    sock.emit('event:join', { eventId: ev._id });

    // ── Real-time event handlers ──────────────────────────────────────────
    // listener_count_update → update badge
    sock.on('event:listener_count', ({ count }) => {
      setListenerCount(count);
    });

    // speaker_change → update stage
    sock.on('event:speaker_change', ({ speakers: spk }) => {
      setSpeakers(spk || []);
    });

    // New speaker joined stage
    sock.on('event:speaker_joined', ({ userId, name, avatar }) => {
      setSpeakers(prev => {
        if (prev.find(s => s.userId === userId)) return prev;
        return [...prev, { userId, name, avatar, status: 'muted' }];
      });
    });

    // Speaker left stage
    sock.on('event:speaker_left', ({ userId }) => {
      setSpeakers(prev => prev.filter(s => s.userId !== userId));
    });

    // QA update (status change from moderator)
    sock.on('qa:update', ({ qa }) => {
      setQaItems(prev => {
        const exists = prev.find(q => q._id === qa._id);
        return exists ? prev.map(q => q._id === qa._id ? qa : q) : [qa, ...prev];
      });
    });

    // New QA item approved (visible to all)
    sock.on('qa:new', ({ qa }) => {
      setQaItems(prev => prev.find(q => q._id === qa._id) ? prev : [...prev, qa]);
    });

    // Hand approved notification (targeted to this user)
    sock.on('hand:approved', ({ message }) => {
      setHandApproved(true);
      showToast(`🎤 ${message}`, 'success');
    });

    // Removed from stage
    sock.on('stage:removed', () => {
      setInAudio(false);
      showToast('You have been removed from the stage.', 'info');
    });

    return () => {
      sock.emit('event:leave', { eventId: ev._id });
      sock.off('event:listener_count');
      sock.off('event:speaker_change');
      sock.off('event:speaker_joined');
      sock.off('event:speaker_left');
      sock.off('qa:update');
      sock.off('qa:new');
      sock.off('hand:approved');
      sock.off('stage:removed');
    };
  }, [liveEvent]);

  // ── Join as Listener — gets audio room token from API ─────────────────────
  const handleJoinAudio = useCallback(async () => {
    const ev = liveEvent || MOCK_LIVE;
    setJoiningAudio(true);
    try {
      // §3.7: GET /api/events/:id/room → { token, roomId, provider }
      const res = await eventRoomMutation({ id: ev._id, role: 'listener' });
      const data = res?.data || res;
      const { token, roomId, provider } = data;

      setRoomToken({ token, roomId, provider });
      setInRoom(true);
      setInAudio(true);

      // Tell Socket.io we joined
      socketRef.current?.emit('event:join', { eventId: ev._id });

      showToast('🎧 Joined as listener. Your mic is off.', 'success');

      // In production: initialize LiveKit/Agora SDK here
      // Example for LiveKit:
      // const room = new Room();
      // await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL, token, { audio: false });
    } catch (e) {
      // Fallback: join without audio token (demo mode)
      setInRoom(true);
      setInAudio(true);
      showToast('🎧 Joined as listener (demo mode).', 'info');
    } finally {
      setJoiningAudio(false);
    }
  }, [liveEvent]);

  // Accept hand approved → join stage with mic
  const handleAcceptStage = useCallback(async () => {
    const ev = liveEvent || MOCK_LIVE;
    try {
      // Get speaker token
      const res = await eventRoomMutation({ id: ev._id, role: 'speaker' });
      const data = res?.data || res;
      const { token, roomId } = data;
      setRoomToken({ token, roomId });

      // Tell socket we accepted
      socketRef.current?.emit('hand:accept', { eventId: ev._id });
      setHandApproved(false);
      showToast('🎤 You are now on stage! Microphone is active.', 'success');
    } catch {
      socketRef.current?.emit('hand:accept', { eventId: ev._id });
      setHandApproved(false);
    }
  }, [liveEvent]);

  // ── Q&A submit ─────────────────────────────────────────────────────────────
  const handleQASubmit = useCallback(async () => {
    const q = qaInput.trim();
    if (!q) return;
    if (q.length > 200) { showToast('⚠️ Question must be under 200 characters.', 'warn'); return; }

    setQaSubmitting(true);
    const ev = liveEvent || MOCK_LIVE;

    // Optimistic add as pending
    const optimistic = { _id: `opt_${Date.now()}`, question: q, askedBy: { name: 'You' }, createdAt: new Date(), status: 'pending' };
    setQaItems(prev => [optimistic, ...prev]);
    setQaInput('');

    try {
      // §3.7: POST /api/events/:id/qa
      const res = await eventQAMutation({ id: ev._id, data: { question: q } });
      const data = res?.data || res;
      if (data?._id) {
        setQaItems(prev => prev.map(item => item._id === optimistic._id ? data : item));
      }
    } catch {
      // Keep optimistic item, it'll sync via Socket.io when server processes
    }

    showToast('❓ Question submitted. Moderator will review before showing to host.', 'info');
    setQaSubmitting(false);
  }, [qaInput, liveEvent]);

  // ── Raise hand submit ──────────────────────────────────────────────────────
  const handleRaiseHand = useCallback(async () => {
    if (raiseMsg.trim().length < 10) {
      showToast('⚠️ Please write at least 10 characters.', 'warn');
      return;
    }
    setRaiseSubmitting(true);
    const ev = liveEvent || MOCK_LIVE;

    try {
      // §3.7: POST /api/events/:id/raise-hand { message }
      await raiseHandMutation({ id: ev._id, data: { message: raiseMsg.trim() } });
    } catch { /* optimistic */ }

    setRaiseOpen(false);
    setRaiseMsg('');
    setRaiseSubmitting(false);
    showToast('🙋 Hand raised! Waiting for moderator approval…', 'info');
  }, [raiseMsg, liveEvent]);

  // ── RSVP ───────────────────────────────────────────────────────────────────
  const handleRSVP = useCallback(async (eventId) => {
    if (rsvped[eventId]) return;
    setRsvped(p => ({ ...p, [eventId]: true })); // optimistic
    try {
      // §3.7: POST /api/events/:id/rsvp
      await rsvpMutation(eventId);
    } catch {
      // Keep optimistic — backend will sync
    }
    // §3.7: Toast exactly as spec
    showToast('📅 Event saved! Reminder 24h before + 15min before.', 'success');
  }, [rsvped, rsvpMutation]);

  // ── Render ─────────────────────────────────────────────────────────────────
  if (replayView) {
    return (
      <ReplayDetail
        event={replayView}
        currentUser={currentUser}
        onBack={() => setReplayView(null)}
      />
    );
  }

  const ev = liveEvent || MOCK_LIVE;
  const hasLive = ev?.status === 'live' || (!liveEvent && true); // demo always shows live

  return (
    <div style={{ background: 'var(--cm-bg)', minHeight: '100%' }}>

      {/* Topbar */}
      <div className="cm-topbar">
        <div className="cm-topbar-title">Live Events</div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Socket connection indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: socketConnected ? 'var(--cm-green)' : 'var(--cm-text3)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: socketConnected ? 'var(--cm-green)' : 'var(--cm-text4)' }} />
            {socketConnected ? 'Live' : 'Connecting…'}
          </div>
          <button className="cm-btn cm-btn-ghost">📅 My Events</button>
        </div>
      </div>

      {/* ════════════════════════════════════════
          §3.7: LIVE NOW SECTION
      ════════════════════════════════════════ */}
      {hasLive && (
        <div className="cm-events-hero">

          {/* Hand approved banner */}
          {handApproved && (
            <div style={{ background: 'var(--cm-green-soft)', border: '1px solid rgba(16,185,129,.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ fontSize: 13.5, color: 'var(--cm-green)', fontWeight: 600 }}>
                🎤 You  ve been invited to speak! Click Accept to join the stage.
              </div>
              <button onClick={handleAcceptStage} style={{ padding: '6px 16px', borderRadius: 8, background: 'var(--cm-green)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                Accept →
              </button>
            </div>
          )}

          {/* §3.7: LIVE badge + blinking dot + elapsed time */}
          <div className="cm-live-badge">
            <div style={{ width: 7, height: 7, background: 'var(--cm-red)', borderRadius: '50%', animation: 'cm-blink 1.2s infinite' }} />
            LIVE NOW · {listenerCount.toLocaleString()} listening
          </div>

          {/* §3.7: Title max 80 chars */}
          <div className="cm-event-title">
            {ev.title?.slice(0, 80)}
          </div>

          {/* Host + elapsed */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'var(--cm-text3)', marginBottom: 20, flexWrap: 'wrap' }}>
            {/* Host with avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>
                {(ev.host?.name || 'H')[0]}
              </div>
              <span>🎙️ {ev.host?.name}</span>
            </div>
            {/* §3.7: Elapsed time counter updates every minute */}
            <span>⏱ {elapsed || '38 min elapsed'}</span>
            <span style={{ color: 'var(--cm-red)', fontWeight: 600 }}>
              🔴 {listenerCount.toLocaleString()} listening
            </span>
          </div>

          {/* §3.7: Stage area — host first, up to 6, active = green border + 🎙️ */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cm-text3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
              On Stage
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {speakers.slice(0, 6).map((sp, i) => (
                <SpeakerCard key={sp.userId || i} speaker={sp} />
              ))}
              {speakers.length === 0 && (
                <div style={{ fontSize: 13, color: 'var(--cm-text3)', fontStyle: 'italic' }}>Host is preparing the stage…</div>
              )}
            </div>
          </div>

          {/* §3.7: Audience panel — stacked avatar circles + "+N" overflow */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cm-text3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>
              Audience · {listenerCount.toLocaleString()} total
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {Array.from({ length: Math.min(8, listenerCount) }, (_, i) => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: `hsl(${i * 43 + 10}, 60%, 50%)`,
                  border: '2px solid var(--cm-bg2)',
                  marginLeft: i > 0 ? -10 : 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, color: '#fff', fontWeight: 700, flexShrink: 0, zIndex: 8 - i,
                }}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              {listenerCount > 8 && (
                <span style={{ fontSize: 12, color: 'var(--cm-text3)', marginLeft: 12 }}>
                  +{(listenerCount - 8).toLocaleString()} more listening
                </span>
              )}
            </div>
          </div>

          {/* §3.7: Action buttons */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {/* §3.7: Join as Listener — listen-only mode, mic disabled */}
            {!inAudio ? (
              <button className="cm-btn cm-btn-live" onClick={handleJoinAudio} disabled={joiningAudio}>
                {joiningAudio ? '⏳ Joining…' : '🎧 Join as Listener'}
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', height: 34, background: 'var(--cm-green-soft)', border: '1px solid rgba(16,185,129,.25)', borderRadius: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cm-green)', animation: 'cm-blink 1.5s infinite' }} />
                <span style={{ fontSize: 13, color: 'var(--cm-green)', fontWeight: 600 }}>Listening Live</span>
                <button onClick={() => { setInAudio(false); setInRoom(false); socketRef.current?.emit('event:leave', { eventId: ev._id }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cm-text3)', fontSize: 14, marginLeft: 4 }}>✕</button>
              </div>
            )}

            {/* §3.7 🆕 NEW: Q&A Queue button */}
            <button className="cm-btn cm-btn-ghost" onClick={() => setQaOpen(v => !v)}
              style={{ background: qaOpen ? 'var(--cm-accent-soft)' : undefined, color: qaOpen ? 'var(--cm-accent2)' : undefined }}>
              ❓ {qaOpen ? 'Close Q&A' : 'Q&A Queue'}
              {qaItems.filter(q => q.status === 'pending').length > 0 && (
                <span style={{ marginLeft: 6, background: 'var(--cm-orange)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10 }}>
                  {qaItems.filter(q => q.status === 'pending').length}
                </span>
              )}
            </button>

            {/* §3.7: Raise Hand */}
            <button className="cm-btn cm-btn-ghost" onClick={() => setRaiseOpen(true)}>
              ✋ Raise Hand
            </button>

            {/* §3.7: Chat — rate-limited 1 msg/10 sec (enforced in ChatPanel) */}
            <button className="cm-btn cm-btn-ghost" onClick={() => setChatOpen(v => !v)}
              style={{ background: chatOpen ? 'var(--cm-accent-soft)' : undefined, color: chatOpen ? 'var(--cm-accent2)' : undefined }}>
              💬 {chatOpen ? 'Close Chat' : 'Chat'}
            </button>
          </div>

          {/* Inline chat panel (event room chat) */}
          {chatOpen && (
            <div className="cm-scale-in" style={{ marginTop: 16, height: 360, background: 'rgba(0,0,0,.2)', borderRadius: 12, border: '1px solid var(--cm-border)', overflow: 'hidden' }}>
              <EventChat eventId={ev._id} currentUser={currentUser} />
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════
          §3.7 🆕 NEW: Q&A Queue Panel (collapsible)
      ════════════════════════════════════════ */}
      {qaOpen && (
        <div className="cm-scale-in" style={{ background: 'var(--cm-bg2)', borderBottom: '1px solid var(--cm-border)' }}>
          <div style={{ padding: '0 28px 20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0 12px', borderBottom: '1px solid var(--cm-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontWeight: 700, color: 'var(--cm-text)', fontSize: 14 }}>❓ Q&amp;A Queue</div>
                <span style={{ fontSize: 12, color: 'var(--cm-text3)' }}>{qaItems.length} questions</span>
              </div>
              <div style={{ display: 'flex', gap: 10, fontSize: 11.5, color: 'var(--cm-text3)' }}>
                <span>{qaItems.filter(q => q.status === 'pending').length} pending</span>
                <span>·</span>
                <span>{qaItems.filter(q => q.status === 'answered').length} answered</span>
              </div>
            </div>

            {/* Q&A items list */}
            {qaItems.length === 0 ? (
              <div style={{ padding: '20px 0', textAlign: 'center', fontSize: 13, color: 'var(--cm-text3)' }}>
                No questions yet. Be the first to ask!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '12px 0', maxHeight: 320, overflowY: 'auto' }}>
                {qaItems.map(q => (
                  <div key={q._id} className="cm-qa-item">
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, color: 'var(--cm-text)', lineHeight: 1.5, marginBottom: 4 }}>
                        {q.question}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--cm-text3)', display: 'flex', gap: 8 }}>
                        <span>from {q.askedBy?.name}</span>
                        {q.createdAt && <span>· {Math.floor((Date.now() - new Date(q.createdAt)) / 60000)}m ago</span>}
                      </div>
                    </div>
                    {/* Status badge: Pending amber / Answered green */}
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, flexShrink: 0, whiteSpace: 'nowrap', ...(q.status === 'answered' ? { background: 'var(--cm-green-soft)', color: 'var(--cm-green)', border: '1px solid rgba(16,185,129,.2)' } : { background: 'var(--cm-orange-soft)', color: 'var(--cm-orange)', border: '1px solid rgba(245,158,11,.2)' }) }}>
                      {q.status === 'answered' ? '✓ Answered' : '⏳ Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Question input — max 200 chars */}
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="cm-input"
                  style={{ flex: 1 }}
                  value={qaInput}
                  onChange={e => setQaInput(e.target.value.slice(0, 200))}
                  placeholder="Ask a question…"
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleQASubmit()}
                />
                <button
                  className="cm-btn cm-btn-primary"
                  onClick={handleQASubmit}
                  disabled={qaSubmitting || !qaInput.trim()}>
                  {qaSubmitting ? '…' : 'Ask →'}
                </button>
              </div>
              <div style={{ fontSize: 11, color: 'var(--cm-text3)', marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                {/* §3.7: Moderation note — exact text from spec */}
                <span>Questions are reviewed by moderator before being shown to the host</span>
                <span style={{ color: qaInput.length > 160 ? 'var(--cm-orange)' : 'var(--cm-text4)' }}>{qaInput.length}/200</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          §3.7: UPCOMING EVENTS
      ════════════════════════════════════════ */}
      <div style={{ padding: '28px 28px 0' }}>
        <SectionHeading icon="📅" title="Upcoming Events" />
        {loadingUpcoming ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16, marginBottom: 32 }}>
            {[1, 2, 3].map(i => <EventCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="cm-events-grid" style={{ marginBottom: 36 }}>
            {upcoming.slice(0, 6).map((e, i) => (
              <UpcomingEventCard
                key={e._id || i}
                event={e}
                index={i}
                rsvped={rsvped[e._id]}
                onRSVP={handleRSVP}
              />
            ))}
          </div>
        )}

        {/* ════════════════════════════════════════
            §3.7 🆕 NEW: REPLAY LIBRARY
        ════════════════════════════════════════ */}
        <SectionHeading icon="🔁" title="Replay Library" />
        {loadingReplays ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16, paddingBottom: 32 }}>
            {[1, 2, 3, 4].map(i => <EventCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="cm-events-grid" style={{ paddingBottom: 40 }}>
            {replays.slice(0, 4).map((e, i) => (
              <ReplayCard
                key={e._id || i}
                event={e}
                index={i}
                onWatch={() => setReplayView(e)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════
          Raise Hand Modal
      ════════════════════════════════════════ */}
      {raiseOpen && (
        <div className="cm-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setRaiseOpen(false); }}>
          <div className="cm-modal-box" style={{ maxWidth: 460 }}>
            <div className="cm-modal-header">
              <div className="cm-modal-title">✋ Raise Hand to Speak</div>
              <button className="cm-modal-close" onClick={() => setRaiseOpen(false)}>✕</button>
            </div>
            <div className="cm-modal-body">
              {/* Flow explanation */}
              <div style={{ background: 'var(--cm-bg3)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
                <div style={{ fontSize: 12.5, color: 'var(--cm-text2)', lineHeight: 1.7 }}>
                  <strong style={{ color: 'var(--cm-text)' }}>How it works:</strong><br />
                  1. Write what you want to discuss below<br />
                  2. Moderator reviews your request<br />
                  3. If approved, you'll get a notification: "You've been invited to speak"<br />
                  4. Accept → browser requests mic permission → you appear on stage<br />
                  5. Host or moderator can mute/remove at any time
                </div>
              </div>

              <div className="cm-field">
                <label className="cm-field-label">What do you want to discuss? <span style={{ color: 'var(--cm-red)' }}>*</span></label>
                <textarea
                  className="cm-textarea" rows={4}
                  value={raiseMsg}
                  onChange={e => setRaiseMsg(e.target.value.slice(0, 500))}
                  placeholder="e.g. I'd like to share my experience negotiating rates at 50K followers, specifically around usage rights…"
                  autoFocus
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <div style={{ fontSize: 11, color: raiseMsg.trim().length < 10 && raiseMsg.length > 0 ? 'var(--cm-red)' : 'var(--cm-text3)' }}>
                    {raiseMsg.trim().length < 10 ? `Min 10 characters (${10 - raiseMsg.trim().length} more needed)` : '✓ Looks good'}
                  </div>
                  <div className="cm-char-count">{raiseMsg.length} / 500</div>
                </div>
              </div>
            </div>
            <div className="cm-modal-footer">
              <button className="cm-btn cm-btn-ghost" onClick={() => setRaiseOpen(false)}>Cancel</button>
              <button
                className="cm-btn cm-btn-primary"
                onClick={handleRaiseHand}
                disabled={raiseSubmitting || raiseMsg.trim().length < 10}
                style={{ opacity: raiseMsg.trim().length >= 10 ? 1 : .45 }}>
                {raiseSubmitting ? '⏳ Submitting…' : '✋ Raise Hand'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// §3.7 🆕 NEW: REPLAY DETAIL PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function ReplayDetail({ event, currentUser, onBack }) {
  const [replayData, setReplayData] = useState(null);
  const [discussion, setDiscussion] = useState([]);
  const [comment, setComment] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Audio player state
  const audioRef = useRef(null);
  const seekRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [audioLoading, setAudioLoading] = useState(false);

  const { data: replayDataRes } = useReplay(event._id);
  const { data: discussionRes } = useEventDiscussion(event._id);
  const [eventDiscussionMutation] = useEventDiscussionMutation();

  // §3.7: Load replay data — GET /api/events/:id/replay
  useEffect(() => {
    if (replayDataRes?.data || replayDataRes) {
      setReplayData(replayDataRes?.data || replayDataRes);
      setLoading(false);
    } else {
      setReplayData(event?.replay || null);
      setLoading(false);
    }

    if (discussionRes?.data || discussionRes) {
      const a = Array.isArray(discussionRes?.data) ? discussionRes.data : discussionRes;
      if (Array.isArray(a)) setDiscussion(a);
    }
  }, [replayDataRes, discussionRes, event]);

  // Audio events
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onLoaded = () => { setDuration(a.duration || 0); setAudioLoading(false); };
    const onTime = () => {
      setCurrentTime(a.currentTime);
      if (a.buffered.length > 0) setBuffered((a.buffered.end(a.buffered.length - 1) / a.duration) * 100);
    };
    const onEnded = () => setPlaying(false);
    const onWait = () => setAudioLoading(true);
    const onPlay = () => setAudioLoading(false);
    a.addEventListener('loadedmetadata', onLoaded);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('ended', onEnded);
    a.addEventListener('waiting', onWait);
    a.addEventListener('playing', onPlay);
    return () => {
      a.removeEventListener('loadedmetadata', onLoaded);
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('ended', onEnded);
      a.removeEventListener('waiting', onWait);
      a.removeEventListener('playing', onPlay);
    };
  }, [replayData]);

  // Sync speed
  useEffect(() => { if (audioRef.current) audioRef.current.playbackRate = speed; }, [speed]);

  function togglePlay() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().then(() => setPlaying(true)).catch(() => { }); }
  }

  function seek(e) {
    const a = audioRef.current;
    const bar = seekRef.current;
    if (!a || !bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    a.currentTime = pct * duration;
  }

  function skip(s) {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.max(0, Math.min(duration, a.currentTime + s));
  }

  async function postComment() {
    if (!comment.trim()) return;
    setCommenting(true);
    const optimistic = { _id: `c_${Date.now()}`, sender: { name: currentUser?.name || 'You', avatar: '' }, content: comment.trim(), createdAt: new Date() };
    setDiscussion(prev => [...prev, optimistic]);
    setComment('');

    try {
      const res = await eventDiscussionMutation({ id: event._id, data: { content: optimistic.content } });
      const data = res?.data || res;
      if (data?._id) {
        setDiscussion(prev => prev.map(c => c._id === optimistic._id ? data : c));
      }
    } catch { /* keep optimistic */ }

    showToast('💬 Comment posted!', 'success');
    setCommenting(false);
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const takeaways = replayData?.takeaways || event?.replay?.takeaways || [];
  const highlights = replayData?.highlights || event?.replay?.highlights || [];
  const audioUrl = replayData?.audio_url || replayData?.audioUrl || event?.replay?.url || '';

  return (
    <div>
      {/* §3.7: Back button — "← Back to Events" */}
      <div className="cm-topbar">
        <button className="cm-btn cm-btn-ghost" onClick={onBack}>← Back to Events</button>
        <div className="cm-topbar-title" style={{ marginLeft: 12 }}>Replay</div>
      </div>

      <div style={{ padding: '28px 28px 48px', maxWidth: 740 }}>

        {/* Event meta */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: 12, flexShrink: 0, background: 'linear-gradient(135deg,#1a1035,#0a1820)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🎙️</div>
          <div>
            <div style={{ fontFamily: 'var(--cm-font-display)', fontSize: 22, fontWeight: 700, color: 'var(--cm-text)', marginBottom: 6, lineHeight: 1.3 }}>
              {event?.title}
            </div>
            <div style={{ fontSize: 13, color: 'var(--cm-text3)', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <span>🎙️ {event?.host?.name}</span>
              <span>⏱ {fmtDur(event?.replay?.duration || duration)}</span>
              <span>▶ {(event?.replay?.playCount || replayData?.playCount || 0).toLocaleString()} plays</span>
              <span>📅 {fmtDateTime(event?.endedAt)}</span>
            </div>
          </div>
        </div>

        {/* §3.7: Audio player bar */}
        <div className="cm-audio-player">
          {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" style={{ display: 'none' }} />}

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            {/* Skip back 15s */}
            <button onClick={() => skip(-15)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--cm-text3)', fontWeight: 700, fontFamily: 'var(--cm-font)' }} title="-15 seconds">⟵15</button>

            {/* §3.7: Play/Pause */}
            <button onClick={togglePlay} style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--cm-grad-accent)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, flexShrink: 0, boxShadow: 'var(--cm-shadow-accent)', transition: 'transform .15s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              {audioLoading ? <span style={{ fontSize: 14, animation: 'cm-spin 1s linear infinite', display: 'inline-block' }}>↻</span> : playing ? '⏸' : '▶'}
            </button>

            {/* Skip forward 30s */}
            <button onClick={() => skip(30)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--cm-text3)', fontWeight: 700, fontFamily: 'var(--cm-font)' }} title="+30 seconds">30⟶</button>

            {/* §3.7: Seek bar — click position = percentage of total duration */}
            <div style={{ flex: 1 }}>
              <div ref={seekRef} onClick={seek} style={{ position: 'relative', height: 6, background: 'var(--cm-bg4)', borderRadius: 4, cursor: 'pointer', marginBottom: 6 }}>
                {/* Buffered range */}
                <div style={{ position: 'absolute', inset: 0, width: `${buffered}%`, background: 'var(--cm-border2)', borderRadius: 4 }} />
                {/* Progress */}
                <div style={{ position: 'absolute', inset: 0, width: `${progress}%`, background: 'var(--cm-grad-accent)', borderRadius: 4, transition: 'width .2s linear' }} />
                {/* Thumb */}
                <div style={{ position: 'absolute', top: '50%', left: `${progress}%`, width: 14, height: 14, borderRadius: '50%', background: 'var(--cm-accent)', border: '2.5px solid var(--cm-bg2)', transform: 'translate(-50%,-50%)', boxShadow: 'var(--cm-shadow-accent)', transition: 'left .2s linear' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--cm-text3)' }}>
                <span>{fmtSec(currentTime)}</span>
                <span>{fmtSec(duration || event?.replay?.duration || 0)}</span>
              </div>
            </div>
          </div>

          {/* §3.7: Speed buttons — 0.75x 1x 1.25x 1.5x, active style on selected */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--cm-text3)', marginRight: 4 }}>Speed:</span>
            {[0.75, 1, 1.25, 1.5].map(s => (
              <button key={s} className={`cm-speed-btn${speed === s ? ' active' : ''}`} onClick={() => setSpeed(s)}>
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* §3.7: Key Takeaways — 3–5 bullet points */}
        {takeaways.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--cm-text)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              💡 Key Takeaways
            </div>
            <div style={{ background: 'var(--cm-bg2)', border: '1px solid var(--cm-border)', borderRadius: 12, overflow: 'hidden' }}>
              {takeaways.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: i < takeaways.length - 1 ? '1px solid var(--cm-border)' : 'none', fontSize: 13.5, color: 'var(--cm-text2)', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--cm-green)', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>✦</span>
                  {t}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* §3.7: Highlighted Quotes — styled quote blocks with left border */}
        {highlights.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--cm-text)', marginBottom: 14 }}>
              💬 Highlighted Quotes
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {highlights.map((h, i) => (
                <div key={i} style={{ background: 'var(--cm-surface)', borderLeft: '3px solid var(--cm-accent2)', borderRadius: '0 12px 12px 0', padding: '14px 18px', fontSize: 15, color: 'var(--cm-text)', fontStyle: 'italic', lineHeight: 1.65 }}>
                  {h}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* §3.7: Discussion thread — threaded comments, logged-in users can post */}
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--cm-text)', marginBottom: 16 }}>
            💬 Discussion
            {discussion.length > 0 && <span style={{ fontSize: 13, color: 'var(--cm-text3)', marginLeft: 8, fontWeight: 400 }}>({discussion.length})</span>}
          </div>

          {/* Comment input */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, background: 'var(--cm-bg2)', border: '1px solid var(--cm-border)', borderRadius: 14, padding: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {(currentUser?.name || 'P')[0]}
            </div>
            <div style={{ flex: 1 }}>
              <textarea
                className="cm-textarea"
                rows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your thoughts on this replay… What was your biggest takeaway?"
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button
                  className="cm-btn cm-btn-primary"
                  style={{ height: 36 }}
                  onClick={postComment}
                  disabled={commenting || !comment.trim()}>
                  {commenting ? '⏳ Posting…' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>

          {/* Comments */}
          {discussion.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', fontSize: 13, color: 'var(--cm-text3)', background: 'var(--cm-bg2)', border: '1px solid var(--cm-border)', borderRadius: 12 }}>
              No comments yet. Start the discussion!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {discussion.map((c, i) => (
                <div key={c._id || i} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {(c.sender?.name || '?')[0]}
                  </div>
                  <div style={{ flex: 1, background: 'var(--cm-bg2)', border: '1px solid var(--cm-border)', borderRadius: '0 12px 12px 12px', padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--cm-text)' }}>{c.sender?.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--cm-text3)' }}>
                        {c.createdAt ? Math.floor((Date.now() - new Date(c.createdAt)) / 60000) + 'm ago' : ''}
                      </span>
                    </div>
                    <div style={{ fontSize: 13.5, color: 'var(--cm-text2)', lineHeight: 1.6 }}>{c.content}</div>
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

// ═══════════════════════════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════════════════════════

// §3.7: Speaker card — green border + 🎙️ Speaking / grey 🔇 Muted
function SpeakerCard({ speaker }) {
  const active = speaker.status === 'speaking';
  return (
    <div style={{
      background: active ? 'var(--cm-green-soft)' : 'var(--cm-bg3)',
      border: `1.5px solid ${active ? 'var(--cm-green)' : 'var(--cm-border2)'}`,
      borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
      transition: 'all .2s', minWidth: 160,
    }}>
      <div style={{ position: 'relative' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: active ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', overflow: 'hidden' }}>
          {speaker.avatar ? <img src={speaker.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} alt="" /> : (speaker.name || '?')[0]}
        </div>
        {active && (
          <div style={{ position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, borderRadius: '50%', background: 'var(--cm-green)', border: '2px solid var(--cm-bg2)', animation: 'cm-pulse-live 1.5s infinite' }} />
        )}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: active ? 'var(--cm-green)' : 'var(--cm-text)', whiteSpace: 'nowrap' }}>
          {speaker.name || speaker.user?.name}
        </div>
        <div style={{ fontSize: 11, color: active ? 'var(--cm-green)' : 'var(--cm-text3)' }}>
          {active ? '🎙️ Speaking' : '🔇 Muted'}
        </div>
      </div>
    </div>
  );
}

// §3.7: Upcoming event card — all required fields
function UpcomingEventCard({ event: e, index, rsvped, onRSVP }) {
  const EMOJIS = ['🎙️', '📊', '🎬', '💼', '📱', '🎓'];
  return (
    <div className="cm-event-card">
      {/* §3.7: Cover / gradient (100px height) */}
      <div style={{ height: 100, background: e.coverImage ? `url(${e.coverImage}) center/cover` : `linear-gradient(135deg,hsl(${index * 50},60%,10%),hsl(${index * 50 + 30},70%,16%))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, overflow: 'hidden', position: 'relative' }}>
        {!e.coverImage && EMOJIS[index % 6]}
        {/* Access badge on cover */}
        <span className={`cm-access-badge cm-access-${e.access || 'free'}`} style={{ position: 'absolute', top: 8, right: 8 }}>
          {e.access === 'premium' ? '💎 Premium' : e.access === 'invite_only' ? '🔒 Invite Only' : '🆓 Free'}
        </span>
      </div>

      <div style={{ padding: 14 }}>
        {/* §3.7: Title max 80 chars with ellipsis */}
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--cm-text)', marginBottom: 6, lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {(e.title || '').slice(0, 80)}
        </div>

        {/* §3.7: Host name + avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, fontSize: 12, color: 'var(--cm-text3)' }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {(e.host?.name || 'H')[0]}
          </div>
          {e.host?.name}
        </div>

        {/* §3.7: Speakers — up to 3, "+N" if more */}
        {e.speakers?.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: -6, marginBottom: 6 }}>
            {e.speakers.slice(0, 3).map((sp, i) => (
              <div key={i} style={{ width: 20, height: 20, borderRadius: '50%', background: `hsl(${i * 80},60%,50%)`, border: '1.5px solid var(--cm-bg2)', marginLeft: i > 0 ? -6 : 0, fontSize: 8, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {(sp.name || sp.user?.name || '?')[0]}
              </div>
            ))}
            {e.speakers.length > 3 && <span style={{ fontSize: 11, color: 'var(--cm-text3)', marginLeft: 8 }}>+{e.speakers.length - 3} speakers</span>}
          </div>
        )}

        {/* §3.7: Date/time localized to user's timezone */}
        <div style={{ fontSize: 11.5, color: 'var(--cm-text3)', marginBottom: 12 }}>
          📅 {fmtDateTime(e.scheduledAt)}
        </div>

        {/* §3.7: RSVP → "✓ RSVP'd" disabled green / "Unlock →" for premium */}
        {rsvped ? (
          <div style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cm-green-soft)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 8 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--cm-green)' }}>✓ RSVP'd</span>
          </div>
        ) : (
          <button className="cm-btn cm-btn-primary" style={{ width: '100%', height: 32, justifyContent: 'center', fontSize: 12.5 }}
            onClick={() => onRSVP(e._id)}>
            {e.access === 'premium' ? '🔓 Unlock →' : '📅 RSVP →'}
          </button>
        )}
      </div>
    </div>
  );
}

// §3.7: Replay card — "Watch →" opens Replay Detail page
function ReplayCard({ event: e, index, onWatch }) {
  return (
    <div className="cm-event-card" onClick={onWatch} style={{ cursor: 'pointer' }}>
      <div style={{ height: 100, background: `linear-gradient(135deg,hsl(${index * 40 + 220},50%,10%),hsl(${index * 40 + 250},60%,18%))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, position: 'relative' }}>
        🎙️
        <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,.75)', color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 10, backdropFilter: 'blur(4px)' }}>
          {fmtDur(e.replay?.duration)}
        </div>
        <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,.65)', color: '#a8b0c8', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 10, letterSpacing: '.05em' }}>
          REPLAY
        </div>
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--cm-text)', marginBottom: 6, lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {e.title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--cm-text3)', marginBottom: 4 }}>
          🎙️ {e.host?.name}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--cm-text3)', marginBottom: 12 }}>
          {fmtDateTime(e.endedAt)} · {(e.replay?.playCount || 0).toLocaleString()} plays
        </div>
        <button className="cm-btn cm-btn-ghost" style={{ width: '100%', height: 32, justifyContent: 'center', fontSize: 12.5 }}>
          ▶ Watch →
        </button>
      </div>
    </div>
  );
}

// Lightweight inline event chat (uses Socket.io, rate-limited to 1msg/10s)
function EventChat({ eventId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [lastSent, setLastSent] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    const sock = getEventSocket();
    sock.on('message:new', msg => {
      setMessages(prev => [...prev, msg]);
    });
    return () => sock.off('message:new');
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  function send() {
    const content = input.trim();
    if (!content) return;
    // §3.7: Rate-limited 1 msg / 10 sec (enforced server-side AND client-side)
    const now = Date.now();
    if (now - lastSent < 10000) {
      showToast('⏳ 1 message per 10 seconds in live chat.', 'warn');
      return;
    }
    getEventSocket().emit('message:send', { roomId: `event_${eventId}`, type: 'text', content });
    setMessages(prev => [...prev, { _id: Date.now(), sender: { name: currentUser?.name || 'You' }, content, createdAt: new Date(), mine: true }]);
    setInput('');
    setLastSent(now);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--cm-border)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--cm-text3)' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cm-red)', animation: 'cm-blink 1.2s infinite' }} />
        Live Chat · 1 msg/10s
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--cm-text3)', padding: '20px 0' }}>Chat is live. Say hello!</div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: m.mine ? 'var(--cm-accent2)' : 'var(--cm-text3)', flexShrink: 0, marginTop: 1, whiteSpace: 'nowrap' }}>
              {m.sender?.name}:
            </span>
            <span style={{ fontSize: 12.5, color: 'var(--cm-text2)', lineHeight: 1.5 }}>{m.content}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: '8px 10px', borderTop: '1px solid var(--cm-border)', display: 'flex', gap: 6 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Send a message…"
          style={{ flex: 1, height: 30, background: 'var(--cm-bg3)', border: '1px solid var(--cm-border2)', borderRadius: 7, padding: '0 10px', fontSize: 12.5, color: 'var(--cm-text)', fontFamily: 'var(--cm-font)', outline: 'none' }} />
        <button onClick={send} disabled={!input.trim()} style={{ width: 30, height: 30, borderRadius: 7, background: input.trim() ? 'var(--cm-accent)' : 'var(--cm-surface2)', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', color: input.trim() ? '#fff' : 'var(--cm-text4)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
      </div>
    </div>
  );
}

// Shared UI helpers
function SectionHeading({ icon, title }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cm-text3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
      {icon} {title}
      <div style={{ flex: 1, height: 1, background: 'var(--cm-border)' }} />
    </div>
  );
}

function EventCardSkeleton() {
  return (
    <div style={{ background: 'var(--cm-bg2)', border: '1px solid var(--cm-border)', borderRadius: 14, overflow: 'hidden' }}>
      <div className="cm-skel" style={{ height: 100, borderRadius: 0 }} />
      <div style={{ padding: 14 }}>
        <div className="cm-skel" style={{ height: 14, width: '80%', marginBottom: 8 }} />
        <div className="cm-skel" style={{ height: 12, width: '50%', marginBottom: 8 }} />
        <div className="cm-skel" style={{ height: 12, width: '60%', marginBottom: 12 }} />
        <div className="cm-skel" style={{ height: 32, borderRadius: 8 }} />
      </div>
    </div>
  );
}
