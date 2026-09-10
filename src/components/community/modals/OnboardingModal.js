// 'use client';
// import { useState } from 'react';
// import { NICHE_OPTIONS } from '@/constants/community';

// export default function OnboardingModal({ onComplete }) {
//   const [step, setStep] = useState(1);
//   const [selectedNiches, setSelectedNiches] = useState([]);
//   const [nicheWarning, setNicheWarning] = useState(false);

//   const COMMUNITY_RULES = [
//     { icon: '🔞', text: 'No nudity, adult content, or explicit media of any kind' },
//     { icon: '📵', text: 'No personal social handles, follower-farming, or self-promotion links' },
//     { icon: '🤝', text: 'No harassment, bullying, or targeted attacks on any creator' },
//     { icon: '📢', text: 'No spam, undisclosed paid promotions, or misinformation' },
//     { icon: '◎', text: 'Be specific and helpful when giving feedback — vague comments are not allowed' },
//   ];

//   function toggleNiche(id) {
//     setNicheWarning(false);
//     if (selectedNiches.includes(id)) {
//       setSelectedNiches(prev => prev.filter(n => n !== id));
//     } else {
//       if (selectedNiches.length >= 2) {
//         setNicheWarning(true);
//         return;
//       }
//       setSelectedNiches(prev => [...prev, id]);
//     }
//   }

//   function handleComplete() {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('fameo_community_onboarded', '1');
//     }
//     onComplete(selectedNiches);
//   }

//   return (
//     <div style={{
//       position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 2000,
//       display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
//     }}>
//       <div style={{
//         background: 'var(--cm-bg2)', border: '1px solid var(--cm-border2)', borderRadius: 22,
//         width: '100%', maxWidth: 520, animation: 'cm-scale-in .25s ease both',
//         overflow: 'hidden',
//       }}>
//         {/* Progress bar */}
//         <div style={{ height: 3, background: 'var(--cm-bg3)' }}>
//           <div style={{
//             height: '100%', background: 'linear-gradient(90deg,var(--cm-accent),var(--cm-accent2))',
//             width: `${(step / 3) * 100}%`, transition: 'width .4s ease',
//           }} />
//         </div>

//         <div style={{ padding: '28px 30px' }}>
//           {/* Step counter */}
//           <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cm-text3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 20, fontFamily: 'var(--cm-font-ui)' }}>
//             Step {step} of 3
//           </div>

//           {/* ── STEP 1: Welcome ── */}
//           {step === 1 && (
//             <div style={{ animation: 'cm-fade-in .3s ease both' }}>
//               <div style={{ textAlign: 'center', marginBottom: 28 }}>
//                 <div style={{
//                   width: 72, height: 72, borderRadius: 20, margin: '0 auto 20px',
//                   background: 'linear-gradient(135deg,var(--cm-accent),#a855f7)',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                   fontSize: 30, boxShadow: '0 8px 32px var(--cm-accent-glow)',
//                 }}>
//                   ✦
//                 </div>
//                 <div style={{ fontFamily: 'var(--cm-font-display)', fontSize: 28, fontWeight: 700, color: 'var(--cm-text)', lineHeight: 1.2, marginBottom: 12 }}>
//                   Welcome to Fameo Community
//                 </div>
//                 <div style={{ fontSize: 15, color: 'var(--cm-text2)', lineHeight: 1.7, maxWidth: 380, margin: '0 auto' }}>
//                   Your platform to grow, collaborate, get feedback, and land brand deals — with creators who actually get it.
//                 </div>
//               </div>

//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
//                 {[
//                   { icon: '💬', title: 'Community Discussions', desc: 'Share tips and learn from 10K+ creators' },
//                   { icon: '◎', title: 'Peer Feedback', desc: 'Get structured feedback on your content' },
//                   { icon: '🎙️', title: 'Live Audio Events', desc: 'Join masterclasses with top creators' },
//                   { icon: '🏷️', title: 'Brand Matching', desc: 'Connect with brands once you\'re brand-ready' },
//                 ].map((feature, i) => (
//                   <div key={i} style={{
//                     padding: '13px 14px', background: 'var(--cm-bg3)', borderRadius: 12,
//                     border: '1px solid var(--cm-border)',
//                   }}>
//                     <div style={{ fontSize: 20, marginBottom: 6 }}>{feature.icon}</div>
//                     <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cm-text)', marginBottom: 3 }}>{feature.title}</div>
//                     <div style={{ fontSize: 11.5, color: 'var(--cm-text3)', lineHeight: 1.5 }}>{feature.desc}</div>
//                   </div>
//                 ))}
//               </div>

