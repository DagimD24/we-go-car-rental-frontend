import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";

interface CarFiltersProps {
  onFilterChange: (filters: {
    types: string[];
    minPrice: number | null;
    maxPrice: number | null;
    features: string[];
  }) => void;
  className?: string;
}

export default function CarFilters({ onFilterChange, className }: CarFiltersProps) {
  const [types, setTypes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [features, setFeatures] = useState<string[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    onFilterChange({ types, minPrice, maxPrice, features });
  }, [types, minPrice, maxPrice, features, onFilterChange]);

  const handleTypeToggle = (type: string) => {
    if (types.includes(type)) {
      setTypes(types.filter(t => t !== type));
    } else {
      setTypes([...types, type]);
    }
  };

  const handleFeatureToggle = (feature: string) => {
    if (features.includes(feature)) {
      setFeatures(features.filter(f => f !== feature));
    } else {
      setFeatures([...features, feature]);
    }
  };

  const handleReset = () => {
    setTypes([]);
    setMinPrice(null);
    setMaxPrice(null);
    setFeatures([]);
  };

  const renderFilters = () => (
    <>
      {/* Car Type Filter */}
      <div className="py-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Car Type</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <Checkbox 
              id="sedan" 
              checked={types.includes("Sedan")}
              onCheckedChange={() => handleTypeToggle("Sedan")}
            />
            <Label htmlFor="sedan" className="ml-3 text-sm text-gray-700">Sedan</Label>
          </div>
          <div className="flex items-center">
            <Checkbox 
              id="suv" 
              checked={types.includes("SUV")}
              onCheckedChange={() => handleTypeToggle("SUV")}
            />
            <Label htmlFor="suv" className="ml-3 text-sm text-gray-700">SUV</Label>
          </div>
          <div className="flex items-center">
            <Checkbox 
              id="hatchback" 
              checked={types.includes("Hatchback")}
              onCheckedChange={() => handleTypeToggle("Hatchback")}
            />
            <Label htmlFor="hatchback" className="ml-3 text-sm text-gray-700">Hatchback</Label>
          </div>
          <div className="flex items-center">
            <Checkbox 
              id="luxury" 
              checked={types.includes("Luxury Sedan")}
              onCheckedChange={() => handleTypeToggle("Luxury Sedan")}
            />
            <Label htmlFor="luxury" className="ml-3 text-sm text-gray-700">Luxury</Label>
          </div>
          <div className="flex items-center">
            <Checkbox 
              id="convertible" 
              checked={types.includes("Convertible")}
              onCheckedChange={() => handleTypeToggle("Convertible")}
            />
            <Label htmlFor="convertible" className="ml-3 text-sm text-gray-700">Convertible</Label>
          </div>
        </div>
      </div>
      
      {/* Price Range Filter */}
      <div className="py-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Price Range</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="min-price" className="block text-sm text-gray-700">Min Price ($)</Label>
            <Input 
              type="number" 
              id="min-price" 
              min="0" 
              value={minPrice !== null ? minPrice : ''}
              onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value) : null)}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <Label htmlFor="max-price" className="block text-sm text-gray-700">Max Price ($)</Label>
            <Input 
              type="number" 
              id="max-price" 
              min="0" 
              value={maxPrice !== null ? maxPrice : ''}
              onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value) : null)}
              className="mt-1 block w-full"
            />
          </div>
        </div>
      </div>
      
      {/* Features Filter */}
      <div className="py-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Features</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <Checkbox 
              id="automatic" 
              checked={features.includes("Automatic")}
              onCheckedChange={() => handleFeatureToggle("Automatic")}
            />
            <Label htmlFor="automatic" className="ml-3 text-sm text-gray-700">Automatic</Label>
          </div>
          <div className="flex items-center">
            <Checkbox 
              id="air-conditioning" 
              checked={features.includes("Climate Control")}
              onCheckedChange={() => handleFeatureToggle("Climate Control")}
            />
            <Label htmlFor="air-conditioning" className="ml-3 text-sm text-gray-700">Air Conditioning</Label>
          </div>
          <div className="flex items-center">
            <Checkbox 
              id="bluetooth" 
              checked={features.includes("Bluetooth Connection")}
              onCheckedChange={() => handleFeatureToggle("Bluetooth Connection")}
            />
            <Label htmlFor="bluetooth" className="ml-3 text-sm text-gray-700">Bluetooth</Label>
          </div>
          <div className="flex items-center">
            <Checkbox 
              id="navigation" 
              checked={features.includes("Navigation System")}
              onCheckedChange={() => handleFeatureToggle("Navigation System")}
            />
            <Label htmlFor="navigation" className="ml-3 text-sm text-gray-700">Navigation</Label>
          </div>
        </div>
      </div>
      
      {/* Filter Buttons */}
      <div className="pt-4 flex gap-3">
        <Button 
          type="button" 
          className="flex-1 py-2 px-4"
        >
          Apply Filters
        </Button>
        <Button 
          variant="outline" 
          type="button" 
          className="flex-1 py-2 px-4"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </>
  );

  return (
    <div className={className}>
      {/* Desktop Filters */}
      <div className="hidden lg:block sticky top-24 space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {renderFilters()}
      </div>

      {/* Mobile Filters Toggle */}
      <div className="lg:hidden">
        <Button 
          variant="outline" 
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="bg-white p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary w-full flex items-center justify-center gap-2"
        >
          <Filter className="h-5 w-5" />
          <span className="text-sm font-medium">{isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}</span>
        </Button>

        {/* Mobile Filters Dropdown */}
        {isMobileFiltersOpen && (
          <div className="mt-4 bg-white p-6 rounded-lg shadow-md border border-gray-100">
            {renderFilters()}
          </div>
        )}
      </div>
    </div>
  );
}
