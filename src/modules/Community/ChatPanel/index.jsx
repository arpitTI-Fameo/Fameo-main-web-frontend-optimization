'use client';
// components/community/chat/ChatPanel.js
// Full real-time chat — white/light theme
// Connects to: /api/chat/* REST + Socket.io
// Features: DM + group rooms, message history, reactions, reply, voice recording,
//           file/image upload, typing indicators, read receipts, edit/delete

import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
// SAST H-5 (extended). This read localStorage's `fameo_token` — the ADMIN
// key set by adminAuthStore, not the creator session. Regular users sent an
// empty Bearer token; admins leaked their admin JWT to community endpoints.
import { useAuthStore } from '@/store/authStore';

// ── Design tokens (white theme) ───────────────────────────────────────────────
const T = {
  bg:         '#ffffff',
  bg2:        '#f8f9fc',
  bg3:        '#f1f3f9',
  border:     '#e5e8f0',
  border2:    '#d0d5e8',
  text:       '#0f1117',
  text2:      '#4a5070',
  text3:      '#8890a8',
  accent:     '#6366f1',
  accentSoft: 'rgba(99,102,241,0.10)',
  accentGrad: 'linear-gradient(135deg,#6366f1,#a855f7)',
  green:      '#10b981',
  red:        '#ef4444',
  shadow:     '0 2px 12px rgba(99,102,241,0.10)',
  shadowLg:   '0 8px 32px rgba(99,102,241,0.15)',
  radius:     12,
  font:       '"DM Sans", system-ui, sans-serif',
};

