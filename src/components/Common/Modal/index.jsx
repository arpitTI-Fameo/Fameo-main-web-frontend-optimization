'use client';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { S } from './styles';

export default function Modal({ isOpen, onClose, title, icon, children, maxWidth = 780, maxHeight }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isMounted) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 240); // Matches animation duration
  };

  if (!isOpen && !isClosing) return null;

  return createPortal(
    <>
      <style>{S}</style>
      <div className={`frg-modal-backdrop ${isClosing ? 'is-closing' : ''}`} onClick={handleClose}>
        <div
          className={`frg-modal-sheet ${isClosing ? 'is-closing' : ''}`}
          onClick={e => e.stopPropagation()}
          style={{ maxWidth: maxWidth, maxHeight: maxHeight }}
        >
          <div className="frg-modal-topline"></div>
          <div className="frg-modal-handle"></div>

          {(title || icon) && (
            <div className="frg-modal-header">
              {icon && <div className="frg-modal-icon">{icon}</div>}
              <div className="frg-modal-title-block">
                {title && <h2 className="frg-modal-title">{title}</h2>}
              </div>
              <button type="button" className="frg-modal-close" onClick={handleClose} aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}

          <div className="frg-modal-body">
            {children}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
