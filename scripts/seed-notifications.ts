import { db } from '../server/db';
import { notifications } from '../shared/schema';

async function seedNotifications() {
  console.log('Seeding notifications...');
  
  // Sample notifications for user ID 8 (Swati Saxena - tenant)
  const sampleNotifications = [
    {
      userId: 8,
      title: "New Property Available",
      message: "A new 2BHK apartment is now available in your preferred area - HSR Layout. Check it out!",
      type: "property",
      isRead: false,
      relatedId: 7,
    },
    {
      userId: 8,
      title: "Booking Request Update",
      message: "Your booking request for property RE628373001 has been approved by the landlord. Payment is due in 24 hours.",
      type: "booking",
      isRead: false,
      relatedId: 1,
    },
    {
      userId: 8,
      title: "Free Service Scheduled",
      message: "Your complimentary moving service is scheduled for tomorrow at 10:00 AM. Our team will contact you 1 hour before arrival.",
      type: "service",
      isRead: false,
      relatedId: null,
    },
    {
      userId: 8,
      title: "Welcome to RentEasy!",
      message: "Welcome to RentEasy Solutions! Don't forget - when you pay brokerage through us, you get moving and maintenance services completely FREE!",
      type: "system",
      isRead: true,
      relatedId: null,
    },
    {
      userId: 8,
      title: "Maintenance Request Completed",
      message: "Your maintenance request for plumbing repair has been completed. Rate your experience to help us improve our services.",
      type: "service",
      isRead: true,
      relatedId: null,
    },
  ];

  try {
    await db.insert(notifications).values(sampleNotifications);
    console.log('✅ Notifications seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding notifications:', error);
  }
}

seedNotifications().catch(console.error);