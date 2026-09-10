// // // 'use client';
// // // import { useState, useRef, useEffect } from 'react';

// // // export default function PostCard({ post, onProfileClick, onReport, onSave, onLike }) {
// // //   const [contextOpen, setContextOpen] = useState(false);
// // //   const [liked, setLiked] = useState(post.liked || false);
// // //   const [saved, setSaved] = useState(post.saved || false);
// // //   const [likeCount, setLikeCount] = useState(post.likes || 0);
// // //   const menuRef = useRef(null);

// // //   useEffect(() => {
// // //     function handle(e) {
// // //       if (menuRef.current && !menuRef.current.contains(e.target)) setContextOpen(false);
// // //     }
// // //     document.addEventListener('mousedown', handle);
// // //     return () => document.removeEventListener('mousedown', handle);
// // //   }, []);

// // //   function handleLike() {
// // //     const next = !liked;
// // //     setLiked(next);
// // //     setLikeCount(c => next ? c + 1 : c - 1);
// // //     onLike?.(post.id, next);
// // //   }

// // //   function handleSave() {
// // //     const next = !saved;
// // //     setSaved(next);
// // //     onSave?.(post.id, next);
// // //   }

// // //   return (
// // //     <div
// // //       style={{
// // //         background: 'var(--cm-bg2)', border: '1px solid var(--cm-border)',
// // //         borderRadius: 'var(--cm-radius-lg)', padding: 18, marginBottom: 12,
// // //         transition: 'all .2s', cursor: 'default',
// // //       }}
// // //       onMouseEnter={e => {
// // //         e.currentTarget.style.borderColor = 'var(--cm-border2)';
// // //         e.currentTarget.style.background = 'var(--cm-surface)';
// // //         e.currentTarget.style.transform = 'translateY(-1px)';
// // //         e.currentTarget.style.boxShadow = 'var(--cm-shadow)';
// // //       }}
// // //       onMouseLeave={e => {
// // //         e.currentTarget.style.borderColor = 'var(--cm-border)';
// // //         e.currentTarget.style.background = 'var(--cm-bg2)';
// // //         e.currentTarget.style.transform = 'none';
// // //         e.currentTarget.style.boxShadow = 'none';
// // //       }}
// // //     >
// // //       {/* Header */}
// // //       <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
// // //         {/* Avatar */}
// // //         <div
// // //           onClick={() => onProfileClick?.(post.authorId, post.authorName)}
// // //           style={{
// // //             width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
// // //             background: post.authorGradient, display: 'flex', alignItems: 'center',
// // //             justifyContent: 'center', fontSize: 15, fontWeight: 600, color: '#fff',
// // //             cursor: 'pointer',
// // //           }}
// // //         >
// // //           {post.authorInitial}
// // //         </div>

// // //         {/* Meta */}
// // //         <div style={{ flex: 1, minWidth: 0 }}>
// // //           <span
// // //             onClick={() => onProfileClick?.(post.authorId, post.authorName)}
// // //             style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--cm-text)', cursor: 'pointer' }}
// // //             onMouseEnter={e => { e.currentTarget.style.color = 'var(--cm-accent2)'; e.currentTarget.style.textDecoration = 'underline'; }}
// // //             onMouseLeave={e => { e.currentTarget.style.color = 'var(--cm-text)'; e.currentTarget.style.textDecoration = 'none'; }}
// // //           >
// // //             {post.authorName}
// // //           </span>
// // //           <div style={{ fontSize: 11, color: 'var(--cm-text3)', marginTop: 1 }}>{post.authorNiche}</div>
// // //         </div>

// // //         {/* Space badge */}
// // //         <div style={{
// // //           display: 'inline-flex', alignItems: 'center', gap: 4,
// // //           background: 'var(--cm-surface2)', borderRadius: 6, padding: '3px 9px',
// // //           fontSize: 11, fontWeight: 500, color: 'var(--cm-text2)', flexShrink: 0,
// // //         }}>
// // //           {post.spaceLabel}
// // //         </div>

