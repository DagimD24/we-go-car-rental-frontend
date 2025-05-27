import carsData from '../data/cars.json';
import usersData from '../data/users.json';
import bookingsData from '../data/bookings.json';

// Types based on our data structure
export interface Car {
  id: number;
  name: string;
  type: string;
  price: number;
  year: number;
  fuelType: string;
  transmission: string;
  seats: number;
  doors: number;
  luggage: number;
  features: string[];
  description: string;
  availability: string;
  images: string[];
}

export interface User {
  id: number;
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone?: string;
  documentStatus: string;
  createdAt: string;
}

export interface Booking {
  id: number;
  userId: number;
  carId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  pickupLocation: string;
  additionalServices?: any[];
  createdAt: string;
}

// Simulate async behavior like API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Current user session (stored in localStorage)
const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
};

const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

// Data storage helpers
const getStoredUsers = (): User[] => {
  const stored = localStorage.getItem('users');
  return stored ? JSON.parse(stored) : [...usersData];
};

const setStoredUsers = (users: User[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

const getStoredBookings = (): Booking[] => {
  const stored = localStorage.getItem('bookings');
  return stored ? JSON.parse(stored) : [...bookingsData];
};

const setStoredBookings = (bookings: Booking[]) => {
  localStorage.setItem('bookings', JSON.stringify(bookings));
};

// Car service
export const carService = {
  async getAllCars(): Promise<Car[]> {
    await delay(300);
    return [...carsData];
  },

  async getCarById(id: number): Promise<Car | null> {
    await delay(200);
    const car = carsData.find(c => c.id === id);
    return car || null;
  },

  async getFilteredCars(filters: {
    types?: string[];
    minPrice?: number;
    maxPrice?: number;
    features?: string[];
    searchTerm?: string;
  }): Promise<Car[]> {
    await delay(300);
    let filtered = [...carsData];

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(car => 
        car.name.toLowerCase().includes(term) || 
        car.type.toLowerCase().includes(term)
      );
    }

    if (filters.types && filters.types.length > 0) {
      filtered = filtered.filter(car => filters.types!.includes(car.type));
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(car => car.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(car => car.price <= filters.maxPrice!);
    }

    if (filters.features && filters.features.length > 0) {
      filtered = filtered.filter(car => {
        return filters.features!.every(feature => {
          if (feature === "Automatic") {
            return car.transmission === "Automatic";
          }
          return car.features.includes(feature);
        });
      });
    }

    return filtered;
  }
};

// Auth service
export const authService = {
  async login(username: string, password: string): Promise<User> {
    await delay(500);
    const users = getStoredUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    setCurrentUser(user);
    return user;
  },

  async register(userData: Omit<User, 'id' | 'createdAt' | 'documentStatus'>): Promise<User> {
    await delay(500);
    const users = getStoredUsers();
    
    // Check if username or email already exists
    if (users.find(u => u.username === userData.username)) {
      throw new Error('Username already taken');
    }
    
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Email already in use');
    }

    const newUser: User = {
      ...userData,
      id: Math.max(0, ...users.map(u => u.id)) + 1,
      documentStatus: 'not_uploaded',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    setStoredUsers(users);
    setCurrentUser(newUser);
    return newUser;
  },

  async logout(): Promise<void> {
    await delay(200);
    setCurrentUser(null);
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(100);
    return getCurrentUser();
  },

  async updateUserDocumentStatus(status: string): Promise<User> {
    await delay(300);
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex].documentStatus = status;
    setStoredUsers(users);
    setCurrentUser(users[userIndex]);
    
    return users[userIndex];
  }
};

// Booking service
export const bookingService = {
  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    await delay(500);
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const bookings = getStoredBookings();
    const newBooking: Booking = {
      ...bookingData,
      userId: currentUser.id,
      id: Math.max(0, ...bookings.map(b => b.id)) + 1,
      createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);
    setStoredBookings(bookings);
    
    return newBooking;
  },

  async getUserBookings(): Promise<Booking[]> {
    await delay(300);
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const bookings = getStoredBookings();
    return bookings.filter(b => b.userId === currentUser.id);
  },

  async getBookingById(id: number): Promise<Booking | null> {
    await delay(200);
    const bookings = getStoredBookings();
    return bookings.find(b => b.id === id) || null;
  }
};