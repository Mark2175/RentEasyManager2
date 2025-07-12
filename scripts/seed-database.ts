import { db } from '../server/db';
import { users, properties, services, localBusinesses, neighborhoodEvents } from '../shared/schema';

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Sample users
    const sampleUsers = [
      {
        phoneNumber: '+919876543210',
        fullName: 'Rajesh Kumar',
        email: 'rajesh@email.com',
        userType: 'landlord' as const,
        isVerified: true,
        address: 'Koramangala, Bangalore',
        aadhaarNumber: '1234-5678-9012',
        panNumber: 'ABCDE1234F',
        bankAccount: 'HDFC-12345',
        firebaseUid: 'user-1'
      },
      {
        phoneNumber: '+919876543211',
        fullName: 'Priya Sharma',
        email: 'priya@email.com',
        userType: 'tenant' as const,
        isVerified: true,
        address: 'Whitefield, Bangalore',
        firebaseUid: 'user-2'
      },
      {
        phoneNumber: '+919876543212',
        fullName: 'Amit Patel',
        email: 'amit@email.com',
        userType: 'broker' as const,
        isVerified: true,
        address: 'HSR Layout, Bangalore',
        firebaseUid: 'user-3'
      }
    ];

    console.log('Creating users...');
    const createdUsers = await db.insert(users).values(sampleUsers).returning();
    console.log(`Created ${createdUsers.length} users`);

    // Sample properties
    const sampleProperties = [
      {
        propertyId: `RE${Date.now().toString().slice(-6)}001`,
        title: 'Spacious 2BHK in Koramangala',
        area: 'Koramangala',
        city: 'Bangalore',
        propertyType: 'Apartment',
        rent: '25000',
        description: 'Beautiful 2BHK apartment with modern amenities',
        sqft: 1200,
        bedrooms: 2,
        bathrooms: 2,
        landlordId: createdUsers[0].id,
        amenities: ['Parking', 'Gym', 'Swimming Pool'],
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500'],
        isAvailable: true,
        hasVirtualTour: true
      },
      {
        propertyId: `RE${Date.now().toString().slice(-6)}002`,
        title: 'Modern 3BHK in Whitefield',
        area: 'Whitefield',
        city: 'Bangalore',
        propertyType: 'Villa',
        rent: '40000',
        description: 'Luxurious 3BHK villa with garden',
        sqft: 1800,
        bedrooms: 3,
        bathrooms: 3,
        landlordId: createdUsers[0].id,
        amenities: ['Garden', 'Parking', 'Security'],
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
        isAvailable: true,
        hasVirtualTour: false
      },
      {
        propertyId: `RE${Date.now().toString().slice(-6)}003`,
        title: 'Cozy 1BHK in HSR Layout',
        area: 'HSR Layout',
        city: 'Bangalore',
        propertyType: 'Apartment',
        rent: '18000',
        description: 'Perfect for young professionals',
        sqft: 800,
        bedrooms: 1,
        bathrooms: 1,
        landlordId: createdUsers[0].id,
        amenities: ['Parking', 'Security'],
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500'],
        isAvailable: true,
        hasVirtualTour: true
      }
    ];

    console.log('Creating properties...');
    const createdProperties = await db.insert(properties).values(sampleProperties).returning();
    console.log(`Created ${createdProperties.length} properties`);

    // Sample services
    const sampleServices = [
      {
        name: 'Express Packers & Movers',
        category: 'moving',
        description: 'Professional packing and moving services',
        price: '5000',
        isActive: true
      },
      {
        name: 'Quick Home Repairs',
        category: 'maintenance',
        description: 'Home maintenance and repair services',
        price: '2000',
        isActive: true
      },
      {
        name: 'Deep Cleaning Services',
        category: 'cleaning',
        description: 'Professional deep cleaning for homes',
        price: '3000',
        isActive: true
      }
    ];

    console.log('Creating services...');
    const createdServices = await db.insert(services).values(sampleServices).returning();
    console.log(`Created ${createdServices.length} services`);

    // Sample local businesses
    const sampleBusinesses = [
      {
        name: 'Koramangala Cafe',
        category: 'restaurant',
        area: 'Koramangala',
        address: '123 Main Street, Koramangala',
        phone: '+919876543220',
        ratings: 4.5,
        isActive: true
      },
      {
        name: 'Whitefield Grocery Store',
        category: 'grocery',
        area: 'Whitefield',
        address: '456 Market Road, Whitefield',
        phone: '+919876543221',
        ratings: 4.2,
        isActive: true
      },
      {
        name: 'HSR Fitness Center',
        category: 'gym',
        area: 'HSR Layout',
        address: '789 Fitness Street, HSR Layout',
        phone: '+919876543222',
        ratings: 4.8,
        isActive: true
      }
    ];

    console.log('Creating local businesses...');
    const createdBusinesses = await db.insert(localBusinesses).values(sampleBusinesses).returning();
    console.log(`Created ${createdBusinesses.length} local businesses`);

    // Sample neighborhood events
    const sampleEvents = [
      {
        title: 'Koramangala Food Festival',
        area: 'Koramangala',
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        description: 'Annual food festival with local vendors',
        isActive: true
      },
      {
        title: 'Whitefield Tech Meetup',
        area: 'Whitefield',
        eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        description: 'Monthly tech meetup for professionals',
        isActive: true
      },
      {
        title: 'HSR Yoga in the Park',
        area: 'HSR Layout',
        eventDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        description: 'Free yoga session in the community park',
        isActive: true
      }
    ];

    console.log('Creating neighborhood events...');
    const createdEvents = await db.insert(neighborhoodEvents).values(sampleEvents).returning();
    console.log(`Created ${createdEvents.length} neighborhood events`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();