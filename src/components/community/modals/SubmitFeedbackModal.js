// 'use client';
// import { useState, useRef } from 'react';

// const CONTENT_TYPES = [
//   { id: 'reel', label: '🎥 Reel Draft', color: 'var(--cm-red)' },
//   { id: 'thumbnail', label: '🖼️ Thumbnail', color: 'var(--cm-orange)' },
//   { id: 'script', label: '📝 Script', color: 'var(--cm-green)' },
//   { id: 'brand', label: '🏷️ Brand Readiness', color: 'var(--cm-purple)' },
// ];

// export default function SubmitFeedbackModal({ onClose, onSubmit }) {
//   const [form, setForm] = useState({ contentType: '', objective: '', tags: '' });
//   const [file, setFile] = useState(null);
//   const [dragOver, setDragOver] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [consented, setConsented] = useState(false);
//   const [fileError, setFileError] = useState('');
//   const fileRef = useRef(null);

//   const ALLOWED_TYPES = {
//     reel: ['.mp4', '.mov'],
//     thumbnail: ['.jpg', '.png', '.webp'],
//     script: ['.pdf', '.txt', '.docx'],
//     brand: ['.mp4', '.mov', '.jpg', '.png'],
//   };

//   const MAX_SIZE = {
//     reel: 500 * 1024 * 1024, // 500MB
//     thumbnail: 20 * 1024 * 1024, // 20MB
//     script: 10 * 1024 * 1024, // 10MB
//     brand: 500 * 1024 * 1024,
//   };

//   function handleFile(f) {
//     setFileError('');
//     if (!form.contentType) { setFileError('Select a content type first.'); return; }
//     const ext = '.' + f.name.split('.').pop().toLowerCase();
//     if (!ALLOWED_TYPES[form.contentType]?.includes(ext)) {
//       setFileError(`Invalid file type. Allowed: ${ALLOWED_TYPES[form.contentType]?.join(', ')}`);
//       return;
//     }
//     if (f.size > MAX_SIZE[form.contentType]) {
//       setFileError(`File too large. Max size: ${form.contentType === 'reel' ? '500MB' : '20MB'}.`);
//       return;
//     }
//     setFile(f);
//   }

//   function handleDrop(e) {
//     e.preventDefault();
//     setDragOver(false);
//     const f = e.dataTransfer.files[0];
//     if (f) handleFile(f);
//   }

//   function validate() {
//     const errs = {};
//     if (!form.contentType) errs.contentType = 'Select a content type';
//     if (!file) errs.file = 'Upload your content file';
//     if (!form.objective.trim() || form.objective.length < 20) errs.objective = 'Minimum 20 characters required';
//     return errs;
//   }

//   function handleSubmit() {
//     if (!consented) return;
//     const errs = validate();
//     if (Object.keys(errs).length > 0) { setErrors(errs); return; }
//     onSubmit?.();
//     onClose();
//   }

//   return (
//     <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
//       <div style={{
//         background: 'var(--cm-bg2)', border: '1px solid var(--cm-border2)', borderRadius: 20,
//         width: '100%', maxWidth: 540, maxHeight: '92vh', overflowY: 'auto',
//         animation: 'cm-scale-in .2s ease both',
//       }}>
//         {/* Header */}
//         <div style={{ padding: '22px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
//           <div style={{ fontFamily: 'var(--cm-font-display)', fontSize: 20, fontWeight: 700, color: 'var(--cm-text)' }}>Submit for Review</div>
//           <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--cm-text3)', cursor: 'pointer', fontSize: 20 }}>✕</button>
//         </div>