//               <button
//                 onClick={() => setStep(2)}
//                 style={{
//                   width: '100%', height: 46, background: 'linear-gradient(135deg,var(--cm-accent),#c0306a)',
//                   color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600,
//                   cursor: 'pointer', fontFamily: 'var(--cm-font)', boxShadow: '0 4px 20px var(--cm-accent-glow)',
//                 }}
//               >
//                 Get Started →
//               </button>
//             </div>
//           )}

//           {/* ── STEP 2: Choose niche ── */}
//           {step === 2 && (
//             <div style={{ animation: 'cm-fade-in .3s ease both' }}>
//               <div style={{ fontFamily: 'var(--cm-font-display)', fontSize: 22, fontWeight: 700, color: 'var(--cm-text)', marginBottom: 6 }}>
//                 Choose Your Niche
//               </div>
//               <div style={{ fontSize: 13.5, color: 'var(--cm-text2)', marginBottom: 18, lineHeight: 1.6 }}>
//                 Select up to <strong style={{ color: 'var(--cm-accent2)' }}>2 niches</strong> to join the right creator spaces and get relevant content.
//               </div>

//               {/* Slot indicator */}
//               <div style={{
//                 display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', marginBottom: 14,
//                 background: selectedNiches.length >= 2 ? 'var(--cm-orange-soft)' : 'var(--cm-bg3)',
//                 border: `1px solid ${selectedNiches.length >= 2 ? 'rgba(245,160,32,0.2)' : 'var(--cm-border)'}`,
//                 borderRadius: 8, fontSize: 12.5, transition: 'all .2s',
//                 color: selectedNiches.length >= 2 ? 'var(--cm-orange)' : 'var(--cm-text3)',
//               }}>
//                 <span>{selectedNiches.length}/2 slots selected</span>
//                 {selectedNiches.length >= 2 && <span style={{ marginLeft: 4 }}>— Maximum reached</span>}
//               </div>

//               {/* Warning */}
//               {nicheWarning && (
//                 <div style={{
//                   padding: '9px 12px', background: 'var(--cm-orange-soft)', border: '1px solid rgba(245,160,32,0.2)',
//                   borderRadius: 8, fontSize: 12.5, color: 'var(--cm-orange)', marginBottom: 12,
//                   animation: 'cm-slide-down .2s ease both',
//                 }}>
//                   ⚠️ You can only join 2 niche spaces. Deselect one to choose another.
//                 </div>
//               )}

//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 22, maxHeight: 320, overflowY: 'auto' }}>
//                 {NICHE_OPTIONS.map(niche => {
//                   const selected = selectedNiches.includes(niche.id);
//                   const disabled = !selected && selectedNiches.length >= 2;
//                   return (
//                     <div
//                       key={niche.id}
//                       onClick={() => toggleNiche(niche.id)}
//                       style={{
//                         padding: '11px 14px', borderRadius: 10, cursor: disabled ? 'not-allowed' : 'pointer',
//                         fontSize: 13, transition: 'all .15s', border: `1px solid ${selected ? 'var(--cm-accent)' : 'var(--cm-border2)'}`,
//                         background: selected ? 'var(--cm-accent-soft)' : 'var(--cm-bg3)',
//                         color: selected ? 'var(--cm-accent2)' : disabled ? 'var(--cm-text3)' : 'var(--cm-text2)',
//                         opacity: disabled ? 0.45 : 1, fontWeight: selected ? 500 : 400,
//                         display: 'flex', alignItems: 'center', gap: 8,
//                       }}
//                     >
//                       <div style={{
//                         width: 16, height: 16, borderRadius: 4, flexShrink: 0, transition: 'all .15s',
//                         border: `2px solid ${selected ? 'var(--cm-accent)' : 'var(--cm-border2)'}`,
//                         background: selected ? 'var(--cm-accent)' : 'transparent',
//                         display: 'flex', alignItems: 'center', justifyContent: 'center',
//                         fontSize: 9, color: '#fff',
//                       }}>
//                         {selected && '✓'}
//                       </div>
//                       {niche.label}
//                     </div>
//                   );
//                 })}
//               </div>

