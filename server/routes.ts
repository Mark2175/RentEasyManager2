import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPropertySchema, insertUserSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      console.error("User creation error:", error);
      res.status(400).json({ error: "Invalid user data", details: error.message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.get("/api/users/phone/:phoneNumber", async (req, res) => {
    try {
      const phoneNumber = req.params.phoneNumber;
      const user = await storage.getUserByPhone(phoneNumber);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Property routes
  app.post("/api/properties", async (req, res) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(propertyData);
      res.json(property);
    } catch (error) {
      res.status(400).json({ error: "Invalid property data" });
    }
  });

  app.get("/api/properties", async (req, res) => {
    try {
      const { area, type, minRent, maxRent } = req.query;
      const filters = {
        area: area as string,
        propertyType: type as string,
        minRent: minRent ? parseInt(minRent as string) : undefined,
        maxRent: maxRent ? parseInt(maxRent as string) : undefined,
      };
      const properties = await storage.getProperties(filters);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch property" });
    }
  });

  app.put("/api/properties/:id", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const updates = req.body;
      const property = await storage.updateProperty(propertyId, updates);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ error: "Failed to update property" });
    }
  });

  // Booking routes
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.json(booking);
    } catch (error) {
      res.status(400).json({ error: "Invalid booking data" });
    }
  });

  app.get("/api/bookings/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const bookings = await storage.getBookingsByUser(userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  // Local businesses routes
  app.get("/api/local-businesses", async (req, res) => {
    try {
      const { area } = req.query;
      const businesses = await storage.getLocalBusinesses(area as string);
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch local businesses" });
    }
  });

  // Neighborhood events routes
  app.get("/api/neighborhood-events", async (req, res) => {
    try {
      const { area } = req.query;
      const events = await storage.getNeighborhoodEvents(area as string);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch neighborhood events" });
    }
  });

  // Referral routes
  app.post("/api/referrals", async (req, res) => {
    try {
      const referralData = req.body;
      const referral = await storage.createReferral(referralData);
      res.json(referral);
    } catch (error) {
      res.status(400).json({ error: "Invalid referral data" });
    }
  });

  app.get("/api/referrals/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const referrals = await storage.getReferralsByUser(userId);
      res.json(referrals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch referrals" });
    }
  });

  // Payment routes
  app.post("/api/payments", async (req, res) => {
    try {
      const paymentData = req.body;
      const payment = await storage.createPayment(paymentData);
      res.json(payment);
    } catch (error) {
      res.status(400).json({ error: "Invalid payment data" });
    }
  });

  app.get("/api/payments/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const payments = await storage.getPaymentsByUser(userId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
