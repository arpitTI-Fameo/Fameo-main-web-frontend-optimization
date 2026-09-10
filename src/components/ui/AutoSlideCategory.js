'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export const AutoSlideCategory = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [isHovered, images.length]);

  return (
    <div 
      className="absolute inset-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentIndex(0);
      }}
    >
      {images.map((src, idx) => (
        <Image
          key={idx}
          src={src}
          alt={alt}
          fill
          className="object-cover absolute inset-0 group-hover:scale-110 transition-all duration-700"
          style={{
            opacity: idx === currentIndex ? 1 : 0,
            transition: 'opacity 0.7s ease-in-out, transform 0.7s ease-out',
            zIndex: idx === currentIndex ? 1 : 0
          }}
        />
      ))}
      
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
                width: idx === currentIndex ? '24px' : '4px',
                height: '3px',
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