// // //         {/* Context menu */}
// // //         <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }}>
// // //           <button
// // //             onClick={() => setContextOpen(v => !v)}
// // //             style={{
// // //               width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
// // //               borderRadius: 6, cursor: 'pointer', color: 'var(--cm-text3)', fontSize: 16,
// // //               background: 'none', border: 'none', transition: 'all .12s', fontFamily: 'var(--cm-font)',
// // //             }}
// // //             onMouseEnter={e => { e.currentTarget.style.background = 'var(--cm-surface2)'; e.currentTarget.style.color = 'var(--cm-text)'; }}
// // //             onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--cm-text3)'; }}
// // //           >
// // //             ⋯
// // //           </button>
// // //           {contextOpen && (
// // //             <div style={{
// // //               position: 'absolute', top: 30, right: 0, background: 'var(--cm-bg2)',
// // //               border: '1px solid var(--cm-border2)', borderRadius: 10, boxShadow: 'var(--cm-shadow-lg)',
// // //               zIndex: 200, minWidth: 166, overflow: 'hidden',
// // //               animation: 'cm-scale-in .15s ease both',
// // //             }}>
// // //               {[
// // //                 { icon: '🔖', label: saved ? 'Unsave post' : 'Save post', action: () => { handleSave(); setContextOpen(false); } },
// // //                 { icon: '🔗', label: 'Copy link', action: () => { navigator.clipboard.writeText(window.location.href); setContextOpen(false); } },
// // //                 { icon: '👤', label: 'View profile', action: () => { onProfileClick?.(post.authorId, post.authorName); setContextOpen(false); } },
// // //                 { icon: '🚩', label: 'Report post', danger: true, action: () => { onReport?.('post', post.authorName, post.id); setContextOpen(false); } },
// // //                 { icon: '🚫', label: 'Block user', danger: true, action: () => setContextOpen(false) },
// // //               ].map((item, i) => (
// // //                 <div
// // //                   key={i}
// // //                   onClick={item.action}
// // //                   style={{
// // //                     padding: '10px 14px', fontSize: 13, cursor: 'pointer',
// // //                     color: item.danger ? 'var(--cm-red)' : 'var(--cm-text2)',
// // //                     display: 'flex', alignItems: 'center', gap: 8, transition: 'background .1s',
// // //                   }}
// // //                   onMouseEnter={e => e.currentTarget.style.background = item.danger ? 'var(--cm-red-soft)' : 'var(--cm-surface)'}
// // //                   onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
// // //                 >
// // //                   <span>{item.icon}</span> {item.label}
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* Title */}
// // //       <div style={{
// // //         fontSize: 15, fontWeight: 600, color: 'var(--cm-text)', lineHeight: 1.4,
// // //         marginBottom: 8, overflow: 'hidden', display: '-webkit-box',
// // //         WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
// // //       }}>
// // //         {post.title}
// // //       </div>

// // //       {/* Preview */}
// // //       <div style={{
// // //         fontSize: 13, color: 'var(--cm-text2)', lineHeight: 1.65,
// // //         overflow: 'hidden', display: '-webkit-box',
// // //         WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', marginBottom: 12,
// // //       }}>
// // //         {post.preview}
// // //       </div>

// // //       {/* Tags */}
// // //       {post.tags?.length > 0 && (
// // //         <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
// // //           {post.tags.slice(0, 3).map(tag => (
// // //             <span key={tag} style={{
// // //               padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500,
// // //               background: 'var(--cm-surface2)', color: 'var(--cm-text3)', border: '1px solid var(--cm-border)',
// // //             }}>
// // //               {tag}
// // //             </span>
// // //           ))}
// // //           {post.tags.length > 3 && (
// // //             <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, color: 'var(--cm-text3)' }}>
// // //               +{post.tags.length - 3} more
// // //             </span>
// // //           )}
// // //         </div>
// // //       )}

