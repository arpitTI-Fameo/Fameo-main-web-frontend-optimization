'use client';
// components/community/modals/Modals.js
// Spec Part 2 + Part 5 — All 4 modals
// ✅ PostModal: Space + Topic + Tags ALL required (🔧 FIXED §3.1)
// ✅ SubmitFeedbackModal: consent checkbox mandatory, Submit disabled until checked (🔧 FIXED §3.4 + §5)
// ✅ ReportModal: exactly 6 reasons per spec §3.9 (Harassment, Spam, Adult, Misinfo, Vulgarity/hate, Other)
// ✅ OnboardingModal: 3-step, step 3 cannot be skipped, niche max 2 with warning (§Part 4)

import { useState, useRef } from 'react';
import { SPACES_DATA, NICHE_OPTIONS } from '@/constants/community';
import { useCreatePostMutation, useCreateSubmissionMutation, useReportContentMutation } from '@/lib/hooks/main/useCommunity';


// ── Shared primitives ─────────────────────────────────────────────────────────
function Overlay({ onClose, children }) {
  return (
    <div className="cm-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      {children}
    </div>
  );
}
function MHeader({ title, onClose }) {
  return (
    <div className="cm-modal-header">
      <div className="cm-modal-title">{title}</div>
      <button className="cm-modal-close" onClick={onClose}>✕</button>
    </div>
  );
}
function Field({ label, required, hint, children }) {
  return (
    <div className="cm-field">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <label className="cm-field-label">
          {label}{required && <span style={{ color: 'var(--cm-red)' }}> *</span>}
        </label>
        {hint && <span style={{ fontSize: 11, color: 'var(--cm-text3)' }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// POST MODAL  §3.1 FIXED: Topic field was missing in v1 — now required
// Required fields: Space, Topic, Tags (§3.1)
// ──────────────────────────────────────────────────────────────────────────────
const TOPICS = ['Question', 'Tips & Advice', 'Case Study', 'Collaboration', 'Rant', 'Win 🎉', 'Feedback Needed', 'Resource Share'];

export function PostModal({ onClose, onSuccess, showToast }) {
  const [space, setSpace] = useState('');
  const [topic, setTopic] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [posting, setPosting] = useState(false);
  const { mutateAsync: createPostMutation } = useCreatePostMutation();

  // §3.1: All 3 required — Space, Topic, Tags
  const canSubmit = space && topic && title.trim() && content.trim() && tags.trim();

  async function submit() {
    if (!canSubmit) {
      showToast?.('⚠️ Please fill Space, Topic, Title, Content, and Tags.', 'warn');
      return;
    }
    setPosting(true);
    const tagArr = tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 5);
    try {
      await createPostMutation({ spaceId: space, topic, title: title.trim(), content: content.trim(), tags: tagArr });
      showToast?.('Post created successfully!', 'success');
      onSuccess?.();
      onClose?.();
    } catch (e) {
      showToast?.(e.message || 'Failed to post', 'error');
      setPosting(false);
    }
  }

  return (
    <Overlay onClose={onClose}>
      <div className="cm-modal-box">
        <MHeader title="✦ Start a Discussion" onClose={onClose} />
        <div className="cm-modal-body">

          {/* §3.1: Space — required */}
          <Field label="Post to Space" required>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {Object.values(SPACES_DATA).filter(s => s.joined).map(sp => (
                <div key={sp.id} onClick={() => setSpace(sp.id)}
                  style={{ padding: '10px 12px', background: space === sp.id ? 'var(--cm-accent-soft)' : 'var(--cm-bg3)', border: `1px solid ${space === sp.id ? 'var(--cm-accent)' : 'var(--cm-border2)'}`, borderRadius: 8, cursor: 'pointer', fontSize: 12.5, color: space === sp.id ? 'var(--cm-accent2)' : 'var(--cm-text2)', transition: 'all .14s', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: sp.color, flexShrink: 0 }} />
                  {sp.name.replace('✦ ', '')}
                </div>
              ))}
            </div>
            {!space && <div style={{ fontSize: 11, color: 'var(--cm-red)', marginTop: 4 }}>Required — select a space</div>}
          </Field>

          {/* §3.1 FIXED: Topic field — was missing in v1, now required */}
          <Field label="Topic" required>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TOPICS.map(t => (
                <span key={t} onClick={() => setTopic(t)}
                  style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: `1px solid ${topic === t ? 'var(--cm-accent)' : 'var(--cm-border2)'}`, background: topic === t ? 'var(--cm-accent-soft)' : 'transparent', color: topic === t ? 'var(--cm-accent2)' : 'var(--cm-text3)', transition: 'all .14s' }}>
                  {t}
                </span>
              ))}
            </div>
            {!topic && <div style={{ fontSize: 11, color: 'var(--cm-red)', marginTop: 4 }}>Required — select a topic</div>}
          </Field>

          <Field label="Title" required>
            <input className="cm-input" value={title} onChange={e => setTitle(e.target.value)} maxLength={200}
              placeholder="What's your discussion about?" />
          </Field>

          <Field label="Content" required hint={`${content.length} / 2000`}>
            <textarea className="cm-textarea" rows={5} value={content}
              onChange={e => setContent(e.target.value.slice(0, 2000))}
              placeholder="Share your thoughts, question, or insight…" />
          </Field>

          {/* §3.1: Tags — required */}
          <Field label="Tags" required hint="Comma-separated, max 5">
            <input className="cm-input" value={tags} onChange={e => setTags(e.target.value)}
              placeholder="branddeals, instagram, growth" />
            {!tags.trim() && <div style={{ fontSize: 11, color: 'var(--cm-red)', marginTop: 4 }}>Required — add at least one tag</div>}
          </Field>

          <div style={{ background: 'var(--cm-bg3)', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: 'var(--cm-text3)', lineHeight: 1.7 }}>
            📋 No spam · No personal social handles · No undisclosed promotions · Be specific and helpful
          </div>
        </div>

        <div className="cm-modal-footer">
          <button className="cm-btn cm-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="cm-btn cm-btn-primary" onClick={submit}
            disabled={posting || !canSubmit}
            style={{ opacity: canSubmit ? 1 : .5 }}>
            {posting ? '⏳ Posting…' : '✦ Post Discussion'}
          </button>
        </div>
      </div>
    </Overlay>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// SUBMIT FEEDBACK MODAL  §3.4 + §5 FIXED
// Consent checkbox mandatory — Submit disabled until checked (🔧 FIXED)
// Exact declaration text from spec §3.4
// ──────────────────────────────────────────────────────────────────────────────
const CONTENT_TYPES = [
  { id: 'reel', icon: '🎥', label: 'Reel Draft' },
  { id: 'thumbnail', icon: '🖼️', label: 'Thumbnail' },
  { id: 'script', icon: '📝', label: 'Script' },
  { id: 'brand_readiness', icon: '🏷️', label: 'Brand Readiness' },
];

export function SubmitFeedbackModal({ onClose, onSuccess, showToast }) {
  const [contentType, setContentType] = useState('reel');
  const [objective, setObjective] = useState('');
  const [tags, setTags] = useState('');
  const [consented, setConsented] = useState(false);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);
  const { mutateAsync: createSubmissionMutation } = useCreateSubmissionMutation();

  // §3.4: File validation per spec — .mp4 .mov ≤500MB, .jpg .png .webp ≤20MB, .pdf .txt .docx ≤10MB
  const ALLOWED = { video: ['video/mp4', 'video/quicktime'], image: ['image/jpeg', 'image/png', 'image/webp'], doc: ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] };
  const SIZE_LIMITS = { video: 500 * 1024 * 1024, image: 20 * 1024 * 1024, doc: 10 * 1024 * 1024 };

  function handleFile(f) {
    setFileError('');
    let cat = null;
    if (ALLOWED.video.includes(f.type)) cat = 'video';
    else if (ALLOWED.image.includes(f.type)) cat = 'image';
    else if (ALLOWED.doc.includes(f.type)) cat = 'doc';
    else { setFileError('File type not allowed. Accepted: .mp4 .mov .jpg .png .webp .pdf .txt .docx'); return; }
    if (f.size > SIZE_LIMITS[cat]) { setFileError(`File too large. Max: ${cat === 'video' ? '500MB' : cat === 'image' ? '20MB' : '10MB'}`); return; }
    setFile(f);
  }

  // §3.4: objective min 20 chars
  const objOk = objective.trim().length >= 20;
  // §3.4: Submit button disabled until consent checked
  const canSubmit = consented && objOk && file;

  async function submit() {
    if (!canSubmit) {
      if (!consented) { showToast?.('⚠️ Please confirm the content declaration.', 'warn'); return; }
      if (!objOk) { showToast?.('⚠️ Objective must be at least 20 characters.', 'warn'); return; }
      if (!file) { showToast?.('⚠️ Please upload your content file.', 'warn'); return; }
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('content_type', contentType);
      fd.append('file', file);
      fd.append('objective', objective.trim());
      fd.append('tags', tags.split(',').map(t => t.trim()).filter(Boolean).join(','));
      fd.append('declarationConsented', 'true');
      await createSubmissionMutation(fd);
      showToast?.('Feedback request submitted!', 'success');
      onSuccess?.();
      onClose?.();
    } catch (e) {
      showToast?.(e.message || 'Submission failed', 'error');
      setSubmitting(false);
    }
  }

  return (
    <Overlay onClose={onClose}>
      <div className="cm-modal-box">
        <MHeader title="◎ Submit for Peer Review" onClose={onClose} />
        <div className="cm-modal-body">

          {/* Content type */}
          <Field label="Content Type" required>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {CONTENT_TYPES.map(t => (
                <div key={t.id} onClick={() => setContentType(t.id)}
                  style={{ padding: 12, background: contentType === t.id ? 'var(--cm-accent-soft)' : 'var(--cm-bg3)', border: `1px solid ${contentType === t.id ? 'var(--cm-accent)' : 'var(--cm-border2)'}`, borderRadius: 10, cursor: 'pointer', textAlign: 'center', transition: 'all .14s' }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{t.icon}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: contentType === t.id ? 'var(--cm-accent2)' : 'var(--cm-text2)' }}>{t.label}</div>
                </div>
              ))}
            </div>
          </Field>

          {/* File upload */}
          <Field label="Upload File" required>
            {/* §5 SAFE: Red warning text on upload zone */}
            <div style={{ fontSize: 11.5, color: 'var(--cm-red)', fontWeight: 600, marginBottom: 6 }}>
              ⚠️ No nudity, adult content, violence, or hate speech allowed. Violations will result in removal.
            </div>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              style={{ border: `2px dashed ${fileError ? 'var(--cm-red)' : file ? 'var(--cm-green)' : 'var(--cm-border2)'}`, borderRadius: 10, padding: '22px 16px', textAlign: 'center', cursor: 'pointer', background: file ? 'var(--cm-green-soft)' : fileError ? 'var(--cm-red-soft)' : 'var(--cm-bg3)', transition: 'all .2s' }}>
              <input ref={fileRef} type="file" accept=".mp4,.mov,.jpg,.jpeg,.png,.webp,.pdf,.txt,.docx" style={{ display: 'none' }}
                onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
              {file ? (
                <div>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>✅</div>
                  <div style={{ fontSize: 13.5, color: 'var(--cm-green)', fontWeight: 600 }}>{file.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--cm-text3)', marginTop: 3 }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 28, marginBottom: 8, opacity: .4 }}>📁</div>
                  <div style={{ fontSize: 13.5, color: 'var(--cm-text2)' }}>Drag & drop or <span style={{ color: 'var(--cm-accent2)' }}>browse</span></div>
                  <div style={{ fontSize: 11, color: 'var(--cm-text3)', marginTop: 4 }}>
                    Video: .mp4 .mov (≤500MB) · Image: .jpg .png .webp (≤20MB) · Doc: .pdf .txt .docx (≤10MB)
                  </div>
                </>
              )}
            </div>
            {fileError && <div style={{ fontSize: 12, color: 'var(--cm-red)', marginTop: 5 }}>⚠️ {fileError}</div>}
          </Field>

          {/* Objective — min 20 chars */}
          <Field label="Your Objective" required hint={`${objective.length} / 500`}>
            <textarea className="cm-textarea" rows={3} value={objective}
              onChange={e => setObjective(e.target.value.slice(0, 500))}
              placeholder="What specific feedback are you looking for? e.g. 'Is my hook strong enough in the first 3 seconds?'" />
            {objective.trim().length > 0 && objective.trim().length < 20 && (
              <div style={{ fontSize: 11, color: 'var(--cm-red)', marginTop: 3 }}>Min 20 characters ({20 - objective.trim().length} more needed)</div>
            )}
          </Field>

          <Field label="Tags" hint="Comma-separated, max 5">
            <input className="cm-input" value={tags} onChange={e => setTags(e.target.value)}
              placeholder="reel, instagram, hook" />
          </Field>

          {/* §3.4 FIXED + §5 SAFE: Mandatory consent checkbox — Submit disabled until checked */}
          <div style={{ background: 'rgba(124,58,237,.08)', border: '1px solid rgba(124,58,237,.2)', borderRadius: 10, padding: 14 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}
              onClick={() => setConsented(v => !v)}>
              <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${consented ? '#7c3aed' : 'rgba(124,58,237,.5)'}`, background: consented ? '#7c3aed' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'transparent', flexShrink: 0, marginTop: 2, transition: 'all .15s', ...(consented ? { color: '#fff' } : {}) }}>
                {consented && '✓'}
              </div>
              {/* §3.4 FIXED: Exact declaration text from spec */}
              <div style={{ fontSize: 12.5, color: 'var(--cm-text2)', lineHeight: 1.65 }}>
                I confirm this content is my own original work and does not contain nudity, adult content, violence, hate speech, personal social handles for self-promotion, undisclosed paid promotions, or copyrighted material I do not own.
              </div>
            </div>
          </div>
        </div>

        <div className="cm-modal-footer">
          <button className="cm-btn cm-btn-ghost" onClick={onClose}>Cancel</button>
          {/* §3.4 FIXED: Submit disabled (pointer-events:none) until consent checked */}
          <button className="cm-btn cm-btn-primary"
            onClick={submit}
            disabled={submitting || !canSubmit}
            style={{ opacity: canSubmit ? 1 : .5, cursor: canSubmit ? 'pointer' : 'not-allowed', pointerEvents: consented ? 'auto' : 'none' }}>
            {submitting ? '⏳ Submitting…' : '◎ Submit for Review'}
          </button>
        </div>
      </div>
    </Overlay>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// REPORT MODAL  §3.9 FIXED
// Exactly 6 reasons per spec: Harassment, Spam, Adult, Misinformation, Vulgarity, Other
// ──────────────────────────────────────────────────────────────────────────────

// §3.9: Exact 6 reason categories from spec (2 new in v2: Adult, Vulgarity/hate)
const REPORT_REASONS = [
  { id: 'harassment', label: 'Harassment or bullying', note: 'Priority review within 4 hours' },
  { id: 'spam', label: 'Spam or self-promotion' },
  { id: 'adult', label: 'Adult or inappropriate content'         /* 🆕 NEW in v2 */ },
  { id: 'misinfo', label: 'Misinformation', note: 'Finance, health, legal claims' },
  { id: 'vulgarity', label: 'Vulgarity or hate speech'               /* 🆕 NEW in v2 */ },
  { id: 'other', label: 'Other (describe below)' },
];

export function ReportModal({ target, onClose, onSuccess, showToast }) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { mutateAsync: reportContentMutation } = useReportContentMutation();

  async function submit() {
    if (!reason) { showToast?.('⚠️ Please select a reason.', 'warn'); return; }
    setSubmitting(true);
    try {
      await reportContentMutation({
        targetType: target?.type || 'post',
        targetId: target?.id,
        reason,
        details: details.trim(),
      });
      showToast?.('Report submitted. Our team will review this shortly.', 'success');
    } catch { /* optimistic */ }
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) return (
    <Overlay onClose={onClose}>
      <div className="cm-modal-box" style={{ maxWidth: 400 }}>
        <div style={{ padding: '40px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
          <div style={{ fontFamily: 'var(--cm-font-display)', fontSize: 20, fontWeight: 700, color: 'var(--cm-text)', marginBottom: 8 }}>
            Report Submitted
          </div>
          <div style={{ fontSize: 13.5, color: 'var(--cm-text2)', lineHeight: 1.7 }}>
            Thank you for helping keep the community safe. We'll review within 24 hours.
            {reason === 'harassment' && (
              <><br /><strong style={{ color: 'var(--cm-orange)' }}>This is a priority case — reviewing within 4 hours.</strong></>
            )}
          </div>
          <button className="cm-btn cm-btn-primary" style={{ marginTop: 20, height: 40 }} onClick={onClose}>Close</button>
        </div>
      </div>
    </Overlay>
  );

  return (
    <Overlay onClose={onClose}>
      <div className="cm-modal-box" style={{ maxWidth: 480 }}>
        <MHeader title="🚩 Report Content" onClose={onClose} />
        <div className="cm-modal-body">

          {/* Report target info block */}
          {target?.title && (
            <div style={{ background: 'var(--cm-bg3)', border: '1px solid var(--cm-border2)', borderRadius: 8, padding: '10px 12px', fontSize: 12.5, color: 'var(--cm-text2)', marginBottom: 16 }}>
              Reporting: <strong style={{ color: 'var(--cm-text)' }}>
                {target.type === 'post' ? `Post by ${target.authorName || 'creator'}` :
                  target.type === 'user' ? `User profile of ${target.authorName || target.title}` :
                    target.title}
              </strong>
            </div>
          )}

          {/* §3.9: Exactly 6 reasons */}
          <Field label="Reason for report" required>
            {REPORT_REASONS.map(r => (
              <div key={r.id} className={`cm-radio-option${reason === r.id ? ' selected' : ''}`}
                onClick={() => setReason(r.id)} style={{ marginBottom: 6 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${reason === r.id ? 'var(--cm-accent)' : 'var(--cm-border3)'}`, background: reason === r.id ? 'var(--cm-accent)' : 'transparent', flexShrink: 0, transition: 'all .14s' }} />
                <div style={{ flex: 1 }}>
                  {r.label}
                  {r.note && reason === r.id && (
                    <div style={{ fontSize: 11, color: 'var(--cm-orange)', marginTop: 2, fontWeight: 600 }}>⚡ {r.note}</div>
                  )}
                </div>
              </div>
            ))}
          </Field>

          <Field label="Additional details" hint={`${details.length} / 500`}>
            <textarea className="cm-textarea" rows={3} value={details}
              onChange={e => setDetails(e.target.value.slice(0, 500))}
              placeholder="Provide any context that will help our team review faster…" />
          </Field>
        </div>

        <div className="cm-modal-footer">
          <button className="cm-btn cm-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="cm-btn cm-btn-primary" style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)' }}
            onClick={submit} disabled={submitting || !reason}>
            {submitting ? '⏳ Submitting…' : '🚩 Submit Report'}
          </button>
        </div>
      </div>
    </Overlay>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// ONBOARDING MODAL  §Part 4 🆕 NEW
