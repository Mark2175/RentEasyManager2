import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Heart, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PropertyCard from '@/components/PropertyCard';
import ProfileVerificationModal from '@/components/ProfileVerificationModal';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';

interface PropertiesScreenProps {
  onNavigate?: (screen: string) => void;
}

const PropertiesScreen: React.FC<PropertiesScreenProps> = ({ onNavigate }) => {
  const { userProfile } = useAuth();
  const { setSelectedProperty, setShowPropertyModal, searchFilters, setSearchFilters, wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useUser();
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [pendingBookingProperty, setPendingBookingProperty] = useState<any>(null);

  const { data: allProperties, isLoading } = useQuery({
    queryKey: ['/api/properties', searchFilters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchFilters.area) params.append('area', searchFilters.area);
      if (searchFilters.propertyType) params.append('type', searchFilters.propertyType);
      if (searchFilters.minRent) params.append('minRent', searchFilters.minRent.toString());
      if (searchFilters.maxRent) params.append('maxRent', searchFilters.maxRent.toString());
      
      const response = await fetch(`/api/properties?${params}`);
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    },
  });

  const sortedProperties = useMemo(() => {
    if (!allProperties) return [];
    
    const sorted = [...allProperties].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || b.updatedAt).getTime() - new Date(a.createdAt || a.updatedAt).getTime();
        case 'oldest':
          return new Date(a.createdAt || a.updatedAt).getTime() - new Date(b.createdAt || b.updatedAt).getTime();
        case 'price-low':
          return parseInt(a.rent) - parseInt(b.rent);
        case 'price-high':
          return parseInt(b.rent) - parseInt(a.rent);
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [allProperties, sortBy]);

  const properties = sortedProperties;

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
              <input type="tel" class="w-full p-2 border rounded-lg" placeholder="Enter your phone number" />
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
          tenantId: 8, // Default to test user
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

  const propertyTypes = ['1BHK', '2BHK', '3BHK', '4BHK+'];

  const mockProperties = [
    {
      id: '1',
      propertyId: 'RE001236',
      title: 'Modern Studio Apartment',
      area: 'Koramangala',
      city: 'Bangalore',
      propertyType: '1BHK',
      rent: 25000,
      sqft: 600,
      bedrooms: 1,
      bathrooms: 1,
      floor: '5th Floor',
      securityPersonAvailable: true,
      isAvailable: true,
      hasVirtualTour: true,
      amenities: ['Parking', 'Gym', 'Security'],
      images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200'],
    },
    {
      id: '2',
      propertyId: 'RE001237',
      title: 'Spacious Family Home',
      area: 'Whitefield',
      city: 'Bangalore',
      propertyType: '3BHK',
      rent: 45000,
      sqft: 1400,
      bedrooms: 3,
      bathrooms: 2,
      floor: 'Ground Floor',
      securityPersonAvailable: false,
      isAvailable: true,
      hasVirtualTour: false,
      amenities: ['Parking', 'Garden', 'Security', 'Playground'],
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200'],
    },
  ];

  return (
    <div className="pb-20">
      <div className="bg-rent-blue px-6 py-4">
        <h1 className="text-xl font-bold text-rent-accent mb-4">Properties</h1>
        
        {/* Search Filters */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Location..."
              value={searchFilters.area}
              onChange={(e) => setSearchFilters({ ...searchFilters, area: e.target.value })}
              className="flex-1 px-4 py-2 bg-white rounded-lg text-sm"
            />
            <Button size="sm" variant="outline" className="bg-white px-4 py-2 rounded-lg">
              <SlidersHorizontal className="h-4 w-4 text-rent-accent" />
            </Button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {propertyTypes.map((type) => (
              <Button
                key={type}
                size="sm"
                variant={selectedType === type ? "default" : "outline"}
                className={`whitespace-nowrap ${
                  selectedType === type
                    ? 'bg-rent-accent text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => {
                  setSelectedType(selectedType === type ? '' : type);
                  setSearchFilters({ ...searchFilters, propertyType: selectedType === type ? '' : type });
                }}
              >
                {type}
              </Button>
            ))}
          </div>
          
          {/* Sorting Options */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {properties?.length || 0} properties found
            </span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-white">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">🟢 Newest First</SelectItem>
                <SelectItem value="oldest">⚪ Oldest First</SelectItem>
                <SelectItem value="price-low">💰 Price: Low to High</SelectItem>
                <SelectItem value="price-high">💎 Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Property Listings */}
      <div className="px-6 py-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {(properties || mockProperties).map((property: any) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={handleViewProperty}
                onVirtualTour={handleVirtualTour}
                onWishlistToggle={handleWishlistToggle}
                onBookNow={async (property) => {
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
                    setSelectedProperty(property);
                    onNavigate && onNavigate('booking-flow');
                  } catch (error) {
                    console.error('Error checking booking eligibility:', error);
                    alert('Unable to check profile status. Please try again.');
                  }
                }}
                onBookVisit={(property) => handleBookVisit(property)}
                isInWishlist={isInWishlist(property.id)}
              />
            ))}
          </div>
        )}
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
          if (pendingBookingProperty) {
            setSelectedProperty(pendingBookingProperty);
            onNavigate && onNavigate('booking-flow');
          }
        }}
      />
    </div>
  );
};

export default PropertiesScreen;