// // //       {/* Action bar */}
// // //       <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop: 12, borderTop: '1px solid var(--cm-border)' }}>
// // //         {[
// // //           {
// // //             icon: '❤️', label: `${likeCount}`, active: liked,
// // //             activeColor: 'var(--cm-red)', activeBg: 'var(--cm-red-soft)',
// // //             onClick: handleLike,
// // //           },
// // //           { icon: '💬', label: `${post.replies}`, onClick: null },
// // //           {
// // //             icon: saved ? '🔖' : '🔖', label: saved ? 'Saved' : 'Save',
// // //             active: saved, activeColor: 'var(--cm-accent2)', activeBg: 'var(--cm-accent-soft)',
// // //             onClick: handleSave,
// // //           },
// // //           { icon: '↗️', label: 'Share', onClick: null },
// // //         ].map((btn, i) => (
// // //           <button
// // //             key={i}
// // //             onClick={btn.onClick}
// // //             style={{
// // //               display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
// // //               borderRadius: 7, fontSize: 12, fontWeight: 500,
// // //               color: btn.active ? btn.activeColor : 'var(--cm-text3)',
// // //               background: btn.active ? btn.activeBg : 'none',
// // //               cursor: btn.onClick ? 'pointer' : 'default',
// // //               border: 'none', fontFamily: 'var(--cm-font)', transition: 'all .15s',
// // //             }}
// // //             onMouseEnter={e => { if (btn.onClick) { e.currentTarget.style.background = btn.active ? btn.activeBg : 'var(--cm-surface2)'; e.currentTarget.style.color = btn.active ? btn.activeColor : 'var(--cm-text2)'; } }}
// // //             onMouseLeave={e => { e.currentTarget.style.background = btn.active ? btn.activeBg : 'none'; e.currentTarget.style.color = btn.active ? btn.activeColor : 'var(--cm-text3)'; }}
// // //           >
// // //             {btn.icon} {btn.label}
// // //           </button>
// // //         ))}
// // //         <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--cm-text3)', whiteSpace: 'nowrap' }}>
// // //           {post.timeAgo}
// // //         </span>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // // Skeleton version
// // // export function PostCardSkeleton() {
// // //   return (
// // //     <div style={{ background: 'var(--cm-bg2)', border: '1px solid var(--cm-border)', borderRadius: 'var(--cm-radius-lg)', padding: 18, marginBottom: 12 }}>
// // //       <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
// // //         <div className="cm-skel" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
// // //         <div style={{ flex: 1 }}>
// // //           <div className="cm-skel cm-skel-line" style={{ width: '55%', height: 12, marginBottom: 8 }} />
// // //           <div className="cm-skel cm-skel-line" style={{ width: '30%', height: 10 }} />
// // //         </div>
// // //       </div>
// // //       <div className="cm-skel cm-skel-line" style={{ width: '100%', height: 13, marginBottom: 8 }} />
// // //       <div className="cm-skel cm-skel-line" style={{ width: '100%', height: 13, marginBottom: 8 }} />
// // //       <div className="cm-skel cm-skel-line" style={{ width: '65%', height: 13, marginBottom: 14 }} />
// // //       <div style={{ display: 'flex', gap: 8 }}>
// // //         <div className="cm-skel" style={{ width: 60, height: 28, borderRadius: 7 }} />
// // //         <div className="cm-skel" style={{ width: 60, height: 28, borderRadius: 7 }} />
// // //         <div className="cm-skel" style={{ width: 60, height: 28, borderRadius: 7 }} />
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // 'use client';
// // import { useState, useRef, useEffect } from 'react';

// // export default function PostCard({ post, onProfileClick, onReport }) {
// //   const [menuOpen, setMenuOpen] = useState(false);
// //   const [liked, setLiked] = useState(post.liked || false);
// //   const [saved, setSaved] = useState(post.saved || false);
// //   const [likes, setLikes] = useState(post.likes || 0);
// //   const menuRef = useRef(null);

// //   useEffect(() => {
// //     const h = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
// //     document.addEventListener('mousedown', h);
// //     return () => document.removeEventListener('mousedown', h);
// //   }, []);

// //   return (
// //     <div style={{
// //       background: 'var(--cm-bg2)',
// //       border: '1.5px solid var(--cm-border)',
// //       borderRadius: 'var(--cm-radius-lg)',
// //       padding: '20px 22px',
// //       marginBottom: 14,
// //       transition: 'all .22s cubic-bezier(0.22,1,0.36,1)',
// //       cursor: 'default',
// //       position: 'relative',
// //       overflow: 'hidden',
// //     }}
// //     onMouseEnter={e => {
// //       e.currentTarget.style.borderColor = 'var(--cm-border3)';
// //       e.currentTarget.style.boxShadow = 'var(--cm-shadow)';
// //       e.currentTarget.style.transform = 'translateY(-2px)';
// //     }}
// //     onMouseLeave={e => {
// //       e.currentTarget.style.borderColor = 'var(--cm-border)';
// //       e.currentTarget.style.boxShadow = 'none';
// //       e.currentTarget.style.transform = 'none';
// //     }}
// //     >
// //       {/* Accent top line on hover */}
// //       <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--cm-grad-accent)', opacity: 0, borderRadius: '14px 14px 0 0', transition: 'opacity .2s' }} className="card-accent-line" />

// //       {/* Header row */}
// //       <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
// //         <div
// //           onClick={() => onProfileClick?.(post.authorId, post.authorName)}
// //           style={{
// //             width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
// //             background: post.authorGradient, display: 'flex', alignItems: 'center',
// //             justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff',
// //             cursor: 'pointer', transition: 'transform .15s, box-shadow .15s',
// //             boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
// //           }}
// //           onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.2)'; }}
// //           onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)'; }}
// //         >{post.authorInitial}</div>

