import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CarCard from "@/components/car-card";
import CarFilters from "@/components/car-filters";
import Pagination from "@/components/pagination";
import { carService, type Car } from "@/lib/dataService";

export default function CarsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    types: [] as string[],
    minPrice: null as number | null,
    maxPrice: null as number | null,
    features: [] as string[]
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("price-asc");
  
  const { data: cars = [], isLoading } = useQuery<Car[]>({
    queryKey: ["cars", searchTerm, filters],
    queryFn: () => carService.getFilteredCars({
      searchTerm: searchTerm || undefined,
      types: filters.types.length > 0 ? filters.types : undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      features: filters.features.length > 0 ? filters.features : undefined,
    }),
  });

  // Use the filtered cars directly from the service
  const filteredCars = cars;

  // Sort cars
  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  // Pagination
  const carsPerPage = 6;
  const totalPages = Math.ceil(sortedCars.length / carsPerPage);
  const startIndex = (currentPage - 1) * carsPerPage;
  const endIndex = startIndex + carsPerPage;
  const paginatedCars = sortedCars.slice(startIndex, endIndex);
  
  console.log('Pagination Debug:', {
    totalCars: sortedCars.length,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    paginatedCarsCount: paginatedCars.length
  });
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchTerm, sortBy]);

  return (
    <>
      {/* Hero/Search Section */}
      <section className="bg-gradient-to-r from-primary to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl">
              Find Your Perfect Ride
            </h1>
            <p className="mt-3 max-w-md mx-auto text-lg text-primary-100">
              Premium cars for any occasion, at competitive prices
            </p>
            <div className="mt-10 max-w-xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <Input 
                  type="text" 
                  placeholder="Search by car name or type..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow px-5 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent bg-white"
                />
                <Button className="px-6 py-3 bg-accent hover:bg-accent-600 rounded-lg font-medium transition duration-150 ease-in-out">
                  <SearchIcon className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-3">
              <CarFilters 
                onFilterChange={setFilters} 
                className="mb-8 lg:mb-0"
              />
            </div>
            
            {/* Car Grid */}
            <div className="lg:col-span-9">
              {/* Desktop title and sort options */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Available Cars</h2>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="name-asc">Name: A to Z</SelectItem>
                      <SelectItem value="name-desc">Name: Z to A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {isLoading ? (
                // Loading skeletons
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                      <div className="h-48 bg-gray-200" />
                      <div className="p-5 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="flex space-x-2">
                          <div className="h-4 bg-gray-200 rounded w-1/4" />
                          <div className="h-4 bg-gray-200 rounded w-1/4" />
                          <div className="h-4 bg-gray-200 rounded w-1/4" />
                        </div>
                        <div className="flex justify-between">
                          <div className="h-6 bg-gray-200 rounded w-1/3" />
                          <div className="h-8 bg-gray-200 rounded w-1/3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : paginatedCars.length > 0 ? (
                // Car grid
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedCars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              ) : (
                // No results
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium text-gray-900">No cars found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
              
              {/* Pagination */}
              {!isLoading && (
                <div className="mt-12 flex justify-center">
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
