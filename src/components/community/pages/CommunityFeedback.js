// // // 'use client';
// // // import { useState } from 'react';
// // // import { FEEDBACK_TABS, MOCK_FEEDBACK_SUBMISSIONS } from '@/constants/community';

// // // export default function CommunityFeedback({ onProfileClick, onOpenSubmitModal }) {
// // //   const [activeTab, setActiveTab] = useState('reel');

// // //   const filtered = activeTab === 'mine'
// // //     ? MOCK_FEEDBACK_SUBMISSIONS.filter((_, i) => i === 0)
// // //     : MOCK_FEEDBACK_SUBMISSIONS.filter(s => s.contentType === activeTab || activeTab === 'reel');

// // //   return (
// // //     <div style={{ display: 'grid', gridTemplateColumns: '1fr 288px', minHeight: 'calc(100vh - 56px)' }}>
// // //       {/* Main */}
// // //       <div style={{ borderRight: '1px solid var(--cm-border)' }}>
// // //         {/* Tabs */}
// // //         <div style={{
// // //           display: 'flex', borderBottom: '1px solid var(--cm-border)', background: 'var(--cm-bg2)',
// // //           padding: '0 20px', gap: 0, position: 'sticky', top: 'var(--cm-topbar-h)', zIndex: 30, overflowX: 'auto',
// // //         }}>
// // //           {FEEDBACK_TABS.map(tab => (
// // //             <div
// // //               key={tab.id}
// // //               onClick={() => setActiveTab(tab.id)}
// // //               style={{
// // //                 padding: '14px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
// // //                 display: 'flex', alignItems: 'center', gap: 6,
// // //                 color: activeTab === tab.id ? 'var(--cm-accent2)' : 'var(--cm-text3)',
// // //                 borderBottom: `2px solid ${activeTab === tab.id ? 'var(--cm-accent2)' : 'transparent'}`,
// // //                 transition: 'all .15s',
// // //               }}
// // //             >
// // //               {tab.label}
// // //               {tab.count !== null && (
// // //                 <span style={{
// // //                   fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10,
// // //                   background: activeTab === tab.id ? 'var(--cm-accent-soft)' : 'var(--cm-surface2)',
// // //                   color: activeTab === tab.id ? 'var(--cm-accent2)' : 'var(--cm-text3)',
// // //                 }}>
// // //                   {tab.count}
// // //                 </span>
// // //               )}
// // //             </div>
// // //           ))}
// // //         </div>

// // //         {/* Submissions */}
// // //         <div style={{ padding: '16px 20px' }}>
// // //           {filtered.map((sub, i) => (
// // //             <div key={sub.id} className={`cm-fade-in cm-fade-in-${i+1}`}>
// // //               <SubmissionCard sub={sub} onProfileClick={onProfileClick} />
// // //             </div>
// // //           ))}
// // //           {filtered.length === 0 && (
// // //             <div style={{ padding: '60px 20px', textAlign: 'center' }}>
// // //               <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>◎</div>
// // //               <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--cm-text)', marginBottom: 8 }}>No submissions yet</div>
// // //               <div style={{ fontSize: 13, color: 'var(--cm-text3)', lineHeight: 1.6, maxWidth: 300, margin: '0 auto 20px' }}>
// // //                 Be the first to submit your content for peer review and mentor feedback.
// // //               </div>
// // //               <button
// // //                 onClick={onOpenSubmitModal}
// // //                 style={{
// // //                   display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 20px', height: 38,
// // //                   borderRadius: 9, background: 'linear-gradient(135deg,var(--cm-accent),#c0306a)',
// // //                   color: '#fff', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'var(--cm-font)',
// // //                 }}
// // //               >
// // //                 + Submit for Review
// // //               </button>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* Right Rail */}
// // //       <FeedbackRail onOpenSubmitModal={onOpenSubmitModal} onProfileClick={onProfileClick} />
// // //     </div>
// // //   );
// // // }

// // // function SubmissionCard({ sub, onProfileClick }) {
// // //   const [checklist, setChecklist] = useState(sub.checklist || {});
// // //   const [expanded, setExpanded] = useState(true);

// // //   const CHECKLIST_ITEMS = [
// // //     { key: 'hook', label: 'Hook (first 3 seconds)' },
// // //     { key: 'pacing', label: 'Pacing & editing rhythm' },
// // //     { key: 'audio', label: 'Audio quality & clarity' },
// // //     { key: 'captions', label: 'Captions & text overlays' },
// // //     { key: 'visualQuality', label: 'Visual quality & framing' },
// // //   ];

// // //   return (
// // //     <div style={{
// // //       background: 'var(--cm-bg2)', border: '1px solid var(--cm-border)', borderRadius: 'var(--cm-radius-lg)',
// // //       padding: 18, marginBottom: 14, transition: 'all .2s',
// // //     }}>
// // //       {/* Header */}
// // //       <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
// // //         <div
// // //           onClick={() => onProfileClick?.(sub.authorId, sub.authorName)}
// // //           style={{
// // //             width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
// // //             background: sub.authorGradient, display: 'flex', alignItems: 'center',
// // //             justifyContent: 'center', fontSize: 15, fontWeight: 600, color: '#fff', cursor: 'pointer',
// // //           }}
// // //         >
// // //           {sub.authorInitial}
// // //         </div>
// // //         <div style={{ flex: 1, minWidth: 0 }}>
// // //           <span
// // //             onClick={() => onProfileClick?.(sub.authorId, sub.authorName)}
// // //             style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--cm-text)', cursor: 'pointer' }}
// // //             onMouseEnter={e => { e.currentTarget.style.color = 'var(--cm-accent2)'; e.currentTarget.style.textDecoration = 'underline'; }}
// // //             onMouseLeave={e => { e.currentTarget.style.color = 'var(--cm-text)'; e.currentTarget.style.textDecoration = 'none'; }}
// // //           >
// // //             {sub.authorName}
// // //           </span>
// // //           <div style={{ fontSize: 11, color: 'var(--cm-text3)', marginTop: 1 }}>{sub.authorNiche}</div>
// // //         </div>
// // //         {/* Content type badge */}
// // //         <span style={{
// // //           display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20,
// // //           fontSize: 11, fontWeight: 500, background: 'var(--cm-surface2)',
// // //           color: sub.contentTypeColor, border: `1px solid ${sub.contentTypeColor}30`,
// // //         }}>
// // //           {sub.contentTypeLabel}
// // //         </span>
// // //         {/* Status badge */}
// // //         <span style={{
// // //           display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20,
// // //           fontSize: 11, fontWeight: 600, background: sub.statusBg, color: sub.statusColor,
// // //         }}>
// // //           {sub.statusLabel}
// // //         </span>
// // //       </div>

// // //       {/* Title */}
// // //       <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--cm-text)', marginBottom: 10 }}>{sub.title}</div>

// // //       {/* Script excerpt */}
// // //       {sub.scriptExcerpt && (
// // //         <div style={{
// // //           background: 'var(--cm-bg3)', borderRadius: 8, padding: '10px 12px', marginBottom: 12,
// // //           fontFamily: 'monospace', fontSize: 12, color: 'var(--cm-text2)', lineHeight: 1.7,
// // //           maxHeight: 100, overflow: 'hidden', whiteSpace: 'pre-line',
// // //         }}>
// // //           {sub.scriptExcerpt}
// // //         </div>
// // //       )}

// // //       {/* Objective */}
// // //       <div style={{
// // //         padding: '10px 12px', borderLeft: '3px solid var(--cm-accent)',
// // //         background: 'var(--cm-accent-soft)', borderRadius: '0 8px 8px 0',
// // //         fontSize: 13, fontStyle: 'italic', color: 'var(--cm-text2)', marginBottom: 12, lineHeight: 1.55,
// // //       }}>
// // //         "{sub.objective}"
// // //       </div>

// // //       {/* Mentor + peer count */}
// // //       <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, fontSize: 12.5, color: 'var(--cm-text3)' }}>
// // //         <span>💬 {sub.peerReviewCount} peer review{sub.peerReviewCount !== 1 ? 's' : ''}</span>
// // //         {sub.mentorAssigned && (
// // //           <span style={{ color: 'var(--cm-purple)' }}>👨‍🏫 Mentor: {sub.mentorAssigned}</span>
// // //         )}
// // //       </div>

// // //       {/* Brand Readiness Panel */}
// // //       {sub.contentType === 'brand' && (
// // //         <BrandReadinessPanel data={sub.brandReadiness} />
// // //       )}

