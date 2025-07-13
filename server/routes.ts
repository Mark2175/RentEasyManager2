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

  // Create payment intent for booking
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { bookingId, amount, paymentType } = req.body;
      
      // Create payment record
      const payment = await storage.createPayment({
        userId: req.user?.id || 1,
        bookingId: bookingId,
        amount: amount,
        paymentType: paymentType || 'rent',
        status: 'pending',
        paymentMethod: 'pending',
        transactionId: `TXN_${Date.now()}`,
        paidAt: new Date(),
      });

      res.json({
        paymentId: payment.id,
        clientSecret: `pi_${payment.id}_secret_${Math.random().toString(36).substr(2, 9)}`,
        amount: amount,
      });
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  });

  // Complete payment
  app.post("/api/complete-payment", async (req, res) => {
    try {
      const { paymentId, paymentMethod } = req.body;
      
      // Update payment status
      const payment = await storage.updatePayment(paymentId, {
        status: 'completed',
        paymentMethod: paymentMethod,
        paidAt: new Date(),
      });

      if (payment) {
        res.json({ success: true, payment });
      } else {
        res.status(404).json({ error: "Payment not found" });
      }
    } catch (error) {
      console.error('Payment completion failed:', error);
      res.status(500).json({ error: "Failed to complete payment" });
    }
  });

  // Notification routes
  app.get("/api/notifications/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.get("/api/notifications/:userId/unread-count", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch unread notification count" });
    }
  });

  app.post("/api/notifications/:id/mark-read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markNotificationAsRead(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  app.post("/api/notifications/:userId/mark-all-read", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      await storage.markAllNotificationsAsRead(userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark all notifications as read" });
    }
  });

  // Calendar and availability routes
  app.get("/api/availability/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { date } = req.query;
      const slots = await storage.getAvailabilitySlots(userId, date as string);
      res.json(slots);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/availability", async (req, res) => {
    try {
      const slot = await storage.createAvailabilitySlot(req.body);
      res.json(slot);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Property visit routes
  app.post("/api/property-visits", async (req, res) => {
    try {
      const visit = await storage.createPropertyVisit(req.body);
      
      // Create notifications for landlord and broker
      if (visit.landlordId) {
        await storage.createNotification({
          userId: visit.landlordId,
          title: "New Property Visit Scheduled",
          message: `A tenant has scheduled a visit on ${visit.scheduledDate} at ${visit.scheduledTime}. Visit ID: ${visit.visitId}`,
          type: "property",
          relatedId: visit.propertyId,
        });
      }
      
      if (visit.brokerId) {
        await storage.createNotification({
          userId: visit.brokerId,
          title: "New Property Visit Scheduled",
          message: `A tenant has scheduled a visit on ${visit.scheduledDate} at ${visit.scheduledTime}. Visit ID: ${visit.visitId}`,
          type: "property",
          relatedId: visit.propertyId,
        });
      }
      
      res.json(visit);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/property-visits/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const visits = await storage.getPropertyVisitsByUser(userId);
      res.json(visits);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/property-visits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const visit = await storage.updatePropertyVisit(id, req.body);
      res.json(visit);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/property-visits/check-conflicts", async (req, res) => {
    try {
      const { date, time, landlordId, brokerId } = req.body;
      const hasConflict = await storage.checkVisitConflicts(date, time, landlordId, brokerId);
      res.json({ hasConflict });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
