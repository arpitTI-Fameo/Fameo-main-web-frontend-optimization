'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export const RevealImage = ({ src, alt, className = "" }) => {
  const wrapperRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );
    
    observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);
  
  return (
    <div ref={wrapperRef} className={`relative overflow-hidden ${className}`}>
      <div className="relative w-full h-full">
        <Image 
          src={src} 
          alt={alt}
          fill
          className={`object-cover relative z-[1] transition-all duration-[1500ms] ease-out ${
            isRevealed ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-sm'
          }`}
          style={{ transitionDelay: '800ms' }}
          loading="lazy"
        />
      </div>
      
      {/* Silver Gradient Mask */}
      <div 
        className={`absolute top-0 left-0 w-full h-full z-[2] transition-transform duration-[1500ms] ${
          isRevealed ? 'scale-x-0 origin-right' : 'scale-x-100 origin-left'
        }`}
        style={{ 
          transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)',
          background: 'linear-gradient(90deg, #C0C0C0 0%, #E8E8E8 25%, #FFFFFF 50%, #E8E8E8 75%, #C0C0C0 100%)'
        }}
      />
      
      {/* Silver Shimmer */}
      <div 
        className={`absolute top-0 left-0 w-full h-full z-[3] transition-all duration-[1500ms] ${
          isRevealed ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
        }`}
        style={{ 
          transitionDelay: '300ms',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
          transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)'
        }}
      />
    </div>
  );
};