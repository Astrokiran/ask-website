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
      className="flex items-center justify-center space-x-1 mt-12"
      aria-label="Blog pagination"
    >
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="ml-1 hidden sm:inline">Previous</span>
      </button>

      {/* Page numbers */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === '...') {
            return (
              <span
                key={index}
                className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-muted-foreground"
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
              className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isCurrentPage
                  ? 'bg-primary text-primary-foreground border border-primary'
                  : 'text-muted-foreground bg-card border border-border hover:bg-muted hover:text-foreground'
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
        className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Go to next page"
      >
        <span className="mr-1 hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}