import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Square, Eye, Heart } from 'lucide-react';

interface PropertyDetailModalProps {
  property: any;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ property, isOpen, onClose }) => {
  if (!property) return null;

  const formatRent = (rent: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(rent);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Property Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <img 
            src={property.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"} 
            alt={property.title}
            className="w-full h-64 object-cover rounded-lg"
          />
          
          <div>
            <h3 className="text-xl font-bold text-gray-800">{property.title}</h3>
            <p className="text-gray-600">Property ID: {property.propertyId}</p>
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{property.area}, {property.city}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 py-4 border-t border-b">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-800">{property.bedrooms || 'N/A'}</div>
              <div className="text-sm text-gray-600">Bedrooms</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-800">{property.bathrooms || 'N/A'}</div>
              <div className="text-sm text-gray-600">Bathrooms</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-800">{property.sqft || 'N/A'}</div>
              <div className="text-sm text-gray-600">sq ft</div>
            </div>
          </div>
          
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity: string, index: number) => (
                  <Badge key={index} variant="secondary" className="bg-rent-blue text-rent-accent">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between py-4">
            <div>
              <div className="text-2xl font-bold text-rent-accent">{formatRent(property.rent)}</div>
              <div className="text-sm text-gray-600">per month</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-1" />
                Save
              </Button>
              {property.hasVirtualTour && (
                <Button variant="outline" size="sm" className="bg-rent-blue text-rent-accent">
                  <Eye className="h-4 w-4 mr-1" />
                  Virtual Tour
                </Button>
              )}
              <Button className="bg-rent-accent text-white hover:bg-blue-700">
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailModal;
