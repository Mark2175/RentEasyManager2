import { db } from '../server/db';
import { users, properties, services, localBusinesses, neighborhoodEvents } from '../shared/schema';

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Generate 50 sample users
    const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Kavya', 'Ravi', 'Meera', 'Suresh', 'Deepika', 'Arjun', 'Lakshmi', 'Kiran', 'Pooja', 'Manoj', 'Nisha', 'Sanjay', 'Divya', 'Ramesh', 'Swati', 'Anil', 'Preeti', 'Rohit', 'Anita', 'Vimal', 'Shobha', 'Girish', 'Usha', 'Naveen', 'Rekha', 'Ashok', 'Sunita', 'Mahesh', 'Prabha', 'Dinesh', 'Sushma', 'Ranjit', 'Latha', 'Mohan', 'Gayathri', 'Venkat', 'Suma', 'Santosh', 'Vaani', 'Prakash', 'Jyoti', 'Harish', 'Padma', 'Srinivas', 'Bhavana'];
    const lastNames = ['Kumar', 'Sharma', 'Patel', 'Reddy', 'Gupta', 'Singh', 'Agarwal', 'Jain', 'Nair', 'Iyer', 'Rao', 'Varma', 'Shetty', 'Menon', 'Bhatt', 'Shah', 'Chopra', 'Kapoor', 'Bansal', 'Aggarwal', 'Malhotra', 'Saxena', 'Arora', 'Bhatia', 'Joshi', 'Khanna', 'Mittal', 'Goel', 'Singhal', 'Goyal'];
    const areas = ['Koramangala', 'Whitefield', 'HSR Layout', 'Indiranagar', 'Marathahalli', 'Electronic City', 'Bellandur', 'Sarjapur', 'Jayanagar', 'Rajajinagar', 'Banashankari', 'BTM Layout', 'Malleshwaram', 'Yelahanka', 'Hebbal', 'JP Nagar', 'Bommanahalli', 'Domlur', 'CV Raman Nagar', 'Mahadevapura'];
    const userTypes = ['tenant', 'landlord', 'broker', 'admin'];
    
    const sampleUsers = [];
    for (let i = 0; i < 50; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const area = areas[Math.floor(Math.random() * areas.length)];
      const userType = userTypes[Math.floor(Math.random() * userTypes.length)];
      
      sampleUsers.push({
        phoneNumber: `+9198765${String(43210 + i).padStart(5, '0')}`,
        fullName: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
        userType: userType as 'tenant' | 'landlord' | 'broker' | 'admin',
        isVerified: Math.random() > 0.2, // 80% verified
        address: `${Math.floor(Math.random() * 999) + 1} ${area}, Bangalore`,
        aadhaarNumber: userType === 'landlord' ? `${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}` : null,
        panNumber: userType === 'landlord' ? `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9000) + 1000}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}` : null,
        bankAccount: userType === 'landlord' ? `${['HDFC', 'ICICI', 'SBI', 'AXIS', 'KOTAK'][Math.floor(Math.random() * 5)]}-${Math.floor(Math.random() * 90000) + 10000}` : null,
        firebaseUid: `user-${i + 1}`
      });
    }

    console.log('Creating users...');
    const createdUsers = await db.insert(users).values(sampleUsers).returning();
    console.log(`Created ${createdUsers.length} users`);

    // Generate 50 sample properties
    const propertyTypes = ['Apartment', 'Villa', 'House', 'Studio', 'Penthouse'];
    const propertyTitles = ['Spacious', 'Modern', 'Cozy', 'Luxury', 'Premium', 'Elegant', 'Contemporary', 'Beautiful', 'Comfortable', 'Furnished'];
    const bhkTypes = ['1BHK', '2BHK', '3BHK', '4BHK', 'Studio'];
    const amenitiesList = [
      ['Parking', 'Security', 'Lift'],
      ['Gym', 'Swimming Pool', 'Parking', 'Security'],
      ['Garden', 'Parking', 'Security', 'Power Backup'],
      ['Club House', 'Gym', 'Swimming Pool', 'Parking', 'Security'],
      ['Lift', 'Security', 'Water Supply', 'Parking'],
      ['Balcony', 'Parking', 'Security', 'Gym'],
      ['Terrace', 'Garden', 'Parking', 'Security'],
      ['Swimming Pool', 'Gym', 'Parking', 'Security', 'Lift'],
      ['Power Backup', 'Security', 'Parking', 'Lift'],
      ['Furnished', 'AC', 'Parking', 'Security']
    ];
    
    const propertyImages = [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=500',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=500',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500'
    ];
    
    const landlords = createdUsers.filter(user => user.userType === 'landlord');
    const brokers = createdUsers.filter(user => user.userType === 'broker');
    
    const sampleProperties = [];
    const baseTime = Date.now();
    
    for (let i = 0; i < 50; i++) {
      const bhkType = bhkTypes[Math.floor(Math.random() * bhkTypes.length)];
      const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const titlePrefix = propertyTitles[Math.floor(Math.random() * propertyTitles.length)];
      const area = areas[Math.floor(Math.random() * areas.length)];
      const amenitySet = amenitiesList[Math.floor(Math.random() * amenitiesList.length)];
      const landlord = landlords[Math.floor(Math.random() * landlords.length)];
      const broker = Math.random() > 0.7 ? brokers[Math.floor(Math.random() * brokers.length)] : null;
      
      // Generate realistic rent based on BHK and area
      let baseRent = 15000;
      if (bhkType === '2BHK') baseRent = 25000;
      if (bhkType === '3BHK') baseRent = 35000;
      if (bhkType === '4BHK') baseRent = 50000;
      if (bhkType === 'Studio') baseRent = 12000;
      
      // Premium areas get higher rent
      const premiumAreas = ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout'];
      if (premiumAreas.includes(area)) {
        baseRent *= 1.3;
      }
      
      const rent = Math.floor(baseRent + (Math.random() * 10000 - 5000));
      const bedrooms = bhkType === 'Studio' ? 0 : parseInt(bhkType.charAt(0));
      const bathrooms = Math.max(1, bedrooms);
      const sqft = bhkType === 'Studio' ? 400 + Math.floor(Math.random() * 200) : 
                   bedrooms * 500 + Math.floor(Math.random() * 300);
      
      sampleProperties.push({
        propertyId: `RE${String(baseTime).slice(-6)}${String(i + 1).padStart(3, '0')}`,
        title: `${titlePrefix} ${bhkType} in ${area}`,
        area: area,
        city: 'Bangalore',
        propertyType: propertyType,
        rent: rent.toString(),
        description: `${titlePrefix} ${bhkType} ${propertyType.toLowerCase()} with ${amenitySet.join(', ').toLowerCase()}. Perfect for ${bhkType === 'Studio' || bhkType === '1BHK' ? 'professionals' : 'families'}.`,
        sqft: sqft,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        landlordId: landlord?.id || null,
        brokerId: broker?.id || null,
        amenities: amenitySet,
        images: [propertyImages[Math.floor(Math.random() * propertyImages.length)]],
        isAvailable: Math.random() > 0.15, // 85% available
        hasVirtualTour: Math.random() > 0.6 // 40% have virtual tours
      });
    }

    console.log('Creating properties...');
    const createdProperties = await db.insert(properties).values(sampleProperties).returning();
    console.log(`Created ${createdProperties.length} properties`);

    // Generate 50 sample services
    const serviceCategories = ['moving', 'maintenance', 'cleaning', 'painting'];
    const serviceNames = {
      moving: ['Express Packers', 'Quick Movers', 'Safe Transport', 'City Packers', 'Home Shifters', 'Professional Movers', 'Reliable Packers', 'Swift Movers', 'Secure Transport', 'Easy Relocate', 'Budget Movers', 'Premium Packers', 'Fast Track Movers'],
      maintenance: ['Home Repairs', 'Fix It Fast', 'Handy Services', 'Quick Fix', 'Home Care', 'Repair Pro', 'Maintenance Masters', 'Service Plus', 'Home Doctor', 'Fix Master', 'Skilled Hands', 'Repair Zone', 'Home Solutions'],
      cleaning: ['Deep Clean', 'Sparkle Services', 'Clean Pro', 'Fresh Clean', 'Perfect Clean', 'Shine Bright', 'Clean Masters', 'Hygiene Plus', 'Crystal Clean', 'Pure Clean', 'Eco Clean', 'Premium Clean', 'Clean Zone'],
      painting: ['Color Magic', 'Paint Pro', 'Wall Art', 'Perfect Paint', 'Color Craft', 'Paint Masters', 'Brush Works', 'Paint Zone', 'Color Express', 'Paint Plus', 'Artistic Paint', 'Color Pro', 'Paint Perfect']
    };
    
    const providers = createdUsers.filter(user => user.userType === 'broker' || user.userType === 'admin');
    const sampleServices = [];
    
    for (let i = 0; i < 50; i++) {
      const category = serviceCategories[Math.floor(Math.random() * serviceCategories.length)];
      const nameOptions = serviceNames[category];
      const serviceName = nameOptions[Math.floor(Math.random() * nameOptions.length)];
      const provider = Math.random() > 0.3 ? providers[Math.floor(Math.random() * providers.length)] : null;
      
      // Generate realistic pricing based on category
      let basePrice = 1000;
      if (category === 'moving') basePrice = 3000 + Math.floor(Math.random() * 7000);
      if (category === 'maintenance') basePrice = 500 + Math.floor(Math.random() * 3000);
      if (category === 'cleaning') basePrice = 1000 + Math.floor(Math.random() * 4000);
      if (category === 'painting') basePrice = 2000 + Math.floor(Math.random() * 8000);
      
      sampleServices.push({
        name: serviceName,
        category: category,
        description: `Professional ${category} services with experienced team. ${category === 'moving' ? 'Safe and secure relocation' : category === 'maintenance' ? 'Quick repairs and maintenance' : category === 'cleaning' ? 'Deep cleaning and sanitization' : 'Quality painting and finishing'}.`,
        price: basePrice.toString(),
        providerId: provider?.id || null,
        isActive: Math.random() > 0.1 // 90% active
      });
    }

    console.log('Creating services...');
    const createdServices = await db.insert(services).values(sampleServices).returning();
    console.log(`Created ${createdServices.length} services`);

    // Generate 50 sample local businesses
    const businessCategories = ['restaurant', 'grocery', 'pharmacy', 'gym', 'salon', 'laundry', 'bakery', 'electronics', 'clothing', 'medical'];
    const businessNames = {
      restaurant: ['Spice Garden', 'Taste Buds', 'Food Corner', 'Curry House', 'Biryani Express', 'South Flavors', 'Meal Masters', 'Cafe Central', 'Dosa Point', 'Thali House', 'Quick Bites', 'Royal Kitchen', 'Street Food Hub'],
      grocery: ['Fresh Mart', 'Daily Needs', 'Super Store', 'Grocery Plus', 'Quick Shop', 'Family Store', 'Corner Shop', 'Big Basket Store', 'Fresh Choice', 'Local Mart', 'Value Store', 'Neighborhood Store', 'Easy Shop'],
      pharmacy: ['Health Plus', 'Med Store', 'Care Pharmacy', 'Life Pharmacy', 'Wellness Store', 'Quick Meds', 'Health Hub', 'Medical Store', 'Pharmacy Express', 'Drug Store', 'Health Care', 'Meds Plus', 'Remedy Store'],
      gym: ['Fitness Zone', 'Power Gym', 'Muscle Factory', 'Fit Club', 'Body Builders', 'Strength Studio', 'Workout Place', 'Fitness First', 'Iron Gym', 'Flex Fitness', 'Energy Gym', 'Fit World', 'Active Gym'],
      salon: ['Style Studio', 'Beauty Parlor', 'Glamour Salon', 'Hair Studio', 'Beauty Zone', 'Style Point', 'Makeover Studio', 'Beauty Hub', 'Elegant Salon', 'Charm Beauty', 'Pretty Salon', 'Beauty Express', 'Style Craft'],
      laundry: ['Quick Wash', 'Clean Express', 'Laundry Plus', 'Wash & Go', 'Fresh Laundry', 'Dry Clean Pro', 'Wash Master', 'Clean Zone', 'Laundry Hub', 'Spotless Clean', 'Wash Point', 'Clean Care', 'Fresh & Clean'],
      bakery: ['Sweet Treats', 'Bread Basket', 'Cake Corner', 'Fresh Bakes', 'Oven Fresh', 'Sweet Delights', 'Bakery Plus', 'Pastry Shop', 'Bread Point', 'Sweet Spot', 'Cake House', 'Bake Well', 'Sweet Corner'],
      electronics: ['Tech Store', 'Gadget Shop', 'Electronics Hub', 'Digital World', 'Tech Zone', 'Smart Store', 'Gadget Plus', 'Electronic Express', 'Tech Point', 'Digital Store', 'Gadget Corner', 'Tech Mart', 'Electronic World'],
      clothing: ['Fashion Store', 'Style Shop', 'Trendy Clothes', 'Fashion Hub', 'Dress Point', 'Style Zone', 'Fashion Express', 'Clothing Plus', 'Trendy Store', 'Fashion Corner', 'Style Mart', 'Dress Shop', 'Fashion World'],
      medical: ['Health Clinic', 'Medical Center', 'Care Clinic', 'Health Point', 'Medical Hub', 'Wellness Clinic', 'Health Care', 'Medical Express', 'Care Center', 'Health Zone', 'Medical Point', 'Clinic Plus', 'Health Hub']
    };
    
    const roadNames = ['Main Road', 'Ring Road', 'Cross Street', 'Park Road', 'Market Street', 'Church Road', 'Station Road', 'Bus Stand Road', 'Temple Street', 'School Road'];
    const sampleBusinesses = [];
    
    for (let i = 0; i < 50; i++) {
      const category = businessCategories[Math.floor(Math.random() * businessCategories.length)];
      const nameOptions = businessNames[category];
      const businessName = nameOptions[Math.floor(Math.random() * nameOptions.length)];
      const area = areas[Math.floor(Math.random() * areas.length)];
      const roadName = roadNames[Math.floor(Math.random() * roadNames.length)];
      const ratings = 3.0 + Math.random() * 2.0; // 3.0 to 5.0 rating
      
      sampleBusinesses.push({
        name: businessName,
        category: category,
        area: area,
        address: `${Math.floor(Math.random() * 999) + 1} ${roadName}, ${area}`,
        phone: `+9198765${String(54000 + i).padStart(5, '0')}`,
        ratings: Math.round(ratings * 10) / 10,
        isActive: Math.random() > 0.05 // 95% active
      });
    }

    console.log('Creating local businesses...');
    const createdBusinesses = await db.insert(localBusinesses).values(sampleBusinesses).returning();
    console.log(`Created ${createdBusinesses.length} local businesses`);

    // Generate 50 sample neighborhood events
    const eventTypes = ['Festival', 'Meetup', 'Workshop', 'Sports', 'Cultural', 'Community', 'Health', 'Tech', 'Food', 'Art'];
    const eventNames = {
      Festival: ['Food Festival', 'Cultural Festival', 'Music Festival', 'Art Festival', 'Street Festival', 'Community Festival', 'Heritage Festival', 'Dance Festival', 'Craft Festival', 'Literary Festival'],
      Meetup: ['Tech Meetup', 'Professional Meetup', 'Startup Meetup', 'Business Meetup', 'Creative Meetup', 'Social Meetup', 'Networking Meetup', 'Career Meetup', 'Learning Meetup', 'Hobby Meetup'],
      Workshop: ['Cooking Workshop', 'Art Workshop', 'Tech Workshop', 'Craft Workshop', 'Photography Workshop', 'Music Workshop', 'Dance Workshop', 'Writing Workshop', 'Business Workshop', 'Skill Workshop'],
      Sports: ['Cricket Tournament', 'Football Match', 'Badminton Tournament', 'Tennis Competition', 'Running Marathon', 'Cycling Race', 'Swimming Competition', 'Basketball Tournament', 'Volleyball Match', 'Table Tennis'],
      Cultural: ['Cultural Show', 'Dance Performance', 'Music Concert', 'Drama Performance', 'Classical Music', 'Folk Dance', 'Theater Show', 'Poetry Reading', 'Cultural Exchange', 'Traditional Show'],
      Community: ['Community Cleanup', 'Tree Plantation', 'Blood Donation', 'Charity Drive', 'Awareness Campaign', 'Community Service', 'Volunteer Drive', 'Social Initiative', 'Community Garden', 'Neighborhood Meet'],
      Health: ['Health Checkup', 'Fitness Session', 'Yoga Class', 'Meditation Workshop', 'Health Awareness', 'Exercise Class', 'Wellness Camp', 'Mental Health Talk', 'Nutrition Workshop', 'Fitness Challenge'],
      Tech: ['Tech Talk', 'Coding Workshop', 'AI Seminar', 'Startup Pitch', 'Innovation Meet', 'Tech Conference', 'Hackathon', 'Digital Workshop', 'Tech Demo', 'Programming Contest'],
      Food: ['Food Tasting', 'Cooking Competition', 'Street Food Fair', 'Recipe Contest', 'Food Truck Festival', 'Culinary Show', 'Food Drive', 'Cooking Class', 'Baking Contest', 'Food Market'],
      Art: ['Art Exhibition', 'Painting Workshop', 'Sculpture Display', 'Photography Show', 'Craft Fair', 'Art Competition', 'Creative Workshop', 'Art Gallery', 'Design Contest', 'Art Class']
    };
    
    const organizers = createdUsers.filter(user => user.userType === 'admin' || user.userType === 'broker');
    const sampleEvents = [];
    
    for (let i = 0; i < 50; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const nameOptions = eventNames[eventType];
      const eventName = nameOptions[Math.floor(Math.random() * nameOptions.length)];
      const area = areas[Math.floor(Math.random() * areas.length)];
      const organizer = Math.random() > 0.4 ? organizers[Math.floor(Math.random() * organizers.length)] : null;
      
      // Generate event dates from 1 day to 90 days in the future
      const daysInFuture = Math.floor(Math.random() * 90) + 1;
      const eventDate = new Date(Date.now() + daysInFuture * 24 * 60 * 60 * 1000);
      
      sampleEvents.push({
        title: `${area} ${eventName}`,
        area: area,
        eventDate: eventDate,
        description: `Join us for ${eventName.toLowerCase()} in ${area}. ${eventType === 'Festival' ? 'A celebration of local culture and community' : eventType === 'Meetup' ? 'Network with like-minded people' : eventType === 'Workshop' ? 'Learn new skills and techniques' : eventType === 'Sports' ? 'Participate in exciting sports activities' : eventType === 'Cultural' ? 'Experience rich cultural traditions' : eventType === 'Community' ? 'Contribute to community development' : eventType === 'Health' ? 'Focus on health and wellness' : eventType === 'Tech' ? 'Explore latest technology trends' : eventType === 'Food' ? 'Enjoy delicious food and beverages' : 'Express your creativity through art'}.`,
        organizerId: organizer?.id || null,
        isActive: Math.random() > 0.1 // 90% active
      });
    }

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