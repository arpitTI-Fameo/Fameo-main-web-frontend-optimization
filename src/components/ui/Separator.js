import React, { useId } from 'react';

// A flexible separator line used to divide sections.
// Can be either curved (default) or straight.
export default function Separator({
  className = '',
  colors = ['transparent', '#D45A79', 'transparent'],
  variant = 'curve' // 'curve' | 'straight'
}) {
  const uniqueId = useId();
  const gradId = `sep-grad-${uniqueId.replace(/:/g, '')}`;

  if (variant === 'straight') {
    return (
      <div 
        className={className}
        style={{
          background: `linear-gradient(to right, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
          height: '1px',
          border: 'none'
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <svg
      className={className}
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="50%" stopColor={colors[1]} />
          <stop offset="100%" stopColor={colors[2]} />
        </linearGradient>
      </defs>
      <path
        d="M0,0 Q50,15 100,0"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