// // //       {/* Checklist */}
// // //       <div style={{ marginBottom: 14 }}>
// // //         <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cm-text3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8, fontFamily: 'var(--cm-font-ui)' }}>
// // //           Review Checklist
// // //         </div>
// // //         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
// // //           {CHECKLIST_ITEMS.map(item => (
// // //             <div
// // //               key={item.key}
// // //               onClick={() => setChecklist(c => ({ ...c, [item.key]: !c[item.key] }))}
// // //               style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--cm-text2)', cursor: 'pointer', padding: '4px 0' }}
// // //             >
// // //               <div style={{
// // //                 width: 16, height: 16, borderRadius: 4, border: `2px solid ${checklist[item.key] ? 'var(--cm-green)' : 'var(--cm-border2)'}`,
// // //                 background: checklist[item.key] ? 'var(--cm-green-soft)' : 'transparent',
// // //                 display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .15s',
// // //                 fontSize: 9, color: 'var(--cm-green)',
// // //               }}>
// // //                 {checklist[item.key] && '✓'}
// // //               </div>
// // //               {item.label}
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       {/* Comments */}
// // //       {sub.comments?.length > 0 && (
// // //         <div style={{ marginBottom: 14, borderTop: '1px solid var(--cm-border)', paddingTop: 12 }}>
// // //           <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cm-text3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10, fontFamily: 'var(--cm-font-ui)' }}>Feedback Thread</div>
// // //           {sub.comments.map((c, i) => (
// // //             <CommentItem key={i} comment={c} onProfileClick={onProfileClick} />
// // //           ))}
// // //           <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
// // //             <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#e0488a,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#fff', flexShrink: 0 }}>P</div>
// // //             <input placeholder="Add your feedback…" style={{
// // //               flex: 1, height: 32, background: 'var(--cm-bg3)', border: '1px solid var(--cm-border2)',
// // //               borderRadius: 8, padding: '0 12px', color: 'var(--cm-text)', fontSize: 12,
// // //               fontFamily: 'var(--cm-font)', outline: 'none',
// // //             }} />
// // //             <button style={{ height: 32, padding: '0 12px', background: 'linear-gradient(135deg,var(--cm-accent),#c0306a)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--cm-font)' }}>Send</button>
// // //           </div>
// // //         </div>
// // //       )}

// // //       <button style={{
// // //         width: '100%', height: 38, background: 'linear-gradient(135deg,var(--cm-accent),#c0306a)',
// // //         color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 500,
// // //         cursor: 'pointer', fontFamily: 'var(--cm-font)',
// // //       }}>
// // //         Give Structured Feedback →
// // //       </button>
// // //     </div>
// // //   );
// // // }

// // // function BrandReadinessPanel({ data }) {
// // //   if (!data) {
// // //     return (
// // //       <div style={{
// // //         display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', marginBottom: 14,
// // //         background: 'var(--cm-bg3)', borderRadius: 10, border: '1px solid var(--cm-border)',
// // //       }}>
// // //         <span style={{ fontSize: 18 }}>⏳</span>
// // //         <div>
// // //           <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cm-text)' }}>Pending Mentor Review</div>
// // //           <div style={{ fontSize: 11, color: 'var(--cm-text3)', marginTop: 2 }}>Brand-readiness scores appear after mentor evaluates</div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }
// // //   return (
// // //     <div style={{ marginBottom: 14 }}>
// // //       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
// // //         {[
// // //           { label: 'Brand-Safe Score', value: data.brandSafeScore, color: 'var(--cm-green)' },
// // //           { label: 'Visual Quality', value: data.visualQualityScore, color: 'var(--cm-accent2)' },
// // //         ].map(score => (
// // //           <div key={score.label} style={{ background: 'var(--cm-bg3)', borderRadius: 10, padding: '12px 14px', border: '1px solid var(--cm-border)' }}>
// // //             <div style={{ fontSize: 11, color: 'var(--cm-text3)', marginBottom: 4 }}>{score.label}</div>
// // //             <div style={{ fontSize: 26, fontWeight: 700, color: score.color, lineHeight: 1 }}>
// // //               {score.value}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--cm-text3)' }}>/100</span>
// // //             </div>
// // //             <div style={{ height: 4, background: 'var(--cm-bg4)', borderRadius: 2, overflow: 'hidden', marginTop: 8 }}>
// // //               <div style={{ height: '100%', borderRadius: 2, width: `${score.value}%`, background: score.color, transition: 'width .5s ease' }} />
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>
// // //       <div style={{
// // //         display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
// // //         background: data.readyToPitch ? 'var(--cm-green-soft)' : 'var(--cm-red-soft)',
// // //         border: `1px solid ${data.readyToPitch ? 'rgba(15,217,122,0.2)' : 'rgba(240,60,90,0.2)'}`,
// // //         borderRadius: 10,
// // //       }}>
// // //         <span style={{ fontSize: 20 }}>{data.readyToPitch ? '✅' : '❌'}</span>
// // //         <div>
// // //           <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cm-text)' }}>{data.readyToPitch ? 'Ready to Pitch' : 'Not Ready Yet'}</div>
// // //           <div style={{ fontSize: 11, color: 'var(--cm-text3)', marginTop: 1 }}>
// // //             {data.readyToPitch ? 'Eligible for brand matching in marketplace' : 'Complete checklist improvements first'}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // function CommentItem({ comment, onProfileClick }) {
// // //   return (
// // //     <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
// // //       <div style={{ width: 32, height: 32, borderRadius: '50%', background: comment.authorGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#fff', flexShrink: 0 }}>
// // //         {comment.authorInitial}
// // //       </div>
// // //       <div style={{ flex: 1, background: 'var(--cm-bg3)', borderRadius: 10, padding: '10px 12px', border: `1px solid ${comment.isMentor ? 'rgba(168,85,247,0.2)' : 'var(--cm-border)'}` }}>
// // //         <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--cm-text)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
// // //           <span
// // //             onClick={() => onProfileClick?.(comment.authorId, comment.authorName)}
// // //             style={{ cursor: 'pointer' }}
// // //             onMouseEnter={e => e.currentTarget.style.color = 'var(--cm-accent2)'}
// // //             onMouseLeave={e => e.currentTarget.style.color = 'var(--cm-text)'}
// // //           >{comment.authorName}</span>
// // //           {comment.isMentor && (
// // //             <span style={{ background: 'var(--cm-purple-soft)', color: 'var(--cm-purple)', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>👨‍🏫 MENTOR</span>
// // //           )}
// // //           <span style={{ fontSize: 10.5, color: 'var(--cm-text3)', fontWeight: 400, marginLeft: 'auto' }}>{comment.time}</span>
// // //         </div>
// // //         <div style={{ fontSize: 13, color: 'var(--cm-text2)', lineHeight: 1.55 }}>{comment.text}</div>
// // //         <div style={{ display: 'flex', gap: 10, marginTop: 8, fontSize: 11.5, color: 'var(--cm-text3)' }}>
// // //           <span style={{ cursor: 'pointer' }}>👍 {comment.likes}</span>
// // //           <span style={{ cursor: 'pointer' }}>Reply</span>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // function FeedbackRail({ onOpenSubmitModal, onProfileClick }) {
// // //   return (
// // //     <div style={{ padding: '20px 16px', background: 'var(--cm-bg2)' }}>
// // //       {/* Guidelines */}
// // //       <div style={{ marginBottom: 22 }}>
// // //         <RailTitle title="📜 Feedback Guidelines" />
// // //         <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
// // //           {[
// // //             { ok: true, text: 'Be specific — mention timestamps' },
// // //             { ok: true, text: 'Suggest improvements, not just problems' },
// // //             { ok: true, text: 'Address what the creator asked' },
// // //             { ok: false, text: 'No "Nice reel bro" generic praise' },
// // //             { ok: false, text: 'No personal links or channel promotion' },
// // //           ].map((rule, i) => (
// // //             <div key={i} style={{
// // //               padding: '7px 10px', background: 'var(--cm-bg3)', borderRadius: 8,
// // //               borderLeft: `3px solid ${rule.ok ? 'var(--cm-green)' : 'var(--cm-red)'}`,
// // //               fontSize: 12, color: 'var(--cm-text2)',
// // //             }}>
// // //               {rule.ok ? '✓' : '✗'} {rule.text}
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       {/* Mentors Online */}
// // //       <div style={{ marginBottom: 22 }}>
// // //         <RailTitle title="👨‍🏫 Verified Mentors Online" />
// // //         <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
// // //           {[
// // //             { name: 'Kavya Reddy', initial: 'K', gradient: 'linear-gradient(135deg,#6366f1,#a855f7)', status: '🟢 Online · Brand & Growth', online: true },
// // //             { name: 'Arjun Mehta', initial: 'A', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)', status: '⚫ Busy · 2 active reviews', online: false },
// // //           ].map((m, i) => (
// // //             <div key={i} style={{
// // //               display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderRadius: 8,
// // //               background: m.online ? 'var(--cm-green-soft)' : 'var(--cm-bg3)',
// // //               border: m.online ? '1px solid rgba(15,217,122,0.15)' : 'none',
// // //             }}>
// // //               <div style={{ width: 32, height: 32, borderRadius: '50%', background: m.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: '#fff', flexShrink: 0 }}>{m.initial}</div>
// // //               <div>
// // //                 <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--cm-text)' }}>{m.name}</div>
// // //                 <div style={{ fontSize: 11, color: m.online ? 'var(--cm-green)' : 'var(--cm-text3)' }}>{m.status}</div>
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       {/* Top Reviewers */}
// // //       <div style={{ marginBottom: 20 }}>
// // //         <RailTitle title="🏆 Top Reviewers This Week" />
// // //         {[
// // //           { name: 'Priya Sharma', count: '14 reviews', id: 'priya_sharma' },
// // //           { name: 'Vikram D.', count: '11 reviews', id: 'vikram' },
// // //           { name: 'Meera Iyer', count: '9 reviews', id: 'meera' },
// // //         ].map((r, i) => (
// // //           <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: i < 2 ? '1px solid var(--cm-border)' : 'none' }}>
// // //             <span style={{ fontSize: 11, fontWeight: 700, color: ['var(--cm-gold)', '#94a3b8', '#cd7c2e'][i], width: 16, textAlign: 'center' }}>{i+1}</span>
// // //             <div
// // //               onClick={() => onProfileClick?.(r.id, r.name)}
// // //               style={{ flex: 1, fontSize: 12.5, color: 'var(--cm-text)', cursor: 'pointer' }}
// // //               onMouseEnter={e => e.currentTarget.style.color = 'var(--cm-accent2)'}
// // //               onMouseLeave={e => e.currentTarget.style.color = 'var(--cm-text)'}
// // //             >{r.name}</div>
// // //             <span style={{ fontSize: 11, color: 'var(--cm-text3)' }}>{r.count}</span>
// // //           </div>
// // //         ))}
// // //       </div>

