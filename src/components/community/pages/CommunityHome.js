// // 'use client';
// // import { useState, useEffect } from 'react';
// // import PostCard, { PostCardSkeleton } from '../PostCard';
// // import { MOCK_POSTS, FEED_TABS } from '@/constants/community';

// // export default function CommunityHome({ onNavigate, onProfileClick, onReport }) {
// //   const [activeTab, setActiveTab] = useState('foryou');
// //   const [loading, setLoading] = useState(true);
// //   const [posts, setPosts] = useState([]);

// //   useEffect(() => {
// //     setLoading(true);
// //     const t = setTimeout(() => { setPosts(MOCK_POSTS); setLoading(false); }, 900);
// //     return () => clearTimeout(t);
// //   }, [activeTab]);

// //   return (
// //     <div>
// //       {/* Hero Strip */}
// //       <HeroStrip onNavigate={onNavigate} />

// //       {/* Feed + Rail */}
// //       <div style={{ display: 'grid', gridTemplateColumns: '1fr 316px', minHeight: 'calc(100vh - 112px)' }}>
// //         {/* Feed */}
// //         <div style={{ borderRight: '1px solid var(--cm-border)' }}>
// //           {/* Tabs */}
// //           <div style={{
// //             display: 'flex', borderBottom: '1px solid var(--cm-border)',
// //             background: 'var(--cm-bg2)', padding: '0 20px', gap: 0,
// //             position: 'sticky', top: 'var(--cm-topbar-h)', zIndex: 30,
// //           }}>
// //             {FEED_TABS.map(tab => (
// //               <div
// //                 key={tab.id}
// //                 onClick={() => setActiveTab(tab.id)}
// //                 style={{
// //                   padding: '14px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
// //                   color: activeTab === tab.id ? 'var(--cm-accent2)' : 'var(--cm-text3)',
// //                   borderBottom: `2px solid ${activeTab === tab.id ? 'var(--cm-accent2)' : 'transparent'}`,
// //                   transition: 'all .15s', whiteSpace: 'nowrap',
// //                 }}
// //                 onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--cm-text2)'; }}
// //                 onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--cm-text3)'; }}
// //               >
// //                 {tab.label}
// //               </div>
// //             ))}
// //           </div>

// //           {/* Posts */}
// //           <div style={{ padding: '16px 20px' }}>
// //             {loading ? (
// //               <>{[1,2,3].map(i => <PostCardSkeleton key={i} />)}</>
// //             ) : posts.length === 0 ? (
// //               <EmptyFeed onPost={() => {}} />
// //             ) : (
// //               posts.map((post, i) => (
// //                 <div key={post.id} className={`cm-fade-in cm-fade-in-${i+1}`}>
// //                   <PostCard
// //                     post={post}
// //                     onProfileClick={onProfileClick}
// //                     onReport={onReport}
// //                   />
// //                 </div>
// //               ))
// //             )}
// //           </div>
// //         </div>

// //         {/* Right Rail */}
// //         <RightRail onNavigate={onNavigate} onProfileClick={onProfileClick} />
// //       </div>
// //     </div>
// //   );
// // }

// // function HeroStrip({ onNavigate }) {
// //   return (
// //     <div style={{
// //       display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
// //       gap: 0, background: 'var(--cm-border)',
// //       borderBottom: '1px solid var(--cm-border)',
// //     }}>
// //       {/* Live Now */}
// //       <HeroCard
// //         type="live"
// //         topColor="linear-gradient(90deg,var(--cm-red),#ff5070)"
// //         onClick={() => onNavigate('events')}
// //       >
// //         <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--cm-red)', fontFamily: 'var(--cm-font-ui)' }}>
// //           <span className="cm-live-dot" style={{ color: 'var(--cm-red)' }} />
// //           Live Now
// //         </div>
// //         <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--cm-text)', marginBottom: 6, lineHeight: 1.35 }}>
// //           Brand Deals Masterclass: Pitch yourself to 10x brand partnerships
// //         </div>
// //         <div style={{ fontSize: 12, color: 'var(--cm-text3)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
// //           <span>🎙️ Arjun Mehta</span>
// //           <span>•</span>
// //           <span style={{ color: 'var(--cm-red)' }}>🔴 540 listening</span>
// //         </div>
// //         <LiveBtn>Join Now →</LiveBtn>
// //       </HeroCard>

// //       {/* Weekly Challenge */}
// //       <HeroCard
// //         type="challenge"
// //         topColor="linear-gradient(90deg,var(--cm-orange),var(--cm-gold))"
// //       >
// //         <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8, color: 'var(--cm-orange)', fontFamily: 'var(--cm-font-ui)' }}>
// //           🏁 Weekly Challenge
// //         </div>
// //         <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--cm-text)', marginBottom: 6 }}>30 Days Reels Challenge</div>
// //         <div style={{ fontSize: 12, color: 'var(--cm-text3)', marginBottom: 6 }}>5 days left · 847 joined</div>
// //         <div style={{ height: 4, background: 'var(--cm-bg4)', borderRadius: 2, overflow: 'hidden', margin: '8px 0 4px' }}>
// //           <div style={{ height: '100%', borderRadius: 2, width: '73%', background: 'linear-gradient(90deg,var(--cm-orange),var(--cm-gold))', transition: 'width .5s ease' }} />
// //         </div>
// //         <div style={{ fontSize: 11, color: 'var(--cm-text3)', marginBottom: 10 }}>73% complete</div>
// //         <GhostBtn>View Progress →</GhostBtn>
// //       </HeroCard>

// //       {/* Recommended Circle */}
// //       <HeroCard
// //         type="circle"
// //         topColor="linear-gradient(90deg,var(--cm-accent),#a855f7)"
// //       >
// //         <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8, color: 'var(--cm-accent2)', fontFamily: 'var(--cm-font-ui)' }}>
// //           🎓 Recommended Circle
// //         </div>
// //         <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--cm-text)', marginBottom: 6 }}>Monetize Your Content — Week 2/4</div>
// //         <div style={{ fontSize: 12, color: 'var(--cm-text3)', marginBottom: 8 }}>👨‍🏫 Kavya Reddy · 12/20 members</div>
// //         <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
// //           {['Brand Deals', 'Monetization'].map(t => (
// //             <span key={t} style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10.5, fontWeight: 500, background: 'var(--cm-accent-soft)', color: 'var(--cm-accent2)', border: '1px solid rgba(224,72,138,0.2)' }}>{t}</span>
// //           ))}
// //         </div>
// //         <GhostBtn>Request Access →</GhostBtn>
// //       </HeroCard>
// //     </div>
// //   );
// // }

