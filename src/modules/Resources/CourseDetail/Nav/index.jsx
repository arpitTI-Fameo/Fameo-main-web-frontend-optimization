'use client';
// modules/Resources/CourseDetail/Nav/index.jsx

import { AVATAR } from '../constants';

export default function Nav({ scrolled, crumbLabel, onCrumb, onHome }) {
  return (
    <nav className={`cx-nav${scrolled ? " scrolled" : ""}`}>
      <div className="cx-nav-left">
        <button className="cx-logo" onClick={onHome}>
          <div className="cx-logo-mark">F</div>FAMEO
        </button>
        <button className="cx-crumb" onClick={onCrumb}>
          <span className="back">←</span>{crumbLabel}
        </button>
      </div>
      <div className="cx-avatar">
        <div className="cx-avatar-in" style={{ backgroundImage: `url('${AVATAR}')` }} />
      </div>
    </nav>
  );
}