// // //       <button
// // //         onClick={onOpenSubmitModal}
// // //         style={{
// // //           width: '100%', height: 38, background: 'linear-gradient(135deg,var(--cm-accent),#c0306a)',
// // //           color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 500,
// // //           cursor: 'pointer', fontFamily: 'var(--cm-font)',
// // //         }}
// // //       >
// // //         + Submit for Review
// // //       </button>
// // //     </div>
// // //   );
// // // }

// // // function RailTitle({ title }) {
// // //   return (
// // //     <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cm-text3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10, fontFamily: 'var(--cm-font-ui)' }}>
// // //       {title}
// // //     </div>
// // //   );
// // // }

// // 'use client';
// // import { useState } from 'react';
// // import { FEEDBACK_TABS, MOCK_FEEDBACK_SUBMISSIONS } from '@/constants/community';

// // export default function CommunityFeedback({ onProfileClick, onOpenSubmitModal }) {
// //   const [tab, setTab] = useState('reel');
// //   const filtered = tab === 'mine' ? MOCK_FEEDBACK_SUBMISSIONS.slice(0, 1) : MOCK_FEEDBACK_SUBMISSIONS;

// //   return (
// //     <div style={{ display: 'grid', gridTemplateColumns: '1fr 276px', minHeight: 'calc(100vh - var(--cm-topbar-h))' }}>
// //       <div style={{ borderRight: '1px solid var(--cm-border)' }}>
// //         {/* Tabs */}
// //         <div style={{ display: 'flex', background: 'var(--cm-bg2)', borderBottom: '1px solid var(--cm-border)', padding: '0 24px', overflowX: 'auto', position: 'sticky', top: 'var(--cm-topbar-h)', zIndex: 30 }}>
// //           {FEEDBACK_TABS.map(t => (
// //             <div key={t.id} onClick={() => setTab(t.id)} style={{
// //               padding: '15px 14px', fontSize: 13.5, fontWeight: tab === t.id ? 600 : 400,
// //               cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s',
// //               color: tab === t.id ? 'var(--cm-accent)' : 'var(--cm-text3)',
// //               borderBottom: `2.5px solid ${tab === t.id ? 'var(--cm-accent)' : 'transparent'}`,
// //               display: 'flex', alignItems: 'center', gap: 7,
// //             }}>{t.label}
// //               {t.count !== null && (
// //                 <span style={{
// //                   fontSize: 10.5, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
// //                   background: tab === t.id ? 'var(--cm-accent-soft2)' : 'var(--cm-surface2)',
// //                   color: tab === t.id ? 'var(--cm-accent)' : 'var(--cm-text3)',
// //                 }}>{t.count}</span>
// //               )}
// //             </div>
// //           ))}
// //         </div>

// //         <div style={{ padding: '20px 24px' }}>
// //           {filtered.map((sub, i) => (
// //             <div key={sub.id} className={`cm-fade-up cm-fade-up-${i+1}`}>
// //               <SubmissionCard sub={sub} onProfileClick={onProfileClick} />
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       <FeedbackRail onOpenSubmitModal={onOpenSubmitModal} onProfileClick={onProfileClick} />
// //     </div>
// //   );
// // }

// // function SubmissionCard({ sub, onProfileClick }) {
// //   const [checklist, setChecklist] = useState(sub.checklist || {});
// //   const CHECK = [
// //     { key: 'hook', label: 'Hook (first 3 sec)' },
// //     { key: 'pacing', label: 'Pacing & rhythm' },
// //     { key: 'audio', label: 'Audio quality' },
// //     { key: 'captions', label: 'Captions & text' },
// //     { key: 'visualQuality', label: 'Visual quality' },
// //   ];

// //   return (
// //     <div style={{
// //       background: 'var(--cm-bg2)', border: '1.5px solid var(--cm-border)',
// //       borderRadius: 'var(--cm-radius-lg)', padding: '20px 22px', marginBottom: 16,
// //       transition: 'box-shadow .2s',
// //     }}
// //     onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--cm-shadow-sm)'}
// //     onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
// //     >
// //       {/* Header */}
// //       <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
// //         <div onClick={() => onProfileClick?.(sub.authorId, sub.authorName)} style={{
// //           width: 40, height: 40, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
// //           background: sub.authorGradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
// //           fontSize: 15, fontWeight: 700, color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
// //         }}>{sub.authorInitial}</div>
// //         <div style={{ flex: 1 }}>
// //           <span onClick={() => onProfileClick?.(sub.authorId, sub.authorName)} style={{ fontSize: 14, fontWeight: 700, color: 'var(--cm-text)', cursor: 'pointer', transition: 'color .12s' }}
// //           onMouseEnter={e => e.currentTarget.style.color = 'var(--cm-accent)'}
// //           onMouseLeave={e => e.currentTarget.style.color = 'var(--cm-text)'}
// //           >{sub.authorName}</span>
// //           <div style={{ fontSize: 11.5, color: 'var(--cm-text3)', marginTop: 1 }}>{sub.authorNiche}</div>
// //         </div>
// //         <span style={{
// //           padding: '4px 11px', borderRadius: 20, fontSize: 11.5, fontWeight: 600,
// //           background: 'var(--cm-surface)', color: sub.contentTypeColor,
// //           border: `1.5px solid ${sub.contentTypeColor}30`,
// //         }}>{sub.contentTypeLabel}</span>
// //         <span style={{
// //           padding: '4px 11px', borderRadius: 20, fontSize: 11.5, fontWeight: 700,
// //           background: sub.statusBg, color: sub.statusColor,
// //         }}>{sub.statusLabel}</span>
// //       </div>

// //       {/* Title */}
// //       <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--cm-text)', marginBottom: 12, fontFamily: 'var(--cm-font-display)' }}>{sub.title}</div>

// //       {/* Script excerpt */}
// //       {sub.scriptExcerpt && (
// //         <div style={{
// //           background: 'var(--cm-bg3)', borderRadius: 10, padding: '11px 14px', marginBottom: 14,
// //           fontFamily: 'monospace', fontSize: 12.5, color: 'var(--cm-text2)', lineHeight: 1.7,
// //           maxHeight: 100, overflow: 'hidden', whiteSpace: 'pre-line', border: '1px solid var(--cm-border2)',
// //         }}>{sub.scriptExcerpt}</div>
// //       )}

// //       {/* Objective */}
// //       <div style={{
// //         padding: '12px 16px', borderLeft: '3.5px solid var(--cm-accent)',
// //         background: 'var(--cm-accent-soft)', borderRadius: '0 10px 10px 0',
// //         fontSize: 13.5, fontStyle: 'italic', color: 'var(--cm-text2)', lineHeight: 1.65, marginBottom: 14,
// //       }}>"{sub.objective}"</div>

// //       {/* Peer + mentor count */}
// //       <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 12.5, color: 'var(--cm-text3)' }}>
// //         <span>💬 {sub.peerReviewCount} peer reviews</span>
// //         {sub.mentorAssigned && <span style={{ color: 'var(--cm-purple)', fontWeight: 500 }}>👨‍🏫 {sub.mentorAssigned}</span>}
// //       </div>

// //       {/* Brand Readiness */}
// //       {sub.contentType === 'brand' && <BrandReadiness data={sub.brandReadiness} />}

// //       {/* Checklist */}
// //       <div style={{ marginBottom: 16 }}>
// //         <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cm-text3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10, fontFamily: 'var(--cm-font-ui)' }}>Review Checklist</div>
// //         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
// //           {CHECK.map(item => (
// //             <div key={item.key} onClick={() => setChecklist(c => ({ ...c, [item.key]: !c[item.key] }))}
// //               style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 0', fontSize: 13, color: 'var(--cm-text2)' }}>
// //               <div style={{
// //                 width: 18, height: 18, borderRadius: 5, flexShrink: 0, transition: 'all .15s',
// //                 border: `2px solid ${checklist[item.key] ? 'var(--cm-green)' : 'var(--cm-border3)'}`,
// //                 background: checklist[item.key] ? 'var(--cm-green)' : 'transparent',
// //                 display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff',
// //               }}>{checklist[item.key] && '✓'}</div>
// //               {item.label}
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Comments */}
// //       {sub.comments?.length > 0 && (
// //         <div style={{ borderTop: '1px solid var(--cm-border)', paddingTop: 14, marginBottom: 14 }}>
// //           <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cm-text3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10, fontFamily: 'var(--cm-font-ui)' }}>Feedback Thread</div>
// //           {sub.comments.map((c, i) => (
// //             <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
// //               <div style={{ width: 30, height: 30, borderRadius: '50%', background: c.authorGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{c.authorInitial}</div>
// //               <div style={{
// //                 flex: 1, background: c.isMentor ? 'rgba(124,58,237,0.04)' : 'var(--cm-bg3)',
// //                 borderRadius: 10, padding: '10px 13px',
// //                 border: `1px solid ${c.isMentor ? 'rgba(124,58,237,0.15)' : 'var(--cm-border)'}`,
// //               }}>
// //                 <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
// //                   <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--cm-text)' }}>{c.authorName}</span>
// //                   {c.isMentor && <span style={{ fontSize: 9.5, fontWeight: 700, background: 'var(--cm-purple-soft)', color: 'var(--cm-purple)', padding: '2px 8px', borderRadius: 10 }}>👨‍🏫 MENTOR</span>}
// //                   <span style={{ fontSize: 11, color: 'var(--cm-text4)', marginLeft: 'auto' }}>{c.time}</span>
// //                 </div>
// //                 <div style={{ fontSize: 13.5, color: 'var(--cm-text2)', lineHeight: 1.6 }}>{c.text}</div>
// //               </div>
// //             </div>
// //           ))}
// //           <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
// //             <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--cm-grad-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>P</div>
// //             <input placeholder="Add your feedback…" style={{
// //               flex: 1, height: 34, background: 'var(--cm-bg3)', border: '1.5px solid var(--cm-border2)',
// //               borderRadius: 9, padding: '0 12px', color: 'var(--cm-text)', fontSize: 13,
// //               fontFamily: 'var(--cm-font)', outline: 'none', transition: 'border-color .15s',
// //             }}
// //             onFocus={e => { e.target.style.borderColor = 'var(--cm-accent)'; }}
// //             onBlur={e => { e.target.style.borderColor = 'var(--cm-border2)'; }}
// //             />
// //             <button style={{ height: 34, padding: '0 14px', background: 'var(--cm-grad-accent)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--cm-font)' }}>Send</button>
// //           </div>
// //         </div>
// //       )}

