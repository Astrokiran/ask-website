"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

export function BlogPagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      className="flex items-center justify-center space-x-1 sm:space-x-2 lg:space-x-3 mt-12 sm:mt-16"
      aria-label="Blog pagination"
    >
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className="relative inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page numbers */}
      <div className="flex items-center space-x-2">
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === '...') {
            return (
              <span
                key={index}
                className="relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400"
              >
                ...
              </span>
            );
          }

          const isCurrentPage = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber as number)}
              className={`relative inline-flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:scale-[1.02] ${
                isCurrentPage
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 hover:border-blue-300'
              }`}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isCurrentPage ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="relative inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}