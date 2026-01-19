"use client"

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface ModalWrapperProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isVisible,
  onClose,
  children,
}) => {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timeout = setTimeout(() => setShouldRender(false), 250);
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  const handleClose = () => onClose();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-[9998] backdrop-blur-sm transition-all duration-250
          ${isVisible ? "bg-black/50 opacity-100" : "bg-black/0 opacity-0"}`}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-[9999] p-4 transition-all duration-250
          ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        <div className="relative max-w-2xl w-full mx-auto">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute -top-2 -right-2 z-10 p-2 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-lg"
            aria-label="Close popup"
          >
            <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>

          {children}
        </div>
      </div>
    </>
  );
};