// 'use client';
// import { useState } from 'react';

// const REPORT_REASONS = [
//   { id: 'harassment', label: '🚨 Harassment or bullying', sla: '4h SLA' },
//   { id: 'spam', label: '📢 Spam or self-promotion', sla: null },
//   { id: 'adult', label: '🔞 Adult or inappropriate content', sla: null },
//   { id: 'misinfo', label: '⚠️ Misinformation', sla: null },
//   { id: 'vulgarity', label: '🤬 Vulgarity or hate speech', sla: null },
//   { id: 'other', label: '⋯ Other', sla: null },
// ];

// export default function ReportModal({ targetType, targetName, onClose, onSubmit }) {
//   const [reason, setReason] = useState('');
//   const [details, setDetails] = useState('');
//   const [submitted, setSubmitted] = useState(false);

//   const targetLabel =
//     targetType === 'post' ? `Post by ${targetName}` :
//     targetType === 'comment' ? `Comment by ${targetName}` :
//     targetType === 'user' ? `User profile of ${targetName}` :
//     targetName || 'Content';

//   function handleSubmit() {
//     if (!reason) return;
//     onSubmit?.({ targetType, targetName, reason, details });
//     setSubmitted(true);
//     setTimeout(() => onClose(), 1800);
//   }

//   return (
//     <div
//       style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
//       onClick={e => { if (e.target === e.currentTarget) onClose(); }}
//     >
//       <div style={{
//         background: 'var(--cm-bg2)', border: '1px solid var(--cm-border2)', borderRadius: 18,
//         width: '100%', maxWidth: 460, animation: 'cm-scale-in .2s ease both',
//       }}>
//         {/* Header */}
//         <div style={{ padding: '20px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
//           <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--cm-text)' }}>🚩 Report Content</div>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--cm-text3)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>✕</button>
//         </div>

//         <div style={{ padding: '0 22px 22px' }}>
//           {submitted ? (
//             /* Success state */
//             <div style={{ textAlign: 'center', padding: '24px 0' }}>
//               <div style={{ fontSize: 44, marginBottom: 12 }}>✅</div>
//               <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--cm-text)', marginBottom: 6 }}>Report Submitted</div>
//               <div style={{ fontSize: 13, color: 'var(--cm-text3)', lineHeight: 1.6 }}>
//                 We ll review this within 24h.<br />Serious violations are reviewed within 4h.
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* Target info box */}
//               <div style={{
//                 background: 'var(--cm-bg3)', border: '1px solid var(--cm-border)', borderRadius: 10,
//                 padding: '10px 14px', marginBottom: 18, fontSize: 13, color: 'var(--cm-text2)',
//               }}>
//                 <span style={{ color: 'var(--cm-text3)', fontSize: 12 }}>Reporting: </span>
//                 <strong style={{ color: 'var(--cm-text)' }}>{targetLabel}</strong>
//               </div>

//               {/* Reason */}
//               <div style={{ marginBottom: 16 }}>
//                 <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--cm-text2)', marginBottom: 8 }}>
//                   Reason <span style={{ color: 'var(--cm-red)' }}>*</span>
//                 </div>
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//                   {REPORT_REASONS.map(opt => (
//                     <div
//                       key={opt.id}
//                       onClick={() => setReason(opt.id)}
//                       style={{
//                         display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
//                         borderRadius: 9, cursor: 'pointer', transition: 'all .15s',
//                         border: `1px solid ${reason === opt.id ? 'var(--cm-red)' : 'var(--cm-border2)'}`,
//                         background: reason === opt.id ? 'var(--cm-red-soft)' : 'var(--cm-bg3)',
//                       }}
//                     >
//                       {/* Radio dot */}
//                       <div style={{
//                         width: 16, height: 16, borderRadius: '50%', flexShrink: 0, transition: 'all .15s',
//                         border: `2px solid ${reason === opt.id ? 'var(--cm-red)' : 'var(--cm-border2)'}`,
//                         background: reason === opt.id ? 'var(--cm-red)' : 'transparent',
//                         display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       }}>
//                         {reason === opt.id && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
//                       </div>
//                       <span style={{ flex: 1, fontSize: 13, color: reason === opt.id ? 'var(--cm-text)' : 'var(--cm-text2)' }}>
//                         {opt.label}
//                       </span>
//                       {opt.sla && (
//                         <span style={{ fontSize: 10, color: 'var(--cm-red)', fontWeight: 700, background: 'var(--cm-red-soft)', padding: '2px 6px', borderRadius: 6 }}>
//                           {opt.sla}
//                         </span>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Details */}
//               <div style={{ marginBottom: 20 }}>
//                 <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--cm-text2)', display: 'block', marginBottom: 6 }}>
//                   Additional Details <span style={{ color: 'var(--cm-text3)', fontWeight: 400 }}>(optional)</span>
//                   <span style={{ float: 'right', fontWeight: 400, color: 'var(--cm-text3)' }}>{details.length} / 500</span>
//                 </label>
//                 <textarea
//                   value={details}
//                   onChange={e => setDetails(e.target.value.slice(0, 500))}
//                   placeholder="Add any context that will help our moderation team…"
//                   style={{
//                     width: '100%', minHeight: 80, background: 'var(--cm-bg3)', border: '1px solid var(--cm-border2)',
//                     borderRadius: 9, padding: '10px 12px', color: 'var(--cm-text)', fontSize: 13,
//                     fontFamily: 'var(--cm-font)', outline: 'none', resize: 'vertical', lineHeight: 1.6,
//                   }}
//                 />
//               </div>

