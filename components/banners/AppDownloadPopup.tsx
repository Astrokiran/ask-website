"use client"

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { redirectToAppStore } from "@/lib/deviceDetection";
import { ModalWrapper } from "../modal/ModalWrapper";

export function AppDownloadPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShownOnCurrentPage, setHasShownOnCurrentPage] = useState(false);
  const pathname = usePathname();

  // Hide on call page
  if (pathname?.startsWith('/call')) {
    return null;
  }

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
          // src="https://images.ctfassets.net/53lf7jlviu2d/Of3wYMyotChr55qdvNYuU/e7477f8756454088627f86860230ce31/9e347240-6e68-49cf-9859-4e52cc202c53.jpg"
          alt="Download AstroKiran App - Get Your Offer Now (₹250 value)"
          className="w-full h-auto object-contain"
        />
      </button>
    </ModalWrapper>
  );
}