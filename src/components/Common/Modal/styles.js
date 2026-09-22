export const S = `
.frg-modal-backdrop { 
  position: fixed; inset: 0; z-index: 9999; 
  background: rgba(18,8,4,.72); 
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); 
  display: flex; align-items: flex-end; justify-content: center; 
  animation: frgModalBgIn .25s ease both; 
}
@keyframes frgModalBgIn { from { opacity: 0; } to { opacity: 1; } }
@media (min-width: 640px) { .frg-modal-backdrop { align-items: center; padding: 24px; } }

.frg-modal-sheet { 
  position: relative; width: 100%; 
  height: auto; max-height: 92dvh; 
  background: var(--card, #FBFAF7); 
  border: 1px solid var(--line, rgba(26,26,26,.12)); 
  border-radius: 20px 20px 0 0; 
  display: flex; flex-direction: column; overflow: hidden; 
  box-shadow: 0 -8px 60px rgba(0,0,0,.15), 0 40px 100px rgba(0,0,0,.3); 
  animation: frgModalSheetIn .32s var(--ease, cubic-bezier(.22,1,.36,1)) both; 
}
@media (min-width: 640px) { .frg-modal-sheet { border-radius: 20px; max-height: 88dvh; } }
@keyframes frgModalSheetIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

.frg-modal-sheet.is-closing { animation: frgModalSheetOut .22s ease forwards; }
.frg-modal-backdrop.is-closing { animation: frgModalBgOut .24s ease forwards; }
@keyframes frgModalSheetOut { to { opacity: 0; transform: translateY(32px); } }
@keyframes frgModalBgOut { to { opacity: 0; } }

.frg-modal-topline { 
  position: absolute; top: 0; left: 0; right: 0; height: 2px; 
  background: var(--grad, linear-gradient(135deg,#FFC98F 20%,#DD8164 58%,#D45A79 88%)); 
  z-index: 2; border-radius: 20px 20px 0 0; 
}
.frg-modal-handle { 
  width: 36px; height: 4px; border-radius: 2px; 
  background: var(--line, rgba(26,26,26,.12)); 
  margin: 14px auto 0; flex: none; 
}
@media (min-width: 640px) { .frg-modal-handle { display: none; } }

.frg-modal-header { 
  display: flex; align-items: center; gap: 12px; 
  padding: 16px 22px 14px; 
  border-bottom: 1px solid var(--line-soft, rgba(26,26,26,.07)); 
  flex: none; 
}
.frg-modal-icon { 
  width: 36px; height: 36px; border-radius: 9px; 
  background: var(--tint, rgba(212,90,121,.10)); 
  border: 1px solid rgba(212,90,121,.25); 
  display: grid; place-items: center; flex: none; font-size: 15px; 
}
.frg-modal-title-block { flex: 1; min-width: 0; }
.frg-modal-title { 
  font-family: 'Fraunces', serif; font-weight: 500; font-size: clamp(15px,2vw,18px); 
  color: var(--ink, #1A1A1A); line-height: 1.2; 
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; 
}
.frg-modal-close { 
  width: 32px; height: 32px; border-radius: 8px; 
  border: 1px solid var(--line, rgba(26,26,26,.12)); 
  background: transparent; display: grid; place-items: center; 
  cursor: pointer; color: var(--muted, #8B8781); 
  transition: border-color .18s, color .18s; flex: none; 
}
.frg-modal-close:hover { border-color: rgba(212,90,121,.5); color: var(--ink, #1A1A1A); }

.frg-modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}
`;
