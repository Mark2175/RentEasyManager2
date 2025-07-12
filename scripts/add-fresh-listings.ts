import { db } from "../server/db";
import { properties } from "../shared/schema";

async function addFreshListings() {
  console.log("Adding fresh property listings...");
  
  // Get current time
  const now = new Date();
  
  // Create properties with different timestamps
  const freshProperties = [
    {
      propertyId: "RE628373050",
      landlordId: 2,
      title: "Brand New 2BHK in Koramangala",
      description: "Newly constructed 2BHK apartment with modern amenities, ready to move in.",
      area: "Koramangala",
      city: "Bangalore",
      propertyType: "Apartment",
      rent: "28000",
      sqft: 1200,
      bedrooms: 2,
      bathrooms: 2,
      amenities: ["Parking", "Lift", "Security", "Gym", "Swimming Pool"],
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500"],
      isAvailable: true,
      hasVirtualTour: true,
      createdAt: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
      updatedAt: new Date(now.getTime() - 30 * 60 * 1000),
    },
    {
      propertyId: "RE628373051",
      landlordId: 4,
      title: "Luxury 1BHK in Indiranagar",
      description: "Premium 1BHK with all modern amenities and prime location.",
      area: "Indiranagar",
      city: "Bangalore",
      propertyType: "Apartment",
      rent: "35000",
      sqft: 800,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ["AC", "Parking", "Security", "Lift", "Gym"],
      images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500"],
      isAvailable: true,
      hasVirtualTour: true,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    },
    {
      propertyId: "RE628373052",
      landlordId: 6,
      title: "Spacious 3BHK in Whitefield",
      description: "Large 3BHK with garden view and excellent connectivity.",
      area: "Whitefield",
      city: "Bangalore",
      propertyType: "Apartment",
      rent: "42000",
      sqft: 1800,
      bedrooms: 3,
      bathrooms: 2,
      amenities: ["Garden", "Parking", "Security", "Lift", "Playground"],
      images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500"],
      isAvailable: true,
      hasVirtualTour: false,
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
      updatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    },
    {
      propertyId: "RE628373053",
      landlordId: 8,
      title: "Cozy Studio in BTM Layout",
      description: "Perfect studio apartment for young professionals.",
      area: "BTM Layout",
      city: "Bangalore",
      propertyType: "Studio",
      rent: "18000",
      sqft: 600,
      bedrooms: 1,
      bathrooms: 1,
      amenities: ["Parking", "Security", "Lift"],
      images: ["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=500"],
      isAvailable: true,
      hasVirtualTour: false,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    }
  ];

  try {
    for (const property of freshProperties) {
      await db.insert(properties).values(property);
      console.log(`Added property: ${property.title}`);
    }
    console.log("Fresh listings added successfully!");
  } catch (error) {
    console.error("Error adding fresh listings:", error);
  }
}

// Run the function
addFreshListings();