// //       <button style={{
// //         width: '100%', height: 40, background: 'var(--cm-grad-accent)', color: '#fff',
// //         border: 'none', borderRadius: 10, fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
// //         fontFamily: 'var(--cm-font)', boxShadow: 'var(--cm-shadow-accent)', transition: 'opacity .14s',
// //       }}
// //       onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
// //       onMouseLeave={e => e.currentTarget.style.opacity = '1'}
// //       >Give Structured Feedback →</button>
// //     </div>
// //   );
// // }

// // function BrandReadiness({ data }) {
// //   if (!data) {
// //     return (
// //       <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', marginBottom: 16, background: 'var(--cm-surface)', border: '1px solid var(--cm-border2)', borderRadius: 12 }}>
// //         <span style={{ fontSize: 22 }}>⏳</span>
// //         <div>
// //           <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--cm-text)' }}>Pending Mentor Review</div>
// //           <div style={{ fontSize: 12, color: 'var(--cm-text3)', marginTop: 2 }}>Scores appear after mentor evaluates this submission</div>
// //         </div>
// //       </div>
// //     );
// //   }
// //   return (
// //     <div style={{ marginBottom: 16 }}>
// //       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
// //         {[
// //           { label: 'Brand-Safe Score', val: data.brandSafeScore, color: 'var(--cm-green)' },
// //           { label: 'Visual Quality', val: data.visualQualityScore, color: 'var(--cm-accent)' },
// //         ].map(s => (
// //           <div key={s.label} style={{ background: 'var(--cm-bg3)', borderRadius: 12, padding: '14px 16px', border: '1px solid var(--cm-border)' }}>
// //             <div style={{ fontSize: 11.5, color: 'var(--cm-text3)', marginBottom: 6 }}>{s.label}</div>
// //             <div style={{ fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1, fontFamily: 'var(--cm-font-display)' }}>{s.val}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--cm-text3)' }}>/100</span></div>
// //             <div style={{ height: 5, background: 'var(--cm-border2)', borderRadius: 3, marginTop: 10, overflow: 'hidden' }}>
// //               <div style={{ height: '100%', width: `${s.val}%`, background: s.color, borderRadius: 3, transition: 'width .6s ease' }} />
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //       <div style={{
// //         display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderRadius: 12,
// //         background: data.readyToPitch ? 'var(--cm-green-soft2)' : 'var(--cm-red-soft)',
// //         border: `1px solid ${data.readyToPitch ? 'rgba(10,173,101,0.2)' : 'rgba(224,43,75,0.2)'}`,
// //       }}>
// //         <span style={{ fontSize: 22 }}>{data.readyToPitch ? '✅' : '❌'}</span>
// //         <div>
// //           <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--cm-text)' }}>{data.readyToPitch ? 'Ready to Pitch' : 'Not Ready Yet'}</div>
// //           <div style={{ fontSize: 12, color: 'var(--cm-text3)', marginTop: 1 }}>{data.readyToPitch ? 'Eligible for brand matching in marketplace' : 'Complete checklist items to qualify'}</div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function FeedbackRail({ onOpenSubmitModal, onProfileClick }) {
// //   return (
// //     <div style={{ padding: '20px 16px', background: 'var(--cm-bg)' }}>
// //       <Section title="📜 Guidelines">
// //         {[
// //           { ok: true, text: 'Be specific — mention timestamps' },
// //           { ok: true, text: 'Suggest improvements, not just problems' },
// //           { ok: true, text: 'Address what the creator asked' },
// //           { ok: false, text: 'No "Nice reel bro" praise' },
// //           { ok: false, text: 'No personal channel links' },
// //         ].map((r, i) => (
// //           <div key={i} style={{
// //             padding: '8px 11px', background: 'var(--cm-bg2)', borderRadius: 9, marginBottom: 6,
// //             borderLeft: `3px solid ${r.ok ? 'var(--cm-green)' : 'var(--cm-red)'}`,
// //             border: `1px solid ${r.ok ? 'var(--cm-green-soft2)' : 'var(--cm-red-soft)'}`,
// //             borderLeftWidth: 3, fontSize: 12.5, color: 'var(--cm-text2)',
// //           }}>
// //             <span style={{ color: r.ok ? 'var(--cm-green)' : 'var(--cm-red)', fontWeight: 700, marginRight: 5 }}>{r.ok ? '✓' : '✗'}</span>{r.text}
// //           </div>
// //         ))}
// //       </Section>

// //       <Section title="👨‍🏫 Mentors Online">
// //         {[
// //           { name: 'Kavya Reddy', initial: 'K', g: 'linear-gradient(135deg,#6366f1,#a855f7)', status: 'Online', sub: 'Brand & Growth' },
// //           { name: 'Arjun Mehta', initial: 'A', g: 'linear-gradient(135deg,#f59e0b,#ef4444)', status: 'Busy', sub: '2 active reviews' },
// //         ].map((m, i) => (
// //           <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 10, marginBottom: 7, background: m.status === 'Online' ? 'var(--cm-green-soft)' : 'var(--cm-bg3)', border: `1px solid ${m.status === 'Online' ? 'rgba(10,173,101,0.15)' : 'var(--cm-border)'}` }}>
// //             <div style={{ width: 32, height: 32, borderRadius: '50%', background: m.g, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{m.initial}</div>
// //             <div>
// //               <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cm-text)' }}>{m.name}</div>
// //               <div style={{ fontSize: 11, color: m.status === 'Online' ? 'var(--cm-green)' : 'var(--cm-text3)' }}>
// //                 <span style={{ marginRight: 5 }}>{m.status === 'Online' ? '🟢' : '⚫'}</span>{m.sub}
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </Section>

// //       <Section title="🏆 Top Reviewers">
// //         {[
// //           { name: 'Priya Sharma', reviews: 14, id: 'priya_sharma' },
// //           { name: 'Vikram D.', reviews: 11, id: 'vikram' },
// //           { name: 'Meera Iyer', reviews: 9, id: 'meera' },
// //         ].map((r, i) => (
// //           <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 0', borderBottom: i < 2 ? '1px solid var(--cm-border)' : 'none' }}>
// //             <span style={{ fontSize: 11, fontWeight: 800, width: 16, color: ['#c98a00','#8b8ca8','#cd7c2e'][i], fontFamily: 'var(--cm-font-ui)' }}>{i+1}</span>
// //             <div onClick={() => onProfileClick?.(r.id, r.name)} style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--cm-text)', cursor: 'pointer', transition: 'color .12s' }}
// //             onMouseEnter={e => e.currentTarget.style.color = 'var(--cm-accent)'}
// //             onMouseLeave={e => e.currentTarget.style.color = 'var(--cm-text)'}
// //             >{r.name}</div>
// //             <span style={{ fontSize: 11.5, color: 'var(--cm-text3)' }}>{r.reviews} reviews</span>
// //           </div>
// //         ))}
// //       </Section>

// //       <button onClick={onOpenSubmitModal} style={{
// //         width: '100%', height: 40, background: 'var(--cm-grad-accent)', color: '#fff',
// //         border: 'none', borderRadius: 10, fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
// //         fontFamily: 'var(--cm-font)', boxShadow: 'var(--cm-shadow-accent)', transition: 'opacity .14s',
// //       }}
// //       onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
// //       onMouseLeave={e => e.currentTarget.style.opacity = '1'}
// //       >+ Submit for Review</button>
// //     </div>
// //   );
// // }

// // function Section({ title, children }) {
// //   return (
// //     <div style={{ marginBottom: 22 }}>
// //       <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cm-text3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10, fontFamily: 'var(--cm-font-ui)' }}>{title}</div>
// //       {children}
// //     </div>
// //   );
// // }

// 'use client';
// // components/community/pages/CommunityFeedback.js
// import { useState, useEffect } from 'react';
// import { useSubmissions } from '@/hooks/useCommunity';
// import { FEEDBACK_TABS } from '@/constants/community';
// import * as svc from '@/services/community.service';
// import { showToast } from '../ui/Toast';

