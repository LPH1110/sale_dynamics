import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface PaginationProps {
  currentPage: number; // 0-indexed
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  // Generate page numbers array with ellipses
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first, last, and pages around current page
      pages.push(0);

      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);

      if (start > 1) {
        pages.push('ellipsis-start');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 2) {
        pages.push('ellipsis-end');
      }

      pages.push(totalPages - 1);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 rounded-b-md">
      {/* Result stats */}
      <div className="text-xs text-neutral-500 dark:text-neutral-400 select-none">
        Showing <span className="font-semibold text-neutral-800 dark:text-neutral-200">{startItem}</span> to{' '}
        <span className="font-semibold text-neutral-800 dark:text-neutral-200">{endItem}</span> of{' '}
        <span className="font-semibold text-neutral-800 dark:text-neutral-200">{totalElements}</span> results
      </div>

      {/* Navigation Buttons */}
      <nav className="inline-flex -space-x-px rounded-md shadow-xs bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-750">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="inline-flex items-center p-2 rounded-l-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-hidden disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        {/* Page Buttons */}
        {pages.map((p, idx) => {
          if (typeof p === 'string') {
            return (
              <span
                key={`${p}-${idx}`}
                className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-neutral-400 dark:text-neutral-500 select-none"
              >
                ...
              </span>
            );
          }

          const isActive = p === currentPage;

          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={clsx(
                'inline-flex items-center px-3.5 py-2 text-xs font-semibold focus:outline-hidden transition-colors duration-150',
                isActive
                  ? 'bg-brand-600 text-white dark:bg-brand-500'
                  : 'text-neutral-700 hover:bg-neutral-150 dark:text-neutral-300 dark:hover:bg-neutral-850'
              )}
            >
              {p + 1}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="inline-flex items-center p-2 rounded-r-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-hidden disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
