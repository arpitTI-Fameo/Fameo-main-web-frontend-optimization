'use client';

import React from 'react';

import lightLogo from '@/app/assets/logo_fameo_2.png';
import darkLogo from '@/app/assets/logo.png';
import markLogo from '@/app/assets/logo_fameo.png';
/**
 * AppLogo
 *
 * Centralized logo component for the entire application.
 *
 * Defaults to the dark logo.
 * The logo can also be explicitly forced into light mode, or reduced to the
 * icon-only mark with `mark`.
 */
export default function AppLogo({
  className = '',
  darkClassName = '',
  forceLight = false,
  mark = false,
  ...props
}) {

  // The dark logo is now the default everywhere unless forced otherwise.
  // Add specific routes here if they explicitly require the light logo.
  const shouldUseLight = forceLight;

  const currentLogo = mark ? markLogo : shouldUseLight ? lightLogo : darkLogo;

  const finalClassName = [
    className,
    !shouldUseLight && darkClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <img
      src={currentLogo.src}
      alt="Fameo"
      className={finalClassName}
      {...props}
    />
  );
}