// ── Socket singleton ──────────────────────────────────────────────────────────
let _socket = null;
function getSocket(token) {
  if (!_socket || _socket.disconnected) {
    _socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return _socket;
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const REACTIONS = ['❤️','👍','😂','😮','🔥','👏','🎯','😢'];

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmtTime = d => new Date(d).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
const fmtDate = d => {
  const dt = new Date(d);
  const today = new Date();
  if (dt.toDateString() === today.toDateString()) return 'Today';
  const yest = new Date(today); yest.setDate(yest.getDate()-1);
  if (dt.toDateString() === yest.toDateString()) return 'Yesterday';
  return dt.toLocaleDateString('en-IN', { day:'numeric', month:'short' });
};
const fmtAudio = s => `${Math.floor((s||0)/60)}:${String(Math.floor((s||0)%60)).padStart(2,'0')}`;

function groupByDate(msgs) {
  const groups = [];
  let lastDate = '';
  msgs.forEach(m => {
    const d = fmtDate(m.createdAt);
    if (d !== lastDate) { groups.push({ type:'date', label:d }); lastDate = d; }
    groups.push({ type:'msg', msg: m });
  });
  return groups;
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAT PANEL
// ─────────────────────────────────────────────────────────────────────────────
export default function ChatPanel({ roomId, currentUser, roomName, roomAvatar, onClose, onBack, style }) {
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState('');
  const [typing, setTyping]         = useState([]);   // [{userId, name}]
  const [connected, setConnected]   = useState(false);
  const [replyTo, setReplyTo]       = useState(null);
  const [editingId, setEditingId]   = useState(null);
  const [editInput, setEditInput]   = useState('');
  const [reactionFor, setReactionFor] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [uploading, setUploading]   = useState(false);
  const [recording, setRecording]   = useState(false);
  const [recordTime, setRecordTime] = useState(0);

  const bottomRef   = useRef(null);
  const typingTimer = useRef(null);
  const inputRef    = useRef(null);
  const fileRef     = useRef(null);
  const mediaRef    = useRef(null);
  const chunksRef   = useRef([]);
  const recTimer    = useRef(null);

  const userId  = currentUser?._id || currentUser?.id || '';
  const token   = currentUser?.token || useAuthStore.getState().token || '';

  // ── Load history + connect socket ────────────────────────────────────────
  useEffect(() => {
    if (!roomId || !token) return;

    setLoading(true);
    fetch(`${API}/api/chat/rooms/${roomId}/messages?limit=50`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(res => { setMessages(Array.isArray(res.data) ? res.data : []); setLoading(false); })
      .catch(() => setLoading(false));

    const sock = getSocket(token);
    sock.on('connect',    () => setConnected(true));
    sock.on('disconnect', () => setConnected(false));
    sock.emit('room:join', { roomId });
    // Mark read
    sock.emit('message:read', { roomId });

    sock.on('message:new', msg => {
      setMessages(prev => [...prev, msg]);
      if (document.hasFocus()) sock.emit('message:read', { roomId });
    });
    sock.on('message:updated',  updated  => setMessages(prev => prev.map(m => m._id === updated._id ? updated : m)));
    sock.on('message:deleted',  ({ messageId }) => setMessages(prev => prev.map(m => m._id === messageId ? { ...m, isDeleted:true, content:'' } : m)));
    sock.on('message:reactions', ({ messageId, reactions }) => setMessages(prev => prev.map(m => m._id === messageId ? { ...m, reactions } : m)));
    sock.on('typing:start', ({ userId: uid, name }) => {
      if (uid === userId) return;
      setTyping(prev => prev.find(t => t.userId === uid) ? prev : [...prev, { userId:uid, name }]);
    });
    sock.on('typing:stop', ({ userId: uid }) => setTyping(prev => prev.filter(t => t.userId !== uid)));

    return () => {
      sock.emit('room:leave', { roomId });
      ['message:new','message:updated','message:deleted','message:reactions','typing:start','typing:stop'].forEach(e => sock.off(e));
    };
  }, [roomId, token]);

  // Scroll to bottom
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  // ── Send text ─────────────────────────────────────────────────────────────
  function send() {
    const content = input.trim();
    if (!content) return;
    const sock = getSocket(token);
    sock.emit('message:send', { roomId, type:'text', content, replyTo: replyTo?._id || null });
    setInput(''); setReplyTo(null); stopTyping();
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  // ── Typing indicators ─────────────────────────────────────────────────────
  const startTyping = useCallback(() => {
    clearTimeout(typingTimer.current);
    getSocket(token).emit('typing:start', { roomId });
    typingTimer.current = setTimeout(stopTyping, 2500);
  }, [roomId, token]);

  function stopTyping() {
    clearTimeout(typingTimer.current);
    getSocket(token)?.emit('typing:stop', { roomId });
  }

  // ── Edit ──────────────────────────────────────────────────────────────────
  function startEdit(msg) { setEditingId(msg._id); setEditInput(msg.content); }
  function submitEdit() {
    if (!editInput.trim()) return;
    getSocket(token).emit('message:edit', { messageId: editingId, content: editInput.trim() });
    setEditingId(null); setEditInput('');
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  function deleteMsg(msgId) { getSocket(token).emit('message:delete', { messageId: msgId }); }

  // ── Reactions ─────────────────────────────────────────────────────────────
  function react(msgId, emoji) {
    getSocket(token).emit('message:react', { messageId: msgId, emoji });
    setReactionFor(null);
  }

  // ── File / image upload ───────────────────────────────────────────────────
  async function uploadFile(file) {
    if (!file) return;
    setUploading(true);
    const type = file.type.startsWith('image/') ? 'image' : file.type.startsWith('audio/') ? 'audio' : 'file';
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', type);
    try {
      const res = await fetch(`${API}/api/chat/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error('Upload failed');
    } catch (e) { console.error(e); }
    setUploading(false);
  }

  // ── Voice recording ───────────────────────────────────────────────────────
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType:'audio/webm' });
      chunksRef.current = [];
      mr.ondataavailable = e => e.data.size > 0 && chunksRef.current.push(e.data);
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type:'audio/webm' });
        stream.getTracks().forEach(t => t.stop());
        clearInterval(recTimer.current);
        setRecording(false); setRecordTime(0);
        await uploadFile(new File([blob], 'voice.webm', { type:'audio/webm' }));
      };
      mr.start(250);
      mediaRef.current = mr;
      setRecording(true); setRecordTime(0);
      recTimer.current = setInterval(() => setRecordTime(t => t+1), 1000);
    } catch { alert('Microphone access denied'); }
  }

  function stopRecording() { mediaRef.current?.stop(); clearInterval(recTimer.current); }

  const isMe = msg => (msg.sender?._id || msg.sender?.id) === userId;
  const grouped = groupByDate(messages);

  return (
    <div style={{
      display:'flex', flexDirection:'column', height:'100%', minHeight:500,
      background: T.bg, borderRadius: T.radius+4, border:`1px solid ${T.border}`,
      boxShadow: T.shadowLg, overflow:'hidden', fontFamily: T.font,
      ...style,
    }}>

      {/* ── Header ── */}
      <div style={{ padding:'14px 18px', borderBottom:`1px solid ${T.border}`, background:T.bg, display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
        {onBack && (
          <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', fontSize:18, color:T.text3, padding:'2px 6px', borderRadius:6, marginRight:2, transition:'color .1s' }}
            onMouseEnter={e=>e.currentTarget.style.color=T.text} onMouseLeave={e=>e.currentTarget.style.color=T.text3}>←</button>
        )}
        {/* Avatar */}
        <div style={{ width:38, height:38, borderRadius:'50%', flexShrink:0, background:`linear-gradient(135deg,#6366f1,#a855f7)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'#fff', overflow:'hidden' }}>
          {roomAvatar ? <img src={roomAvatar} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" /> : (roomName||'C')[0].toUpperCase()}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:700, color:T.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{roomName || 'Chat'}</div>
          <div style={{ fontSize:11, color: connected ? T.green : T.text3, display:'flex', alignItems:'center', gap:4 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background: connected ? T.green : T.text3 }} />
            {connected ? 'Online' : 'Connecting…'}
          </div>
        </div>
        {onClose && <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:T.text3, fontSize:18, lineHeight:1 }}>✕</button>}
      </div>

      {/* ── Messages ── */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 14px', display:'flex', flexDirection:'column', gap:2, background:T.bg2 }}>
        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:10, padding:'8px 0' }}>
            {[80,60,90,70].map((w,i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-end', gap:8, flexDirection: i%2===0?'row':'row-reverse' }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:'#e5e8f0', flexShrink:0 }} />
                <div style={{ width:`${w}%`, height:40, borderRadius:12, background:'#e5e8f0', animation:'shimmer 1.5s infinite' }} />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:T.text3, padding:40, textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:12, opacity:.4 }}>💬</div>
            <div style={{ fontSize:14, fontWeight:600, color:T.text2, marginBottom:4 }}>No messages yet</div>
            <div style={{ fontSize:13 }}>Send a message to start the conversation!</div>
          </div>
        ) : (
          grouped.map((item, idx) => item.type === 'date' ? (
            <div key={idx} style={{ textAlign:'center', padding:'10px 0 4px', fontSize:11.5, color:T.text3, fontWeight:600, letterSpacing:'.03em' }}>
              <span style={{ background:T.bg3, padding:'3px 10px', borderRadius:20 }}>{item.label}</span>
            </div>
          ) : (
            <Bubble
              key={item.msg._id}
              msg={item.msg}
              isMe={isMe(item.msg)}
              editingId={editingId}
              editInput={editInput}
              onEditChange={setEditInput}
              onEditSubmit={submitEdit}
              onEditCancel={() => setEditingId(null)}
              onReply={() => setReplyTo(item.msg)}
              onEdit={() => startEdit(item.msg)}
              onDelete={() => deleteMsg(item.msg._id)}
              onReact={emoji => react(item.msg._id, emoji)}
              reactionFor={reactionFor}
              setReactionFor={setReactionFor}
            />
          ))
        )}

        {/* Typing */}
        {typing.length > 0 && (
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 8px 0' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'#e5e8f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:T.text3 }}>
              {typing[0].name?.[0]||'?'}
            </div>
            <div style={{ background:T.bg, border:`1px solid ${T.border}`, borderRadius:'16px 16px 16px 4px', padding:'8px 14px', display:'flex', gap:3, alignItems:'center', boxShadow:'0 1px 4px rgba(0,0,0,.06)' }}>
              {[0,1,2].map(i => <div key={i} style={{ width:5, height:5, borderRadius:'50%', background:T.text3, animation:`bounce 1.2s ${i*.2}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Reply bar ── */}
      {replyTo && (
        <div style={{ padding:'8px 14px', background:T.accentSoft, borderTop:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
          <div style={{ width:3, height:32, background:T.accent, borderRadius:2, flexShrink:0 }} />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.accent }}>↩ Replying to {replyTo.sender?.name}</div>
            <div style={{ fontSize:12, color:T.text2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', opacity:.8 }}>{replyTo.content?.slice(0,80)}</div>
          </div>
          <button onClick={() => setReplyTo(null)} style={{ background:'none', border:'none', cursor:'pointer', color:T.text3, fontSize:16, lineHeight:1 }}>✕</button>
        </div>
      )}

      {/* ── Input bar ── */}
      <div style={{ padding:'10px 12px', borderTop:`1px solid ${T.border}`, background:T.bg, flexShrink:0 }}>
        {recording ? (
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'4px 8px', background:'#fff5f5', border:`1.5px solid ${T.red}20`, borderRadius:12 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:T.red, animation:'pulse 1s infinite' }} />
            <span style={{ fontSize:13, fontWeight:600, color:T.red }}>{fmtAudio(recordTime)}</span>
            <span style={{ flex:1, fontSize:12, color:T.text3 }}>Recording…</span>
            <button onClick={stopRecording} style={{ padding:'5px 14px', borderRadius:8, background:T.red, color:'#fff', border:'none', cursor:'pointer', fontSize:12, fontWeight:600 }}>
              ⏹ Send
            </button>
            <button onClick={() => { mediaRef.current?.stop(); clearInterval(recTimer.current); setRecording(false); }} style={{ padding:'5px 10px', borderRadius:8, background:T.bg3, color:T.text3, border:`1px solid ${T.border}`, cursor:'pointer', fontSize:12 }}>
              Cancel
            </button>
          </div>
        ) : (
          <div style={{ display:'flex', alignItems:'flex-end', gap:8 }}>
            {/* Attach button */}
            <input ref={fileRef} type="file" accept="image/*,audio/*,.pdf,.doc,.docx" style={{ display:'none' }} onChange={e => uploadFile(e.target.files[0])} />
            <button onClick={() => fileRef.current?.click()} title="Attach file"
              style={{ width:36, height:36, borderRadius:9, border:`1px solid ${T.border2}`, background:T.bg2, cursor:'pointer', fontSize:16, color:T.text3, display:'flex', alignItems:'center', justifyContent:'center', transition:'all .12s', flexShrink:0 }}
              onMouseEnter={e=>{e.currentTarget.style.background=T.bg3;e.currentTarget.style.color=T.accent;}}
              onMouseLeave={e=>{e.currentTarget.style.background=T.bg2;e.currentTarget.style.color=T.text3;}}>
              📎
            </button>

            {/* Voice button */}
            <button onClick={startRecording} title="Record voice message"
              style={{ width:36, height:36, borderRadius:9, border:`1px solid ${T.border2}`, background:T.bg2, cursor:'pointer', fontSize:15, color:T.text3, display:'flex', alignItems:'center', justifyContent:'center', transition:'all .12s', flexShrink:0 }}
              onMouseEnter={e=>{e.currentTarget.style.background=T.bg3;e.currentTarget.style.color=T.accent;}}
              onMouseLeave={e=>{e.currentTarget.style.background=T.bg2;e.currentTarget.style.color=T.text3;}}>
              🎤
            </button>

            {/* Text input */}
            <textarea ref={inputRef} value={input}
              onChange={e => { setInput(e.target.value); startTyping(); }}
              onKeyDown={handleKey} placeholder="Type a message…" rows={1}
              style={{ flex:1, resize:'none', background:T.bg3, border:`1.5px solid ${T.border2}`, borderRadius:12, padding:'9px 13px', fontSize:13.5, color:T.text, fontFamily:T.font, outline:'none', lineHeight:1.5, maxHeight:100, overflowY:'auto', transition:'border-color .15s' }}
              onFocus={e=>e.target.style.borderColor=T.accent}
              onBlur={e=>e.target.style.borderColor=T.border2}
            />

            {/* Send button */}
            <button onClick={send} disabled={!input.trim() || uploading}
              style={{ width:40, height:40, borderRadius:10, border:'none', cursor: input.trim()?'pointer':'not-allowed', background: input.trim() ? T.accentGrad : T.bg3, color: input.trim()?'#fff':T.text3, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, boxShadow: input.trim()?'0 3px 10px rgba(99,102,241,.35)':'none', transition:'all .15s', flexShrink:0 }}>
              {uploading ? '⏳' : '↑'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}
        @keyframes shimmer{0%{opacity:.6}50%{opacity:1}100%{opacity:.6}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
      `}</style>
    </div>
  );
}

// ── Message Bubble ────────────────────────────────────────────────────────────
function Bubble({ msg, isMe, editingId, editInput, onEditChange, onEditSubmit, onEditCancel, onReply, onEdit, onDelete, onReact, reactionFor, setReactionFor }) {
  const [hover, setHover] = useState(false);
  const isEditing = editingId === msg._id;

  if (msg.isDeleted) return (
    <div style={{ textAlign: isMe?'right':'left', padding:'2px 8px', fontSize:12, color:T.text3, fontStyle:'italic' }}>[Message deleted]</div>
  );
  if (msg.type === 'system') return (
    <div style={{ textAlign:'center', padding:'4px 0', fontSize:11.5, color:T.text3 }}>{msg.content}</div>
  );

  const reacts = msg.reactions ? Object.entries(msg.reactions).filter(([,users]) => Array.isArray(users) && users.length>0) : [];

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display:'flex', flexDirection: isMe?'row-reverse':'row', alignItems:'flex-end', gap:8, marginBottom:3, position:'relative' }}>

      {/* Avatar */}
      {!isMe && (
        <div style={{ width:28, height:28, borderRadius:'50%', flexShrink:0, background:`linear-gradient(135deg,#6366f1,#a855f7)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff', alignSelf:'flex-end', marginBottom:16 }}>
          {msg.sender?.avatar
            ? <img src={msg.sender.avatar} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} alt="" />
            : (msg.sender?.name||'?')[0]}
        </div>
      )}

      <div style={{ maxWidth:'72%', display:'flex', flexDirection:'column', alignItems: isMe?'flex-end':'flex-start', gap:1 }}>
        {!isMe && <span style={{ fontSize:11, color:T.text3, paddingLeft:4, fontWeight:600, marginBottom:1 }}>{msg.sender?.name}</span>}

        {/* Reply context */}
        {msg.replyTo && (
          <div style={{ background: isMe?'rgba(255,255,255,.2)':'#f1f3f9', borderLeft:`3px solid ${isMe?'rgba(255,255,255,.5)':T.accent}`, borderRadius:'6px 6px 0 0', padding:'5px 10px', fontSize:11.5, color: isMe?'rgba(255,255,255,.8)':T.text3, marginBottom:-4, maxWidth:'100%' }}>
            <div style={{ fontWeight:600, fontSize:10, marginBottom:1 }}>{msg.replyTo.sender?.name}</div>
            {msg.replyTo.content?.slice(0,70)}
          </div>
        )}

        {/* Bubble */}
        <div style={{
          padding: msg.type==='audio' ? '10px 14px' : msg.type==='image' ? '4px' : '10px 14px',
          borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          background: isMe ? T.accentGrad : T.bg,
          border: isMe ? 'none' : `1px solid ${T.border}`,
          color: isMe ? '#fff' : T.text,
          fontSize:13.5, lineHeight:1.55, wordBreak:'break-word',
          boxShadow: isMe ? '0 2px 8px rgba(99,102,241,.3)' : '0 1px 4px rgba(0,0,0,.06)',
        }}>
          {isEditing ? (
            <div>
              <textarea value={editInput} onChange={e=>onEditChange(e.target.value)}
                style={{ width:'100%', background:'rgba(255,255,255,.2)', border:'1px solid rgba(255,255,255,.4)', borderRadius:6, padding:'6px 8px', color:'#fff', fontFamily:T.font, fontSize:13, resize:'none', outline:'none', minHeight:60 }}
                autoFocus onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();onEditSubmit();}}} />
              <div style={{ display:'flex', gap:6, marginTop:6 }}>
                <button onClick={onEditSubmit} style={{ padding:'3px 10px', borderRadius:6, background:'rgba(255,255,255,.25)', color:'#fff', border:'none', cursor:'pointer', fontSize:12, fontWeight:600 }}>Save</button>
                <button onClick={onEditCancel} style={{ padding:'3px 10px', borderRadius:6, background:'transparent', color:'rgba(255,255,255,.7)', border:'1px solid rgba(255,255,255,.3)', cursor:'pointer', fontSize:12 }}>Cancel</button>
              </div>
            </div>
          ) : msg.type==='audio' ? (
            <AudioPlayer url={msg.mediaUrl} duration={msg.mediaMeta?.duration} isMe={isMe} />
          ) : msg.type==='image' ? (
            <img src={msg.mediaUrl} alt="" style={{ maxWidth:220, borderRadius:10, display:'block', cursor:'pointer' }} onClick={() => window.open(msg.mediaUrl,'_blank')} />
          ) : msg.type==='file' ? (
            <a href={msg.mediaUrl} target="_blank" rel="noreferrer"
              style={{ display:'flex', alignItems:'center', gap:8, color: isMe?'#fff':T.accent, textDecoration:'none', fontSize:13 }}>
              <span style={{ fontSize:20 }}>📄</span>
              <div>
                <div style={{ fontWeight:600 }}>{msg.mediaMeta?.filename || 'File'}</div>
                <div style={{ fontSize:11, opacity:.7 }}>{msg.mediaMeta?.size ? `${(msg.mediaMeta.size/1024).toFixed(0)} KB` : ''}</div>
              </div>
            </a>
          ) : msg.content}
          {msg.editedAt && <span style={{ fontSize:10, opacity:.6, marginLeft:6 }}>(edited)</span>}
        </div>

        {/* Time + read */}
        <div style={{ display:'flex', alignItems:'center', gap:4, paddingLeft: isMe?0:4, paddingRight: isMe?4:0 }}>
          <span style={{ fontSize:10, color:T.text3 }}>{fmtTime(msg.createdAt)}</span>
          {isMe && msg.readBy?.length > 1 && <span style={{ fontSize:10, color:T.accent }}>✓✓</span>}
        </div>

        {/* Reactions */}
        {reacts.length > 0 && (
          <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:2 }}>
            {reacts.map(([emoji, users]) => (
              <span key={emoji} onClick={() => onReact(emoji)}
                style={{ padding:'2px 8px', background:T.bg, border:`1px solid ${T.border2}`, borderRadius:20, fontSize:12, cursor:'pointer', boxShadow:'0 1px 3px rgba(0,0,0,.06)' }}>
                {emoji} {users.length}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action bar on hover */}
      {hover && (
        <div style={{ display:'flex', gap:2, alignItems:'center', alignSelf:'center', background:T.bg, border:`1px solid ${T.border}`, borderRadius:10, padding:'3px 7px', boxShadow:T.shadow, flexShrink:0, zIndex:10 }}>
          <BtnIcon title="React" onClick={() => setReactionFor(p => p===msg._id ? null : msg._id)}>😊</BtnIcon>
          <BtnIcon title="Reply" onClick={onReply}>↩</BtnIcon>
          {isMe && <><BtnIcon title="Edit" onClick={onEdit}>✏️</BtnIcon><BtnIcon title="Delete" onClick={onDelete} red>🗑</BtnIcon></>}
        </div>
      )}

      {/* Reaction picker */}
      {reactionFor === msg._id && (
        <div style={{ position:'absolute', bottom:'100%', [isMe?'right':'left']:0, background:T.bg, border:`1px solid ${T.border}`, borderRadius:14, padding:'6px 8px', display:'flex', gap:3, boxShadow:T.shadowLg, zIndex:50, marginBottom:6 }}>
          {REACTIONS.map(e => (
            <button key={e} onClick={() => onReact(e)}
              style={{ fontSize:20, background:'none', border:'none', cursor:'pointer', borderRadius:7, padding:3, transition:'transform .1s' }}
              onMouseEnter={e=>e.currentTarget.style.transform='scale(1.35)'}
              onMouseLeave={e=>e.currentTarget.style.transform='none'}>{e}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function BtnIcon({ children, onClick, title, red }) {
  return (
    <button onClick={onClick} title={title}
      style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, color: red?T.red:T.text3, padding:'2px 4px', borderRadius:5, transition:'all .1s' }}
      onMouseEnter={e=>e.currentTarget.style.color=red?T.red:T.text}
      onMouseLeave={e=>e.currentTarget.style.color=red?T.red:T.text3}>{children}</button>
  );
}

// ── Audio Player (inline voice message) ──────────────────────────────────────
function AudioPlayer({ url, duration, isMe }) {
  const [playing, setPlaying] = useState(false);
  const [prog, setProg]       = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const a = ref.current; if(!a) return;
    const t = () => { setElapsed(a.currentTime); setProg((a.currentTime/a.duration)*100||0); };
    const e = () => { setPlaying(false); setProg(0); setElapsed(0); };
    a.addEventListener('timeupdate',t); a.addEventListener('ended',e);
    return () => { a.removeEventListener('timeupdate',t); a.removeEventListener('ended',e); };
  },[]);

  function toggle() {
    const a=ref.current; if(!a) return;
    if(playing){a.pause();}else{a.play();}
    setPlaying(!playing);
  }
  function seek(e){
    const a=ref.current; if(!a||!a.duration) return;
    const r=e.currentTarget.getBoundingClientRect();
    a.currentTime=((e.clientX-r.left)/r.width)*a.duration;
  }

  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:180 }}>
      <audio ref={ref} src={url} preload="metadata" style={{ display:'none' }} />
      <button onClick={toggle}
        style={{ width:32, height:32, borderRadius:'50%', border:'none', cursor:'pointer', fontSize:14, flexShrink:0, background: isMe?'rgba(255,255,255,.25)':'#ede9ff', color: isMe?'#fff':'#6366f1', display:'flex', alignItems:'center', justifyContent:'center', transition:'transform .1s' }}
        onMouseEnter={e=>e.currentTarget.style.transform='scale(1.1)'}
        onMouseLeave={e=>e.currentTarget.style.transform='none'}>
        {playing?'⏸':'▶'}
      </button>
      <div style={{ flex:1 }}>
        <div onClick={seek} style={{ height:4, background: isMe?'rgba(255,255,255,.3)':'#e2e5f0', borderRadius:2, overflow:'hidden', cursor:'pointer', position:'relative' }}>
          <div style={{ height:'100%', width:`${prog}%`, background: isMe?'#fff':'#6366f1', borderRadius:2, transition:'width .1s' }} />
        </div>
        <div style={{ fontSize:10, marginTop:3, opacity:.75 }}>{fmtAudio(elapsed)} / {fmtAudio(duration||0)}</div>
      </div>
    </div>
  );
}

// ── Chat Room List ─────────────────────────────────────────────────────────────
// Use this to show list of rooms before opening ChatPanel
export function ChatRoomList({ currentUser, onSelectRoom }) {
  const [rooms, setRooms]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const token = currentUser?.token || useAuthStore.getState().token || '';

  useEffect(() => {
    fetch(`${API}/api/chat/rooms?limit=30`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(r=>r.json()).then(res=>{ setRooms(Array.isArray(res.data)?res.data:[]); setLoading(false); })
      .catch(()=>setLoading(false));
  },[token]);

  const filtered = rooms.filter(r => {
    const name = r.name || r.participants?.find(p=>p.user._id!==currentUser?._id)?.user?.name || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:T.bg, fontFamily:T.font }}>
      {/* Header */}
      <div style={{ padding:'16px 18px 12px', borderBottom:`1px solid ${T.border}` }}>
        <div style={{ fontSize:17, fontWeight:700, color:T.text, marginBottom:12 }}>Messages</div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search conversations…"
          style={{ width:'100%', height:36, background:T.bg3, border:`1px solid ${T.border}`, borderRadius:9, padding:'0 12px', fontSize:13, color:T.text, fontFamily:T.font, outline:'none' }} />
      </div>

      {/* Rooms */}
      <div style={{ flex:1, overflowY:'auto' }}>
        {loading ? [1,2,3,4].map(i=>(
          <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 18px', borderBottom:`1px solid ${T.border}` }}>
            <div style={{ width:44, height:44, borderRadius:'50%', background:'#e5e8f0', flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ height:13, background:'#e5e8f0', borderRadius:6, width:'55%', marginBottom:6 }} />
              <div style={{ height:11, background:'#e5e8f0', borderRadius:6, width:'80%' }} />
            </div>
          </div>
        )) : filtered.map(room => {
          const other = room.participants?.find(p=>p.user._id!==currentUser?._id)?.user;
          const name = room.name || other?.name || 'Unknown';
          const avatar = other?.avatar;
          const lastMsg = room.lastMessage;
          const unread = room.unreadCount || 0;

          return (
            <div key={room._id} onClick={() => onSelectRoom(room)} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 18px', borderBottom:`1px solid ${T.border}`, cursor:'pointer', transition:'background .12s' }}
              onMouseEnter={e=>e.currentTarget.style.background=T.bg2}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <div style={{ width:44, height:44, borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg,#6366f1,#a855f7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, color:'#fff', overflow:'hidden', position:'relative' }}>
                {avatar ? <img src={avatar} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" /> : name[0]?.toUpperCase()}
                {room.type==='event_room' && <div style={{ position:'absolute', bottom:0, right:0, width:12, height:12, borderRadius:'50%', background:'#ef4444', border:'2px solid #fff' }} />}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:3 }}>
                  <div style={{ fontSize:13.5, fontWeight:unread>0?700:500, color:T.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'65%' }}>{name}</div>
                  <div style={{ fontSize:10, color:T.text3, flexShrink:0 }}>{lastMsg?.sentAt ? fmtTime(lastMsg.sentAt) : ''}</div>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ fontSize:12.5, color:unread>0?T.text2:T.text3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'75%' }}>
                    {lastMsg?.type==='text' ? lastMsg.content?.slice(0,45) : lastMsg?.type ? `[${lastMsg.type}]` : 'No messages yet'}
                  </div>
                  {unread > 0 && <div style={{ minWidth:18, height:18, borderRadius:9, background:T.accent, color:'#fff', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 4px', flexShrink:0 }}>{unread}</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