// const CHECKLIST_ITEMS = [
//   { key:'hook',         label:'Strong Hook', sub:'First 3 seconds captivate' },
//   { key:'pacing',       label:'Good Pacing',  sub:'Content flows naturally'   },
//   { key:'audio',        label:'Clear Audio',  sub:'No background noise'       },
//   { key:'captions',     label:'Captions',     sub:'Accurate and readable'     },
//   { key:'visualQuality',label:'Visual Quality',sub:'Clear, well-lit footage'  },
// ];

// const MOCK_SUBS = [
//   { _id:'s1', contentType:'reel', title:'My product review reel — feedback needed', objective:'Check if my hook is strong enough and if the pacing is right for Instagram Reels', tags:['reel','review','instagram'], status:'needs_review', peerCount:2, hasMentor:false, checklist:{ hook:true, pacing:false, audio:true, captions:false, visualQuality:true }, comments:[{ author:{ name:'Rohan Verma', isMentor:false }, text:'Great hook! The transitions could be smoother around the 15-second mark.' }], brandReadiness:null },
//   { _id:'s2', contentType:'thumbnail', title:'Tech unboxing thumbnail A/B test', objective:'Which thumbnail would you click? Looking for honest opinions on color, text placement, and face expression', tags:['thumbnail','youtube','tech'], status:'reviewed', peerCount:7, hasMentor:true, checklist:{ hook:true, pacing:true, audio:true, captions:true, visualQuality:true }, comments:[{ author:{ name:'Arjun Mehta', isMentor:true }, text:'Version B is significantly stronger. The contrast is better and your expression conveys excitement more authentically.' }], brandReadiness:{ brandSafeScore:88, visualQualityScore:82, readyToPitch:true } },
//   { _id:'s3', contentType:'script', title:'Script for brand collaboration pitch video', objective:'Does this script sound natural or too salesy? I want authentic brand integration', tags:['script','brandcol'], status:'mentor_review', peerCount:4, hasMentor:false, checklist:{ hook:false, pacing:true, audio:false, captions:false, visualQuality:false }, comments:[], brandReadiness:null },
// ];

// const BADGE_MAP = { reel:'cm-badge-reel', thumbnail:'cm-badge-thumb', script:'cm-badge-script', brand:'cm-badge-brand' };
// const BADGE_LABEL = { reel:'🎥 Reel', thumbnail:'🖼️ Thumbnail', script:'📝 Script', brand:'🏷️ Brand' };
// const STATUS_MAP = { needs_review:'cm-status-needs', reviewed:'cm-status-reviewed', mentor_review:'cm-status-mentor', brand_ready:'cm-status-brand', pending:'cm-status-pending' };
// const STATUS_LABEL = { needs_review:'Needs Review', reviewed:'Reviewed', mentor_review:'Mentor Review', brand_ready:'Brand Ready', pending:'Pending' };

// export default function CommunityFeedback({ onOpenProfile, onOpenFeedback, showToast: toast }) {
//   const [activeFilter, setActiveFilter] = useState('reel');
//   const [expanded, setExpanded]         = useState(null);
//   const [checklist, setChecklist]       = useState({});
//   const { items, loading }              = useSubmissions(activeFilter);

//   const displayItems = items.length > 0 ? items : MOCK_SUBS.filter(s =>
//     activeFilter === 'all' || s.contentType === activeFilter
//   );

//   function toggleCheck(subId, key) {
//     setChecklist(prev => ({
//       ...prev,
//       [subId]: { ...(prev[subId]||{}), [key]: !(prev[subId]?.[key] ?? false) }
//     }));
//   }

//   async function submitReview(subId) {
//     const cl = checklist[subId] || {};
//     try {
//       await svc.submitReview(subId, { checklist: cl, comment:'' });
//       showToast?.('◎ Review submitted! Thank you for helping a fellow creator.', 'success');
//     } catch(e) {
//       showToast?.('Could not submit review: ' + e.message, 'error');
//     }
//   }

//   return (
//     <div>
//       <div className="cm-topbar">
//         <div className="cm-topbar-title">Feedback & Reviews</div>
//         <button className="cm-btn cm-btn-primary" style={{ marginLeft:'auto' }} onClick={onOpenFeedback}>
//           ◎ Submit for Review
//         </button>
//       </div>

//       <div className="cm-feedback-layout">
//         {/* Main content */}
//         <div style={{ borderRight:'1px solid var(--cm-border)' }}>
//           {/* Filter tabs */}
//           <div className="cm-feedback-tabs">
//             {FEEDBACK_TABS.map(t => (
//               <button key={t.id} className={`cm-feedback-tab${activeFilter===t.id?' active':''}`}
//                 onClick={() => setActiveFilter(t.id)}>
//                 {t.label} {t.count && <span style={{ marginLeft:4, opacity:.7 }}>({t.count})</span>}
//               </button>
//             ))}
//           </div>

//           {/* Submission list */}
//           <div style={{ padding:'16px 20px' }}>
//             {loading ? (
//               [1,2,3].map(i => (
//                 <div key={i} className="cm-skel-card" style={{ marginBottom:12 }}>
//                   <div className="cm-skel" style={{ height:13, width:'30%', marginBottom:8 }} />
//                   <div className="cm-skel" style={{ height:160, marginBottom:12 }} />
//                   <div className="cm-skel" style={{ height:13, width:'80%', marginBottom:6 }} />
//                   <div className="cm-skel" style={{ height:13, width:'60%' }} />
//                 </div>
//               ))
//             ) : displayItems.length === 0 ? (
//               <div className="cm-empty">
//                 <div className="cm-empty-icon">◎</div>
//                 <div className="cm-empty-title">No submissions yet</div>
//                 <div className="cm-empty-sub">Be the first to submit content for peer review!</div>
//                 <button className="cm-btn cm-btn-primary" onClick={onOpenFeedback}>Submit for Review</button>
//               </div>
//             ) : displayItems.map((sub) => {
//               const isExpanded = expanded === sub._id;
//               const myChecklist = checklist[sub._id] || sub.checklist || {};

//               return (
//                 <div key={sub._id} className="cm-submission-card" onClick={() => setExpanded(isExpanded ? null : sub._id)}>
//                   {/* Header */}
//                   <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 }}>
//                     <span className={`cm-content-badge ${BADGE_MAP[sub.contentType]||'cm-badge-reel'}`}>
//                       {BADGE_LABEL[sub.contentType]||'Content'}
//                     </span>
//                     <div style={{ flex:1, minWidth:0 }}>
//                       <div style={{ fontSize:14, fontWeight:600, color:'var(--cm-text)', marginBottom:4 }}>{sub.title}</div>
//                       <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
//                         <span className={`cm-status-badge ${STATUS_MAP[sub.status]||'cm-status-pending'}`}>
//                           {STATUS_LABEL[sub.status]||'Pending'}
//                         </span>
//                         <span style={{ fontSize:11, color:'var(--cm-text3)' }}>👥 {sub.peerCount||0} peer reviews</span>
//                         {sub.hasMentor && <span style={{ fontSize:11, color:'var(--cm-accent2)' }}>🎓 Mentor reviewed</span>}
//                       </div>
//                     </div>
//                     <span style={{ fontSize:18, color:'var(--cm-text3)', transition:'transform .2s', transform:isExpanded?'rotate(180deg)':'none' }}>▾</span>
//                   </div>

//                   {/* Preview area */}
//                   <div style={{ width:'100%', height:120, background:'var(--cm-bg3)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, position:'relative', overflow:'hidden' }}>
//                     <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
//                       <div style={{ width:48, height:48, background:'rgba(255,255,255,.9)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, color:'#000', cursor:'pointer' }}>▶</div>
//                     </div>
//                     <span style={{ fontSize:32, opacity:.3 }}>{sub.contentType==='reel'?'🎥':sub.contentType==='thumbnail'?'🖼️':sub.contentType==='script'?'📝':'🏷️'}</span>
//                   </div>

//                   {/* Objective */}
//                   {sub.objective && (
//                     <div style={{ background:'var(--cm-surface)', borderLeft:'3px solid var(--cm-accent)', borderRadius:'0 8px 8px 0', padding:'8px 12px', fontSize:12.5, color:'var(--cm-text2)', fontStyle:'italic', marginBottom:12, lineHeight:1.5 }}>
//                       "{sub.objective}"
//                     </div>
//                   )}

//                   {/* Tags */}
//                   {sub.tags?.length > 0 && (
//                     <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
//                       {sub.tags.map(t => <span key={t} className="cm-tag">#{t}</span>)}
//                     </div>
//                   )}

//                   {/* Expanded: checklist + comments + CTA */}
//                   {isExpanded && (
//                     <div className="cm-fade-up" onClick={e => e.stopPropagation()}>
//                       {/* Checklist */}
//                       <div style={{ fontSize:12, fontWeight:700, color:'var(--cm-text3)', marginBottom:8, textTransform:'uppercase', letterSpacing:'.06em' }}>
//                         Peer Review Checklist
//                       </div>
//                       <div className="cm-checklist">
//                         {CHECKLIST_ITEMS.map(item => {
//                           const checked = myChecklist[item.key] ?? false;
//                           return (
//                             <div key={item.key} className={`cm-check-item${checked?' checked':''}`}
//                               onClick={() => toggleCheck(sub._id, item.key)}>
//                               <div className="cm-check-box">{checked&&'✓'}</div>
//                               <div style={{ flex:1 }}>
//                                 <div className="cm-check-label">{item.label}</div>
//                                 <div style={{ fontSize:11, color:'var(--cm-text3)', marginTop:1 }}>{item.sub}</div>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>

