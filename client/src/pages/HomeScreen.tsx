import React, { useState } from 'react';
import { Search, Camera, Users, Wrench, Bell, X, Clock, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PropertyCard from '@/components/PropertyCard';
import ProfileVerificationModal from '@/components/ProfileVerificationModal';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface HomeScreenProps {
  onNavigate?: (screen: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const { userProfile } = useAuth();
  const { setSelectedProperty, setShowPropertyModal, wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useUser();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [pendingBookingProperty, setPendingBookingProperty] = useState<any>(null);

  const { data: properties, isLoading } = useQuery({
    queryKey: ['/api/properties'],
    queryFn: async () => {
      const response = await fetch('/api/properties');
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    },
  });

  // Mock user ID for notifications (in real app, this would come from auth context)
  const mockUserId = 8;

  const { data: notifications = [], refetch: refetchNotifications } = useQuery({
    queryKey: ['/api/notifications', mockUserId],
    queryFn: async () => {
      const response = await fetch(`/api/notifications/${mockUserId}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return response.json();
    },
  });

  const { data: unreadCount = 0, refetch: refetchUnreadCount } = useQuery({
    queryKey: ['/api/notifications', mockUserId, 'unread-count'],
    queryFn: async () => {
      const response = await fetch(`/api/notifications/${mockUserId}/unread-count`);
      if (!response.ok) throw new Error('Failed to fetch unread count');
      const data = await response.json();
      return data.count;
    },
  });

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'property': return '🏠';
      case 'booking': return '📋';
      case 'service': return '🛠️';
      default: return '📢';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleViewProperty = (property: any) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
  };

  const handleVirtualTour = (property: any) => {
    console.log("Virtual tour clicked for property:", property);
    // Create a virtual tour modal without opening property details
    const virtualTourModal = document.createElement('div');
    virtualTourModal.innerHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onclick="this.remove()">
        <div class="relative max-w-4xl w-full h-[80vh] bg-black rounded-lg overflow-hidden" onclick="event.stopPropagation()">
          <button class="absolute top-4 right-4 z-10 text-white bg-black/50 hover:bg-black/75 rounded-full p-2" onclick="this.closest('.fixed').remove()">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <div class="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-3">
            <h3 class="text-white font-semibold">${property.title}</h3>
            <p class="text-white/80 text-sm">Virtual Tour</p>
          </div>
          <div class="w-full h-full flex items-center justify-center">
            <div class="relative w-full h-full">
              <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800" 
                   alt="Living Room" class="w-full h-full object-cover virtual-tour-image" data-room="0">
              <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                <button class="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm" onclick="previousRoom()">← Previous</button>
                <span class="bg-white/20 text-white px-3 py-1 rounded-full text-sm room-indicator">Living Room (1/5)</span>
                <button class="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm" onclick="nextRoom()">Next →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(virtualTourModal);
    
    // Add navigation functionality
    const rooms = [
      { name: "Living Room", url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800" },
      { name: "Kitchen", url: "https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800" },
      { name: "Bedroom", url: "https://images.unsplash.com/photo-1540518614846-7eded47ee437?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800" },
      { name: "Bathroom", url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800" },
      { name: "Balcony", url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800" }
    ];
    
    let currentRoom = 0;
    
    window.nextRoom = () => {
      currentRoom = (currentRoom + 1) % rooms.length;
      updateRoom();
    };
    
    window.previousRoom = () => {
      currentRoom = (currentRoom - 1 + rooms.length) % rooms.length;
      updateRoom();
    };
    
    function updateRoom() {
      const image = virtualTourModal.querySelector('.virtual-tour-image');
      const indicator = virtualTourModal.querySelector('.room-indicator');
      image.src = rooms[currentRoom].url;
      image.alt = rooms[currentRoom].name;
      indicator.textContent = `${rooms[currentRoom].name} (${currentRoom + 1}/${rooms.length})`;
    }
  };

  const handleWishlistToggle = (property: any) => {
    if (isInWishlist(property.id)) {
      removeFromWishlist(property.id);
    } else {
      addToWishlist(property);
    }
  };

  const handleBookNow = async (property: any) => {
    const userId = userProfile?.id || 8; // Use authenticated user ID or fallback
    
    try {
      // Check if user profile is complete for booking
      const response = await fetch(`/api/users/${userId}/booking-eligibility`);
      const eligibilityData = await response.json();
      
      if (!eligibilityData.isEligible) {
        // Show verification modal if profile is incomplete
        setPendingBookingProperty(property);
        setShowVerificationModal(true);
        return;
      }
      
      if (!eligibilityData.documentsVerified) {
        alert('Your documents are under verification. You can book properties once verification is complete (usually within 24 hours).');
        return;
      }
      
      // Profile is complete and verified, proceed with booking
      if (onNavigate) {
        onNavigate('booking');
      }
    } catch (error) {
      console.error('Error checking booking eligibility:', error);
      alert('Unable to check profile status. Please try again.');
    }
  };

  const handleBookVisit = async (property: any) => {
    // Create a visit booking modal
    const visitModal = document.createElement('div');
    visitModal.innerHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="this.remove()">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4" onclick="event.stopPropagation()">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Book Property Visit</h3>
            <button class="text-gray-400 hover:text-gray-600" onclick="this.closest('.fixed').remove()">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="mb-4">
            <h4 class="font-medium">${property.title}</h4>
            <p class="text-sm text-gray-600">${property.area}, ${property.city}</p>
            <p class="text-sm text-gray-600">Property ID: ${property.propertyId}</p>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
              <input type="date" class="w-full p-2 border rounded-lg" min="${new Date().toISOString().split('T')[0]}" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
              <select class="w-full p-2 border rounded-lg">
                <option value="">Select time</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="17:00">5:00 PM</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Your Phone Number</label>
              <input type="tel" class="w-full p-2 border rounded-lg" placeholder="Enter your phone number" value="${userProfile?.phoneNumber || ''}" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
              <textarea class="w-full p-2 border rounded-lg" rows="3" placeholder="Any specific requirements or questions?"></textarea>
            </div>
          </div>
          
          <div class="flex gap-3 mt-6">
            <button class="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300" onclick="this.closest('.fixed').remove()">
              Cancel
            </button>
            <button class="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700" onclick="handleVisitBooking()">
              Book Visit
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(visitModal);
    
    // Handle visit booking
    window.handleVisitBooking = async () => {
      const dateInput = visitModal.querySelector('input[type="date"]');
      const timeSelect = visitModal.querySelector('select');
      const phoneInput = visitModal.querySelector('input[type="tel"]');
      const notesTextarea = visitModal.querySelector('textarea');
      
      if (!dateInput.value || !timeSelect.value || !phoneInput.value) {
        alert('Please fill in all required fields');
        return;
      }
      
      try {
        // Check for conflicts first
        const conflictResponse = await fetch('/api/property-visits/check-conflicts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: dateInput.value,
            time: timeSelect.value,
            landlordId: property.landlordId,
            brokerId: property.brokerId
          })
        });
        
        const conflictData = await conflictResponse.json();
        
        if (conflictData.hasConflict) {
          alert('This time slot is already booked. Please select a different time.');
          return;
        }
        
        // Create the visit booking
        const visitData = {
          propertyId: property.id,
          tenantId: userProfile?.id || 8, // Default to test user
          landlordId: property.landlordId,
          brokerId: property.brokerId,
          scheduledDate: dateInput.value,
          scheduledTime: timeSelect.value,
          tenantPhone: phoneInput.value,
          notes: notesTextarea.value || null
        };
        
        const response = await fetch('/api/property-visits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(visitData)
        });
        
        const visit = await response.json();
        
        // Show success message
        visitModal.innerHTML = `
          <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onclick="this.remove()">
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-center" onclick="event.stopPropagation()">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold mb-2">Visit Scheduled!</h3>
              <p class="text-gray-600 mb-4">Your property visit has been scheduled for ${dateInput.value} at ${timeSelect.options[timeSelect.selectedIndex].text}</p>
              <p class="text-sm text-gray-500 mb-4">Visit ID: ${visit.visitId}</p>
              <p class="text-sm text-gray-500 mb-6">You will receive a confirmation call on ${phoneInput.value}</p>
              <p class="text-xs text-gray-400 mb-6">Landlord and broker have been notified automatically</p>
              <button class="bg-orange-600 text-white py-2 px-6 rounded-lg hover:bg-orange-700" onclick="this.closest('.fixed').remove()">
                Got it!
              </button>
            </div>
          </div>
        `;
        
      } catch (error) {
        console.error('Error booking visit:', error);
        alert('Failed to book visit. Please try again.');
      }
    };
  };

  const handleReferFriends = () => {
    const referralCode = `RENT${userProfile?.id || '2024'}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const referralMessage = `🏠 Join RentEasy Solutions with my referral code: ${referralCode}

💰 Pay brokerage once, get FREE services:
• Moving & Packing services
• Property maintenance  
• 24/7 support
• Legal documentation

🎉 You'll get ₹500 cashback on your first booking!
📱 Download: ${window.location.origin}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'RentEasy Solutions - Referral',
        text: referralMessage,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(referralMessage).then(() => {
        alert(`Referral code ${referralCode} copied to clipboard! Share it with your friends.`);
      }).catch(() => {
        alert(`Your referral code: ${referralCode}\n\nShare this message:\n${referralMessage}`);
      });
    }
  };

  const quickActions = [
    { icon: Search, label: 'Search', color: 'bg-rent-blue', action: 'properties' },
    { icon: DollarSign, label: 'Pricing', color: 'bg-rent-blue', action: 'pricing' },
    { icon: Users, label: 'Refer Friends', color: 'bg-rent-blue', action: 'refer' },
    { icon: Wrench, label: 'Services', color: 'bg-rent-blue', action: 'services' },
  ];

  const mockProperties = [
    {
      id: '1',
      propertyId: 'RE001234',
      title: '2BHK in Domlur',
      area: 'Domlur',
      city: 'Bangalore',
      propertyType: '2BHK',
      rent: 35000,
      sqft: 1200,
      bedrooms: 2,
      bathrooms: 2,
      floor: '3rd Floor',
      securityPersonAvailable: true,
      isAvailable: true,
      hasVirtualTour: false,
      amenities: ['Parking', 'Gym', 'Pool', 'Security'],
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200'],
    },
    {
      id: '2',
      propertyId: 'RE001235',
      title: '3BHK Premium',
      area: 'Indiranagar',
      city: 'Bangalore',
      propertyType: '3BHK',
      rent: 55000,
      sqft: 1500,
      bedrooms: 3,
      bathrooms: 2,
      floor: '7th Floor',
      securityPersonAvailable: true,
      isAvailable: true,
      hasVirtualTour: true,
      amenities: ['Parking', 'Gym', 'Pool', 'Security', 'Garden'],
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200'],
    },
  ];

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-rent-blue px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-rent-accent">
              Welcome, {userProfile?.name || 'User'}
            </h1>
            <p className="text-gray-600 text-sm">Find your perfect home in Bangalore</p>
          </div>
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-auto"
              onClick={toggleNotifications}
            >
              <Bell className="h-6 w-6 text-rent-accent" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute top-10 right-0 w-80 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="p-1 h-auto"
                    onClick={() => setShowNotifications(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification: any) => (
                      <div 
                        key={notification.id} 
                        className={`p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                          !notification.isRead ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-lg">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm text-gray-900">
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <Badge className="bg-blue-500 text-white text-xs">New</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Clock className="h-3 w-3" />
                              {formatTimeAgo(notification.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {notifications.length > 0 && (
                  <div className="p-3 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="w-full text-blue-600"
                      onClick={async () => {
                        try {
                          // Mark all notifications as read
                          await apiRequest("POST", `/api/notifications/${userProfile?.id || 8}/mark-all-read`);
                          // Refetch both notifications and unread count
                          refetchNotifications();
                          refetchUnreadCount();
                          setShowNotifications(false);
                        } catch (error) {
                          console.error('Failed to mark all notifications as read:', error);
                        }
                      }}
                    >
                      Mark all as read
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* USP Banner */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg mb-4 shadow-md">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-full p-1">
              <Wrench className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-sm">RentEasy Advantage</p>
              <p className="text-xs opacity-90">Pay brokerage, get moving & maintenance services FREE!</p>
            </div>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search by location, property type..."
            className="w-full px-4 py-3 pl-12 bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-rent-accent focus:border-transparent"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="mx-6 my-4 bg-white shadow-sm">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-4">
            {quickActions.map(({ icon: Icon, label, color, action }, index) => (
              <div 
                key={index} 
                className="text-center cursor-pointer"
                onClick={() => {
                  if (action === 'refer') {
                    handleReferFriends();
                  } else if (action && onNavigate) {
                    onNavigate(action);
                  }
                }}
              >
                <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mx-auto mb-2 hover:scale-105 transition-transform`}>
                  <Icon className="h-5 w-5 text-rent-accent" />
                </div>
                <span className="text-xs text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Featured Properties */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Featured Properties</h2>
          <Button variant="link" className="text-rent-accent text-sm font-medium p-0">
            View All
          </Button>
        </div>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            (properties || mockProperties).map((property: any) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={handleViewProperty}
                onVirtualTour={handleVirtualTour}
                onWishlistToggle={handleWishlistToggle}
                onBookNow={handleBookNow}
                onBookVisit={(property) => handleBookVisit(property)}
                isInWishlist={isInWishlist(property.id)}
              />
            ))
          )}
        </div>
      </div>
      
      {/* Profile Verification Modal */}
      <ProfileVerificationModal
        isOpen={showVerificationModal}
        onClose={() => {
          setShowVerificationModal(false);
          setPendingBookingProperty(null);
        }}
        userId={userProfile?.id || 8}
        onComplete={() => {
          // After verification is complete, proceed with booking
          if (pendingBookingProperty && onNavigate) {
            onNavigate('booking-flow');
          }
        }}
      />
    </div>
  );
};

export default HomeScreen;
