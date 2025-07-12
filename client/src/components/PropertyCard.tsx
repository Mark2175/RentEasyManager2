import React from 'react';
import { MapPin, Bed, Bath, Square, Eye, Heart, User, Building, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    landlordId?: number;
    brokerId?: number;
    landlordName?: string;
    brokerName?: string;
    brokerageFee?: number;
    description?: string;
  };
  onViewDetails: (property: any) => void;
  onVirtualTour?: (property: any) => void;
  onWishlistToggle: (property: any) => void;
  isInWishlist: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onViewDetails, onVirtualTour, onWishlistToggle, isInWishlist }) => {
  const formatRent = (rent: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(rent);
  };

  return (
    <TooltipProvider>
      <Card className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div className="relative" onClick={() => onViewDetails(property)}>
          <img 
            src={property.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200"} 
            alt={property.title}
            className="w-full h-48 object-cover"
          />
          
          {/* Wishlist Button */}
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-4 left-4 bg-white/80 hover:bg-white/90 text-gray-700 p-2"
            onClick={(e) => {
              e.stopPropagation();
              onWishlistToggle(property);
            }}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
          
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Badge variant={property.isAvailable ? "default" : "secondary"} className="bg-green-100 text-green-800">
              {property.isAvailable ? "Available" : "Occupied"}
            </Badge>
            {property.hasVirtualTour && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                Virtual Tour
              </Badge>
            )}
          </div>
          
          {/* Property Type Badge */}
          <div className="absolute bottom-4 left-4">
            <Badge variant="secondary" className="bg-rent-accent text-white">
              {property.propertyType}
            </Badge>
          </div>
          
          {/* Listing Type & Fees Info */}
          <div className="absolute bottom-4 right-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2 text-white text-xs flex items-center gap-1">
                  {property.brokerId ? (
                    <>
                      <Building className="h-3 w-3" />
                      <span>Broker</span>
                    </>
                  ) : (
                    <>
                      <User className="h-3 w-3" />
                      <span>Owner</span>
                    </>
                  )}
                  <Info className="h-3 w-3" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  {property.brokerId ? (
                    <div>
                      <p><strong>Listed by:</strong> {property.brokerName || 'Broker'}</p>
                      {property.brokerageFee && (
                        <p><strong>Brokerage Fee:</strong> ₹{property.brokerageFee.toLocaleString()}</p>
                      )}
                      <p className="text-yellow-600 mt-1">• Property viewing assistance</p>
                      <p className="text-yellow-600">• Documentation help</p>
                      <p className="text-yellow-600">• Negotiation support</p>
                    </div>
                  ) : (
                    <div>
                      <p><strong>Listed by:</strong> {property.landlordName || 'Owner'}</p>
                      <p><strong>No Brokerage Fee</strong></p>
                      <p className="text-green-600 mt-1">• Direct contact with owner</p>
                      <p className="text-green-600">• No extra charges</p>
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
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
                onClick={() => onVirtualTour?.(property)}
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
    </TooltipProvider>
  );
};

export default PropertyCard;