//                       {/* Comments */}
//                       {sub.comments?.length > 0 && (
//                         <div style={{ marginTop:12, paddingTop:12, borderTop:'1px solid var(--cm-border)' }}>
//                           {sub.comments.map((c,i) => (
//                             <div key={i} style={{ display:'flex', gap:10, marginBottom:10 }}>
//                               <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#fff', flexShrink:0 }}>
//                                 {c.author?.name?.[0]||'?'}
//                               </div>
//                               <div style={{ flex:1, background:'var(--cm-bg3)', borderRadius:10, padding:'10px 12px' }}>
//                                 <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
//                                   <span style={{ fontSize:12, fontWeight:600, color:'var(--cm-text)' }}>{c.author?.name}</span>
//                                   {c.author?.isMentor && <span style={{ fontSize:10, background:'var(--cm-accent-soft)', color:'var(--cm-accent2)', padding:'1px 7px', borderRadius:10, fontWeight:700 }}>MENTOR</span>}
//                                 </div>
//                                 <div style={{ fontSize:12.5, color:'var(--cm-text2)', lineHeight:1.5 }}>{c.text||c.comment}</div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}

//                       <button className="cm-btn cm-btn-primary" style={{ width:'100%', marginTop:12, height:40, justifyContent:'center' }}
//                         onClick={() => submitReview(sub._id)}>
//                         ◎ Give Feedback
//                       </button>
//                     </div>
//                   )}

//                   {/* Brand readiness scores */}
//                   {sub.brandReadiness && (
//                     <div style={{ marginTop:12, paddingTop:12, borderTop:'1px solid var(--cm-border)' }}>
//                       <div style={{ fontSize:12, fontWeight:700, color:'var(--cm-gold)', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
//                         🏷️ Brand Readiness Score
//                       </div>
//                       <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
//                         <div style={{ background:'var(--cm-bg3)', borderRadius:8, padding:'10px 12px' }}>
//                           <div style={{ fontSize:10, color:'var(--cm-text3)', marginBottom:4, textTransform:'uppercase', letterSpacing:'.06em' }}>Brand Safe</div>
//                           <div style={{ fontSize:22, fontWeight:700, color:'var(--cm-green)' }}>{sub.brandReadiness.brandSafeScore}</div>
//                           <div style={{ height:3, background:'var(--cm-bg4)', borderRadius:2, marginTop:6, overflow:'hidden' }}>
//                             <div style={{ height:'100%', width:`${sub.brandReadiness.brandSafeScore}%`, background:'var(--cm-green)', borderRadius:2 }} />
//                           </div>
//                         </div>
//                         <div style={{ background:'var(--cm-bg3)', borderRadius:8, padding:'10px 12px' }}>
//                           <div style={{ fontSize:10, color:'var(--cm-text3)', marginBottom:4, textTransform:'uppercase', letterSpacing:'.06em' }}>Visual Quality</div>
//                           <div style={{ fontSize:22, fontWeight:700, color:'var(--cm-green)' }}>{sub.brandReadiness.visualQualityScore}</div>
//                           <div style={{ height:3, background:'var(--cm-bg4)', borderRadius:2, marginTop:6, overflow:'hidden' }}>
//                             <div style={{ height:'100%', width:`${sub.brandReadiness.visualQualityScore}%`, background:'var(--cm-green)', borderRadius:2 }} />
//                           </div>
//                         </div>
//                       </div>
//                       <div style={{ padding:12, borderRadius:8, marginTop:10, display:'flex', alignItems:'center', gap:10, fontSize:13, fontWeight:600, ...(sub.brandReadiness.readyToPitch ? { background:'var(--cm-green-soft)', color:'var(--cm-green)', border:'1px solid rgba(16,185,129,.2)' } : { background:'var(--cm-red-soft)', color:'var(--cm-red)', border:'1px solid rgba(239,68,68,.2)' }) }}>
//                         {sub.brandReadiness.readyToPitch ? '✅ Ready to Pitch to Brands!' : '⚠️ Keep improving before pitching'}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Right rail */}
//         <div style={{ padding:'20px 16px', background:'var(--cm-bg2)' }}>
//           <div style={{ marginBottom:20 }}>
//             <div className="cm-rail-title">Brand Readiness</div>
//             <div style={{ background:'var(--cm-bg3)', borderRadius:10, padding:14, textAlign:'center' }}>
//               <div style={{ fontSize:36, marginBottom:8 }}>🏷️</div>
//               <div style={{ fontSize:13.5, fontWeight:600, color:'var(--cm-text)', marginBottom:6 }}>Get Brand Ready</div>
//               <div style={{ fontSize:12, color:'var(--cm-text3)', lineHeight:1.6, marginBottom:12 }}>Submit your content to get a detailed brand readiness score from our mentor network</div>
//               <button className="cm-btn cm-btn-primary" style={{ width:'100%', justifyContent:'center' }} onClick={onOpenFeedback}>Submit Content</button>
//             </div>
//           </div>

//           <div style={{ marginBottom:20 }}>
//             <div className="cm-rail-title">Guidelines</div>
//             {['Be specific in your feedback','Focus on improvement','Respect creator effort','Check all criteria','Report inappropriate content'].map((g,i) => (
//               <div key={i} style={{ display:'flex', gap:8, padding:'6px 0', borderBottom:'1px solid var(--cm-border)', fontSize:12.5, color:'var(--cm-text2)', lineHeight:1.5 }}>
//                 <span style={{ color:'var(--cm-green)', fontWeight:700, flexShrink:0 }}>✓</span>{g}
//               </div>
//             ))}
//           </div>

//           <div>
//             <div className="cm-rail-title">Mentors Online</div>
//             {[{ name:'Arjun Mehta', niche:'Brand Deals', online:true }, { name:'Kavya Reddy', niche:'Content Strategy', online:true }, { name:'Vikram Shah', niche:'Instagram Growth', online:false }].map((m,i) => (
//               <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid var(--cm-border)' }}>
//                 <div style={{ position:'relative' }}>
//                   <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#f59e0b,#d97706)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff' }}>{m.name[0]}</div>
//                   <div style={{ position:'absolute', bottom:0, right:0, width:8, height:8, borderRadius:'50%', background:m.online?'var(--cm-green)':'var(--cm-text4)', border:'1.5px solid var(--cm-bg2)' }} />
//                 </div>
//                 <div style={{ flex:1 }}>
//                   <div style={{ fontSize:13, fontWeight:500, color:'var(--cm-text)' }}>{m.name}</div>
//                   <div style={{ fontSize:11, color:'var(--cm-text3)' }}>{m.niche}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
// components/community/pages/CommunityFeedback.js
// Spec §3.4 — Feedback & Reviews
// ✅ Brand readiness 3-state panel: no mentor / reviewing / scored (🔧 FIXED)
// ✅ Inline comment thread with reply input (🆕 NEW)
// ✅ Mentor badge on comments (§3.4)
// ✅ Exact 5 feedback guidelines from spec (§3.4)
// ✅ Verified Mentors Online — real-time (§3.4)
// ✅ Comment thread reply flow (§3.4)

import { useState, useEffect } from 'react';
import { FEEDBACK_TABS } from '@/constants/community';
import * as svc from '@/services/community.service';
import { showToast } from '../ui/Toast';
// SAST H-5 (extended). This read localStorage's `fameo_token` — the ADMIN
// key set by adminAuthStore, not the creator session. Regular users sent an
// empty Bearer token; admins leaked their admin JWT to community endpoints.
import { useAuthStore } from '@/store/authStore';

const CHECKLIST_ITEMS = [
  { key:'hook',          label:'Strong Hook',     sub:'First 3 seconds captivate'       },
  { key:'pacing',        label:'Good Pacing',     sub:'Content flows naturally'          },
  { key:'audio',         label:'Clear Audio',     sub:'No distracting background noise'  },
  { key:'captions',      label:'Captions',        sub:'Accurate and readable'            },
  { key:'visualQuality', label:'Visual Quality',  sub:'Clear, well-lit footage'          },
];

const BADGE_MAP   = { reel:'cm-badge-reel', thumbnail:'cm-badge-thumb', script:'cm-badge-script', brand:'cm-badge-brand' };
const BADGE_LABEL = { reel:'🎥 Reel', thumbnail:'🖼️ Thumbnail', script:'📝 Script', brand:'🏷️ Brand' };
const STATUS_MAP  = { needs_review:'cm-status-needs', reviewed:'cm-status-reviewed', mentor_review:'cm-status-mentor', brand_ready:'cm-status-brand', pending:'cm-status-pending' };
const STATUS_LABEL= { needs_review:'Needs Review', reviewed:'Reviewed', mentor_review:'Mentor Review', brand_ready:'Brand Ready', pending:'Pending' };

