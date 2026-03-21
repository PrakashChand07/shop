import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SharedPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
}

export function SharedPagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  totalItems,
}: SharedPaginationProps) {
  // Hide pagination entirely if there's only 1 page and no total count is provided
  if (totalPages <= 1 && totalItems === undefined) return null;

  const atStart = currentPage <= 1;
  const atEnd = currentPage >= totalPages;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 mt-4 pt-4 gap-4 px-1">
      <div className="text-sm text-gray-500 text-center sm:text-left">
        {totalItems !== undefined ? (
          <span>
            Showing{" "}
            <span className="font-medium">
              {totalItems === 0 ? 0 : Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span> results
          </span>
        ) : (
          <span>
            Page <span className="font-medium text-gray-900">{currentPage}</span> of{" "}
            <span className="font-medium text-gray-900">{totalPages}</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={atStart}
          className="min-w-[100px]"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="hidden md:flex items-center justify-center px-4 font-medium text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md h-9">
          {currentPage} / {totalPages}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={atEnd}
          className="min-w-[100px]"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
