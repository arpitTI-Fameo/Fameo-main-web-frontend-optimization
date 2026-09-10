// 'use client';
// import { useState } from 'react';
// import { SPACES } from '@/constants/community';

// export default function PostModal({ onClose, onSubmit }) {
//   const [form, setForm] = useState({ spaceId: '', topic: '', content: '', tags: '' });
//   const [errors, setErrors] = useState({});

//   const TOPIC_OPTIONS = [
//     'Growth & Strategy', 'Brand Deals', 'Content Creation', 'Algorithm & Reach',
//     'Monetization', 'Equipment & Tech', 'Mindset & Creator Life', 'Feedback Request',
//   ];

//   const joinedSpaces = SPACES.filter(s => s.joined);

//   function validate() {
//     const errs = {};
//     if (!form.spaceId) errs.spaceId = 'Select a space';
//     if (!form.topic) errs.topic = 'Select a topic';
//     if (!form.content.trim() || form.content.length < 20) errs.content = 'Minimum 20 characters';
//     return errs;
//   }

//   function handleSubmit() {
//     const errs = validate();
//     if (Object.keys(errs).length > 0) { setErrors(errs); return; }
//     onSubmit?.();
//     onClose();
//   }

//   return (
//     <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
//       <div style={{
//         background: 'var(--cm-bg2)', border: '1px solid var(--cm-border2)', borderRadius: 20,
//         width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto',
//         animation: 'cm-scale-in .2s ease both',
//       }}>
//         {/* Header */}
//         <div style={{ padding: '22px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
//           <div style={{ fontFamily: 'var(--cm-font-display)', fontSize: 20, fontWeight: 700, color: 'var(--cm-text)' }}>Start a Discussion</div>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--cm-text3)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>✕</button>
//         </div>

//         <div style={{ padding: '0 24px 24px' }}>
//           {/* Space selector */}
//           <div style={{ marginBottom: 16 }}>
//             <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--cm-text2)', display: 'block', marginBottom: 6 }}>
//               Space <span style={{ color: 'var(--cm-red)' }}>*</span>
//             </label>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
//               {joinedSpaces.map(space => (
//                 <div
//                   key={space.id}
//                   onClick={() => setForm(f => ({ ...f, spaceId: space.id }))}
//                   style={{
//                     padding: '9px 12px', borderRadius: 9, cursor: 'pointer', fontSize: 13,
//                     display: 'flex', alignItems: 'center', gap: 8, transition: 'all .15s',
//                     border: `1px solid ${form.spaceId === space.id ? 'var(--cm-accent)' : 'var(--cm-border2)'}`,
//                     background: form.spaceId === space.id ? 'var(--cm-accent-soft)' : 'var(--cm-bg3)',
//                     color: form.spaceId === space.id ? 'var(--cm-accent2)' : 'var(--cm-text2)',
//                   }}
//                 >
//                   <div style={{ width: 8, height: 8, borderRadius: '50%', background: space.color, flexShrink: 0 }} />
//                   {space.name}
//                 </div>
//               ))}
//             </div>
//             {errors.spaceId && <div style={{ fontSize: 11.5, color: 'var(--cm-red)', marginTop: 5 }}>⚠ {errors.spaceId}</div>}
//           </div>

//           {/* Topic selector */}
//           <div style={{ marginBottom: 16 }}>
//             <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--cm-text2)', display: 'block', marginBottom: 6 }}>
//               Topic <span style={{ color: 'var(--cm-red)' }}>*</span>
//             </label>
//             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//               {TOPIC_OPTIONS.map(t => (
//                 <div
//                   key={t}
//                   onClick={() => setForm(f => ({ ...f, topic: t }))}
//                   style={{
//                     padding: '5px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer', transition: 'all .15s',
//                     border: `1px solid ${form.topic === t ? 'var(--cm-accent)' : 'var(--cm-border2)'}`,
//                     background: form.topic === t ? 'var(--cm-accent-soft)' : 'transparent',
//                     color: form.topic === t ? 'var(--cm-accent2)' : 'var(--cm-text3)',
//                   }}
//                 >
//                   {t}
//                 </div>
//               ))}
//             </div>
//             {errors.topic && <div style={{ fontSize: 11.5, color: 'var(--cm-red)', marginTop: 5 }}>⚠ {errors.topic}</div>}
//           </div>

