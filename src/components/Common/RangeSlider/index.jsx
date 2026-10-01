import React, { useState, useEffect, useRef, useCallback } from 'react';
import { S } from './styles';

export default function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value = [0, 100],
  onChange,
  formatLabel = (v) => v,
}) {
  const [localValue, setLocalValue] = useState(value);
  const trackRef = useRef(null);
  const isDragging = useRef(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handlePointerDown = (index, e) => {
    e.preventDefault();
    isDragging.current = index;
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = useCallback((e) => {
    if (isDragging.current === null || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newValue = Math.round((percent * (max - min) + min) / step) * step;

    setLocalValue((prev) => {
      const next = [...prev];
      next[isDragging.current] = newValue;

      if (isDragging.current === 0) {
        next[0] = Math.min(next[0], next[1]);
      } else {
        next[1] = Math.max(next[0], next[1]);
      }

      if (onChange && (next[0] !== prev[0] || next[1] !== prev[1])) {
        onChange(next);
      }
      return next;
    });
  }, [min, max, step, onChange]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = null;
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove]);

  useEffect(() => {
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  const leftPercent = ((localValue[0] - min) / (max - min)) * 100;
  const rightPercent = ((localValue[1] - min) / (max - min)) * 100;

  return (
    <>
      <style>{S}</style>
      <div className="rng-wrap">
        <div className="rng-labels">
          <span>{formatLabel(localValue[0])}</span>
          <span>{formatLabel(localValue[1])}</span>
        </div>
        <div className="rng-track-wrap" ref={trackRef}>
          <div className="rng-track-bg"></div>
          <div 
            className="rng-track-fill" 
            style={{ left: `${leftPercent}%`, right: `${100 - rightPercent}%` }}
          ></div>
          <div
            className="rng-thumb"
            style={{ left: `${leftPercent}%` }}
            onPointerDown={(e) => handlePointerDown(0, e)}
          ></div>
          <div
            className="rng-thumb"
            style={{ left: `${rightPercent}%` }}
            onPointerDown={(e) => handlePointerDown(1, e)}
          ></div>
        </div>
      </div>
    </>
  );
}
