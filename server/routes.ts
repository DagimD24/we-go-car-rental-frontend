import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";

const MemoryStoreSession = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "car-rental-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: 86400000 }, // 24 hours
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    })
  );

  // Car routes
  app.get("/api/cars", async (req: Request, res: Response) => {
    try {
      const type = req.query.type as string | undefined;
      const availability = req.query.availability as string | undefined;
      const minPrice = req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined;
      const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined;
      
      let cars;
      
      if (type) {
        cars = await storage.getCarsByType(type);
      } else if (availability) {
        cars = await storage.getCarsByAvailability(availability);
      } else if (minPrice !== undefined && maxPrice !== undefined) {
        cars = await storage.getCarsByPriceRange(minPrice, maxPrice);
      } else {
        cars = await storage.getAllCars();
      }
      
      res.json(cars);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cars" });
    }
  });

  app.get("/api/cars/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const car = await storage.getCarById(id);
      
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      
      res.json(car);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch car details" });
    }
  });

  // Authentication routes
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      const user = await storage.createUser(userData);
      
      // Set user in session
      (req.session as any).userId = user.id;
      
      res.status(201).json({ id: user.id, username: user.username });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set user in session
      (req.session as any).userId = user.id;
      
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.post("/api/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/me", async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userData } = user;
      res.json(userData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user data" });
    }
  });

  // User documents
  app.post("/api/user/document", async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Update user document status (in a real app, we'd handle file upload)
      const updatedUser = await storage.updateUserDocumentStatus(userId, "pending_verification");
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ message: "Document uploaded successfully", status: updatedUser.documentStatus });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  // Booking routes
  app.post("/api/bookings", async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        userId
      });
      
      // Check if car is available
      const car = await storage.getCarById(bookingData.carId);
      
      if (!car) {
        return res.status(404).json({ message: "Car not found" });
      }
      
      if (car.availability !== "available" && car.availability !== "limited") {
        return res.status(400).json({ message: "Car is not available for booking" });
      }
      
      const booking = await storage.createBooking(bookingData);
      
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.get("/api/bookings", async (req: Request, res: Response) => {
    try {
      const userId = (req.session as any).userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const bookings = await storage.getBookingsByUserId(userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
