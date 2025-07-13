import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertPropertySchema, insertUserSchema, insertBookingSchema, createUserSchema, completeProfileSchema } from "@shared/schema";
import { z } from "zod";

// Setup multer for file uploads
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs only
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use('/uploads', express.static(uploadsDir));
  
  // Document upload endpoint
  app.post("/api/upload-documents", upload.fields([
    { name: 'aadhaarDocument', maxCount: 1 },
    { name: 'panDocument', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 },
    { name: 'incomeProof', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const userId = parseInt(req.body.userId);
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      const documentPaths: any = {};
      
      // Process uploaded files
      Object.keys(files).forEach(fieldname => {
        if (files[fieldname] && files[fieldname][0]) {
          documentPaths[fieldname] = `/uploads/${files[fieldname][0].filename}`;
        }
      });
      
      // Update user with document paths
      const updatedUser = await storage.updateUser(userId, {
        ...documentPaths,
        documentsVerified: false // Will be verified by admin
      });
      
      res.json({ 
        message: "Documents uploaded successfully", 
        documentPaths,
        user: updatedUser 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = createUserSchema.parse(req.body);
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

  // Update user profile
  app.patch("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updatedUser = await storage.updateUser(userId, req.body);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Check if user profile is complete for booking
  app.get("/api/users/:id/booking-eligibility", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const isEligible = !!(
        user.fullName &&
        user.email &&
        user.completeAddress &&
        user.company &&
        user.phoneNumber &&
        user.aadhaarDocument &&
        user.panDocument &&
        user.addressProof &&
        user.incomeProof
      );
      
      const missingFields = [];
      if (!user.fullName) missingFields.push("Full Name");
      if (!user.email) missingFields.push("Email");
      if (!user.completeAddress) missingFields.push("Complete Address");
      if (!user.company) missingFields.push("Company");
      if (!user.aadhaarDocument) missingFields.push("Aadhaar Document");
      if (!user.panDocument) missingFields.push("PAN Document");
      if (!user.addressProof) missingFields.push("Address Proof");
      if (!user.incomeProof) missingFields.push("Income Proof");
      
      res.json({
        isEligible,
        missingFields,
        documentsVerified: user.documentsVerified || false
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to check booking eligibility" });
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
