import React from 'react';
import { Search, Camera, Users, Wrench, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PropertyCard from '@/components/PropertyCard';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { useQuery } from '@tanstack/react-query';

const HomeScreen: React.FC = () => {
  const { userProfile } = useAuth();
  const { setSelectedProperty, setShowPropertyModal, wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useUser();

  const { data: properties, isLoading } = useQuery({
    queryKey: ['/api/properties'],
    queryFn: async () => {
      const response = await fetch('/api/properties');
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    },
  });

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

  const quickActions = [
    { icon: Search, label: 'Search', color: 'bg-rent-blue' },
    { icon: Camera, label: 'Virtual Tour', color: 'bg-rent-blue' },
    { icon: Users, label: 'Refer Friends', color: 'bg-rent-blue' },
    { icon: Wrench, label: 'Services', color: 'bg-rent-blue' },
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
            <Bell className="h-6 w-6 text-rent-accent" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
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
            {quickActions.map(({ icon: Icon, label, color }, index) => (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
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
                isInWishlist={isInWishlist(property.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
