import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, date, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  phoneNumber: text("phone_number").notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email"),
  userType: text("user_type").notNull(), // 'tenant', 'landlord', 'broker', 'admin'
  isVerified: boolean("is_verified").default(false),
  address: text("address"),
  aadhaarNumber: text("aadhaar_number"),
  panNumber: text("pan_number"),
  bankAccount: text("bank_account"),
  firebaseUid: text("firebase_uid"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  propertyId: text("property_id").notNull().unique(),
  landlordId: integer("landlord_id").references(() => users.id),
  brokerId: integer("broker_id").references(() => users.id),
  tenantId: integer("tenant_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  area: text("area").notNull(),
  city: text("city").notNull().default("Bangalore"),
  propertyType: text("property_type").notNull(), // 'Apartment', 'Villa', 'House', etc.
  rent: text("rent").notNull(),
  sqft: integer("sqft"),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  floor: text("floor"), // e.g., "2nd Floor", "Ground Floor", "3rd Floor"
  securityPersonAvailable: boolean("security_person_available").default(false),
  amenities: text("amenities").array(),
  images: text("images").array(),
  isAvailable: boolean("is_available").default(true),
  hasVirtualTour: boolean("has_virtual_tour").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id),
  tenantId: integer("tenant_id").references(() => users.id),
  landlordId: integer("landlord_id").references(() => users.id),
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'rejected', 'active', 'completed'
  brokerageFee: decimal("brokerage_fee", { precision: 10, scale: 2 }),
  leaseStartDate: timestamp("lease_start_date"),
  leaseEndDate: timestamp("lease_end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id),
  userId: integer("user_id").references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(), // 'brokerage', 'rent', 'deposit'
  status: text("status").notNull().default("pending"), // 'pending', 'success', 'failed'
  paymentGateway: text("payment_gateway"), // 'razorpay'
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").references(() => users.id),
  refereeId: integer("referee_id").references(() => users.id),
  bonusAmount: decimal("bonus_amount", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("pending"), // 'pending', 'paid'
  createdAt: timestamp("created_at").defaultNow(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'moving', 'maintenance', 'cleaning', 'painting'
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }),
  providerId: integer("provider_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
});

export const localBusinesses = pgTable("local_businesses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'restaurant', 'grocery', 'pharmacy', 'shopping'
  address: text("address").notNull(),
  area: text("area").notNull(),
  phone: text("phone"),
  menu: jsonb("menu"),
  ratings: decimal("ratings", { precision: 2, scale: 1 }),
  isActive: boolean("is_active").default(true),
});

export const neighborhoodEvents = pgTable("neighborhood_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  area: text("area").notNull(),
  eventDate: timestamp("event_date").notNull(),
  organizerId: integer("organizer_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'property', 'booking', 'service', 'system'
  isRead: boolean("is_read").default(false),
  relatedId: integer("related_id"), // ID of related property, booking, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const availabilitySlots = pgTable("availability_slots", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  userRole: text("user_role").notNull(), // broker, landlord, tenant
  date: date("date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  isAvailable: boolean("is_available").default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const propertyVisits = pgTable("property_visits", {
  id: serial("id").primaryKey(),
  visitId: text("visit_id").notNull().unique(),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  tenantId: integer("tenant_id").references(() => users.id).notNull(),
  landlordId: integer("landlord_id").references(() => users.id),
  brokerId: integer("broker_id").references(() => users.id),
  scheduledDate: date("scheduled_date").notNull(),
  scheduledTime: time("scheduled_time").notNull(),
  status: text("status").notNull().default("scheduled"), // scheduled, confirmed, completed, cancelled, rescheduled
  tenantPhone: text("tenant_phone").notNull(),
  notes: text("notes"),
  confirmationSent: boolean("confirmation_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  propertyId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

export const insertLocalBusinessSchema = createInsertSchema(localBusinesses).omit({
  id: true,
});

export const insertNeighborhoodEventSchema = createInsertSchema(neighborhoodEvents).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertAvailabilitySlotSchema = createInsertSchema(availabilitySlots).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPropertyVisitSchema = createInsertSchema(propertyVisits).omit({
  id: true,
  visitId: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type LocalBusiness = typeof localBusinesses.$inferSelect;
export type InsertLocalBusiness = z.infer<typeof insertLocalBusinessSchema>;
export type NeighborhoodEvent = typeof neighborhoodEvents.$inferSelect;
export type InsertNeighborhoodEvent = z.infer<typeof insertNeighborhoodEventSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type AvailabilitySlot = typeof availabilitySlots.$inferSelect;
export type InsertAvailabilitySlot = z.infer<typeof insertAvailabilitySlotSchema>;
export type PropertyVisit = typeof propertyVisits.$inferSelect;
export type InsertPropertyVisit = z.infer<typeof insertPropertyVisitSchema>;