const MOCK_SUBS = [
  {
    _id:'s1', contentType:'reel',
    title:'My product review reel — is the hook strong enough?',
    objective:'Check if my hook lands in the first 3 seconds. Does the pacing feel right for Instagram? I also want to know if the transitions are smooth.',
    tags:['reel','review','instagram'],
    status:'needs_review', peerCount:2, mentor:null,
    checklist:{ hook:true, pacing:false, audio:true, captions:false, visualQuality:true },
    comments:[
      { _id:'c1', author:{ name:'Rohan Verma',   isMentor:false, niche:'Tech'   }, text:'Great hook! The transitions could be smoother around the 15-second mark. Try the J-cut technique.', createdAt:new Date(Date.now()-7200000) },
    ],
    brandReadiness:null,
    mentorState:'none', // none | reviewing | scored
  },
  {
    _id:'s2', contentType:'thumbnail',
    title:'Tech unboxing thumbnail A/B test — which one would you click?',
    objective:'Which thumbnail would you click? Looking for honest opinions on colour contrast, text placement, and whether my face expression conveys the right energy.',
    tags:['thumbnail','youtube','tech'],
    status:'reviewed', peerCount:7, mentor:{ name:'Arjun Mehta', assigned:true },
    checklist:{ hook:true, pacing:true, audio:true, captions:true, visualQuality:true },
    comments:[
      { _id:'c2', author:{ name:'Meera Iyer', isMentor:false, niche:'Content' }, text:'Version B is stronger. The yellow text pops much better.', createdAt:new Date(Date.now()-86400000) },
      { _id:'c3', author:{ name:'Arjun Mehta', isMentor:true,  niche:'Brand Deals' }, text:'Version B is significantly stronger. The contrast is better and your expression conveys excitement more authentically. The thumbnail text is concise and the color blocking directs attention.', createdAt:new Date(Date.now()-43200000) },
    ],
    brandReadiness:{ brandSafeScore:88, visualQualityScore:82, readyToPitch:true },
    mentorState:'scored',
  },
  {
    _id:'s3', contentType:'script',
    title:'Script for brand collaboration pitch video — too salesy?',
    objective:'Does this script sound natural or too salesy? I want authentic brand integration that doesn\'t feel like an ad.',
    tags:['script','brandcol','pitch'],
    status:'mentor_review', peerCount:4, mentor:{ name:'Kavya Reddy', assigned:true, reviewing:true },
    checklist:{ hook:false, pacing:true, audio:false, captions:false, visualQuality:false },
    comments:[],
    brandReadiness:null,
    mentorState:'reviewing',
  },
];

// §3.4: Exact 5 feedback guidelines from spec
const GUIDELINES = [
  'Be specific with timestamps (e.g. "At 0:12, the cut feels abrupt")',
  'Suggest improvements, not just problems',
  'Address what the creator specifically asked for',
  'No "Nice reel bro" — provide actionable detail',
  'No personal channel links or self-promotion in comments',
];

