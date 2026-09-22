export const S = `
.frg-cal-wrap { position: relative; width: 100%; }
.frg-cal-input { 
  width: 100%;
  cursor: pointer; 
  padding-right: 40px;
  background: transparent;
  border: none;
  font-family: 'Schibsted Grotesk', sans-serif;
  font-size: 15px;
  color: var(--ink, #1A1A1A);
  outline: none;
}
.frg-cal-icon { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); color: var(--muted, #8B8781); pointer-events: none; }
.frg-cal-icon svg { width: 18px; height: 18px; }
.frg-cal-popover {
  position: absolute; top: calc(100% + 8px); left: 0; z-index: 100;
  background: var(--card, #FBFAF7); border: 1px solid var(--line, rgba(26,26,26,.12)); border-radius: 16px;
  padding: 16px; width: 300px;
  box-shadow: 0 14px 40px rgba(26,26,26,.15);
  animation: frgUpCal .3s var(--ease, cubic-bezier(.22,1,.36,1)) both;
}
.frg-cal-header { display: flex; gap: 8px; margin-bottom: 16px; }
.frg-cal-selwrap { position: relative; flex: 1; min-width: 0; }
.frg-cal-selwrap .frg-select-input {
  background: var(--tint, rgba(212,90,121,.10)); border: 1px solid transparent; border-radius: 8px;
  padding: 6px 20px 6px 12px; font-size: 13px; font-weight: 500; width: 100%;
}
.frg-cal-selwrap .frg-select-input:hover { background: #fff; border-color: var(--line, rgba(26,26,26,.12)); }
.frg-cal-selwrap .frg-select-icon { right: 4px; }
.frg-cal-selwrap .frg-select-icon svg { width: 14px; height: 14px; }
.frg-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.frg-cal-day-label {
  font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase;
  color: var(--muted, #8B8781); text-align: center; padding-bottom: 8px;
}
.frg-cal-cell {
  background: transparent; border: 1px solid transparent; border-radius: 8px;
  height: 34px; display: grid; place-items: center;
  font-family: 'Schibsted Grotesk', sans-serif; font-size: 14px; color: var(--ink, #1A1A1A);
  cursor: pointer; transition: background .2s, color .2s, border-color .2s;
}
.frg-cal-cell:hover:not(:disabled):not(.on) { background: var(--tint, rgba(212,90,121,.10)); border-color: rgba(212,90,121,.3); color: var(--p2, #D45A79); }
.frg-cal-cell.on { background: var(--grad, linear-gradient(135deg,#FFC98F 20%,#DD8164 58%,#D45A79 88%)); color: #fff; font-weight: 600; box-shadow: 0 4px 12px rgba(212,90,121,.4); }
.frg-cal-cell:disabled { opacity: .2; cursor: not-allowed; }

@keyframes frgUpCal { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform:none; } }
`;
