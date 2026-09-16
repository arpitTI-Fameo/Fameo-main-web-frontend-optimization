import React, { useState, useRef, useEffect } from 'react';

export default function SelectPicker({ 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Select an option', 
  id, 
  className, 
  disabled,
  'aria-invalid': ariaInvalid, 
  'aria-label': ariaLabel 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

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

  const handleSelect = (val) => {
    // Mimic the native event object structure so existing handlers (like e.target.value) work seamlessly
    onChange({ target: { value: val } });
    setIsOpen(false);
  };

  // Find the label for the currently selected value
  const selectedOption = options.find(opt => {
    const optValue = typeof opt === 'object' ? opt.value : opt;
    return optValue === value;
  });
  
  const displayValue = selectedOption 
    ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption)
    : '';

  return (
    <div className={`frg-select-wrap ${disabled ? 'disabled' : ''}`} ref={containerRef}>
      <input
        id={id}
        className={`${className} frg-select-input`}
        type="text"
        readOnly
        value={displayValue}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        placeholder={placeholder}
        aria-invalid={ariaInvalid}
        aria-label={ariaLabel}
        disabled={disabled}
      />
      <div className="frg-select-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && (
        <div className="frg-select-popover">
          <div className="frg-select-list">
            {options.length === 0 ? (
              <div className="frg-select-empty">No options available</div>
            ) : (
              options.map((opt, i) => {
                const optValue = typeof opt === 'object' ? opt.value : opt;
                const optLabel = typeof opt === 'object' ? opt.label : opt;
                const isSelected = optValue === value;

                return (
                  <button
                    key={i}
                    type="button"
                    className={`frg-select-option${isSelected ? ' on' : ''}`}
                    onClick={() => handleSelect(optValue)}
                  >
                    {optLabel}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
