'use client';
// components/community/ui/Toast.js
import { useState, useEffect, useCallback } from 'react';

const COLORS = {
  success: 'var(--cm-green)',
  warn:    'var(--cm-orange)',
  error:   'var(--cm-red)',
  info:    '#334155',
};

let _setToasts = null;

export function showToast(msg, type = 'info') {
  _setToasts?.(prev => [...prev, { id: Date.now(), msg, type }]);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  _setToasts = setToasts;

  const remove = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  useEffect(() => {
    if (typeof window !== 'undefined') window.showToast = showToast;
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', pointerEvents: 'none' }}>
      {toasts.map(t => (
        <Toast key={t.id} {...t} onDone={() => remove(t.id)} />
      ))}
    </div>
  );
}

function Toast({ id, msg, type, onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(false), 3000);
    const t2 = setTimeout(onDone, 3350);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div style={{
      background: COLORS[type] || COLORS.info,
      color: '#fff', padding: '10px 20px', borderRadius: 10,
      fontSize: 13, fontFamily: 'var(--cm-font)', fontWeight: 500,
      boxShadow: '0 4px 24px rgba(0,0,0,.5)',
      whiteSpace: 'nowrap', maxWidth: 'calc(100vw - 32px)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(8px)',
      transition: 'opacity .35s, transform .35s',
      pointerEvents: 'auto',
    }}>
      {msg}
    </div>
  );
}
