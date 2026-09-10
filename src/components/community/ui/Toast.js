// // 'use client';
// // import { useState, useEffect, useCallback } from 'react';

// // const TOAST_ICONS = {
// //   success: '✅',
// //   error: '❌',
// //   warning: '⚠️',
// //   info: '💬',
// //   live: '🔴',
// // };

// // const TOAST_COLORS = {
// //   success: { bg: 'var(--cm-green-soft)', border: 'rgba(15,217,122,0.2)', color: 'var(--cm-green)' },
// //   error: { bg: 'var(--cm-red-soft)', border: 'rgba(240,60,90,0.2)', color: 'var(--cm-red)' },
// //   warning: { bg: 'var(--cm-orange-soft)', border: 'rgba(245,160,32,0.2)', color: 'var(--cm-orange)' },
// //   info: { bg: 'var(--cm-surface)', border: 'var(--cm-border2)', color: 'var(--cm-text2)' },
// //   live: { bg: 'var(--cm-red-soft)', border: 'rgba(240,60,90,0.2)', color: 'var(--cm-red)' },
// // };

// // // Global toast manager — call window.showToast(msg, type) from anywhere
// // export function ToastContainer() {
// //   const [toasts, setToasts] = useState([]);

// //   const addToast = useCallback((message, type = 'info', duration = 4000) => {
// //     const id = Date.now() + Math.random();
// //     setToasts(prev => [...prev, { id, message, type }]);
// //     setTimeout(() => {
// //       setToasts(prev => prev.filter(t => t.id !== id));
// //     }, duration);
// //   }, []);

// //   useEffect(() => {
// //     if (typeof window !== 'undefined') {
// //       window.showToast = addToast;
// //     }
// //   }, [addToast]);

// //   if (toasts.length === 0) return null;

// //   return (
// //     <div style={{
// //       position: 'fixed', bottom: 24, right: 24, zIndex: 9000,
// //       display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end',
// //     }}>
// //       {toasts.map(toast => (
// //         <ToastItem key={toast.id} toast={toast} onDismiss={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />
// //       ))}
// //     </div>
// //   );
// // }

// // function ToastItem({ toast, onDismiss }) {
// //   const [visible, setVisible] = useState(false);
// //   const style = TOAST_COLORS[toast.type] || TOAST_COLORS.info;

// //   useEffect(() => {
// //     const t = setTimeout(() => setVisible(true), 10);
// //     return () => clearTimeout(t);
// //   }, []);

// //   return (
// //     <div
// //       style={{
// //         display: 'flex', alignItems: 'center', gap: 10,
// //         padding: '11px 16px', borderRadius: 12,
// //         background: style.bg, border: `1px solid ${style.border}`,
// //         boxShadow: 'var(--cm-shadow)', fontFamily: 'var(--cm-font)',
// //         minWidth: 240, maxWidth: 360,
// //         opacity: visible ? 1 : 0,
// //         transform: visible ? 'translateX(0)' : 'translateX(24px)',
// //         transition: 'opacity .25s ease, transform .25s ease',
// //         cursor: 'pointer',
// //       }}
// //       onClick={onDismiss}
// //     >
// //       <span style={{ fontSize: 17, flexShrink: 0 }}>{TOAST_ICONS[toast.type] || '💬'}</span>
// //       <span style={{ fontSize: 13, color: 'var(--cm-text)', lineHeight: 1.5, flex: 1 }}
// //         dangerouslySetInnerHTML={{ __html: toast.message }}
// //       />
// //       <span style={{ fontSize: 14, color: 'var(--cm-text3)', flexShrink: 0 }}>✕</span>
// //     </div>
// //   );
// // }

// 'use client';
// import { useState, useEffect, useCallback } from 'react';

// const VARIANTS = {
//   success: { bg: 'var(--cm-green-soft2)', border: 'rgba(10,173,101,0.25)', icon: '✅', accent: 'var(--cm-green)' },
//   error:   { bg: 'var(--cm-red-soft2)',   border: 'rgba(224,43,75,0.25)',   icon: '❌', accent: 'var(--cm-red)' },
//   warning: { bg: 'var(--cm-orange-soft)', border: 'rgba(232,134,10,0.25)',  icon: '⚠️', accent: 'var(--cm-orange)' },
//   info:    { bg: 'var(--cm-surface)',     border: 'var(--cm-border2)',      icon: '💬', accent: 'var(--cm-accent)' },
//   live:    { bg: 'var(--cm-red-soft)',    border: 'rgba(224,43,75,0.25)',   icon: '🔴', accent: 'var(--cm-red)' },
// };

// export function ToastContainer() {
//   const [toasts, setToasts] = useState([]);

//   const add = useCallback((message, type = 'info', duration = 4200) => {
//     const id = Date.now() + Math.random();
//     setToasts(prev => [...prev.slice(-4), { id, message, type }]);
//     setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
//   }, []);

//   useEffect(() => {
//     if (typeof window !== 'undefined') window.showToast = add;
//   }, [add]);

//   return (
//     <div style={{
//       position: 'fixed', bottom: 24, right: 24, zIndex: 9000,
//       display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end',
//       pointerEvents: 'none',
//     }}>
//       {toasts.map(t => (
//         <ToastItem
//           key={t.id}
//           toast={t}
//           onDismiss={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
//         />
//       ))}
//     </div>
//   );
// }

// function ToastItem({ toast, onDismiss }) {
//   const [visible, setVisible] = useState(false);
//   const v = VARIANTS[toast.type] || VARIANTS.info;

//   useEffect(() => {
//     const t = setTimeout(() => setVisible(true), 16);
//     return () => clearTimeout(t);
//   }, []);

//   return (
//     <div
//       onClick={onDismiss}
//       style={{
//         display: 'flex', alignItems: 'flex-start', gap: 10,
//         padding: '12px 16px 12px 14px',
//         borderRadius: 14,
//         background: v.bg,
//         border: `1px solid ${v.border}`,
//         boxShadow: 'var(--cm-shadow-lg)',
//         fontFamily: 'var(--cm-font)',
//         minWidth: 256, maxWidth: 360,
//         cursor: 'pointer',
//         pointerEvents: 'auto',
//         opacity: visible ? 1 : 0,
//         transform: visible ? 'translateX(0) scale(1)' : 'translateX(18px) scale(0.96)',
//         transition: 'opacity .28s ease, transform .28s cubic-bezier(0.22,1,0.36,1)',
//       }}
//     >
//       {/* Accent bar */}
//       <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, borderRadius: 2, background: v.accent }} />

//       <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.2 }}>{v.icon}</span>
//       <span
//         style={{ fontSize: 13.5, color: 'var(--cm-text)', lineHeight: 1.55, flex: 1 }}
//         dangerouslySetInnerHTML={{ __html: toast.message }}
//       />
//       <span style={{ fontSize: 15, color: 'var(--cm-text4)', flexShrink: 0, marginTop: 1 }}>✕</span>
//     </div>
//   );
// }

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