// //         <div style={{ flex: 1, minWidth: 0 }}>
// //           <span
// //             onClick={() => onProfileClick?.(post.authorId, post.authorName)}
// //             style={{ fontSize: 14, fontWeight: 600, color: 'var(--cm-text)', cursor: 'pointer', transition: 'color .12s' }}
// //             onMouseEnter={e => e.currentTarget.style.color = 'var(--cm-accent)'}
// //             onMouseLeave={e => e.currentTarget.style.color = 'var(--cm-text)'}
// //           >{post.authorName}</span>
// //           <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
// //             <span style={{ fontSize: 11.5, color: 'var(--cm-text3)' }}>{post.authorNiche}</span>
// //             <span style={{ color: 'var(--cm-border3)', fontSize: 10 }}>•</span>
// //             <span style={{ fontSize: 11.5, color: 'var(--cm-text4)' }}>{post.timeAgo}</span>
// //           </div>
// //         </div>

// //         {/* Space badge */}
// //         <div style={{
// //           display: 'inline-flex', alignItems: 'center', gap: 5,
// //           background: 'var(--cm-surface)', border: '1px solid var(--cm-border2)',
// //           borderRadius: 20, padding: '4px 10px',
// //           fontSize: 11.5, fontWeight: 600, color: 'var(--cm-text2)',
// //           fontFamily: 'var(--cm-font-ui)', flexShrink: 0,
// //         }}>
// //           <div style={{ width: 6, height: 6, borderRadius: '50%', background: post.spaceColor, flexShrink: 0 }} />
// //           {post.spaceLabel.replace(/[^\w\s]/g, '').trim()}
// //         </div>

// //         {/* ⋯ menu */}
// //         <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }}>
// //           <button onClick={() => setMenuOpen(v => !v)} style={{
// //             width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
// //             background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
// //             color: 'var(--cm-text3)', fontSize: 17, transition: 'all .12s',
// //           }}
// //           onMouseEnter={e => { e.currentTarget.style.background = 'var(--cm-surface2)'; e.currentTarget.style.color = 'var(--cm-text)'; }}
// //           onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--cm-text3)'; }}
// //           >⋯</button>
// //           {menuOpen && (
// //             <div className="cm-scale-in" style={{
// //               position: 'absolute', top: 34, right: 0, width: 180,
// //               background: 'var(--cm-bg2)', border: '1px solid var(--cm-border2)',
// //               borderRadius: 12, boxShadow: 'var(--cm-shadow-lg)', zIndex: 200, overflow: 'hidden',
// //             }}>
// //               {[
// //                 { icon: saved ? '🔖' : '🔖', label: saved ? 'Unsave' : 'Save post', action: () => { setSaved(v => !v); setMenuOpen(false); } },
// //                 { icon: '🔗', label: 'Copy link', action: () => { navigator.clipboard.writeText(window.location.href); setMenuOpen(false); } },
// //                 { icon: '👤', label: 'View profile', action: () => { onProfileClick?.(post.authorId, post.authorName); setMenuOpen(false); } },
// //                 { icon: '🚩', label: 'Report post', danger: true, action: () => { onReport?.('post', post.authorName, post.id); setMenuOpen(false); } },
// //                 { icon: '🚫', label: 'Block user', danger: true, action: () => setMenuOpen(false) },
// //               ].map((m, i) => (
// //                 <div key={i} onClick={m.action} style={{
// //                   display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
// //                   cursor: 'pointer', fontSize: 13.5, transition: 'background .1s',
// //                   color: m.danger ? 'var(--cm-red)' : 'var(--cm-text2)',
// //                 }}
// //                 onMouseEnter={e => e.currentTarget.style.background = m.danger ? 'var(--cm-red-soft)' : 'var(--cm-surface)'}
// //                 onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
// //                 >
// //                   <span style={{ fontSize: 14 }}>{m.icon}</span> {m.label}
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Title */}
// //       <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--cm-text)', lineHeight: 1.4, marginBottom: 8, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
// //         {post.title}
// //       </div>

// //       {/* Preview */}
// //       <div style={{ fontSize: 13.5, color: 'var(--cm-text2)', lineHeight: 1.7, marginBottom: 14, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
// //         {post.preview}
// //       </div>

// //       {/* Tags */}
// //       {post.tags?.length > 0 && (
// //         <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
// //           {post.tags.slice(0, 3).map(tag => (
// //             <span key={tag} style={{
// //               padding: '4px 11px', borderRadius: 20, fontSize: 12, fontWeight: 500,
// //               background: 'var(--cm-surface)', border: '1px solid var(--cm-border2)',
// //               color: 'var(--cm-text3)', fontFamily: 'var(--cm-font-ui)',
// //             }}>{tag}</span>
// //           ))}
// //           {post.tags.length > 3 && <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, color: 'var(--cm-text4)' }}>+{post.tags.length - 3}</span>}
// //         </div>
// //       )}

