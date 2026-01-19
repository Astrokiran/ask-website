"use client";

import { ModalWrapper } from "../modal/ModalWrapper";



interface ImageViewerProps {
  imageUrl: string | null;
  isVisible: boolean;
  isLoading?: boolean;
  onClose: () => void;
}

export function ImageViewer({
  imageUrl,
  isVisible,
  isLoading = false,
  onClose,
}: ImageViewerProps) {
  if (!imageUrl) return null;

  return (
    <ModalWrapper isVisible={isVisible} onClose={onClose}>
      <div className="bg-black rounded-2xl overflow-hidden shadow-2xl max-h-[85vh] flex items-center justify-center">
        {isLoading ? (
          <div className="flex items-center justify-center h-80 w-full text-white">
            <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full" />
          </div>
        ) : (
          <img
            src={imageUrl}
            alt="Preview"
            className="max-h-[85vh] w-auto max-w-full object-contain"
          />
        )}
      </div>
    </ModalWrapper>
  );
}