//               {/* Actions */}
//               <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
//                 <button
//                   onClick={onClose}
//                   style={{ height: 38, padding: '0 18px', background: 'var(--cm-surface)', color: 'var(--cm-text2)', border: '1px solid var(--cm-border2)', borderRadius: 9, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--cm-font)' }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   disabled={!reason}
//                   style={{
//                     height: 38, padding: '0 20px', borderRadius: 9, fontSize: 13, fontWeight: 500,
//                     border: 'none', fontFamily: 'var(--cm-font)', transition: 'all .2s',
//                     cursor: reason ? 'pointer' : 'not-allowed',
//                     background: reason ? 'linear-gradient(135deg,var(--cm-red),#c02030)' : 'var(--cm-surface)',
//                     color: reason ? '#fff' : 'var(--cm-text3)',
//                     opacity: reason ? 1 : 0.5,
//                   }}
//                 >
//                   🚩 Submit Report
//                 </button>
//               </div>

//               <div style={{ marginTop: 12, fontSize: 11, color: 'var(--cm-text3)', textAlign: 'center', lineHeight: 1.6 }}>
//                 Your identity is kept private. Reports are reviewed within 24h.<br />Harassment reports reviewed within 4h.
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
import { useState } from 'react';
import { Overlay, ModalBox, ModalHeader, textareaStyle } from './PostModal';

const REASONS = [
  { id: 'harassment',  label: 'Harassment or bullying',         icon: '🚨', sla: '4h SLA', urgency: true },
  { id: 'spam',        label: 'Spam or self-promotion',          icon: '📢', sla: null,     urgency: false },
  { id: 'adult',       label: 'Adult or inappropriate content',  icon: '🔞', sla: null,     urgency: false },
  { id: 'misinfo',     label: 'Misinformation',                  icon: '⚠️', sla: null,     urgency: false },
  { id: 'vulgarity',   label: 'Vulgarity or hate speech',        icon: '🤬', sla: null,     urgency: false },
  { id: 'other',       label: 'Other',                           icon: '⋯',  sla: null,     urgency: false },
];

