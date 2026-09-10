/* ── small pieces ────────────────────────────────────────────────────────── */
export const Tick = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="11" fill="#D45A79" />
    <path d="M7 12.5l3.2 3L17 9" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const CheckMark = () => (<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>);
export const GreenTick = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="11" fill="#0e9f5a" />
    <path d="M7 12.5l3.2 3L17 9" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const EyeGlyph = ({ size = 78, stroke = '#FFC98F' }) => (
  <svg viewBox="0 0 78 50" fill="none" aria-hidden="true" width={size} height={size * 50 / 78}>
    <path d="M3 25C12 10 24.5 3 39 3s27 7 36 22c-9 15-21.5 22-36 22S12 40 3 25z"
      stroke={stroke} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="39" cy="25" r="10" fill={stroke} />
  </svg>
);
export const MiniCheck = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="6.2" stroke="#D45A79" strokeWidth="1.2" />
    <path d="M4.3 7.2l1.9 1.9L9.9 5.4" stroke="#D45A79" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Check({ on, toggle, err, locked, errText, refCb, children }) {
  return (
    <div
      ref={refCb}
      className={`frg-check${on ? ' on' : ''}${err ? ' err' : ''}${locked ? ' locked' : ''}`}
      onClick={locked ? undefined : toggle}
      role="checkbox" aria-checked={on} aria-disabled={locked || undefined} tabIndex={0}
      onKeyDown={e => !locked && (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), toggle())}
    >
      <span className="frg-box"><CheckMark /></span>
      <p>{children}{err && errText && <span className="frg-check-err">{errText}</span>}</p>
    </div>
  );
}
