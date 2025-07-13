import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Heart, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PropertyCard from '@/components/PropertyCard';
import { useUser } from '@/contexts/UserContext';
import { useQuery } from '@tanstack/react-query';

interface PropertiesScreenProps {
  onNavigate?: (screen: string) => void;
}

const PropertiesScreen: React.FC<PropertiesScreenProps> = ({ onNavigate }) => {
  const { setSelectedProperty, setShowPropertyModal, searchFilters, setSearchFilters, wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useUser();
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('newest');

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
                onBookNow={(property) => {
                  setSelectedProperty(property);
                  onNavigate && onNavigate('booking-flow');
                }}
                isInWishlist={isInWishlist(property.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesScreen;
