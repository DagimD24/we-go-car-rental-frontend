import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= 7) {
      // If less than 7 pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page, last page, and pages around current
      pageNumbers.push(1);
      
      if (currentPage > 3) {
        pageNumbers.push('dots1');
      }
      
      // Pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pageNumbers.push('dots2');
      }
      
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <nav className="inline-flex rounded-md shadow">
      <Button
        variant="outline"
        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <span className="sr-only">Previous</span>
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      {getPageNumbers().map((pageNumber, index) => {
        if (pageNumber === 'dots1' || pageNumber === 'dots2') {
          return (
            <span 
              key={`dots-${index}`}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
            >
              ...
            </span>
          );
        }
        
        return (
          <Button
            key={pageNumber}
            variant={currentPage === pageNumber ? "default" : "outline"}
            className={`relative inline-flex items-center px-4 py-2 border ${
              currentPage === pageNumber ? 'border-primary-500 bg-primary-50 text-primary' : 'border-gray-300 bg-white text-gray-700'
            } text-sm font-medium hover:bg-gray-50`}
            onClick={() => onPageChange(pageNumber as number)}
          >
            {pageNumber}
          </Button>
        );
      })}
      
      <Button
        variant="outline"
        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <span className="sr-only">Next</span>
        <ChevronRight className="h-5 w-5" />
      </Button>
    </nav>
  );
}
