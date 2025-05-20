import { Link } from "wouter";
import { Fuel, Cog, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car } from "@shared/schema";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const getAvailabilityBadge = () => {
    if (car.availability === "available") {
      return <Badge className="absolute top-3 right-3 bg-green-100 text-green-800 hover:bg-green-100">Available</Badge>;
    } else if (car.availability === "limited") {
      return <Badge className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Limited</Badge>;
    } else {
      return <Badge className="absolute top-3 right-3 bg-red-100 text-red-800 hover:bg-red-100">Unavailable</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        <img src={car.images[0]} alt={car.name} className="w-full h-48 object-cover" />
        {getAvailabilityBadge()}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900">{car.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{car.type}</p>
        <div className="flex items-center text-sm text-gray-700 mb-4">
          <div className="flex items-center mr-4">
            <Fuel className="mr-1 text-gray-400 h-4 w-4" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center mr-4">
            <Cog className="mr-1 text-gray-400 h-4 w-4" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-1 text-gray-400 h-4 w-4" />
            <span>{car.seats} Seats</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-primary font-bold">${car.price} <span className="text-gray-500 font-normal text-sm">/ day</span></div>
          {car.availability === "unavailable" ? (
            <Button disabled variant="outline" className="inline-flex items-center px-3 py-2 text-sm leading-4 font-medium rounded-md text-gray-400 bg-gray-50 cursor-not-allowed">
              View Details
            </Button>
          ) : (
            <Link href={`/cars/${car.id}`}>
              <Button variant="accent" className="inline-flex items-center px-3 py-2 text-sm leading-4 font-medium rounded-md">
                View Details
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