// //       {/* Action bar */}
// //       <div style={{ display: 'flex', alignItems: 'center', gap: 2, paddingTop: 14, borderTop: '1px solid var(--cm-border)' }}>
// //         {/* Like */}
// //         <ActionBtn
// //           active={liked}
// //           activeColor="var(--cm-red)"
// //           activeBg="var(--cm-red-soft)"
// //           onClick={() => { setLiked(v => !v); setLikes(c => liked ? c - 1 : c + 1); }}
// //         >
// //           {liked ? '❤️' : '🤍'} {likes}
// //         </ActionBtn>
// //         <ActionBtn>💬 {post.replies}</ActionBtn>
// //         <ActionBtn active={saved} activeColor="var(--cm-accent)" activeBg="var(--cm-accent-soft)" onClick={() => setSaved(v => !v)}>
// //           {saved ? '🔖' : '🔖'} {saved ? 'Saved' : 'Save'}
// //         </ActionBtn>
// //         <ActionBtn>↗ Share</ActionBtn>
// //       </div>
// //     </div>
// //   );
// // }

// // function ActionBtn({ children, active, activeColor, activeBg, onClick }) {
// //   return (
// //     <button onClick={onClick} style={{
// //       display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px',
// //       borderRadius: 8, fontSize: 13, fontWeight: 500,
// //       color: active ? activeColor : 'var(--cm-text3)',
// //       background: active ? activeBg : 'transparent',
// //       border: 'none', cursor: onClick ? 'pointer' : 'default',
// //       fontFamily: 'var(--cm-font)', transition: 'all .14s',
// //     }}
// //     onMouseEnter={e => { if (onClick) { e.currentTarget.style.background = active ? activeBg : 'var(--cm-surface)'; if (!active) e.currentTarget.style.color = 'var(--cm-text2)'; } }}
// //     onMouseLeave={e => { e.currentTarget.style.background = active ? activeBg : 'transparent'; if (!active) e.currentTarget.style.color = 'var(--cm-text3)'; }}
// //     >{children}</button>
// //   );
// // }

// // export function PostCardSkeleton() {
// //   return (
// //     <div style={{ background: 'var(--cm-bg2)', border: '1.5px solid var(--cm-border)', borderRadius: 'var(--cm-radius-lg)', padding: '20px 22px', marginBottom: 14 }}>
// //       <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
// //         <div className="cm-skel" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
// //         <div style={{ flex: 1 }}>
// //           <div className="cm-skel" style={{ width: '48%', height: 13, marginBottom: 8 }} />
// //           <div className="cm-skel" style={{ width: '30%', height: 11 }} />
// //         </div>
// //         <div className="cm-skel" style={{ width: 80, height: 24, borderRadius: 20 }} />
// //       </div>
// //       <div className="cm-skel" style={{ width: '90%', height: 14, marginBottom: 8 }} />
// //       <div className="cm-skel" style={{ width: '70%', height: 14, marginBottom: 14 }} />
// //       <div className="cm-skel" style={{ width: '100%', height: 12, marginBottom: 6 }} />
// //       <div className="cm-skel" style={{ width: '80%', height: 12, marginBottom: 6 }} />
// //       <div className="cm-skel" style={{ width: '55%', height: 12, marginBottom: 16 }} />
// //       <div style={{ display: 'flex', gap: 8, paddingTop: 14, borderTop: '1px solid var(--cm-border)' }}>
// //         {[60, 60, 70, 60].map((w, i) => <div key={i} className="cm-skel" style={{ width: w, height: 30, borderRadius: 8 }} />)}
// //       </div>
// //     </div>
// //   );
// // }
// 'use client';
// // components/community/PostCard.js
// import { useState } from 'react';
// import { toggleLike, toggleSave } from '@/services/community.service';

// function timeAgo(date) {
//   if (!date) return '';
//   const d = typeof date === 'string' ? new Date(date) : date;
//   const s = Math.floor((Date.now() - d) / 1000);
//   if (s < 60) return 'just now';
//   if (s < 3600) return `${Math.floor(s/60)}m ago`;
//   if (s < 86400) return `${Math.floor(s/3600)}h ago`;
//   return `${Math.floor(s/86400)}d ago`;
// }

