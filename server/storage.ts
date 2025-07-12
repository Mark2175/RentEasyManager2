import { 
  users, properties, bookings, payments, referrals, services, localBusinesses, neighborhoodEvents,
  type User, type InsertUser, type Property, type InsertProperty, type Booking, type InsertBooking,
  type Payment, type InsertPayment, type Referral, type InsertReferral, type Service, type InsertService,
  type LocalBusiness, type InsertLocalBusiness, type NeighborhoodEvent, type InsertNeighborhoodEvent
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByPhone(phoneNumber: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Property operations
  getProperty(id: number): Promise<Property | undefined>;
  getProperties(filters?: { area?: string; propertyType?: string; minRent?: number; maxRent?: number }): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, updates: Partial<Property>): Promise<Property | undefined>;

  // Booking operations
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByUser(userId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, updates: Partial<Booking>): Promise<Booking | undefined>;

  // Payment operations
  getPayment(id: number): Promise<Payment | undefined>;
  getPaymentsByUser(userId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, updates: Partial<Payment>): Promise<Payment | undefined>;

  // Referral operations
  getReferral(id: number): Promise<Referral | undefined>;
  getReferralsByUser(userId: number): Promise<Referral[]>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  updateReferral(id: number, updates: Partial<Referral>): Promise<Referral | undefined>;

  // Service operations
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;

  // Local business operations
  getLocalBusinesses(area?: string): Promise<LocalBusiness[]>;
  createLocalBusiness(business: InsertLocalBusiness): Promise<LocalBusiness>;

  // Neighborhood event operations
  getNeighborhoodEvents(area?: string): Promise<NeighborhoodEvent[]>;
  createNeighborhoodEvent(event: InsertNeighborhoodEvent): Promise<NeighborhoodEvent>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  private bookings: Map<number, Booking>;
  private payments: Map<number, Payment>;
  private referrals: Map<number, Referral>;
  private services: Map<number, Service>;
  private localBusinesses: Map<number, LocalBusiness>;
  private neighborhoodEvents: Map<number, NeighborhoodEvent>;
  private currentUserId: number;
  private currentPropertyId: number;
  private currentBookingId: number;
  private currentPaymentId: number;
  private currentReferralId: number;
  private currentServiceId: number;
  private currentLocalBusinessId: number;
  private currentNeighborhoodEventId: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.bookings = new Map();
    this.payments = new Map();
    this.referrals = new Map();
    this.services = new Map();
    this.localBusinesses = new Map();
    this.neighborhoodEvents = new Map();
    this.currentUserId = 1;
    this.currentPropertyId = 1;
    this.currentBookingId = 1;
    this.currentPaymentId = 1;
    this.currentReferralId = 1;
    this.currentServiceId = 1;
    this.currentLocalBusinessId = 1;
    this.currentNeighborhoodEventId = 1;

    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample users
    const sampleUsers = [
      { phoneNumber: '+919876543210', name: 'Rajesh Kumar', role: 'tenant', isVerified: true },
      { phoneNumber: '+919876543211', name: 'Priya Sharma', role: 'landlord', isVerified: true },
      { phoneNumber: '+919876543212', name: 'Amit Singh', role: 'broker', isVerified: true },
    ];

    sampleUsers.forEach(user => {
      const id = this.currentUserId++;
      this.users.set(id, {
        id,
        ...user,
        isVerified: user.isVerified || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // Sample properties
    const sampleProperties = [
      {
        propertyId: 'RE001234',
        landlordId: 2,
        title: '2BHK in Domlur',
        description: 'Spacious 2BHK apartment with all modern amenities',
        address: '123 Domlur Ring Road',
        city: 'Bangalore',
        area: 'Domlur',
        propertyType: '2BHK',
        rent: '35000',
        deposit: '105000',
        sqft: 1200,
        bedrooms: 2,
        bathrooms: 2,
        amenities: ['Parking', 'Gym', 'Pool', 'Security'],
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200'],
        isAvailable: true,
        hasVirtualTour: false,
      },
      {
        propertyId: 'RE001235',
        landlordId: 2,
        title: '3BHK Premium',
        description: 'Luxury 3BHK apartment in premium location',
        address: '456 Indiranagar Main Road',
        city: 'Bangalore',
        area: 'Indiranagar',
        propertyType: '3BHK',
        rent: '55000',
        deposit: '165000',
        sqft: 1500,
        bedrooms: 3,
        bathrooms: 2,
        amenities: ['Parking', 'Gym', 'Pool', 'Security', 'Garden'],
        images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200'],
        isAvailable: true,
        hasVirtualTour: true,
      },
    ];

    sampleProperties.forEach(property => {
      const id = this.currentPropertyId++;
      this.properties.set(id, {
        id,
        ...property,
        brokerId: null,
        tenantId: null,
        description: property.description || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // Sample local businesses
    const sampleBusinesses = [
      {
        name: 'Cafe Coffee Day',
        category: 'restaurant',
        address: 'Domlur Ring Road',
        area: 'Domlur',
        phone: '+919876543220',
        ratings: '4.2',
        isActive: true,
      },
      {
        name: 'Big Bazaar',
        category: 'grocery',
        address: 'Indiranagar Main Road',
        area: 'Indiranagar',
        phone: '+919876543221',
        ratings: '4.0',
        isActive: true,
      },
    ];

    sampleBusinesses.forEach(business => {
      const id = this.currentLocalBusinessId++;
      this.localBusinesses.set(id, {
        id,
        ...business,
        menu: null,
      });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByPhone(phoneNumber: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.phoneNumber === phoneNumber);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      isVerified: insertUser.isVerified || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Property operations
  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getProperties(filters?: { area?: string; propertyType?: string; minRent?: number; maxRent?: number }): Promise<Property[]> {
    let properties = Array.from(this.properties.values());
    
    if (filters?.area) {
      properties = properties.filter(p => p.area.toLowerCase().includes(filters.area!.toLowerCase()));
    }
    
    if (filters?.propertyType) {
      properties = properties.filter(p => p.propertyType === filters.propertyType);
    }
    
    if (filters?.minRent) {
      properties = properties.filter(p => parseFloat(p.rent) >= filters.minRent!);
    }
    
    if (filters?.maxRent) {
      properties = properties.filter(p => parseFloat(p.rent) <= filters.maxRent!);
    }
    
    return properties.filter(p => p.isAvailable);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.currentPropertyId++;
    const propertyId = `RE${String(id).padStart(6, '0')}`;
    
    const property: Property = {
      ...insertProperty,
      id,
      propertyId,
      description: insertProperty.description || null,
      city: insertProperty.city || 'Bangalore',
      landlordId: insertProperty.landlordId || null,
      brokerId: insertProperty.brokerId || null,
      tenantId: insertProperty.tenantId || null,
      sqft: insertProperty.sqft || null,
      bedrooms: insertProperty.bedrooms || null,
      bathrooms: insertProperty.bathrooms || null,
      amenities: insertProperty.amenities || null,
      images: insertProperty.images || null,
      isAvailable: insertProperty.isAvailable ?? true,
      hasVirtualTour: insertProperty.hasVirtualTour ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(id: number, updates: Partial<Property>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const updatedProperty = { ...property, ...updates, updatedAt: new Date() };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }

  // Booking operations
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.tenantId === userId);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = {
      ...insertBooking,
      id,
      status: insertBooking.status || 'pending',
      propertyId: insertBooking.propertyId || null,
      landlordId: insertBooking.landlordId || null,
      tenantId: insertBooking.tenantId || null,
      brokerageFee: insertBooking.brokerageFee || null,
      leaseStartDate: insertBooking.leaseStartDate || null,
      leaseEndDate: insertBooking.leaseEndDate || null,
      createdAt: new Date(),
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBooking(id: number, updates: Partial<Booking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, ...updates };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Payment operations
  async getPayment(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(payment => payment.userId === userId);
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.currentPaymentId++;
    const payment: Payment = {
      ...insertPayment,
      id,
      status: insertPayment.status || 'pending',
      bookingId: insertPayment.bookingId || null,
      userId: insertPayment.userId || null,
      paymentGateway: insertPayment.paymentGateway || null,
      transactionId: insertPayment.transactionId || null,
      createdAt: new Date(),
    };
    this.payments.set(id, payment);
    return payment;
  }

  async updatePayment(id: number, updates: Partial<Payment>): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;
    
    const updatedPayment = { ...payment, ...updates };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }

  // Referral operations
  async getReferral(id: number): Promise<Referral | undefined> {
    return this.referrals.get(id);
  }

  async getReferralsByUser(userId: number): Promise<Referral[]> {
    return Array.from(this.referrals.values()).filter(referral => referral.referrerId === userId);
  }

  async createReferral(insertReferral: InsertReferral): Promise<Referral> {
    const id = this.currentReferralId++;
    const referral: Referral = {
      ...insertReferral,
      id,
      status: insertReferral.status || 'pending',
      referrerId: insertReferral.referrerId || null,
      refereeId: insertReferral.refereeId || null,
      bonusAmount: insertReferral.bonusAmount || null,
      createdAt: new Date(),
    };
    this.referrals.set(id, referral);
    return referral;
  }

  async updateReferral(id: number, updates: Partial<Referral>): Promise<Referral | undefined> {
    const referral = this.referrals.get(id);
    if (!referral) return undefined;
    
    const updatedReferral = { ...referral, ...updates };
    this.referrals.set(id, updatedReferral);
    return updatedReferral;
  }

  // Service operations
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values()).filter(service => service.isActive);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.currentServiceId++;
    const service: Service = {
      ...insertService,
      id,
      description: insertService.description || null,
      price: insertService.price || null,
      providerId: insertService.providerId || null,
      isActive: insertService.isActive ?? true,
    };
    this.services.set(id, service);
    return service;
  }

  // Local business operations
  async getLocalBusinesses(area?: string): Promise<LocalBusiness[]> {
    let businesses = Array.from(this.localBusinesses.values()).filter(business => business.isActive);
    
    if (area) {
      businesses = businesses.filter(business => business.area.toLowerCase().includes(area.toLowerCase()));
    }
    
    return businesses;
  }

  async createLocalBusiness(insertBusiness: InsertLocalBusiness): Promise<LocalBusiness> {
    const id = this.currentLocalBusinessId++;
    const business: LocalBusiness = {
      ...insertBusiness,
      id,
      menu: insertBusiness.menu || null,
      isActive: insertBusiness.isActive ?? true,
      phone: insertBusiness.phone || null,
      ratings: insertBusiness.ratings || null,
    };
    this.localBusinesses.set(id, business);
    return business;
  }

  // Neighborhood event operations
  async getNeighborhoodEvents(area?: string): Promise<NeighborhoodEvent[]> {
    let events = Array.from(this.neighborhoodEvents.values()).filter(event => event.isActive);
    
    if (area) {
      events = events.filter(event => event.area.toLowerCase().includes(area.toLowerCase()));
    }
    
    return events.sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());
  }

  async createNeighborhoodEvent(insertEvent: InsertNeighborhoodEvent): Promise<NeighborhoodEvent> {
    const id = this.currentNeighborhoodEventId++;
    const event: NeighborhoodEvent = {
      ...insertEvent,
      id,
      description: insertEvent.description || null,
      isActive: insertEvent.isActive ?? true,
      organizerId: insertEvent.organizerId || null,
      createdAt: new Date(),
    };
    this.neighborhoodEvents.set(id, event);
    return event;
  }
}

export const storage = new MemStorage();
