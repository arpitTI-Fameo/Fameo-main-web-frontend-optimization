'use client';
// components/community/podcast/PodcastPlayer.js
// Full podcast player — white/light theme
// Backend: GET /api/podcast/episodes/:id
//          GET /api/podcast/episodes/:id/transcription
//          GET /api/podcast/episodes/:id/comments
//          POST /api/podcast/episodes/:id/comments
//          POST /api/podcast/episodes/:id/like
//          POST /api/podcast/episodes/:id/save

import { useState, useEffect, useRef, useCallback } from 'react';
import { showToast } from '../Toast';
import { toUserMessage } from '@/lib/api/errors';
import { useAuthStore } from '@/store/authStore';
import { useAddEpisodeCommentMutation } from '@/lib/services/main/podcast.api';
import { useEpisode, useEpisodeTranscription, useEpisodeComments, useToggleEpisodeLikeMutation, useToggleEpisodeSaveMutation, useShow, useEpisodes } from '@/lib/hooks/main/usePodcast';


// ── Design tokens (white theme) ───────────────────────────────────────────────
const T = {
  bg:          '#ffffff',
  bg2:         '#f8f9fc',
  bg3:         '#f1f3f9',
  bg4:         '#e8ecf5',
  border:      '#e5e8f0',
  border2:     '#d0d5e8',
  text:        '#0f1117',
  text2:       '#4a5070',
  text3:       '#8890a8',
  accent:      '#6366f1',
  accent2:     '#818cf8',
  accentSoft:  'rgba(99,102,241,0.08)',
  accentGrad:  'linear-gradient(135deg,#6366f1,#a855f7)',
  green:       '#10b981',
  greenSoft:   'rgba(16,185,129,0.08)',
  red:         '#ef4444',
  shadow:      '0 2px 12px rgba(99,102,241,0.10)',
  shadowLg:    '0 8px 32px rgba(99,102,241,0.14)',
  font:        '"DM Sans", system-ui, sans-serif',
  fontDisplay: '"Fraunces", Georgia, serif',
};


const fmt = s => { const t=Math.max(0,Math.floor(s||0)); const h=Math.floor(t/3600),m=Math.floor((t%3600)/60),sc=t%60; return h>0?`${h}:${String(m).padStart(2,'0')}:${String(sc).padStart(2,'0')}`:`${m}:${String(sc).padStart(2,'0')}`; };

