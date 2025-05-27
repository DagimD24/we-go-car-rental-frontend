import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 8) {
      // Show all pages if 8 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Button
            key={i}
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(i)}
            className={`mx-1 ${currentPage === i 
              ? "text-primary font-bold bg-transparent hover:bg-transparent" 
              : "text-gray-600 hover:text-primary hover:bg-transparent"
            }`}
          >
            {i}
          </Button>
        );
      }
    } else {
      // Show 1, 2, 3 ... last 3 pages for more than 8 pages
      // First 3 pages
      for (let i = 1; i <= 3; i++) {
        pages.push(
          <Button
            key={i}
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(i)}
            className={`mx-1 ${currentPage === i 
              ? "text-primary font-bold bg-transparent hover:bg-transparent" 
              : "text-gray-600 hover:text-primary hover:bg-transparent"
            }`}
          >
            {i}
          </Button>
        );
      }
      
      // Ellipsis
      pages.push(
        <span key="ellipsis" className="mx-2 text-gray-500">
          ...
        </span>
      );
      
      // Last 3 pages
      for (let i = totalPages - 2; i <= totalPages; i++) {
        pages.push(
          <Button
            key={i}
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(i)}
            className={`mx-1 ${currentPage === i 
              ? "text-primary font-bold bg-transparent hover:bg-transparent" 
              : "text-gray-600 hover:text-primary hover:bg-transparent"
            }`}
          >
            {i}
          </Button>
        );
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="flex items-center hover:text-primary hover:bg-transparent"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>
      
      {renderPageNumbers()}
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center hover:text-primary hover:bg-transparent"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}