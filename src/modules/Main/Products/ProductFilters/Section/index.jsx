'use client';
// modules/Products/ProductFilters/Section/index.jsx

import { useState } from 'react';

// Collapsible section
export default function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="pf-section">
      <button className="pf-section-head" onClick={() => setOpen((o) => !o)}>
        {title}
        <span className={`pf-chev${open ? ' open' : ''}`}>▾</span>
      </button>
      {open && <div className="pf-section-body">{children}</div>}
    </div>
  );
}