//         <div style={{ padding: '0 24px 24px' }}>
//           {/* Content type */}
//           <div style={{ marginBottom: 18 }}>
//             <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--cm-text2)', display: 'block', marginBottom: 8 }}>
//               Content Type <span style={{ color: 'var(--cm-red)' }}>*</span>
//             </label>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
//               {CONTENT_TYPES.map(ct => (
//                 <div
//                   key={ct.id}
//                   onClick={() => { setForm(f => ({ ...f, contentType: ct.id })); setFile(null); setFileError(''); }}
//                   style={{
//                     padding: '11px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13,
//                     display: 'flex', alignItems: 'center', gap: 8, transition: 'all .15s',
//                     border: `1px solid ${form.contentType === ct.id ? ct.color : 'var(--cm-border2)'}`,
//                     background: form.contentType === ct.id ? `${ct.color}15` : 'var(--cm-bg3)',
//                     color: form.contentType === ct.id ? ct.color : 'var(--cm-text2)',
//                     fontWeight: form.contentType === ct.id ? 600 : 400,
//                   }}
//                 >
//                   {ct.label}
//                 </div>
//               ))}
//             </div>
//             {errors.contentType && <div style={{ fontSize: 11.5, color: 'var(--cm-red)', marginTop: 5 }}>⚠ {errors.contentType}</div>}
//           </div>

//           {/* File upload */}
//           <div style={{ marginBottom: 18 }}>
//             <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--cm-text2)', display: 'block', marginBottom: 6 }}>
//               Upload File <span style={{ color: 'var(--cm-red)' }}>*</span>
//             </label>
//             <div
//               onDrop={handleDrop}
//               onDragOver={e => { e.preventDefault(); setDragOver(true); }}
//               onDragLeave={() => setDragOver(false)}
//               onClick={() => fileRef.current?.click()}
//               style={{
//                 border: `2px dashed ${dragOver ? 'var(--cm-accent)' : errors.file ? 'var(--cm-red)' : 'var(--cm-border2)'}`,
//                 borderRadius: 12, padding: '20px 16px', textAlign: 'center', cursor: 'pointer',
//                 background: dragOver ? 'var(--cm-accent-soft)' : 'var(--cm-bg3)', transition: 'all .2s',
//               }}
//             >
//               <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
//               {file ? (
//                 <div style={{ fontSize: 13, color: 'var(--cm-green)', fontWeight: 500 }}>
//                   ✓ {file.name} <span style={{ color: 'var(--cm-text3)', fontWeight: 400 }}>({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
//                 </div>
//               ) : (
//                 <>
//                   <div style={{ fontSize: 24, marginBottom: 8 }}>📁</div>
//                   <div style={{ fontSize: 13, color: 'var(--cm-text2)', marginBottom: 4 }}>
//                     Drag & drop or <span style={{ color: 'var(--cm-accent2)', fontWeight: 500 }}>browse</span>
//                   </div>
//                   <div style={{ fontSize: 11.5, color: 'var(--cm-text3)' }}>
//                     Video ≤500MB · Images ≤20MB · Docs ≤10MB
//                   </div>
//                   <div style={{ fontSize: 11, color: 'var(--cm-red)', marginTop: 6, fontWeight: 500 }}>
//                     ⚠ No nudity, adult content, or copyrighted material
//                   </div>
//                 </>
//               )}
//             </div>
//             {(errors.file || fileError) && <div style={{ fontSize: 11.5, color: 'var(--cm-red)', marginTop: 5 }}>⚠ {fileError || errors.file}</div>}
//           </div>

//           {/* Objective */}
//           <div style={{ marginBottom: 18 }}>
//             <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--cm-text2)', display: 'block', marginBottom: 6 }}>
//               What should reviewers focus on? <span style={{ color: 'var(--cm-red)' }}>*</span>
//               <span style={{ float: 'right', fontWeight: 400, color: 'var(--cm-text3)' }}>{form.objective.length} / 500</span>
//             </label>
//             <textarea
//               value={form.objective}
//               onChange={e => setForm(f => ({ ...f, objective: e.target.value.slice(0, 500) }))}
//               placeholder="E.g. Does the hook feel too promotional? Is the pacing right for the first 3 seconds?"
//               style={{
//                 width: '100%', minHeight: 90, background: 'var(--cm-bg3)',
//                 border: `1px solid ${errors.objective ? 'var(--cm-red)' : 'var(--cm-border2)'}`,
//                 borderRadius: 9, padding: '10px 12px', color: 'var(--cm-text)', fontSize: 13,
//                 fontFamily: 'var(--cm-font)', outline: 'none', resize: 'vertical', lineHeight: 1.6,
//               }}
//             />
//             {errors.objective && <div style={{ fontSize: 11.5, color: 'var(--cm-red)', marginTop: 5 }}>⚠ {errors.objective}</div>}
//           </div>