export default function CommunityFeedback({ onOpenProfile, onOpenFeedback, showToast: toast }) {
  const [activeFilter, setActiveFilter] = useState('reel');
  const [expanded, setExpanded]         = useState(null);
  const [checklist, setChecklist]       = useState({});
  const [replyInputs, setReplyInputs]   = useState({});  // subId → text
  const [mentorsOnline, setMentorsOnline] = useState([]);
  const [topReviewers, setTopReviewers] = useState([]);
  const [items, setItems]               = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    setLoading(true);
    svc.getSubmissions(activeFilter).then(res => {
      const data = Array.isArray(res) ? res : res?.data || [];
      setItems(data.length > 0 ? data : MOCK_SUBS.filter(s =>
        activeFilter === 'mine' ? true : (activeFilter === 'all' || s.contentType === activeFilter)
      ));
      setLoading(false);
    }).catch(() => {
      setItems(MOCK_SUBS.filter(s =>
        activeFilter === 'mine' ? true : (activeFilter === 'all' || s.contentType === activeFilter)
      ));
      setLoading(false);
    });

    // §3.4: Mentors online
    fetch(`${process.env.NEXT_PUBLIC_API_URL||'http://localhost:5000'}/api/feedback/mentors/online`, {
      headers:{ Authorization:`Bearer ${useAuthStore.getState().token || ''}` }
    }).then(r=>r.json()).then(res => {
      setMentorsOnline(Array.isArray(res.data)?res.data:[
        { name:'Arjun Mehta', niche:'Brand Deals',     online:true  },
        { name:'Kavya Reddy', niche:'Content Strategy', online:true  },
        { name:'Vikram Shah', niche:'Instagram Growth', online:false },
      ]);
    }).catch(() => {
      setMentorsOnline([
        { name:'Arjun Mehta', niche:'Brand Deals',     online:true  },
        { name:'Kavya Reddy', niche:'Content Strategy', online:true  },
        { name:'Vikram Shah', niche:'Instagram Growth', online:false },
      ]);
    });
  }, [activeFilter]);

  function toggleCheck(subId, key) {
    setChecklist(prev => ({ ...prev, [subId]:{ ...(prev[subId]||{}), [key]:!(prev[subId]?.[key]??false) } }));
  }

  async function submitReview(subId) {
    const cl = checklist[subId] || {};
    const comment = replyInputs[subId] || '';
    try {
      await svc.submitReview(subId, { checklist:cl, comment });
      showToast?.('◎ Review submitted! Thank you for helping a fellow creator.', 'success');
      setReplyInputs(prev => ({ ...prev, [subId]:'' }));
    } catch(e) {
      showToast?.('Could not submit review: ' + e.message, 'error');
    }
  }

  return (
    <div>
      <div className="cm-topbar">
        <div className="cm-topbar-title">Feedback & Reviews</div>
        <button className="cm-btn cm-btn-primary" style={{ marginLeft:'auto' }} onClick={onOpenFeedback}>
          ◎ Submit for Review
        </button>
      </div>

      <div className="cm-feedback-layout">
        {/* Main column */}
        <div style={{ borderRight:'1px solid var(--cm-border)' }}>
          {/* Filter tabs — 5 types (§3.4) */}
          <div className="cm-feedback-tabs">
            {FEEDBACK_TABS.map(t => (
              <button key={t.id} className={`cm-feedback-tab${activeFilter===t.id?' active':''}`}
                onClick={() => setActiveFilter(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ padding:'16px 20px' }}>
            {loading ? [1,2,3].map(i => (
              <div key={i} className="cm-skel-card" style={{ marginBottom:12 }}>
                <div className="cm-skel" style={{ height:13, width:'30%', marginBottom:8 }} />
                <div className="cm-skel" style={{ height:120, marginBottom:10 }} />
                <div className="cm-skel" style={{ height:13, width:'80%', marginBottom:6 }} />
                <div className="cm-skel" style={{ height:13, width:'60%' }} />
              </div>
            )) : items.length === 0 ? (
              <div className="cm-empty">
                <div className="cm-empty-icon">◎</div>
                <div className="cm-empty-title">No submissions yet</div>
                <div className="cm-empty-sub">Be the first to submit content for peer review!</div>
                <button className="cm-btn cm-btn-primary" onClick={onOpenFeedback}>Submit for Review</button>
              </div>
            ) : items.map(sub => {
              const isExpanded = expanded === sub._id;
              const myChecklist = checklist[sub._id] || sub.checklist || {};
              const replyText   = replyInputs[sub._id] || '';

              return (
                <div key={sub._id} className="cm-submission-card"
                  onClick={() => setExpanded(isExpanded ? null : sub._id)}>

                  {/* Header */}
                  <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 }}>
                    <span className={`cm-content-badge ${BADGE_MAP[sub.contentType]||'cm-badge-reel'}`}>
                      {BADGE_LABEL[sub.contentType]||'Content'}
                    </span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:14, fontWeight:600, color:'var(--cm-text)', marginBottom:4 }}>{sub.title}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                        <span className={`cm-status-badge ${STATUS_MAP[sub.status]||'cm-status-pending'}`}>
                          {STATUS_LABEL[sub.status]||'Pending'}
                        </span>
                        <span style={{ fontSize:11, color:'var(--cm-text3)' }}>
                          👥 {sub.peerCount||0} peer reviews
                        </span>
                        {/* §3.4: Mentor status — only show when assigned */}
                        {sub.mentor?.assigned && (
                          <span style={{ fontSize:11, color:'var(--cm-accent2)' }}>
                            👨‍🏫 Mentor: {sub.mentor.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <span style={{ fontSize:18, color:'var(--cm-text3)', transition:'transform .2s', transform:isExpanded?'rotate(180deg)':'none' }}>▾</span>
                  </div>

                  {/* Media preview */}
                  <div style={{ width:'100%', height:120, background:'var(--cm-bg3)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <div style={{ width:48, height:48, background:'rgba(255,255,255,.9)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, color:'#000' }}>▶</div>
                    </div>
                    <span style={{ fontSize:32, opacity:.3 }}>{sub.contentType==='reel'?'🎥':sub.contentType==='thumbnail'?'🖼️':sub.contentType==='script'?'📝':'🏷️'}</span>
                  </div>

                  {/* §3.4: Objective block — italic, left accent border */}
                  {sub.objective && (
                    <div style={{ background:'var(--cm-surface)', borderLeft:'3px solid var(--cm-accent)', borderRadius:'0 8px 8px 0', padding:'8px 12px', fontSize:12.5, color:'var(--cm-text2)', fontStyle:'italic', marginBottom:12, lineHeight:1.55 }}>
                      "{sub.objective}"
                    </div>
                  )}

                  {/* Tags */}
                  {sub.tags?.length > 0 && (
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
                      {sub.tags.map(t => <span key={t} className="cm-tag">#{t}</span>)}
                    </div>
                  )}

                  {/* ── §3.4 🔧 FIXED: Brand readiness — 3-state panel ── */}
                  {(sub.mentorState === 'none' || !sub.mentor) && (
                    <div style={{ padding:'10px 14px', background:'var(--cm-bg3)', border:'1px solid var(--cm-border)', borderRadius:8, fontSize:12.5, color:'var(--cm-text3)', marginBottom:12 }}>
                      ⏳ Pending Mentor Review — no scores available yet
                    </div>
                  )}
                  {sub.mentorState === 'reviewing' && (
                    <div style={{ padding:'10px 14px', background:'var(--cm-orange-soft)', border:'1px solid rgba(245,158,11,.2)', borderRadius:8, fontSize:12.5, color:'var(--cm-orange)', marginBottom:12 }}>
                      👨‍🏫 Mentor reviewing… scores will appear once submitted
                    </div>
                  )}
                  {sub.mentorState === 'scored' && sub.brandReadiness && (
                    <div style={{ marginBottom:12 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:'var(--cm-gold)', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>🏷️ Brand Readiness Score</div>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                        {[['Brand Safe', sub.brandReadiness.brandSafeScore],['Visual Quality', sub.brandReadiness.visualQualityScore]].map(([l,v]) => (
                          <div key={l} style={{ background:'var(--cm-bg3)', borderRadius:8, padding:'10px 12px' }}>
                            <div style={{ fontSize:10, color:'var(--cm-text3)', marginBottom:4, textTransform:'uppercase', letterSpacing:'.06em' }}>{l}</div>
                            <div style={{ fontSize:22, fontWeight:700, color:'var(--cm-green)' }}>{v}</div>
                            <div style={{ height:3, background:'var(--cm-bg4)', borderRadius:2, marginTop:6, overflow:'hidden' }}>
                              <div style={{ height:'100%', width:`${v}%`, background:'var(--cm-green)' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ padding:10, borderRadius:8, marginTop:10, display:'flex', alignItems:'center', gap:8, fontSize:13, fontWeight:600, ...(sub.brandReadiness.readyToPitch ? { background:'var(--cm-green-soft)', color:'var(--cm-green)', border:'1px solid rgba(16,185,129,.2)' } : { background:'var(--cm-red-soft)', color:'var(--cm-red)', border:'1px solid rgba(239,68,68,.2)' }) }}>
                        {sub.brandReadiness.readyToPitch ? '✅ Ready to Pitch to Brands! · Eligible for brand matching in marketplace' : '❌ Not Ready — see improvement checklist below'}
                      </div>
                    </div>
                  )}

                  {/* ── Expanded: checklist + comment thread + give feedback ── */}
                  {isExpanded && (
                    <div className="cm-fade-up" onClick={e => e.stopPropagation()}>

                      {/* Checklist */}
                      <div style={{ fontSize:12, fontWeight:700, color:'var(--cm-text3)', marginBottom:8, textTransform:'uppercase', letterSpacing:'.06em' }}>Peer Review Checklist</div>
                      <div className="cm-checklist">
                        {CHECKLIST_ITEMS.map(item => {
                          const checked = myChecklist[item.key] ?? false;
                          return (
                            <div key={item.key} className={`cm-check-item${checked?' checked':''}`}
                              onClick={e => { e.stopPropagation(); toggleCheck(sub._id, item.key); }}>
                              <div className="cm-check-box">{checked&&'✓'}</div>
                              <div style={{ flex:1 }}>
                                <div className="cm-check-label">{item.label}</div>
                                <div style={{ fontSize:11, color:'var(--cm-text3)', marginTop:1 }}>{item.sub}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* §3.4 🆕 NEW: Inline comment thread */}
                      {(sub.comments?.length > 0 || true) && (
                        <div style={{ marginTop:14, paddingTop:14, borderTop:'1px solid var(--cm-border)' }}>
                          <div style={{ fontSize:12, fontWeight:700, color:'var(--cm-text3)', marginBottom:10, textTransform:'uppercase', letterSpacing:'.06em' }}>
                            Comments ({sub.comments?.length || 0})
                          </div>

                          {sub.comments?.map((c,i) => (
                            <div key={i} style={{ display:'flex', gap:10, marginBottom:12 }}>
                              <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#fff', flexShrink:0 }}>
                                {(c.author?.name||'?')[0]}
                              </div>
                              <div style={{ flex:1, background:'var(--cm-bg3)', borderRadius:'0 10px 10px 10px', padding:'10px 12px' }}>
                                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                                  <span style={{ fontSize:12, fontWeight:600, color:'var(--cm-text)', cursor:'pointer' }}
                                    onClick={() => onOpenProfile?.(c.author?._id, c.author?.name, c.author?.niche)}>
                                    {c.author?.name}
                                  </span>
                                  {/* §3.4: MENTOR badge */}
                                  {c.author?.isMentor && (
                                    <span style={{ fontSize:10, background:'var(--cm-accent-soft)', color:'var(--cm-accent2)', padding:'1px 7px', borderRadius:10, fontWeight:700 }}>MENTOR</span>
                                  )}
                                  <span style={{ fontSize:11, color:'var(--cm-text4)', marginLeft:'auto' }}>
                                    {Math.floor((Date.now()-new Date(c.createdAt))/3600000)}h ago
                                  </span>
                                </div>
                                <div style={{ fontSize:12.5, color:'var(--cm-text2)', lineHeight:1.55 }}>{c.text||c.comment||c.content}</div>
                              </div>
                            </div>
                          ))}

                          {/* Reply input */}
                          <div style={{ display:'flex', gap:8, marginTop:8 }}>
                            <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff', flexShrink:0 }}>P</div>
                            <textarea
                              value={replyText}
                              onChange={e => setReplyInputs(prev => ({ ...prev, [sub._id]:e.target.value.slice(0,500) }))}
                              placeholder="Write your feedback…"
                              rows={2}
                              onClick={e => e.stopPropagation()}
                              style={{ flex:1, background:'var(--cm-bg3)', border:'1.5px solid var(--cm-border2)', borderRadius:8, padding:'8px 12px', fontSize:13, color:'var(--cm-text)', fontFamily:'var(--cm-font)', outline:'none', resize:'none', lineHeight:1.5, transition:'border-color .15s' }}
                              onFocus={e => e.target.style.borderColor='var(--cm-accent)'}
                              onBlur={e => e.target.style.borderColor='var(--cm-border2)'}
                            />
                          </div>
                        </div>
                      )}

                      {/* Give Feedback CTA — full-width */}
                      <button className="cm-btn cm-btn-primary" style={{ width:'100%', marginTop:14, height:42, justifyContent:'center' }}
                        onClick={e => { e.stopPropagation(); submitReview(sub._id); }}>
                        ◎ Give Feedback
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ padding:'20px 16px', background:'var(--cm-bg2)' }}>

          {/* §3.4: Exact 5 Feedback Guidelines from spec */}
          <div style={{ marginBottom:20 }}>
            <div className="cm-rail-title">📜 Feedback Guidelines</div>
            {GUIDELINES.map((g,i) => (
              <div key={i} style={{ display:'flex', gap:8, padding:'7px 0', borderBottom:'1px solid var(--cm-border)', fontSize:12.5, color:'var(--cm-text2)', lineHeight:1.5 }}>
                <span style={{ color:'var(--cm-green)', fontWeight:700, flexShrink:0 }}>✓</span>{g}
              </div>
            ))}
          </div>

          {/* §3.4: Verified Mentors Online — real-time */}
          <div style={{ marginBottom:20 }}>
            <div className="cm-rail-title">👨‍🏫 Verified Mentors Online</div>
            {mentorsOnline.map((m,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid var(--cm-border)' }}>
                <div style={{ position:'relative' }}>
                  <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#f59e0b,#d97706)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff' }}>
                    {(m.name||'M')[0]}
                  </div>
                  <div style={{ position:'absolute', bottom:0, right:0, width:8, height:8, borderRadius:'50%', background:m.online?'var(--cm-green)':'#555', border:'1.5px solid var(--cm-bg2)' }} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:'var(--cm-text)' }}>{m.name}</div>
                  <div style={{ fontSize:11, color: m.online?'var(--cm-green)':'var(--cm-text3)' }}>
                    {m.online ? '🟢 Online' : '⚫ Busy'} · {m.niche}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* §3.4: Top Reviewers This Week */}
          <div style={{ marginBottom:20 }}>
            <div className="cm-rail-title">🏆 Top Reviewers This Week</div>
            {[
              { name:'Ananya Singh',  reviews:24 },
              { name:'Dev Creators',  reviews:19 },
              { name:'Meera Iyer',    reviews:15 },
              { name:'Karan Kapoor',  reviews:12 },
              { name:'Sonal Thakur', reviews:9  },
            ].map((r,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0', borderBottom:'1px solid var(--cm-border)' }}>
                <span style={{ fontSize:11, fontWeight:700, color:['var(--cm-gold)','#94a3b8','#cd7c2e','var(--cm-text4)','var(--cm-text4)'][i], width:16 }}>{i+1}</span>
                <div style={{ flex:1, fontSize:13, color:'var(--cm-text)', cursor:'pointer' }}
                  onClick={() => onOpenProfile?.(r._id, r.name, r.niche)}>
                  {r.name}
                </div>
                <span style={{ fontSize:11, color:'var(--cm-text3)' }}>{r.reviews} reviews</span>
              </div>
            ))}
          </div>

          {/* Submit button */}
          <button className="cm-btn cm-btn-primary" style={{ width:'100%', height:42, justifyContent:'center' }} onClick={onOpenFeedback}>
            ◎ Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
}