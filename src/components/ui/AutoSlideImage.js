'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export const AutoSlideImage = ({ images, alt, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const wrapperRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    
    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  useEffect(() => {
    if (!isHovered) return;
    
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [isHovered, images.length]);

  return (
    <div 
      ref={wrapperRef}
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentIndex(0);
      }}
      style={{ overflow: 'hidden' }}
    >
      {/* Images */}
      {images.map((src, idx) => (
        <div
          key={idx}
          className="absolute inset-0"
          style={{
            opacity: idx === currentIndex ? 1 : 0,
            transition: 'opacity 0.7s ease-in-out',
            zIndex: idx === currentIndex ? 1 : 0
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>
      ))}

      {/* Silver mask */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, #C0C0C0 0%, #E8E8E8 25%, #FFFFFF 50%, #E8E8E8 75%, #C0C0C0 100%)',
          transform: isRevealed ? 'scaleX(0)' : 'scaleX(1)',
          transformOrigin: isRevealed ? 'right' : 'left',
          transition: 'transform 1500ms cubic-bezier(0.77, 0, 0.175, 1)',
          zIndex: 2,
        }}
      />

      {/* Shimmer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
          opacity: isRevealed ? 0 : 1,
          transform: isRevealed ? 'translateX(100%)' : 'translateX(0)',
          transition: 'all 1500ms cubic-bezier(0.77, 0, 0.175, 1)',
          transitionDelay: '300ms',
          zIndex: 3,
        }}
      />

      {/* Dots indicator */}
      {isHovered && images.length > 1 && (
        <div 
          className="absolute bottom-4 left-1/2 flex gap-2"
          style={{ 
            transform: 'translateX(-50%)',
            zIndex: 15 
          }}
        >
          {images.map((_, idx) => (
            <div
              key={idx}
              style={{
                width: idx === currentIndex ? '32px' : '6px',
                height: '4px',
                borderRadius: '2px',
                backgroundColor: idx === currentIndex ? 'white' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};