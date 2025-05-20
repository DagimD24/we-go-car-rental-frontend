import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Fuel, Cog, Users, DoorOpen, Briefcase, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Car } from "@shared/schema";

export default function CarDetailsPage() {
  const [, params] = useRoute("/cars/:id");
  const carId = params?.id ? parseInt(params.id) : undefined;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { toast } = useToast();
  
  const { data: car, isLoading, error } = useQuery<Car>({
    queryKey: [`/api/cars/${carId}`],
    enabled: !!carId,
  });
  
  const bookNow = useMutation({
    mutationFn: async () => {
      if (!car) return;
      // In a real app, this would navigate to the booking page
      // with the car ID as a parameter
      window.location.href = `/booking/${car.id}`;
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to navigate to booking page",
        variant: "destructive"
      });
    }
  });

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                <div className="space-y-4">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg bg-gray-200"></div>
                  <div className="grid grid-cols-4 gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="aspect-w-1 aspect-h-1 rounded-md bg-gray-200"></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="border-t border-b border-gray-200 py-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Error loading car details</h1>
            <p className="mt-2 text-gray-500">The car you are looking for might not exist or there was an error fetching the data.</p>
            <Link href="/cars">
              <Button className="mt-4">Back to Cars</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getAvailabilityBadge = () => {
    if (car.availability === "available") {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Available</Badge>;
    } else if (car.availability === "limited") {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Limited</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Unavailable</Badge>;
    }
  };

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/cars">
            <a className="text-primary hover:text-primary-700 flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Cars
            </a>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Image Carousel */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <img 
                  src={car.images[selectedImageIndex]} 
                  alt={`${car.name} - Image ${selectedImageIndex + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {car.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden cursor-pointer border-2 ${selectedImageIndex === index ? 'border-primary' : 'border-gray-200'}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${car.name} - Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Car Information */}
            <div>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{car.name}</h1>
                    <p className="text-gray-500">{car.type}</p>
                  </div>
                  <div>{getAvailabilityBadge()}</div>
                </div>
                
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-primary">${car.price}</div>
                  <div className="text-gray-500 ml-2">per day</div>
                </div>
                
                <div className="border-t border-b border-gray-200 py-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Calendar className="text-lg text-gray-400 mr-3 h-5 w-5" />
                    <div>
                      <p className="text-xs text-gray-500">Year</p>
                      <p className="font-medium">{car.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Fuel className="text-lg text-gray-400 mr-3 h-5 w-5" />
                    <div>
                      <p className="text-xs text-gray-500">Fuel Type</p>
                      <p className="font-medium">{car.fuelType}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Cog className="text-lg text-gray-400 mr-3 h-5 w-5" />
                    <div>
                      <p className="text-xs text-gray-500">Transmission</p>
                      <p className="font-medium">{car.transmission}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="text-lg text-gray-400 mr-3 h-5 w-5" />
                    <div>
                      <p className="text-xs text-gray-500">Seats</p>
                      <p className="font-medium">{car.seats} Seats</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DoorOpen className="text-lg text-gray-400 mr-3 h-5 w-5" />
                    <div>
                      <p className="text-xs text-gray-500">Doors</p>
                      <p className="font-medium">{car.doors} Doors</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="text-lg text-gray-400 mr-3 h-5 w-5" />
                    <div>
                      <p className="text-xs text-gray-500">Luggage</p>
                      <p className="font-medium">{car.luggage} Bags</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{car.description}</p>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-lg font-semibold mb-2">Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.isArray(car.features) && car.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="text-primary mr-2 h-4 w-4" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-6">
                  <Button 
                    className="w-full inline-flex justify-center items-center px-6 py-3"
                    disabled={car.availability === "unavailable" || bookNow.isPending}
                    onClick={() => bookNow.mutate()}
                    variant="accent"
                  >
                    {bookNow.isPending ? "Loading..." : "Book This Car"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