//           {/* Tags */}
//           <div style={{ marginBottom: 20 }}>
//             <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--cm-text2)', display: 'block', marginBottom: 6 }}>
//               Tags <span style={{ color: 'var(--cm-text3)', fontWeight: 400 }}>(optional, max 5)</span>
//             </label>
//             <input
//               value={form.tags}
//               onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
//               placeholder="e.g. fashion, reels, hook"
//               style={{
//                 width: '100%', height: 38, background: 'var(--cm-bg3)', border: '1px solid var(--cm-border2)',
//                 borderRadius: 9, padding: '0 12px', color: 'var(--cm-text)', fontSize: 13,
//                 fontFamily: 'var(--cm-font)', outline: 'none',
//               }}
//             />
//           </div>

//           {/* ── SAFETY GATE — MANDATORY ── */}
//           <div
//             onClick={() => setConsented(v => !v)}
//             style={{
//               display: 'flex', gap: 12, padding: '14px 14px', marginBottom: 18, cursor: 'pointer',
//               background: consented ? 'var(--cm-green-soft)' : 'var(--cm-bg3)',
//               border: `1px solid ${consented ? 'rgba(15,217,122,0.2)' : 'var(--cm-border2)'}`,
//               borderRadius: 10, transition: 'all .2s',
//             }}
//           >
//             <div style={{
//               width: 18, height: 18, borderRadius: 5, border: `2px solid ${consented ? 'var(--cm-green)' : 'var(--cm-border2)'}`,
//               background: consented ? 'var(--cm-green-soft)' : 'transparent',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               fontSize: 11, color: 'var(--cm-green)', flexShrink: 0, marginTop: 1, transition: 'all .15s',
//             }}>
//               {consented && '✓'}
//             </div>
//             <div style={{ fontSize: 12, color: 'var(--cm-text2)', lineHeight: 1.6 }}>
//               <strong style={{ color: 'var(--cm-text)' }}>Content Declaration</strong> — I confirm this content is my own original work and does not contain nudity, adult content, violence, hate speech, personal social handles for self-promotion, undisclosed paid promotions, or copyrighted material I do not own.
//             </div>
//           </div>

//           {/* Actions */}
//           <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
//             <button onClick={onClose} style={{ height: 38, padding: '0 18px', background: 'var(--cm-surface)', color: 'var(--cm-text2)', border: '1px solid var(--cm-border2)', borderRadius: 9, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--cm-font)' }}>Cancel</button>
//             <button
//               onClick={handleSubmit}
//               style={{
//                 height: 38, padding: '0 22px', borderRadius: 9, fontSize: 13, fontWeight: 500,
//                 cursor: consented ? 'pointer' : 'not-allowed', border: 'none', fontFamily: 'var(--cm-font)',
//                 background: consented ? 'linear-gradient(135deg,var(--cm-accent),#c0306a)' : 'var(--cm-surface)',
//                 color: consented ? '#fff' : 'var(--cm-text3)',
//                 opacity: consented ? 1 : 0.55, transition: 'all .2s',
//               }}
//             >
//               ◎ Submit for Review
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';
import { useState, useRef } from 'react';
import { Overlay, ModalBox, ModalHeader, Field, ModalActions, inputStyle, textareaStyle } from './PostModal';

