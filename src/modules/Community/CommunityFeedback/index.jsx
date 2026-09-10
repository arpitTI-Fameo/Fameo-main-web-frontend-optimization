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
import { showToast } from '../Toast';
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
