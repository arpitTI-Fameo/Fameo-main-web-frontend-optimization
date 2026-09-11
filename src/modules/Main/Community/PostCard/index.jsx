'use client';
// components/community/PostCard.js
// Spec §2.3 — Post Card (Discussion Card)
// ALL fields required per spec. Author name ALWAYS clickable → profile.
// ⋯ Menu: Save, Copy link, View profile, Report post, Block user (§3.9 FIXED)

import { useState } from 'react';
import { useToggleLikeMutation, useToggleSaveMutation } from '@/lib/hooks/main/useCommunity';

function timeAgo(date) {
  if (!date) return '';
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function PostCard({ post, onOpenProfile, onReport, onOpenDM }) {
  const [liked, setLiked] = useState(post.liked || false);
  const [saved, setSaved] = useState(post.saved || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || post.likes || 0);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const { mutateAsync: toggleLikeMutation } = useToggleLikeMutation();
  const { mutateAsync: toggleSaveMutation } = useToggleSaveMutation();

  async function handleLike() {
    const next = !liked;
    setLiked(next);
    setLikeCount(c => next ? c + 1 : c - 1);
    try { await toggleLikeMutation(post._id); }
    catch { setLiked(!next); setLikeCount(c => next ? c - 1 : c + 1); }
  }

  async function handleSave() {
    const next = !saved;
    setSaved(next);
    try { await toggleSaveMutation(post._id); }
    catch { setSaved(!next); }
  }

  function handleCopyLink() {
    navigator.clipboard?.writeText(`${window.location.origin}/community?post=${post._id}`);
    setMenuOpen(false);
  }

  const author = post.author || post.sender || {};
  const authorId = author._id || author.id || post.authorId;
  const authorName = author.name || post.authorName || 'Creator';
  const authorNiche = author.niche || post.niche || '';

  // Tags: show max 3, "+N more" if exceeded  (§2.3)
  const tags = post.tags || [];
  const showTags = tags.slice(0, 3);
  const extraTags = tags.length - 3;

  return (
    <div className="cm-post-card">

      {/* ── Header ── */}
      <div className="cm-post-header">
        {/* Avatar — clickable → profile */}
        <div style={{
          width: 40, height: 40, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
          background: 'linear-gradient(135deg,#6366f1,#a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 700, color: '#fff', overflow: 'hidden'
        }}
          onClick={() => onOpenProfile?.(authorId, authorName, authorNiche)}>
          {author.avatar
            ? <img src={author.avatar} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} alt="" />
            : authorName[0]?.toUpperCase()}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* §2.3: Author name bold 13.5px; clickable → opens Profile page (🆕 NEW) */}
          <div className="cm-post-author"
            onClick={() => onOpenProfile?.(authorId, authorName, authorNiche)}>
            {authorName}
          </div>
          {authorNiche && <div className="cm-post-niche">{authorNiche}</div>}
        </div>

        {post.space && (
          <div className="cm-post-space-badge">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cm-accent)', display: 'inline-block' }} />
            {post.space?.name || post.spaceName}
          </div>
        )}

        {/* §2.3 + §3.9 FIXED: ⋯ Menu top-right, 28px — accessible on ALL post cards */}
        <div style={{ position: 'relative' }}>
          <button className="cm-post-menu-btn"
            onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}>⋯</button>
          {menuOpen && (
            <div className="cm-ctx-menu cm-scale-in" onClick={e => e.stopPropagation()}>
              <div className="cm-ctx-item" onClick={() => { setMenuOpen(false); handleSave(); }}>
                🔖 {saved ? 'Unsave post' : 'Save post'}
              </div>
              <div className="cm-ctx-item" onClick={() => { handleCopyLink(); }}>
                🔗 Copy link
              </div>
              <div className="cm-ctx-item" onClick={() => { setMenuOpen(false); onOpenProfile?.(authorId, authorName, authorNiche); }}>
                👤 View profile
              </div>
              <div className="cm-ctx-item danger" onClick={() => { setMenuOpen(false); onReport?.({ type: 'post', id: post._id, title: post.title, authorName }); }}>
                🚩 Report post
              </div>
              <div className="cm-ctx-item danger" onClick={() => { setMenuOpen(false); onReport?.({ type: 'user', id: authorId, title: `User: ${authorName}`, authorName }); }}>
                🚫 Block user
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      {/* §2.3: Bold 15px, max 2 lines */}
      <div className="cm-post-title">{post.title}</div>
      {/* §2.3: 13px, max 3 lines with -webkit-line-clamp */}
      {post.content && <div className="cm-post-preview">{post.content}</div>}

      {/* §2.3: Tags — max 3, "+N more" if exceeded */}
      {showTags.length > 0 && (
        <div className="cm-post-tags">
          {showTags.map(t => <span key={t} className="cm-tag">#{t}</span>)}
          {extraTags > 0 && (
            <span className="cm-tag" style={{ color: 'var(--cm-text3)' }}>+{extraTags} more</span>
          )}
        </div>
      )}

      {/* §2.3: Action bar — Like toggle, Reply count, Save toggle, Share, Timestamp */}
      <div className="cm-post-actions">
        <button className={`cm-action-btn${liked ? ' liked' : ''}`} onClick={handleLike}>
          {liked ? '❤️' : '🤍'} {likeCount > 0 ? likeCount : ''}
        </button>
        <button className="cm-action-btn">
          💬 {post.commentCount || post.replyCount || 0}
        </button>
        <button className={`cm-action-btn${saved ? ' saved' : ''}`} onClick={handleSave}>
          🔖 {saved ? 'Saved' : 'Save'}
        </button>
        <button className="cm-action-btn"
          onClick={() => navigator.share?.({ title: post.title, url: `${window.location.origin}/community?post=${post._id}` })}>
          ↗ Share
        </button>
        {/* §2.3: Timestamp — relative time, right-aligned */}
        <span className="cm-post-time">{timeAgo(post.createdAt)}</span>
      </div>
    </div>
  );
}

// Skeleton card (§2.4)
export function PostCardSkeleton() {
  return (
    <div className="cm-skel-card">
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div className="cm-skel" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="cm-skel" style={{ height: 13, width: '40%', marginBottom: 6 }} />
          <div className="cm-skel" style={{ height: 11, width: '25%' }} />
        </div>
      </div>
      <div className="cm-skel" style={{ height: 16, width: '80%', marginBottom: 8 }} />
      <div className="cm-skel" style={{ height: 13, width: '100%', marginBottom: 5 }} />
      <div className="cm-skel" style={{ height: 13, width: '90%', marginBottom: 5 }} />
      <div className="cm-skel" style={{ height: 13, width: '70%', marginBottom: 12 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        {[60, 70, 60, 50].map((w, i) => <div key={i} className="cm-skel" style={{ height: 28, width: w, borderRadius: 7 }} />)}
      </div>
    </div>
  );
}

// §3.1: Event Highlight Card — injected at position 2, 10, 18 (every 8th post)
export function EventHighlightCard({ event, onNavigate, onRSVP, rsvped }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg,#1e1040,#0a1628)',
      border: '1px solid rgba(99,102,241,.3)', borderRadius: 'var(--cm-radius-lg)',
      padding: 20, marginBottom: 12, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 16,
    }} onClick={() => onNavigate?.('events')}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          background: 'var(--cm-red)', color: '#fff', fontSize: 10, fontWeight: 700,
          padding: '3px 10px', borderRadius: 20, letterSpacing: '.05em', textTransform: 'uppercase',
          display: 'inline-flex', alignItems: 'center', gap: 5
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'cm-blink 1.2s infinite' }} />
          {event?.status === 'live' ? 'LIVE NOW' : '📅 UPCOMING'}
        </span>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--cm-text)', marginTop: 8, marginBottom: 4, lineHeight: 1.3 }}>
          {event?.title || 'Brand Deals Masterclass'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--cm-text3)' }}>
          by {event?.host?.name || 'Creator'} · {event?.status === 'live'
            ? `${event?.listenerCount || 540} listening`
            : new Date(event?.scheduledAt).toLocaleString('en-IN', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      {rsvped ? (
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--cm-green)', flexShrink: 0 }}>✓ RSVP'd</span>
      ) : (
        <button className="cm-btn cm-btn-primary" style={{ flexShrink: 0 }}
          onClick={e => { e.stopPropagation(); onRSVP?.(event?._id); }}>
          {event?.status === 'live' ? 'Join Live →' : 'RSVP →'}
        </button>
      )}
    </div>
  );
}