// ─────────────────────────────────────────────────────────────────────────────
export default function PodcastPlayer({ episodeId, episode: episodeProp, currentUser, onBack, style }) {
  const [episode, setEpisode]           = useState(episodeProp || null);
  const [playing, setPlaying]           = useState(false);
  const [currentTime, setCurrentTime]   = useState(0);
  const [duration, setDuration]         = useState(0);
  const [speed, setSpeed]               = useState(1);
  const [volume, setVolume]             = useState(1);
  const [muted, setMuted]               = useState(false);
  const [buffered, setBuffered]         = useState(0);
  const [audioLoading, setAudioLoading] = useState(false);
  const [liked, setLiked]               = useState(false);
  const [saved, setSaved]               = useState(false);
  const [activeTab, setActiveTab]       = useState('chapters');
  const [comments, setComments]         = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [commentStamp, setCommentStamp] = useState(false);
  const [transcription, setTranscription] = useState(null);
  const [transcLoading, setTranscLoading] = useState(false);
  const [pageLoading, setPageLoading]   = useState(!episodeProp);

  const audioRef   = useRef(null);
  const seekBarRef = useRef(null);

  const { data: epData, isLoading: epLoading } = useEpisode(episodeId, { enabled: !episodeProp && !!episodeId });
  const { data: commsData } = useEpisodeComments(episode?._id, { enabled: !!episode?._id });
  const { data: transData, isLoading: isTransLoading } = useEpisodeTranscription(episode?._id, { enabled: activeTab === 'transcript' && !!episode?._id });

  const { mutateAsync: toggleLikeMutation } = useToggleEpisodeLikeMutation();
  const { mutateAsync: toggleSaveMutation } = useToggleEpisodeSaveMutation();
  const { mutateAsync: addCommentMutation } = useAddEpisodeCommentMutation();

  // Load episode
  useEffect(() => {
    if (episodeProp) { setEpisode(episodeProp); setLiked(episodeProp.liked); setSaved(episodeProp.saved); return; }
    if (epData?.data) { setEpisode(epData.data); setLiked(epData.data.liked); setSaved(epData.data.saved); }
  },[episodeProp, epData]);

  // Load comments
  useEffect(() => {
    if (commsData?.data) setComments(Array.isArray(commsData.data) ? commsData.data : []);
  },[commsData]);

  // Load transcription
  useEffect(() => {
    setTranscLoading(isTransLoading);
    if (transData) setTranscription(transData.data || transData);
  },[transData, isTransLoading]);

  // Audio events
  useEffect(() => {
    const a = audioRef.current; if(!a) return;
    const onLoaded  = () => { setDuration(a.duration||0); setAudioLoading(false); };
    const onTime    = () => {
      setCurrentTime(a.currentTime);
      if (a.buffered.length > 0) setBuffered((a.buffered.end(a.buffered.length-1)/a.duration)*100);
    };
    const onEnded   = () => setPlaying(false);
    const onWaiting = () => setAudioLoading(true);
    const onPlaying = () => setAudioLoading(false);
    a.addEventListener('loadedmetadata', onLoaded);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('ended', onEnded);
    a.addEventListener('waiting', onWaiting);
    a.addEventListener('playing', onPlaying);
    return () => {
      a.removeEventListener('loadedmetadata',onLoaded);
      a.removeEventListener('timeupdate',onTime);
      a.removeEventListener('ended',onEnded);
      a.removeEventListener('waiting',onWaiting);
      a.removeEventListener('playing',onPlaying);
    };
  },[episode]);

  useEffect(() => { if(audioRef.current) audioRef.current.playbackRate=speed; },[speed]);
  useEffect(() => { if(audioRef.current) audioRef.current.volume=muted?0:volume; },[volume,muted]);

  // Controls
  function togglePlay() {
    const a = audioRef.current; if(!a) return;
    if(playing){a.pause();setPlaying(false);}
    else{a.play().then(()=>setPlaying(true)).catch(()=>{});}
  }
  function seek(e) {
    const a=audioRef.current; const bar=seekBarRef.current; if(!a||!bar) return;
    const pct=Math.max(0,Math.min(1,(e.clientX-bar.getBoundingClientRect().left)/bar.getBoundingClientRect().width));
    a.currentTime=pct*duration;
  }
  function skip(s) { const a=audioRef.current; if(!a) return; a.currentTime=Math.max(0,Math.min(duration,a.currentTime+s)); }
  function jumpTo(sec) { const a=audioRef.current; if(!a) return; a.currentTime=sec; if(!playing){a.play().then(()=>setPlaying(true));} }

  async function toggleLike() {
    setLiked(v=>!v);
    try { await toggleLikeMutation(episode._id); }
    catch { setLiked(v=>!v); }
  }
  async function toggleSave() {
    setSaved(v=>!v);
    try { await toggleSaveMutation(episode._id); }
    catch { setSaved(v=>!v); }
  }
  async function postComment() {
    if(!commentInput.trim()) return;
    const body = { content: commentInput };
    if(commentStamp) body.timestamp = Math.floor(currentTime);
    try {
      const res = await addCommentMutation({ id: episode._id, data: body });
      if(res.data) { setComments(prev=>[...prev,res.data]); setCommentInput(''); }
    } catch (err) {
      // Was an empty catch: the comment vanished with no message and the box
      // stayed full, which reads as the app ignoring the click.
      showToast(toUserMessage(err), 'error');
    }
  }

  const progress = duration>0?(currentTime/duration)*100:0;
  const activeChapter = episode?.chapters?.find((c,i)=>{
    const next=episode.chapters[i+1];
    return currentTime>=c.startSec && (!next||currentTime<next.startSec);
  });

  const pageIsLoading = (!episodeProp && !!episodeId && epLoading);

  if (pageIsLoading) return (
    <div style={{ background:T.bg, borderRadius:20, padding:32, fontFamily:T.font, ...style }}>
      <div style={{ display:'flex', gap:20, marginBottom:24 }}>
        <div style={{ width:100, height:100, borderRadius:14, background:'#e5e8f0' }} />
        <div style={{ flex:1 }}>
          <div style={{ height:14, background:'#e5e8f0', borderRadius:6, width:'35%', marginBottom:8 }} />
          <div style={{ height:22, background:'#e5e8f0', borderRadius:6, width:'75%', marginBottom:8 }} />
          <div style={{ height:12, background:'#e5e8f0', borderRadius:6, width:'50%' }} />
        </div>
      </div>
      <div style={{ height:6, background:'#e5e8f0', borderRadius:3, marginBottom:20 }} />
      <div style={{ display:'flex', justifyContent:'center', gap:12 }}>
        {[60,48,60].map((w,i)=><div key={i} style={{ width:w, height:w, borderRadius:'50%', background:'#e5e8f0' }} />)}
      </div>
    </div>
  );

  if(!episode) return null;

  const TABS = [
    { id:'chapters',   label:`Chapters (${episode.chapters?.length||0})` },
    { id:'transcript', label:'Transcript' },
    { id:'comments',   label:`Comments (${comments.length})` },
  ];

  return (
    <div style={{ background:T.bg, borderRadius:20, border:`1px solid ${T.border}`, overflow:'hidden', boxShadow:T.shadowLg, fontFamily:T.font, ...style }}>
      <audio ref={audioRef} src={episode.audio?.url} preload="auto" style={{ display:'none' }} />

      {/* Back button */}
      {onBack && (
        <div style={{ padding:'14px 20px 0' }}>
          <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, color:T.text3, display:'flex', alignItems:'center', gap:5, padding:'4px 0', fontFamily:T.font, transition:'color .1s' }}
            onMouseEnter={e=>e.currentTarget.style.color=T.accent}
            onMouseLeave={e=>e.currentTarget.style.color=T.text3}>
            ← Back to Library
          </button>
        </div>
      )}

      {/* ── Cover + Meta ── */}
      <div style={{ padding:'24px 24px 20px', background:T.bg }}>
        <div style={{ display:'flex', gap:18, alignItems:'flex-start' }}>
          {/* Cover */}
          <div style={{ width:100, height:100, borderRadius:14, flexShrink:0, background:episode.coverImage?`url(${episode.coverImage}) center/cover`:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, boxShadow:'0 4px 16px rgba(99,102,241,.25)' }}>
            {!episode.coverImage && '🎙️'}
          </div>

          <div style={{ flex:1, minWidth:0 }}>
            {episode.show?.title && (
              <div style={{ fontSize:11, fontWeight:700, color:T.accent, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:4, fontFamily:T.font }}>
                {episode.show.title} · Ep. {episode.episodeNumber}
              </div>
            )}
            <div style={{ fontFamily:T.fontDisplay, fontSize:20, fontWeight:700, color:T.text, lineHeight:1.3, marginBottom:6 }}>
              {episode.title}
            </div>
            <div style={{ fontSize:12.5, color:T.text3, marginBottom:10 }}>
              by {episode.creator?.name} · {fmt(episode.audio?.duration)} · {(episode.playCount||0).toLocaleString()} plays
            </div>
            {/* Tags */}
            {episode.tags?.length > 0 && (
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {episode.tags.slice(0,4).map(t=>(
                  <span key={t} style={{ padding:'3px 10px', borderRadius:20, fontSize:11.5, fontWeight:600, background:T.accentSoft, color:T.accent }}>#{t}</span>
                ))}
              </div>
            )}
          </div>

          {/* Like / Save */}
          <div style={{ display:'flex', gap:8, flexShrink:0 }}>
            <IconBtn active={liked} activeColor={T.red} onClick={toggleLike} title="Like">{liked?'❤️':'🤍'}</IconBtn>
            <IconBtn active={saved} activeColor={T.accent} onClick={toggleSave} title="Save">🔖</IconBtn>
          </div>
        </div>
      </div>

      {/* Active chapter banner */}
      {activeChapter && (
        <div style={{ padding:'7px 24px', background:T.accentSoft, borderBottom:`1px solid ${T.border}`, fontSize:12.5, color:T.accent, fontWeight:600, display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:14 }}>📌</span>
          {activeChapter.title}
          <span style={{ fontWeight:400, color:T.text3, marginLeft:4 }}>{fmt(activeChapter.startSec)} – {fmt(activeChapter.endSec||duration)}</span>
        </div>
      )}

      {/* ── Player ── */}
      <div style={{ padding:'20px 24px', background:T.bg, borderBottom:`1px solid ${T.border}` }}>
        {/* Seek bar */}
        <div ref={seekBarRef} onClick={seek} style={{ position:'relative', height:6, background:T.bg4, borderRadius:4, cursor:'pointer', marginBottom:6 }}>
          <div style={{ position:'absolute', inset:0, width:`${buffered}%`, background:T.bg3, borderRadius:4 }} />
          <div style={{ position:'absolute', inset:0, width:`${progress}%`, background:T.accentGrad, borderRadius:4, transition:'width .2s linear' }} />
          {/* Chapter ticks */}
          {episode.chapters?.map((c,i)=>(
            <div key={i} style={{ position:'absolute', top:-3, left:`${(c.startSec/duration)*100}%`, width:2, height:12, background:T.accent, opacity:.5, borderRadius:1, transform:'translateX(-50%)' }} />
          ))}
          {/* Thumb */}
          <div style={{ position:'absolute', top:'50%', left:`${progress}%`, width:14, height:14, borderRadius:'50%', background:T.accent, border:`2.5px solid #fff`, transform:'translate(-50%,-50%)', boxShadow:'0 2px 6px rgba(99,102,241,.4)', transition:'left .2s linear' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11.5, color:T.text3, marginBottom:16 }}>
          <span>{fmt(currentTime)}</span><span>{fmt(duration)}</span>
        </div>

        {/* Controls */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:16 }}>
          <CtrlBtn onClick={()=>skip(-15)} label="−15s">⟵15</CtrlBtn>
          <button onClick={togglePlay}
            style={{ width:52, height:52, borderRadius:'50%', border:'none', cursor:'pointer', background:T.accentGrad, color:'#fff', fontSize:22, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(99,102,241,.35)', transition:'transform .15s', flexShrink:0 }}
            onMouseEnter={e=>e.currentTarget.style.transform='scale(1.07)'}
            onMouseLeave={e=>e.currentTarget.style.transform='none'}>
            {audioLoading ? <span style={{ fontSize:14, animation:'spin .8s linear infinite', display:'inline-block' }}>↻</span> : playing?'⏸':'▶'}
          </button>
          <CtrlBtn onClick={()=>skip(30)} label="+30s">30⟶</CtrlBtn>
        </div>

        {/* Speed + Volume */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
          <div style={{ display:'flex', gap:5 }}>
            {[0.75,1,1.25,1.5,2].map(s=>(
              <button key={s} onClick={()=>setSpeed(s)}
                style={{ height:28, padding:'0 9px', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer', border:`1.5px solid ${speed===s?T.accent:T.border2}`, background:speed===s?T.accentSoft:'transparent', color:speed===s?T.accent:T.text3, fontFamily:T.font, transition:'all .12s' }}>
                {s}x
              </button>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={()=>setMuted(v=>!v)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:16, color:T.text3 }}>
              {muted||volume===0?'🔇':volume<.5?'🔉':'🔊'}
            </button>
            <input type="range" min="0" max="1" step=".05" value={muted?0:volume}
              onChange={e=>{setVolume(Number(e.target.value));setMuted(false);}}
              style={{ width:80, accentColor:T.accent, cursor:'pointer' }} />
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display:'flex', background:T.bg, borderBottom:`1px solid ${T.border}` }}>
        {TABS.map(t=>(
          <div key={t.id} onClick={()=>setActiveTab(t.id)}
            style={{ padding:'12px 18px', fontSize:13, fontWeight:activeTab===t.id?700:400, color:activeTab===t.id?T.accent:T.text3, borderBottom:`2.5px solid ${activeTab===t.id?T.accent:'transparent'}`, cursor:'pointer', transition:'all .14s', whiteSpace:'nowrap' }}>
            {t.label}
          </div>
        ))}
      </div>

      <div style={{ padding:'16px 20px', maxHeight:380, overflowY:'auto', background:T.bg2 }}>

        {/* ── CHAPTERS ── */}
        {activeTab==='chapters' && (
          episode.chapters?.length>0 ? (
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {episode.chapters.map((c,i)=>{
                const isActive = activeChapter?.title===c.title;
                return (
                  <div key={i} onClick={()=>jumpTo(c.startSec)}
                    style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:12, cursor:'pointer', transition:'all .14s', background: isActive?T.accentSoft:T.bg, border:`1.5px solid ${isActive?T.accent:T.border}`, boxShadow: isActive?`0 2px 8px rgba(99,102,241,.12)`:'none' }}
                    onMouseEnter={e=>{ if(!isActive){e.currentTarget.style.background=T.bg3;e.currentTarget.style.borderColor=T.border2;} }}
                    onMouseLeave={e=>{ if(!isActive){e.currentTarget.style.background=T.bg;e.currentTarget.style.borderColor=T.border;} }}>
                    <span style={{ fontSize:12.5, fontWeight:700, color:T.accent, width:40, flexShrink:0 }}>{fmt(c.startSec)}</span>
                    <span style={{ flex:1, fontSize:13.5, fontWeight:500, color: isActive?T.accent:T.text }}>{c.title}</span>
                    {isActive && <span style={{ fontSize:10, background:T.accent, color:'#fff', padding:'2px 8px', borderRadius:20, fontWeight:700 }}>NOW</span>}
                    <span style={{ fontSize:13, color:T.text3 }}>▶</span>
                  </div>
                );
              })}
            </div>
          ) : <Empty icon="📌" text="No chapters added for this episode." />
        )}

        {/* ── TRANSCRIPT ── */}
        {activeTab==='transcript' && (
          transcLoading ? (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[95,80,90,70,85].map((w,i)=><div key={i} style={{ height:14, background:'#e5e8f0', borderRadius:6, width:`${w}%` }} />)}
            </div>
          ) : !transcription || transcription.status==='none' ? (
            <Empty icon="📄" text="Transcription not started for this episode." />
          ) : transcription.status==='pending' ? (
            <Empty icon="⏳" text="Transcription is queued. Check back shortly." />
          ) : transcription.status==='processing' ? (
            <Empty icon="⚙️" text="Generating transcript… this takes a few minutes." />
          ) : transcription.status==='failed' ? (
            <Empty icon="❌" text="Transcription failed for this episode." />
          ) : (
            <div style={{ fontSize:13.5, color:T.text2, lineHeight:1.9, fontFamily:T.font }}>
              {transcription.text?.split('\n').filter(Boolean).map((p,i)=>(
                <p key={i} style={{ marginBottom:14 }}>{p}</p>
              ))}
            </div>
          )
        )}

        {/* ── COMMENTS ── */}
        {activeTab==='comments' && (
          <div>
            {/* Comment input */}
            {currentUser && (
              <div style={{ marginBottom:20, padding:16, background:T.bg, borderRadius:14, border:`1px solid ${T.border}`, boxShadow:T.shadow }}>
                <div style={{ display:'flex', gap:10, marginBottom:10 }}>
                  <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff', flexShrink:0 }}>
                    {(currentUser.name||'U')[0]}
                  </div>
                  <textarea value={commentInput} onChange={e=>setCommentInput(e.target.value.slice(0,2000))}
                    placeholder="Share your thoughts on this episode…"
                    style={{ flex:1, minHeight:70, background:T.bg2, border:`1.5px solid ${T.border}`, borderRadius:10, padding:'10px 12px', fontSize:13, color:T.text, fontFamily:T.font, outline:'none', resize:'vertical', lineHeight:1.6, transition:'border-color .15s' }}
                    onFocus={e=>e.target.style.borderColor=T.accent}
                    onBlur={e=>e.target.style.borderColor=T.border} />
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <label style={{ display:'flex', alignItems:'center', gap:7, fontSize:12.5, color:T.text2, cursor:'pointer' }} onClick={()=>setCommentStamp(v=>!v)}>
                    <div style={{ width:18, height:18, borderRadius:5, border:`2px solid ${commentStamp?T.accent:T.border2}`, background:commentStamp?T.accent:'transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#fff', transition:'all .14s' }}>
                      {commentStamp&&'✓'}
                    </div>
                    Comment at {fmt(currentTime)}
                  </label>
                  <button onClick={postComment} disabled={!commentInput.trim()}
                    style={{ height:34, padding:'0 18px', borderRadius:9, fontSize:13, fontWeight:600, border:'none', cursor:commentInput.trim()?'pointer':'not-allowed', background:commentInput.trim()?T.accentGrad:T.bg4, color:commentInput.trim()?'#fff':T.text3, fontFamily:T.font, transition:'all .15s' }}>
                    Post
                  </button>
                </div>
              </div>
            )}

            {/* Comments list */}
            {comments.length===0 ? (
              <Empty icon="💬" text="No comments yet. Be the first!" />
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {comments.map(c=>(
                  <div key={c._id} style={{ display:'flex', gap:10 }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#fff', flexShrink:0 }}>
                      {(c.author?.name||'?')[0]}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                        <span style={{ fontSize:13, fontWeight:600, color:T.text }}>{c.author?.name}</span>
                        {c.timestamp!=null && (
                          <span onClick={()=>jumpTo(c.timestamp)}
                            style={{ fontSize:11, background:T.accentSoft, color:T.accent, padding:'2px 8px', borderRadius:10, cursor:'pointer', fontWeight:600 }}>
                            ▶ {fmt(c.timestamp)}
                          </span>
                        )}
                        <span style={{ fontSize:11, color:T.text3, marginLeft:'auto' }}>
                          {new Date(c.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
                        </span>
                      </div>
                      <div style={{ fontSize:13.5, color:T.text2, lineHeight:1.65 }}>{c.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ── Episode List ──────────────────────────────────────────────────────────────
export function EpisodeList({ showId, onSelect }) {
  const [episodes, setEpisodes] = useState([]);
  const [show, setShow]         = useState(null);

  const { data: showData, isLoading: showLoading } = useShow(showId, { enabled: !!showId });
  const { data: epsData, isLoading: epsLoading } = useEpisodes(showId, { enabled: !!showId });

  useEffect(()=>{
    if (showData?.data) setShow(showData.data);
  },[showData]);

  useEffect(()=>{
    if (epsData?.data) setEpisodes(Array.isArray(epsData.data) ? epsData.data : []);
    else if (Array.isArray(epsData)) setEpisodes(epsData);
  },[epsData]);

  const loading = showLoading || epsLoading;

  const fmt2 = s=>`${Math.floor((s||0)/60)}m`;

  return (
    <div style={{ background:T.bg, fontFamily:T.font }}>
      {show && (
        <div style={{ padding:'20px 20px 16px', borderBottom:`1px solid ${T.border}`, display:'flex', gap:14, alignItems:'flex-start' }}>
          <div style={{ width:72, height:72, borderRadius:12, flexShrink:0, background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>
            {show.coverImage?<img src={show.coverImage} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:12 }} alt="" />:'🎙️'}
          </div>
          <div>
            <div style={{ fontFamily:T.fontDisplay, fontSize:18, fontWeight:700, color:T.text, marginBottom:4 }}>{show.title}</div>
            <div style={{ fontSize:12.5, color:T.text3, marginBottom:6 }}>by {show.creator?.name} · {show.episodeCount||0} episodes · {(show.subscriberCount||0).toLocaleString()} subscribers</div>
            <div style={{ fontSize:12.5, color:T.text2, lineHeight:1.5 }}>{show.description?.slice(0,120)}</div>
          </div>
        </div>
      )}
      {loading ? [1,2,3].map(i=>(
        <div key={i} style={{ padding:'16px 20px', borderBottom:`1px solid ${T.border}`, display:'flex', gap:12 }}>
          <div style={{ width:52, height:52, borderRadius:8, background:'#e5e8f0', flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <div style={{ height:13, background:'#e5e8f0', borderRadius:5, width:'60%', marginBottom:8 }} />
            <div style={{ height:11, background:'#e5e8f0', borderRadius:5, width:'40%' }} />
          </div>
        </div>
      )) : episodes.map(ep=>(
        <div key={ep._id} onClick={()=>onSelect(ep)}
          style={{ display:'flex', gap:12, padding:'14px 20px', borderBottom:`1px solid ${T.border}`, cursor:'pointer', transition:'background .12s' }}
          onMouseEnter={e=>e.currentTarget.style.background=T.bg2}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
          <div style={{ width:52, height:52, borderRadius:8, flexShrink:0, background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>
            {ep.coverImage?<img src={ep.coverImage} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:8 }} alt="" />:'🎙️'}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:14, fontWeight:600, color:T.text, marginBottom:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              Ep. {ep.episodeNumber} — {ep.title}
            </div>
            <div style={{ fontSize:12, color:T.text3, display:'flex', gap:10, flexWrap:'wrap' }}>
              <span>{fmt2(ep.audio?.duration)}</span>
              <span>▶ {(ep.playCount||0).toLocaleString()} plays</span>
              {ep.status==='draft'&&<span style={{ color:T.accent }}>📝 Draft</span>}
            </div>
          </div>
          <div style={{ fontSize:18, color:T.accent, alignSelf:'center', flexShrink:0 }}>▶</div>
        </div>
      ))}
    </div>
  );
}

// ── Shared ────────────────────────────────────────────────────────────────────
function CtrlBtn({ children, onClick, label }) {
  return (
    <button onClick={onClick} title={label}
      style={{ height:34, padding:'0 14px', borderRadius:9, background:T.bg3, border:`1.5px solid ${T.border2}`, color:T.text2, fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:T.font, transition:'all .12s' }}
      onMouseEnter={e=>{e.currentTarget.style.background=T.bg4;e.currentTarget.style.color=T.text;}}
      onMouseLeave={e=>{e.currentTarget.style.background=T.bg3;e.currentTarget.style.color=T.text2;}}>
      {children}
    </button>
  );
}
function IconBtn({ children, onClick, title, active, activeColor }) {
  return (
    <button onClick={onClick} title={title}
      style={{ width:36, height:36, borderRadius:9, border:`1.5px solid ${active?(activeColor+'30'):T.border}`, background:active?`${activeColor}10`:T.bg2, cursor:'pointer', fontSize:17, display:'flex', alignItems:'center', justifyContent:'center', transition:'all .14s' }}>
      {children}
    </button>
  );
}
function Empty({ icon, text }) {
  return (
    <div style={{ padding:'32px 20px', textAlign:'center' }}>
      <div style={{ fontSize:36, opacity:.3, marginBottom:10 }}>{icon}</div>
      <div style={{ fontSize:13.5, color:T.text3 }}>{text}</div>
    </div>
  );
}
