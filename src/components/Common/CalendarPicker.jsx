import React, { useState, useRef, useEffect } from 'react';
import SelectPicker from './SelectPicker';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function CalendarPicker({ value, onChange, min, max, id, className, 'aria-invalid': ariaInvalid, 'aria-describedby': ariaDescribedby }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const currentYear = new Date().getFullYear();
  // By default, open the calendar on the max date (e.g. exactly 18 years ago) if no value is selected,
  // or jump to the currently selected date if there is one.
  const initialDate = value ? new Date(value) : (max ? new Date(max) : new Date());
  
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const minDate = min ? new Date(min) : new Date(1900, 0, 1);
  const maxDate = max ? new Date(max) : new Date(2100, 11, 31);
  
  // Year dropdown should cover [minYear, maxYear]
  const minYear = minDate.getFullYear();
  const maxYear = maxDate.getFullYear();
  const years = [];
  for (let i = maxYear; i >= minYear; i--) {
    years.push(i);
  }

  // Generate calendar grid
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  
  const days = [];
  // padding days
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handleSelect = (day) => {
    if (!day) return;
    
    // YYYY-MM-DD formatting, keeping local time logic stable
    const d = new Date(viewYear, viewMonth, day);
    
    if (d < minDate || d > maxDate) return;

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    
    const newValue = `${yyyy}-${mm}-${dd}`;
    onChange({ target: { value: newValue } });
    setIsOpen(false);
  };

  const parseDisplayValue = (val) => {
    if (!val) return '';
    const [y, m, d] = val.split('-');
    if (!y || !m || !d) return val;
    const dateObj = new Date(val);
    if (isNaN(dateObj)) return val;
    return `${parseInt(d, 10)} ${MONTHS[parseInt(m, 10) - 1]} ${y}`;
  };

  const isSelected = (day) => {
    if (!value || !day) return false;
    const d = new Date(viewYear, viewMonth, day);
    const v = new Date(value);
    return d.getFullYear() === v.getFullYear() && d.getMonth() === v.getMonth() && d.getDate() === v.getDate();
  };

  const isDisabled = (day) => {
    if (!day) return true;
    const d = new Date(viewYear, viewMonth, day);
    // compare only dates (zero out hours for safety)
    d.setHours(0,0,0,0);
    const mi = new Date(minDate); mi.setHours(0,0,0,0);
    const ma = new Date(maxDate); ma.setHours(0,0,0,0);
    return d < mi || d > ma;
  };

  return (
    <div className="frg-cal-wrap" ref={containerRef}>
      <input
        id={id}
        className={`${className} frg-cal-input`}
        type="text"
        readOnly
        value={parseDisplayValue(value)}
        onClick={() => setIsOpen(!isOpen)}
        placeholder="DD Month YYYY"
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
      />
      <div className="frg-cal-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </div>

      {isOpen && (
        <div className="frg-cal-popover">
          <div className="frg-cal-header">
            <div className="frg-cal-selwrap">
              <SelectPicker
                value={viewMonth}
                onChange={e => setViewMonth(parseInt(e.target.value, 10))}
                options={MONTHS.map((m, i) => ({ value: i, label: m }))}
              />
            </div>
            <div className="frg-cal-selwrap">
              <SelectPicker
                value={viewYear}
                onChange={e => setViewYear(parseInt(e.target.value, 10))}
                options={years.map(y => ({ value: y, label: y }))}
              />
            </div>
          </div>
          <div className="frg-cal-grid">
            {DAYS.map(d => (
              <div key={d} className="frg-cal-day-label">{d}</div>
            ))}
            {days.map((day, i) => (
              <button
                key={i}
                type="button"
                className={`frg-cal-cell${isSelected(day) ? ' on' : ''}`}
                disabled={isDisabled(day)}
                onClick={() => handleSelect(day)}
              >
                {day || ''}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
