'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { redirectToAppStore } from '@/lib/deviceDetection';

export function FloatingAppCTA() {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  // Hide on call page
  if (pathname?.startsWith('/call')) {
    return null;
  }

  // Reset visibility whenever the route changes
  useEffect(() => {
    setIsVisible(true);
  }, [pathname]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    redirectToAppStore();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9998] animate-in slide-in-from-bottom-4 duration-300">
      <div className="relative bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-2xl p-3 max-w-[280px]">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Content */}
        <button
          onClick={handleClick}
          className="flex items-center gap-3 text-white w-full text-left"
        >
          {/* App Icon */}
          <div className="flex-shrink-0 bg-white rounded-xl p-2">
            <img src="/ask-logo.png" alt="Astrokiran" className="w-10 h-10" />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm leading-tight mb-1">
              Download App
            </p>
            <p className="text-xs opacity-90 leading-tight">
              Get your offer Now
            </p>
          </div>

          {/* Arrow/Download Icon */}
          <div className="flex-shrink-0">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}