//           {/* Content */}
//           <div style={{ marginBottom: 16 }}>
//             <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--cm-text2)', display: 'block', marginBottom: 6 }}>
//               Discussion <span style={{ color: 'var(--cm-red)' }}>*</span>
//               <span style={{ float: 'right', fontWeight: 400, color: 'var(--cm-text3)' }}>{form.content.length} / 2000</span>
//             </label>
//             <textarea
//               value={form.content}
//               onChange={e => setForm(f => ({ ...f, content: e.target.value.slice(0, 2000) }))}
//               placeholder="Share your experience, question, or insight with the community…"
//               style={{
//                 width: '100%', minHeight: 120, background: 'var(--cm-bg3)', border: `1px solid ${errors.content ? 'var(--cm-red)' : 'var(--cm-border2)'}`,
//                 borderRadius: 9, padding: '10px 12px', color: 'var(--cm-text)', fontSize: 13,
//                 fontFamily: 'var(--cm-font)', outline: 'none', resize: 'vertical', lineHeight: 1.6,
//               }}
//             />
//             {errors.content && <div style={{ fontSize: 11.5, color: 'var(--cm-red)', marginTop: 5 }}>⚠ {errors.content}</div>}
//           </div>

//           {/* Tags */}
//           <div style={{ marginBottom: 20 }}>
//             <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--cm-text2)', display: 'block', marginBottom: 6 }}>
//               Tags <span style={{ color: 'var(--cm-text3)', fontWeight: 400 }}>(optional, max 5)</span>
//             </label>
//             <input
//               value={form.tags}
//               onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
//               placeholder="e.g. reels, brand deals, beginner"
//               style={{
//                 width: '100%', height: 38, background: 'var(--cm-bg3)', border: '1px solid var(--cm-border2)',
//                 borderRadius: 9, padding: '0 12px', color: 'var(--cm-text)', fontSize: 13,
//                 fontFamily: 'var(--cm-font)', outline: 'none',
//               }}
//             />
//           </div>

//           {/* Posting rules */}
//           <div style={{ background: 'var(--cm-bg3)', borderRadius: 9, padding: '10px 12px', marginBottom: 18, fontSize: 11.5, color: 'var(--cm-text3)', lineHeight: 1.7 }}>
//             📜 <strong style={{ color: 'var(--cm-text2)' }}>Posting rules:</strong> No social handles, follower-farming CTAs, or undisclosed promotions. Be specific and add value.
//           </div>

//           {/* Actions */}
//           <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
//             <button onClick={onClose} style={{ height: 38, padding: '0 18px', background: 'var(--cm-surface)', color: 'var(--cm-text2)', border: '1px solid var(--cm-border2)', borderRadius: 9, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--cm-font)' }}>Cancel</button>
//             <button onClick={handleSubmit} style={{ height: 38, padding: '0 22px', background: 'linear-gradient(135deg,var(--cm-accent),#c0306a)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--cm-font)' }}>
//               ✦ Post Discussion
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
import { useState } from 'react';
import { SPACES } from '@/constants/community';

const TOPICS = [
  'Growth & Strategy', 'Brand Deals', 'Content Creation', 'Algorithm & Reach',
  'Monetization', 'Equipment & Tech', 'Mindset & Creator Life', 'Feedback Request',
];