//               <div style={{ display: 'flex', gap: 8 }}>
//                 <button
//                   onClick={() => setStep(1)}
//                   style={{ height: 44, padding: '0 20px', background: 'var(--cm-surface)', color: 'var(--cm-text2)', border: '1px solid var(--cm-border2)', borderRadius: 12, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--cm-font)' }}
//                 >
//                   ← Back
//                 </button>
//                 <button
//                   onClick={() => setStep(3)}
//                   style={{
//                     flex: 1, height: 44, background: 'linear-gradient(135deg,var(--cm-accent),#c0306a)',
//                     color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600,
//                     cursor: 'pointer', fontFamily: 'var(--cm-font)',
//                   }}
//                 >
//                   Continue →
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* ── STEP 3: Community standards agreement — CANNOT SKIP ── */}
//           {step === 3 && (
//             <div style={{ animation: 'cm-fade-in .3s ease both' }}>
//               <div style={{ fontFamily: 'var(--cm-font-display)', fontSize: 22, fontWeight: 700, color: 'var(--cm-text)', marginBottom: 6 }}>
//                 Community Standards
//               </div>
//               <div style={{ fontSize: 13.5, color: 'var(--cm-text2)', marginBottom: 18, lineHeight: 1.6 }}>
//                 Read and agree to our community rules before entering. These keep Fameo Community safe and valuable for every creator.
//               </div>

//               <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
//                 {COMMUNITY_RULES.map((rule, i) => (
//                   <div key={i} style={{
//                     display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px',
//                     background: 'var(--cm-bg3)', borderRadius: 10, border: '1px solid var(--cm-border)',
//                     animation: `cm-fade-in .3s ease ${i * 0.06}s both`,
//                   }}>
//                     <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1 }}>{rule.icon}</span>
//                     <span style={{ fontSize: 13, color: 'var(--cm-text2)', lineHeight: 1.6 }}>{rule.text}</span>
//                   </div>
//                 ))}
//               </div>

//               <div style={{ fontSize: 12, color: 'var(--cm-text3)', marginBottom: 16, lineHeight: 1.6, textAlign: 'center' }}>
//                 Violating these rules may result in content removal, temporary suspension, or permanent ban.
//               </div>

//               <div style={{ display: 'flex', gap: 8 }}>
//                 <button
//                   onClick={() => setStep(2)}
//                   style={{ height: 44, padding: '0 20px', background: 'var(--cm-surface)', color: 'var(--cm-text2)', border: '1px solid var(--cm-border2)', borderRadius: 12, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--cm-font)' }}
//                 >
//                   ← Back
//                 </button>
//                 {/* The "I Agree" button — explicitly named, cannot be bypassed */}
//                 <button
//                   onClick={handleComplete}
//                   style={{
//                     flex: 1, height: 44, background: 'linear-gradient(135deg,var(--cm-green),#0ab060)',
//                     color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700,
//                     cursor: 'pointer', fontFamily: 'var(--cm-font)',
//                     boxShadow: '0 4px 20px rgba(15,217,122,0.25)',
//                   }}
//                 >
//                   I Agree — Enter Community ✓
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
import { useState } from 'react';
import { NICHE_OPTIONS } from '@/constants/community';

const RULES = [
  { icon: '🔞', text: 'No nudity, adult content, or explicit media of any kind' },
  { icon: '📵', text: 'No personal social handles, follower-farming, or self-promotion links' },
  { icon: '🤝', text: 'No harassment, bullying, or targeted attacks on any creator' },
  { icon: '📢', text: 'No spam, undisclosed paid promotions, or misinformation' },
  { icon: '◎', text: 'Be specific and helpful when giving feedback — vague comments are not allowed' },
];