// 3 steps — cannot skip step 3 agreement
// Step 2: niche max 2 with warning if try 3rd
// ──────────────────────────────────────────────────────────────────────────────
const COMMUNITY_RULES = [
  'No nudity or adult content in any posts or uploads',
  'No personal social handle promotion or follower-farming',
  'No harassment, bullying, or hate speech of any kind',
  'No spam or undisclosed paid promotions',
  'Be specific and genuinely helpful in feedback',
];

const PLATFORM_FEATURES = [
  { icon: '◉', title: 'Live Audio Events', desc: 'Join rooms with industry experts and brand managers' },
  { icon: '◎', title: 'Peer Review System', desc: 'Get structured feedback on your content drafts' },
  { icon: '◫', title: 'Niche Spaces', desc: 'Connect with creators in your specific category' },
  { icon: '🏆', title: 'Recognition', desc: 'Earn points and badges for community contributions' },
];

export function OnboardingModal({ onComplete }) {
  const [step, setStep] = useState(1);
  const [niches, setNiches] = useState([]);
  const [agreeTos, setAgreeTos] = useState(false);
  const [warn, setWarn] = useState(false);

  function toggleNiche(id) {
    if (niches.includes(id)) {
      setNiches(prev => prev.filter(n => n !== id));
      setWarn(false);
    } else if (niches.length >= 2) {
      // §Part 4: Warning when trying to select 3rd
      setWarn(true);
    } else {
      setNiches(prev => [...prev, id]);
      setWarn(false);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 520, maxWidth: 'calc(100vw - 32px)', background: 'var(--cm-bg2)', border: '1px solid var(--cm-border2)', borderRadius: 'var(--cm-radius-xl)', overflow: 'hidden', boxShadow: 'var(--cm-shadow-lg)' }}>

        {/* Progress */}
        <div style={{ padding: '20px 28px 0', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ width: 28, height: 4, borderRadius: 2, background: s <= step ? 'var(--cm-accent)' : 'var(--cm-border2)', transition: 'background .25s' }} />
            ))}
          </div>
        </div>

        {/* ── Step 1: Welcome ── */}
        {step === 1 && (
          <div className="cm-fade-up">
            <div style={{ padding: '0 28px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✦</div>
              <div style={{ fontFamily: 'var(--cm-font-display)', fontSize: 22, fontWeight: 700, color: 'var(--cm-text)', marginBottom: 6 }}>Welcome to CreatorHub Community</div>
              {/* §Part 4: Exact description from spec */}
              <div style={{ fontSize: 13.5, color: 'var(--cm-text3)', lineHeight: 1.65, marginBottom: 24 }}>
                Your platform to grow, collaborate, get feedback, and land brand deals.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24, textAlign: 'left' }}>
                {PLATFORM_FEATURES.map(f => (
                  <div key={f.icon} style={{ background: 'var(--cm-bg3)', borderRadius: 10, padding: '14px 12px', border: '1px solid var(--cm-border)' }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{f.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cm-text)', marginBottom: 3 }}>{f.title}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--cm-text3)', lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '16px 28px', borderTop: '1px solid var(--cm-border)', display: 'flex', justifyContent: 'flex-end' }}>
              {/* §Part 4: "Get Started →" button */}
              <button className="cm-btn cm-btn-primary" style={{ height: 42 }} onClick={() => setStep(2)}>Get Started →</button>
            </div>
          </div>
        )}

        {/* ── Step 2: Choose niche (§Part 4: max 2, warning on 3rd) ── */}
        {step === 2 && (
          <div className="cm-fade-up">
            <div style={{ padding: '0 28px 24px' }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontFamily: 'var(--cm-font-display)', fontSize: 20, fontWeight: 700, color: 'var(--cm-text)', marginBottom: 6 }}>Choose Your Niche</div>
                <div style={{ fontSize: 13, color: 'var(--cm-text3)' }}>Select up to 2 content categories</div>
              </div>
              {/* §Part 4: Warning shown if user tries to select 3rd */}
              {warn && (
                <div style={{ fontSize: 12.5, color: 'var(--cm-orange)', marginBottom: 10, padding: '8px 12px', background: 'var(--cm-orange-soft)', borderRadius: 8, border: '1px solid rgba(245,158,11,.2)', textAlign: 'center' }}>
                  ⚠️ You can only select 2 niche spaces. Deselect one to choose a different one.
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {NICHE_OPTIONS.map(n => (
                  <div key={n.id}
                    style={{ padding: '12px 14px', background: niches.includes(n.id) ? 'var(--cm-accent-soft)' : 'var(--cm-bg3)', border: `1px solid ${niches.includes(n.id) ? 'var(--cm-accent)' : 'var(--cm-border2)'}`, borderRadius: 10, cursor: 'pointer', transition: 'all .15s', fontSize: 13, color: niches.includes(n.id) ? 'var(--cm-accent2)' : 'var(--cm-text2)', display: 'flex', alignItems: 'center', gap: 8 }}
                    onClick={() => toggleNiche(n.id)}>
                    {n.label}
                    {niches.includes(n.id) && <span style={{ marginLeft: 'auto', color: 'var(--cm-accent)' }}>✓</span>}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '16px 28px', borderTop: '1px solid var(--cm-border)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="cm-btn cm-btn-ghost" onClick={() => setStep(1)}>← Back</button>
              {/* NOTE: this element had two `style` props. JSX keeps the last,
                  so `height: 42` was never applied. The dead one is removed so
                  what renders is unchanged — re-add height here if it was
                  actually wanted. */}
              <button className="cm-btn cm-btn-primary"
                onClick={() => setStep(3)} disabled={niches.length === 0}
                style={{ opacity: niches.length > 0 ? 1 : .5 }}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Community Standards — CANNOT be skipped (§Part 4) ── */}
        {step === 3 && (
          <div className="cm-fade-up">
            <div style={{ padding: '0 28px 24px' }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontFamily: 'var(--cm-font-display)', fontSize: 20, fontWeight: 700, color: 'var(--cm-text)', marginBottom: 6 }}>Community Standards</div>
                <div style={{ fontSize: 13, color: 'var(--cm-text3)' }}>Please read and agree before entering</div>
              </div>
              {/* §Part 4: Exact 5 rules from spec */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {COMMUNITY_RULES.map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: 'var(--cm-bg3)', borderRadius: 8, border: '1px solid var(--cm-border)', fontSize: 12.5, color: 'var(--cm-text2)', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--cm-accent)', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                    {r}
                  </div>
                ))}
              </div>
              {/* Consent checkbox */}
              <div style={{ background: 'rgba(124,58,237,.08)', border: '1px solid rgba(124,58,237,.2)', borderRadius: 10, padding: 14 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}
                  onClick={() => setAgreeTos(v => !v)}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${agreeTos ? '#7c3aed' : 'rgba(124,58,237,.5)'}`, background: agreeTos ? '#7c3aed' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: agreeTos ? '#fff' : 'transparent', flexShrink: 0, marginTop: 2, transition: 'all .15s' }}>
                    {agreeTos && '✓'}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--cm-text2)', lineHeight: 1.65 }}>
                    I have read and agree to the <strong style={{ color: 'var(--cm-text)' }}>Community Guidelines</strong>. I understand that violations may result in content removal or account suspension.
                  </div>
                </div>
              </div>
            </div>
            <div style={{ padding: '16px 28px', borderTop: '1px solid var(--cm-border)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="cm-btn cm-btn-ghost" onClick={() => setStep(2)}>← Back</button>
              {/* §Part 4: Exact button text "I Agree — Enter Community ✓" — cannot enter without agreeing */}
              <button
                style={{
                  height: 42, padding: '0 20px', borderRadius: 12, fontSize: 14, fontWeight: 700, border: 'none',
                  background: agreeTos ? '#16a34a' : 'var(--cm-surface2)',
                  color: agreeTos ? '#fff' : 'var(--cm-text4)',
                  cursor: agreeTos ? 'pointer' : 'not-allowed',
                  opacity: agreeTos ? 1 : .55,
                  fontFamily: 'var(--cm-font)', transition: 'all .15s',
                  pointerEvents: agreeTos ? 'auto' : 'none',
                  boxShadow: agreeTos ? '0 3px 10px rgba(22,163,74,.3)' : 'none',
                }}
                onClick={onComplete}
                disabled={!agreeTos}>
                I Agree — Enter Community ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
