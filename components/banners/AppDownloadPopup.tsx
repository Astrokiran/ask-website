"use client"

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { redirectToAppStore } from '@/lib/deviceDetection';

export function AppDownloadPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShownOnCurrentPage, setHasShownOnCurrentPage] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Reset the shown state when pathname changes
    setHasShownOnCurrentPage(false);

    // Show popup 5 seconds after navigating to a new page
    const timer = setTimeout(() => {
      if (!hasShownOnCurrentPage) {
        setIsVisible(true);
        setHasShownOnCurrentPage(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleDownload = () => {
    redirectToAppStore();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Popup Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 animate-in zoom-in-95 duration-300">
        <div className="relative max-w-2xl w-full mx-auto">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute -top-2 -right-2 z-10 p-2 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-lg"
            aria-label="Close popup"
          >
            <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Clickable CTA Image */}
          <button
            onClick={handleDownload}
            className="w-full rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#D32F2F]/50"
          >
            <img
              src="https://images.ctfassets.net/53lf7jlviu2d/5LmXwfcBez4Z94AmxGIrJ5/303ff1faf4542e379d72d318ca0c2c48/enhancedonerupeebanner.png"
              alt="Download AstroKiran App - Get Your Offer Now (₹250 value)"
              className="w-full h-auto object-contain"
            />
          </button>
        </div>
      </div>
    </>
  );
}