export default function OnboardingModal({ onComplete }) {
  const [step, setStep] = useState(1);
  const [niches, setNiches] = useState([]);
  const [warning, setWarning] = useState(false);

  function toggleNiche(id) {
    setWarning(false);
    if (niches.includes(id)) {
      setNiches(p => p.filter(n => n !== id));
    } else {
      if (niches.length >= 2) { setWarning(true); return; }
      setNiches(p => [...p, id]);
    }
  }

  function complete() {
    if (typeof window !== 'undefined') localStorage.setItem('fameo_community_onboarded', '1');
    onComplete(niches);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(19,18,38,0.75)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div className="cm-scale-in" style={{
        background: 'var(--cm-bg2)', borderRadius: 24,
        width: '100%', maxWidth: 520, overflow: 'hidden',
        boxShadow: 'var(--cm-shadow-xl)',
        border: '1.5px solid var(--cm-border2)',
      }}>
        {/* Progress bar */}
        <div style={{ height: 4, background: 'var(--cm-bg4)', position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: '0 auto 0 0',
            width: `${(step / 3) * 100}%`,
            background: 'var(--cm-grad-accent)',
            borderRadius: 4, transition: 'width .45s cubic-bezier(0.22,1,0.36,1)',
          }} />
        </div>

        <div style={{ padding: '28px 32px 32px' }}>
          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            {[1, 2, 3].map(n => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11.5, fontWeight: 700, fontFamily: 'var(--cm-font-ui)',
                  transition: 'all .3s',
                  background: step === n ? 'var(--cm-grad-accent)' : step > n ? 'var(--cm-green)' : 'var(--cm-surface2)',
                  color: step >= n ? '#fff' : 'var(--cm-text4)',
                  boxShadow: step === n ? 'var(--cm-shadow-accent)' : 'none',
                }}>
                  {step > n ? '✓' : n}
                </div>
                {n < 3 && (
                  <div style={{ width: 28, height: 2, borderRadius: 2, background: step > n ? 'var(--cm-green)' : 'var(--cm-surface2)', transition: 'background .3s' }} />
                )}
              </div>
            ))}
            <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--cm-text3)', fontFamily: 'var(--cm-font-ui)' }}>Step {step} of 3</span>
          </div>

          {/* ── STEP 1: Welcome ── */}
          {step === 1 && (
            <div className="cm-fade-up">
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{
                  width: 76, height: 76, borderRadius: 22, margin: '0 auto 20px',
                  background: 'var(--cm-grad-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 32, boxShadow: 'var(--cm-shadow-accent)',
                }}>✦</div>
                <div style={{ fontFamily: 'var(--cm-font-display)', fontSize: 30, fontWeight: 700, color: 'var(--cm-text)', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 10 }}>
                  Welcome to<br />Fameo Community
                </div>
                <div style={{ fontSize: 15, color: 'var(--cm-text2)', lineHeight: 1.7, maxWidth: 380, margin: '0 auto' }}>
                  Your platform to grow, collaborate, get feedback, and land brand deals — with creators who actually get it.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
                {[
                  { icon: '💬', title: 'Community Discussions', desc: 'Share tips with 10K+ creators' },
                  { icon: '◎', title: 'Peer Feedback', desc: 'Get structured feedback on content' },
                  { icon: '🎙️', title: 'Live Audio Events', desc: 'Join masterclasses & workshops' },
                  { icon: '🏷️', title: 'Brand Matching', desc: 'Connect once you\'re brand-ready' },
                ].map((f, i) => (
                  <div key={i} style={{
                    padding: '14px 16px', background: 'var(--cm-bg3)', borderRadius: 14,
                    border: '1px solid var(--cm-border)', transition: 'all .15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cm-border3)'; e.currentTarget.style.background = 'var(--cm-surface)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cm-border)'; e.currentTarget.style.background = 'var(--cm-bg3)'; }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cm-text)', marginBottom: 3 }}>{f.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--cm-text3)', lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                ))}
              </div>

              <PrimaryBtn onClick={() => setStep(2)}>Get Started →</PrimaryBtn>
            </div>
          )}

          {/* ── STEP 2: Choose niches ── */}
          {step === 2 && (
            <div className="cm-fade-up">
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: 'var(--cm-font-display)', fontSize: 26, fontWeight: 700, color: 'var(--cm-text)', marginBottom: 6 }}>Choose Your Niche</div>
                <div style={{ fontSize: 14, color: 'var(--cm-text2)', lineHeight: 1.65 }}>
                  Select up to <strong style={{ color: 'var(--cm-accent)' }}>2 niches</strong> to join the right spaces and get relevant content.
                </div>
              </div>

              {/* Slot pill */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', marginBottom: 14, borderRadius: 20,
                background: niches.length >= 2 ? 'var(--cm-orange-soft)' : 'var(--cm-green-soft)',
                border: `1.5px solid ${niches.length >= 2 ? 'rgba(232,134,10,0.2)' : 'rgba(10,173,101,0.2)'}`,
                color: niches.length >= 2 ? 'var(--cm-orange)' : 'var(--cm-green)',
                fontSize: 13, fontWeight: 700, transition: 'all .25s',
              }}>
                {niches.length >= 2 ? '🔒' : '🟢'} {niches.length}/2 slots selected
                {niches.length >= 2 && ' — max reached'}
              </div>

              {/* Warning */}
              {warning && (
                <div className="cm-slide-down" style={{
                  padding: '9px 14px', background: 'var(--cm-orange-soft)',
                  border: '1px solid rgba(232,134,10,0.2)', borderRadius: 10,
                  fontSize: 13, color: 'var(--cm-orange)', marginBottom: 12, fontWeight: 500,
                }}>
                  ⚠️ You can only select 2 niches. Deselect one to choose another.
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24, maxHeight: 300, overflowY: 'auto' }}>
                {NICHE_OPTIONS.map(n => {
                  const sel = niches.includes(n.id);
                  const dis = !sel && niches.length >= 2;
                  return (
                    <div key={n.id} onClick={() => toggleNiche(n.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 13px',
                      borderRadius: 11, cursor: dis ? 'not-allowed' : 'pointer', fontSize: 13.5,
                      fontFamily: 'var(--cm-font)', transition: 'all .15s',
                      fontWeight: sel ? 600 : 400,
                      background: sel ? 'var(--cm-accent-soft2)' : 'var(--cm-bg3)',
                      color: sel ? 'var(--cm-accent)' : dis ? 'var(--cm-text4)' : 'var(--cm-text2)',
                      opacity: dis ? 0.4 : 1,
                      boxShadow: sel ? 'inset 0 0 0 1.5px var(--cm-accent)' : 'inset 0 0 0 1px var(--cm-border2)',
                    }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: 5, flexShrink: 0, transition: 'all .15s',
                        border: `2px solid ${sel ? 'var(--cm-accent)' : 'var(--cm-border3)'}`,
                        background: sel ? 'var(--cm-accent)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, color: '#fff', fontWeight: 700,
                      }}>{sel && '✓'}</div>
                      {n.label}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <GhostBtn onClick={() => setStep(1)}>← Back</GhostBtn>
                <PrimaryBtn onClick={() => setStep(3)} style={{ flex: 1 }}>Continue →</PrimaryBtn>
              </div>
            </div>
          )}

          {/* ── STEP 3: Community agreement — CANNOT SKIP ── */}
          {step === 3 && (
            <div className="cm-fade-up">
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: 'var(--cm-font-display)', fontSize: 26, fontWeight: 700, color: 'var(--cm-text)', marginBottom: 6 }}>Community Standards</div>
                <div style={{ fontSize: 14, color: 'var(--cm-text2)', lineHeight: 1.65 }}>
                  Read and agree to our rules before entering. These keep Fameo safe and valuable for every creator.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {RULES.map((r, i) => (
                  <div key={i} className={`cm-fade-up cm-fade-up-${i+1}`} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px',
                    background: 'var(--cm-bg3)', borderRadius: 12,
                    border: '1px solid var(--cm-border)', transition: 'all .15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cm-border3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cm-border)'; }}
                  >
                    <span style={{ fontSize: 19, flexShrink: 0, lineHeight: 1 }}>{r.icon}</span>
                    <span style={{ fontSize: 13.5, color: 'var(--cm-text2)', lineHeight: 1.6 }}>{r.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 12, color: 'var(--cm-text4)', textAlign: 'center', marginBottom: 18, lineHeight: 1.65 }}>
                Violating these rules may result in content removal, suspension, or permanent ban.
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <GhostBtn onClick={() => setStep(2)}>← Back</GhostBtn>
                {/* I Agree — explicit acceptance, cannot be bypassed */}
                <button onClick={complete} style={{
                  flex: 1, height: 46, borderRadius: 12, fontSize: 15, fontWeight: 700,
                  border: 'none', cursor: 'pointer', fontFamily: 'var(--cm-font)',
                  background: 'var(--cm-grad-green)',
                  color: '#fff',
                  boxShadow: '0 6px 24px rgba(10,173,101,0.3)',
                  transition: 'all .15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.92'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
                >
                  I Agree — Enter Community ✓
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PrimaryBtn({ children, onClick, style: s }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', height: 46, background: 'var(--cm-grad-accent)', color: '#fff',
      border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
      cursor: 'pointer', fontFamily: 'var(--cm-font)',
      boxShadow: 'var(--cm-shadow-accent)', transition: 'all .15s', ...s,
    }}
    onMouseEnter={e => { e.currentTarget.style.opacity = '0.92'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
    >{children}</button>
  );
}

function GhostBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      height: 46, padding: '0 22px', background: 'var(--cm-surface)',
      color: 'var(--cm-text2)', border: '1.5px solid var(--cm-border2)',
      borderRadius: 12, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--cm-font)',
      fontWeight: 500, transition: 'all .14s', flexShrink: 0,
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--cm-surface2)'}
    onMouseLeave={e => e.currentTarget.style.background = 'var(--cm-surface)'}
    >{children}</button>
  );
}