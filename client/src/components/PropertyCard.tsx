import React from 'react';
import { MapPin, Bed, Bath, Square, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PropertyCardProps {
  property: {
    id: string;
    propertyId: string;
    title: string;
    area: string;
    city: string;
    propertyType: string;
    rent: number;
    sqft?: number;
    bedrooms?: number;
    bathrooms?: number;
    images?: string[];
    isAvailable: boolean;
    hasVirtualTour: boolean;
    amenities?: string[];
  };
  onViewDetails: (property: any) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onViewDetails }) => {
  const formatRent = (rent: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(rent);
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="relative">
        <img 
          src={property.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200"} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-rent-accent text-white">
            {property.propertyType}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant={property.isAvailable ? "default" : "secondary"} className="bg-green-100 text-green-800">
            {property.isAvailable ? "Available" : "Occupied"}
          </Badge>
        </div>
        {property.hasVirtualTour && (
          <div className="absolute top-12 right-4">
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              Virtual Tour
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800">{property.title}</h3>
          <span className="text-lg font-bold text-rent-accent">{formatRent(property.rent)}/month</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-2">
          Property ID: {property.propertyId}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{property.area}, {property.city}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {property.bedrooms && (
              <span className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                {property.bedrooms} Bed
              </span>
            )}
            {property.bathrooms && (
              <span className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                {property.bathrooms} Bath
              </span>
            )}
            {property.sqft && (
              <span className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                {property.sqft} sq ft
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            {property.hasVirtualTour && (
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-rent-blue text-rent-accent border-rent-accent"
              >
                <Eye className="h-4 w-4 mr-1" />
                Virtual Tour
              </Button>
            )}
            <Button 
              size="sm" 
              className="bg-rent-accent text-white hover:bg-blue-700"
              onClick={() => onViewDetails(property)}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
