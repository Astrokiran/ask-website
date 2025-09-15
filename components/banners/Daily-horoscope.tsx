"use client"

import React, { useState, useRef, useEffect } from 'react';

// Added a dedicated WhatsApp icon component for clarity
const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.456l-6.167 1.687a.75.75 0 01-.882-.882z" />
        <path fill="#FFF" d="M18.333 13.945c-.244-.123-1.442-.71-1.668-.79-.226-.08-.39-.123-.553.123-.163.245-.63.79-.773.945-.143.155-.286.17-.53.048-.244-.123-1.027-.378-1.956-1.207-.723-.655-1.208-1.464-1.35-1.71-.144-.245-.015-.378.109-.502.11-.11.245-.286.368-.43.124-.143.164-.245.245-.408.08-.163.04-.306-.02-.43s-.553-1.32-.756-1.823c-.204-.502-.408-.43-.553-.438-.143-.008-.306-.008-.47-.008-.163 0-.43.062-.655.306-.226.245-.863.84-1.127 1.523-.263.682-.366 1.35-.306 2.051.062.7.45 1.378.715 1.956.264.578 1.48 2.398 3.65 3.23.54.204 1.05.325 1.44.408.63.123 1.18.109 1.58.062.45-.048 1.442-.593 1.646-.17.204-1.164.204-2.158.143-2.302-.06-.144-.226-.23-.47-.353z" />
    </svg>
);

interface DailyHoroscopeCtaProps {
  phoneNumber: string; // e.g. 919876543210
}

export const DailyHoroscopeCta: React.FC<DailyHoroscopeCtaProps> = ({
  phoneNumber,
}) => {
  const prefilledMessage = "Hello AstroKiran, Can I get more details?";
  const encodedMessage = encodeURIComponent(prefilledMessage);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  const ctaRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragInfo = useRef({ isDragging: false, offsetX: 0, offsetY: 0, hasDragged: false });

  useEffect(() => {
    // Set initial position to bottom right
    const initialX = window.innerWidth - (ctaRef.current?.offsetWidth || 0) - 32;
    const initialY = window.innerHeight - (ctaRef.current?.offsetHeight || 0) - 32;
    setPosition({ x: initialX, y: initialY });
  }, []);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    dragInfo.current.isDragging = true;
    dragInfo.current.hasDragged = false;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragInfo.current.offsetX = clientX - position.x;
    dragInfo.current.offsetY = clientY - position.y;

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('touchmove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!dragInfo.current.isDragging) return;
    dragInfo.current.hasDragged = true;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    let newX = clientX - dragInfo.current.offsetX;
    let newY = clientY - dragInfo.current.offsetY;

    // Constrain movement within the viewport
    const elementWidth = ctaRef.current?.offsetWidth || 0;
    const elementHeight = ctaRef.current?.offsetHeight || 0;
    newX = Math.max(0, Math.min(newX, window.innerWidth - elementWidth));
    newY = Math.max(0, Math.min(newY, window.innerHeight - elementHeight));

    setPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    dragInfo.current.isDragging = false;
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchend', handleDragEnd);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (dragInfo.current.hasDragged) {
      e.preventDefault();
    }
  };
  
  return (
    <div
        ref={ctaRef}
        className="fixed z-50"
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          cursor: dragInfo.current.isDragging ? 'grabbing' : 'grab',
          touchAction: 'none' // Prevents page scrolling on mobile when dragging
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
    >
      <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center text-center group"
          title="Chat on WhatsApp"
          onClick={handleClick}
      >
          {/* Container for image and pulsing effect */}
          <div className="relative flex justify-center items-center">
              {/* Outer pulsing ring for attention */}
              <div className="absolute w-28 h-28 bg-green-400/75 rounded-full animate-ping"></div>
              
              {/* Astrologer Image */}
              <img
                  src="/Kalpana-tripathi.png"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite loop if placeholder also fails
                    target.src = 'https://placehold.co/112x112/EFEFEF/4A5568?text=Astrologer';
                  }}
                  alt="Chat with an Astrologer"
                  className="relative w-28 h-28 rounded-full border-4 border-white object-cover shadow-2xl transition-transform duration-300 ease-in-out group-hover:scale-110"
              />
          </div>

          {/* "Ask Now" button with icon */}
          <div className="mt-4 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold text-base py-2.5 px-6 rounded-full shadow-lg transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-xl">
    <WhatsAppIcon />
    <span>Ask Now</span>
</div>
      </a>
    </div>
  );
};