export default function PostModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ spaceId: '', topic: '', content: '', tags: '' });
  const [errors, setErrors] = useState({});
  const joined = SPACES.filter(s => s.joined);

  function validate() {
    const e = {};
    if (!form.spaceId) e.spaceId = 'Select a space';
    if (!form.topic) e.topic = 'Select a topic';
    if (form.content.trim().length < 20) e.content = 'Minimum 20 characters';
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSubmit?.();
    onClose();
  }

  return (
    <Overlay onClose={onClose}>
      <ModalBox maxWidth={540}>
        <ModalHeader title="✦ Start a Discussion" onClose={onClose} />

        <div style={{ padding: '0 26px 26px' }}>
          {/* Space */}
          <Field label="Space" required error={errors.spaceId}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {joined.map(s => (
                <Chip
                  key={s.id}
                  selected={form.spaceId === s.id}
                  onClick={() => { setForm(f => ({ ...f, spaceId: s.id })); setErrors(e => ({ ...e, spaceId: '' })); }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                  {s.name}
                </Chip>
              ))}
            </div>
          </Field>

          {/* Topic */}
          <Field label="Topic" required error={errors.topic}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {TOPICS.map(t => (
                <button
                  key={t}
                  onClick={() => { setForm(f => ({ ...f, topic: t })); setErrors(e => ({ ...e, topic: '' })); }}
                  style={{
                    padding: '5px 13px', borderRadius: 20, fontSize: 12.5, fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'var(--cm-font)', transition: 'all .14s',
                    border: 'none',
                    background: form.topic === t ? 'var(--cm-accent-soft2)' : 'var(--cm-surface)',
                    color: form.topic === t ? 'var(--cm-accent)' : 'var(--cm-text3)',
                    boxShadow: form.topic === t ? 'inset 0 0 0 1.5px var(--cm-accent)' : 'inset 0 0 0 1px var(--cm-border2)',
                  }}
                >{t}</button>
              ))}
            </div>
          </Field>

          {/* Content */}
          <Field
            label="Discussion"
            required
            error={errors.content}
            hint={`${form.content.length} / 2000`}
          >
            <textarea
              value={form.content}
              onChange={e => { setForm(f => ({ ...f, content: e.target.value.slice(0, 2000) })); setErrors(er => ({ ...er, content: '' })); }}
              placeholder="Share your experience, question, or insight with the community…"
              style={{
                ...textareaStyle,
                minHeight: 120,
                borderColor: errors.content ? 'var(--cm-red)' : 'var(--cm-border2)',
              }}
              onFocus={e => { if (!errors.content) e.target.style.borderColor = 'var(--cm-accent)'; e.target.style.boxShadow = '0 0 0 3px var(--cm-accent-soft)'; }}
              onBlur={e => { e.target.style.borderColor = errors.content ? 'var(--cm-red)' : 'var(--cm-border2)'; e.target.style.boxShadow = 'none'; }}
            />
          </Field>

          {/* Tags */}
          <Field label="Tags" hint="Optional · max 5 · comma-separated">
            <input
              value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              placeholder="e.g. reels, brand deals, beginner"
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'var(--cm-accent)'; e.target.style.boxShadow = '0 0 0 3px var(--cm-accent-soft)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--cm-border2)'; e.target.style.boxShadow = 'none'; }}
            />
          </Field>

          {/* Posting rules */}
          <div style={{
            background: 'var(--cm-bg3)', borderRadius: 10, padding: '10px 14px', marginBottom: 20,
            fontSize: 12, color: 'var(--cm-text3)', lineHeight: 1.7, border: '1px solid var(--cm-border)',
          }}>
            📜 <strong style={{ color: 'var(--cm-text2)' }}>Before posting:</strong> No social handles, follower-farming CTAs, or undisclosed promotions. Be specific and add value.
          </div>

          <ModalActions onClose={onClose} onSubmit={handleSubmit} submitLabel="✦ Post Discussion" />
        </div>
      </ModalBox>
    </Overlay>
  );
}

// ── Shared modal primitives ──────────────────────────────────────────────────

export function Overlay({ children, onClose }) {
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose?.(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(19,18,38,0.65)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
    >
      {children}
    </div>
  );
}

export function ModalBox({ children, maxWidth = 520 }) {
  return (
    <div className="cm-scale-in" style={{
      background: 'var(--cm-bg2)',
      border: '1.5px solid var(--cm-border2)',
      borderRadius: 22,
      width: '100%',
      maxWidth,
      maxHeight: '92vh',
      overflowY: 'auto',
      boxShadow: 'var(--cm-shadow-xl)',
    }}>
      {children}
    </div>
  );
}

