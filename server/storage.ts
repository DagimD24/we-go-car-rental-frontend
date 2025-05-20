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