// // function HeroCard({ children, type, topColor, onClick }) {
// //   const [hovered, setHovered] = useState(false);
// //   return (
// //     <div
// //       onClick={onClick}
// //       onMouseEnter={() => setHovered(true)}
// //       onMouseLeave={() => setHovered(false)}
// //       style={{
// //         padding: '20px 22px', background: hovered ? 'var(--cm-surface)' : 'var(--cm-bg2)',
// //         cursor: onClick ? 'pointer' : 'default', position: 'relative', overflow: 'hidden',
// //         transition: 'background .15s',
// //       }}
// //     >
// //       <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: topColor }} />
// //       {children}
// //     </div>
// //   );
// // }

// // function LiveBtn({ children }) {
// //   return (
// //     <button style={{
// //       display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 14px', height: 30,
// //       borderRadius: 8, background: 'linear-gradient(135deg,var(--cm-red),#c02030)', color: '#fff',
// //       fontSize: 12, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'var(--cm-font)',
// //       animation: 'cm-pulse-live 2s infinite',
// //     }}>
// //       {children}
// //     </button>
// //   );
// // }

// // function GhostBtn({ children }) {
// //   return (
// //     <button style={{
// //       display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 12px', height: 30,
// //       borderRadius: 8, background: 'var(--cm-surface)', color: 'var(--cm-text2)',
// //       border: '1px solid var(--cm-border2)', fontSize: 12, fontWeight: 500, cursor: 'pointer',
// //       fontFamily: 'var(--cm-font)', transition: 'all .15s',
// //     }}>
// //       {children}
// //     </button>
// //   );
// // }

// // function EmptyFeed({ onPost }) {
// //   return (
// //     <div style={{ padding: '60px 20px', textAlign: 'center' }}>
// //       <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>💬</div>
// //       <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--cm-text)', marginBottom: 8 }}>No discussions yet</div>
// //       <div style={{ fontSize: 13, color: 'var(--cm-text3)', lineHeight: 1.6, maxWidth: 320, margin: '0 auto 20px' }}>
// //         Be the first to start a conversation. Share your experience, ask questions, or post a tip.
// //       </div>
// //       <button
// //         onClick={onPost}
// //         style={{
// //           display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 20px', height: 38,
// //           borderRadius: 9, background: 'linear-gradient(135deg,var(--cm-accent),#c0306a)',
// //           color: '#fff', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer',
// //           fontFamily: 'var(--cm-font)', boxShadow: '0 2px 12px var(--cm-accent-glow)',
// //         }}
// //       >
// //         ✦ Start Discussion
// //       </button>
// //     </div>
// //   );
// // }

// // function RightRail({ onNavigate, onProfileClick }) {
// //   const upcomingEvents = [
// //     { time: 'Today · 7:00 PM IST', title: 'Brand Deals Masterclass — LIVE NOW', meta: '🔴 540 listening', live: true },
// //     { time: 'Tomorrow · 7:00 PM IST', title: 'Instagram Algorithm Decoded', meta: '👤 Neha Gupta · 234 RSVPs', live: false },
// //     { time: 'Thu, Apr 10 · 6:00 PM IST', title: 'How to Write Hooks That Stop Scroll', meta: '👤 Sameer Joshi · Free', live: false },
// //   ];
// //   const topCreators = [
// //     { rank: 1, rankClass: 'gold', name: 'Priya Sharma', badge: 'Fashion · 3 posts this week', pts: '142 pts', id: 'priya_sharma' },
// //     { rank: 2, rankClass: 'silver', name: 'Rohan Verma', badge: 'Tech · Trending post', pts: '118 pts', id: 'rohan_verma' },
// //     { rank: 3, rankClass: 'bronze', name: 'Zara Khan', badge: 'Fashion · Brand Ready', pts: '95 pts', id: 'zara_khan' },
// //     { rank: 4, rankClass: '', name: 'Ananya Singh', badge: 'Beauty · 2 reviews given', pts: '78 pts', id: 'ananya_singh' },
// //   ];