// export default function PostCard({ post, onOpenProfile, onReport, onNavigate }) {
//   const [liked, setLiked]       = useState(post.liked || false);
//   const [saved, setSaved]       = useState(post.saved || false);
//   const [likeCount, setLikeCount] = useState(post.likeCount || post.likes || 0);
//   const [menuOpen, setMenuOpen] = useState(false);

//   async function handleLike() {
//     const next = !liked;
//     setLiked(next);
//     setLikeCount(c => next ? c+1 : c-1);
//     try { await toggleLike(post._id); }
//     catch { setLiked(!next); setLikeCount(c => next ? c-1 : c+1); }
//   }

//   async function handleSave() {
//     const next = !saved;
//     setSaved(next);
//     try { await toggleSave(post._id); }
//     catch { setSaved(!next); }
//   }

//   const author   = post.author || post.sender || {};
//   const authorName = author.name || post.authorName || 'Creator';
//   const authorNiche = author.niche || post.niche || '';

//   return (
//     <div className="cm-post-card">
//       {/* Header */}
//       <div className="cm-post-header">
//         <div
//           style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700, color:'#fff', flexShrink:0, cursor:'pointer' }}
//           onClick={() => onOpenProfile?.(author._id || post.authorId, authorName, authorNiche)}
//         >
//           {author.avatar
//             ? <img src={author.avatar} style={{ width:40, height:40, borderRadius:'50%', objectFit:'cover' }} alt="" />
//             : authorName[0]?.toUpperCase()}
//         </div>

//         <div className="cm-post-meta" style={{ flex:1, minWidth:0 }}>
//           <div className="cm-post-author"
//             onClick={() => onOpenProfile?.(author._id || post.authorId, authorName, authorNiche)}>
//             {authorName}
//           </div>
//           {authorNiche && <div className="cm-post-niche">{authorNiche}</div>}
//         </div>

//         {post.space && (
//           <div className="cm-post-space-badge">
//             <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--cm-accent)', display:'inline-block' }} />
//             {post.space?.name || post.spaceName}
//           </div>
//         )}

//         {/* ⋯ Menu */}
//         <div style={{ position:'relative' }}>
//           <button className="cm-post-menu-btn" onClick={e => { e.stopPropagation(); setMenuOpen(v=>!v); }}>⋯</button>
//           {menuOpen && (
//             <div className="cm-ctx-menu cm-scale-in">
//               <div className="cm-ctx-item" onClick={() => { setMenuOpen(false); handleSave(); }}>🔖 {saved ? 'Unsave' : 'Save post'}</div>
//               <div className="cm-ctx-item" onClick={() => { setMenuOpen(false); navigator.clipboard?.writeText(window.location.href); }}>🔗 Copy link</div>
//               <div className="cm-ctx-item" onClick={() => { setMenuOpen(false); onOpenProfile?.(author._id, authorName, authorNiche); }}>👤 View profile</div>
//               <div className="cm-ctx-item danger" onClick={() => { setMenuOpen(false); onReport?.({ type:'post', id:post._id, title:post.title }); }}>🚩 Report</div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Content */}
//       <div className="cm-post-title">{post.title}</div>
//       {post.content && <div className="cm-post-preview">{post.content}</div>}

//       {/* Tags */}
//       {post.tags?.length > 0 && (
//         <div className="cm-post-tags">
//           {post.tags.slice(0,3).map(t => (
//             <span key={t} className="cm-tag">#{t}</span>
//           ))}
//         </div>
//       )}

//       {/* Actions */}
//       <div className="cm-post-actions">
//         <button className={`cm-action-btn${liked?' liked':''}`} onClick={handleLike}>
//           {liked ? '❤️' : '🤍'} {likeCount}
//         </button>
//         <button className="cm-action-btn">
//           💬 {post.commentCount || post.comments || 0}
//         </button>
//         <button className={`cm-action-btn${saved?' saved':''}`} onClick={handleSave}>
//           {saved ? '🔖' : '🔖'} {saved ? 'Saved' : 'Save'}
//         </button>
//         <button className="cm-action-btn" onClick={() => navigator.share?.({ title: post.title, url: window.location.href })}>↗ Share</button>
//         <span className="cm-post-time">{timeAgo(post.createdAt)}</span>
//       </div>
//     </div>
//   );
// }