const CONTENT_TYPES = [
  { id: 'reel',      label: '🎥 Reel Draft',       color: 'var(--cm-red)',    allowed: ['.mp4','.mov'],            maxSize: '500MB' },
  { id: 'thumbnail', label: '🖼️ Thumbnail',          color: 'var(--cm-orange)', allowed: ['.jpg','.png','.webp'],    maxSize: '20MB' },
  { id: 'script',    label: '📝 Script',             color: 'var(--cm-green)',  allowed: ['.pdf','.txt','.docx'],    maxSize: '10MB' },
  { id: 'brand',     label: '🏷️ Brand Readiness',   color: 'var(--cm-purple)', allowed: ['.mp4','.mov','.jpg','.png'], maxSize: '500MB' },
];

const MAX_BYTES = { reel: 500, thumbnail: 20, script: 10, brand: 500 };

export default function SubmitFeedbackModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ contentType: '', objective: '', tags: '' });
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState('');
  const [errors, setErrors] = useState({});
  const [consented, setConsented] = useState(false);
  const fileRef = useRef(null);

  const ct = CONTENT_TYPES.find(c => c.id === form.contentType);

  function handleFile(f) {
    setFileError('');
    if (!form.contentType) { setFileError('Select a content type first.'); return; }
    const ext = '.' + f.name.split('.').pop().toLowerCase();
    if (!ct?.allowed.includes(ext)) { setFileError(`Allowed: ${ct?.allowed.join(', ')}`); return; }
    const maxMB = MAX_BYTES[form.contentType];
    if (f.size > maxMB * 1024 * 1024) { setFileError(`File too large. Max ${maxMB}MB.`); return; }
    setFile(f);
  }

  function validate() {
    const e = {};
    if (!form.contentType) e.contentType = 'Select a content type';
    if (!file) e.file = 'Upload your content file';
    if (form.objective.trim().length < 20) e.objective = 'Minimum 20 characters required';
    return e;
  }

  function handleSubmit() {
    if (!consented) return;
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSubmit?.();
    onClose();
  }

  return (
    <Overlay onClose={onClose}>
      <ModalBox maxWidth={540}>
        <ModalHeader title="◎ Submit for Review" onClose={onClose} />

        <div style={{ padding: '0 26px 26px' }}>
          {/* Content type */}
          <Field label="Content Type" required error={errors.contentType}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {CONTENT_TYPES.map(ct => (
                <div
                  key={ct.id}
                  onClick={() => { setForm(f => ({ ...f, contentType: ct.id })); setFile(null); setFileError(''); setErrors(e => ({ ...e, contentType: '' })); }}
                  style={{
                    padding: '11px 14px', borderRadius: 11, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8, transition: 'all .15s',
                    fontFamily: 'var(--cm-font)', fontSize: 13.5,
                    fontWeight: form.contentType === ct.id ? 700 : 400,
                    background: form.contentType === ct.id ? `${ct.color}12` : 'var(--cm-bg3)',
                    color: form.contentType === ct.id ? ct.color : 'var(--cm-text2)',
                    boxShadow: form.contentType === ct.id ? `inset 0 0 0 1.5px ${ct.color}` : 'inset 0 0 0 1px var(--cm-border2)',
                  }}
                >
                  {ct.label}
                </div>
              ))}
            </div>
          </Field>

          {/* File upload */}
          <Field label="Upload File" required error={errors.file || fileError}>
            <div
              onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? 'var(--cm-accent)' : errors.file ? 'var(--cm-red)' : 'var(--cm-border2)'}`,
                borderRadius: 14, padding: '22px 16px', textAlign: 'center', cursor: 'pointer',
                background: dragOver ? 'var(--cm-accent-soft)' : file ? 'var(--cm-green-soft)' : 'var(--cm-bg3)',
                transition: 'all .2s',
              }}
            >
              <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
              {file ? (
                <div style={{ fontSize: 13.5, color: 'var(--cm-green)', fontWeight: 600 }}>
                  ✓ {file.name}
                  <span style={{ color: 'var(--cm-text3)', fontWeight: 400, marginLeft: 6 }}>
                    ({(file.size / 1024 / 1024).toFixed(1)} MB)
                  </span>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.4 }}>📁</div>
                  <div style={{ fontSize: 13.5, color: 'var(--cm-text2)', marginBottom: 4 }}>
                    Drag & drop or <span style={{ color: 'var(--cm-accent)', fontWeight: 600 }}>browse</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--cm-text3)' }}>
                    {ct ? `${ct.allowed.join(', ')} · max ${ct.maxSize}` : 'Video ≤500MB · Images ≤20MB · Docs ≤10MB'}
                  </div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8,
                    fontSize: 11.5, color: 'var(--cm-red)', fontWeight: 600,
                    background: 'var(--cm-red-soft)', padding: '3px 10px', borderRadius: 20,
                  }}>
                    ⚠️ No nudity, adult content, or copyrighted material
                  </div>
                </>
              )}
            </div>
          </Field>

          {/* Objective */}
          <Field label="What should reviewers focus on?" required error={errors.objective} hint={`${form.objective.length} / 500`}>
            <textarea
              value={form.objective}
              onChange={e => { setForm(f => ({ ...f, objective: e.target.value.slice(0, 500) })); setErrors(er => ({ ...er, objective: '' })); }}
              placeholder="E.g. Does the hook feel too promotional? Is the pacing right for the first 3 seconds?"
              style={{ ...textareaStyle, minHeight: 88, borderColor: errors.objective ? 'var(--cm-red)' : 'var(--cm-border2)' }}
              onFocus={e => { if (!errors.objective) e.target.style.borderColor = 'var(--cm-accent)'; e.target.style.boxShadow = '0 0 0 3px var(--cm-accent-soft)'; }}
              onBlur={e => { e.target.style.borderColor = errors.objective ? 'var(--cm-red)' : 'var(--cm-border2)'; e.target.style.boxShadow = 'none'; }}
            />
          </Field>

          {/* Tags */}
          <Field label="Tags" hint="Optional · max 5">
            <input
              value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              placeholder="e.g. fashion, reels, hook"
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'var(--cm-accent)'; e.target.style.boxShadow = '0 0 0 3px var(--cm-accent-soft)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--cm-border2)'; e.target.style.boxShadow = 'none'; }}
            />
          </Field>

          {/* ── MANDATORY CONSENT GATE ── */}
          <div
            onClick={() => setConsented(v => !v)}
            style={{
              display: 'flex', gap: 13, padding: '14px 16px', marginBottom: 22,
              cursor: 'pointer', borderRadius: 12, transition: 'all .2s',
              background: consented ? 'var(--cm-green-soft)' : 'var(--cm-bg3)',
              border: `1.5px solid ${consented ? 'rgba(10,173,101,0.25)' : 'var(--cm-border2)'}`,
            }}
          >
            {/* Checkbox */}
            <div style={{
              width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1, transition: 'all .18s',
              border: `2px solid ${consented ? 'var(--cm-green)' : 'var(--cm-border3)'}`,
              background: consented ? 'var(--cm-green)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: '#fff', fontWeight: 700,
              boxShadow: consented ? '0 0 0 3px var(--cm-green-soft2)' : 'none',
            }}>
              {consented && '✓'}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--cm-text2)', lineHeight: 1.65 }}>
              <strong style={{ color: 'var(--cm-text)', display: 'block', marginBottom: 3 }}>Content Declaration</strong>
              I confirm this content is my own original work and does not contain nudity, adult content, violence, hate speech, personal social handles for self-promotion, undisclosed paid promotions, or copyrighted material I do not own.
            </div>
          </div>

          <ModalActions onClose={onClose} onSubmit={handleSubmit} submitLabel="◎ Submit for Review" submitDisabled={!consented} />
        </div>
      </ModalBox>
    </Overlay>
  );
}