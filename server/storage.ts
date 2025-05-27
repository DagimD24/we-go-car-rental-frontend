import { 
  users, type User, type InsertUser,
  cars, type Car, type InsertCar,
  bookings, type Booking, type InsertBooking
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserDocumentStatus(userId: number, status: string): Promise<User | undefined>;
  
  // Car operations
  getAllCars(): Promise<Car[]>;
  getCarById(id: number): Promise<Car | undefined>;
  getCarsByType(type: string): Promise<Car[]>;
  getCarsByAvailability(availability: string): Promise<Car[]>;
  getCarsByPriceRange(min: number, max: number): Promise<Car[]>;
  createCar(car: InsertCar): Promise<Car>;
  updateCarAvailability(carId: number, availability: string): Promise<Car | undefined>;
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingById(id: number): Promise<Booking | undefined>;
  getBookingsByUserId(userId: number): Promise<Booking[]>;
  updateBookingStatus(bookingId: number, status: string): Promise<Booking | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cars: Map<number, Car>;
  private bookings: Map<number, Booking>;
  
  private currentUserId: number;
  private currentCarId: number;
  private currentBookingId: number;

  constructor() {
    this.users = new Map();
    this.cars = new Map();
    this.bookings = new Map();
    
    this.currentUserId = 1;
    this.currentCarId = 1;
    this.currentBookingId = 1;
    
    // Initialize with sample cars
    this.initializeSampleCars();
  }

  private initializeSampleCars() {
    const sampleCars: InsertCar[] = [
      {
        name: "Mercedes-Benz E-Class",
        type: "Luxury Sedan",
        price: 75,
        year: 2023,
        fuelType: "Diesel",
        transmission: "Automatic",
        seats: 5,
        doors: 4,
        luggage: 3,
        features: ["Bluetooth Connection", "Navigation System", "Leather Seats", "Climate Control", "Parking Sensors", "Reverse Camera"],
        description: "The Mercedes-Benz E-Class is an elegant luxury sedan that offers exceptional comfort and advanced technology. Perfect for business trips or special occasions.",
        availability: "available",
        images: [
          "https://pixabay.com/get/gf369f7c5be78914221ffb91181c7285ac9afa9bf619b0934ee0c8990cfde15eeb8b3c20d8d014ef9ab2c8899821d03590460f978f3a2962c3142888589807f6a_1280.jpg",
          "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80",
          "https://pixabay.com/get/g65c2f9646175917ae21805ab8769ff21cc6ce2e16e23a2b0e71e836a52e20c8374b24638beb6b07ef716a3e118159900bc18c17035dc1d13da6d65a91f399828_1280.jpg",
          "https://pixabay.com/get/gf04db82b17505a3f5936afb820726f6cdbab92523fdd20a3164b9e84f2893f3649fe07f7a5eedc2399d34c5dfee451da5a0e918460e29f5732dba882b8c2b1b3_1280.jpg"
        ]
      },
      {
        name: "Toyota RAV4",
        type: "SUV",
        price: 65,
        year: 2023,
        fuelType: "Hybrid",
        transmission: "Automatic",
        seats: 5,
        doors: 5,
        luggage: 4,
        features: ["Bluetooth Connection", "Apple CarPlay", "Android Auto", "Backup Camera", "Cruise Control", "Lane Departure Warning"],
        description: "The Toyota RAV4 offers a perfect blend of comfort, practicality, and efficiency with its hybrid powertrain. Ideal for family trips or outdoor adventures.",
        availability: "available",
        images: [
          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80",
          "https://pixabay.com/get/g65c2f9646175917ae21805ab8769ff21cc6ce2e16e23a2b0e71e836a52e20c8374b24638beb6b07ef716a3e118159900bc18c17035dc1d13da6d65a91f399828_1280.jpg",
          "https://pixabay.com/get/gf04db82b17505a3f5936afb820726f6cdbab92523fdd20a3164b9e84f2893f3649fe07f7a5eedc2399d34c5dfee451da5a0e918460e29f5732dba882b8c2b1b3_1280.jpg"
        ]
      },
      {
        name: "BMW 3 Series",
        type: "Sport Sedan",
        price: 70,
        year: 2023,
        fuelType: "Petrol",
        transmission: "Automatic",
        seats: 5,
        doors: 4,
        luggage: 3,
        features: ["Bluetooth Connection", "Navigation System", "Leather Seats", "Climate Control", "Parking Sensors", "Reverse Camera"],
        description: "The BMW 3 Series is the embodiment of a sporty sedan. With its powerful engine, responsive handling, and premium interior, it's an ideal choice for those who want both luxury and driving pleasure.",
        availability: "available",
        images: [
          "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
          "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80",
          "https://pixabay.com/get/g65c2f9646175917ae21805ab8769ff21cc6ce2e16e23a2b0e71e836a52e20c8374b24638beb6b07ef716a3e118159900bc18c17035dc1d13da6d65a91f399828_1280.jpg",
          "https://pixabay.com/get/gf04db82b17505a3f5936afb820726f6cdbab92523fdd20a3164b9e84f2893f3649fe07f7a5eedc2399d34c5dfee451da5a0e918460e29f5732dba882b8c2b1b3_1280.jpg"
        ]
      },
      {
        name: "Volkswagen Golf GTI",
        type: "Hatchback",
        price: 55,
        year: 2023,
        fuelType: "Petrol",
        transmission: "Manual",
        seats: 5,
        doors: 5,
        luggage: 2,
        features: ["Bluetooth Connection", "Apple CarPlay", "Android Auto", "Sport Seats", "Climate Control", "Rear View Camera"],
        description: "The Volkswagen Golf GTI combines practicality with driving fun. Its responsive handling and turbocharged engine make every drive enjoyable.",
        availability: "available",
        images: [
          "https://images.unsplash.com/photo-1616422285623-13ff0162193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
          "https://images.unsplash.com/photo-1616422285623-13ff0162193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80",
          "https://pixabay.com/get/g65c2f9646175917ae21805ab8769ff21cc6ce2e16e23a2b0e71e836a52e20c8374b24638beb6b07ef716a3e118159900bc18c17035dc1d13da6d65a91f399828_1280.jpg",
          "https://pixabay.com/get/gf04db82b17505a3f5936afb820726f6cdbab92523fdd20a3164b9e84f2893f3649fe07f7a5eedc2399d34c5dfee451da5a0e918460e29f5732dba882b8c2b1b3_1280.jpg"
        ]
      },
      {
        name: "Audi A6",
        type: "Luxury Sedan",
        price: 80,
        year: 2023,
        fuelType: "Diesel",
        transmission: "Automatic",
        seats: 5,
        doors: 4,
        luggage: 3,
        features: ["Bluetooth Connection", "Navigation System", "Leather Seats", "Climate Control", "Parking Sensors", "Reverse Camera"],
        description: "The Audi A6 is a premium luxury sedan featuring cutting-edge technology and elegant design. Perfect for corporate travel or luxury experiences.",
        availability: "limited",
        images: [
          "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
          "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80",
          "https://pixabay.com/get/g65c2f9646175917ae21805ab8769ff21cc6ce2e16e23a2b0e71e836a52e20c8374b24638beb6b07ef716a3e118159900bc18c17035dc1d13da6d65a91f399828_1280.jpg",
          "https://pixabay.com/get/gf04db82b17505a3f5936afb820726f6cdbab92523fdd20a3164b9e84f2893f3649fe07f7a5eedc2399d34c5dfee451da5a0e918460e29f5732dba882b8c2b1b3_1280.jpg"
        ]
      },
      {
        name: "Mazda MX-5 Miata",
        type: "Convertible",
        price: 85,
        year: 2023,
        fuelType: "Petrol",
        transmission: "Manual",
        seats: 2,
        doors: 2,
        luggage: 1,
        features: ["Bluetooth Connection", "Leather Seats", "Climate Control", "Push Button Start", "Blind Spot Monitoring", "Lane Keeping Assist"],
        description: "The Mazda MX-5 Miata offers pure driving joy with its convertible top and nimble handling. Perfect for scenic coastal roads and weekend getaways.",
        availability: "unavailable",
        images: [
          "https://images.unsplash.com/photo-1555626906-fcf10d6851b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
          "https://images.unsplash.com/photo-1555626906-fcf10d6851b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80",
          "https://pixabay.com/get/g65c2f9646175917ae21805ab8769ff21cc6ce2e16e23a2b0e71e836a52e20c8374b24638beb6b07ef716a3e118159900bc18c17035dc1d13da6d65a91f399828_1280.jpg",
          "https://pixabay.com/get/gf04db82b17505a3f5936afb820726f6cdbab92523fdd20a3164b9e84f2893f3649fe07f7a5eedc2399d34c5dfee451da5a0e918460e29f5732dba882b8c2b1b3_1280.jpg"
        ]
      },
      // Page 2 cars
      {
        name: "Honda Civic",
        type: "Compact",
        price: 45,
        year: 2023,
        fuelType: "Petrol",
        transmission: "Automatic",
        seats: 5,
        doors: 4,
        luggage: 2,
        features: ["Bluetooth Connection", "Apple CarPlay", "Android Auto", "Backup Camera", "Cruise Control"],
        description: "The Honda Civic is a reliable and fuel-efficient compact car, perfect for city driving and daily commutes.",
        availability: "available",
        images: [
          "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
          "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80"
        ]
      },
      {
        name: "Ford Mustang",
        type: "Sport Coupe",
        price: 95,
        year: 2023,
        fuelType: "Petrol",
        transmission: "Manual",
        seats: 4,
        doors: 2,
        luggage: 2,
        features: ["Bluetooth Connection", "Navigation System", "Premium Audio", "Performance Package", "Track Apps"],
        description: "The iconic Ford Mustang delivers thrilling performance and classic American muscle car styling.",
        availability: "available",
        images: [
          "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
          "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80"
        ]
      },
      {
        name: "Jeep Wrangler",
        type: "SUV",
        price: 80,
        year: 2023,
        fuelType: "Petrol",
        transmission: "Automatic",
        seats: 5,
        doors: 4,
        luggage: 3,
        features: ["4WD", "Removable Doors", "Removable Roof", "Rock Rails", "Skid Plates", "Trail Rated"],
        description: "The Jeep Wrangler is built for adventure with unmatched off-road capability and iconic design.",
        availability: "available",
        images: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80"
        ]
      },
      {
        name: "Tesla Model 3",
        type: "Electric Sedan",
        price: 85,
        year: 2023,
        fuelType: "Electric",
        transmission: "Automatic",
        seats: 5,
        doors: 4,
        luggage: 3,
        features: ["Autopilot", "Supercharging", "Over-the-Air Updates", "Premium Audio", "Glass Roof", "Mobile Connector"],
        description: "The Tesla Model 3 combines cutting-edge electric technology with minimalist luxury design.",
        availability: "available",
        images: [
          "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
          "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80"
        ]
      },
      {
        name: "Porsche 911",
        type: "Sports Car",
        price: 150,
        year: 2023,
        fuelType: "Petrol",
        transmission: "Automatic",
        seats: 4,
        doors: 2,
        luggage: 1,
        features: ["Sport Chrono Package", "PASM", "Navigation", "Bose Audio", "Sport Exhaust", "Launch Control"],
        description: "The legendary Porsche 911 offers uncompromising performance and timeless sports car design.",
        availability: "available",
        images: [
          "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
          "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80"
        ]
      },
      {
        name: "Subaru Outback",
        type: "Wagon",
        price: 60,
        year: 2023,
        fuelType: "Petrol",
        transmission: "CVT",
        seats: 5,
        doors: 5,
        luggage: 4,
        features: ["All-Wheel Drive", "X-Mode", "EyeSight Safety", "Roof Rails", "Power Liftgate", "Heated Seats"],
        description: "The Subaru Outback combines SUV capability with wagon practicality for outdoor adventures.",
        availability: "available",
        images: [
          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80"
        ]
      },
      // Page 3 cars
      {
        name: "Range Rover Sport",
        type: "Luxury SUV",
        price: 120,
        year: 2023,
        fuelType: "Hybrid",
        transmission: "Automatic",
        seats: 7,
        doors: 5,
        luggage: 4,
        features: ["Terrain Response", "Air Suspension", "Meridian Audio", "Panoramic Roof", "Wade Sensing", "Configurable Dynamics"],
        description: "The Range Rover Sport delivers luxury and capability with advanced terrain management systems.",
        availability: "available",
        images: [
          "https://images.unsplash.com/photo-1494976064148-d3e514fb9639?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
          "https://images.unsplash.com/photo-1494976064148-d3e514fb9639?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80"
        ]
      },
      {
        name: "Lexus RX",
        type: "Luxury SUV",
        price: 90,
        year: 2023,
        fuelType: "Hybrid",
        transmission: "CVT",
        seats: 5,
        doors: 5,
        luggage: 3,
        features: ["Lexus Safety System", "Mark Levinson Audio", "Panoramic View Monitor", "Wireless Charging", "Head-Up Display", "Remote Touch"],
        description: "The Lexus RX provides refined luxury with exceptional reliability and hybrid efficiency.",
        availability: "available",
        images: [
          "https://images.unsplash.com/photo-1494976064148-d3e514fb9639?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
          "https://images.unsplash.com/photo-1494976064148-d3e514fb9639?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80"
        ]
      },
      {
        name: "Chevrolet Camaro",
        type: "Sport Coupe",
        price: 75,
        year: 2023,
        fuelType: "Petrol",
        transmission: "Manual",
        seats: 4,
        doors: 2,
        luggage: 2,
        features: ["Performance Data Recorder", "Magnetic Ride Control", "Brembo Brakes", "Launch Control", "Line Lock", "Competition Mode"],
        description: "The Chevrolet Camaro delivers raw American muscle with modern performance technology.",
        availability: "available",
        images: [
          "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
          "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80"
        ]
      },
      {
        name: "Mini Cooper",
        type: "Compact",
        price: 55,
        year: 2023,
        fuelType: "Petrol",
        transmission: "Manual",
        seats: 4,
        doors: 2,
        luggage: 1,
        features: ["John Cooper Works Package", "Union Jack Tail Lights", "Digital Cockpit", "Wireless Charging", "Harman Kardon Audio", "Dynamic Damper Control"],
        description: "The Mini Cooper offers distinctive British style with go-kart handling and premium features.",
        availability: "available",
        images: [
          "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
          "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80"
        ]
      },
      {
        name: "Cadillac Escalade",
        type: "Luxury SUV",
        price: 140,
        year: 2023,
        fuelType: "Petrol",
        transmission: "Automatic",
        seats: 8,
        doors: 5,
        luggage: 5,
        features: ["Magnetic Ride Control", "38-inch OLED Display", "AKG Audio", "Super Cruise", "Air Ride Suspension", "Night Vision"],
        description: "The Cadillac Escalade represents the pinnacle of American luxury with commanding presence and technology.",
        availability: "available",
        images: [
          "https://images.unsplash.com/photo-1494976064148-d3e514fb9639?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
          "https://images.unsplash.com/photo-1494976064148-d3e514fb9639?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80"
        ]
      },
      {
        name: "Nissan GT-R",
        type: "Sports Car",
        price: 160,
        year: 2023,
        fuelType: "Petrol",
        transmission: "Automatic",
        seats: 4,
        doors: 2,
        luggage: 2,
        features: ["ATTESA E-TS", "VDC-R", "Launch Control", "Bilstein DampTronic", "Bose Audio", "Track Pack"],
        description: "The Nissan GT-R delivers supercar performance with advanced all-wheel drive technology.",
        availability: "available",
        images: [
          "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
          "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80"
        ]
      }
    ];
    
    sampleCars.forEach(car => {
      this.createCar(car);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      documentStatus: "not_uploaded",
      createdAt: now 
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserDocumentStatus(userId: number, status: string): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, documentStatus: status };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Car operations
  async getAllCars(): Promise<Car[]> {
    return Array.from(this.cars.values());
  }
  
  async getCarById(id: number): Promise<Car | undefined> {
    return this.cars.get(id);
  }
  
  async getCarsByType(type: string): Promise<Car[]> {
    return Array.from(this.cars.values()).filter(
      (car) => car.type === type,
    );
  }
  
  async getCarsByAvailability(availability: string): Promise<Car[]> {
    return Array.from(this.cars.values()).filter(
      (car) => car.availability === availability,
    );
  }
  
  async getCarsByPriceRange(min: number, max: number): Promise<Car[]> {
    return Array.from(this.cars.values()).filter(
      (car) => car.price >= min && car.price <= max,
    );
  }
  
  async createCar(insertCar: InsertCar): Promise<Car> {
    const id = this.currentCarId++;
    const car: Car = { ...insertCar, id };
    this.cars.set(id, car);
    return car;
  }
  
  async updateCarAvailability(carId: number, availability: string): Promise<Car | undefined> {
    const car = await this.getCarById(carId);
    if (!car) return undefined;
    
    const updatedCar = { ...car, availability };
    this.cars.set(carId, updatedCar);
    return updatedCar;
  }

  // Booking operations
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const now = new Date();
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      createdAt: now 
    };
    this.bookings.set(id, booking);
    
    // Update car availability
    await this.updateCarAvailability(booking.carId, "unavailable");
    
    return booking;
  }
  
  async getBookingById(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }
  
  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId,
    );
  }
  
  async updateBookingStatus(bookingId: number, status: string): Promise<Booking | undefined> {
    const booking = await this.getBookingById(bookingId);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, status };
    this.bookings.set(bookingId, updatedBooking);
    return updatedBooking;
  }
}

export const storage = new MemStorage();