// export function PostCardSkeleton() {
//   return (
//     <div className="cm-skel-card">
//       <div style={{ display:'flex', gap:12, marginBottom:12 }}>
//         <div className="cm-skel" style={{ width:40, height:40, borderRadius:'50%', flexShrink:0 }} />
//         <div style={{ flex:1 }}>
//           <div className="cm-skel" style={{ height:13, width:'40%', marginBottom:6 }} />
//           <div className="cm-skel" style={{ height:11, width:'25%' }} />
//         </div>
//       </div>
//       <div className="cm-skel" style={{ height:16, width:'80%', marginBottom:8 }} />
//       <div className="cm-skel" style={{ height:13, width:'100%', marginBottom:5 }} />
//       <div className="cm-skel" style={{ height:13, width:'90%', marginBottom:5 }} />
//       <div className="cm-skel" style={{ height:13, width:'70%', marginBottom:12 }} />
//       <div style={{ display:'flex', gap:8 }}>
//         {[60,70,60,50].map((w,i) => <div key={i} className="cm-skel" style={{ height:28, width:w, borderRadius:7 }} />)}
//       </div>
//     </div>
//   );
// }

// export function EventHighlightCard({ event, onNavigate }) {
//   return (
//     <div style={{ background:'linear-gradient(135deg,#1e1040,#0a1628)', border:'1px solid rgba(99,102,241,.3)', borderRadius:'var(--cm-radius-lg)', padding:20, marginBottom:12, display:'flex', alignItems:'center', gap:16, cursor:'pointer' }}
//       onClick={() => onNavigate?.('events')}>
//       <div>
//         <span style={{ background:'var(--cm-accent)', color:'#fff', fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20, letterSpacing:'.05em', textTransform:'uppercase' }}>
//           {event?.status === 'live' ? '🔴 LIVE NOW' : '📅 UPCOMING'}
//         </span>
//         <div style={{ fontSize:14, fontWeight:600, color:'var(--cm-text)', marginTop:8, marginBottom:4, lineHeight:1.3 }}>{event?.title || 'Brand Deals Masterclass'}</div>
//         <div style={{ fontSize:12, color:'var(--cm-text3)' }}>by {event?.host?.name || 'Arjun Mehta'} · {event?.status === 'live' ? `${event?.listenerCount || 540} listening` : 'Tomorrow 7PM'}</div>
//       </div>
//       <button className="cm-btn cm-btn-primary" style={{ marginLeft:'auto', flexShrink:0 }}>
//         {event?.status === 'live' ? 'Join Live →' : 'RSVP →'}
//       </button>
//     </div>
//   );
// }

'use client';
// components/community/PostCard.js
// Spec §2.3 — Post Card (Discussion Card)
// ALL fields required per spec. Author name ALWAYS clickable → profile.
// ⋯ Menu: Save, Copy link, View profile, Report post, Block user (§3.9 FIXED)

import { useState } from 'react';
import { toggleLike, toggleSave } from '@/services/community.service';

function timeAgo(date) {
  if (!date) return '';
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60)    return 'just now';
  if (s < 3600)  return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

