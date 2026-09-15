'use client';
// src/app/(main)/error.js
// Segment boundary: the surrounding layout (main) stays mounted, so a failed
// data fetch degrades to an inline message instead of blanking the chrome too.

import { useEffect } from 'react';

import { ErrorState } from '@/components/ErrorState';

export default function SegmentError({ error, reset }) {
  useEffect(() => {
    console.error('[main error]', error);
  }, [error]);

  return <ErrorState error={error} reset={reset} title="This page didn't load" />;
}
