import React, { FC } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export interface PaginationProps {
  numPages: number; // Total number of pages
  currentPage: number; // Current active page
  className?: string;
  onPageChange: (page: number) => void; // Callback when page changes
}

const Pagination: FC<PaginationProps> = ({
  numPages,
  currentPage,
  className = "",
  onPageChange,
}) => {
  const renderItem = (page: number) => {
    const isActive = page === currentPage;

    return isActive ? (
      <span
        key={page}
        className="inline-flex w-11 h-11 items-center justify-center rounded-full bg-blue-600 text-white font-medium"
      >
        {page}
      </span>
    ) : (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className="inline-flex w-11 h-11 items-center justify-center rounded-full bg-white hover:bg-gray-200 border border-gray-300 text-gray-600 dark:text-gray-400 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-700"
      >
        {page}
      </button>
    );
  };

  const renderPrevButton = () => {
    return (
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`px-4 py-2 rounded-md flex items-center justify-center bg-gray-200 text-gray-700 ${
          currentPage <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
        }`}
      >
        <HiChevronLeft className="text-xl" />
      </button>
    );
  };

  const renderNextButton = () => {
    return (
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= numPages}
        className={`px-4 py-2 rounded-md flex items-center justify-center bg-gray-200 text-gray-700 ${
          currentPage >= numPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-300"
        }`}
      >
        <HiChevronRight className="text-xl" />
      </button>
    );
  };

  // Helper function to get the range of pages to display
  const getPageRange = () => {
    if (numPages <= 5) {
      return Array.from({ length: numPages }, (_, i) => i + 1);
    }

    // If current page is near the start
    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    // If current page is near the end
    if (currentPage >= numPages - 2) {
      return [
        numPages - 4,
        numPages - 3,
        numPages - 2,
        numPages - 1,
        numPages,
      ];
    }

    // Show current page in the middle
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  return (
    <nav
      className={`nc-Pagination flex items-center justify-center space-x-2 ${className}`}
    >
      {currentPage > 1 && renderPrevButton()}

      {getPageRange().map(renderItem)}

      {currentPage < numPages && renderNextButton()}
    </nav>
  );
};

export default Pagination;
