import React from 'react';
import { EyeGlyph } from '../../icons';
import { formatDocLabel } from '../../helpers';
import { MAX_GENERIC_FILES } from '../../constants';

export default function Step05Proof({ ctx }) {
  const {
    selfieFile, errors, registerFieldRef, setCameraOpen, selfieStatus, selfiePreview, retakeSelfie,
    fileError, requiredDocs, docSlots, removeSlot, docInputRefs, handleSlotFile,
    uploadedFiles, removeGeneric, addGenericFiles, set, form
  } = ctx;

  return (
    <>
      <div className="frg-rule">LIVE SELFIE</div>
      {!selfieFile ? (
        <div className={`frg-livecard${errors.selfie ? ' err' : ''}`} ref={registerFieldRef('selfie')}>
          <div className="frg-livecard-hdr">
            <span className="frg-livecard-ico"><EyeGlyph size={24} stroke="#fff" /></span>
            <div>
              <div className="frg-livecard-ttl">Live blink verification</div>
              <div className="frg-livecard-sub">About 10 seconds · guided on screen</div>
            </div>
          </div>
          <div className="frg-livecard-body">
            <div className="frg-livesteps">
              <div className="frg-livestep">
                <span className="frg-livestep-n">1</span>
                <span className="frg-livestep-txt">Look straight at the camera and keep your eyes <b>open</b> for three seconds.</span>
              </div>
              <div className="frg-livestep">
                <span className="frg-livestep-n">2</span>
                <span className="frg-livestep-txt">Wait for the <b>3 · 2 · 1</b> countdown to reach zero.</span>
              </div>
              <div className="frg-livestep">
                <span className="frg-livestep-n">3</span>
                <span className="frg-livestep-txt"><b>Blink slowly 2–3 times</b> with a small, natural head movement.</span>
              </div>
            </div>
            <div className="frg-livereq">
              <span>One face only</span>
              <span>Good lighting</span>
              <span>No sunglasses</span>
              <span>Live camera only</span>
            </div>
            <button className="frg-livestart" onClick={() => setCameraOpen(true)}>
              START LIVE CHECK <span>→</span>
            </button>
            {errors.selfie && <div className="frg-help err" style={{ marginTop: 10 }}>⚠ {errors.selfie}</div>}
          </div>
        </div>
      ) : (
        <div className={`frg-selfie${selfieStatus.state === 'done' ? ' done' : ''}${selfieStatus.state === 'error' ? ' error' : ''}`} ref={registerFieldRef('selfie')}>
          <img src={selfiePreview} alt="Live selfie preview" className="frg-selfie-img" />
          <div className="frg-selfie-info">
            <div className="frg-selfie-name">{selfieFile.name}</div>

            {selfieStatus.state === 'checking' && (
              <div className="frg-selfie-row analyzing"><span className="frg-spin" style={{ width: 12, height: 12 }} /> Checking liveness…</div>
            )}
            {selfieStatus.state === 'uploading' && (
              <div className="frg-selfie-row uploading"><span className="frg-spin" style={{ width: 12, height: 12 }} /> Uploading verified selfie…</div>
            )}
            {selfieStatus.state === 'done' && (
              <>
                <div className="frg-selfie-row done">✓ Live face verified &amp; uploaded</div>
                {selfieStatus.liveness && <span className="frg-selfie-live"><span>👁</span> LIVENESS CONFIRMED</span>}
              </>
            )}
            {selfieStatus.state === 'error' && (
              <>
                <div className="frg-selfie-row error">{selfieStatus.msg}</div>
                {selfieStatus.hint && <div className="frg-help err" style={{ marginTop: 4 }}>{selfieStatus.hint}</div>}
              </>
            )}

            {(selfieStatus.state === 'done' || (selfieStatus.state === 'error' && !selfieStatus.fatal)) && (
              <button className="frg-otp" style={{ marginTop: 10, padding: '9px 20px', fontSize: 10 }} onClick={retakeSelfie}>
                {selfieStatus.state === 'done' ? 'RETAKE' : 'TRY AGAIN'}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="frg-rule">SUPPORTING DOCUMENTS — OPTIONAL</div>
      {fileError && <div className="frg-note red">{fileError}</div>}
      {requiredDocs.length > 0 ? (
        <>
          <div className="frg-note soft">
            Upload what you have — these help QC1 review your application faster.
            You can submit without them and add them later if asked.
          </div>
          <div className="frg-docs" ref={registerFieldRef('docs')}>
            {requiredDocs.map(docType => {
              const slot = docSlots[docType];
              return (
                <div key={docType} className="frg-doc-slot">
                  <div className="frg-doc-hdr">
                    <span className="frg-doc-lbl">{formatDocLabel(docType)}</span>
                    {slot && <button className="frg-doc-rm" onClick={() => removeSlot(docType)} title="Remove">×</button>}
                  </div>
                  {slot ? (
                    <div className="frg-doc-file">
                      <div className="frg-doc-fico">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <rect x="1" y="1" width="12" height="12" rx="3" stroke="#DD8164" strokeWidth="1.2" />
                          <path d="M4 6h6M4 8.5h4" stroke="#DD8164" strokeWidth="1.1" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="frg-doc-fname">{slot.name}</div>
                        <div className="frg-doc-fsize">{slot.size}</div>
                      </div>
                      <div style={{ color: 'var(--green)', fontSize: 13, fontWeight: 600 }}>✓</div>
                    </div>
                  ) : (
                    <div className="frg-doc-up" onClick={() => docInputRefs.current[docType]?.click()}
                      role="button" tabIndex={0}
                      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), docInputRefs.current[docType]?.click())}>
                      <input ref={el => { docInputRefs.current[docType] = el; }} type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" style={{ display: 'none' }}
                        onChange={e => { if (e.target.files[0]) handleSlotFile(docType, e.target.files[0]); e.target.value = ''; }} />
                      <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ flex: 'none' }}>
                        <path d="M9 12V4M9 4L6 7M9 4L12 7" stroke="#C96A6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 14h12" stroke="#C96A6B" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span className="frg-doc-up-txt">Upload {formatDocLabel(docType)}</span>
                      <span className="frg-doc-up-sub">PDF · JPG · PNG · WEBP · DOC · MAX 10MB</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="frg-note soft">Upload any supporting documents (awards, contracts, press coverage, credentials).</div>
          {uploadedFiles.map(f => (
            <div className="frg-file" key={f.id}>
              <span className="frg-file-name">{f.name}</span>
              <span className="frg-file-sz">{f.size}</span>
              <span className="frg-file-rm" onClick={() => removeGeneric(f.id)} role="button" tabIndex={0}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), removeGeneric(f.id))}>×</span>
            </div>
          ))}
          {uploadedFiles.length < MAX_GENERIC_FILES && (
            <div className="frg-upload" role="button" tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && e.currentTarget.click()}
              onClick={() => {
                const inp = document.createElement('input');
                inp.type = 'file'; inp.multiple = true;
                inp.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp';
                inp.onchange = e => addGenericFiles(e.target.files);
                inp.click();
              }}>
              <div className="frg-upload-ttl">Click to upload documents</div>
              <div className="frg-upload-sub">
                PDF · DOC · DOCX · JPG · PNG · WEBP · {MAX_GENERIC_FILES - uploadedFiles.length} OF {MAX_GENERIC_FILES} REMAINING · 10MB EACH
              </div>
            </div>
          )}
        </>
      )}

      <div className="frg-rule">PRESS / MEDIA</div>
      <div className="frg-field">
        <label className="frg-label" htmlFor="frg-press">Press / media URLs <span className="opt">Optional</span></label>
        <div className="frg-uline">
          <textarea id="frg-press" className="frg-area" rows={3}
            placeholder="Paste links to press articles — one per line"
            value={form.pressUrls} onChange={set('pressUrls')} />
        </div>
        <div className="frg-help">One link per line. These are sent with your application.</div>
      </div>
    </>
  );
}
