'use client';
// app/error.js
// Catches anything thrown below the root layout that a nearer boundary missed.

import { useEffect } from 'react';

import { ErrorState } from '@/components/ErrorState';

export default function RootError({ error, reset }) {
  useEffect(() => {
    // Replace with your telemetry sink. Logged unconditionally: an error that
    // reaches this boundary took a whole route down and must not be silent.
    console.error('[route error]', error);
  }, [error]);

  return <ErrorState error={error} reset={reset} />;
}
