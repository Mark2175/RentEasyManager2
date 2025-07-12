import React, { useState } from 'react';
import { Search, SlidersHorizontal, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PropertyCard from '@/components/PropertyCard';
import { useUser } from '@/contexts/UserContext';
import { useQuery } from '@tanstack/react-query';

const PropertiesScreen: React.FC = () => {
  const { setSelectedProperty, setShowPropertyModal, searchFilters, setSearchFilters, wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useUser();
  const [selectedType, setSelectedType] = useState('');

  const { data: properties, isLoading } = useQuery({
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

  const handleViewProperty = (property: any) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
  };

  const handleVirtualTour = (property: any) => {
    console.log("Virtual tour clicked for property:", property);
    setSelectedProperty(property);
    setShowPropertyModal(true);
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
