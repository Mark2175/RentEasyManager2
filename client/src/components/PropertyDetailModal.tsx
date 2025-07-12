import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Bed, Bath, Square, Eye, Heart, ChevronLeft, ChevronRight, X, User, Building, Phone, Mail, Star } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface PropertyDetailModalProps {
  property: any;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ property, isOpen, onClose }) => {
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useUser();
  
  if (!property) return null;

  const handleWishlistToggle = () => {
    if (isInWishlist(property.id)) {
      removeFromWishlist(property.id);
    } else {
      addToWishlist(property);
    }
  };

  const formatRent = (rent: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(rent);
  };

  // Virtual tour images with room labels
  const virtualTourImages = [
    {
      url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
      title: "Living Room",
      description: "Spacious living area with modern furnishings"
    },
    {
      url: "https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
      title: "Kitchen",
      description: "Fully equipped modern kitchen with appliances"
    },
    {
      url: "https://images.unsplash.com/photo-1540518614846-7eded47ee437?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
      title: "Bedroom",
      description: "Comfortable bedroom with natural lighting"
    },
    {
      url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
      title: "Bathroom",
      description: "Modern bathroom with premium fixtures"
    },
    {
      url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
      title: "Balcony",
      description: "Private balcony with city views"
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % virtualTourImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + virtualTourImages.length) % virtualTourImages.length);
  };

  const startVirtualTour = () => {
    console.log("Starting virtual tour for property:", property);
    setShowVirtualTour(true);
    setCurrentImageIndex(0);
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
          
          {/* Landlord/Broker Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800">Listed by</h4>
              <Badge variant={property.brokerId ? "secondary" : "default"} className={property.brokerId ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}>
                {property.brokerId ? "Broker" : "Owner"}
              </Badge>
            </div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-rent-accent text-white p-2 rounded-full">
                {property.brokerId ? <Building className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div>
                <p className="font-medium text-gray-800">{property.brokerId ? property.brokerName || 'Professional Broker' : property.landlordName || 'Property Owner'}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  <span>4.8 (120 reviews)</span>
                </div>
              </div>
            </div>
            
            {property.brokerId && property.brokerageFee && (
              <div className="bg-yellow-50 p-3 rounded-lg mb-3">
                <p className="text-sm text-yellow-800">
                  <strong>Brokerage Fee:</strong> ₹{property.brokerageFee.toLocaleString()}
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Includes property viewing, documentation assistance, and negotiation support
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-rent-accent border-rent-accent"
                onClick={() => {
                  const phoneNumber = property.brokerId ? "+91 98765 43210" : "+91 98765 43211";
                  window.location.href = `tel:${phoneNumber}`;
                }}
              >
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-rent-accent border-rent-accent"
                onClick={() => {
                  const message = `Hi, I'm interested in the property ${property.title} (${property.propertyId}) in ${property.area}. Can you please share more details?`;
                  const phoneNumber = property.brokerId ? "+919876543210" : "+919876543211";
                  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
                }}
              >
                <Mail className="h-4 w-4 mr-1" />
                Message
              </Button>
            </div>
          </div>

          {/* Services Offered */}
          <div className="bg-rent-blue p-4 rounded-lg">
            <h4 className="font-semibold text-rent-accent mb-3">Services Available</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center text-rent-accent">
                <div className="w-2 h-2 bg-rent-accent rounded-full mr-2"></div>
                Home Cleaning
              </div>
              <div className="flex items-center text-rent-accent">
                <div className="w-2 h-2 bg-rent-accent rounded-full mr-2"></div>
                Moving Services
              </div>
              <div className="flex items-center text-rent-accent">
                <div className="w-2 h-2 bg-rent-accent rounded-full mr-2"></div>
                Maintenance
              </div>
              <div className="flex items-center text-rent-accent">
                <div className="w-2 h-2 bg-rent-accent rounded-full mr-2"></div>
                Nearby Restaurants
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-4">
            <div>
              <div className="text-2xl font-bold text-rent-accent">{formatRent(property.rent)}</div>
              <div className="text-sm text-gray-600">per month</div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleWishlistToggle}
                className={isInWishlist(property.id) ? "bg-red-50 text-red-600 border-red-200" : ""}
              >
                <Heart className={`h-4 w-4 mr-1 ${isInWishlist(property.id) ? 'fill-red-600' : ''}`} />
                {isInWishlist(property.id) ? 'Saved' : 'Save'}
              </Button>
              {property.hasVirtualTour && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-rent-blue text-rent-accent"
                  onClick={startVirtualTour}
                >
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
      
      {/* Virtual Tour Modal */}
      {showVirtualTour && (
        <Dialog open={showVirtualTour} onOpenChange={setShowVirtualTour}>
          <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
            <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={() => setShowVirtualTour(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              {/* Virtual Tour Header */}
              <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-3">
                <h3 className="text-white font-semibold">{virtualTourImages[currentImageIndex].title}</h3>
                <p className="text-white/80 text-sm">{virtualTourImages[currentImageIndex].description}</p>
                <div className="text-white/60 text-xs mt-1">
                  {currentImageIndex + 1} of {virtualTourImages.length}
                </div>
              </div>
              
              {/* Main image */}
              <img
                src={virtualTourImages[currentImageIndex].url}
                alt={virtualTourImages[currentImageIndex].title}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation buttons */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              
              {/* Room navigation dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {virtualTourImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'bg-white' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
              
              {/* Room selector */}
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-2">
                <div className="flex space-x-2">
                  {virtualTourImages.map((room, index) => (
                    <Button
                      key={index}
                      variant={index === currentImageIndex ? "default" : "ghost"}
                      size="sm"
                      className={`text-xs ${
                        index === currentImageIndex 
                          ? 'bg-white text-black' 
                          : 'text-white hover:bg-white/20'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      {room.title}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};

export default PropertyDetailModal;