export default function ReportModal({ targetType, targetName, onClose, onSubmit }) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const targetLabel =
    targetType === 'post'    ? `Post by ${targetName}` :
    targetType === 'comment' ? `Comment by ${targetName}` :
    targetType === 'user'    ? `User profile of ${targetName}` :
    targetName || 'Content';

  function handleSubmit() {
    if (!reason) return;
    onSubmit?.({ targetType, targetName, reason, details });
    setSubmitted(true);
    setTimeout(() => onClose(), 2000);
  }

  return (
    <Overlay onClose={onClose}>
      <ModalBox maxWidth={460}>
        <ModalHeader title="🚩 Report Content" onClose={onClose} />

        <div style={{ padding: '0 24px 24px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '28px 0 10px' }} className="cm-fade-up">
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: 'var(--cm-green-soft)',
                border: '2px solid var(--cm-green-soft2)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 28, margin: '0 auto 16px',
              }}>✅</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--cm-text)', marginBottom: 8 }}>Report Submitted</div>
              <div style={{ fontSize: 13.5, color: 'var(--cm-text3)', lineHeight: 1.65 }}>
                We'll review within 24h.<br />
                <span style={{ color: 'var(--cm-red)' }}>Serious violations reviewed within 4h.</span>
              </div>
            </div>
          ) : (
            <>
              {/* Target */}
              <div style={{
                background: 'var(--cm-bg3)', border: '1px solid var(--cm-border)',
                borderRadius: 10, padding: '10px 14px', marginBottom: 18,
                fontSize: 13.5, color: 'var(--cm-text2)',
              }}>
                <span style={{ fontSize: 11, color: 'var(--cm-text4)', fontFamily: 'var(--cm-font-ui)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: 2 }}>Reporting</span>
                <strong style={{ color: 'var(--cm-text)' }}>{targetLabel}</strong>
              </div>

              {/* Reasons */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--cm-text2)', marginBottom: 8, fontFamily: 'var(--cm-font-ui)' }}>
                  Reason <span style={{ color: 'var(--cm-red)' }}>*</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {REASONS.map(r => (
                    <div
                      key={r.id}
                      onClick={() => setReason(r.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                        borderRadius: 10, cursor: 'pointer', transition: 'all .14s',
                        background: reason === r.id ? 'var(--cm-red-soft)' : 'var(--cm-bg3)',
                        boxShadow: reason === r.id ? 'inset 0 0 0 1.5px var(--cm-red)' : 'inset 0 0 0 1px var(--cm-border)',
                      }}
                    >
                      {/* Radio */}
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%', flexShrink: 0, transition: 'all .14s',
                        border: `2px solid ${reason === r.id ? 'var(--cm-red)' : 'var(--cm-border3)'}`,
                        background: reason === r.id ? 'var(--cm-red)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {reason === r.id && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                      </div>

                      <span style={{ fontSize: 15, flexShrink: 0 }}>{r.icon}</span>

                      <span style={{
                        flex: 1, fontSize: 13.5,
                        color: reason === r.id ? 'var(--cm-text)' : 'var(--cm-text2)',
                        fontWeight: reason === r.id ? 600 : 400,
                      }}>{r.label}</span>

                      {r.sla && (
                        <span style={{
                          fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                          background: 'var(--cm-red-soft2)', color: 'var(--cm-red)',
                          fontFamily: 'var(--cm-font-ui)', flexShrink: 0,
                        }}>{r.sla}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--cm-text2)', fontFamily: 'var(--cm-font-ui)' }}>
                    Additional Details <span style={{ color: 'var(--cm-text4)', fontWeight: 400 }}>(optional)</span>
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--cm-text4)' }}>{details.length} / 500</span>
                </div>
                <textarea
                  value={details}
                  onChange={e => setDetails(e.target.value.slice(0, 500))}
                  placeholder="Add context to help our moderation team…"
                  style={{ ...textareaStyle, minHeight: 80 }}
                  onFocus={e => { e.target.style.borderColor = 'var(--cm-accent)'; e.target.style.boxShadow = '0 0 0 3px var(--cm-accent-soft)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--cm-border2)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={onClose} style={{
                  height: 40, padding: '0 20px', background: 'var(--cm-surface)',
                  color: 'var(--cm-text2)', border: '1.5px solid var(--cm-border2)',
                  borderRadius: 10, fontSize: 13.5, cursor: 'pointer', fontFamily: 'var(--cm-font)', fontWeight: 500,
                }}>Cancel</button>
                <button
                  onClick={handleSubmit}
                  disabled={!reason}
                  style={{
                    height: 40, padding: '0 22px', borderRadius: 10, fontSize: 13.5, fontWeight: 700,
                    border: 'none', fontFamily: 'var(--cm-font)', transition: 'all .18s',
                    cursor: reason ? 'pointer' : 'not-allowed',
                    background: reason ? 'var(--cm-grad-live)' : 'var(--cm-surface2)',
                    color: reason ? '#fff' : 'var(--cm-text4)',
                    opacity: reason ? 1 : 0.5,
                    boxShadow: reason ? '0 4px 16px rgba(224,43,75,0.28)' : 'none',
                  }}
                  onMouseEnter={e => { if (reason) { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = reason ? '1' : '0.5'; e.currentTarget.style.transform = 'none'; }}
                >🚩 Submit Report</button>
              </div>

              <div style={{ marginTop: 14, fontSize: 11.5, color: 'var(--cm-text4)', textAlign: 'center', lineHeight: 1.6 }}>
                Your identity is kept private · Reports reviewed within 24h<br />Harassment reports reviewed within 4h
              </div>
            </>
          )}
        </div>
      </ModalBox>
    </Overlay>
  );
}