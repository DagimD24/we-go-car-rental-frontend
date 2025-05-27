import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceRangeSliderProps {
  minValue: number;
  maxValue: number;
  onRangeChange: (min: number, max: number) => void;
  className?: string;
}

export default function PriceRangeSlider({ 
  minValue, 
  maxValue, 
  onRangeChange, 
  className 
}: PriceRangeSliderProps) {
  const [minPrice, setMinPrice] = useState(minValue);
  const [maxPrice, setMaxPrice] = useState(maxValue);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);

  const MIN_RANGE = 0;
  const MAX_RANGE = 200;
  const STEP = 5;

  useEffect(() => {
    setMinPrice(minValue);
    setMaxPrice(maxValue);
  }, [minValue, maxValue]);

  const handleMinChange = (value: number) => {
    const newMin = Math.max(MIN_RANGE, Math.min(value, maxPrice - STEP));
    setMinPrice(newMin);
    onRangeChange(newMin, maxPrice);
  };

  const handleMaxChange = (value: number) => {
    const newMax = Math.min(MAX_RANGE, Math.max(value, minPrice + STEP));
    setMaxPrice(newMax);
    onRangeChange(minPrice, newMax);
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || MIN_RANGE;
    handleMinChange(value);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || MAX_RANGE;
    handleMaxChange(value);
  };

  const getPercentage = (value: number) => {
    return ((value - MIN_RANGE) / (MAX_RANGE - MIN_RANGE)) * 100;
  };

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    const value = Math.round((percentage * (MAX_RANGE - MIN_RANGE) + MIN_RANGE) / STEP) * STEP;
    
    const distanceToMin = Math.abs(value - minPrice);
    const distanceToMax = Math.abs(value - maxPrice);
    
    if (distanceToMin < distanceToMax) {
      handleMinChange(value);
    } else {
      handleMaxChange(value);
    }
  };

  const handleMouseDown = (type: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(type);
    
    const handleMouseMove = (e: MouseEvent) => {
      const slider = document.getElementById('price-slider');
      if (!slider) return;
      
      const rect = slider.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const value = Math.round((percentage * (MAX_RANGE - MIN_RANGE) + MIN_RANGE) / STEP) * STEP;
      
      if (type === 'min') {
        handleMinChange(value);
      } else {
        handleMaxChange(value);
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className={className}>
      <Label className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 block">
        Price Range ($)
      </Label>
      
      {/* Slider Container */}
      <div className="relative mb-6">
        <div 
          id="price-slider"
          className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
          onClick={handleSliderClick}
        >
          {/* Active range */}
          <div 
            className="absolute h-2 bg-primary rounded-full"
            style={{
              left: `${getPercentage(minPrice)}%`,
              width: `${getPercentage(maxPrice) - getPercentage(minPrice)}%`
            }}
          />
          
          {/* Min handle */}
          <div
            className={`absolute w-5 h-5 bg-white border-2 border-primary rounded-full cursor-grab active:cursor-grabbing transform -translate-y-1.5 ${isDragging === 'min' ? 'shadow-lg scale-110' : 'hover:shadow-md hover:scale-105'} transition-all duration-200`}
            style={{ left: `calc(${getPercentage(minPrice)}% - 10px)` }}
            onMouseDown={handleMouseDown('min')}
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
              ${minPrice}
            </div>
          </div>
          
          {/* Max handle */}
          <div
            className={`absolute w-5 h-5 bg-white border-2 border-primary rounded-full cursor-grab active:cursor-grabbing transform -translate-y-1.5 ${isDragging === 'max' ? 'shadow-lg scale-110' : 'hover:shadow-md hover:scale-105'} transition-all duration-200`}
            style={{ left: `calc(${getPercentage(maxPrice)}% - 10px)` }}
            onMouseDown={handleMouseDown('max')}
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
              ${maxPrice}
            </div>
          </div>
        </div>
        
        {/* Range labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>${MIN_RANGE}</span>
          <span>${MAX_RANGE}</span>
        </div>
      </div>
      
      {/* Input boxes */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="min-price-input" className="block text-xs text-gray-600 mb-1">
            Min Price
          </Label>
          <Input
            id="min-price-input"
            type="number"
            min={MIN_RANGE}
            max={maxPrice - STEP}
            step={STEP}
            value={minPrice}
            onChange={handleMinInputChange}
            className="text-sm h-8"
          />
        </div>
        <div>
          <Label htmlFor="max-price-input" className="block text-xs text-gray-600 mb-1">
            Max Price
          </Label>
          <Input
            id="max-price-input"
            type="number"
            min={minPrice + STEP}
            max={MAX_RANGE}
            step={STEP}
            value={maxPrice}
            onChange={handleMaxInputChange}
            className="text-sm h-8"
          />
        </div>
      </div>
    </div>
  );
}