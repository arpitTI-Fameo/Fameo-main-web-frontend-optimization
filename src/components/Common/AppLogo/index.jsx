'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import lightLogo from '@/app/assets/logo_fameo_2.png';
import darkLogo from '@/app/assets/logo.png';

const isRouteOrChild = (pathname, route) => {
  if (!pathname || !route) return false;
  if (route === '/') return pathname === '/';
  return pathname === route || pathname.startsWith(`${route}/`);
};

/**
 * AppLogo
 *
 * Centralized logo component for the entire application.
 *
 * Defaults to the dark logo.
 * The logo can also be explicitly forced into light mode.
 */
export default function AppLogo({
  className = '',
  darkClassName = '',
  forceLight = false,
  ...props
}) {
  const pathname = usePathname();

  // The dark logo is now the default everywhere unless forced otherwise.
  // Add specific routes here if they explicitly require the light logo.
  const shouldUseLight = forceLight;

  const currentLogo = shouldUseLight ? lightLogo : darkLogo;

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