export default function PostCard({ post, onOpenProfile, onReport, onOpenDM }) {
  const [liked,     setLiked]     = useState(post.liked  || false);
  const [saved,     setSaved]     = useState(post.saved  || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || post.likes || 0);
  const [menuOpen,  setMenuOpen]  = useState(false);

  async function handleLike() {
    const next = !liked;
    setLiked(next);
    setLikeCount(c => next ? c+1 : c-1);
    try { await toggleLike(post._id); }
    catch { setLiked(!next); setLikeCount(c => next ? c-1 : c+1); }
  }

  async function handleSave() {
    const next = !saved;
    setSaved(next);
    try { await toggleSave(post._id); }
    catch { setSaved(!next); }
  }

  function handleCopyLink() {
    navigator.clipboard?.writeText(`${window.location.origin}/community?post=${post._id}`);
    setMenuOpen(false);
  }

  const author     = post.author || post.sender || {};
  const authorId   = author._id || author.id || post.authorId;
  const authorName = author.name || post.authorName || 'Creator';
  const authorNiche= author.niche || post.niche || '';

  // Tags: show max 3, "+N more" if exceeded  (§2.3)
  const tags    = post.tags || [];
  const showTags = tags.slice(0, 3);
  const extraTags = tags.length - 3;

  return (
    <div className="cm-post-card">

      {/* ── Header ── */}
      <div className="cm-post-header">
        {/* Avatar — clickable → profile */}
        <div style={{ width:40, height:40, borderRadius:'50%', flexShrink:0, cursor:'pointer',
            background:'linear-gradient(135deg,#6366f1,#a855f7)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:15, fontWeight:700, color:'#fff', overflow:'hidden' }}
          onClick={() => onOpenProfile?.(authorId, authorName, authorNiche)}>
          {author.avatar
            ? <img src={author.avatar} style={{ width:40, height:40, borderRadius:'50%', objectFit:'cover' }} alt="" />
            : authorName[0]?.toUpperCase()}
        </div>

        <div style={{ flex:1, minWidth:0 }}>
          {/* §2.3: Author name bold 13.5px; clickable → opens Profile page (🆕 NEW) */}
          <div className="cm-post-author"
            onClick={() => onOpenProfile?.(authorId, authorName, authorNiche)}>
            {authorName}
          </div>
          {authorNiche && <div className="cm-post-niche">{authorNiche}</div>}
        </div>

        {post.space && (
          <div className="cm-post-space-badge">
            <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--cm-accent)', display:'inline-block' }} />
            {post.space?.name || post.spaceName}
          </div>
        )}

        {/* §2.3 + §3.9 FIXED: ⋯ Menu top-right, 28px — accessible on ALL post cards */}
        <div style={{ position:'relative' }}>
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
              <div className="cm-ctx-item danger" onClick={() => { setMenuOpen(false); onReport?.({ type:'post', id:post._id, title:post.title, authorName }); }}>
                🚩 Report post
              </div>
              <div className="cm-ctx-item danger" onClick={() => { setMenuOpen(false); onReport?.({ type:'user', id:authorId, title:`User: ${authorName}`, authorName }); }}>
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
            <span className="cm-tag" style={{ color:'var(--cm-text3)' }}>+{extraTags} more</span>
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
          onClick={() => navigator.share?.({ title: post.title, url: `${window.location.origin}/community?post=${post._id}` }) }>
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
      <div style={{ display:'flex', gap:12, marginBottom:12 }}>
        <div className="cm-skel" style={{ width:40, height:40, borderRadius:'50%', flexShrink:0 }} />
        <div style={{ flex:1 }}>
          <div className="cm-skel" style={{ height:13, width:'40%', marginBottom:6 }} />
          <div className="cm-skel" style={{ height:11, width:'25%' }} />
        </div>
      </div>
      <div className="cm-skel" style={{ height:16, width:'80%', marginBottom:8 }} />
      <div className="cm-skel" style={{ height:13, width:'100%', marginBottom:5 }} />
      <div className="cm-skel" style={{ height:13, width:'90%', marginBottom:5 }} />
      <div className="cm-skel" style={{ height:13, width:'70%', marginBottom:12 }} />
      <div style={{ display:'flex', gap:8 }}>
        {[60,70,60,50].map((w,i) => <div key={i} className="cm-skel" style={{ height:28, width:w, borderRadius:7 }} />)}
      </div>
    </div>
  );
}

// §3.1: Event Highlight Card — injected at position 2, 10, 18 (every 8th post)
export function EventHighlightCard({ event, onNavigate, onRSVP, rsvped }) {
  return (
    <div style={{
      background:'linear-gradient(135deg,#1e1040,#0a1628)',
      border:'1px solid rgba(99,102,241,.3)', borderRadius:'var(--cm-radius-lg)',
      padding:20, marginBottom:12, cursor:'pointer',
      display:'flex', alignItems:'center', gap:16,
    }} onClick={() => onNavigate?.('events')}>
      <div style={{ flex:1, minWidth:0 }}>
        <span style={{ background:'var(--cm-red)', color:'#fff', fontSize:10, fontWeight:700,
          padding:'3px 10px', borderRadius:20, letterSpacing:'.05em', textTransform:'uppercase',
          display:'inline-flex', alignItems:'center', gap:5 }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#fff', animation:'cm-blink 1.2s infinite' }} />
          {event?.status === 'live' ? 'LIVE NOW' : '📅 UPCOMING'}
        </span>
        <div style={{ fontSize:14, fontWeight:600, color:'var(--cm-text)', marginTop:8, marginBottom:4, lineHeight:1.3 }}>
          {event?.title || 'Brand Deals Masterclass'}
        </div>
        <div style={{ fontSize:12, color:'var(--cm-text3)' }}>
          by {event?.host?.name || 'Creator'} · {event?.status === 'live'
            ? `${event?.listenerCount || 540} listening`
            : new Date(event?.scheduledAt).toLocaleString('en-IN',{ weekday:'short', hour:'2-digit', minute:'2-digit' })}
        </div>
      </div>
      {rsvped ? (
        <span style={{ fontSize:12, fontWeight:700, color:'var(--cm-green)', flexShrink:0 }}>✓ RSVP'd</span>
      ) : (
        <button className="cm-btn cm-btn-primary" style={{ flexShrink:0 }}
          onClick={e => { e.stopPropagation(); onRSVP?.(event?._id); }}>
          {event?.status === 'live' ? 'Join Live →' : 'RSVP →'}
        </button>
      )}
    </div>
  );
}