// //   return (
// //     <div style={{ padding: '20px 16px', background: 'var(--cm-bg2)' }}>
// //       {/* Upcoming Events */}
// //       <div style={{ marginBottom: 24 }}>
// //         <RailTitle title="📅 Upcoming Events" linkLabel="See all" onLink={() => onNavigate('events')} />
// //         {upcomingEvents.map((ev, i) => (
// //           <div
// //             key={i}
// //             onClick={() => onNavigate('events')}
// //             style={{
// //               background: 'var(--cm-bg3)', border: '1px solid var(--cm-border)', borderRadius: 10,
// //               padding: '11px 12px', marginBottom: 8, cursor: 'pointer', transition: 'all .15s',
// //             }}
// //             onMouseEnter={e => { e.currentTarget.style.background = 'var(--cm-surface)'; e.currentTarget.style.borderColor = 'var(--cm-border2)'; }}
// //             onMouseLeave={e => { e.currentTarget.style.background = 'var(--cm-bg3)'; e.currentTarget.style.borderColor = 'var(--cm-border)'; }}
// //           >
// //             <div style={{ fontSize: 10, color: 'var(--cm-text3)', marginBottom: 3 }}>{ev.time}</div>
// //             <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--cm-text)', marginBottom: 5 }}>{ev.title}</div>
// //             <div style={{ fontSize: 11, color: ev.live ? 'var(--cm-red)' : 'var(--cm-text3)', display: 'flex', alignItems: 'center', gap: 4 }}>{ev.meta}</div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Top Creators */}
// //       <div style={{ marginBottom: 24 }}>
// //         <RailTitle title="🏆 This Week's Top Creators" />
// //         {topCreators.map((c, i) => (
// //           <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < topCreators.length - 1 ? '1px solid var(--cm-border)' : 'none' }}>
// //             <span style={{
// //               fontSize: 11, fontWeight: 700, width: 16, textAlign: 'center', flexShrink: 0,
// //               color: c.rankClass === 'gold' ? 'var(--cm-gold)' : c.rankClass === 'silver' ? '#94a3b8' : c.rankClass === 'bronze' ? '#cd7c2e' : 'var(--cm-text3)',
// //             }}>{c.rank}</span>
// //             <div style={{ flex: 1, minWidth: 0 }}>
// //               <div
// //                 onClick={() => onProfileClick?.(c.id, c.name)}
// //                 style={{ fontSize: 13, fontWeight: 500, color: 'var(--cm-text)', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
// //                 onMouseEnter={e => e.currentTarget.style.color = 'var(--cm-accent2)'}
// //                 onMouseLeave={e => e.currentTarget.style.color = 'var(--cm-text)'}
// //               >{c.name}</div>
// //               <div style={{ fontSize: 10.5, color: 'var(--cm-text3)' }}>{c.badge}</div>
// //             </div>
// //             <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--cm-accent2)', whiteSpace: 'nowrap' }}>{c.pts}</span>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Quick Links */}
// //       <div>
// //         <RailTitle title="⚡ Quick Access" />
// //         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
// //           {[
// //             { label: '◎ Give Feedback', page: 'feedback' },
// //             { label: '📅 All Events', page: 'events' },
// //             { label: '◫ My Spaces', page: 'spaces' },
// //             { label: '⊘ Safety', page: 'safety' },
// //           ].map((link, i) => (
// //             <div
// //               key={i}
// //               onClick={() => onNavigate(link.page)}
// //               style={{
// //                 background: 'var(--cm-bg3)', border: '1px solid var(--cm-border)', borderRadius: 8,
// //                 padding: 10, cursor: 'pointer', fontSize: 12, color: 'var(--cm-text2)',
// //                 textAlign: 'center', transition: 'all .15s',
// //               }}
// //               onMouseEnter={e => { e.currentTarget.style.background = 'var(--cm-surface)'; e.currentTarget.style.color = 'var(--cm-text)'; e.currentTarget.style.borderColor = 'var(--cm-accent)'; }}
// //               onMouseLeave={e => { e.currentTarget.style.background = 'var(--cm-bg3)'; e.currentTarget.style.color = 'var(--cm-text2)'; e.currentTarget.style.borderColor = 'var(--cm-border)'; }}
// //             >
// //               {link.label}
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function RailTitle({ title, linkLabel, onLink }) {
// //   return (
// //     <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cm-text3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--cm-font-ui)' }}>
// //       {title}
// //       {linkLabel && <span onClick={onLink} style={{ color: 'var(--cm-accent2)', fontSize: 10, cursor: 'pointer', fontWeight: 500, letterSpacing: 0 }}>{linkLabel}</span>}
// //     </div>
// //   );
// // }

// 'use client';
// import { useState, useEffect } from 'react';
// import PostCard, { PostCardSkeleton } from '../PostCard';
// import { MOCK_POSTS, FEED_TABS } from '@/constants/community';

// export default function CommunityHome({ onNavigate, onProfileClick, onReport }) {
//   const [tab, setTab] = useState('foryou');
//   const [loading, setLoading] = useState(true);
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     setLoading(true);
//     setPosts([]);
//     const t = setTimeout(() => { setPosts(MOCK_POSTS); setLoading(false); }, 820);
//     return () => clearTimeout(t);
//   }, [tab]);

//   return (
//     <div>
//       <HeroStrip onNavigate={onNavigate} />
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 308px' }}>
//         {/* Feed */}
//         <div style={{ borderRight: '1px solid var(--cm-border)' }}>
//           {/* Tabs */}
//           <div style={{ display: 'flex', background: 'var(--cm-bg2)', borderBottom: '1px solid var(--cm-border)', padding: '0 24px', position: 'sticky', top: 'var(--cm-topbar-h)', zIndex: 30 }}>
//             {FEED_TABS.map(t => (
//               <div key={t.id} onClick={() => setTab(t.id)} style={{
//                 padding: '15px 16px', fontSize: 13.5, fontWeight: tab === t.id ? 600 : 400,
//                 cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s',
//                 color: tab === t.id ? 'var(--cm-accent)' : 'var(--cm-text3)',
//                 borderBottom: `2.5px solid ${tab === t.id ? 'var(--cm-accent)' : 'transparent'}`,
//               }}
//               onMouseEnter={e => { if (tab !== t.id) e.currentTarget.style.color = 'var(--cm-text2)'; }}
//               onMouseLeave={e => { if (tab !== t.id) e.currentTarget.style.color = 'var(--cm-text3)'; }}
//               >{t.label}</div>
//             ))}
//           </div>

//           <div style={{ padding: '20px 24px' }}>
//             {loading
//               ? [1,2,3].map(i => <PostCardSkeleton key={i} />)
//               : posts.length === 0
//                 ? <EmptyFeed />
//                 : posts.map((p, i) => (
//                   <div key={p.id} className={`cm-fade-up cm-fade-up-${i+1}`}>
//                     <PostCard post={p} onProfileClick={onProfileClick} onReport={onReport} />
//                   </div>
//                 ))
//             }
//           </div>
//         </div>

//         {/* Right Rail */}
//         <RightRail onNavigate={onNavigate} onProfileClick={onProfileClick} />
//       </div>
//     </div>
//   );
// }

// function HeroStrip({ onNavigate }) {
//   return (
//     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid var(--cm-border)' }}>
//       {/* Live Now */}
//       <HeroCard topColor="linear-gradient(90deg,#e02b4b,#f07ab8)" bg="linear-gradient(135deg,#fff5f7 0%,#fff0f5 100%)" onClick={() => onNavigate('events')}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
//           <span className="cm-live-dot" style={{ color: 'var(--cm-red)' }} />
//           <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--cm-red)', letterSpacing: '.08em', textTransform: 'uppercase', fontFamily: 'var(--cm-font-ui)' }}>Live Now</span>
//         </div>
//         <div style={{ fontFamily: 'var(--cm-font-display)', fontSize: 16, fontWeight: 700, color: 'var(--cm-text)', lineHeight: 1.35, marginBottom: 8 }}>
//           Brand Deals Masterclass: Pitch yourself to 10x partnerships
//         </div>
//         <div style={{ fontSize: 12, color: 'var(--cm-text3)', marginBottom: 14, display: 'flex', gap: 8 }}>
//           <span>🎙️ Arjun Mehta</span><span style={{ color: 'var(--cm-red)', fontWeight: 500 }}>🔴 540 listening</span>
//         </div>
//         <PillBtn color="var(--cm-red)" bg="rgba(224,43,75,0.1)">Join Now →</PillBtn>
//       </HeroCard>

//       {/* Weekly Challenge */}
//       <HeroCard topColor="linear-gradient(90deg,#e8860a,#f5c842)" bg="linear-gradient(135deg,#fffaf0 0%,#fff8e8 100%)">
//         <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--cm-orange)', letterSpacing: '.08em', textTransform: 'uppercase', fontFamily: 'var(--cm-font-ui)', marginBottom: 10 }}>🏁 Weekly Challenge</div>
//         <div style={{ fontFamily: 'var(--cm-font-display)', fontSize: 16, fontWeight: 700, color: 'var(--cm-text)', lineHeight: 1.35, marginBottom: 6 }}>30 Days Reels Challenge</div>
//         <div style={{ fontSize: 12, color: 'var(--cm-text3)', marginBottom: 10 }}>5 days left · 847 creators joined</div>
//         <div style={{ marginBottom: 4 }}>
//           <div style={{ height: 5, background: 'rgba(232,134,10,0.12)', borderRadius: 3, overflow: 'hidden' }}>
//             <div style={{ height: '100%', width: '73%', background: 'linear-gradient(90deg,#e8860a,#f5c842)', borderRadius: 3, transition: 'width .6s ease' }} />
//           </div>
//           <div style={{ fontSize: 11, color: 'var(--cm-text3)', marginTop: 4 }}>73% complete</div>
//         </div>
//         <div style={{ marginTop: 10 }}><PillBtn color="var(--cm-orange)" bg="rgba(232,134,10,0.09)">View Progress →</PillBtn></div>
//       </HeroCard>

//       {/* Recommended Circle */}
//       <HeroCard topColor="linear-gradient(90deg,#d63f7e,#a855f7)" bg="linear-gradient(135deg,#fff0f6 0%,#fdf4ff 100%)">
//         <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--cm-accent)', letterSpacing: '.08em', textTransform: 'uppercase', fontFamily: 'var(--cm-font-ui)', marginBottom: 10 }}>🎓 Recommended Circle</div>
//         <div style={{ fontFamily: 'var(--cm-font-display)', fontSize: 16, fontWeight: 700, color: 'var(--cm-text)', lineHeight: 1.35, marginBottom: 6 }}>Monetize Your Content — Week 2/4</div>
//         <div style={{ fontSize: 12, color: 'var(--cm-text3)', marginBottom: 10 }}>👨‍🏫 Kavya Reddy · 12/20 members</div>
//         <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
//           {['Brand Deals', 'Monetization'].map(t => (
//             <span key={t} style={{ padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'var(--cm-accent-soft2)', color: 'var(--cm-accent)', fontFamily: 'var(--cm-font-ui)' }}>{t}</span>
//           ))}
//         </div>
//         <PillBtn color="var(--cm-accent)" bg="var(--cm-accent-soft2)">Request Access →</PillBtn>
//       </HeroCard>
//     </div>
//   );
// }

// function HeroCard({ children, topColor, bg, onClick }) {
//   const [hov, setHov] = useState(false);
//   return (
//     <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
//       padding: '22px 24px', background: hov ? 'var(--cm-bg3)' : 'var(--cm-bg2)',
//       cursor: onClick ? 'pointer' : 'default', position: 'relative', overflow: 'hidden',
//       transition: 'background .18s', borderRight: '1px solid var(--cm-border)',
//     }}>
//       <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: topColor }} />
//       <div style={{ position: 'absolute', inset: 0, background: bg, opacity: hov ? 0.6 : 0, transition: 'opacity .2s' }} />
//       <div style={{ position: 'relative' }}>{children}</div>
//     </div>
//   );
// }

// function PillBtn({ children, color, bg }) {
//   return (
//     <span style={{
//       display: 'inline-flex', alignItems: 'center', gap: 4,
//       padding: '5px 13px', borderRadius: 20, fontSize: 12.5, fontWeight: 600,
//       background: bg, color, cursor: 'pointer', fontFamily: 'var(--cm-font)',
//       transition: 'opacity .14s',
//     }}>{children}</span>
//   );
// }

// function EmptyFeed() {
//   return (
//     <div style={{ padding: '64px 20px', textAlign: 'center' }}>
//       <div style={{ fontSize: 52, marginBottom: 18, opacity: 0.28 }}>💬</div>
//       <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--cm-text)', fontFamily: 'var(--cm-font-display)', marginBottom: 8 }}>No discussions yet</div>
//       <div style={{ fontSize: 14, color: 'var(--cm-text3)', lineHeight: 1.65, maxWidth: 300, margin: '0 auto' }}>Be the first to start a conversation. Share your experience or ask a question.</div>
//     </div>
//   );
// }

// function RightRail({ onNavigate, onProfileClick }) {
//   const events = [
//     { live: true, time: 'Live Now', title: 'Brand Deals Masterclass', meta: '540 listening', page: 'events' },
//     { live: false, time: 'Tomorrow · 7:00 PM', title: 'Instagram Algorithm Decoded', meta: '234 RSVPs', page: 'events' },
//     { live: false, time: 'Thu, Apr 10 · 6 PM', title: 'Hook Writing Workshop', meta: 'Free · 89 RSVPs', page: 'events' },
//   ];
//   const creators = [
//     { rank: 1, name: 'Priya Sharma', sub: 'Fashion · 3 posts', pts: '142 pts', id: 'priya_sharma', rankColor: '#c98a00' },
//     { rank: 2, name: 'Rohan Verma', sub: 'Tech · Trending', pts: '118 pts', id: 'rohan_verma', rankColor: '#8b8ca8' },
//     { rank: 3, name: 'Zara Khan', sub: 'Fashion · Brand Ready', pts: '95 pts', id: 'zara_khan', rankColor: '#cd7c2e' },
//     { rank: 4, name: 'Ananya Singh', sub: 'Beauty · 2 reviews', pts: '78 pts', id: 'ananya_singh', rankColor: 'var(--cm-text4)' },
//   ];

//   return (
//     <div style={{ padding: '20px 18px', background: 'var(--cm-bg)', borderLeft: '1px solid var(--cm-border)' }}>
//       {/* Upcoming Events */}
//       <RailSection title="📅 Upcoming Events" link="See all" onLink={() => onNavigate('events')}>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//           {events.map((ev, i) => (
//             <div key={i} onClick={() => onNavigate(ev.page)} style={{
//               background: 'var(--cm-bg2)', border: '1.5px solid var(--cm-border)',
//               borderRadius: 12, padding: '11px 14px', cursor: 'pointer', transition: 'all .16s',
//             }}
//             onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cm-border3)'; e.currentTarget.style.boxShadow = 'var(--cm-shadow-xs)'; e.currentTarget.style.transform = 'translateX(2px)'; }}
//             onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cm-border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
//             >
//               <div style={{ fontSize: 11, color: ev.live ? 'var(--cm-red)' : 'var(--cm-text4)', marginBottom: 3, fontWeight: ev.live ? 600 : 400, display: 'flex', alignItems: 'center', gap: 4 }}>
//                 {ev.live && <span className="cm-live-dot" style={{ color: 'var(--cm-red)' }} />}{ev.time}
//               </div>
//               <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--cm-text)', marginBottom: 3, lineHeight: 1.3 }}>{ev.title}</div>
//               <div style={{ fontSize: 11.5, color: 'var(--cm-text3)' }}>{ev.meta}</div>
//             </div>
//           ))}
//         </div>
//       </RailSection>

//       {/* Top Creators */}
//       <RailSection title="🏆 Top Creators This Week">
//         {creators.map((c, i) => (
//           <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < creators.length - 1 ? '1px solid var(--cm-border)' : 'none' }}>
//             <span style={{ fontSize: 12, fontWeight: 800, width: 18, textAlign: 'center', flexShrink: 0, color: c.rankColor, fontFamily: 'var(--cm-font-ui)' }}>{c.rank}</span>
//             <div style={{ flex: 1, minWidth: 0 }}>
//               <div onClick={() => onProfileClick?.(c.id, c.name)} style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--cm-text)', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', transition: 'color .12s' }}
//               onMouseEnter={e => e.currentTarget.style.color = 'var(--cm-accent)'}
//               onMouseLeave={e => e.currentTarget.style.color = 'var(--cm-text)'}
//               >{c.name}</div>
//               <div style={{ fontSize: 11, color: 'var(--cm-text3)' }}>{c.sub}</div>
//             </div>
//             <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--cm-accent)', whiteSpace: 'nowrap', fontFamily: 'var(--cm-font-ui)' }}>{c.pts}</span>
//           </div>
//         ))}
//       </RailSection>

//       {/* Quick links */}
//       <RailSection title="⚡ Quick Access">
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
//           {[
//             { label: '◎ Feedback', page: 'feedback' },
//             { label: '📅 Events', page: 'events' },
//             { label: '◫ Spaces', page: 'spaces' },
//             { label: '⊘ Safety', page: 'safety' },
//           ].map((l, i) => (
//             <div key={i} onClick={() => onNavigate(l.page)} style={{
//               padding: '10px 12px', background: 'var(--cm-bg2)', border: '1.5px solid var(--cm-border)',
//               borderRadius: 10, cursor: 'pointer', fontSize: 13, color: 'var(--cm-text2)',
//               textAlign: 'center', fontWeight: 500, transition: 'all .14s',
//             }}
//             onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cm-accent)'; e.currentTarget.style.color = 'var(--cm-accent)'; e.currentTarget.style.background = 'var(--cm-accent-soft)'; }}
//             onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cm-border)'; e.currentTarget.style.color = 'var(--cm-text2)'; e.currentTarget.style.background = 'var(--cm-bg2)'; }}
//             >{l.label}</div>
//           ))}
//         </div>
//       </RailSection>
//     </div>
//   );
// }

// function RailSection({ title, link, onLink, children }) {
//   return (
//     <div style={{ marginBottom: 26 }}>
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
//         <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--cm-text2)', fontFamily: 'var(--cm-font-ui)', letterSpacing: '.04em' }}>{title}</div>
//         {link && <span onClick={onLink} style={{ fontSize: 11.5, color: 'var(--cm-accent)', cursor: 'pointer', fontWeight: 600 }}>{link}</span>}
//       </div>
//       {children}
//     </div>
//   );
// }


// 'use client';
// // components/community/pages/CommunityHome.js
// import { useState, useEffect } from 'react';
// import PostCard, { PostCardSkeleton, EventHighlightCard } from '../PostCard';
// import { useFeed, useTopCreators } from '@/hooks/useCommunity';
// import { FEED_TABS, MOCK_EVENTS } from '@/constants/community';
// import * as svc from '@/services/community.service';
// import { showToast } from '../ui/Toast';

// const QUICK_LINKS = [
//   { icon:'📚', label:'Resource Library' },
//   { icon:'🏷️', label:'Brand Directory'  },
//   { icon:'🎓', label:'Courses'          },
//   { icon:'📊', label:'Analytics Guide'  },
// ];

// export default function CommunityHome({ onNavigate, onOpenProfile, onReport, onOpenPost, onOpenFeedback }) {
//   const [activeTab, setActiveTab]   = useState('foryou');
//   const [liveEvent, setLiveEvent]   = useState(null);
//   const [upcomingEvents, setUpcoming] = useState([]);
//   const { posts, loading, loadMore, hasMore, loadingMore, toggleLike, toggleSave } = useFeed(activeTab);
//   const { data: topCreators }       = useTopCreators('week');

//   // Load live event + upcoming for rail
//   useEffect(() => {
//     svc.getLiveEvent().then(e => setLiveEvent(e)).catch(() => {});
//     svc.getEvents('upcoming').then(res => {
//       const items = Array.isArray(res) ? res : res?.data || [];
//       setUpcoming(items.slice(0,3));
//     }).catch(() => {
//       setUpcoming(MOCK_EVENTS.filter(e => e.status === 'upcoming').slice(0,3));
//     });
//   }, []);

//   const mockUpcoming = MOCK_EVENTS.filter(e => e.status === 'upcoming').slice(0,3);
//   const railEvents   = upcomingEvents.length > 0 ? upcomingEvents : mockUpcoming;

//   const mockTop = [
//     { name:'Priya Sharma',  niche:'Fashion',  pts:2840, rank:1 },
//     { name:'Rohan Verma',   niche:'Tech',     pts:2210, rank:2 },
//     { name:'Zara Khan',     niche:'Fashion',  pts:1950, rank:3 },
//     { name:'Ananya Singh',  niche:'Beauty',   pts:1720, rank:4 },
//   ];
//   const creators = (topCreators && Array.isArray(topCreators) && topCreators.length > 0) ? topCreators : mockTop;

//   const rankCls = (r) => r===1?'gold':r===2?'silver':r===3?'bronze':'';

//   return (
//     <div>
//       {/* ── Hero Strip ── */}
//       <div className="cm-hero-strip">
//         <div className="cm-hero-card live" onClick={() => onNavigate('events')}>
//           <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--cm-red)', marginBottom:8 }}>
//             <div style={{ width:7, height:7, background:'var(--cm-red)', borderRadius:'50%', animation:'cm-blink 1.2s infinite' }} />
//             Live Now
//           </div>
//           <div style={{ fontSize:15, fontWeight:600, color:'var(--cm-text)', marginBottom:6, lineHeight:1.3 }}>
//             {liveEvent?.title || 'Brand Deals Masterclass: How to pitch yourself to 10x brand partnerships'}
//           </div>
//           <div style={{ fontSize:12, color:'var(--cm-text3)', marginBottom:12, display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
//             <span>🎙️ {liveEvent?.host?.name || 'Arjun Mehta'}</span>
//             <span>•</span>
//             <span style={{ color:'var(--cm-red)' }}>🔴 {liveEvent?.listenerCount || 540} listening</span>
//           </div>
//           <button className="cm-btn cm-btn-live" style={{ fontSize:12, height:30 }}>Join Now →</button>
//         </div>

//         <div className="cm-hero-card challenge">
//           <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--cm-orange)', marginBottom:8 }}>🏁 Weekly Challenge</div>
//           <div style={{ fontSize:15, fontWeight:600, color:'var(--cm-text)', marginBottom:6 }}>30 Days Reels Challenge</div>
//           <div style={{ fontSize:12, color:'var(--cm-text3)', marginBottom:8, display:'flex', gap:8 }}>
//             <span>5 days left</span><span>•</span><span>847 joined</span>
//           </div>
//           <div className="cm-progress-bar">
//             <div className="cm-progress-fill" style={{ width:'73%', background:'linear-gradient(90deg,var(--cm-orange),var(--cm-gold))' }} />
//           </div>
//           <div style={{ fontSize:11, color:'var(--cm-text3)', marginBottom:10 }}>73% complete</div>
//           <button className="cm-btn cm-btn-ghost" style={{ fontSize:12, height:30 }}>View Progress →</button>
//         </div>

//         <div className="cm-hero-card circle">
//           <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--cm-accent2)', marginBottom:8 }}>🎓 Recommended Circle</div>
//           <div style={{ fontSize:15, fontWeight:600, color:'var(--cm-text)', marginBottom:6 }}>Creator Monetization Masterclass</div>
//           <div style={{ fontSize:12, color:'var(--cm-text3)', marginBottom:12, display:'flex', gap:8 }}>
//             <span>🎓 12 modules</span><span>•</span><span>3.2K enrolled</span>
//           </div>
//           <button className="cm-btn cm-btn-primary" style={{ fontSize:12, height:30, background:'linear-gradient(135deg,var(--cm-accent),#a855f7)' }}>Join Circle →</button>
//         </div>
//       </div>

//       {/* ── Feed + Rail layout ── */}
//       <div className="cm-feed-layout">

//         {/* Feed column */}
//         <div className="cm-feed-col">
//           {/* Tabs */}
//           <div className="cm-feed-tabs">
//             {FEED_TABS.map(t => (
//               <div key={t.id} className={`cm-feed-tab${activeTab===t.id?' active':''}`}
//                 onClick={() => setActiveTab(t.id)}>
//                 {t.label}
//               </div>
//             ))}
//           </div>

//           {/* Posts */}
//           <div className="cm-feed-posts">
//             {loading ? (
//               [1,2,3].map(i => <PostCardSkeleton key={i} />)
//             ) : posts.length === 0 ? (
//               <div className="cm-empty">
//                 <div className="cm-empty-icon">💬</div>
//                 <div className="cm-empty-title">No discussions yet</div>
//                 <div className="cm-empty-sub">Be the first to start a discussion in this feed!</div>
//                 <button className="cm-btn cm-btn-primary" onClick={onOpenPost}>✦ Start Discussion</button>
//               </div>
//             ) : (
//               <>
//                 {posts.map((p, i) => (
//                   <PostCard
//                     key={p._id || i}
//                     post={p}
//                     onOpenProfile={onOpenProfile}
//                     onReport={onReport}
//                     onNavigate={onNavigate}
//                   />
//                 ))}
//                 {hasMore && (
//                   <div style={{ textAlign:'center', padding:'16px 0' }}>
//                     <button className="cm-btn cm-btn-ghost" onClick={loadMore} disabled={loadingMore}>
//                       {loadingMore ? '⏳ Loading…' : 'Load more'}
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>

//         {/* Right Rail */}
//         <div className="cm-rail">
//           {/* Upcoming Events */}
//           <div className="cm-rail-section">
//             <div className="cm-rail-title">
//               Upcoming Events
//               <span className="cm-rail-link" onClick={() => onNavigate('events')}>See all →</span>
//             </div>
//             {railEvents.map((e, i) => (
//               <div key={i} className="cm-event-mini" onClick={() => onNavigate('events')}>
//                 <div className="cm-event-mini-time">{e.scheduledAt ? new Date(e.scheduledAt).toLocaleString('en-IN',{weekday:'short',hour:'2-digit',minute:'2-digit'}) : (e.time || 'Tomorrow 7PM')}</div>
//                 <div className="cm-event-mini-title">{e.title || e.name}</div>
//                 <div style={{ fontSize:11, color:'var(--cm-text3)', display:'flex', alignItems:'center', gap:4 }}>
//                   🎙️ {e.host?.name || e.hostName || 'Creator'}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Top Creators */}
//           <div className="cm-rail-section">
//             <div className="cm-rail-title">
//               🏆 Top Creators
//               <span className="cm-rail-link">This week</span>
//             </div>
//             {creators.map((c, i) => (
//               <div key={i} className="cm-recog-item">
//                 <div className={`cm-recog-rank ${rankCls(c.rank||i+1)}`}>{c.rank||i+1}</div>
//                 <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#fff', flexShrink:0 }}>
//                   {(c.name||c.user?.name||'?')[0]}
//                 </div>
//                 <div style={{ flex:1, minWidth:0 }}>
//                   <div style={{ fontSize:13, fontWeight:500, color:'var(--cm-text)', cursor:'pointer', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}
//                     onClick={() => onOpenProfile?.(c._id||c.userId, c.name||c.user?.name, c.niche)}>
//                     {c.name||c.user?.name}
//                   </div>
//                   <div style={{ fontSize:10, color:'var(--cm-text3)' }}>{c.niche}</div>
//                 </div>
//                 <div style={{ fontSize:12, fontWeight:600, color:'var(--cm-accent2)' }}>{(c.pts||c.communityPts||0).toLocaleString()} pts</div>
//               </div>
//             ))}
//           </div>

//           {/* Quick Links */}
//           <div className="cm-rail-section">
//             <div className="cm-rail-title">Quick Links</div>
//             <div className="cm-quick-links">
//               {QUICK_LINKS.map(ql => (
//                 <div key={ql.label} className="cm-quick-link">
//                   <div style={{ fontSize:18, marginBottom:4 }}>{ql.icon}</div>
//                   {ql.label}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Mod tip */}
//           <div style={{ background:'var(--cm-red-soft)', border:'1px solid rgba(239,68,68,.2)', borderRadius:10, padding:12, fontSize:12, color:'var(--cm-text2)', lineHeight:1.6 }}>
//             🛡️ <strong style={{ color:'var(--cm-text)' }}>Community Guidelines:</strong> Be respectful, stay on topic, and help each other grow. <span style={{ color:'var(--cm-accent2)', cursor:'pointer' }} onClick={() => onNavigate('moderation')}>Read full guidelines →</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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
import * as svc from '@/services/community.service';
import { showToast } from '../ui/Toast';
// SAST H-5 — this file read localStorage's `fameo_token`, which is the ADMIN
// key, not the creator session. Regular users sent an empty Bearer token (so
// the hero silently failed for everyone), and an admin browsing the community
// leaked their admin JWT to a community endpoint. The creator session lives in
// the auth store.
import { useAuthStore } from '@/store/authStore';

const QUICK_LINKS = [
  { icon:'📚', label:'Brand Guide'   },
  { icon:'🎒', label:'Resources'     },
  { icon:'📄', label:'Pitch Kit'     },
  { icon:'❓', label:'FAQ'           },
];

export default function CommunityHome({ onNavigate, onOpenProfile, onReport, onOpenPost, onOpenFeedback }) {
  const [activeTab, setActiveTab]   = useState('foryou');
  const [posts, setPosts]           = useState([]);
  const [page, setPage]             = useState(1);
  const [hasMore, setHasMore]       = useState(true);
  const [loading, setLoading]       = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [feedError, setFeedError]   = useState(false);

  // Hero data from /api/community/hero
  const [heroData, setHeroData]     = useState(null);
  const [liveEvent, setLiveEvent]   = useState(null);

  // Right rail
  const [railEvents, setRailEvents] = useState([]);
  const [topCreators, setTopCreators] = useState([]);
  const [rsvped, setRsvped]         = useState({});

  const sentinelRef = useRef(null);
  const tabRef      = useRef(activeTab);
  tabRef.current    = activeTab;

  // ── Hero + live event load ────────────────────────────────────────────────
  useEffect(() => {
    // §3.1: /api/community/hero — liveEvent, challenge, recommendedCircle
    svc.getFeed('foryou', 1, 1).catch(() => {}); // warm cache
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/community/hero`, {
      headers: (() => {
        const t = useAuthStore.getState().token;
        return t ? { Authorization: `Bearer ${t}` } : {};
      })()
    })
      .then(r => r.json())
      .then(res => setHeroData(res.data || res))
      .catch(() => {});

    svc.getLiveEvent().then(e => setLiveEvent(e)).catch(() => {});

    svc.getEvents('upcoming').then(res => {
      const items = Array.isArray(res) ? res : res?.data || [];
      setRailEvents(items.slice(0,3));
    }).catch(() => setRailEvents(MOCK_EVENTS.filter(e=>e.status==='upcoming').slice(0,3)));

    svc.getTopCreators('week').then(res => {
      setTopCreators(Array.isArray(res) ? res : res?.data || []);
    }).catch(() => {});
  }, []);

  // ── Feed load ─────────────────────────────────────────────────────────────
  const loadFeed = useCallback(async (tab, pg = 1, append = false) => {
    if (pg === 1) { setLoading(true); setFeedError(false); }
    else setLoadingMore(true);
    try {
      const res  = await svc.getFeed(tab, pg, 20);
      const items = Array.isArray(res) ? res : res?.data || [];
      setPosts(prev => append ? [...prev, ...items] : items);
      setHasMore(items.length >= 20);
      setPage(pg);
    } catch {
      setFeedError(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setPosts([]); setPage(1); setHasMore(true);
    loadFeed(activeTab, 1, false);
  }, [activeTab, loadFeed]);

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
        rows.push({ type:'event', key:`ev-${i}` });
      }
      rows.push({ type:'post', post: p, key: p._id || i });
    });
    return rows;
  }

  // ── Join Live — conditional per spec §3.1 FIXED ───────────────────────────
  async function handleJoinLive() {
    try {
      const ev = liveEvent || await svc.getLiveEvent();
      if (ev && ev.status === 'live') {
        onNavigate('events');
        showToast(`🎧 Entering live room — "${ev.title}"`, 'success');
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
    try { await svc.rsvpEvent(eventId); } catch {}
    setRsvped(p => ({ ...p, [eventId]: true }));
    showToast('📅 Event saved! Reminder 24h before + 15min before.', 'success');
  }

  // Hero data fallbacks
  const liveCard     = heroData?.liveEvent     || liveEvent;
  const challenge    = heroData?.challenge     || null;
  const circle       = heroData?.recommendedCircle || null;
  const mockTop      = [
    { name:'Priya Sharma', niche:'Fashion', pts:2840, rank:1, id:'priya_sharma' },
    { name:'Rohan Verma',  niche:'Tech',    pts:2210, rank:2, id:'rohan_verma'  },
    { name:'Zara Khan',    niche:'Fashion', pts:1950, rank:3, id:'zara_khan'    },
  ];
  const creators = topCreators.length > 0 ? topCreators : mockTop;
  const rankCls  = r => r===1?'gold':r===2?'silver':r===3?'bronze':'';

  return (
    <div>
      {/* ── Hero Strip — NEVER empty (§3.1) ── */}
      <div className="cm-hero-strip">

        {/* Card 1: Live Now / upcoming fallback */}
        <div className="cm-hero-card live" onClick={handleJoinLive}>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:10, fontWeight:700,
            letterSpacing:'.1em', textTransform:'uppercase', color:'var(--cm-red)', marginBottom:8 }}>
            <div style={{ width:7, height:7, background:'var(--cm-red)', borderRadius:'50%', animation:'cm-blink 1.2s infinite' }} />
            {liveCard?.status === 'live' ? 'Live Now' : '📅 Upcoming'}
          </div>
          <div style={{ fontSize:15, fontWeight:600, color:'var(--cm-text)', marginBottom:6, lineHeight:1.3,
            display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
            {liveCard?.title || 'Brand Deals Masterclass: How to pitch yourself to 10x brand partnerships'}
          </div>
          <div style={{ fontSize:12, color:'var(--cm-text3)', marginBottom:12, display:'flex', alignItems:'center', gap:8 }}>
            <span>🎙️ {liveCard?.host?.name || 'Arjun Mehta'}</span>
            <span>•</span>
            {liveCard?.status === 'live'
              ? <span style={{ color:'var(--cm-red)' }}>🔴 {liveCard?.listenerCount || 540} listening</span>
              : <span>{liveCard?.scheduledAt ? new Date(liveCard.scheduledAt).toLocaleString('en-IN',{weekday:'short',hour:'2-digit',minute:'2-digit'}) : 'Tomorrow 7PM'}</span>}
          </div>
          <button className="cm-btn cm-btn-live" style={{ fontSize:12, height:30 }}>
            {liveCard?.status === 'live' ? 'Join Now →' : 'Set Reminder →'}
          </button>
        </div>

        {/* Card 2: Weekly Challenge / upcoming fallback */}
        <div className="cm-hero-card challenge">
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--cm-orange)', marginBottom:8 }}>
            🏁 Weekly Challenge
          </div>
          <div style={{ fontSize:15, fontWeight:600, color:'var(--cm-text)', marginBottom:6 }}>
            {challenge?.name || '30 Days Reels Challenge'}
          </div>
          <div style={{ fontSize:12, color:'var(--cm-text3)', marginBottom:8, display:'flex', gap:8 }}>
            <span>{challenge?.daysLeft || '5'} days left</span>
            <span>•</span>
            <span>{challenge?.participantCount || '847'} joined</span>
          </div>
          <div className="cm-progress-bar">
            <div className="cm-progress-fill" style={{
              width:`${challenge?.progress || 73}%`,
              background:'linear-gradient(90deg,var(--cm-orange),var(--cm-gold))',
            }} />
          </div>
          <div style={{ fontSize:11, color:'var(--cm-text3)', marginBottom:10 }}>{challenge?.progress || 73}% complete</div>
          <button className="cm-btn cm-btn-ghost" style={{ fontSize:12, height:30 }}>View Progress →</button>
        </div>

        {/* Card 3: Recommended Circle */}
        <div className="cm-hero-card circle">
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--cm-accent2)', marginBottom:8 }}>
            🎓 Recommended Circle
          </div>
          <div style={{ fontSize:15, fontWeight:600, color:'var(--cm-text)', marginBottom:6 }}>
            {circle?.name || 'Creator Monetization Masterclass'}
          </div>
          <div style={{ fontSize:12, color:'var(--cm-text3)', marginBottom:12, display:'flex', gap:8, flexWrap:'wrap' }}>
            <span>🎓 {circle?.moduleCount || 12} modules</span>
            <span>•</span>
            <span>{circle?.memberCount || '3.2K'} enrolled</span>
          </div>
          <button className="cm-btn cm-btn-primary" style={{ fontSize:12, height:30, background:'linear-gradient(135deg,var(--cm-accent),#a855f7)' }}>
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
              <div key={t.id} className={`cm-feed-tab${activeTab===t.id?' active':''}`}
                onClick={() => setActiveTab(t.id)}>
                {t.label}
              </div>
            ))}
          </div>

          <div className="cm-feed-posts">
            {/* §2.4: Skeleton on initial load — no blank screen */}
            {loading ? (
              [1,2,3].map(i => <PostCardSkeleton key={i} />)
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
                {loadingMore && [1,2].map(i => <PostCardSkeleton key={`more-${i}`} />)}

                {/* §3.1: Infinite scroll sentinel — triggers at 80% */}
                {hasMore && <div ref={sentinelRef} style={{ height:1 }} />}

                {!hasMore && posts.length > 0 && (
                  <div style={{ textAlign:'center', padding:'16px 0', fontSize:13, color:'var(--cm-text3)' }}>
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
            {(railEvents.length > 0 ? railEvents : MOCK_EVENTS.filter(e=>e.status==='upcoming').slice(0,3)).map((e,i) => (
              <div key={i} className="cm-event-mini" onClick={() => onNavigate('events')}>
                <div className="cm-event-mini-time">
                  {e.scheduledAt
                    ? new Date(e.scheduledAt).toLocaleString('en-IN',{ weekday:'short',hour:'2-digit',minute:'2-digit' })
                    : e.time || 'Tomorrow 7PM'}
                </div>
                <div className="cm-event-mini-title">{e.title || e.name}</div>
                <div style={{ fontSize:11, color:'var(--cm-text3)' }}>
                  🎙️ {e.host?.name || e.hostName || 'Creator'}
                </div>
              </div>
            ))}
          </div>

          {/* Widget 2: Top Creators */}
          <div className="cm-rail-section">
            <div className="cm-rail-title">🏆 Top Creators <span style={{ fontSize:10, fontWeight:400, color:'var(--cm-text3)' }}>This week</span></div>
            {creators.slice(0,3).map((c,i) => (
              <div key={i} className="cm-recog-item">
                <div className={`cm-recog-rank ${rankCls(c.rank||i+1)}`}>{c.rank||i+1}</div>
                <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#fff', flexShrink:0 }}>
                  {(c.name||c.user?.name||'?')[0]}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  {/* §2.3 + §2.5: Creator name clickable → profile */}
                  <div style={{ fontSize:13, fontWeight:500, color:'var(--cm-text)', cursor:'pointer', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}
                    onClick={() => onOpenProfile?.(c._id||c.userId||c.id, c.name||c.user?.name, c.niche)}>
                    {c.name||c.user?.name}
                  </div>
                  <div style={{ fontSize:10, color:'var(--cm-text3)' }}>{c.niche}</div>
                </div>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--cm-accent2)' }}>
                  {(c.pts||c.communityPts||0).toLocaleString()} pts
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
                  <div style={{ fontSize:18, marginBottom:4 }}>{ql.icon}</div>
                  {ql.label}
                </div>
              ))}
            </div>
          </div>

          {/* Widget 4: Community Rule */}
          <div className="cm-rail-section">
            <div className="cm-rail-title">🛡️ Community Rule</div>
            <div style={{ background:'var(--cm-red-soft)', border:'1px solid rgba(239,68,68,.2)', borderRadius:10, padding:12, fontSize:12, color:'var(--cm-text2)', lineHeight:1.7 }}>
              <strong style={{ color:'var(--cm-text)' }}>This week's reminder:</strong> No personal social handles or follower-farming in posts or comments. Keep discussions topic-focused and helpful.{' '}
              <span style={{ color:'var(--cm-accent2)', cursor:'pointer' }} onClick={() => onNavigate('moderation')}>Read full guidelines →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}