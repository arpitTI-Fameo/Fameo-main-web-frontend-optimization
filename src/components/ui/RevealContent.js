'use client';

import { useState, useEffect, useRef } from 'react';

export const RevealContent = ({ children, className = "", delay = 0 }) => {
  const contentRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsRevealed(true);
            }, delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [delay]);
  
  return (
    <div 
      ref={contentRef} 
      className={`transition-all duration-1000 ${
        isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[60px]'
      } ${className}`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      {children}
    </div>
  );
};