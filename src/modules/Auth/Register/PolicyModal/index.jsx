'use client';

import { useState, useEffect } from 'react';

/* ── Policy Modal ────────────────────────────────────────────────────────── */
export default function PolicyModal({ policy, onClose }) {
  const [loaded, setLoaded] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
  const handleClose = () => { setClosing(true); setTimeout(onClose, 240); };

  return (
    <div className={`pm-backdrop${closing ? ' pm-closing' : ''}`}
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
      role="dialog" aria-modal="true" aria-label={policy.label}>
      <div className={`pm-sheet${closing ? ' pm-closing' : ''}`}>
        <div className="pm-topline" aria-hidden="true" />
        <div className="pm-handle" aria-hidden="true" />
        <div className="pm-header">
          <div className="pm-icon">{policy.icon}</div>

          <div className="pm-title-block">
            <span className="pm-eyebrow">Legal · Fameo</span>
            <div className="pm-title">{policy.label}</div>
          </div>
          <div className="pm-actions">
            <a href={policy.href} target="_blank" rel="noopener noreferrer" className="pm-action-btn" title="Open in new tab">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M7 1h4m0 0v4m0-4L5.5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Open</span>
            </a>
            <button className="pm-close" onClick={handleClose} aria-label="Close">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className="pm-iframe-wrap">
          <div className={`pm-spinner-ov${loaded ? ' pm-hidden' : ''}`}>
            <span className="frg-spin" style={{ width: 30, height: 30 }} />
            <span className="pm-spin-txt">Loading document…</span>
          </div>
          <iframe className="pm-iframe" src={policy.href} title={policy.label}
            onLoad={() => setLoaded(true)}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms" />
        </div>
      </div>
    </div>
  );
}
