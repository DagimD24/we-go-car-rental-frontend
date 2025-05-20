import { useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Car } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import DateRangePicker from "@/components/date-range-picker";
import { AlertCircle, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { calculateTotalPrice, formatCurrency, getDaysBetweenDates } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const bookingFormSchema = z.object({
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }).refine(data => data.from <= data.to, {
    message: "End date cannot be before start date",
  }),
  pickupLocation: z.string().min(1, { message: "Please select a pickup location" }),
  additionalServices: z.array(z.object({
    name: z.string(),
    price: z.number(),
    selected: z.boolean(),
  })),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function BookingPage() {
  const [, params] = useRoute("/booking/:id");
  const carId = params?.id ? parseInt(params.id) : undefined;
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  
  // Set default date range (today to tomorrow)
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: today,
    to: tomorrow,
  });

  // Additional services with prices
  const additionalServices = [
    { name: "GPS Navigation", price: 5 },
    { name: "Child Seat", price: 10 },
    { name: "Additional Driver", price: 15 },
    { name: "Wi-Fi Hotspot", price: 8 },
    { name: "Full Insurance Coverage", price: 20 },
  ];

  // Fetch car data
  const { data: car, isLoading: isLoadingCar } = useQuery<Car>({
    queryKey: [`/api/cars/${carId}`],
    enabled: !!carId,
  });

  // Fetch user data to check if logged in
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["/api/me"],
  });

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      dateRange: {
        from: today,
        to: tomorrow,
      },
      pickupLocation: "",
      additionalServices: additionalServices.map(service => ({
        ...service,
        selected: false,
      })),
      termsAccepted: false,
    },
  });

  // Update dateRange in form when state changes
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setDateRange(range);
      form.setValue("dateRange", range, { shouldValidate: true });
      form.trigger("dateRange");
    }
  };

  // Calculate booking totals
  const calculateTotals = () => {
    if (!car || !dateRange.from || !dateRange.to) return { rentalTotal: 0, servicesTotal: 0, total: 0, days: 0 };
    
    const days = getDaysBetweenDates(dateRange.from, dateRange.to);
    const rentalTotal = car.price * days;
    
    const servicesTotal = form.getValues().additionalServices
      .filter(service => service.selected)
      .reduce((sum, service) => sum + (service.price * days), 0);
    
    return {
      days,
      rentalTotal,
      servicesTotal,
      total: rentalTotal + servicesTotal,
    };
  };

  const { days, rentalTotal, servicesTotal, total } = calculateTotals();

  const createBooking = useMutation({
    mutationFn: async (data: BookingFormValues) => {
      if (!car || !dateRange.from || !dateRange.to) {
        throw new Error("Missing required data");
      }

      const selectedServices = data.additionalServices
        .filter(service => service.selected)
        .map(({ name, price }) => ({ name, price }));

      const bookingData = {
        carId: car.id,
        startDate: data.dateRange.from.toISOString(),
        endDate: data.dateRange.to.toISOString(),
        totalPrice: total,
        status: "pending",
        pickupLocation: data.pickupLocation,
        additionalServices: selectedServices.length > 0 ? selectedServices : undefined,
      };

      const response = await apiRequest("POST", "/api/bookings", bookingData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Successful",
        description: "Your car has been booked successfully!",
      });
      navigate("/profile?tab=bookings");
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error creating your booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormValues) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book a car.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    createBooking.mutate(data);
  };

  if (isLoadingCar || isLoadingUser) {
    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Car Not Found</CardTitle>
              <CardDescription>The car you are trying to book could not be found</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
              <p className="text-center mb-6">
                The car you are looking for might not exist or is no longer available.
              </p>
              <Link href="/cars">
                <Button>Browse Available Cars</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (car.availability === "unavailable") {
    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Car Unavailable</CardTitle>
              <CardDescription>The car you are trying to book is currently unavailable</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <AlertCircle className="h-16 w-16 text-yellow-500 mb-4" />
              <p className="text-center mb-6">
                We're sorry, but the {car.name} is currently unavailable for booking.
                Please check back later or browse our other available cars.
              </p>
              <Link href="/cars">
                <Button>Browse Available Cars</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href={`/cars/${car.id}`}>
            <a className="text-primary hover:text-primary-700 flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Car Details
            </a>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Book Your Car</CardTitle>
                <CardDescription>
                  Complete the form below to book the {car.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="dateRange"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Rental Period</FormLabel>
                          <DateRangePicker
                            date={dateRange}
                            onDateChange={handleDateRangeChange}
                          />
                          <FormDescription>
                            Select the start and end dates for your rental
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pickupLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup Location</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select pickup location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="main-office">Main Office - Downtown</SelectItem>
                              <SelectItem value="airport">Airport Terminal</SelectItem>
                              <SelectItem value="north-branch">North City Branch</SelectItem>
                              <SelectItem value="south-branch">South City Branch</SelectItem>
                              <SelectItem value="east-branch">East Side Location</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Where would you like to pick up the car?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <h3 className="mb-3 font-medium">Additional Services</h3>
                      <div className="space-y-4">
                        {additionalServices.map((service, index) => (
                          <FormField
                            key={service.name}
                            control={form.control}
                            name={`additionalServices.${index}.selected`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base cursor-pointer">
                                    {service.name}
                                  </FormLabel>
                                  <FormDescription>
                                    ${service.price} per day
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) => {
                                      field.onChange(checked);
                                      form.setValue(
                                        `additionalServices.${index}.name`,
                                        service.name
                                      );
                                      form.setValue(
                                        `additionalServices.${index}.price`,
                                        service.price
                                      );
                                    }}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer">
                              I agree to the{" "}
                              <span 
                                className="text-primary hover:underline cursor-pointer"
                                onClick={() => setShowTermsDialog(true)}
                              >
                                Terms and Conditions
                              </span>
                            </FormLabel>
                            <FormDescription>
                              You must accept our terms and conditions to proceed with the booking
                            </FormDescription>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={createBooking.isPending}
                    >
                      {createBooking.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Confirm Booking"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={car.images[0]} 
                    alt={car.name} 
                    className="h-16 w-24 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium">{car.name}</h3>
                    <p className="text-sm text-gray-500">{car.type}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Rental period:</span>
                    <span>{days} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Base price per day:</span>
                    <span>${car.price}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Car rental total:</span>
                    <span>${rentalTotal}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Additional Services:</h4>
                  {form.getValues().additionalServices.some(service => service.selected) ? (
                    form.getValues().additionalServices
                      .filter(service => service.selected)
                      .map(service => (
                        <div key={service.name} className="flex justify-between text-sm">
                          <span>{service.name} (${service.price} × {days} days):</span>
                          <span>${service.price * days}</span>
                        </div>
                      ))
                  ) : (
                    <div className="text-sm text-gray-500">No additional services selected</div>
                  )}
                  <div className="flex justify-between font-medium">
                    <span>Services total:</span>
                    <span>${servicesTotal}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">${total}</span>
                </div>

                <div className="rounded-md bg-blue-50 p-4 mt-4">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Booking Protection</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          Free cancellation up to 24 hours before pickup.
                          No hidden fees, all applicable taxes included.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Dialog */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms and Conditions</DialogTitle>
            <DialogDescription>
              Please read these terms carefully before booking
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 text-sm">
            <h3 className="text-lg font-semibold">1. Rental Agreement</h3>
            <p>
              By booking a vehicle through our service, you enter into a rental agreement with CarRental. 
              This agreement is governed by the laws of the state in which the rental begins and is subject 
              to the terms and conditions outlined herein.
            </p>
            
            <h3 className="text-lg font-semibold">2. Eligibility Requirements</h3>
            <p>
              To rent a vehicle, you must:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Be at least 21 years of age (25 for luxury and specialty vehicles)</li>
              <li>Possess a valid driver's license that has been held for at least one year</li>
              <li>Present a valid credit card in your name at the time of pickup</li>
              <li>Meet our insurance and credit requirements</li>
            </ul>
            
            <h3 className="text-lg font-semibold">3. Reservation and Payment</h3>
            <p>
              Your reservation is confirmed upon receipt of payment. The rental rate includes the base 
              rental fee for the selected vehicle, basic insurance coverage, and standard equipment. 
              Additional services, extended insurance coverage, and accessories are subject to extra charges.
            </p>
            
            <h3 className="text-lg font-semibold">4. Cancellation Policy</h3>
            <p>
              Free cancellation is available up to 24 hours before the scheduled pickup time. Cancellations 
              made within 24 hours of the pickup time may incur a fee equal to one day's rental charge. 
              No-shows will be charged the full rental amount.
            </p>
            
            <h3 className="text-lg font-semibold">5. Vehicle Pickup and Return</h3>
            <p>
              You agree to pick up and return the vehicle at the designated location on the specified dates. 
              Late returns will incur additional daily charges. The vehicle must be returned in the same 
              condition as received, with a full fuel tank unless a prepaid fuel option was selected.
            </p>
            
            <h3 className="text-lg font-semibold">6. Vehicle Use</h3>
            <p>
              The rental vehicle may only be:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Driven by the renter or additional authorized drivers listed on the rental agreement</li>
              <li>Used on properly maintained roads and in accordance with traffic laws</li>
              <li>Used within the designated geographic area specified in the rental agreement</li>
            </ul>
            <p>
              Prohibited uses include but are not limited to off-road driving, racing, towing, or 
              transporting hazardous materials.
            </p>
            
            <h3 className="text-lg font-semibold">7. Insurance and Liability</h3>
            <p>
              Basic insurance coverage is included in your rental. You may purchase additional coverage 
              options. You are responsible for any damage to the vehicle not covered by the selected 
              insurance plan, including deductibles or exclusions.
            </p>
            
            <h3 className="text-lg font-semibold">8. Privacy Policy</h3>
            <p>
              We collect and process your personal information in accordance with our Privacy Policy. 
              By accepting these terms, you acknowledge that you have read and understood our privacy practices.
            </p>
            
            <h3 className="text-lg font-semibold">9. Modifications and Disputes</h3>
            <p>
              We reserve the right to modify these terms at any time. Any disputes arising from the rental 
              agreement shall be resolved through arbitration in accordance with the laws of the state in 
              which the rental begins.
            </p>
            
            <h3 className="text-lg font-semibold">10. Acceptance</h3>
            <p>
              By checking the "I agree to the Terms and Conditions" box, you acknowledge that you have read, 
              understood, and agree to be bound by all the terms and conditions stated herein.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => {
                setShowTermsDialog(false);
                form.setValue("termsAccepted", true);
              }}
            >
              Accept Terms
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
