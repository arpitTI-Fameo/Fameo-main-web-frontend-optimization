'use client';
// components/community/podcast/PodcastUploader.js
// 4-step podcast uploader — white/light theme
// Step 1: Episode details (title, description, show notes, tags)
// Step 2: Audio — file upload (with XHR progress) OR browser recording
// Step 3: Chapter markers (time + title editor)
// Step 4: Published confirmation
// Backend: POST /api/podcast/shows/:showId/episodes
//          POST /api/podcast/episodes/:id/audio  (multipart, XHR)
//          PATCH /api/podcast/episodes/:id
//          POST /api/podcast/episodes/:id/publish

import { useState, useRef, useEffect } from 'react';
// SAST H-5 (extended). This read localStorage's `fameo_token` — the ADMIN
// key set by adminAuthStore, not the creator session. Regular users sent an
// empty Bearer token; admins leaked their admin JWT to community endpoints.
import { useAuthStore } from '@/store/authStore';

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  bg:         '#ffffff',
  bg2:        '#f8f9fc',
  bg3:        '#f1f3f9',
  bg4:        '#e8ecf5',
  border:     '#e5e8f0',
  border2:    '#d0d5e8',
  text:       '#0f1117',
  text2:      '#4a5070',
  text3:      '#8890a8',
  accent:     '#6366f1',
  accentSoft: 'rgba(99,102,241,0.08)',
  accentGrad: 'linear-gradient(135deg,#6366f1,#a855f7)',
  green:      '#10b981',
  greenSoft:  'rgba(16,185,129,0.08)',
  red:        '#ef4444',
  shadow:     '0 2px 12px rgba(99,102,241,0.10)',
  shadowLg:   '0 8px 32px rgba(99,102,241,0.14)',
  font:       '"DM Sans", system-ui, sans-serif',
  fontDisplay:'"Fraunces", Georgia, serif',
};

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
function getToken() { return useAuthStore.getState().token || null; }
async function apiFetch(path, opts={}) {
  const token = getToken();
  const isForm = opts.body instanceof FormData;
  const res = await fetch(`${API}/api${path}`, {
    ...opts,
    headers: { ...(token?{Authorization:`Bearer ${token}`}:{}), ...(isForm?{}:{'Content-Type':'application/json'}), ...opts.headers },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message||`HTTP ${res.status}`);
  return json;
}

const fmtSec = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

// ─────────────────────────────────────────────────────────────────────────────
export default function PodcastUploader({ showId, shows = [], onSuccess, onCancel, style }) {
  const [step, setStep]           = useState(1);
  const [episodeId, setEpisodeId] = useState(null);
  const [error, setError]         = useState('');

  // Step 1
  const [selectedShow, setSelectedShow] = useState(showId || '');
  const [title, setTitle]         = useState('');
  const [description, setDescription] = useState('');
  const [showNotes, setShowNotes] = useState('');
  const [tags, setTags]           = useState('');
  const [creating, setCreating]   = useState(false);

  // Step 2
  const [audioMode, setAudioMode]   = useState('upload');
  const [audioFile, setAudioFile]   = useState(null);
  const [uploadPct, setUploadPct]   = useState(0);
  const [uploading, setUploading]   = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [recording, setRecording]   = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordTime, setRecordTime] = useState(0);

  // Step 3
  const [chapters, setChapters]     = useState([]);
  const [chTitle, setChTitle]       = useState('');
  const [chStart, setChStart]       = useState('');
  const [savingCh, setSavingCh]     = useState(false);

  const fileRef  = useRef(null);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const recTimer  = useRef(null);

  // ── Step 1: Create episode ────────────────────────────────────────────────
  async function createEpisode() {
    if (!title.trim()) { setError('Episode title is required.'); return; }
    const sid = selectedShow || showId;
    if (!sid) { setError('Please select a show.'); return; }
    setCreating(true); setError('');
    try {
      const res = await apiFetch(`/podcast/shows/${sid}/episodes`, {
        method:'POST',
        body: JSON.stringify({
          title: title.trim(),
          description,
          showNotes,
          tags: JSON.stringify(tags.split(',').map(t=>t.trim()).filter(Boolean).slice(0,5)),
        }),
      });
      const id = res.data?._id || res._id;
      setEpisodeId(id);
      setStep(2);
    } catch(e) { setError(e.message); }
    setCreating(false);
  }

  // ── Step 2A: File upload (XHR for progress) ───────────────────────────────
  async function uploadAudioFile(file) {
    if (!file || !episodeId) return;
    setUploading(true); setUploadPct(0); setError('');
    const token = getToken();
    const fd = new FormData();
    fd.append('audio', file);

    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = e => { if(e.lengthComputable) setUploadPct(Math.round((e.loaded/e.total)*100)); };
      xhr.onload = () => {
        setUploading(false);
        if (xhr.status>=200 && xhr.status<300) { setUploadDone(true); setUploadPct(100); resolve(true); }
        else { setError('Upload failed — please try again.'); resolve(false); }
      };
      xhr.onerror = () => { setUploading(false); setError('Network error during upload.'); resolve(false); };
      xhr.open('POST', `${API}/api/podcast/episodes/${episodeId}/audio`);
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(fd);
    });
  }

  // ── Step 2B: Browser recording ────────────────────────────────────────────
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      const mr = new MediaRecorder(stream, { mimeType:'audio/webm' });
      chunksRef.current = [];
      mr.ondataavailable = e => e.data.size>0 && chunksRef.current.push(e.data);
      mr.onstop = () => {
        stream.getTracks().forEach(t=>t.stop());
        clearInterval(recTimer.current);
        setRecording(false); setRecordTime(0);
        setRecordedBlob(new Blob(chunksRef.current,{type:'audio/webm'}));
      };
      mr.start(250);
      mediaRef.current = mr;
      setRecording(true); setRecordTime(0);
      recTimer.current = setInterval(()=>setRecordTime(t=>t+1), 1000);
    } catch { setError('Microphone access denied. Please allow access in your browser settings.'); }
  }

  function stopRec() { mediaRef.current?.stop(); clearInterval(recTimer.current); }

  async function uploadRecording() {
    if (!recordedBlob) return;
    await uploadAudioFile(new File([recordedBlob],'recording.webm',{type:'audio/webm'}));
  }

  // ── Step 3: Save chapters + publish ──────────────────────────────────────
  function addChapter() {
    const s = parseInt(chStart, 10);
    if (!chTitle.trim() || isNaN(s) || s < 0) return;
    setChapters(prev => [...prev, { title:chTitle.trim(), startSec:s, endSec:s+300 }].sort((a,b)=>a.startSec-b.startSec));
    setChTitle(''); setChStart('');
  }

  async function saveAndPublish() {
    setSavingCh(true); setError('');
    try {
      if (chapters.length > 0) {
        await apiFetch(`/podcast/episodes/${episodeId}`, { method:'PATCH', body:JSON.stringify({ chapters }) });
      }
      await apiFetch(`/podcast/episodes/${episodeId}/publish`, { method:'POST' });
      setStep(4);
    } catch(e) { setError(e.message); }
    setSavingCh(false);
  }

  async function skipAndPublish() {
    setSavingCh(true); setError('');
    try { await apiFetch(`/podcast/episodes/${episodeId}/publish`,{method:'POST'}); setStep(4); }
    catch(e) { setError(e.message); }
    setSavingCh(false);
  }

  const STEPS = ['Details','Audio','Chapters','Published'];

  return (
    <div style={{ background:T.bg, borderRadius:20, border:`1px solid ${T.border}`, overflow:'hidden', boxShadow:T.shadowLg, maxWidth:560, margin:'0 auto', fontFamily:T.font, ...style }}>

      {/* ── Progress header ── */}
      <div style={{ padding:'20px 24px', borderBottom:`1px solid ${T.border}`, background:T.bg2 }}>
        <div style={{ display:'flex', alignItems:'center', gap:0 }}>
          {STEPS.map((label,i)=>{
            const n=i+1; const done=step>n; const active=step===n;
            return (
              <div key={n} style={{ display:'flex', alignItems:'center', flex: i<3?1:undefined }}>
                <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0, transition:'all .3s', background:done?T.green:active?T.accentGrad:T.bg4, color:(done||active)?'#fff':T.text3, boxShadow:active?'0 3px 10px rgba(99,102,241,.3)':'none' }}>
                    {done?'✓':n}
                  </div>
                  <span style={{ fontSize:12, fontWeight:active?700:400, color:active?T.text:T.text3, whiteSpace:'nowrap' }}>{label}</span>
                </div>
                {i<3 && <div style={{ flex:1, height:2, background:step>n?T.green:T.border, margin:'0 10px', borderRadius:2, minWidth:16, transition:'background .3s' }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div style={{ padding:'10px 24px', background:'rgba(239,68,68,.06)', borderBottom:`1px solid rgba(239,68,68,.15)`, fontSize:13, color:T.red, display:'flex', alignItems:'center', gap:8 }}>
          <span>⚠️</span>{error}
          <button onClick={()=>setError('')} style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:T.red, fontSize:16, lineHeight:1 }}>✕</button>
        </div>
      )}

      {/* ══════════════════════════
          STEP 1 — Episode Details
      ══════════════════════════ */}
      {step===1 && (
        <div style={{ padding:'24px' }}>
          <div style={{ fontFamily:T.fontDisplay, fontSize:22, fontWeight:700, color:T.text, marginBottom:6 }}>Episode Details</div>
          <div style={{ fontSize:13.5, color:T.text3, marginBottom:20 }}>Fill in the episode info — you can edit this later too.</div>

          {/* Show selector — if multiple shows available */}
          {shows.length > 1 && (
            <F label="Select Show" required>
              <select value={selectedShow} onChange={e=>setSelectedShow(e.target.value)}
                style={{ width:'100%', height:42, background:T.bg3, border:`1.5px solid ${T.border}`, borderRadius:10, padding:'0 12px', fontSize:13.5, color:T.text, fontFamily:T.font, outline:'none', cursor:'pointer' }}>
                <option value="">-- Choose a show --</option>
                {shows.map(s=><option key={s._id} value={s._id}>{s.title}</option>)}
              </select>
            </F>
          )}

          <F label="Episode Title" required>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. How I Got My First Brand Deal at 5K Followers"
              maxLength={200} style={inputSt} onFocus={focusSt} onBlur={blurSt} />
          </F>

          <F label="Description">
            <textarea value={description} onChange={e=>setDescription(e.target.value.slice(0,3000))}
              placeholder="What's this episode about? Give listeners a reason to tune in." rows={3}
              style={{ ...inputSt, height:'auto', resize:'vertical', lineHeight:1.6, padding:'10px 12px' }} onFocus={focusSt} onBlur={blurSt} />
            <div style={{ fontSize:11, color:T.text3, textAlign:'right', marginTop:3 }}>{description.length}/3000</div>
          </F>

          <F label="Show Notes">
            <textarea value={showNotes} onChange={e=>setShowNotes(e.target.value.slice(0,5000))}
              placeholder="Links, resources, guest bios, timestamps…" rows={3}
              style={{ ...inputSt, height:'auto', resize:'vertical', lineHeight:1.6, padding:'10px 12px' }} onFocus={focusSt} onBlur={blurSt} />
          </F>

          <F label="Tags" hint="Comma-separated, max 5">
            <input value={tags} onChange={e=>setTags(e.target.value)} placeholder="brand deals, instagram, monetization"
              style={inputSt} onFocus={focusSt} onBlur={blurSt} />
          </F>

          <div style={{ display:'flex', gap:10, marginTop:8 }}>
            {onCancel && <Btn ghost onClick={onCancel}>Cancel</Btn>}
            <Btn onClick={createEpisode} disabled={creating||!title.trim()}>
              {creating ? '⏳ Creating…' : 'Continue →'}
            </Btn>
          </div>
        </div>
      )}

      {/* ══════════════════════════
          STEP 2 — Audio
      ══════════════════════════ */}
      {step===2 && (
        <div style={{ padding:'24px' }}>
          <div style={{ fontFamily:T.fontDisplay, fontSize:22, fontWeight:700, color:T.text, marginBottom:6 }}>Add Audio</div>
          <div style={{ fontSize:13.5, color:T.text3, marginBottom:20 }}>Upload an audio file or record directly in your browser.</div>

          {/* Mode tabs */}
          <div style={{ display:'flex', gap:8, marginBottom:20 }}>
            {[{id:'upload',icon:'📁',label:'Upload File'},{id:'record',icon:'🎤',label:'Record Now'}].map(m=>(
              <button key={m.id} onClick={()=>setAudioMode(m.id)} style={{ flex:1, height:42, borderRadius:10, fontSize:13.5, fontWeight:500, cursor:'pointer', border:'none', background:audioMode===m.id?T.accentGrad:T.bg3, color:audioMode===m.id?'#fff':T.text2, boxShadow:audioMode===m.id?'0 3px 10px rgba(99,102,241,.25)':'none', fontFamily:T.font, transition:'all .15s', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
                <span style={{ fontSize:16 }}>{m.icon}</span>{m.label}
              </button>
            ))}
          </div>

          {/* ── UPLOAD ── */}
          {audioMode==='upload' && !uploadDone && (
            <div>
              {/* Drop zone */}
              <div
                onClick={()=>fileRef.current?.click()}
                onDragOver={e=>e.preventDefault()}
                onDrop={e=>{ e.preventDefault(); const f=e.dataTransfer.files[0]; if(f&&f.type.startsWith('audio/'))setAudioFile(f); }}
                style={{ border:`2px dashed ${audioFile?T.green:T.border2}`, borderRadius:14, padding:'32px 20px', textAlign:'center', cursor:'pointer', background:audioFile?T.greenSoft:T.bg2, transition:'all .2s', marginBottom:16 }}>
                <input ref={fileRef} type="file" accept="audio/*" style={{ display:'none' }} onChange={e=>e.target.files[0]&&setAudioFile(e.target.files[0])} />
                {audioFile ? (
                  <div>
                    <div style={{ fontSize:32, marginBottom:8 }}>✅</div>
                    <div style={{ fontSize:14, fontWeight:600, color:T.green }}>{audioFile.name}</div>
                    <div style={{ fontSize:12, color:T.text3, marginTop:4 }}>{(audioFile.size/1024/1024).toFixed(2)} MB</div>
                    <button onClick={e=>{e.stopPropagation();setAudioFile(null);}} style={{ marginTop:10, padding:'4px 12px', borderRadius:7, background:'transparent', border:`1px solid ${T.border2}`, color:T.text3, cursor:'pointer', fontSize:12, fontFamily:T.font }}>
                      Change file
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize:36, marginBottom:10, opacity:.4 }}>🎵</div>
                    <div style={{ fontSize:14, fontWeight:500, color:T.text2, marginBottom:4 }}>
                      Drag & drop audio or <span style={{ color:T.accent, fontWeight:600 }}>browse</span>
                    </div>
                    <div style={{ fontSize:12, color:T.text3 }}>MP3 · WAV · M4A · WEBM · max 500MB</div>
                  </>
                )}
              </div>

              {/* Upload progress */}
              {uploading && (
                <div style={{ marginBottom:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:12.5, color:T.text2, marginBottom:6 }}>
                    <span>Uploading to server…</span><span style={{ fontWeight:700, color:T.accent }}>{uploadPct}%</span>
                  </div>
                  <div style={{ height:8, background:T.bg4, borderRadius:4, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${uploadPct}%`, background:T.accentGrad, borderRadius:4, transition:'width .3s ease' }} />
                  </div>
                  {uploadPct>0&&uploadPct<100&&<div style={{ fontSize:11, color:T.text3, marginTop:4, textAlign:'center' }}>Transcription will begin automatically after upload completes</div>}
                </div>
              )}

              <div style={{ display:'flex', gap:10 }}>
                <Btn ghost onClick={()=>setStep(1)}>← Back</Btn>
                <Btn onClick={()=>uploadAudioFile(audioFile)} disabled={!audioFile||uploading}>
                  {uploading?`Uploading ${uploadPct}%…`:'↑ Upload Audio'}
                </Btn>
              </div>
            </div>
          )}

          {/* Upload done */}
          {audioMode==='upload' && uploadDone && (
            <div>
              <div style={{ padding:'16px 20px', background:T.greenSoft, border:`1px solid rgba(16,185,129,.2)`, borderRadius:12, marginBottom:16, textAlign:'center' }}>
                <div style={{ fontSize:28, marginBottom:6 }}>✅</div>
                <div style={{ fontSize:14, fontWeight:600, color:T.green }}>Audio uploaded successfully!</div>
                <div style={{ fontSize:12.5, color:T.text3, marginTop:4 }}>Transcription is generating in the background — it'll appear in the player once ready.</div>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <Btn ghost onClick={()=>{setUploadDone(false);setUploadPct(0);setAudioFile(null);}}>Replace Audio</Btn>
                <Btn onClick={()=>setStep(3)}>Add Chapters →</Btn>
              </div>
            </div>
          )}

          {/* ── RECORD ── */}
          {audioMode==='record' && (
            <div style={{ textAlign:'center' }}>
              {/* Mic circle */}
              <div style={{ width:110, height:110, borderRadius:'50%', margin:'0 auto 20px', background:recording?'rgba(239,68,68,.08)':T.bg3, border:`3px solid ${recording?T.red:T.border2}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:44, transition:'all .3s', boxShadow:recording?`0 0 0 8px rgba(239,68,68,.08)`:T.shadow }}>
                🎤
              </div>

              {recording && (
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:30, fontWeight:800, color:T.red, fontFamily:T.fontDisplay, letterSpacing:2 }}>{fmtSec(recordTime)}</div>
                  <div style={{ fontSize:12, color:T.text3, marginTop:4, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:T.red, animation:'pulse 1s infinite' }} />
                    Recording in progress…
                  </div>
                </div>
              )}

              {!recording && recordedBlob && !uploadDone && (
                <div style={{ marginBottom:16 }}>
                  <audio src={URL.createObjectURL(recordedBlob)} controls style={{ width:'100%', borderRadius:10, marginBottom:8 }} />
                  <div style={{ fontSize:12.5, color:T.green, fontWeight:600 }}>✓ Recording ready — {fmtSec(recordTime||0)}</div>
                </div>
              )}

              {uploadDone && (
                <div style={{ padding:'14px 20px', background:T.greenSoft, border:`1px solid rgba(16,185,129,.2)`, borderRadius:12, marginBottom:16, textAlign:'center' }}>
                  <div style={{ fontSize:14, fontWeight:600, color:T.green }}>✅ Recording uploaded!</div>
                  <div style={{ fontSize:12, color:T.text3, marginTop:4 }}>Transcription queued in background.</div>
                </div>
              )}

              <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
                {!recording && !recordedBlob && !uploadDone && (
                  <Btn onClick={startRecording}>🎤 Start Recording</Btn>
                )}
                {recording && (
                  <button onClick={stopRec} style={{ height:44, padding:'0 24px', borderRadius:12, background:T.red, color:'#fff', border:'none', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:T.font, display:'flex', alignItems:'center', gap:8 }}>
                    ⏹ Stop Recording
                  </button>
                )}
                {!recording && recordedBlob && !uploadDone && (
                  <>
                    <Btn ghost onClick={()=>{setRecordedBlob(null);setRecordTime(0);}}>🔄 Re-record</Btn>
                    <Btn onClick={uploadRecording} disabled={uploading}>
                      {uploading?`Uploading ${uploadPct}%…`:'↑ Upload Recording'}
                    </Btn>
                  </>
                )}
                {uploadDone && <Btn onClick={()=>setStep(3)}>Add Chapters →</Btn>}
              </div>

              {uploading && (
                <div style={{ marginTop:16 }}>
                  <div style={{ height:6, background:T.bg4, borderRadius:3, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${uploadPct}%`, background:T.accentGrad, borderRadius:3, transition:'width .3s' }} />
                  </div>
                  <div style={{ fontSize:11, color:T.text3, textAlign:'center', marginTop:4 }}>{uploadPct}%</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════
          STEP 3 — Chapters
      ══════════════════════════ */}
      {step===3 && (
        <div style={{ padding:'24px' }}>
          <div style={{ fontFamily:T.fontDisplay, fontSize:22, fontWeight:700, color:T.text, marginBottom:4 }}>Add Chapters</div>
          <div style={{ fontSize:13.5, color:T.text3, marginBottom:20 }}>Optional — helps listeners navigate your episode and improves discoverability.</div>

          {/* Chapter list */}
          {chapters.length > 0 && (
            <div style={{ marginBottom:14, display:'flex', flexDirection:'column', gap:6 }}>
              {chapters.map((c,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:T.bg2, borderRadius:10, border:`1px solid ${T.border}` }}>
                  <span style={{ fontSize:12.5, fontWeight:700, color:T.accent, width:44, flexShrink:0 }}>{fmtSec(c.startSec)}</span>
                  <span style={{ flex:1, fontSize:13.5, color:T.text }}>{c.title}</span>
                  <button onClick={()=>setChapters(prev=>prev.filter((_,j)=>j!==i))}
                    style={{ background:'none', border:'none', cursor:'pointer', color:T.text3, fontSize:15, lineHeight:1, padding:'2px 4px', borderRadius:5, transition:'color .1s' }}
                    onMouseEnter={e=>e.currentTarget.style.color=T.red}
                    onMouseLeave={e=>e.currentTarget.style.color=T.text3}>✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Add chapter row */}
          <div style={{ display:'flex', gap:8, marginBottom:20 }}>
            <input value={chStart} onChange={e=>setChStart(e.target.value)} placeholder="Start (sec)" type="number" min="0"
              style={{ ...inputSt, width:90, flexShrink:0 }} onFocus={focusSt} onBlur={blurSt} />
            <input value={chTitle} onChange={e=>setChTitle(e.target.value)} placeholder="Chapter title…"
              style={inputSt} onFocus={focusSt} onBlur={blurSt}
              onKeyDown={e=>e.key==='Enter'&&addChapter()} />
            <button onClick={addChapter}
              style={{ height:42, width:42, borderRadius:10, background:T.accent, color:'#fff', border:'none', cursor:'pointer', fontSize:20, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 2px 8px rgba(99,102,241,.3)', transition:'all .12s' }}
              onMouseEnter={e=>e.currentTarget.style.opacity='.85'}
              onMouseLeave={e=>e.currentTarget.style.opacity='1'}>+</button>
          </div>

          <div style={{ fontSize:12.5, color:T.text3, marginBottom:20, padding:'10px 14px', background:T.bg2, borderRadius:8, border:`1px solid ${T.border}`, lineHeight:1.6 }}>
            💡 Tip: Add a chapter every 5–10 minutes. Enter the start time in seconds (e.g. 300 for 5:00). Chapters appear as clickable markers in the player.
          </div>

          <div style={{ display:'flex', gap:10 }}>
            <Btn ghost onClick={skipAndPublish} disabled={savingCh}>Skip & Publish</Btn>
            <Btn onClick={saveAndPublish} disabled={savingCh}>
              {savingCh ? '⏳ Publishing…' : chapters.length>0 ? 'Save & Publish ✓' : 'Publish Now →'}
            </Btn>
          </div>
        </div>
      )}

      {/* ══════════════════════════
          STEP 4 — Published
      ══════════════════════════ */}
      {step===4 && (
        <div style={{ padding:'48px 32px', textAlign:'center' }}>
          <div style={{ width:80, height:80, borderRadius:'50%', background:T.greenSoft, border:`2px solid rgba(16,185,129,.25)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, margin:'0 auto 20px' }}>✅</div>
          <div style={{ fontFamily:T.fontDisplay, fontSize:26, fontWeight:700, color:T.text, marginBottom:8 }}>Episode Published!</div>
          <div style={{ fontSize:14, color:T.text2, lineHeight:1.7, marginBottom:24 }}>
            Your episode is live and visible to your subscribers.<br />
            Transcription is generating in the background — it'll appear in the player within a few minutes.
          </div>
          <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
            <Btn ghost onClick={()=>{ setStep(1);setEpisodeId(null);setTitle('');setDescription('');setShowNotes('');setTags('');setAudioFile(null);setUploadDone(false);setRecordedBlob(null);setChapters([]); }}>
              + Upload Another
            </Btn>
            {onSuccess && <Btn onClick={onSuccess}>Go to Episode →</Btn>}
          </div>
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
}

// ── Shared primitives ─────────────────────────────────────────────────────────
function F({ label, required, hint, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
        <label style={{ fontSize:12.5, fontWeight:700, color:T.text2 }}>
          {label}{required&&<span style={{ color:T.red }}> *</span>}
        </label>
        {hint && <span style={{ fontSize:11, color:T.text3 }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Btn({ children, onClick, disabled, ghost }) {
  const base = { flex:1, height:44, borderRadius:12, fontSize:14, fontWeight:700, border:'none', cursor:disabled?'not-allowed':'pointer', fontFamily:T.font, transition:'all .15s', display:'flex', alignItems:'center', justifyContent:'center', gap:6 };
  const prim = { background:T.accentGrad, color:'#fff', boxShadow: disabled?'none':'0 3px 10px rgba(99,102,241,.3)', opacity:disabled?.55:1 };
  const gh   = { background:T.bg3, color:T.text2, border:`1.5px solid ${T.border2}` };
  return (
    <button onClick={disabled?undefined:onClick} style={{ ...base, ...(ghost?gh:prim) }}
      onMouseEnter={e=>{ if(!disabled&&!ghost)e.currentTarget.style.opacity='.88'; }}
      onMouseLeave={e=>{ e.currentTarget.style.opacity=disabled?.55:'1'; }}>
      {children}
    </button>
  );
}

const inputSt = {
  width:'100%', height:42, background:T.bg3, border:`1.5px solid ${T.border}`, borderRadius:10,
  padding:'0 13px', fontSize:13.5, color:T.text, fontFamily:T.font, outline:'none', transition:'border-color .15s, box-shadow .15s',
};
const focusSt = e => { e.target.style.borderColor=T.accent; e.target.style.boxShadow=`0 0 0 3px rgba(99,102,241,.10)`; };
const blurSt  = e => { e.target.style.borderColor=T.border; e.target.style.boxShadow='none'; };
