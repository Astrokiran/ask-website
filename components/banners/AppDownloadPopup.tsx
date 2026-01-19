"use client"

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { redirectToAppStore } from "@/lib/deviceDetection";
import { ModalWrapper } from "../modal/ModalWrapper";

export function AppDownloadPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShownOnCurrentPage, setHasShownOnCurrentPage] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setHasShownOnCurrentPage(false);

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

  return (
    <ModalWrapper
      isVisible={isVisible}
      onClose={handleClose}
    >
      <button
        onClick={handleDownload}
        className="w-full rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#D32F2F]/50"
      >
        <img
          src="https://images.ctfassets.net/53lf7jlviu2d/61sgjb7rMvtJDcDY4kSfvH/9ff829e3acc01444684f3a2f07aee2df/WhatsAppImage2026-01-05at16.22.25.jpeg"
          alt="Download AstroKiran App - Get Your Offer Now (₹250 value)"
          className="w-full h-auto object-contain"
        />
      </button>
    </ModalWrapper>
  );
}