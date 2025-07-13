import React from 'react';
import { MapPin, Bed, Bath, Square, Eye, Heart, User, Building, Info, Shield, Home, Calendar, ArrowRightLeft, Check, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useComparison } from '@/contexts/ComparisonContext';

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
    floor?: string;
    securityPersonAvailable?: boolean;
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
    createdAt?: string;
    updatedAt?: string;
  };
  onViewDetails: (property: any) => void;
  onVirtualTour?: (property: any) => void;
  onStartVirtualTour?: (propertyId: string) => void;
  onWishlistToggle: (property: any) => void;
  onBookNow?: (property: any) => void;
  onBookVisit?: (property: any) => void;
  isInWishlist: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onViewDetails, onVirtualTour, onWishlistToggle, onBookNow, onBookVisit, onStartVirtualTour, isInWishlist }) => {
  const { addToComparison, removeFromComparison, isInComparison, canAddMore } = useComparison();
  const formatRent = (rent: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(rent);
  };

  const getFreshnessBadge = () => {
    if (!property.createdAt && !property.updatedAt) return null;
    
    const now = new Date();
    const createdAt = new Date(property.createdAt || '');
    const updatedAt = new Date(property.updatedAt || '');
    const mostRecentDate = updatedAt > createdAt ? updatedAt : createdAt;
    
    const timeDiff = now.getTime() - mostRecentDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
    
    if (daysDiff === 0 && hoursDiff < 24) {
      if (hoursDiff < 1) return { text: "Just Listed", color: "bg-green-500 text-white", isNew: true };
      if (hoursDiff < 6) return { text: "Listed Today", color: "bg-green-500 text-white", isNew: true };
      return { text: "Listed Today", color: "bg-green-400 text-white", isNew: true };
    }
    
    if (daysDiff === 1) return { text: "Listed Yesterday", color: "bg-blue-500 text-white", isNew: true };
    if (daysDiff <= 3) return { text: `${daysDiff} days ago`, color: "bg-blue-400 text-white", isNew: true };
    if (daysDiff <= 7) return { text: `${daysDiff} days ago`, color: "bg-orange-400 text-white", isNew: false };
    if (daysDiff <= 30) return { text: `${daysDiff} days ago`, color: "bg-gray-400 text-white", isNew: false };
    
    return null;
  };

  const freshnessBadge = getFreshnessBadge();

  return (
    <TooltipProvider>
      <Card className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200">
        <div className="relative" onClick={() => onViewDetails(property)}>
          <img 
            src={property.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200"} 
            alt={property.title}
            className="w-full h-48 object-cover"
          />
          
          {/* Wishlist and Compare Buttons */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="bg-white/80 hover:bg-white/90 text-gray-700 p-2"
              onClick={(e) => {
                e.stopPropagation();
                onWishlistToggle(property);
              }}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              className="bg-white/80 hover:bg-white/90 text-gray-700 p-2"
              onClick={(e) => {
                e.stopPropagation();
                if (isInComparison(property.id)) {
                  removeFromComparison(property.id);
                } else if (canAddMore) {
                  addToComparison(property);
                }
              }}
              disabled={!canAddMore && !isInComparison(property.id)}
            >
              {isInComparison(property.id) ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowRightLeft className="h-4 w-4 text-gray-600" />
              )}
            </Button>
          </div>
          
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {freshnessBadge && (
              <Badge className={`${freshnessBadge.color} font-medium ${freshnessBadge.isNew ? 'animate-pulse' : ''}`}>
                {freshnessBadge.text}
              </Badge>
            )}
            {property.brokerId && (
              <Badge className="bg-green-500 text-white font-medium">
                FREE Services
              </Badge>
            )}
            <Badge variant={property.isAvailable ? "default" : "secondary"} className="bg-green-100 text-green-800">
              {property.isAvailable ? "Available" : "Occupied"}
            </Badge>
            {property.hasVirtualTour && (
              <Badge 
                variant="outline" 
                className="bg-yellow-100 text-yellow-800 cursor-pointer hover:bg-yellow-200"
                onClick={(e) => {
                  e.stopPropagation();
                  onStartVirtualTour?.(property.id);
                }}
              >
                <Camera className="h-3 w-3 mr-1" />
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
                      <div className="bg-green-50 border border-green-200 rounded p-2 mt-2">
                        <p className="text-green-700 font-semibold text-sm">🎯 RentEasy Advantage:</p>
                        <p className="text-green-600 text-sm">Pay brokerage, get these services FREE:</p>
                        <p className="text-green-600 text-xs">• Moving & packing service</p>
                        <p className="text-green-600 text-xs">• Property maintenance</p>
                        <p className="text-green-600 text-xs">• Legal documentation</p>
                        <p className="text-green-600 text-xs">• 24/7 support</p>
                      </div>
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
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-rent-accent">{formatRent(property.rent)}/month</span>
            {freshnessBadge && freshnessBadge.isNew && (
              <Badge className="bg-red-500 text-white text-xs px-2 py-1 animate-pulse">
                NEW
              </Badge>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-2">
          Property ID: {property.propertyId}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{property.area}, {property.city}</span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
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
        
        {/* Floor and Security Information */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          {property.floor && (
            <span className="flex items-center">
              <Home className="h-4 w-4 mr-1" />
              {property.floor}
            </span>
          )}
          <span className="flex items-center">
            <Shield className={`h-4 w-4 mr-1 ${property.securityPersonAvailable ? 'text-green-600' : 'text-red-500'}`} />
            <span className={property.securityPersonAvailable ? 'text-green-600' : 'text-red-500'}>
              {property.securityPersonAvailable ? 'Security Available' : 'No Security'}
            </span>
          </span>
        </div>
        
        {/* Action Buttons - Always Visible & Prominent */}
        <div className="bg-rent-accent/5 -mx-4 -mb-4 p-4 border-t-2 border-rent-accent/20">
          <div className="flex gap-2 justify-center flex-wrap">
            {property.hasVirtualTour && (
              <Button 
                size="default" 
                variant="outline" 
                className="bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100 font-semibold px-3 py-2 shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onVirtualTour?.(property);
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Virtual Tour
              </Button>
            )}
            <Button 
              size="default" 
              className="bg-blue-600 text-white hover:bg-blue-700 font-semibold px-4 py-2 shadow-md transform hover:scale-105 transition-all duration-200 border-0"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(property);
              }}
            >
              View Details
            </Button>
            {property.isAvailable && (
              <>
                <Button 
                  size="default" 
                  className="bg-orange-600 text-white hover:bg-orange-700 font-semibold px-4 py-2 shadow-md transform hover:scale-105 transition-all duration-200 border-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookVisit?.(property);
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Visit
                </Button>
                <Button 
                  size="default" 
                  className="bg-green-600 text-white hover:bg-green-700 font-semibold px-4 py-2 shadow-md transform hover:scale-105 transition-all duration-200 border-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookNow?.(property);
                  }}
                >
                  Book Now
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    </TooltipProvider>
  );
};

export default PropertyCard;
