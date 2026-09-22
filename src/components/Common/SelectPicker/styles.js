export const S = `
.frg-select-wrap { position: relative; width: 100%; min-width: 140px; }
.frg-select-wrap.disabled { opacity: .5; pointer-events: none; }
.frg-select-input { 
  width: 100%; 
  cursor: pointer; 
  padding: 8px 32px 8px 12px; 
  text-overflow: ellipsis; 
  white-space: nowrap; 
  overflow: hidden; 
  background: transparent;
  border: none;
  font-family: 'Schibsted Grotesk', sans-serif;
  font-size: 15px;
  color: var(--ink, #1A1A1A);
  outline: none;
}
.frg-select-input.plh-select {
  padding: 6px 24px 6px 4px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
}
.frg-select-icon { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); color: var(--muted, #8B8781); pointer-events: none; }
.frg-select-icon svg { width: 16px; height: 16px; }
.frg-select-popover {
  position: absolute; top: calc(100% + 4px); left: 0; z-index: 100;
  background: var(--card, #FBFAF7); border: 1px solid var(--line, rgba(26,26,26,.12)); border-radius: 12px;
  width: 100%; min-width: 100%; max-height: 260px; overflow-y: auto;
  box-shadow: 0 14px 40px rgba(26,26,26,.15);
  animation: frgUpSelect .2s var(--ease, cubic-bezier(.22,1,.36,1)) both;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.frg-select-popover::-webkit-scrollbar { display: none; }
.frg-select-list { display: flex; flex-direction: column; padding: 8px; }
.frg-select-empty { padding: 12px; text-align: center; color: var(--muted, #8B8781); font-size: 13px; font-weight: 300; }
.frg-select-option {
  background: transparent; border: none; border-radius: 8px;
  padding: 12px 14px; text-align: left;
  font-family: 'Schibsted Grotesk', sans-serif; font-size: 14px; color: var(--ink, #1A1A1A);
  cursor: pointer; transition: background .2s, color .2s;
}
.frg-select-option:hover:not(.on) { background: var(--tint, rgba(212,90,121,.10)); color: var(--p2, #D45A79); }
.frg-select-option.on { background: var(--grad, linear-gradient(135deg,#FFC98F 20%,#DD8164 58%,#D45A79 88%)); color: #fff; font-weight: 600; box-shadow: 0 4px 12px rgba(212,90,121,.4); }

@keyframes frgUpSelect { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform:none; } }
`;
