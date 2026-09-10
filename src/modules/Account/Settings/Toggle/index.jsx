'use client';

import { GOLD } from '@/modules/Account/AccountUI';

// Small gold pill switch matching the account styling.
export default function Toggle({ on, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      style={{
        width: 42, height: 24, borderRadius: 20, flexShrink: 0,
        border: `1.5px solid ${on ? GOLD : '#ddd6c8'}`,
        background: on ? GOLD : '#f0ece3',
        position: 'relative', cursor: 'pointer',
        transition: 'background .18s, border-color .18s',
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: on ? 20 : 2,
        width: 16, height: 16, borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 3px rgba(26,18,8,.25)',
        transition: 'left .18s',
      }} />
    </button>
  );
}