export function ModalHeader({ title, onClose }) {
  return (
    <div style={{
      padding: '22px 26px 0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 22,
    }}>
      <div style={{
        fontFamily: 'var(--cm-font-display)', fontSize: 21, fontWeight: 700,
        color: 'var(--cm-text)', letterSpacing: '-0.01em',
      }}>{title}</div>
      <button
        onClick={onClose}
        style={{
          width: 32, height: 32, borderRadius: 8, background: 'var(--cm-surface)',
          border: '1px solid var(--cm-border2)', cursor: 'pointer', fontSize: 16,
          color: 'var(--cm-text3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .14s', lineHeight: 1,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--cm-surface2)'; e.currentTarget.style.color = 'var(--cm-text)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--cm-surface)'; e.currentTarget.style.color = 'var(--cm-text3)'; }}
      >✕</button>
    </div>
  );
}

export function Field({ label, required, error, hint, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 7 }}>
        <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--cm-text2)', fontFamily: 'var(--cm-font-ui)' }}>
          {label} {required && <span style={{ color: 'var(--cm-red)' }}>*</span>}
        </label>
        {hint && <span style={{ fontSize: 11, color: 'var(--cm-text4)' }}>{hint}</span>}
      </div>
      {children}
      {error && (
        <div style={{ fontSize: 11.5, color: 'var(--cm-red)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
          ⚠ {error}
        </div>
      )}
    </div>
  );
}

export function Chip({ children, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '9px 13px', borderRadius: 10, cursor: 'pointer',
        fontSize: 13.5, fontFamily: 'var(--cm-font)', transition: 'all .15s',
        fontWeight: selected ? 600 : 400,
        background: selected ? 'var(--cm-accent-soft2)' : 'var(--cm-bg3)',
        color: selected ? 'var(--cm-accent)' : 'var(--cm-text2)',
        boxShadow: selected ? 'inset 0 0 0 1.5px var(--cm-accent)' : 'inset 0 0 0 1px var(--cm-border2)',
      }}
    >
      {children}
    </div>
  );
}

export function ModalActions({ onClose, onSubmit, submitLabel, submitDisabled }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
      <button
        onClick={onClose}
        style={{
          height: 40, padding: '0 20px', background: 'var(--cm-surface)',
          color: 'var(--cm-text2)', border: '1.5px solid var(--cm-border2)',
          borderRadius: 10, fontSize: 13.5, cursor: 'pointer', fontFamily: 'var(--cm-font)', fontWeight: 500,
          transition: 'all .14s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--cm-surface2)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--cm-surface)'; }}
      >Cancel</button>
      <button
        onClick={onSubmit}
        disabled={submitDisabled}
        style={{
          height: 40, padding: '0 24px',
          background: submitDisabled ? 'var(--cm-surface2)' : 'var(--cm-grad-accent)',
          color: submitDisabled ? 'var(--cm-text4)' : '#fff',
          border: 'none', borderRadius: 10, fontSize: 13.5, fontWeight: 700,
          cursor: submitDisabled ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--cm-font)',
          boxShadow: submitDisabled ? 'none' : 'var(--cm-shadow-accent)',
          opacity: submitDisabled ? 0.55 : 1,
          transition: 'all .2s',
        }}
        onMouseEnter={e => { if (!submitDisabled) { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
        onMouseLeave={e => { e.currentTarget.style.opacity = submitDisabled ? '0.55' : '1'; e.currentTarget.style.transform = 'none'; }}
      >{submitLabel}</button>
    </div>
  );
}

export const inputStyle = {
  width: '100%', height: 42, background: 'var(--cm-bg3)',
  border: '1.5px solid var(--cm-border2)', borderRadius: 10,
  padding: '0 14px', color: 'var(--cm-text)', fontSize: 13.5,
  fontFamily: 'var(--cm-font)', outline: 'none', transition: 'all .18s',
};

export const textareaStyle = {
  width: '100%', background: 'var(--cm-bg3)',
  border: '1.5px solid var(--cm-border2)', borderRadius: 10,
  padding: '11px 14px', color: 'var(--cm-text)', fontSize: 13.5,
  fontFamily: 'var(--cm-font)', outline: 'none', resize: 'vertical',
  lineHeight: 1.65, transition: 'all .18s',
};