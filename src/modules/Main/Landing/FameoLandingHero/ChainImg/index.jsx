'use client';

import { useState } from 'react';

export default function ChainImg({ chain, className, alt = '' }) {
  const [i, setI] = useState(0);
  return (
    <img
      className={className}
      alt={alt}
      src={chain[Math.min(i, chain.length - 1)]}
      onError={() => setI(v => Math.min(v + 1, chain.length - 1))}
      draggable={false}
    />
  );
}
