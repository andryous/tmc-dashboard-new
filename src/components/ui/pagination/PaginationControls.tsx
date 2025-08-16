// src/components/ui/pagination/PaginationControls.tsx

import { Button } from "@/components/ui/button";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  // CHANGED: Define class strings for consistency
  const baseButtonClasses = "bg-blue-600 text-white hover:bg-blue-700";
  const activeButtonClasses = "bg-blue-800 text-white hover:bg-blue-900";

  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <Button
        // CHANGED: Replaced variant with custom className
        className={baseButtonClasses}
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          // CHANGED: Replaced variant logic with custom className logic
          className={
            page === currentPage ? activeButtonClasses : baseButtonClasses
          }
          size="sm"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        // CHANGED: Replaced variant with custom className
        className={baseButtonClasses}
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
}
