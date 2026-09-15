'use client';
// src/app/admin/error.js
// Segment boundary: the surrounding layout (admin) stays mounted, so a failed
// data fetch degrades to an inline message instead of blanking the chrome too.

import { useEffect } from 'react';

import { ErrorState } from '@/components/ErrorState';

export default function SegmentError({ error, reset }) {
  useEffect(() => {
    console.error('[admin error]', error);
  }, [error]);

  return <ErrorState error={error} reset={reset} title="This panel didn't load" />;
}
